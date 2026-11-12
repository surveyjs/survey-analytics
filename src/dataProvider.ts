import { Event } from "survey-core";
import { getValueByPath } from "./utils/dataPath";

export type SummaryFilter = { field: string, type: string, value: any };
export type GetDataUsingCallbackFn = (params: { visualizer: any, filter?: Array<SummaryFilter>, callback?: (response: { data: Array<Object>, error?: any }) => void }) => void;
export type GetDataUsingPromiseFn = (params: { visualizer: any, filter?: Array<SummaryFilter> }) => Promise<Array<Object>>;
export type GetDataFn = GetDataUsingCallbackFn | GetDataUsingPromiseFn;

export class DataProvider {
  public static seriesMarkerKey = "__sa_series_name";

  private _filteredData: Array<{ [index: string]: any }>;
  protected filterValues: { [index: string]: any } = {};
  protected systemFilterValues: { [index: string]: any } = {};
  // Nested data (survey-library #12233): the keys each filter reads a row by. A filter is reported and stored by
  // its field, the path joined with "."; the row is read by the path, so a dotted key ("a.b") stays one key.
  private filterPaths: { [field: string]: Array<string> } = {};

  private getFilterPath(field: string): Array<string> {
    return this.filterPaths[field] || [field];
  }

  private convertFilterValuesToSummaryFilters(filterValues: { [index: string]: any }): Array<SummaryFilter> {
    return Object.keys(filterValues).map(key => ({ field: key, type: "=", value: filterValues[key] }));
  }

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
      const filterValues = this.getFilterValues();
      let filterKeys = Object.keys(filterValues);
      if(filterKeys.length > 0) {
        this._filteredData = this.data.filter((item) => {
          return !filterKeys.some(
            (key) => {
              const filterValue = filterValues[key];
              let filterValueType: string = typeof filterValue;
              if(filterValueType === "object" && "start" in filterValue && "end" in filterValue) {
                filterValueType = "range";
              }
              const questionValue = getValueByPath(item, this.getFilterPath(key));
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
              if(filterValueType === "range") {
                if(filterValue.start === undefined && filterValue.end === undefined) {
                  return false;
                }

                let continioiusValue = typeof questionValue === "number" ? questionValue : Date.parse(questionValue);
                if(isNaN(continioiusValue)) {
                  continioiusValue = parseFloat(questionValue);
                  if(isNaN(continioiusValue)) {
                    return true;
                  }
                }
                if(filterValue.start !== undefined && filterValue.end !== undefined) {
                  return continioiusValue < filterValue.start || continioiusValue >= filterValue.end;
                }
                if(filterValue.start === undefined && filterValue.end !== undefined) {
                  return continioiusValue >= filterValue.end;
                }
                if(filterValue.start !== undefined && filterValue.end === undefined) {
                  return continioiusValue < filterValue.start;
                }
                return false;
              }
              return questionValue !== filterValue;
            }
          );
        });
      } else {
        this._filteredData = this.data;
      }
    }
    return this._filteredData;
  }

  private setFilterCore(path: Array<string>, selectedValue: any, filterObject: any): void {
    const questionName = path.join(".");
    if(selectedValue !== undefined) {
      this.filterPaths[questionName] = path;
    }
    var filterChanged = true;
    if(selectedValue !== undefined) {
      filterChanged = filterObject[questionName] !== selectedValue;
      if(filterChanged) {
        filterObject[questionName] = selectedValue;
      }
    } else {
      filterChanged = filterObject[questionName] !== undefined;
      if(filterChanged) {
        delete filterObject[questionName];
      }
    }
    if(filterChanged) {
      this.raiseFilterChanged(questionName, selectedValue);
      this.raiseDataChanged();
    }
  }

  private resetFilterCore(filterObject: any): void {
    if(Object.keys(filterObject).length === 0) {
      return;
    }
    Object.keys(filterObject).forEach(key => delete filterObject[key]);
    this.raiseFilterChanged();
    this.raiseDataChanged();
  }

  /**
   * Sets filter by question name and value.
   * @since 3.0.0
   */
  public setSystemFilter(questionName: string, selectedValue: any): void {
    this.setFilterCore([questionName], selectedValue, this.systemFilterValues);
  }

  /**
   * Resets filter.
   * @since 3.0.0
   */
  public resetSystemFilter(): void {
    this.resetFilterCore(this.systemFilterValues);
  }

  /**
   * Sets filter by question name and value.
   */
  public setFilter(questionName: string, selectedValue: any): void {
    this.setFilterCore([questionName], selectedValue, this.filterValues);
  }

  // Internal (nested data, survey-library #12233): filters by the value at a path of keys; the field is the path
  // joined with ".". A one-key path goes through setFilter.
  public setFilterByPath(path: Array<string>, selectedValue: any): void {
    if(path.length === 1) {
      this.setFilter(path[0], selectedValue);
    } else {
      this.setFilterCore(path, selectedValue, this.filterValues);
    }
  }

  /**
   * Resets filter.
   */
  public resetFilter(): void {
    this.resetFilterCore(this.filterValues);
  }

  /**
   * Fires when data has been changed.
   * @since 2.3.11
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

  public getAllFilters(): SummaryFilter[] {
    const filterValues = this.getFilterValues();
    return this.convertFilterValuesToSummaryFilters(filterValues);
  }

  public getFilters(): SummaryFilter[] {
    return this.convertFilterValuesToSummaryFilters(this.filterValues);
  }

  // valuePath: the matrix value's keys in a row (nested data, survey-library #12233), [dataNames[0]] by default.
  public fixDropdownData(dataNames: string[], valuePath?: Array<string>): void {
    const path = Array.isArray(valuePath) && valuePath.length > 0 ? valuePath : [dataNames[0]];
    const key = path[path.length - 1];
    // Assigning a "__proto__" key would set the row's prototype instead of its matrix value
    if(key === "__proto__") return;
    (this.data || []).forEach((dataItem) => {
      const container = getValueByPath(dataItem, path.slice(0, path.length - 1));
      if(!container || typeof container !== "object" || Array.isArray(container)) return;
      if(!Object.prototype.hasOwnProperty.call(container, key)) return;
      let rawDataItem = container[key];
      if(!!rawDataItem && typeof rawDataItem === "object" && !Array.isArray(rawDataItem)) {
        const arrayData = [];
        Object.keys(rawDataItem).forEach((key) => {
          var nestedDataItem = Object.assign({}, rawDataItem[key]);
          nestedDataItem[DataProvider.seriesMarkerKey] = key;
          arrayData.push(nestedDataItem);
        });
        container[key] = arrayData;
      }
    });
  }

  public getCount(): Promise<number> {
    return new Promise<number>(resolve => resolve(this.filteredData.length));
  }

  public getFilterValues(): {} {
    const combinedFilterValues = Object.assign({}, this.systemFilterValues, this.filterValues);
    return combinedFilterValues;
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

function isPlainObject(value: any): boolean {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function questionValueContainsValue(questionValue: any, filterValue: any) {
  const questionValueKeys = Object.keys(questionValue);
  const filterValueKeys = Object.keys(filterValue);

  if(filterValueKeys.length > questionValueKeys.length) return false;

  for(var key of filterValueKeys) {
    // A records filter takes the shape of a record: { address: { kind: "a" } } (nested data, survey-library #12233)
    if(isPlainObject(filterValue[key]) && isPlainObject(questionValue[key])) {
      if(!questionValueContainsValue(questionValue[key], filterValue[key])) return false;
    } else if(filterValue[key] != questionValue[key]) return false;
  }

  return true;
}
