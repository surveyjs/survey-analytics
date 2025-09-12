import { ItemValue, Question } from "survey-core";
import { SelectBase } from "./selectBase";
import { createCommercialLicenseLink, DocumentHelper } from "./utils";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { VisualizationManager } from "./visualizationManager";

export class PivotModel extends SelectBase {
  protected valueType: "enum" | "date" | "number" = "enum";
  private _cachedValues: Array<{ original: any, continuous: number, row: any }> = undefined;
  private _continuousData: Array<{ continuous: number, row: any }> = undefined;
  private _cachedIntervals: Array<{ start: number, end: number, label: string }> = undefined;
  private _intervalPrecision: number = 2;

  private axisXSelector: HTMLDivElement;
  public axisXQuestionName: string;
  private axisYSelectors: Array<HTMLDivElement> = [];
  public axisYQuestionNames: Array<string> = [];
  private questionsY: Array<VisualizerBase> = [];

  public static IntervalsCount = 10;
  public static UseIntervalsFrom = 10;

  constructor(
    private questions: Array<Question>,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string,
    private isRoot = true
  ) {
    super(null, data, options, name || "pivot");
    this.questions = this.questions.filter((question) => ["matrixdropdown", "matrixdynamic", "matrix", "file", "signature", "multipletext", "comment", "html", "image"].indexOf(question.getType()) === -1);
    if (this.options.intervalPrecision !== undefined) {
      this._intervalPrecision = this.options.intervalPrecision;
    }

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

  public getQuestionValueType(question: Question): "enum" | "date" | "number" {
    const questionType = question.getType();
    if (questionType === "text" && (question["inputType"] === "date" || question["inputType"] === "datetime")) {
      return "date";
    } else if(questionType === "text" || questionType === "rating" || questionType === "expression" || questionType === "range") {
      return "number";
    }
    return "enum";
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

  private reset() {
    this._continuousData = undefined;
    this._cachedValues = undefined;
    this._cachedIntervals = undefined;
  }

  public getContinuousValue(value: any): number {
    if (this.valueType === "date") {
      return Date.parse(value);
    }
    return parseFloat(value);
  }

  public getString(value: number): string {
    if (this.valueType === "date") {
      return new Date(value).toLocaleDateString();
    }
    return "" + value;
  }

  private toPrecision(value: number) {
    const base = Math.pow(10, this._intervalPrecision);
    return Math.round(base * value) / base;
  }

  public getSelectedItemByText(itemText: string) {
    if (this.hasCustomIntervals || this.getContinuousValues().length > PivotModel.UseIntervalsFrom) {
      const interval = this.intervals.filter(interval => interval.label === itemText)[0];
      return new ItemValue(interval, interval !== undefined ? interval.label : "");
    }
    const labels = this.getLabels();
    const labelIndex = labels.indexOf(itemText);
    return new ItemValue(this.getValues()[labelIndex], labels[labelIndex]);
  }

  /**
   * Updates visualizer data.
   */
  public updateData(data: Array<{ [index: string]: any }>) {
    this.reset();
    super.updateData(data);
  }

  protected onDataChanged() {
    this.reset();
    super.onDataChanged();
  }

  protected getContinuousValues() {
    if (this._cachedValues === undefined) {
      this._continuousData = [];
      if(this.valueType === "enum") {
        this._cachedValues = [];
        return this._cachedValues;
      }
      const hash = {};
      this.data.forEach(dataItem => {
        const answerData = dataItem[this.name];
        if (answerData !== undefined) {
          // TODO: _continuousData should be sorted in order to speed-up statistics calculation in the getData function
          this._continuousData.push({ continuous: this.getContinuousValue(answerData), row: dataItem });
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

  protected isSupportMissingAnswers(): boolean {
    return false;
  }

  protected get needUseRateValues() {
    return this.question.getType() == "rating" && Array.isArray(this.question["rateValues"]) && this.question["rateValues"].length > 0;
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

  public getValues(): Array<any> {
    if(this.valueType === "enum") {
      return super.getValues().reverse();
    }
    return this.intervals.map(interval => interval.start);
  }

  public getLabels(): Array<string> {
    if(this.valueType === "enum") {
      return super.getLabels().reverse();
    }
    return this.intervals.map(interval => interval.label);
  }

  public get hasCustomIntervals() {
    return !!this.questionOptions && Array.isArray(this.questionOptions.intervals);
  }

  public get intervals() {
    if (this.hasCustomIntervals) {
      return this.questionOptions.intervals;
    }

    if(this.question.getType() == "rating") {
      if (this.needUseRateValues) {
        const rateValues = this.question["rateValues"] as ItemValue[];
        rateValues.sort((iv1, iv2) => iv1.value - iv2.value);
        return rateValues.map((rateValue, i) => ({
          start: rateValue.value,
          end: i < rateValues.length - 1 ? rateValues[i + 1].value : rateValue.value + 1,
          label: rateValue.text
        }));
      } else {
        const rateIntervals = [];
        for(let i = (this.question["rateMin"] || 0); i <= (this.question["rateMax"] || (PivotModel.IntervalsCount - 1)); i += (this.question["rateStep"] || 1)) {
          rateIntervals.push({
            start: i,
            end: i + 1,
            label: "" + (!!this.question["rateMin"] && !!this.question["rateMax"] ? i : (i + "-" + (i+1)))
          });
        }
        return rateIntervals;
      }
    }

    if (this._cachedIntervals === undefined) {
      const continuousValues = this.getContinuousValues();
      this._cachedIntervals = [];
      if (continuousValues.length) {
        let start = continuousValues[0].continuous;
        const end = continuousValues[continuousValues.length - 1].continuous;
        const intervalsCount = PivotModel.IntervalsCount;
        const delta = (end - start) / intervalsCount;
        for (let i = 0; i < intervalsCount; ++i) {
          const next = start + delta;
          const istart = this.toPrecision(start);
          const inext = this.toPrecision(next);
          this._cachedIntervals.push({
            start: istart,
            end: i < intervalsCount - 1 ? inext : inext + delta / 100,
            label: "" + this.getString(istart) + "-" + this.getString(inext)
          });
          start = next;
        }
      }
    }
    return this._cachedIntervals;
  }

  public convertFromExternalData(externalCalculatedData: any): any[] {
    return [externalCalculatedData];
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

  protected getCalculatedValuesCore(): Array<any> {
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
      this._continuousData.forEach(dataValue => {
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
    return statistics;
  }

  public getValueType(): "enum" | "date" | "number" {
    return this.valueType;
  }

  protected isSupportSoftUpdateContent(): boolean {
    return false;
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