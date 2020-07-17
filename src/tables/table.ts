import { SurveyModel, Question } from "survey-core";
import { ColumnVisibility, QuestionLocation, ColumnDataType } from "./config";
import { Details, TableRow } from "./tools/rowtools";

export abstract class Table {
  protected tableData: any;

  constructor(
    protected targetNode: HTMLElement,
    protected survey: SurveyModel,
    protected data: Array<Object>,
    protected options: any,
    protected _columns: Array<any> = [],
    protected isTrustedAccess = false
  ) {
    if (_columns.length === 0) {
      this._columns = this.buildColumns(survey);
    }
    this.targetNode.className += " sa-table";
    this.initTableData(data);
  }
  protected _rows: TableRow[] = [];

  protected rowDetails: { [rowName: string]: Details };

  public onColumnsVisibilityChanged: Event<
    (sender: Tabulator, options: any) => any,
    any
  > = new Event<(sender: Tabulator, options: any) => any, any>();

  public onColumnsLocationChanged: Event<
    (sender: Tabulator, options: any) => any,
    any
  > = new Event<(sender: Tabulator, options: any) => any, any>();

  public onRowCreated: Event<
    (sender: Tabulator, options: any) => any,
    any
  > = new Event<(sender: Tabulator, options: any) => any, any>();

  public onTableToolsCreated: Event<
    (sender: Tabulator, options: any) => any,
    any
  > = new Event<(sender: Tabulator, options: any) => any, any>();

  public onColumnToolsCreated: Event<
    (sender: Tabulator, options: any) => any,
    any
  > = new Event<(sender: Tabulator, options: any) => any, any>();

  public renderDetailActions: (
    container: HTMLElement,
    data: any,
    row: TableRow
  ) => HTMLElement;

  public getData() {
    return this.data;
  }

  public abstract render(): void;
  public abstract applyFilter(value: string): void;
  public abstract applyColumnFilter(columnName: string, value: string): void;
  public abstract sortByColumn(columnName: string, direction: string): void;
  public abstract setPageSize(value: number): void;

  protected getRows(): TableRow[] {
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
  }

  public setColumnVisibility(columnName: string, visibility: ColumnVisibility) {
    var column = this.columns.filter((column) => column.name === columnName)[0];
    column.visibility = visibility;
    this.onColumnsVisibilityChanged.fire(this, null);
  }

  public getColumnVisibility(columnName: string): ColumnVisibility {
    var column = this.columns.filter((column) => column.name === columnName)[0];
    return column.visibility;
  }
}

export class Event<T extends Function, Options> {
  protected callbacks: Array<T>;
  public get isEmpty(): boolean {
    return this.callbacks == null || this.callbacks.length == 0;
  }
  public fire(sender: any, options: Options) {
    if (this.callbacks == null) return;
    for (var i = 0; i < this.callbacks.length; i++) {
      var callResult = this.callbacks[i](sender, options);
    }
  }
  public clear() {
    this.callbacks = [];
  }
  public add(func: T) {
    if (this.hasFunc(func)) return;
    if (this.callbacks == null) {
      this.callbacks = new Array<T>();
    }
    this.callbacks.push(func);
  }
  public remove(func: T) {
    if (this.hasFunc(func)) {
      var index = this.callbacks.indexOf(func, 0);
      this.callbacks.splice(index, 1);
    }
  }
  public hasFunc(func: T): boolean {
    if (this.callbacks == null) return false;
    return this.callbacks.indexOf(func, 0) > -1;
  }
}
