import { Base, ItemValue, MatrixRowModel, Question, QuestionCompositeModel, QuestionCustomModel, QuestionFileModel, QuestionMatrixDropdownModel, QuestionMatrixModel, settings } from "survey-core";
import { createImagesContainer, createLinksContainer } from "../utils";
import { ICellData, IColumn, ColumnDataType, QuestionLocation, IColumnData } from "./config";
import { ITableOptions, Table } from "./table";
export class BaseColumn<T extends Question = Question> implements IColumn {
  dataType: ColumnDataType;
  isVisible: boolean = true;
  isPublic: boolean = true;
  location: QuestionLocation = QuestionLocation.Column;
  width?: string | number;
  visibleIndex?: number;
  isComment?: boolean;
  private nameValue: string;
  private displayNameValue?: string;

  constructor(protected question: T, protected table: Table) {
    this.dataType = this.getDataType();
  }
  get name(): string {
    if(!this.nameValue) {
      this.name = this.getName();
    }
    return this.nameValue;
  }
  set name(val: string) {
    this.nameValue = val;
  }
  get displayName(): string {
    if(!this.displayNameValue) {
      this.displayName = this.getDisplayName();
    }
    return this.displayNameValue;
  }
  public set displayName(val: string) {
    this.displayNameValue = val;
  }

  protected getDisplayName(): string {
    return this.table.useNamesAsTitles
      ? this.question.name
      : (this.question.title || "").trim() || this.question.name;
  }
  protected getName(): string {
    return this.question.name;
  }
  protected getDataType(): ColumnDataType {
    return ColumnDataType.Text;
  }
  protected getDisplayValueCore(data: any) {
    return data[this.name];
  }

  protected setupReadyChangedCallback(table: Table, question: Question) {
    if(!!question) {
      const onReadyChangedCallback = (sender, options) => {
        if(options.isReady) {
          table.refresh(!table.isInitTableDataProcessing);
          sender.onReadyChanged.remove(onReadyChangedCallback);
        }
      };
      if(!question.isReady) {
        question.onReadyChanged.add(onReadyChangedCallback);
      }
    }
  }

  protected getDisplayValue(data: any, table: Table, options: ITableOptions): any {
    let displayValue = this.getDisplayValueCore(data);
    const question = this.question;

    if (!!question) {
      if (options.useValuesAsLabels) {
        displayValue = question.value;
      } else {
        displayValue = question.displayValue;
      }
    }
    return displayValue;
  }
  private formatDisplayValue(displayValue: any) {
    return typeof displayValue === "string"
      ? displayValue
      : JSON.stringify(displayValue) || "";
  }

  public getCellData(table: Table, data: any): ICellData {
    const displayValue = this.getDisplayValue(data, table, table.options);
    this.setupReadyChangedCallback(table, this.question);
    return { question: this.question, displayValue: this.formatDisplayValue(displayValue) };
  }
  public toJSON(): IColumnData {
    return {
      name: this.name,
      displayName: this.displayName,
      dataType: this.dataType,
      isVisible: this.isVisible,
      isPublic: this.isPublic,
      location: this.location
    };
  }
  public fromJSON(data: IColumnData) {
    Object.keys(data).forEach(key => {
      this[key] = data[key];
    });
  }
}

export class DefaultColumn extends BaseColumn {
  protected getDisplayValue(data: any, table: Table, options: ITableOptions): any {
    return this.getDisplayValueCore(data);
  }
}

export class CommentColumn extends BaseColumn {
  protected getName(): string {
    return `${this.question.name}${settings.commentPrefix}`;
  }
  protected getDisplayName(): string {
    return this.question.hasOther
      ? (<any>this.question).otherText
      : this.question.commentText;
  }
  protected getDisplayValue(data: any, table: Table, options: ITableOptions) {
    return this.question.comment;
  }
}

