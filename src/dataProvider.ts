import { Event } from "survey-core";

/**
 * Describes data info:
 * dataName - question name, used as a key to obtain question data
 * getValues - function returning an array of all possible values
 * getLabels - function returning an array of human-friendly descriptions for values
 * getSeriesValues - function returning an array of all possible series values
 * getSeriesLabels - function returning an array of human-friendly descriptions for series values
 */
export interface IDataInfo {
  dataName: string;
  getValues(): Array<any>;
  getLabels(): Array<string>;
  getSeriesValues(): Array<string>;
  getSeriesLabels(): Array<string>;
}

export class DataProvider {
  public static seriesMarkerKey = "__sa_series_name";

  private _filteredData: Array<{ [index: string]: any }>;
  private _statisticsCache: { [index: string]: Array<Array<number>> };
  protected filterValues: { [index: string]: any } = {};

  constructor(private _data: Array<any> = [], private _getDataCore: (dataInfo: IDataInfo) => number[][]  = undefined) {}

  public reset() {
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
            (key) => item[key] !== this.filterValues[key]
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
    if(!!this._getDataCore) {
      return this._getDataCore(dataInfo);
    }

    const dataName = dataInfo.dataName;
    const statistics: Array<Array<number>> = [];

    const values = dataInfo.getValues();
    const valuesIndex: { [index: string]: number } = {};
    values.forEach((val: any, index: number) => {
      valuesIndex[val] = index;
    });

    const series = dataInfo.getSeriesValues();
    const seriesIndex: { [index: string]: number } = {};
    series.forEach((val: any, index: number) => {
      seriesIndex[val] = index;
      statistics.push(new Array<number>(values.length).fill(0));
    });

    if (statistics.length === 0) {
      statistics.push(new Array<number>(values.length).fill(0));
    }

    this.filteredData.forEach((row) => {
      const rowValue: any = row[dataName];
      if (rowValue !== undefined) {
        const rowValues = Array.isArray(rowValue) ? rowValue : [rowValue];
        if (series.length > 0) {
          if (row[DataProvider.seriesMarkerKey] !== undefined) {
            // Series are labelled by seriesMarkerKey in row data
            const seriesNo =
              seriesIndex[row[DataProvider.seriesMarkerKey]] || 0;
            rowValues.forEach((val) => {
              statistics[seriesNo][valuesIndex[val]]++;
            });
          } else {
            // Series are the keys in question value (matrix question)
            // TODO: think about the de-normalization and combine with the previous case
            rowValues.forEach((val) => {
              series.forEach((seriesName) => {
                if (val[seriesName] !== undefined) {
                  const seriesNo = seriesIndex[seriesName] || 0;
                  statistics[seriesNo][valuesIndex[val[seriesName]]]++;
                }
              });
            });
          }
        } else {
          // No series
          rowValues.forEach((val) => statistics[0][valuesIndex[val]]++);
        }
      }
    });

    this._statisticsCache[dataName] = statistics;
    return statistics;
  }

  /**
   * Returns calculated statisctics for the IDataInfo object.
   */
  getData(dataInfo: IDataInfo) {
    const dataName = dataInfo.dataName;
    if (
      this._statisticsCache === undefined ||
      this._statisticsCache[dataName] === undefined
    ) {
      if (this._statisticsCache === undefined) {
        this._statisticsCache = {};
      }
      this._statisticsCache[dataName] = this.getDataCore(dataInfo);
    }
    return [].concat(this._statisticsCache[dataName]);
  }

  /**
   * Fires when data has been changed.
   */
  public onDataChanged = new Event<
    (sender: DataProvider, options: any) => any,
    any
  >();

  protected raiseDataChanged() {
    if (!this.onDataChanged.isEmpty) {
      this.onDataChanged.fire(this, {});
    }
  }
}
