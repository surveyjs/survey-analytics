import { Table } from "./table";
import { SurveyModel } from "survey-core";
import { ColumnVisibility, QuestionLocation } from "./config";

import "./tabulator.scss";

const TabulatorTables = require("tabulator-tables");

if (!!document) {
  const svgTemplate = require("html-loader?interpolate!val-loader!../svgbundle.html");
  const templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.append(templateHolder);
}

export class Tabulator extends Table {
  constructor(
    targetNode: HTMLElement,
    survey: SurveyModel,
    data: Array<Object>,
    options: any,
    _columns: Array<any> = [],
    isTrustedAccess = false
  ) {
    super(targetNode, survey, data, options, _columns, isTrustedAccess);
    const self = this;
    targetNode.className += "sa-tabulator";
    if (_columns.length === 0) {
      self._columns = self.buildColumns(survey);
    }
  }

  private tabulatorTables: any = null;

  public render = () => {
    const columns = this.getColumns();

    const data = this.tableData;

    this.targetNode.innerHTML = "";

    this.tabulatorTables = new TabulatorTables(this.targetNode, {
      data,
      layout: "fitColumns",
      columns,
    });
  };

  public destroy = () => {
    this.tabulatorTables.destroy();
    this.targetNode.innerHTML = "";
  };

  protected getColumns = () => {
    const availableColumns = this.getAvailableColumns();
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
