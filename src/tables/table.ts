import { SurveyModel, Question, Event, settings, QuestionSelectBase, QuestionMatrixModel, ItemValue, JsonError, EventBase } from "survey-core";
import * as SurveyCore from "survey-core";
import {
  IPermission,
  QuestionLocation,
  ITableState,
  IColumn,
  IColumnData,
} from "./config";
import { Details } from "./extensions/detailsextensions";
import { localization } from "../localizationManager";
import { TableExtensions } from "./extensions/tableextensions";
import { createCommercialLicenseLink, createImagesContainer, createLinksContainer, DocumentHelper } from "../utils";
import { ColumnsBuilderFactory } from "./columnbuilder";
import { DefaultColumn } from "./columns";

export interface ITableOptions {
  [index: string]: any;

  /**
   * Set this property to true to render column headings using question names
   */
  useNamesAsTitles?: boolean;
  /**
   * Use this event to change the display value of question in table.
   * <br/> `sender` - the table object that fires the event.
   * <br/> `options.question` - the question obect for which event is fired.
   * <br/> `options.displayValue` - the question display value. You can change this option before it is displayed in the table.
   */
  onGetQuestionValue?: (options: {
    question: Question,
    displayValue: any,
  }) => void;
}

export type TabulatorFilter = { field: string, type: string, value: any };
export type TabulatorSortOrder = { field: string, direction: undefined | "asc" | "desc" };
export type GetDataUsingCallbackFn = (params: { filter?: Array<TabulatorFilter>, sort?: Array<TabulatorSortOrder>, offset?: number, limit?: number, callback?: (response: { data: Array<Object>, totalCount: number, error?: any }) => void }) => void;
export type GetDataUsingPromiseFn = (params: { filter?: Array<TabulatorFilter>, sort?: Array<TabulatorSortOrder>, offset?: number, limit?: number }) => Promise<{ data: Array<Object>, totalCount: number, error?: any }>;
export type GetDataFn = GetDataUsingCallbackFn | GetDataUsingPromiseFn;
// export type GetDataFn = (params: { filter?: any, limit?: number, offset?: number, callback?: (response: { data: Array<Object>, total: number, error?: any }) => void }) => Promise<{ data: Array<Object>, total: number, error?: any }> | void;

export class TableEvent extends EventBase<Table> {}

export abstract class Table {
  public static showFilesAsImages = false;
  public static haveCommercialLicense: boolean = false;
  protected tableData: any;
  protected extensions: TableExtensions;
  private haveCommercialLicense = false;
  protected _columns: Array<IColumn>;
  constructor(
    protected _survey: SurveyModel,
    protected data: Array<Object> | GetDataFn,
    protected _options: ITableOptions = {},
    protected _columnsData: Array<IColumnData> = []
  ) {
    if(!this._options) {
      this._options = {};
    }

    this._columns = this.buildColumns(_survey);
    this.initTableData(data);
    localization.currentLocale = this._survey.locale;
    this._columns = this.buildColumns(_survey);

    if(_columnsData.length !== 0) {
      this.updateColumnsFromData(this._columnsData);
    }

    this.extensions = new TableExtensions(this);
    const f = (<any>SurveyCore).hasLicense;
    this.haveCommercialLicense = (!!f && f(4)) ||
      Table.haveCommercialLicense ||
      (!!_options &&
        (typeof _options.haveCommercialLicense !== "undefined"
          ? _options.haveCommercialLicense
          : false));
  }
  protected renderResult: HTMLElement;
  protected currentPageSize: number = 5;
  protected currentPageNumber: number;
  protected _rows: TableRow[] = [];
  protected isColumnReorderEnabled: boolean;

  /**
   * Sets pagination selector content.
   */
  public paginationSizeSelector: number[] = [1, 5, 10, 25, 50, 100];

  public onColumnsVisibilityChanged = new TableEvent();

  public onColumnsLocationChanged = new TableEvent();

  public onRowRemoved =new TableEvent();

  public renderDetailActions: (
    container: HTMLElement,
    row: TableRow
  ) => HTMLElement;

  public getData() {
    return this.data;
  }
  public get survey() {
    return this._survey;
  }
  public get options() {
    return this._options;
  }

  public abstract applyFilter(value: string): void;
  public abstract applyColumnFilter(columnName: string, value: string): void;
  public abstract sortByColumn(columnName: string, direction: string): void;

  public render(targetNode: HTMLElement | string): void {
    if (typeof targetNode === "string") {
      targetNode = document.getElementById(targetNode);
    }
    targetNode.innerHTML = "";
    if (!this.haveCommercialLicense) {
      targetNode.appendChild(createCommercialLicenseLink());
    }
  }

