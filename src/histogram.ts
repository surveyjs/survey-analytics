import { ItemValue, Question } from "survey-core";
import { DataProvider } from "./dataProvider";
import { SelectBase } from "./selectBase";
import { VisualizationManager } from "./visualizationManager";
import { histogramStatisticsCalculator } from "./statisticCalculators";

export class HistogramModel extends SelectBase {
  protected valueType: "date" | "number" = "number";
  private _cachedValues: Array<{ original: any, continuous: number }> = undefined;
  private _continuousData: { [series: string]: Array<number> } = undefined;
  private _cachedIntervals: Array<{ start: number, end: number, label: string }> = undefined;
  private _intervalPrecision: number = 2;

  public static IntervalsCount = 10;
  public static UseIntervalsFrom = 10;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "histogram");
    this._transposeData = false;
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
    if (this.hasCustomIntervals || this.getContinuousValues().length > HistogramModel.UseIntervalsFrom) {
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
      const series = this.getSeriesValues();
      if (series.length === 0) {
        series.push("");
      }
      this._continuousData = {};
      series.forEach(seriesValue => this._continuousData[seriesValue] = []);
      const hash = {};
      this.data.forEach(dataItem => {
        const answerData = dataItem[this.name];
        if (answerData !== undefined) {
          const seriesValue = dataItem[DataProvider.seriesMarkerKey] || "";
          // TODO: _continuousData should be sorted in order to speed-up statistics calculation in the getData function
          this._continuousData[seriesValue].push(this.getContinuousValue(answerData));
          hash[answerData] = answerData;
        }
      });
      this._cachedValues = Object.keys(hash).map(key => ({ original: hash[key], continuous: this.getContinuousValue(key) }));
      this._cachedValues.sort((a, b) => a.continuous - b.continuous);
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
        rateValues.sort((iv1, iv2) => iv1.value - iv2.value);
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
      const continuousValues = this.getContinuousValues();
      this._cachedIntervals = [];
      if (continuousValues.length) {
        let start = continuousValues[0].continuous;
        const end = continuousValues[continuousValues.length - 1].continuous;
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

  public convertFromExternalData(externalCalculatedData: any): any[] {
    return [externalCalculatedData];
  }

  protected getCalculatedValuesCore(): Array<any> {
    const continuousValues = this.getContinuousValues();
    return histogramStatisticsCalculator(this._continuousData, this.intervals, this.getSeriesValues());
  }

  public getValueType(): "date" | "number" {
    return this.valueType;
  }
}

VisualizationManager.registerVisualizer("date", HistogramModel);
VisualizationManager.registerVisualizer("number", HistogramModel, 100);
VisualizationManager.registerVisualizer("rating", HistogramModel, 300);