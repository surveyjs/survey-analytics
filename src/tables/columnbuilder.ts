import { Question, QuestionMatrixModel, QuestionSelectBase, settings } from "survey-core";
import { BaseTableColumn, CommentTableColumn, MatrixTableColumn } from "./columns";
import { QuestionLocation, ColumnDataType, ITableColumnData, ITableColumn } from "./config";
import { Table } from "./table";

export interface IColumnsBuilder {
  buildColumns(question: Question, table: Table): Array<ITableColumn>;
}
export class DefaultColumnsBuilder implements IColumnsBuilder {
  protected getDataType(): ColumnDataType {
    return ColumnDataType.Text;
  }

  protected getColumnData(name: string, displayName: string, dataType?: ColumnDataType): ITableColumnData {
    return {
      name: name,
      displayName: displayName,
      dataType: dataType || this.getDataType(),
      isVisible: true,
      isPublic: true,
      location: QuestionLocation.Column,
    };
  }
  protected getCommentColumnData(name: string, displayName: string): ITableColumnData {
    const commentColumnData = this.getColumnData(name, displayName, ColumnDataType.Text);
    commentColumnData.isComment = true;
    return commentColumnData;
  }

  protected buildColumnsCore(question: Question, table: Table): Array<ITableColumn> {
    const columns: Array<ITableColumn> = [];
    const displayName = table.useNamesAsTitles
      ? question.name
      : (question.title || "").trim() || question.name;
    columns.push(new BaseTableColumn(this.getColumnData(question.name, displayName)));
    return columns;
  }

  public buildColumns(question: Question, table: Table): Array<ITableColumn> {
    const columns = this.buildColumnsCore(question, table);
    if (
      question.hasComment ||
      (question.hasOther && (<QuestionSelectBase>question)["getStoreOthersAsComment"]())
    ) {
      columns.push(new CommentTableColumn(this.getCommentColumnData(`${question.name}${settings.commentPrefix}`, question.hasOther
        ? (<any>question).otherText
        : question.commentText,
      )));
    }
    return columns;
  }
}

export class ColumnsBuilderFactory {
  public static Instance: ColumnsBuilderFactory = new ColumnsBuilderFactory();
  private constructor() {}

  private readonly columnsBuilders: {[index: string]: IColumnsBuilder } = {};
  private readonly defaultColumnsBuilder: IColumnsBuilder = new DefaultColumnsBuilder();

  registerBuilderColumn(type: string, columnsBuilder: IColumnsBuilder) {
    this.columnsBuilders[type] = columnsBuilder;
  }
  getColumnsBuilder(type: string) {
    return this.columnsBuilders[type] || this.defaultColumnsBuilder;
  }
}

export class MatrixColumnsBuilder extends DefaultColumnsBuilder {
  protected buildColumnsCore(questionBase: Question, table: Table): ITableColumn[] {
    const question = <QuestionMatrixModel>questionBase;
    const columns = [];
    question.rows.forEach(row => {
      columns.push(new MatrixTableColumn(this.getColumnData(question.name + "." + row.value,
        (table.useNamesAsTitles
          ? question.name
          : (question.title || "").trim() || question.name) + " - " + (table.useNamesAsTitles ? row.value : row.locText.textOrHtml),
      )));
    });
    return columns;
  }
}
ColumnsBuilderFactory.Instance.registerBuilderColumn("matrix", new MatrixColumnsBuilder());

export class SignaturepadColumnsBuilder extends DefaultColumnsBuilder {
  protected getDataType(): ColumnDataType {
    return ColumnDataType.Image;
  }
}
ColumnsBuilderFactory.Instance.registerBuilderColumn("signaturepad", new SignaturepadColumnsBuilder());

export class FileColumnsBuilder extends DefaultColumnsBuilder {
  protected getDataType(): ColumnDataType {
    return ColumnDataType.FileLink;
  }
}
ColumnsBuilderFactory.Instance.registerBuilderColumn("file", new FileColumnsBuilder());