import { Table } from "./table";
import { SurveyModel, HtmlConditionItem } from "survey-core";
import { ColumnVisibility, QuestionLocation } from "./config";

import "./tabulator.scss";
import { ActionsHelper } from "../utils";
import { TableRow } from "./tools/rowtools";
import { ColumnTools } from "./tools/columntools";
import { TableTools } from "./tools/tabletools";

const TabulatorTables = require("tabulator-tables");

if (!!document) {
  const svgTemplate = require("html-loader?interpolate!val-loader!../svgbundle.html");
  const templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.appendChild(templateHolder);
}

interface IDownloadOptions {
  pdf?: any;
  csv?: any;
  xlsx?: any;
}

interface IOptions {
  columnMinWidth: number;
  paginationButtonCount: number;
  downloadOptions: IDownloadOptions;
}

var defaultDownloadOptions: IDownloadOptions = {
  pdf: {
    isVisible: true,
    orientation: "portrait", //set page orientation to portrait
    autoTable: {
      //advanced table styling
      styles: {
        fillColor: [26, 179, 148],
      },
      columnStyles: {
        id: { fillColor: 255 },
      },
      margin: { top: 60 },
    },
  },
  csv: { isVisible: true, delimiter: "," },
  xlsx: { isVisible: true, sheetName: "results" },
};

export var defaultOptions: IOptions = {
  columnMinWidth: 248,
  downloadOptions: defaultDownloadOptions,
  paginationButtonCount: 3,
};

export class Tabulator extends Table {
  constructor(
    targetNode: HTMLElement,
    survey: SurveyModel,
    data: Array<Object>,
    options: IOptions,
    _columns: Array<any> = [],
    isTrustedAccess = false
  ) {
    super(targetNode, survey, data, options, _columns, isTrustedAccess);
    const self = this;
    if (!this.options) this.options = defaultOptions;
    targetNode.className += " sa-tabulator";
    if (_columns.length === 0) {
      self._columns = self.buildColumns(survey);
    }
  }
  public renderDetailActions: (
    container: HTMLElement,
    data: any,
    row: any
  ) => HTMLElement;

  public detailButtonCreators: Array<(columnName?: string) => HTMLElement> = [];

  private readonly COLUMN_MIN_WIDTH = 155;
  private tabulatorTables: any = null;
  private tableContainer: HTMLElement = null;
  private tableTools: TableTools;

  public render = () => {
    const columns = this.getColumns();
    const data = this.tableData;

    var header = this.createHeader();
    var paginationElement = this.createPaginationElement();

    this.tableContainer = document.createElement("div");

    this.targetNode.innerHTML = "";
    this.targetNode.appendChild(header);
    this.targetNode.appendChild(this.tableContainer);

    this.tabulatorTables = new TabulatorTables(this.tableContainer, {
      data,
      layout: "fitColumns",
      pagination: "local",
      paginationSize: 5,
      movableColumns: true,
      maxHeight: "100%",
      columns,
      rowFormatter: this.rowFormatter,
      paginationButtonCount: this.options.paginationButtonCount,
      paginationElement: paginationElement,
    });

    const toolsContainer = this.createToolsContainer();
    header.appendChild(this.createDownloadsBar());
    header.appendChild(toolsContainer);
    header.appendChild(paginationElement);
    this.tableTools = new TableTools(toolsContainer, this);
    this.tableTools.render();
  };

  private createDownloadsBar(): HTMLElement {
    var createDownloadButton = (type: string, caption: string): HTMLElement => {
      const btn = ActionsHelper.createBtn(caption);
      btn.onclick = () => {
        this.tabulatorTables.download(type);
      };
      return btn;
    };

    var container = document.createElement("div");
    container.className = "sa-tabulator__downloads-bar";
    if (this.options.downloadOptions.xlsx.isVisible) {
      container.appendChild(createDownloadButton("xlsx", "Excel"));
    }
    if (this.options.downloadOptions.pdf.isVisible) {
      container.appendChild(createDownloadButton("pdf", "PDF"));
    }
    container.appendChild(createDownloadButton("csv", "CSV"));
    return container;
  }

