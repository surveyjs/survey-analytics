import { ItemValue, Question } from "survey-core";
import { DataProvider } from "./dataProvider";
import { IAnswersData, SelectBase } from "./selectBase";
import { VisualizationManager } from "./visualizationManager";
import { histogramStatisticsCalculator } from "./statisticCalculators";
import { DocumentHelper } from "./utils";
import { localization } from "./localizationManager";

export declare type HistogramIntervalMode = "auto" | "custom" | "decades" | "years" | "quarters" | "months" | "days";
export interface IHistogramInterval { start: number, end: number, label: string }

function getQuarter(date: Date): string {
  switch(Math.floor(date.getMonth() / 3) + 1) {
    case 1: return "I";
    case 2: return "II";
    case 3: return "III";
    case 4: return "IV";
  }
}

export function getBestIntervalMode(min: number, max: number): HistogramIntervalMode {
  const start = new Date(min);
  const end = new Date(max);
  const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if(totalMonths > 10 * 12) return "decades";
  if(totalMonths > 2 * 12) return "years";
  if(totalMonths > 1 * 12) return "quarters";
  if(totalMonths > 4) return "months";
  return "days";
}

export const intervalCalculators = {
  decades: (min: number, max: number) => {
    const intervals = [];
    let start = new Date(min);
    start.setFullYear(Math.floor(start.getFullYear() / 10) * 10);
    start.setMonth(0);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    let startYear = start.getFullYear();
    const end = new Date(max);
    const endYear = end.getFullYear();
    while (startYear <= endYear) {
      const intervalStart = new Date(startYear, 0, 1);
      const intervalEnd = new Date(startYear + 10, 0, 1);
      intervals.push({
        start: intervalStart.getTime(),
        end: intervalEnd.getTime(),
        label: "" + startYear + "s"
      });
      startYear += 10;
    }
    return intervals;
  },
  years: (min: number, max: number) => {
    const intervals = [];
    let start = new Date(min);
    start.setMonth(0);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    let startYear = start.getFullYear();
    const end = new Date(max);
    const endYear = end.getFullYear();
    while (startYear <= endYear) {
      const intervalStart = new Date(startYear, 0, 1);
      const intervalEnd = new Date(startYear + 1, 0, 1);
      intervals.push({
        start: intervalStart.getTime(),
        end: intervalEnd.getTime(),
        label: "" + startYear
      });
      startYear++;
    }
    return intervals;
  },
  months: (min: number, max: number) => {
    const intervals = [];
    let start = new Date(min);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    let startYear = start.getFullYear();
    let startMonth = start.getMonth();
    const end = new Date(max);
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    while (startYear < endYear || (startYear === endYear && startMonth <= endMonth)) {
      const intervalStart = new Date(startYear, startMonth, 1);
      const intervalEnd = new Date(startYear, startMonth + 1, 1);
      intervals.push({
        start: intervalStart.getTime(),
        end: intervalEnd.getTime(),
        label: intervalStart.toLocaleDateString(undefined, { year: "numeric", month: "short" })
      });
      startMonth++;
      if (startMonth >= 12) {
        startMonth = 0;
        startYear++;
      }
    }
    return intervals;
  },
  quarters: (min: number, max: number) => {
    const intervals = [];
    let start = new Date(min);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    let startYear = start.getFullYear();
    let startMonth = start.getMonth();
    const end = new Date(max);
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    while (startYear < endYear || (startYear === endYear && startMonth <= endMonth)) {
      const intervalStart = new Date(startYear, startMonth, 1);
      const intervalEnd = new Date(startYear, startMonth + 3, 1);
      intervals.push({
        start: intervalStart.getTime(),
        end: intervalEnd.getTime(),
        label: getQuarter(intervalStart) + " " + intervalStart.getFullYear().toString()
      });
      startMonth += 3;
      if (startMonth >= 12) {
        startMonth = startMonth % 12;
        startYear++;
      }
    }
    return intervals;
  },
  days: (min: number, max: number) => {
    const intervals = [];
    let start = new Date(min);
    start.setHours(0, 0, 0, 0);
    const end = new Date(max);
    end.setHours(0, 0, 0, 0);
    while (start <= end) {
      const intervalStart = new Date(start);
      const intervalEnd = new Date(start);
      intervalEnd.setDate(intervalEnd.getDate() + 1);
      intervals.push({
        start: intervalStart.getTime(),
        end: intervalEnd.getTime(),
        label: intervalStart.toLocaleDateString()
      });
      start.setDate(start.getDate() + 1);
    }
    return intervals;
  }
};

