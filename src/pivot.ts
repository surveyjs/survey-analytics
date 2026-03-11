import { ItemValue, Question } from "survey-core";
import { SelectBase } from "./selectBase";
import { createCommercialLicenseLink, DocumentHelper } from "./utils";
import { ICalculationResult, IVisualizerOptions, VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { VisualizationManager } from "./visualizationManager";
import { HistogramModel } from "./histogram";
import { EditableSeriesListWidget } from "./utils/editableSeriesListWidget";
import { IAxisDescription } from "./axisDescription";
import { ToggleWidget } from "./utils/toggle";

export interface IPivotChartVisualizerOptions extends IVisualizerOptions {
  questions?: Question[] | string[];
  categoryField?: Question | string;
  seriesFields?: Question[] | string[];
  maxSeriesCount?: number;
  useSecondaryYAxis?: boolean;
  [key: string]: any;
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
  useSecondaryYAxis: boolean = false;
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

  private getChartAxisSetting(axisDescription: IAxisDescription, seriesValues: Array<string>, opposite: boolean) {
    const question = this.questions.find(q => q.name === axisDescription.dataName || q.name === axisDescription.valueName);
    const setting = {
      title: {
        text: question ? this.getTitle(question) : ""
      },
      opposite: opposite,
      seriesName: seriesValues
    };
    return setting;
  }

  constructor(
    public questions: Array<Question>,
    data: Array<{ [index: string]: any }>,
    options?: IPivotChartVisualizerOptions,
    private isRoot = true,
    type?: string
  ) {
    super(null, data, options, type || "pivot");
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

    this.registerSideBarItem("axisXSelector", () => {
      this.axisXSelector = DocumentHelper.createDropdown({
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
    }, 0);

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
    }, 10);

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
      maxSeriesCount: this.options.maxSeriesCount
    });

    this.registerSideBarItem("secondaryYAxisBlock", (container: HTMLDivElement) => {
      if(!this.isXYChart()) {
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
      const secondaryListContainer = DocumentHelper.createElement("div", "sa-pivot__secondary-y-list");
      secondaryListContainer.style.display = this.useSecondaryYAxis ? "" : "none";
      secondaryListContainer.appendChild(this.secondaryYAxesSeriesListWidget.render());
      block.appendChild(secondaryListContainer);
      return block;
    }, 20);

    this.setupPivot();
  }

  get yAxes(): Array<IAxisDescription> {
    return [...this.primaryYAxes, ...this.secondaryYAxes];
  }

  public getYAxisInfo() {
    if(this.secondaryYAxes.length > 0) {
      const primarySeriesValues = [];
      const secondarySeriesValues = [];
      this.questionsY.forEach((q, i) => {
        const array = i < this.primaryYAxes.length ? primarySeriesValues : secondarySeriesValues;
        if(this.getQuestionValueType(q.question) === "enum") {
          array.push.apply(array, q.getValues().reverse());
        } else {
          array.push(q.question.name);
        }
      });

      const primarySetting = this.getChartAxisSetting(this.primaryYAxes[0], primarySeriesValues, false);
      const secondarySetting = this.getChartAxisSetting(this.secondaryYAxes[0], secondarySeriesValues, true);
      return [primarySetting, secondarySetting];
    }
    return [{}];
  }

  protected getName(): string {
    return this._questionDefinition?.name || super.getName();
  }

  protected getTitle(question: Question): string {
    return this._questionDefinition?.title || this._questionDefinition?.name || super.getTitle(question);
  }

  // private createYSelecterGenerator(): () => HTMLDivElement {
  //   const selectorIndex: number = this.axisYSelectors.length;
  //   return () => {
  //     let selector = this.axisYSelectors[selectorIndex];
  //     if(!selector) {
  //       selector = this.createAxisYSelector(selectorIndex);
  //       this.axisYSelectors.push(selector);
  //     } else {
  //       selector["__updateSelect"] && selector["__updateSelect"]();
  //     }
  //     return selector;
  //   };
  // }

  public setAxisQuestions(...axisQuestionNames: string[]): void {
    if(axisQuestionNames.length < 1) {
      return;
    }
    this.axisXQuestionName = axisQuestionNames[0];
    this.primaryYAxes = axisQuestionNames.splice(1).map(name => ({
      dataName: name,
      valueName: name,
      aggregation: "count"
    }));

    // secondaryYAxes
    this.setupPivot();
  }

  // public onAxisYSelectorChanged(index: number, value: any): void {
  //   this.axisYQuestionNames[index] = value;

  //   if(index < this.axisYSelectors.length - 1) {
  //     if(!value) {
  //       for(let i = index + 1; i < this.axisYSelectors.length; ++i) {
  //         this.unregisterToolbarItem("axisYSelector" + i);
  //       }
  //       this.axisYSelectors = this.axisYSelectors.slice(0, index + 1);
  //       this.axisYQuestionNames = this.axisYQuestionNames.slice(0, index + 1);
  //     }
  //   } else {
  //     if(!!value && (!this.options.maxSeriesCount || this.axisYSelectors.length < this.options.maxSeriesCount)) {
  //       this.registerToolbarItem("axisYSelector" + this.axisYSelectors.length, this.createYSelecterGenerator(), "dropdown");
  //     }
  //   }

  //   this.updateQuestionsSelection();
  //   // this.updateToolbar();
  //   this.setupPivot();
  // }

  // protected updateQuestionsSelection() {
  //   const selectedQuestions = [this.axisXQuestionName];
  //   for(let i = 0; i < this.axisYQuestionNames.length; ++i) {
  //     const questionName = this.axisYQuestionNames[i];
  //     if(selectedQuestions.indexOf(questionName) !== -1) {
  //       this.onAxisYSelectorChanged(i, undefined);
  //       break;
  //     } else {
  //       selectedQuestions.push(questionName);
  //     }
  //   }
  // }

  // private createAxisYSelector(selectorIndex: number): HTMLDivElement {

  //   const getChoices = () => {
  //     const choices = this.questions.filter(q => {
  //       if(q.name === this.axisXQuestionName) {
  //         return false;
  //       }
  //       const usedIndex = this.axisYQuestionNames.indexOf(q.name);
  //       return usedIndex == -1 || usedIndex >= selectorIndex;
  //     }).map((question) => {
  //       return {
  //         value: question.name,
  //         text: question.title || question.name,
  //       };
  //     });
  //     return [{ value: "", text: localization.getString("notSelected") }].concat(choices);
  //   };
  //   if(getChoices().length == 1) {
  //     return undefined;
  //   }
  //   const selector = DocumentHelper.createDropdown({
  //     options: getChoices,
  //     isSelected: (option: any) => this.axisYQuestionNames[selectorIndex] === option.value,
  //     handler: (e: any) => { this.onAxisYSelectorChanged(selectorIndex, e); },
  //     title: () => selectorIndex ? undefined : (this.isXYChart() ? localization.getString("axisYSelectorTitle") : localization.getString("axisYAlternativeSelectorTitle"))
  //   });
  //   return selector;
  // }

  protected setChartType(chartType: string) {
    const prev2Dchart = this.isXYChart();
    super.setChartType(chartType);
    if(prev2Dchart !== this.isXYChart()) {
      this.updateToolbar();
    }
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

  private setupPivot() {
    const questionX = this.questions.filter((q) => q.name === this.axisXQuestionName)[0];
    if(!questionX) {
      return;
    }
    this.question = questionX;
    this.valueType = this.getQuestionValueType(questionX);

    this.questionsY = this.yAxes.map((axisOption) => {
      const questionY = this.questions.filter((q) => q.name === axisOption.dataName)[0];
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
      if(this.getQuestionValueType(q.question) === "enum") {
        seriesLabels.push.apply(seriesLabels, q.getLabels().reverse());
      } else {
        seriesLabels.push(q.question.title || q.question.name);
      }
    });
    return seriesLabels;
  }

  public convertFromExternalData(externalCalculatedData: any): ICalculationResult {
    return {
      data: [externalCalculatedData],
      values: this.getValues(),
      series: this.getSeriesValues()
    };
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

  public resetAggregations() {
    this._aggregations = {};
    this.onDataChanged();
  }

  // public setValueAggregation(aggregationName: string, aggregationFunc: string | ((acc: number, value: number) => number)) {
  //   this._aggregations[aggregationName] = aggregationFunc;
  //   this.onDataChanged();
  // }

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
      values: this.valueType === "enum" ? this.getValues() : this.intervals.map(i => i.label)
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
