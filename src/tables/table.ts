import { SurveyModel, Question, Event } from "survey-core";
import {
  ColumnVisibility,
  QuestionLocation,
  ColumnDataType,
  ITableState,
  ITableColumn,
} from "./config";
import { Details } from "./extensions/detailsextensions";
import { localization } from "../localizationManager";
import { TableExtensions } from "./extensions/tableextensions";

export abstract class Table {
  protected tableData: any;
  protected extensions: TableExtensions;
  constructor(
    protected survey: SurveyModel,
    protected data: Array<Object>,
    protected options: any,
    protected _columns: Array<any> = [],
    public isTrustedAccess: boolean
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
  }
  protected renderResult: HTMLElement;
  protected currentPageSize: number = 5;
  protected currentPageNumber: number;
  protected _rows: TableRow[] = [];

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

  public abstract render(targetNode: HTMLElement): void;
  public abstract applyFilter(value: string): void;
  public abstract applyColumnFilter(columnName: string, value: string): void;
  public abstract sortByColumn(columnName: string, direction: string): void;

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
        visibility:
          question.getType() !== "file"
            ? ColumnVisibility.Visible
            : ColumnVisibility.Invisible,
        location: QuestionLocation.Column,
      };
    });
  };

  public isColumnVisible(column: any) {
    return (
      column.location == QuestionLocation.Column &&
      this.isVisible(column.visibility)
    );
  }

  public isVisible = (visibility: ColumnVisibility) => {
    return (
      (this.isTrustedAccess && visibility !== ColumnVisibility.Invisible) ||
      (!this.isTrustedAccess && visibility === ColumnVisibility.Visible)
    );
  };

  public isAvailable = (visibility: ColumnVisibility) => {
    return (
      this.isTrustedAccess || visibility !== ColumnVisibility.PublicInvisible
    );
  };

  public getAvailableColumns = (): Array<ITableColumn> => {
    return this.columns.filter((column: ITableColumn) => {
      return this.isAvailable(column.visibility);
    });
  };

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
        dataItem[column.name] =
          typeof displayValue === "string"
            ? displayValue
            : JSON.stringify(displayValue) || "";
      });
      return dataItem;
    });
  }

  public setColumnLocation(columnName: string, location: QuestionLocation) {
    this.columns.filter(
      (column) => column.name === columnName
    )[0].location = location;
    this.onColumnsLocationChanged.fire(this, {
      columnName: columnName,
      location: location,
    });
    this.onStateChanged.fire(this, this.state);
  }

  public setColumnVisibility(columnName: string, visibility: ColumnVisibility) {
    var column = this.columns.filter((column) => column.name === columnName)[0];
    column.visibility = visibility;
    this.onColumnsVisibilityChanged.fire(this, {
      columnName: columnName,
      columnVisibility: visibility,
    });
    this.onStateChanged.fire(this, this.state);
  }

  public getColumnVisibility(columnName: string): ColumnVisibility {
    var column = this.columns.filter((column) => column.name === columnName)[0];
    return column.visibility;
  }

  public doStateSave() {
    this.stateSaveCallback({ columns: this.columns }, this.data);
  }

  public stateSaveCallback(settings: any, data: any) {}

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
    };
  }
  /**
   * Vizualization panel state setter.
   */
  public set state(newState: ITableState) {
    localization.currentLocale = newState.locale;
    this._columns = newState.elements;
    this.onStateChanged.fire(this, this.state);
  }
  /**
   * Fires when vizualization panel state changed.
   */
  public onStateChanged = new Event<
    (sender: Table, options: any) => any,
    any
  >();
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

  public abstract getElement(): HTMLElement;
  public abstract getData(): any;
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
  }
}