  createToolsContainer = (): HTMLElement => {
    var el = document.createElement("div");
    el.classList.add("sa-tabulator__tools-container");
    return el;
  };

  createHeader = (): HTMLElement => {
    var el = document.createElement("div");
    el.classList.add("sa-tabulator__header");
    return el;
  };

  createPaginationElement = (): HTMLElement => {
    var el = document.createElement("div");
    el.classList.add("sa-tabulator__pagination-container");
    return el;
  };

  public destroy = () => {
    this.tabulatorTables.destroy();
    this.targetNode.innerHTML = "";
  };

  rowFormatter = (row: any): void => {
    var tableRow = new TableRow(
      this,
      row.getElement(),
      row.getData(),
      row.getCells()[0].getElement(),
      row.getElement(),
      this.renderDetailActions
    );
    tableRow.onToggleDetails.add(() => {
      row.normalizeHeight();
      this.update();
    });
    tableRow.render();
  };

  protected getTitleFormatter = (
    cell: any,
    formatterParams: any,
    onRendered: any,
    columnName: any
  ) => {
    var container = document.createElement("div");
    var title = this.getColumnTitle(cell.getValue());
    var actions = this.getHeaderActions(columnName);
    container.appendChild(actions);
    container.appendChild(title);
    return container;
  };

  getColumnTitle = (titleStr: string): HTMLElement => {
    var title = document.createElement("span");
    title.innerHTML = titleStr;
    return title;
  };

  getHeaderActions = (columnName: string): HTMLDivElement => {
    const container = document.createElement("div");
    container.classList.add("sa-table__action-container");
    const columnActions = new ColumnTools(
      container,
      this,
      columnName,
      this.isTrustedAccess
    );
    columnActions.render();
    return container;
  };

  protected getColumns = () => {
    const availableColumns = this.getAvailableColumns();
    var minColumnWidth =
      this.COLUMN_MIN_WIDTH > this.options.columnMinWidth
        ? this.COLUMN_MIN_WIDTH
        : this.options.columnMinWidth;
    const columns: any = availableColumns.map((column, index) => {
      var question = this.survey.getQuestionByName(column.name);
      return {
        field: column.name,
        title: (question && question.title) || column.displayName,
        minWidth: minColumnWidth,
        widthShrink: 1,
        visible: column.visibility !== ColumnVisibility.Invisible,
        // headerFilter: false,
        headerSort: false,
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
      download: false,
      resizable: false,
      width: 60,
    });

    return columns;
  };

  public setColumnVisibility(columnName: string, visibility: ColumnVisibility) {
    super.setColumnVisibility(columnName, visibility);
    if (visibility == ColumnVisibility.Invisible)
      this.tabulatorTables.hideColumn(columnName);
    else this.tabulatorTables.showColumn(columnName);
    this.update();
  }

  public setColumnLocation(columnName: string, location: QuestionLocation) {
    super.setColumnLocation(columnName, location);
    if (location == QuestionLocation.Row)
      this.tabulatorTables.hideColumn(columnName);
    else this.tabulatorTables.showColumn(columnName);
    this.update();
  }

  public sortByColumn(columnName: string, direction: string) {
    this.tabulatorTables.setSort(columnName, direction);
  }

  public applyColumnFilter(columnName: string, value: string) {
    this.tabulatorTables.setFilter(columnName, "like", value);
  }

  public applyFilter(value: string): void {
    var customFilter = (data: any, filterParams: any) => {
      for (var key in data) {
        if (
          data[key].toLowerCase().includes(filterParams.value.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    };
    this.tabulatorTables.setFilter(customFilter, {
      value: value,
    });
  }

  public setPageSize(value: number): void {
    this.tabulatorTables.setPageSize(value);
  }

  public download(type: string): void {
    this.tabulatorTables.download(
      type,
      `results.${type}`,
      (<any>this.options.downloadOptions)[type]
    );
  }

  public update() {
    this.tabulatorTables.redraw();
  }
}
