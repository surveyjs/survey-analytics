import { SurveyModel, Question, Event } from "survey-core";
import {
  IPermission,
  QuestionLocation,
  ColumnDataType,
  ITableState,
  ITableColumn,
} from "./config";
import { Details } from "./extensions/detailsextensions";
import { localization } from "../localizationManager";
import { TableExtensions } from "./extensions/tableextensions";
import {
  createCommercialLicenseLink,
  createLinksContainer,
} from "../utils";

export abstract class Table {
  public static haveCommercialLicense: boolean = false;
  protected tableData: any;
  protected extensions: TableExtensions;
  private haveCommercialLicense = false;
  constructor(
    protected survey: SurveyModel,
    protected data: Array<Object>,
    protected options: any,
    protected _columns: Array<any> = []
  ) {
    if (_columns.length === 0) {
      this._columns = this.buildColumns(survey);
    }
    this.initTableData(data);
    localization.currentLocale = this.survey.locale;

    if (_columns.length === 0) {
      this._columns = this.buildColumns(survey);
    }
    this.extensions = new TableExtensions(this);

    this.haveCommercialLicense =
      Table.haveCommercialLicense ||
      (!!options &&
        (typeof options.haveCommercialLicense !== "undefined"
          ? options.haveCommercialLicense
          : false));
  }
  protected renderResult: HTMLElement;
  protected currentPageSize: number = 5;
  protected currentPageNumber: number;
  protected _rows: TableRow[] = [];
  protected isColumnReorderEnabled: boolean;

  public onColumnsVisibilityChanged: Event<
    (sender: Table, options: any) => any,
    any
  > = new Event<(sender: Table, options: any) => any, any>();

  public onColumnsLocationChanged: Event<
    (sender: Table, options: any) => any,
    any
  > = new Event<(sender: Table, options: any) => any, any>();

  public onRowRemoved: Event<
    (sender: Table, options: any) => any,
    any
  > = new Event<(sender: Table, options: any) => any, any>();

  public renderDetailActions: (
    container: HTMLElement,
    row: TableRow
  ) => HTMLElement;

  public getData() {
    return this.data;
  }

  public abstract applyFilter(value: string): void;
  public abstract applyColumnFilter(columnName: string, value: string): void;
  public abstract sortByColumn(columnName: string, direction: string): void;

  public render(targetNode: HTMLElement): void {
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

  public getPageSize(): number {
    return this.currentPageSize;
  }

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

  protected buildColumns = (survey: SurveyModel) => {
    return this.survey.getAllQuestions().map((question: Question) => {
      return {
        name: question.name,
        displayName: (question.title || "").trim() || question.name,
        dataType:
          question.getType() !== "file"
            ? ColumnDataType.Text
            : ColumnDataType.FileLink,
        isPublic: true,
        location: QuestionLocation.Column,
      };
    });
  };

  public isColumnVisible(column: ITableColumn) {
    if (column.location !== QuestionLocation.Column) return false;
    return column.isVisible;
  }

  public get columns() {
    return [].concat(this._columns);
  }

  public set columns(columns: Array<ITableColumn>) {
    this._columns = columns;
    this.refresh(true);
    this.onStateChanged.fire(this, this.state);
  }

  protected initTableData(data: Array<any>) {
    this.tableData = (data || []).map((item) => {
      var dataItem: any = {};
      this.survey.data = item;
      this._columns.forEach((column) => {
        var displayValue = item[column.name];
        const question = this.survey.getQuestionByName(column.name);
        if (question) {
          displayValue = question.displayValue;
        }
        if (column.dataType === ColumnDataType.FileLink) {
          if (Array.isArray(displayValue)) {
            dataItem[column.name] = createLinksContainer(
              displayValue
            ).outerHTML;
          }
        } else {
          dataItem[column.name] =
            typeof displayValue === "string"
              ? displayValue
              : JSON.stringify(displayValue) || "";
        }
      });
      return dataItem;
    });
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

  public getColumnByName(columnName: string): ITableColumn {
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
    this.survey.locale = newLocale;
    localization.currentLocale = newLocale;
    this.refresh(true);
    this.onStateChanged.fire(this, this.state);
  }

  public getLocales(): Array<string> {
    return [].concat(this.survey.getUsedLocales());
  }

  public refresh(hard: boolean = false) {
    if (this.isRendered) {
      this.currentPageNumber = this.getPageNumber();
      if (hard) {
        this.initTableData(this.data);
      }
      var targetNode = this.renderResult;
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
      elements: [].concat(this._columns),
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
      this.survey.locale = newState.locale;
      this.initTableData(this.data);
    }

    if (typeof newState.elements !== "undefined")
      this._columns = newState.elements;

    if (typeof newState.pageSize !== "undefined")
      this.currentPageSize = newState.pageSize;
  }
  /**
   * Fires when table state changed.
   */
  public onStateChanged = new Event<
    (sender: Table, options: any) => any,
    any
  >();

  /**
   * Gets table permissions.
   */
  public get permissions(): IPermission[] {
    return <any>this._columns.map((column: ITableColumn) => {
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
    const updatedElements = this._columns.map((column: ITableColumn) => {
      permissions.forEach((permission) => {
        if (permission.name === column.name)
          column.isPublic = permission.isPublic;
      });

      return { ...column };
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
    any
  > = new Event<(sender: TableRow, options: any) => any, any>();

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
