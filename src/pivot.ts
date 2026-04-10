import { ItemValue, Question } from "survey-core";
import { SelectBase } from "./selectBase";
import { createCommercialLicenseLink } from "./utils";
import { ICalculationResult, VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { VisualizationManager } from "./visualizationManager";
import { HistogramModel } from "./histogram";
import { EditableSeriesListWidget } from "./utils/editableSeriesListWidget";
import { IAxisDescription } from "./axisDescription";
import { ToggleWidget } from "./utils/toggle";
import { createDropdown } from "./utils/dropdownWidget";
import { DocumentHelper } from "./utils/documentHelper";

/**
 * Defines configuration options for a pivot chart series.
 *
 * Assign an array of `IPivotSeriesOptions` objects to the [`visualizer.series`](/dashboard/documentation/api-reference/IPivotVisualizerOptions#series) property to define chart series.
 *
 * [View Demo](/dashboard/examples/household-income-analysis-pivot-chart/ (linkStyle))
 */
export interface IPivotSeriesOptions {
  /**
   * The data field whose values are aggregated and plotted on the Y axis. If not specified, the [`seriesField`](#seriesField) is used.
   */
  valueField?: string;
  /**
   * The data field whose values define individual series and appear in the legend.
   */
  seriesField?: string;
  /**
   * The aggregation function applied to [`valueField`](#valueField).
   *
   * Supported values:
   *
   * - `"count"` (default)
   * - `"sum"`
   */
  aggregation?: "sum" | "count";
  /**
   * The Y axis to which this series is bound. Applies only when [`useSecondaryYAxis`](/dashboard/documentation/api-reference/IPivotVisualizerOptions#useSecondaryYAxis) is `true`.
   *
   * Supported values:
   *
   * - `"primary"`
   * - `"secondary"`
   */
  yAxis?: "primary" | "secondary";
}

/**
 * Defines configuration options for a pivot chart visualizer.
 *
 * [View Demo](/dashboard/examples/household-income-analysis-pivot-chart/ (linkStyle))
 */
export interface IPivotVisualizerOptions {
  /**
   * An array of survey questions available for use in the pivot chart.
   *
   * To populate this array, instantiate a [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model), call its [`getAllQuestions()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#getAllQuestions) method, optionally filter the result, and assign it to this property.
   *
   * [View Demo](/dashboard/examples/household-income-analysis-pivot-chart/ (linkStyle))
   */
  questions?: Question[] | string[];
  /**
   * The data field whose values define categories on the X axis.
   */
  categoryField?: string;
  /**
   * [Series definitions](/dashboard/documentation/api-reference/IPivotSeriesOptions) for the pivot chart.
   */
  series?: IPivotSeriesOptions[];
  /**
   * The maximum number of series per axis.
   *
   * Default value: `undefined` (no limit)
   */
  maxSeriesCount?: number;
  /**
   * Specifies whether to display a secondary Y axis.
   *
   * Default value: `false`
   *
   * If you enable this option, use the [`series[].yAxis`](/dashboard/documentation/api-reference/IPivotSeriesOptions#yAxis) property to assign individual series to the secondary axis.
   */
  useSecondaryYAxis?: boolean;
}

function getQuestionName(question: Question | string): string {
  if(typeof question === "string") {
    return question;
  } else if(question instanceof Question) {
    return question.name;
  } else {
    return undefined;
  }
}

export class PivotModel extends HistogramModel {
  private _pivotContinuousData: Array<{ continuous: number, row: any }> = undefined;

  private axisXSelector: HTMLDivElement;
  public axisXQuestionName: string;
  private axisYSelectors: Array<HTMLDivElement> = [];
  // public axisYQuestionNames: Array<string> = []; // Leave getter?
  primaryYAxes: Array<IAxisDescription> = [];
  primaryYAxesSeriesListWidget: EditableSeriesListWidget;
  secondaryYAxes: Array<IAxisDescription> = [];
  secondaryYAxesSeriesListWidget: EditableSeriesListWidget;
  private _useSecondaryYAxis: boolean = false;
  private _savedSecondaryYAxes: Array<IAxisDescription> = [];
  private questionsY: Array<VisualizerBase> = [];
  private _questionDefinition: Question | null = null;
  private _aggregations: {[index: string]: string | ((acc: number, value: any) => number)} = {
    "count": (acc: number, value: any) => {
      return value !== undefined ? acc + 1 : acc;
    },
    "sum": (acc: number, value: any) => {
      const parsedFloat = parseFloat(value);
      return acc + (!Number.isNaN(parsedFloat) ? parsedFloat : 0);
    }
  };

  public get series(): IPivotSeriesOptions[] {
    const mapAxisToSeries = (axis: IAxisDescription, yAxis: "primary" | "secondary"): IPivotSeriesOptions => {
      const series = {
        seriesField: axis.dataName,
        valueField: axis.valueName || axis.dataName,
        aggregation: (axis?.aggregation as "sum" | "count") || "count",
        yAxis,
      };
      if(series.valueField === series.seriesField) {
        delete series.valueField;
      }
      return series;
    };

    return [
      ...this.primaryYAxes.map((axis) => mapAxisToSeries(axis, "primary")),
      ...this.secondaryYAxes.map((axis) => mapAxisToSeries(axis, "secondary")),
    ];
  }

  public set series(seriesOptions: IPivotSeriesOptions[]) {
    if(!Array.isArray(seriesOptions)) {
      return;
    }

    this.applySeriesOptions(seriesOptions);

    if(!!this.primaryYAxesSeriesListWidget) {
      this.primaryYAxesSeriesListWidget.setItems(this.primaryYAxes);
    }
    if(!!this.secondaryYAxesSeriesListWidget) {
      this.secondaryYAxesSeriesListWidget.setItems(this.secondaryYAxes);
    }

    if(this.secondaryYAxes.length > 0) {
      this._savedSecondaryYAxes = this.secondaryYAxes.map((axis) => ({ ...axis }));
      this._useSecondaryYAxis = true;
    }

    this.setupPivot();
  }

  public get categoryField(): string {
    return this.axisXQuestionName;
  }

  public set categoryField(fieldName: string) {
    if(!fieldName) {
      return;
    }
    this.axisXQuestionName = fieldName;
    this.setupPivot();
  }

  public getState(): any {
    const state = super.getState();
    state.categoryField = this.categoryField;
    state.series = this.series.map((series) => ({ ...series }));
    return state;
  }

  protected setStateCore(state: any): void {
    super.setStateCore(state);

    if(state?.categoryField !== undefined) {
      this.categoryField = state.categoryField;
    }

    if(state?.series !== undefined) {
      const serializedSeries = Array.isArray(state.series)
        ? state.series
        : Object.keys(state.series || {})
          .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
          .map((key) => state.series[key]);
      this.series = serializedSeries;
    }
  }

  private applySeriesOptions(seriesOptions: IPivotSeriesOptions[]): void {
    this.primaryYAxes = [];
    this.secondaryYAxes = [];

    seriesOptions.forEach((seriesOption) => {
      const normalizedOption: IPivotSeriesOptions = {
        valueField: seriesOption?.valueField,
        seriesField: seriesOption?.seriesField,
        aggregation: seriesOption?.aggregation || "count",
        yAxis: seriesOption?.yAxis || "primary",
      };

      const axis: IAxisDescription = {
        dataName: normalizedOption.seriesField,
        valueName: normalizedOption.valueField,
        aggregation: normalizedOption.aggregation,
      };

      if(normalizedOption.seriesField !== undefined && normalizedOption.valueField === undefined) {
        axis.valueName = normalizedOption.seriesField;
      }

      if(normalizedOption.yAxis === "secondary") {
        this.secondaryYAxes.push(axis);
      } else {
        this.primaryYAxes.push(axis);
      }
    });
  }

  private getQuestionSeriesLabels(q: VisualizerBase, seriesLabels: any[]) {
    if(this.getQuestionValueType(q.question) === "enum") {
      seriesLabels.push.apply(seriesLabels, q.getLabels().reverse());
    } else {
      seriesLabels.push(q.question.title || q.question.name);
    }
  }

  public getChartAxisSetting(axisDescription: IAxisDescription, seriesLabels: Array<string>, opposite: boolean) {
    if(!axisDescription) return {};

    const dataQuestion = this.questions.find(q => q.name === axisDescription.dataName);
    // const valueQuestion = this.questions.find(q => q.name === axisDescription.valueName);
    const setting = {
      title: {
        text: dataQuestion ? super.getTitle(dataQuestion) : ""
      },
      opposite: opposite,
      seriesName: seriesLabels
    };
    return setting;
  }

  private registerSideBarItems() {
    this.registerSideBarItem("axisXSelector", () => {
      this.axisXSelector = createDropdown({
        options: this.questions.map((question) => {
          return {
            value: question.name,
            text: question.title || question.name,
          };
        }),
        isSelected: (option: any) => this.axisXQuestionName === option.value,
        handler: (e: any) => {
          this.axisXQuestionName = e;
          // this.updateQuestionsSelection();
          // this.updateToolbar();
          this.setupPivot();
        },
        title: () => this.isXYChart() ? localization.getString("axisXSelectorTitle") : localization.getString("axisXAlternativeSelectorTitle")
      });
      return this.axisXSelector;
    }, 100, 10);

    this.primaryYAxesSeriesListWidget = new EditableSeriesListWidget({
      title: this.isXYChart() ? localization.getString("axisYSelectorTitle") : localization.getString("axisYAlternativeSelectorTitle"),
      items: this.primaryYAxes,
      getOptions: () => this.questions.map((question) => ({
        value: question.name,
        text: question.title || question.name,
      })),
      onChange: (items) => {
        this.primaryYAxes = items;
        this.setupPivot();
      },
      maxSeriesCount: this.options.maxSeriesCount,
      getItemExtraButtons: () => (item, index) => {
        if(!this.useSecondaryYAxis) return [];
        return [{
          text: localization.getString("seriesListMoveToSecondAxis"),
          onClick: () => this.movePrimaryItemToSecondary(index),
        }];
      },
    });
    this.registerSideBarItem("primaryYAxes", () => {
      return this.primaryYAxesSeriesListWidget.render();
    }, 110, 10);

    this.secondaryYAxesSeriesListWidget = new EditableSeriesListWidget({
      title: localization.getString("axisYSelectorTitle"),
      items: this.secondaryYAxes,
      getOptions: () => this.questions.map((question) => ({
        value: question.name,
        text: question.title || question.name,
      })),
      onChange: (items) => {
        this.secondaryYAxes = items;
        this.setupPivot();
      },
      maxSeriesCount: this.options.maxSeriesCount,
      getItemExtraButtons: () => (item, index) => {
        return [{
          text: localization.getString("seriesListMoveToFirstAxis"),
          onClick: () => this.moveSecondaryItemToPrimary(index),
        }];
      },
    });

    this.registerSideBarItem("secondaryYAxisBlock", (container: HTMLDivElement) => {
      if(!this.allowSecondaryAxis) {
        return;
      }
      const block = DocumentHelper.createElement("div", "sa-pivot__secondary-y-block");
      const toggleWidget = new ToggleWidget(
        (opts) => {
          this.useSecondaryYAxis = opts.isActive;
          secondaryListContainer.style.display = this.useSecondaryYAxis ? "" : "none";
          this.primaryYAxesSeriesListWidget.refresh();
          this.setupPivot();
        },
        () => localization.getString("secondYAxisToggleTitle"),
        this.useSecondaryYAxis
      );
      block.appendChild(toggleWidget.container);
      const secondaryListContainer = this.secondaryYAxesSeriesListWidget.render();
      secondaryListContainer.style.display = this.useSecondaryYAxis ? "" : "none";
      block.appendChild(secondaryListContainer);
      return block;
    }, 120, 20);
  }

  constructor(
    public questions: Array<Question>,
    data: Array<{ [index: string]: any }>,
    options?: IPivotVisualizerOptions,
    private isRoot = true,
    type?: string
  ) {
    super(null, data, options, type || "pivot");
    this._supportSelection = false;
    if(!Array.isArray(this.questions)) {
      this._questionDefinition = this.questions;
      this.questions = [];
    }
    this.questions = this.questions || [];
    if(!!this.options.questions) {
      if(typeof this.options.questions[0] == "object") {
        this.questions = this.options.questions as Question[];
      } else if(typeof this.options.questions[0] == "string") {
        const questionNames = this.options.questions as string[];
        this.questions = this.questions.filter((question) => questionNames.indexOf(question.name) !== -1);
      }
    }
    this.questions = this.questions.filter((question) => ["matrixdropdown", "matrixdynamic", "matrix", "file", "signature", "multipletext", "comment", "html", "image"].indexOf(question.getType()) === -1);

    this.axisXQuestionName = this.questions.length > 0 ? this.questions[0].name : undefined;
    this.useSecondaryYAxis = !!this.options.useSecondaryYAxis;
    if(this.options.categoryField) {
      const categoryField = this.options.categoryField;
      this.axisXQuestionName = getQuestionName(categoryField) || this.axisXQuestionName;
    }
    if(Array.isArray(this.options.seriesFields)) {
      this.primaryYAxes = [];
      this.options.seriesFields.forEach((seriesField) => {
        this.primaryYAxes.push({
          dataName: getQuestionName(seriesField),
          valueName: getQuestionName(seriesField),
          aggregation: "count"
        });
      });
    }
    if(Array.isArray(this.options.series)) {
      this.applySeriesOptions(this.options.series);
    }

    this.registerSideBarItems();
    this.moveToolbarItemsToSidebar();

    this.setupPivot();
  }

  private moveToolbarItemsToSidebar(): void {
    const toolbarNames = Object.keys(this.toolbarItemCreators).filter((name) => name !== "changeChartType");
    toolbarNames.forEach((name, i) => {
      const creator = this.unregisterToolbarItem(name);
      if(creator) {
        this.registerSideBarItem(name, (container: HTMLDivElement) => creator(container), i);
      }
    });
  }

  get useSecondaryYAxis(): boolean {
    return this._useSecondaryYAxis;
  }

  set useSecondaryYAxis(newValue: boolean) {
    if(!newValue) {
      this._savedSecondaryYAxes = this.secondaryYAxes.map((axis) => ({ ...axis }));
      this.secondaryYAxes = [];
    } else if(this._savedSecondaryYAxes.length > 0) {
      this.secondaryYAxes = this._savedSecondaryYAxes.map((axis) => ({ ...axis }));
      this.secondaryYAxesSeriesListWidget.setItems(this.secondaryYAxes);
    }
    this._useSecondaryYAxis = newValue;
  }

  get yAxes(): Array<IAxisDescription> {
    return [...this.primaryYAxes, ...this.secondaryYAxes];
  }

  get allowSecondaryAxis(): boolean {
    return ["vbar", "line"].indexOf(this.chartType) !== -1;
  }

  public getYAxisInfo() {
    if(this.secondaryYAxes.length > 0) {
      const primarySeriesLabels = [];
      const secondarySeriesLabels = [];
      this.questionsY.forEach((q, i) => {
        const seriesLabels = i < this.primaryYAxes.length ? primarySeriesLabels : secondarySeriesLabels;
        this.getQuestionSeriesLabels(q, seriesLabels);
      });

      const primarySetting = this.getChartAxisSetting(this.primaryYAxes[0], primarySeriesLabels, false);
      const secondarySetting = this.getChartAxisSetting(this.secondaryYAxes[0], secondarySeriesLabels, true);
      return [primarySetting, secondarySetting];
    }
    return [{}];
  }

  protected getName(): string {
    return this._questionDefinition?.name || super.getName();
  }

  protected getTitle(question: Question): string {
    return this._questionDefinition?.title || super.getTitle(question) || this.getName();
  }

  public setAxisQuestions(...axisQuestionNames: string[]): void {
    if(axisQuestionNames.length < 1) {
      return;
    }
    this.axisXQuestionName = axisQuestionNames[0];
    this.primaryYAxes = axisQuestionNames.splice(1).map(name => {
      const question = this.questions.filter((q) => q.name === name)[0];
      const questionValueType = this.getQuestionValueType(question);
      return {
        dataName: name,
        valueName: name,
        aggregation: questionValueType === "enum" || questionValueType === "date" ? "count" : "sum"
      };
    });

    this.setupPivot();
  }

  protected setChartType(chartType: string) {
    const prev2Dchart = this.isXYChart();
    super.setChartType(chartType);
    if(prev2Dchart !== this.isXYChart()) {
      this.updateToolbar();
    }
    if(!this.allowSecondaryAxis) {
      this.useSecondaryYAxis = false;
    }
    this._sidebarWidget?.destroyPanel();
  }

  private isXYChart() {
    return ["pie", "doughnut"].indexOf(this.chartType) === -1;
  }

  private movePrimaryItemToSecondary(index: number): void {
    const item = this.primaryYAxes[index];
    if(!item) return;
    this.primaryYAxesSeriesListWidget.removeAt(index);
    this.secondaryYAxes = [...this.secondaryYAxes, { ...item }];
    this.secondaryYAxesSeriesListWidget.setItems(this.secondaryYAxes);
    this.setupPivot();
  }

  private moveSecondaryItemToPrimary(index: number): void {
    const item = this.secondaryYAxes[index];
    if(!item) return;
    this.secondaryYAxesSeriesListWidget.removeAt(index);
    this.primaryYAxes = [...this.primaryYAxes, { ...item }];
    this.primaryYAxesSeriesListWidget.setItems(this.primaryYAxes);
    this.setupPivot();
  }

  private setupPivot() {
    const questionX = this.questions.filter((q) => q.name === this.axisXQuestionName)[0];
    if(!questionX) {
      return;
    }
    this.question = questionX;
    this.valueType = this.getQuestionValueType(questionX);

    this.questionsY = this.yAxes.map((axisOption) => {
      const axisQuestionName = axisOption.dataName || axisOption.valueName;
      const questionY = this.questions.filter((q) => q.name === axisQuestionName)[0];
      if(!!questionY) {
        return this.getQuestionValueType(questionY) === "enum" ? new SelectBase(questionY, []) : new VisualizerBase(questionY, []);
      }
    }).filter((q) => !!q);

    this.onDataChanged();
  }

  protected getContinuousValues() {
    if(this._cachedValues === undefined) {
      this._pivotContinuousData = [];
      if(this.valueType === "enum") {
        this._cachedValues = [];
        return this._cachedValues;
      }
      const hash = {};
      this.data.forEach(dataItem => {
        const answerData = dataItem[this.dataNames[0]];
        if(answerData !== undefined) {
          // TODO: _continuousData should be sorted in order to speed-up statistics calculation in the getData function
          this._pivotContinuousData.push({ continuous: this.getContinuousValue(answerData), row: dataItem });
          hash[answerData] = { value: answerData, row: dataItem };
        }
      });
      this._cachedValues = Object.keys(hash).map(key => ({ original: hash[key].value, continuous: this.getContinuousValue(key), row: hash[key].row }));
      this._cachedValues.sort((a, b) => a.continuous - b.continuous);
    }
    return this._cachedValues;
  }

  protected isSupportAnswersOrder(): boolean {
    return false;
  }

  public getSeriesValues(): Array<string> {
    if(!this.questionsY || this.questionsY.length === 0) {
      return this.options.seriesValues || [];
    }
    const seriesValues = [];
    this.questionsY.forEach(q => {
      if(this.getQuestionValueType(q.question) === "enum") {
        seriesValues.push.apply(seriesValues, q.getValues().reverse());
      } else {
        seriesValues.push(q.question.name);
      }
    });
    return seriesValues;
  }

  public getSeriesLabels(): Array<string> {
    if(this.questionsY.length === 0) {
      return this.getSeriesValues();
    }
    const seriesLabels = [];
    this.questionsY.forEach(q => {
      this.getQuestionSeriesLabels(q, seriesLabels);
    });
    return seriesLabels;
  }

  getSeriesValueIndexes(): { [index: string]: number } {
    const seriesValueIndexes = {};
    let valueIndex = 0;
    for(var i = 0; i < this.questionsY.length; ++i) {
      const questionValueType = this.getQuestionValueType(this.questionsY[i].question);
      if(questionValueType === "enum") {
        this.questionsY[i].getValues().reverse().forEach((value) => {
          seriesValueIndexes[this.questionsY[i].name + "_" + value] = valueIndex++;
        });
      } else {
        seriesValueIndexes[this.questionsY[i].name] = valueIndex++;
      }
    }
    return seriesValueIndexes;
  }

  public updateStatisticsSeriesValue(statistics: Array<Array<number>>, dataRow: { [index: string]: any }, valueIndex: number, seriesValueIndexes: { [index: string]: number }): void {
    for(let j = 0; j < this.questionsY.length; ++j) {
      if(dataRow[this.questionsY[j].name] !== undefined) {
        const questionValueType = this.getQuestionValueType(this.questionsY[j].question);
        let seriseValueIndexName = this.questionsY[j].name;
        if(questionValueType === "enum" || questionValueType === "date") {
          seriseValueIndexName += "_" + dataRow[this.questionsY[j].name];
        }
        const seriesValueIndex = seriesValueIndexes[seriseValueIndexName];
        statistics[seriesValueIndex][valueIndex] = this.calculateAggregation(dataRow, this.yAxes[j], statistics[seriesValueIndex][valueIndex]);
      }
    }
  }

  protected calculateAggregation(dataRow: any, series: IAxisDescription, currentValue: number): number {
    if(!dataRow || !series) {
      return currentValue;
    }
    const qName = series.valueName || series.dataName;
    const aggregationQuestion = this.questions.filter((q) => q.name === qName)[0];
    const value = dataRow[aggregationQuestion?.valueName || qName];
    if(value === undefined) {
      return currentValue;
    }
    const aggregation = this._aggregations[series.aggregation || "count"];
    if(!aggregation) {
      const questionValueType = this.getQuestionValueType(aggregationQuestion);
      if(questionValueType === "enum" || questionValueType === "date") {
        return currentValue + 1;
      } else {
        return currentValue + parseFloat(value);
      }
    }
    if(typeof aggregation === "function") {
      return aggregation(currentValue, value);
    }
    return currentValue;
  }

  protected getCalculatedValuesCore(): ICalculationResult {
    const statistics: Array<Array<number>> = [];
    const series = this.getSeriesValues();
    if(series.length === 0) {
      series.push("");
    }
    const seriesValueIndexes = this.getSeriesValueIndexes();
    if(this.valueType === "enum") {
      const values = this.getValues();
      const valueIndexes = {};
      values.forEach((value, index) => {
        valueIndexes[value] = index;
      });
      for(var i = 0; i < series.length; ++i) {
        statistics.push(values.map(i => 0));
      }
      this.data.forEach(dataRow => {
        let answerData = dataRow[this.dataNames[0]];
        if(!Array.isArray(answerData)) {
          answerData = [answerData];
        }
        answerData.forEach(answerDataItem => {
          if(answerDataItem !== undefined && valueIndexes[answerDataItem] !== undefined) {
            const valueIndex = valueIndexes[answerDataItem];
            if(this.questionsY.length === 0) {
              statistics[0][valueIndex]++;
            } else {
              this.updateStatisticsSeriesValue(statistics, dataRow, valueIndex, seriesValueIndexes);
            }
          }
        });
      });
    } else {
      const continuousValues = this.getContinuousValues();
      const intervals = this.intervals;
      for(var i = 0; i < series.length; ++i) {
        statistics.push(intervals.map(i => 0));
      }
      this._pivotContinuousData.forEach(dataValue => {
        for(let valueIndex = 0; valueIndex < intervals.length; ++valueIndex) {
          if(intervals[valueIndex].start <= dataValue.continuous && (dataValue.continuous < intervals[valueIndex].end || valueIndex == intervals.length - 1)) {
            if(this.questionsY.length === 0) {
              statistics[0][valueIndex]++;
            } else {
              this.updateStatisticsSeriesValue(statistics, dataValue.row, valueIndex, seriesValueIndexes);
            }
            break;
          }
        }
      });
    }
    return {
      data: statistics,
      values: this.valueType === "enum" ? this.getValues() : this.intervals.map(i => i.label),
      series: series,
    };
  }

  protected renderToolbar(container: HTMLElement): void {
    container.className += " sa-pivot__header";
    super.renderToolbar(container);
  }

  public render(targetElement: HTMLElement | string, isRoot = true): void {
    super.render(targetElement, isRoot);

    this.renderResult.classList.add("sa-pivot");
    if(isRoot) {
      this.renderResult.classList.add("sa-pivot--standalone");
    }
  }

  protected renderBanner(container: HTMLElement): void {
    if(!this.haveCommercialLicense && this.isRoot) {
      const banner = createCommercialLicenseLink();
      container.appendChild(banner);
    }
    super.renderBanner(container);
  }
}

VisualizationManager.registerPivotVisualizer(PivotModel);
VisualizationManager.registerVisualizer("pivot", PivotModel as any, undefined, "pivot");
