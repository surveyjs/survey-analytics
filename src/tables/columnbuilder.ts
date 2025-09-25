import { Question, QuestionCheckboxModel, QuestionCompositeModel, QuestionCustomModel, QuestionDropdownModel, QuestionFileModel, QuestionMatrixDropdownModel, QuestionMatrixModel, QuestionRadiogroupModel, QuestionSelectBase } from "survey-core";
import { BaseColumn, CheckboxColumn, CommentColumn, CompositeQuestionColumn, CustomQuestionColumn, FileColumn, ImageColumn, MatrixColumn, MatrixDropdownColumn, OtherColumn, SelectBaseColumn, SingleChoiceColumn } from "./columns";
import { IColumn } from "./config";
import { Table } from "./table";

export interface IColumnsBuilder {
  buildColumns(question: Question, table: Table): Array<IColumn>;
}
export class DefaultColumnsBuilder<T extends Question = Question> implements IColumnsBuilder {
  protected createColumn(question: T, table: Table) {
    return new BaseColumn(question, table);
  }

  protected buildColumnsCore(question: T, table: Table): Array<IColumn> {
    const columns: Array<IColumn> = [];
    columns.push(this.createColumn(question, table));
    return columns;
  }

  public buildColumns(question: T, table: Table): Array<IColumn> {
    const columns = this.buildColumnsCore(question, table);
    if(question.hasComment) {
      columns.push(new CommentColumn(question, table));
    }
    if(question.hasOther && (question as unknown as QuestionSelectBase)["getStoreOthersAsComment"]()) {
      columns.push(new OtherColumn(question as unknown as QuestionSelectBase, table));
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
export class CheckboxColumnsBuilder extends DefaultColumnsBuilder<QuestionCheckboxModel> {
  protected createColumn(question: QuestionCheckboxModel, table: Table): BaseColumn<QuestionCheckboxModel> {
    return new CheckboxColumn(question, table);
  }
}
ColumnsBuilderFactory.Instance.registerBuilderColumn("checkbox", new CheckboxColumnsBuilder());
export class SingleChoiceColumnsBuilder extends DefaultColumnsBuilder<QuestionDropdownModel | QuestionRadiogroupModel> {
  protected createColumn(question: QuestionDropdownModel | QuestionRadiogroupModel, table: Table): BaseColumn<QuestionDropdownModel | QuestionRadiogroupModel> {
    return new SingleChoiceColumn(question, table);
  }
}
ColumnsBuilderFactory.Instance.registerBuilderColumn("radiogroup", new SingleChoiceColumnsBuilder());
ColumnsBuilderFactory.Instance.registerBuilderColumn("dropdown", new SingleChoiceColumnsBuilder());

export class MatrixColumnsBuilder extends DefaultColumnsBuilder<QuestionMatrixModel> {
  protected buildColumnsCore(questionBase: Question, table: Table): IColumn[] {
    const question = <QuestionMatrixModel>questionBase;
    const columns = [];
    question.rows.forEach(row => {
      columns.push(new MatrixColumn(question, row, table));
    });
    return columns;
  }
}
ColumnsBuilderFactory.Instance.registerBuilderColumn("matrix", new MatrixColumnsBuilder());

export class ImageColumnsBuilder extends DefaultColumnsBuilder {
  protected createColumn(question: Question, table: Table): ImageColumn {
    return new ImageColumn(question, table);
  }
}
ColumnsBuilderFactory.Instance.registerBuilderColumn("signaturepad", new ImageColumnsBuilder());

export class FileColumnsBuilder extends DefaultColumnsBuilder<QuestionFileModel> {
  protected createColumn(question: QuestionFileModel, table: Table): FileColumn {
    return new FileColumn(question, table);
  }
}
ColumnsBuilderFactory.Instance.registerBuilderColumn("file", new FileColumnsBuilder());

export class MatrixDropdownColumnBuilder extends DefaultColumnsBuilder {
  public buildColumns(questionBase: QuestionMatrixDropdownModel, table: Table): Array<IColumn> {
    const question = <QuestionMatrixDropdownModel>questionBase;
    const columns = [];
    question.rows.forEach(row => {
      question.columns.forEach(col => {
        columns.push(new MatrixDropdownColumn(question, row, col, table));
      });
    });
    return columns;
  }
}
ColumnsBuilderFactory.Instance.registerBuilderColumn("matrixdropdown", new MatrixDropdownColumnBuilder());

export class CustomColumnsBuilder extends DefaultColumnsBuilder<QuestionCustomModel> {
  protected createColumn(question: QuestionCustomModel, table: Table): CustomQuestionColumn {
    return new CustomQuestionColumn(question, table);
  }
}
ColumnsBuilderFactory.Instance.registerBuilderColumn("custom", new CustomColumnsBuilder());

export class CompositeColumnsBuilder extends DefaultColumnsBuilder<QuestionCompositeModel> {
  public static ShowAsSeparateColumns = false;
  protected getDisplayName(question: QuestionCompositeModel, table: Table): string {
    return table.useNamesAsTitles
      ? question.name
      : (question.title || "").trim() || question.name;
  }
  protected buildColumnsCore(question: QuestionCompositeModel, table: Table): Array<IColumn> {
    if(CompositeColumnsBuilder.ShowAsSeparateColumns) {
      const innerQuestions = [];
      question.contentPanel.addQuestionsToList(innerQuestions);
      let columns: Array<IColumn> = [];
      innerQuestions.forEach(innerQuestion => {
        const builder = ColumnsBuilderFactory.Instance.getColumnsBuilder(innerQuestion.getType());
        const cols = builder.buildColumns(innerQuestion, table);
        cols.forEach(col => {
          col.name = question.name + "." + col.name;
          col.displayName = this.getDisplayName(question, table) + " - " + this.getDisplayName(innerQuestion, table);
        });
        columns = columns.concat(cols);
      });
      return columns;
    }
    return super.buildColumnsCore(question, table);
  }
  protected createColumn(question: QuestionCompositeModel, table: Table): CompositeQuestionColumn {
    return new CompositeQuestionColumn(question, table);
  }
}
ColumnsBuilderFactory.Instance.registerBuilderColumn("composite", new CompositeColumnsBuilder());