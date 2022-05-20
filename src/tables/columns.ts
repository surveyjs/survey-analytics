import { ItemValue, Question, QuestionMatrixModel, settings, surveyBuiltInVarible, SurveyModel } from "survey-core";
import { createImagesContainer, createLinksContainer } from "../utils";
import { ITableColumnData, ICellData, ITableColumn, ColumnDataType, QuestionLocation } from "./config";
import { ITableOptions, Table } from "./table";

export class BaseTableColumn implements ITableColumn {
  name: string;
  displayName: string;
  dataType: ColumnDataType;
  isVisible: boolean;
  isPublic: boolean;
  location: QuestionLocation;
  width?: string | number;
  isComment?: boolean;
  constructor(columnData: ITableColumnData) {
    Object.keys(columnData).forEach(key => {
      this[key] = columnData[key];
    });
  }
  protected getQuestion(survey: SurveyModel) {
    return survey.getQuestionByName(this.name);
  }

  protected getDiplayValueCore(question: Question, data: any, table: Table, options: ITableOptions) {
    let displayValue = data[this.name];
    const onReadyChangedCallback = (sender, options) => {
      if(options.isReady) {
        table.refresh(true);
        sender.onReadyChanged.remove(onReadyChangedCallback);
      }
    };
    if (!!question) {
      if (options.useValuesAsLabels) {
        displayValue = question.value;
      } else {
        if(question.isReady) {
          displayValue = question.displayValue;
        } else {
          question.onReadyChanged.add(onReadyChangedCallback);
        }
      }
    }
    return displayValue;
  }

  protected getDisplayValue(question: Question, data: any, table: Table, options: ITableOptions): any {
    const displayValue = this.getDiplayValueCore(question, data, table, options);
    return typeof displayValue === "string"
      ? displayValue
      : JSON.stringify(displayValue) || "";
  }

  getCellData(survey: SurveyModel, data: any, table: Table, options: ITableOptions): ICellData {
    const question: Question = this.getQuestion(survey);
    const displayValue = this.getDisplayValue(question, data, table, options);
    return { question, displayValue };
  }
}

export class CommentTableColumn extends BaseTableColumn {
  protected getQuestion(survey: SurveyModel): Question {
    return survey.getQuestionByName(this.name.replace(settings.commentPrefix, ""));
  }
  protected getDisplayValue(question: Question, data: any, table: Table, options: ITableOptions) {
    return question.comment;
  }
}

export class MatrixTableColumn extends BaseTableColumn {
  private valueName: string;
  private valuePath: string;
  constructor(column: ITableColumnData) {
    super(column);
    [this.valueName, this.valuePath] = this.name.split(".");
  }

  protected getQuestion(survey: SurveyModel): QuestionMatrixModel {
    return <QuestionMatrixModel>survey.getQuestionByName(this.valueName);

  }
  protected getDisplayValue(question: QuestionMatrixModel, data: any, table: Table, options: ITableOptions) {
    let displayValue = data[this.valueName];
    if(this.valuePath && typeof displayValue === "object") {
      displayValue = displayValue[this.valuePath];
      const choiceValue = ItemValue.getItemByValue((<QuestionMatrixModel>question).columns, displayValue);
      displayValue = options.useValuesAsLabels ? choiceValue.value : choiceValue.locText.textOrHtml;
    }
    return displayValue;
  }
}

export class FileColumn extends BaseTableColumn {
  protected getDisplayValue(question: Question, data: any, table: Table, options: ITableOptions) {
    let displayValue = this.getDiplayValueCore(question, data, table, options);
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