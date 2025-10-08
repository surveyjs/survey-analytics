import { ItemValue, Question } from "survey-core";
import { SelectBase } from "./selectBase";
import { createCommercialLicenseLink, DocumentHelper } from "./utils";
import { ICalculationResult, VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { VisualizationManager } from "./visualizationManager";
import { HistogramModel } from "./histogram";

export class PivotModel extends HistogramModel {
  private _pivotContinuousData: Array<{ continuous: number, row: any }> = undefined;

  private axisXSelector: HTMLDivElement;
  public axisXQuestionName: string;
  private axisYSelectors: Array<HTMLDivElement> = [];
  public axisYQuestionNames: Array<string> = [];
  private questionsY: Array<VisualizerBase> = [];

  constructor(
    private questions: Array<Question>,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    type?: string,
    private isRoot = true
  ) {
    super(null, data, options, type || "pivot");
    this.questions = this.questions.filter((question) => ["matrixdropdown", "matrixdynamic", "matrix", "file", "signature", "multipletext", "comment", "html", "image"].indexOf(question.getType()) === -1);

    this.axisXQuestionName = this.questions.length > 0 ? this.questions[0].name : undefined;
    this.registerToolbarItem("axisXSelector", () =>
      this.axisXSelector = DocumentHelper.createDropdown(
        this.questions.map((question) => {
          return {
            value: question.name,
            text: question.title || question.name,
          };
        }),
        (option: any) => this.axisXQuestionName === option.value,
        (e: any) => {
          this.axisXQuestionName = e;
          this.updateQuestionsSelection();
          this.updateToolbar();
          this.setupPivot();
        },
        undefined,
        () => this.isXYChart() ? localization.getString("axisXSelectorTitle") : localization.getString("axisXAlternativeSelectorTitle")
      ), "dropdown"
    );
    this.registerToolbarItem("axisYSelector0", this.createYSelecterGenerator(), "dropdown");
    this.setupPivot();
  }

  private createYSelecterGenerator(): () => HTMLDivElement {
    const selectorIndex: number = this.axisYSelectors.length;
    return () => {
      let selector = this.axisYSelectors[selectorIndex];
      if(!selector) {
        selector = this.createAxisYSelector(selectorIndex);
        this.axisYSelectors.push(selector);
      } else {
        selector["__updateSelect"] && selector["__updateSelect"]();
      }
      return selector;
    };
  }

  public setAxisQuestions(...axisQuestionNames: string[]): void {
    if(axisQuestionNames.length < 1) {
      return;
    }
    this.axisXQuestionName = axisQuestionNames[0];
    this.axisYQuestionNames = axisQuestionNames.splice(1);
    this.setupPivot();
  }

  public onAxisYSelectorChanged(index: number, value: any): void {
    this.axisYQuestionNames[index] = value;

    if (index < this.axisYSelectors.length - 1) {
      if(!value) {
        for(let i = index + 1; i < this.axisYSelectors.length; ++i) {
          this.unregisterToolbarItem("axisYSelector" + i);
        }
        this.axisYSelectors = this.axisYSelectors.slice(0, index + 1);
        this.axisYQuestionNames = this.axisYQuestionNames.slice(0, index + 1);
      }
    } else {
      if(!!value) {
        this.registerToolbarItem("axisYSelector" + this.axisYSelectors.length, this.createYSelecterGenerator(), "dropdown");
      }
    }

    this.updateQuestionsSelection();
    this.updateToolbar();
    this.setupPivot();
  }

  protected updateQuestionsSelection() {
    const selectedQuestions = [this.axisXQuestionName];
    for(let i = 0; i < this.axisYQuestionNames.length; ++i) {
      const questionName = this.axisYQuestionNames[i];
      if (selectedQuestions.indexOf(questionName) !== -1) {
        this.onAxisYSelectorChanged(i, undefined);
        break;
      } else {
        selectedQuestions.push(questionName);
      }
    }
  }

  private createAxisYSelector(selectorIndex: number): HTMLDivElement {

    const getChoices = () => {
      const choices = this.questions.filter(q => {
        if(q.name === this.axisXQuestionName) {
          return false;
        }
        const usedIndex = this.axisYQuestionNames.indexOf(q.name);
        return usedIndex == -1 || usedIndex >= selectorIndex;
      }).map((question) => {
        return {
          value: question.name,
          text: question.title || question.name,
        };
      });
      return [{ value: "", text: localization.getString("notSelected") }].concat(choices);
    };
    if(getChoices().length == 1) {
      return undefined;
    }
    const selector = DocumentHelper.createDropdown(
      getChoices,
      (option: any) => this.axisYQuestionNames[selectorIndex] === option.value,
      (e: any) => { this.onAxisYSelectorChanged(selectorIndex, e); },
      undefined,
      () => selectorIndex ? undefined : (this.isXYChart() ? localization.getString("axisYSelectorTitle") : localization.getString("axisYAlternativeSelectorTitle"))
    );
    return selector;
  }

  protected setChartType(chartType: string) {
    const prev2Dchart = this.isXYChart();
    super.setChartType(chartType);
    if (prev2Dchart !== this.isXYChart()) {
      this.updateToolbar();
    }
  }

  private isXYChart() {
    return ["pie", "doughnut"].indexOf(this.chartType) === -1;
  }

  private setupPivot() {
    const questionX = this.questions.filter((q) => q.name === this.axisXQuestionName)[0];
    if(!questionX) {
      return;
    }
    this.question = questionX;
    this.valueType = this.getQuestionValueType(questionX);

    this.questionsY = this.axisYQuestionNames.map((name) => {
      const questionY = this.questions.filter((q) => q.name === name)[0];
      if(!!questionY) {
        return this.getQuestionValueType(questionY) === "enum" ? new SelectBase(questionY, []) : new VisualizerBase(questionY, []);
      }
    }).filter((q) => !!q);

    this.onDataChanged();
  }

  protected getContinuousValues() {
    if (this._cachedValues === undefined) {
      this._pivotContinuousData = [];
      if(this.valueType === "enum") {
        this._cachedValues = [];
        return this._cachedValues;
      }
      const hash = {};
      this.data.forEach(dataItem => {
        const answerData = dataItem[this.name];
        if (answerData !== undefined) {
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
      if (this.getQuestionValueType(q.question) === "enum") {
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
      if (this.getQuestionValueType(q.question) === "enum") {
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
    for (var i = 0; i < this.questionsY.length; ++i) {
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
    for (let j = 0; j < this.questionsY.length; ++j) {
      if (dataRow[this.questionsY[j].name] !== undefined) {
        const questionValueType = this.getQuestionValueType(this.questionsY[j].question);
        if (questionValueType === "enum" || questionValueType === "date") {
          const seriesValueIndex = seriesValueIndexes[this.questionsY[j].name + "_" + dataRow[this.questionsY[j].name]];
          statistics[seriesValueIndex][valueIndex]++;
        } else {
          const seriesValueIndex = seriesValueIndexes[this.questionsY[j].name];
          statistics[seriesValueIndex][valueIndex] += parseFloat(dataRow[this.questionsY[j].name]);
        }
      }
    }
  }

  protected getCalculatedValuesCore(): ICalculationResult {
    const statistics: Array<Array<number>> = [];
    const series = this.getSeriesValues();
    if (series.length === 0) {
      series.push("");
    }
    const seriesValueIndexes = this.getSeriesValueIndexes();
    if (this.valueType === "enum") {
      const values = this.getValues();
      const valueIndexes = {};
      values.forEach((value, index) => {
        valueIndexes[value] = index;
      });
      for (var i = 0; i < series.length; ++i) {
        statistics.push(values.map(i => 0));
      }
      this.data.forEach(dataRow => {
        const answerData = dataRow[this.name];
        if (answerData !== undefined && valueIndexes[answerData] !== undefined) {
          const valueIndex = valueIndexes[answerData];
          if(this.questionsY.length === 0) {
            statistics[0][valueIndex]++;
          } else {
            this.updateStatisticsSeriesValue(statistics, dataRow, valueIndex, seriesValueIndexes);
          }
        }
      });
    } else {
      const continuousValues = this.getContinuousValues();
      const intervals = this.intervals;
      for (var i = 0; i < series.length; ++i) {
        statistics.push(intervals.map(i => 0));
      }
      this._pivotContinuousData.forEach(dataValue => {
        for (let valueIndex = 0; valueIndex < intervals.length; ++valueIndex) {
          if (intervals[valueIndex].start <= dataValue.continuous && (dataValue.continuous < intervals[valueIndex].end || valueIndex == intervals.length - 1)) {
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

  protected renderToolbar(container: HTMLElement) {
    if (!this.haveCommercialLicense && this.isRoot) {
      const banner = createCommercialLicenseLink();
      container.appendChild(banner);
    }
    container.className += " sa-pivot__header";
    super.renderToolbar(container);
  }
}

VisualizationManager.registerPivotVisualizer(PivotModel);