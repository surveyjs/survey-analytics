import { ItemValue, Question } from "survey-core";
import { DataProvider } from "./dataProvider";
import { SelectBase } from "./selectBase";

export class HistogramModel extends SelectBase {
  protected valueType: "date" | "number" = "number";
  private _cachedValues: Array<{ original: any, continious: number }> = undefined;
  private _continiousData: { [series: string]: Array<number> } = undefined;
  private _cachedIntervals: Array<{ start: number, end: number, label: string }> = undefined;
  private _intervalPrecision: number = 2;
  protected chartTypes: string[];

  public static IntervalsCount = 10;
  public static UseIntervalsFrom = 10;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "histogram");
    if (this.options.intervalPrecision !== undefined) {
      this._intervalPrecision = this.options.intervalPrecision;
    }
    const questionType = question.getType();
    if (questionType === "text" && (question["inputType"] === "date" || question["inputType"] === "datetime")) {
      this.valueType = "date";
    } else {
      this.valueType = "number";
    }
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
    if (this.hasCustomIntervals || this.getContiniousValues().length > HistogramModel.UseIntervalsFrom) {
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
      const series = this.getSeriesValues();
      if (series.length === 0) {
        series.push("");
      }
      this._continiousData = {};
      series.forEach(seriesValue => this._continiousData[seriesValue] = []);
      const hash = {};
      this.data.forEach(dataItem => {
        const answerData = dataItem[this.name as string];
        if (answerData !== undefined) {
          const seriesValue = dataItem[DataProvider.seriesMarkerKey] || "";
          // TODO: _continiousData should be sorted in order to speed-up statistics calculation in the getData function
          this._continiousData[seriesValue].push(this.getContiniousValue(answerData));
          hash[answerData] = answerData;
        }
      });
      this._cachedValues = Object.keys(hash).map(key => ({ original: hash[key], continious: this.getContiniousValue(key) }));
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

  public getValues(): Array<any> {
    return this.intervals.map(interval => interval.start);
  }

  public getLabels(): Array<string> {
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
        return rateValues.map((rateValue, i) => ({
          start: rateValue.value,
          end: i < rateValues.length - 1 ? rateValues[i + 1].value : rateValue.value + 1,
          label: rateValue.text
        }));
      } else {
        const rateIntervals = [];
        for(let i = (this.question["rateMin"] || 0); i <= (this.question["rateMax"] || (HistogramModel.IntervalsCount - 1)); i += (this.question["rateStep"] || 1)) {
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
        const intervalsCount = HistogramModel.IntervalsCount;
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

  public getCalculatedValues(): any {
    const continiousValues = this.getContiniousValues();
    const intervals = this.intervals;
    const statistics: Array<Array<number>> = [];
    const series = this.getSeriesValues();
    if (series.length === 0) {
      series.push("");
    }
    for (var i = 0; i < series.length; ++i) {
      statistics.push(intervals.map(i => 0));
      this._continiousData[series[i]].forEach(dataValue => {
        for (let j = 0; j < intervals.length; ++j) {
          if (intervals[j].start <= dataValue && (dataValue < intervals[j].end || j == intervals.length - 1)) {
            statistics[i][j]++;
            break;
          }
        }
      });
    }
    return statistics;
  }
}