export class HistogramModel extends SelectBase {
  protected valueType: "date" | "number" = "number";
  private _cachedValues: Array<{ original: any, continuous: number, row: any }> = undefined;
  private _continuousData: { [series: string]: Array<{continuous: number, row: any}> } = undefined;
  private _cachedIntervals: Array<{ start: number, end: number, label: string }> = undefined;
  private _intervalPrecision: number = 2;
  private showRunningTotalsBtn: HTMLElement = undefined;
  private showGroupedBtn: HTMLElement = undefined;
  private changeIntervalsModeSelector: HTMLDivElement = undefined;
  private aggregateDataNameSelector: HTMLDivElement = undefined;
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
    this._intervalsMode = this.valueType === "date" ? "auto" : "default" as any;

    if(this.allowChangeIntervals) {
      this.registerToolbarItem("changeIntervalsMode", () => {
        this.changeIntervalsModeSelector = DocumentHelper.createSelector(
          this.intervalModes.map((intervalModeValue) => {
            return {
              value: intervalModeValue,
              text: localization.getString("intervalMode_" + intervalModeValue),
            };
          }),
          (option: any) => this.intervalsMode === option.value,
          (e: any) => {
            this.intervalsMode = e.target.value;
          },
          localization.getString("intervalModeTitle")
        );
        return this.changeIntervalsModeSelector;
      });
    }
    if (this.possibleAggregateDataNames.length > 0) {
      this.registerToolbarItem("aggregateDataName", () => {
        const choices = this.possibleAggregateDataNames.map((dataName) => {
          return typeof dataName === "string" ? { value: dataName, text: dataName } : dataName;
        });
        choices.unshift({ value: "", text: localization.getString("noneAggregateText") }),

        this.aggregateDataNameSelector = DocumentHelper.createSelector(
          choices,
          (option: any) => this.aggregateDataName === option.value,
          (e) => {
            this.aggregateDataName = e.target.value;
          },
          localization.getString("selectAggregateText")
        );
        this.updateAggregateDataNameSelector();
        return this.aggregateDataNameSelector;
      });
    }
    if(this.allowChangeIntervals && this.options.allowRunningTotals) {
      this.registerToolbarItem("showRunningTotals", () => {
        this.showRunningTotalsBtn = DocumentHelper.createButton(() => {
          this.showRunningTotals = !this.showRunningTotals;
        });
        this.updateShowRunningTotalsBtn();
        return this.showRunningTotalsBtn;
      });
    }
    if(this.allowChangeIntervals && this.options.allowCompareDatePeriods) {
      this.registerToolbarItem("showGrouped", () => {
        this.showGroupedBtn = DocumentHelper.createButton(() => {
          this.showGrouped = !this.showGrouped;
        });
        this.updateShowGroupedBtn();
        return this.showGroupedBtn;
      });
    }
  }

  private updateIntervalsModeSelector() {
    if (!!this.changeIntervalsModeSelector) {
      this.changeIntervalsModeSelector.getElementsByTagName(
        "select"
      )[0].value = this.intervalsMode;
    }
  }

  private updateAggregateDataNameSelector() {
    if (!!this.aggregateDataNameSelector) {
      this.aggregateDataNameSelector.getElementsByTagName(
        "select"
      )[0].value = this.aggregateDataName;
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

  protected onSelectionChanged(item: ItemValue): void {
    if (item !== undefined && this.onDataItemSelected !== undefined) {
      if (this.valueType === "date") {
        const currIntervalCalueIndex = this.intervalModes.indexOf(this.intervalsMode);
        if(currIntervalCalueIndex > 0 && currIntervalCalueIndex < this.intervalModes.length - 1) {
          this.intervalsMode = this.intervalModes[currIntervalCalueIndex + 1];
        }
      }
    }
    super.onSelectionChanged(item);
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
        const answerData = dataItem[this.dataNames[0]];
        if (answerData !== undefined) {
          const seriesValue = dataItem[DataProvider.seriesMarkerKey] || "";
          // TODO: _continuousData should be sorted in order to speed-up statistics calculation in the getData function
          this._continuousData[seriesValue].push({ continuous: this.getContinuousValue(answerData), row: dataItem });
          hash[answerData] = answerData;
        }
      });
      this._cachedValues = Object.keys(hash).map(key => ({ original: hash[key], continuous: this.getContinuousValue(key), row: hash[key].row }));
      this._cachedValues.sort((a, b) => a.continuous - b.continuous);
    }
    return this._cachedValues;
  }

  protected isSupportSoftUpdateContent(): boolean {
    return false;
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
        const intervalsMode = this.intervalsMode === "auto" ? getBestIntervalMode(start, end) : this.intervalsMode;
        if(intervalCalculators[intervalsMode] !== undefined) {
          this._cachedIntervals = intervalCalculators[intervalsMode](start, end);
        } else {
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
    }
    return this._cachedIntervals;
  }

  public intervalModes: HistogramIntervalMode[] = ["auto", "decades", "years", "quarters", "months", "days"];

  private _intervalsMode: HistogramIntervalMode;
  public get intervalsMode(): HistogramIntervalMode {
    if(this.hasCustomIntervals) return "custom";
    return this._intervalsMode;
  }
  public set intervalsMode(val: HistogramIntervalMode) {
    if (this.allowChangeIntervals && this._intervalsMode !== val) {
      this._intervalsMode = val;
      if(!this.canShowGroupedDateSeries) {
        this._showGrouped = false;
      }
      this.updateIntervalsModeSelector();
      this.updateShowGroupedBtn();
      this.onDataChanged();
    }
  }

  public get allowChangeIntervals(): boolean {
    return this.valueType === "date" && !this.hasCustomIntervals && this.options.allowChangeIntervals === true;
  }

  private _showRunningTotals: boolean = false;
  public get showRunningTotals(): boolean {
    return this._showRunningTotals;
  }
  public set showRunningTotals(val: boolean) {
    this._showRunningTotals = val;
    this.updateShowRunningTotalsBtn();
    this.stateChanged("showRunningTotals", val);
    this.refreshContent();
  }

  private updateShowRunningTotalsBtn() {
    if (!!this.showRunningTotalsBtn) {
      this.showRunningTotalsBtn.innerText = this.showRunningTotals
        ? localization.getString("noRunningTotals")
        : localization.getString("runningTotals");
    }
  }

  private _showGrouped: boolean = false;
  public get showGrouped(): boolean {
    return this._showGrouped;
  }
  public set showGrouped(val: boolean) {
    this._showGrouped = val;
    this.updateShowGroupedBtn();
    this.stateChanged("showGrouped", val);
    this.refreshContent();
  }

  private updateShowGroupedBtn() {
    if (!!this.showGroupedBtn) {
      this.showGroupedBtn.innerText = this.showGrouped
        ? localization.getString("ungroupDateSeries")
        : localization.getString("groupDateSeries");
      this.showGroupedBtn.style.display = this.canShowGroupedDateSeries ? "inline" : "none";
    }
  }

  public get canShowGroupedDateSeries(): boolean {
    return ["years", "quarters", "months"].indexOf(this.intervalsMode) !== -1;
  }

  private _aggregateDataName: string = "";
  public get aggregateDataName(): string {
    return this._aggregateDataName;
  }
  public set aggregateDataName(val: string) {
    if (this._aggregateDataName !== val) {
      this._aggregateDataName = val;
      this.onDataChanged();
    }
  }

  public get possibleAggregateDataNames(): Array<string> {
    return this.questionOptions?.aggregateDataNames ?? [];
  }

  public convertFromExternalData(externalCalculatedData: any): any[] {
    return [externalCalculatedData];
  }

  protected getCalculatedValuesCore(): Array<any> {
    const continuousValues = this.getContinuousValues();
    return histogramStatisticsCalculator(this._continuousData, this.intervals, this.getSeriesValues(), [this.aggregateDataName].filter(name => !!name));
  }

  public async getCalculatedValues(): Promise<Array<Object>> {
    const values = await super.getCalculatedValues();
    const result: Array<Array<number>> = JSON.parse(JSON.stringify(values));
    if(this.showRunningTotals) {
      for(let i = 0; i < result.length; i++) {
        for(let j = 1; j < result[i].length; j++) {
          result[i][j] += result[i][j - 1];
        }
      }
    }
    return result;
  }

  private async getGroupedDateAnswersData(): Promise<IAnswersData> {
    let datasets = (await this.getCalculatedValues()) as number[][];
    let colors = this.getColors();
    let labels = this.getLabels();
    let seriesLabels = this.getSeriesLabels();

    const intervals = [].concat(this.intervals);
    const start = new Date(intervals[0].start);
    const end = new Date(intervals[intervals.length - 1].end);
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    if(this.intervalsMode === "years") {
      seriesLabels = [];
      const groupedDatasets = [];
      for(let year = Math.floor(startYear / 10) * 10; year <= endYear; year += 10) {
        seriesLabels.push(year.toString() + "s");
        groupedDatasets.push(new Array(10).fill(0));
      }
      for(let i = 0; i < intervals.length; i++) {
        const interval = intervals[i];
        const intervalDate = new Date(interval.start);
        const decade = Math.floor(intervalDate.getFullYear() / 10) * 10;
        const yearInDecade = intervalDate.getFullYear() - decade;
        const decadeIndex = Math.floor((decade - Math.floor(startYear / 10) * 10) / 10);
        groupedDatasets[decadeIndex][yearInDecade] = datasets[0][i];
      }
      datasets = groupedDatasets;
      labels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    } else if(this.intervalsMode === "quarters") {
      seriesLabels = [];
      const groupedDatasets = [];
      for(let year = startYear; year <= endYear; year++) {
        seriesLabels.push(year.toString());
        groupedDatasets.push(new Array(4).fill(0));
      }
      for(let i = 0; i < intervals.length; i++) {
        const interval = intervals[i];
        const intervalDate = new Date(interval.start);
        const quarter = Math.floor(intervalDate.getMonth() / 3);
        const year = intervalDate.getFullYear();
        const yearIndex = year - startYear;
        groupedDatasets[yearIndex][quarter] = datasets[0][i];
      }
      datasets = groupedDatasets;
      labels = ["I", "II", "III", "IV"];
    } else if(this.intervalsMode === "months") {
      seriesLabels = [];
      const groupedDatasets = [];
      for(let year = startYear; year <= endYear; year++) {
        seriesLabels.push(year.toString());
        groupedDatasets.push(new Array(12).fill(0));
      }
      for(let i = 0; i < intervals.length; i++) {
        const interval = intervals[i];
        const intervalDate = new Date(interval.start);
        const month = intervalDate.getMonth();
        const year = intervalDate.getFullYear();
        const yearIndex = year - startYear;
        groupedDatasets[yearIndex][month] = datasets[0][i];
      }
      datasets = groupedDatasets;
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }

    let texts = datasets;
    return {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    };
  }

  /**
   * Returns object with all infotmation for data visualization: datasets, labels, colors, additional texts (percentage).
   */
  public async getAnswersData(): Promise<IAnswersData> {
    if(!this.showGrouped) {
      return super.getAnswersData();
    }

    const answersData = await this.getGroupedDateAnswersData();

    const continuousValues = this.getContinuousValues();
    if (continuousValues.length) {
      let start = continuousValues[0].continuous;
      const end = continuousValues[continuousValues.length - 1].continuous;
      const intervalsMode = this.intervalsMode === "auto" ? getBestIntervalMode(start, end) : this.intervalsMode;
      if(intervalsMode === "years" && this.showGrouped) {
        answersData.labelsTitle = localization.getString("groupedYearsAxisTitle");
      }
    }

    this.onAnswersDataReady.fire(this, answersData);

    return answersData;
  }

  public getValueType(): "date" | "number" {
    return this.valueType;
  }
}

VisualizationManager.registerVisualizer("date", HistogramModel);
VisualizationManager.registerVisualizer("number", HistogramModel, 100);
VisualizationManager.registerVisualizer("rating", HistogramModel, 300);