  public enableColumnReorder() {
    this.isColumnReorderEnabled = true;
  }

  public disableColumnReorder(): void {
    this.isColumnReorderEnabled = false;
  }

  public getPageNumber(): number {
    return this.currentPageNumber;
  }

  public setPageNumber(value: number) {
    this.currentPageNumber = value;
  }

  /**
   * Returns current page size.
   */
  public getPageSize(): number {
    return this.currentPageSize;
  }

  /**
   * Sets current page size.
   */
  public setPageSize(value: number): void {
    this.currentPageSize = value;
    this.onStateChanged.fire(this, this.state);
  }

  public getCreatedRows(): TableRow[] {
    return [].concat(this._rows);
  }

  public clearCreatedRows(): void {
    this._rows.forEach((row) => {
      row.destroy();
    });
    this._rows = [];
  }

  public get useNamesAsTitles() {
    return this._options && this._options.useNamesAsTitles === true;
  }

  protected buildColumns = (survey: SurveyModel) => {
    let columns: Array<IColumn> = [];
    this._survey.getAllQuestions().forEach((question: Question) => {
      const builder = ColumnsBuilderFactory.Instance.getColumnsBuilder(question.getTemplate());
      columns = columns.concat(builder.buildColumns(question, this));
    });
    return columns;
  };

  public isColumnVisible(column: IColumn) {
    if (column.location !== QuestionLocation.Column) return false;
    return column.isVisible;
  }

  public get columns() {
    return [].concat(this._columns);
  }

  public set columns(columns: Array<IColumn>) {
    this._columns = columns;
    this.refresh(true);
    this.onStateChanged.fire(this, this.state);
  }
  public get isInitTableDataProcessing(): boolean { return this.isInitTableDataProcessingValue; }
  private isInitTableDataProcessingValue: boolean;
  protected processLoadedDataItem(item: any): any {
    var dataItem: any = {};
    this._survey.data = item;
    this._columns.forEach((column) => {
      const opt = column.getCellData(this, item);
      if (typeof this._options.onGetQuestionValue === "function") {
        this._options.onGetQuestionValue(opt);
      }
      dataItem[column.name] = opt.displayValue;
    });

    return dataItem;
  }
  protected initTableData(data: Array<any> | GetDataFn): void {
    if(!Array.isArray(data)) {
      this.tableData = undefined;
      return;
    }
    this.isInitTableDataProcessingValue = true;
    this.tableData = (data || []).map((item) => this.processLoadedDataItem(item));
    this.isInitTableDataProcessingValue = false;
  }

  public moveColumn(from: number, to: number) {
    var deletedColumns = this._columns.splice(from, 1);
    this._columns.splice(to, 0, deletedColumns[0]);
    this.onStateChanged.fire(this, this.state);
  }

  public setColumnLocation(columnName: string, location: QuestionLocation) {
    this.getColumnByName(columnName).location = location;
    this.onColumnsLocationChanged.fire(this, {
      columnName: columnName,
      location: location,
    });
    this.onStateChanged.fire(this, this.state);
  }

  public getColumnByName(columnName: string): IColumn {
    return this._columns.filter((column) => column.name === columnName)[0];
  }

  public setColumnVisibility(columnName: string, isVisible: boolean) {
    var column = this.getColumnByName(columnName);
    column.isVisible = isVisible;
    this.onColumnsVisibilityChanged.fire(this, {
      columnName: columnName,
      columnVisibility: isVisible,
    });
    this.onStateChanged.fire(this, this.state);
  }

  public setColumnWidth(columnName: string, width: string | number) {
    var column = this.getColumnByName(columnName);
    column.width = width;
    this.onStateChanged.fire(this, this.state);
  }

  public removeRow(row: TableRow): void {
    var index = this._rows.indexOf(row);
    this._rows.splice(index, 1);
    this.onRowRemoved.fire(this, { row: row });
  }

  /**
   * Returns current locale of the table.
   * If locales more than one, the language selection dropdown will be added in the toolbar
   */
  public get locale() {
    return localization.currentLocale;
  }

  /**
   * Sets locale for table.
   */
  public set locale(newLocale: string) {
    this._survey.locale = newLocale;
    localization.currentLocale = newLocale;
    this.refresh(true);
    this.onStateChanged.fire(this, this.state);
  }

  public getLocales(): Array<string> {
    return [].concat(this._survey.getUsedLocales());
  }

  public refresh(hard: boolean = false) {
    if (hard) {
      this.initTableData(this.data);
    }
    if (this.isRendered) {
      this.currentPageNumber = this.getPageNumber();
      const targetNode = this.renderResult;
      this.destroy();
      this.render(targetNode);
      this.setPageSize(this.currentPageSize);
      this.setPageNumber(this.currentPageNumber);
    }
  }

