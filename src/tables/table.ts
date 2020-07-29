import { SurveyModel, Question, Event } from "survey-core";
import {
  ColumnVisibility,
  QuestionLocation,
  ColumnDataType,
  ITableState,
} from "./config";
import { Details, TableRow } from "./extensions/rowextensions";
import { localization } from "../localizationManager";

export abstract class Table {
  protected tableData: any;

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
  }
  protected renderResult: HTMLElement;
  protected currentPageSize: number;
  protected currentPageNumber: number;
  protected _rows: TableRow[] = [];

  protected rowDetails: { [rowName: string]: Details };

  public onColumnsVisibilityChanged: Event<
    (sender: Table, options: any) => any,
    any
  > = new Event<(sender: Table, options: any) => any, any>();

  public onColumnsLocationChanged: Event<
    (sender: Table, options: any) => any,
    any
  > = new Event<(sender: Table, options: any) => any, any>();

  public onRowCreated: Event<
    (sender: Table, options: any) => any,
    any
  > = new Event<(sender: Table, options: any) => any, any>();

  public onTableToolsCreated: Event<
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
  public abstract setPageSize(value: number): void;

  public getCreatedRows(): TableRow[] {
    return [].concat(this._rows);
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

  public get columns() {
    return [].concat(this._columns);
  }

  protected getAvailableColumns = () => {
    return this.columns.filter(
      (column) =>
        column.location === QuestionLocation.Column &&
        this.isVisible(column.visibility)
    );
  };

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
    this.onColumnsLocationChanged.fire(this, null);
    this.onStateChanged.fire(this, this.state);
  }

  public setColumnVisibility(columnName: string, visibility: ColumnVisibility) {
    var column = this.columns.filter((column) => column.name === columnName)[0];
    column.visibility = visibility;
    this.onColumnsVisibilityChanged.fire(this, null);
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
      if (hard) {
        this.initTableData(this.data);
      }
      var targetNode = this.renderResult;
      this.destroy();
      this.render(targetNode);
    }
  }

  public destroy() {
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
    return { locale: localization.currentLocale, elements: this._columns };
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
