import { SurveyModel, Question } from "survey-core";
import { ColumnVisibility, QuestionLocation, ColumnDataType } from "../config";

import "./tabulator.scss";

const TabulatorTables = require("tabulator-tables");

if (!!document) {
  const svgTemplate = require("html-loader?interpolate!val-loader!../svgbundle.html");
  const templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.append(templateHolder);
}

export class Tabulator {
  constructor(
    private targetNode: HTMLElement,
    private survey: SurveyModel,
    private data: Array<Object>,
    private options: any,
    private _columns: Array<any> = [],
    private isTrustedAccess = false
  ) {
    const self = this;
    targetNode.className += "sa-tabulator";
    if (_columns.length === 0) {
      self._columns = self.buildColumns(survey);
    }
  }

  private tabulatorTables: any = null;

  public render = () => {
    const columns = this.getColumns();

    const data = this.data;

    this.targetNode.innerHTML = "";

    this.tabulatorTables = new TabulatorTables(this.targetNode, {
      height: 205,
      data,
      layout: "fitColumns",
      columns,
    });
  };

  public destroy = () => {
    this.tabulatorTables.destroy();
    this.targetNode.innerHTML = "";
  };

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

  public isVisible(visibility: ColumnVisibility) {
    return (
      (this.isTrustedAccess && visibility !== ColumnVisibility.Invisible) ||
      (!this.isTrustedAccess && visibility === ColumnVisibility.Visible)
    );
  }

  protected getColumns = () => {
    const availableColumns = this._columns.filter(
      (column) =>
        column.location === QuestionLocation.Column &&
        this.isVisible(column.visibility)
    );
    const columns: any = availableColumns.map((column, index) => {
      var question = this.survey.getQuestionByName(column.name);
      return {
        field: column.name,
        title: (question && question.title) || column.displayName,
        visible: column.visibility !== ColumnVisibility.Invisible,
      };
    });

    return columns;
  };
}