  public destroy() {
    this.clearCreatedRows();
    this.extensions.destroy();
    this.renderResult.innerHTML = "";
    this.renderResult = undefined;
  }

  public get isRendered() {
    return !!this.renderResult;
  }

  /**
   * Vizualization panel state getter.
   */
  public get state(): ITableState {
    return {
      locale: localization.currentLocale,
      elements: JSON.parse(JSON.stringify(this._columns)),
      pageSize: this.currentPageSize,
    };
  }
  /**
   * Vizualization panel state setter.
   */
  public set state(newState: ITableState) {
    if (!newState) return;

    if (typeof newState.locale !== "undefined") {
      localization.currentLocale = newState.locale;
      this._survey.locale = newState.locale;
      this.initTableData(this.data);
    }

    if (typeof newState.elements !== "undefined")
      this.updateColumnsFromData(newState.elements);
    if (typeof newState.pageSize !== "undefined")
      this.currentPageSize = newState.pageSize;
  }

  private updateColumnsFromData(columnsData: Array<IColumnData>) {
    const columns = this._columns;
    columns.forEach(column => {
      const el = columnsData.filter(el => column.name === el.name)[0];
      if(!!el) {
        column.fromJSON(el);
        column.visibleIndex = columnsData.indexOf(el);
      }
    });
    columnsData.forEach(el => {
      let column = columns.filter(column => column.name === el.name)[0];
      if(!column) {
        column = new DefaultColumn(undefined, this);
        column.fromJSON(el);
        column.visibleIndex = columnsData.indexOf(el);
        columns.push(column);
      }
    });
    this._columns = this._columns.sort((col1, col2) => col1.visibleIndex - col2.visibleIndex);
  }

  /**
   * Fires when table state changed.
   */
  public onStateChanged = new TableEvent();

  /**
   * Gets table permissions.
   */
  public get permissions(): IPermission[] {
    return <any>this._columns.map((column: IColumn) => {
      return {
        name: column.name,
        isPublic: column.isPublic,
      };
    });
  }
  /**
   * Sets table permissions.
   */
  public set permissions(permissions: IPermission[]) {
    const updatedElements = this._columns.map((column: IColumn) => {
      permissions.forEach((permission) => {
        if (permission.name === column.name)
          column.isPublic = permission.isPublic;
      });

      return column;
    });
    this._columns = [].concat(updatedElements);
    this.onPermissionsChangedCallback &&
      this.onPermissionsChangedCallback(this);
  }

  /**
   * Fires when permissions changed
   */
  public onPermissionsChangedCallback: any;
}

export abstract class TableRow {
  constructor(
    protected table: Table,
    protected extensionsContainer: HTMLElement,
    protected detailsContainer: HTMLElement
  ) {
    this.details = new Details(table, this, detailsContainer);
    this.extensions = new TableExtensions(table);
    table.onColumnsLocationChanged.add(this.onColumnLocationChangedCallback);
  }
  public details: Details;
  public extensions: TableExtensions;
  private detailedRowClass = "sa-table__detail-row";
  private isDetailsExpanded = false;
  public onToggleDetails: Event<
    (sender: TableRow, options: any) => any,
    TableRow,
    any
  > = new Event<(sender: TableRow, options: any) => any, TableRow, any>();

  /**
   * Returns row's html element
   */
  public abstract getElement(): HTMLElement;

  /**
   * Returns data, which is displayed in the row.
   */
  public abstract getRowData(): any;

  /**
   * Returns position of row in the table's data.
   */
  public abstract getDataPosition(): number;

  protected isSelected: boolean;

  public render() {
    this.extensions.render(this.extensionsContainer, "row", { row: this });
  }

  public openDetails() {
    this.details.open();
    this.getElement().className += " " + this.detailedRowClass;
    this.onToggleDetails.fire(this, { isExpanded: true });
    this.isDetailsExpanded = true;
  }

  public closeDetails() {
    this.details.close();
    this.getElement().classList.remove(this.detailedRowClass);
    this.onToggleDetails.fire(this, { isExpanded: false });
    this.isDetailsExpanded = false;
  }

  public toggleDetails() {
    if (this.isDetailsExpanded) {
      this.closeDetails();
    } else this.openDetails();
  }

  public getIsSelected(): boolean {
    return this.isSelected;
  }

  public toggleSelect(): void {
    this.isSelected = !this.isSelected;
  }

  public remove(): void {
    this.table.removeRow(this);
  }

  private onColumnLocationChangedCallback = () => {
    this.closeDetails();
  };

  public destroy(): void {
    this.table.onColumnsLocationChanged.remove(
      this.onColumnLocationChangedCallback
    );
    this.extensions.destroy();
  }
}