export class MatrixColumn extends BaseColumn<QuestionMatrixModel> {
  private valueName: string;
  private valuePath: string;
  constructor(question: QuestionMatrixModel, private row: MatrixRowModel, table: Table) {
    super(question, table);
    this.valueName = this.question.name;
    this.valuePath = this.row?.value;
  }
  protected getName(): string {
    return this.question.name + "." + this.row?.value;
  }
  protected getDisplayName(): string {
    const table = this.table;
    const question = this.question;
    const row = this.row;
    return (table.useNamesAsTitles
      ? question.name
      : (question.title || "").trim() || question.name) + " - " + (table.useNamesAsTitles ? row?.value : row?.locText.textOrHtml);
  }

  protected getDisplayValue(data: any, table: Table, options: ITableOptions) {
    let displayValue = data[this.valueName];
    if(this.valuePath && typeof displayValue === "object") {
      displayValue = displayValue[this.valuePath];
      if(displayValue !== undefined) {
        const choiceValue = ItemValue.getItemByValue(this.question.columns, displayValue);
        if(!!choiceValue) {
          displayValue = options.useValuesAsLabels ? choiceValue.value : choiceValue.locText.textOrHtml;
        }
      }
    }
    return displayValue;
  }
}

export class ImageColumn extends BaseColumn {
  protected getDataType(): ColumnDataType {
    return ColumnDataType.Image;
  }
}

export class FileColumn extends BaseColumn<QuestionFileModel> {
  protected getDataType(): ColumnDataType {
    return ColumnDataType.FileLink;
  }
  protected getDisplayValue(data: any, table: Table, options: ITableOptions) {
    let displayValue = this.getDisplayValueCore(data);
    if (Array.isArray(displayValue)) {
      displayValue = Table.showFilesAsImages ? createImagesContainer(
        displayValue
      ).outerHTML : createLinksContainer(
        displayValue
      ).outerHTML;
    }
    return displayValue;
  }
}
export class MatrixDropdownColumn extends BaseColumn<QuestionMatrixDropdownModel> {
  private rowValue: string;
  private colName: string;
  constructor(question: QuestionMatrixDropdownModel, protected row, protected col, table: Table) {
    super(question, table);
    this.rowValue = this.row.value;
    this.colName = this.col.name;
  }
  protected getName(): string {
    return this.question.name + "." + this.row.value + "." + this.col.name;
  }
  protected getDisplayName(): string {
    const table = this.table;
    const question = this.question;
    return (this.table.useNamesAsTitles
      ? question.name
      : (question.title || "").trim() || question.name) + " - " + (table.useNamesAsTitles ? this.row.value : this.row.locText.textOrHtml) + " - " + (table.useNamesAsTitles ? this.col.name : this.col.locTitle.textOrHtml);

  }
  protected getDisplayValue(data: any, table: Table, options: ITableOptions) {
    let displayValue = data[this.question.name];
    const question = this.question;
    if(this.rowValue && this.colName && typeof displayValue === "object") {
      let [rowId, colId] = [this.rowValue, this.colName];
      displayValue = question.value;
      if(!options.useValuesAsLabels) {
        displayValue = question.displayValue;
        rowId = question.rows.filter(row => row.value === this.rowValue)[0].text;
        colId = question.getColumnByName(this.colName).title;
      }
      displayValue = (displayValue[rowId] && displayValue[rowId][colId]) || "";
    }
    return displayValue;
  }
}

export class CustomQuestionColumn extends BaseColumn<QuestionCustomModel> {
  public getCellData(table: Table, data: any): ICellData {
    this.setupReadyChangedCallback(table, this.question.contentQuestion);
    return super.getCellData(table, data);
  }
}

export class CompositeQuestionColumn extends BaseColumn<QuestionCompositeModel> {
  public getCellData(table: Table, data: any): ICellData {
    const questionList: Question[] = [];
    this.question.contentPanel.addQuestionsToList(questionList);
    questionList.forEach((question: Question) => {
      this.setupReadyChangedCallback(table, question);
    });
    return super.getCellData(table, data);
  }
}