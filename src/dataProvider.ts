import { Event } from "survey-core";

export type SummaryFilter = { field: string, type: string, value: any };
export type GetDataUsingCallbackFn = (params: { visualizer: any, questionName: string, filter?: Array<SummaryFilter>, callback?: (response: { data: Array<Object>, error?: any }) => void }) => void;
export type GetDataUsingPromiseFn = (params: { visualizer: any, questionName: string, filter?: Array<SummaryFilter> }) => Promise<Array<Object>>;
export type GetDataFn = GetDataUsingCallbackFn | GetDataUsingPromiseFn;

export class DataProvider {
  public static seriesMarkerKey = "__sa_series_name";

  private _filteredData: Array<{ [index: string]: any }>;
  protected filterValues: { [index: string]: any } = {};

  constructor(private _data: Array<any> | GetDataFn = []) {
  }

  public get data(): Array<any> {
    if(Array.isArray(this._data)) {
      return this._data;
    }
    return undefined;
  }
  public set data(data: Array<any> | GetDataFn) {
    if(Array.isArray(data)) {
      this._data = [].concat(data);
    } else {
      this._data = data;
    }
    this.raiseDataChanged();
  }
  public get dataFn(): GetDataFn {
    if(typeof this._data === "function") {
      return this._data;
    }
    return undefined;
  }

  public get filteredData(): Array<any> {
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
  public setFilter(questionName: string, selectedValue: any): void {
    var filterChanged = true;
    if (selectedValue !== undefined) {
      filterChanged = this.filterValues[questionName] !== selectedValue;
      this.filterValues[questionName] = selectedValue;
    } else {
      filterChanged = this.filterValues[questionName] !== undefined;
      delete this.filterValues[questionName];
    }
    if (filterChanged) {
      this.raiseDataChanged();
    }
  }

  /**
   * Fires when data has been changed.
   */
  public onDataChanged = new Event<
    (sender: DataProvider, options: any) => any,
    DataProvider,
    any
  >();

  public raiseDataChanged(questionName?: string): void {
    this._filteredData = undefined;
    if (!this.onDataChanged.isEmpty) {
      this.onDataChanged.fire(this, { questionName });
    }
  }

  public getFilters(): SummaryFilter[] {
    return Object.keys(this.filterValues).map(key => ({ field: key, type: "=", value: this.filterValues[key] }));
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
