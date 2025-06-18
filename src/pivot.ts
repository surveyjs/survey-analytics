import { ItemValue, Question } from "survey-core";
import { DataProvider } from "./dataProvider";
import { SelectBase } from "./selectBase";
import { DocumentHelper } from "./utils";
import { VisualizerBase } from "./visualizerBase";
import { reverse } from "dns";

export class PivotModel extends SelectBase {
  protected valueType: "enum" | "date" | "number" = "enum";
  private _cachedValues: Array<{ original: any, continious: number, row: any }> = undefined;
  private _continiousData: Array<{ continious: number, row: any }> = undefined;
  private _cachedIntervals: Array<{ start: number, end: number, label: string }> = undefined;
  private _intervalPrecision: number = 2;
  protected chartTypes: string[];

  private axisXSelector: HTMLDivElement;
  private axisXQuestionName: string;
  private axisYSelector: HTMLDivElement;
  private axisYQuestionName: string;
  private questionsY: Array<VisualizerBase> = [];

  public static IntervalsCount = 10;
  public static UseIntervalsFrom = 10;

  constructor(
    private questions: Array<Question>,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(null, data, options, name || "pivot");
    if (this.options.intervalPrecision !== undefined) {
      this._intervalPrecision = this.options.intervalPrecision;
    }

    this.axisXQuestionName = this.questions.length > 0 ? this.questions[0].name : undefined;
    this.registerToolbarItem("axisXSelector", () =>
      this.axisXSelector = DocumentHelper.createSelector(
        this.questions.map((question) => {
          return {
            value: question.name,
            text: question.title || question.name,
          };
        }),
        (option: any) => this.axisXQuestionName === option.value,
        (e: any) => { this.axisXQuestionName = e.target.value; this.setupPivot(); }
      )
    );
    this.registerToolbarItem("axisYSelector", () =>
      this.axisYSelector = DocumentHelper.createSelector(
        [{ value: undefined, text: "Not selected" }].concat(this.questions.map((question) => {
          return {
            value: question.name,
            text: question.title || question.name,
          };
        })),
        (option: any) => this.axisYQuestionName === option.value,
        (e: any) => { this.axisYQuestionName = e.target.value; this.setupPivot(); }
      )
    );
    this.setupPivot();
  }

  private getQuestionValueType(question: Question): "enum" | "date" | "number" {
    const questionType = question.getType();
    if (questionType === "text" && (question["inputType"] === "date" || question["inputType"] === "datetime")) {
      return "date";
    } else if(questionType === "text" || questionType === "rating" || questionType === "range") {
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

    this.questionsY = [];
    const questionY = this.questions.filter((q) => q.name === this.axisYQuestionName)[0];
    if(!!questionY) {
      this.questionsY.push(this.getQuestionValueType(questionY) === "enum" ? new SelectBase(questionY, []) : new VisualizerBase(questionY, []));
    }

    this.onDataChanged();
  }

  private reset() {
    this._continiousData = undefined;
    this._cachedValues = undefined;
    this._cachedIntervals = undefined;
  }

  public getContiniousValue(value: any): number {
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
    if (this.hasCustomIntervals || this.getContiniousValues().length > PivotModel.UseIntervalsFrom) {
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

  protected getContiniousValues() {
    if (this._cachedValues === undefined) {
      this._continiousData = [];
      if(this.valueType === "enum") {
        this._cachedValues = [];
        return this._cachedValues;
      }
      const hash = {};
      this.data.forEach(dataItem => {
        const answerData = dataItem[this.name];
        if (answerData !== undefined) {
          // TODO: _continiousData should be sorted in order to speed-up statistics calculation in the getData function
          this._continiousData.push({ continious: this.getContiniousValue(answerData), row: dataItem });
          hash[answerData] = { value: answerData, row: dataItem };
        }
      });
      this._cachedValues = Object.keys(hash).map(key => ({ original: hash[key].value, continious: this.getContiniousValue(key), row: hash[key].row }));
      this._cachedValues.sort((a, b) => a.continious - b.continious);
    }
    return this._cachedValues;
  }

  protected isSupportMissingAnswers(): boolean {
    return false;
  }

  protected get needUseRateValues() {
    return this.question.getType() == "rating" && Array.isArray(this.question["rateValues"]) && this.question["rateValues"].length > 0;
  }

  public getSeriesValues(): Array<string> {
    if(this.questionsY.length === 0) {
      return this.options.seriesValues || [];
    }
    const seriesValues = [];
    this.questionsY.forEach(q => {
      if (this.getQuestionValueType(q.question) === "enum") {
        seriesValues.push.call(seriesValues, q.getValues());
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
        seriesLabels.push.call(seriesLabels, q.getLabels());
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
      const continiousValues = this.getContiniousValues();
      this._cachedIntervals = [];
      if (continiousValues.length) {
        let start = continiousValues[0].continious;
        const end = continiousValues[continiousValues.length - 1].continious;
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

  protected getCalculatedValuesCore(): Array<any> {
    const continiousValues = this.getContiniousValues();
    const statistics: Array<Array<number>> = [];
    const series = this.getSeriesValues();
    const seriesValueTypes = [];
    if (series.length === 0) {
      series.push("");
      seriesValueTypes.push("enum");
    }
    for (var i = 0; i < this.questionsY.length; ++i) {
      const getQuestionValueType = this.getQuestionValueType(this.questionsY[i].question);
      if(getQuestionValueType === "enum") {
        this.questionsY[i].getValues().forEach(() => {
          seriesValueTypes.push("enum");
        });
      } else {
        seriesValueTypes.push(getQuestionValueType);
      }
    }
    if (this.valueType === "enum") {
      const values = this.getValues();
      const valuesIndexes = {};
      values.forEach((value, index) => {
        valuesIndexes[value] = index;
      });
      for (var i = 0; i < series.length; ++i) {
        statistics.push(values.map(i => 0));
      }
      this.data.forEach(dataRow => {
        const answerData = dataRow[this.name];
        if (answerData !== undefined && valuesIndexes[answerData] !== undefined) {
          const valueIndex = valuesIndexes[answerData];
          if(this.questionsY.length === 0) {
            statistics[0][valueIndex]++;
          } else {
            for (let j = 0; j < series.length; ++j) {
              if (dataRow[series[j]] !== undefined) {
                if (seriesValueTypes[j] === "enum" || seriesValueTypes[j] === "date") {
                  statistics[j][valueIndex]++;
                } else {
                  statistics[j][valueIndex] += parseFloat(dataRow[series[j]]);
                }
              }
            }
          }
        }
      });
    } else {
      const intervals = this.intervals;
      for (var i = 0; i < series.length; ++i) {
        statistics.push(intervals.map(i => 0));
      }
      this._continiousData.forEach(dataValue => {
        for (let valueIndex = 0; valueIndex < intervals.length; ++valueIndex) {
          if (intervals[valueIndex].start <= dataValue.continious && (dataValue.continious < intervals[valueIndex].end || valueIndex == intervals.length - 1)) {
            if(this.questionsY.length === 0) {
              statistics[0][valueIndex]++;
            } else {
              for (let j = 0; j < series.length; ++j) {
                if (dataValue.row[series[j]] !== undefined) {
                  if (seriesValueTypes[j] === "enum" || seriesValueTypes[j] === "date") {
                    statistics[j][valueIndex]++;
                  } else {
                    statistics[j][valueIndex] += parseFloat(dataValue.row[series[j]]);
                  }
                }
              }
            }
            break;
          }
        }
      });
    }
    return statistics;
  }
}
