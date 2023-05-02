import { Event } from "survey-core";

export interface IDataInfo {
  name: string | Array<string>;
  getValues(): Array<any>;
  getLabels(): Array<string>;
  getSeriesValues(): Array<string>;
  getSeriesLabels(): Array<string>;
}

export class DataProvider {
  public static seriesMarkerKey = "__sa_series_name";

  private _filteredData: Array<{ [index: string]: any }>;
  private _statisticsCache: { [index: string]: Array<Array<number>> | Array<Array<Array<number>>> };
  protected filterValues: { [index: string]: any } = {};

  private getStatisticsCacheKey(dataInfo: IDataInfo): string {
    if (Array.isArray(dataInfo.name)) {
      return dataInfo.name.join("-");
    }
    return dataInfo.name;
  }

  constructor(private _data: Array<any> = [], private _getDataCore: (dataInfo: IDataInfo) => number[][] = undefined) { }

  public reset(dataInfo?: IDataInfo) {
    if (!!dataInfo) {
      if (this._statisticsCache !== undefined) {
        const cacheKey = this.getStatisticsCacheKey(dataInfo);
        delete this._statisticsCache[cacheKey];
      }
      return;
    }
    if (
      this._statisticsCache !== undefined ||
      this._filteredData !== undefined
    ) {
      this._statisticsCache = undefined;
      this._filteredData = undefined;
      this.raiseDataChanged();
    }
  }

  public get data() {
    return this._data;
  }
  public set data(data: Array<any>) {
    this._data = [].concat(data);
    this.reset();
  }

  public get filteredData() {
    if (this._filteredData === undefined) {
      let filterKeys = Object.keys(this.filterValues);
      if (filterKeys.length > 0) {
        this._filteredData = this.data.filter((item) => {
          return !Object.keys(this.filterValues).some(
            (key) => {
              const filterValue = this.filterValues[key];
              const filterValueType = typeof filterValue;
              const questionValue = item[key];
              if (Array.isArray(questionValue)) {
                if (filterValueType !== "object")
                  return questionValue.indexOf(filterValue) == -1;
              }
              if (typeof questionValue === "object") {
                if (filterValueType !== "object")
                  return true;
                return !questionContainsValue(questionValue, filterValue);
              }
              const seriesValue = item[DataProvider.seriesMarkerKey];
              if (!!seriesValue && filterValueType === "object") {
                return questionValue !== filterValue[seriesValue];
              }
              if (filterValueType === "object" && filterValue.start !== undefined && filterValue.end !== undefined) {
                let continioiusValue = typeof questionValue === "number" ? questionValue : Date.parse(questionValue);
                if (isNaN(continioiusValue)) {
                  continioiusValue = parseFloat(questionValue);
                  if (isNaN(continioiusValue)) {
                    return true;
                  }
                }
                return continioiusValue < filterValue.start || continioiusValue >= filterValue.end;
              }
              return item[key] !== this.filterValues[key];
            }
          );
        });
      } else {
        this._filteredData = this.data;
      }
    }
    return this._filteredData;
  }

  /**
   * Sets filter by question name and value.
   */
  public setFilter(questionName: string, selectedValue: any) {
    var filterChanged = true;
    if (selectedValue !== undefined) {
      filterChanged = this.filterValues[questionName] !== selectedValue;
      this.filterValues[questionName] = selectedValue;
    } else {
      filterChanged = this.filterValues[questionName] !== undefined;
      delete this.filterValues[questionName];
    }
    if (filterChanged) {
      this.reset();
    }
  }

  protected getDataCore(dataInfo: IDataInfo) {
    if (!!this._getDataCore) {
      return this._getDataCore(dataInfo);
    }

    const dataNames = Array.isArray(dataInfo.name) ? dataInfo.name : [dataInfo.name];
    const statistics: Array<Array<Array<number>>> = [];

    const values = dataInfo.getValues();
    const valuesIndex: { [index: string]: number } = {};
    values.forEach((val: any, index: number) => {
      valuesIndex[val] = index;
    });
    const processMissingAnswers = values.indexOf(undefined) !== -1;

    const series = dataInfo.getSeriesValues();
    const seriesIndex: { [index: string]: number } = {};
    series.forEach((val: any, index: number) => {
      seriesIndex[val] = index;
    });

    const seriesLength = series.length || 1;
    for (var i = 0; i < dataNames.length; ++i) {
      const dataNameStatistics = new Array<Array<number>>();
      for (var j = 0; j < seriesLength; ++j) {
        dataNameStatistics.push(new Array<number>(values.length).fill(0));
      }
      statistics.push(dataNameStatistics);
    }

    this.filteredData.forEach((row: any) => {
      dataNames.forEach((dataName, index) => {
        const rowValue: any = row[dataName];
        if (rowValue !== undefined || processMissingAnswers) {
          const rowValues = Array.isArray(rowValue) ? rowValue : [rowValue];
          if (series.length > 0) {
            if (row[DataProvider.seriesMarkerKey] !== undefined) {
              // Series are labelled by seriesMarkerKey in row data
              const seriesNo =
                seriesIndex[row[DataProvider.seriesMarkerKey]] || 0;
              rowValues.forEach((val) => {
                statistics[index][seriesNo][valuesIndex[val]]++;
              });
            } else {
              // Series are the keys in question value (matrix question)
              // TODO: think about the de-normalization and combine with the previous case
              rowValues.forEach((val) => {
                series.forEach((seriesName) => {
                  if (val[seriesName] !== undefined) {
                    const seriesNo = seriesIndex[seriesName] || 0;
                    statistics[index][seriesNo][valuesIndex[val[seriesName]]]++;
                  }
                });
              });
            }
          } else {
            // No series
            rowValues.forEach((val) => statistics[0][0][valuesIndex[val]]++);
          }
        }
      });
    });

    return Array.isArray(dataInfo.name) ? statistics : statistics[0];
  }

  /**
   * Returns calculated statisctics for the IDataInfo object.
   */
  getData(dataInfo: IDataInfo) {
    const cacheKey = this.getStatisticsCacheKey(dataInfo);
    if (
      this._statisticsCache === undefined ||
      this._statisticsCache[cacheKey] === undefined
    ) {
      if (this._statisticsCache === undefined) {
        this._statisticsCache = {};
      }
      this._statisticsCache[cacheKey] = this.getDataCore(dataInfo);
    }
    return [].concat(this._statisticsCache[cacheKey]);
  }

  /**
   * Fires when data has been changed.
   */
  public onDataChanged = new Event<
    (sender: DataProvider, options: any) => any,
    DataProvider,
    any
  >();

  protected raiseDataChanged() {
    if (!this.onDataChanged.isEmpty) {
      this.onDataChanged.fire(this, {});
    }
  }
}

function questionContainsValue(questionValue: any, filterValue: any) {
  const questionValueKeys = Object.keys(questionValue);
  const filterValueKeys = Object.keys(filterValue);

  if (filterValueKeys.length > questionValueKeys.length) return false;

  for (var key of filterValueKeys) {
    if (filterValue[key] != questionValue[key]) return false;
  }

  return true;
}

