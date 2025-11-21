import { Event } from "survey-core";

export type SummaryFilter = { field: string, type: string, value: any };
export type GetDataUsingCallbackFn = (params: { visualizer: any, filter?: Array<SummaryFilter>, callback?: (response: { data: Array<Object>, error?: any }) => void }) => void;
export type GetDataUsingPromiseFn = (params: { visualizer: any, filter?: Array<SummaryFilter> }) => Promise<Array<Object>>;
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
    if(this._filteredData === undefined) {
      let filterKeys = Object.keys(this.filterValues);
      if(filterKeys.length > 0) {
        this._filteredData = this.data.filter((item) => {
          return !Object.keys(this.filterValues).some(
            (key) => {
              const filterValue = this.filterValues[key];
              const filterValueType = typeof filterValue;
              const questionValue = item[key];
              if(Array.isArray(questionValue)) {
                if(filterValueType === "object") {
                  return !questionArrayValueContainsValue(questionValue, filterValue);
                } else {
                  return questionValue.indexOf(filterValue) == -1;
                }
              }
              if(typeof questionValue === "object") {
                if(filterValueType !== "object")
                  return true;
                return !questionValueContainsValue(questionValue, filterValue);
              }
              const seriesValue = item[DataProvider.seriesMarkerKey];
              if(!!seriesValue && filterValueType === "object") {
                return questionValue !== filterValue[seriesValue];
              }
              if(filterValueType === "object" && filterValue.start !== undefined && filterValue.end !== undefined) {
                let continioiusValue = typeof questionValue === "number" ? questionValue : Date.parse(questionValue);
                if(isNaN(continioiusValue)) {
                  continioiusValue = parseFloat(questionValue);
                  if(isNaN(continioiusValue)) {
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
    if(selectedValue !== undefined) {
      filterChanged = this.filterValues[questionName] !== selectedValue;
      if(filterChanged) {
        this.filterValues[questionName] = selectedValue;
      }
    } else {
      filterChanged = this.filterValues[questionName] !== undefined;
      if(filterChanged) {
        delete this.filterValues[questionName];
      }
    }
    if(filterChanged) {
      this.raiseFilterChanged(questionName, selectedValue);
      this.raiseDataChanged();
    }
  }

  /**
   * Resets filter.
   */
  public resetFilter(): void {
    if(Object.keys(this.filterValues).length === 0) {
      return;
    }
    Object.keys(this.filterValues).forEach(key => delete this.filterValues[key]);
    this.raiseFilterChanged();
    this.raiseDataChanged();
  }

  /**
   * Fires when data has been changed.
   */
  public onFilterChanged = new Event<
    (sender: DataProvider, options: any) => any,
    DataProvider,
    any
  >();

  public raiseFilterChanged(questionName?: string, selectedValue?: any): void {
    if(!this.onFilterChanged.isEmpty) {
      this.onFilterChanged.fire(this, { questionName, selectedValue });
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
    if(!this.onDataChanged.isEmpty) {
      this.onDataChanged.fire(this, { questionName });
    }
  }

  public getFilters(): SummaryFilter[] {
    return Object.keys(this.filterValues).map(key => ({ field: key, type: "=", value: this.filterValues[key] }));
  }

  public fixDropdownData(dataNames: string[]): void {
    (this.data || []).forEach((dataItem) => {
      let rawDataItem = dataItem[dataNames[0]];
      if(!!rawDataItem && typeof rawDataItem === "object" && !Array.isArray(rawDataItem)) {
        const arrayData = [];
        Object.keys(rawDataItem).forEach((key) => {
          var nestedDataItem = Object.assign({}, rawDataItem[key]);
          nestedDataItem[DataProvider.seriesMarkerKey] = key;
          arrayData.push(nestedDataItem);
        });
        dataItem[dataNames[0]] = arrayData;
      }
    });
  }
}

function questionArrayValueContainsValue(questionValues: Array<any>, filterValue: any) {
  for(let i = 0; i < questionValues.length; i ++) {
    if(questionValueContainsValue(questionValues[i], filterValue)) {
      return true;
    }
  }
  return false;
}

function questionValueContainsValue(questionValue: any, filterValue: any) {
  const questionValueKeys = Object.keys(questionValue);
  const filterValueKeys = Object.keys(filterValue);

  if(filterValueKeys.length > questionValueKeys.length) return false;

  for(var key of filterValueKeys) {
    if(filterValue[key] != questionValue[key]) return false;
  }

  return true;
}
