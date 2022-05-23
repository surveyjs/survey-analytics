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