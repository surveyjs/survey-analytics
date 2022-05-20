import { Question, QuestionMatrixModel, QuestionSelectBase, settings } from "survey-core";
import { BaseTableColumn, CommentTableColumn, MatrixTableColumn } from "./columns";
import { QuestionLocation, ColumnDataType, ITableColumnData, ITableColumn } from "./config";
import { Table } from "./table";

export interface IColumnBuilder {
  buildColumns(question: Question, table: Table): Array<ITableColumn>;
}
export class DefaultColumnBuilder implements IColumnBuilder {
  protected getDataType(): ColumnDataType {
    return ColumnDataType.Text;
  }

  public buildColumns(question: Question, table: Table): Array<ITableColumn> {
    const columns: Array<ITableColumn> = [];
    columns.push(new BaseTableColumn({
      name: question.name,
      displayName: table.useNamesAsTitles
        ? question.name
        : (question.title || "").trim() || question.name,
      dataType: this.getDataType(),
      isVisible: true,
      isPublic: true,
      location: QuestionLocation.Column,
    }));
    if (
      question.hasComment ||
      (question.hasOther && (<QuestionSelectBase>question)["getStoreOthersAsComment"]())
    ) {
      columns.push(new CommentTableColumn({
        name: `${question.name}${settings.commentPrefix}`,
        displayName: question.hasOther
          ? (<any>question).otherText
          : question.commentText,
        isComment: true,
        dataType: this.getDataType(),
        isVisible: true,
        isPublic: true,
        location: QuestionLocation.Column,
      }));
    }
    return columns;
  }
}

export class ColumnBuilderFactory {
  public static Instance: ColumnBuilderFactory = new ColumnBuilderFactory();
  private constructor() {}

  private readonly columnBuilders: {[index: string]: IColumnBuilder } = {};
  private readonly defaultColumnBuilder: IColumnBuilder = new DefaultColumnBuilder();

  registerBuilderColumn(type: string, columnBuilder: IColumnBuilder) {
    this.columnBuilders[type] = columnBuilder;
  }
  getColumnBuilder(type: string) {
    return this.columnBuilders[type] || this.defaultColumnBuilder;
  }
}

export class MatrixColumnBuilder extends DefaultColumnBuilder {
  public buildColumns(questionBase: Question, table: Table): Array<ITableColumn> {
    const question = <QuestionMatrixModel>questionBase;
    const columns = [];
    question.rows.forEach(row => {
      columns.push(new MatrixTableColumn({
        name: question.name + "." + row.value,
        displayName:
          (table.useNamesAsTitles
            ? question.name
            : (question.title || "").trim() || question.name) + " - " + (table.useNamesAsTitles ? row.value : row.locText.textOrHtml),
        dataType: this.getDataType(),
        isVisible: true,
        isPublic: true,
        location: QuestionLocation.Column,
      }));
    });
    return columns;
  }
}
ColumnBuilderFactory.Instance.registerBuilderColumn("matrix", new MatrixColumnBuilder());

export class SignaturepadColumnBuilder extends DefaultColumnBuilder {
  protected getDataType(): ColumnDataType {
    return ColumnDataType.Image;
  }
}
ColumnBuilderFactory.Instance.registerBuilderColumn("signaturepad", new SignaturepadColumnBuilder());

export class FileColumnBuilder extends DefaultColumnBuilder {
  protected getDataType(): ColumnDataType {
    return ColumnDataType.FileLink;
  }
}
ColumnBuilderFactory.Instance.registerBuilderColumn("file", new FileColumnBuilder());