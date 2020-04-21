import { Table } from "./table";
import { SurveyModel } from "survey-core";
import { ColumnVisibility, QuestionLocation } from "./config";
import { localization } from "../localizationManager";

import "./tabulator.scss";

const TabulatorTables = require("tabulator-tables");

if (!!document) {
  const svgTemplate = require("html-loader?interpolate!val-loader!../svgbundle.html");
  const templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.appendChild(templateHolder);
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
  private toolsContainer: HTMLElement = null;
  private tableContainer: HTMLElement = null;

  public render = () => {
    const columns = this.getColumns();
    const data = this.tableData;

    this.toolsContainer = document.createElement("div");
    this.tableContainer = document.createElement("div");

    this.targetNode.innerHTML = "";
    this.targetNode.appendChild(this.toolsContainer);
    this.targetNode.appendChild(this.tableContainer);

    this.tabulatorTables = new TabulatorTables(this.tableContainer, {
      data,
      layout: "fitColumns",
      pagination: "local",
      paginationSize: 5,
      movableColumns: true,
      columns,
      rowFormatter: this.rowFormatter,
    });

    this.renderTools();
  };

  renderTools = () => {
    const toolsContainer = this.toolsContainer;
    const showColumnDropdown = this.getShowColumnDropdown();

    toolsContainer.innerHTML = "";

    toolsContainer.appendChild(showColumnDropdown);
  };

  getShowColumnDropdown = (): HTMLElement => {
    const dropdown = document.createElement("select");

    var hiddenColumns = this.columns.filter(
      (column) => column.visibility === ColumnVisibility.Invisible
    );

    var option = document.createElement("option");
    option.text = localization.getString("showColumn");
    option.disabled = true;
    option.selected = true;
    dropdown.appendChild(option);

    hiddenColumns.forEach((column) => {
      var option = document.createElement("option");
      var text = column.displayName;
      if (text.length > 20) {
        text = text.substring(0, 20) + "...";
      }
      option.text = text;
      option.title = column.displayName;
      option.value = column.name;
      dropdown.appendChild(option);
    });

    var self = this;
    dropdown.onchange = function (e: any) {
      const val = e.target.value;
      e.stopPropagation();
      if (!val) return;

      var column = self._columns.filter((column) => column.name === val)[0];
      column.visibility = ColumnVisibility.Visible;
      self.tabulatorTables.toggleColumn(column.name);
      self.update();
    };

    return dropdown;
  };

  public destroy = () => {
    this.tabulatorTables.destroy();
    this.targetNode.innerHTML = "";
  };

  public update() {
    this.renderTools();
  }

  protected rowFormatter(row: any) {
    var specialColumnElement = row.getCells()[0].getElement();
    var hidden = document.createElement("div");
    hidden.innerHTML = "<p>hidden info</p>";
    hidden.style.display = "none";

    specialColumnElement.onclick = function () {
      if (hidden.style.display === "none") {
        hidden.style.display = "block";
      } else {
        hidden.style.display = "none";
      }

      row.normalizeHeight(); //recalculate the row height
    };

    row.getElement().appendChild(hidden);
  }

  protected getTitleFormatter = (
    cell: any,
    formatterParams: any,
    onRendered: any,
    columnName: any
  ) => {
    //build dropdown
    var hideColumnBtn = document.createElement("button");
    hideColumnBtn.style.display = "block";
    hideColumnBtn.innerHTML = "<span> hide </span>";
    hideColumnBtn.onclick = () => {
      this._columns.filter(
        (column) => column.name === columnName
      )[0].visibility = ColumnVisibility.Invisible;
      this.tabulatorTables.toggleColumn(columnName);
      this.update();
    };

    //set header title
    var title = document.createElement("div");
    title.style.height = "50px";
    title.innerHTML = cell.getValue();

    //add menu to title
    title.appendChild(hideColumnBtn);

    return title;
  };

  protected getColumns = () => {
    const availableColumns = this.getAvailableColumns();
    const columns: any = availableColumns.map((column, index) => {
      var question = this.survey.getQuestionByName(column.name);
      return {
        field: column.name,
        title: (question && question.title) || column.displayName,
        visible: column.visibility !== ColumnVisibility.Invisible,
        headerFilter: true,
        titleFormatter: (cell: any, formatterParams: any, onRendered: any) => {
          return this.getTitleFormatter(
            cell,
            formatterParams,
            onRendered,
            column.name
          );
        },
      };
    });

    // add special column (collapse/expand)
    columns.unshift({
      field: "",
      title: "",
    });

    return columns;
  };
}
