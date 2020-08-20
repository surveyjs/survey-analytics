import { Table, TableRow } from "./table";
import { SurveyModel } from "survey-core";
import { ColumnVisibility, QuestionLocation } from "./config";

import "./tabulator.scss";
import { DocumentHelper } from "../utils";
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
  actionsColumnWidth: number;
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
  actionsColumnWidth: 60,
};

export class Tabulator extends Table {
  constructor(
    survey: SurveyModel,
    data: Array<Object>,
    options: IOptions,
    _columns: Array<any> = [],
    isTrustedAccess = false
  ) {
    super(survey, data, options, _columns, isTrustedAccess);
    const self = this;
    var patchedOptions = {};
    Object.assign(patchedOptions, defaultOptions, options);
    this.options = patchedOptions;
  }

  private readonly COLUMN_MIN_WIDTH = 155;
  public tabulatorTables: any = null;
  private tableContainer: HTMLElement = null;

  public render(targetNode: HTMLElement): void {
    targetNode.className += " sa-table sa-tabulator";
    targetNode.innerHTML = "";

    const columns = this.getColumns();
    const data = this.tableData;

    var header = DocumentHelper.createElement("div", "sa-tabulator__header");
    var paginationElement = DocumentHelper.createElement(
      "div",
      "sa-tabulator__pagination-container"
    );
    this.tableContainer = DocumentHelper.createElement("div");

    targetNode.appendChild(header);
    targetNode.appendChild(this.tableContainer);

    this.tabulatorTables = new TabulatorTables(this.tableContainer, {
      data,
      layout: "fitColumns",
      pagination: "local",
      paginationSize: this.currentPageSize,
      movableColumns: true,
      maxHeight: "100%",
      columns,
      rowFormatter: this.rowFormatter,
      paginationButtonCount: this.options.paginationButtonCount,
      paginationElement: paginationElement,
      columnMoved: this.columnMovedCallback,
      columnResized: this.columnResizedCallback,
      tooltipsHeader: true,
      tooltips: (cell: any) => cell.getValue(),
    });

    const extensionsContainer = DocumentHelper.createElement(
      "div",
      "sa-table__header-extensions"
    );
    header.appendChild(this.createDownloadsBar());
    header.appendChild(extensionsContainer);
    header.appendChild(paginationElement);
    this.extensions.render(extensionsContainer, "header");
    this.renderResult = targetNode;
  }

  private createDownloadsBar(): HTMLElement {
    var createDownloadButton = (type: string, caption: string): HTMLElement => {
      const btn = DocumentHelper.createElement(
        "button",
        "sa-table__btn sa-table__btn--small sa-table__btn--gray",
        {
          innerHTML: caption,
          onclick: () => {
            this.download(type);
          },
        }
      );
      return btn;
    };

    var container = DocumentHelper.createElement(
      "div",
      "sa-tabulator__downloads-bar"
    );
    if (this.options.downloadOptions.xlsx.isVisible) {
      container.appendChild(createDownloadButton("xlsx", "Excel"));
    }
    if (this.options.downloadOptions.pdf.isVisible) {
      container.appendChild(createDownloadButton("pdf", "PDF"));
    }
    container.appendChild(createDownloadButton("csv", "CSV"));
    return container;
  }

  public destroy = () => {
    this.tabulatorTables.destroy();
    super.destroy();
  };

  private columnMovedCallback = (column: any, columns: any[]) => {
    var from = this._columns.indexOf(this.getColumnByName(column.getField()));
    var to = columns.indexOf(column) - 1;
    this.moveColumn(from, to);
    this.disableColumnReorder();
  };

  private columnResizedCallback = (column: any) => {
    this.setColumnWidth(column.getField(), column.getWidth());
    this.layout();
  };

  private rowFormatter = (row: any): void => {
    var tableRow = new TabulatorRow(
      this,
      row.getCells()[0].getElement(),
      row.getElement(),
      row
    );
    tableRow.onToggleDetails.add(() => {
      row.normalizeHeight();
      this.layout();
    });
    tableRow.render();

    this._rows.push(tableRow);
  };

  private getTitleFormatter(
    cell: any,
    formatterParams: any,
    onRendered: any,
    columnName: any
  ): HTMLElement {
    var container = DocumentHelper.createElement("div");
    var title = DocumentHelper.createElement("span", "", {
      innerHTML: cell.getValue(),
    });
    var actions = this.getHeaderActions(columnName);
    container.appendChild(actions);
    container.appendChild(title);
    container.onmousedown = (e: any) => {
      if (!this.isColumnReorderEnabled) {
        e.stopPropagation();
      } else {
        this.disableColumnReorder();
      }
    };
    return container;
  }

  private getHeaderActions(columnName: string): HTMLElement {
    const container = DocumentHelper.createElement(
      "div",
      "sa-table__action-container"
    );
    this.extensions.render(container, "column", { columnName: columnName });
    return container;
  }

  public getColumns(): Array<any> {
    var minColumnWidth =
      this.COLUMN_MIN_WIDTH > this.options.columnMinWidth
        ? this.COLUMN_MIN_WIDTH
        : this.options.columnMinWidth;
    const columns: any = this.getAvailableColumns().map((column, index) => {
      var question = this.survey.getQuestionByName(column.name);
      return {
        field: column.name,
        title: (question && question.title) || column.displayName,
        minWidth: minColumnWidth,
        width: column.width,
        widthShrink: !column.width ? 1 : 0,
        visible: this.isColumnVisible(column),
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
      width: this.options.actionsColumnWidth,
    });

    return columns;
  }

  public setColumnVisibility(columnName: string, visibility: ColumnVisibility) {
    super.setColumnVisibility(columnName, visibility);
    if (visibility == ColumnVisibility.Invisible)
      this.tabulatorTables.hideColumn(columnName);
    else this.tabulatorTables.showColumn(columnName);
    this.layout();
  }

  public setColumnLocation(columnName: string, location: QuestionLocation) {
    super.setColumnLocation(columnName, location);
    if (location == QuestionLocation.Row)
      this.tabulatorTables.hideColumn(columnName);
    else this.tabulatorTables.showColumn(columnName);
    this.layout();
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

  public getPageNumber(): number {
    if (!this.isRendered) {
      return 1;
    }
    return this.tabulatorTables.getPage();
  }

  public setPageNumber(value: number): void {
    super.setPageNumber(value);
    if (this.isRendered) {
      this.tabulatorTables.setPage(value);
    }
  }

  public setPageSize(value: number): void {
    super.setPageSize(value);
    if (this.isRendered) {
      this.tabulatorTables.setPageSize(value);
    }
  }

  public download(type: string): void {
    this.tabulatorTables.download(
      type,
      `results.${type}`,
      (<any>this.options.downloadOptions)[type]
    );
  }

  public layout() {
    this.tabulatorTables.redraw();
  }
}

export class TabulatorRow extends TableRow {
  constructor(
    protected table: Table,
    protected extensionsContainer: HTMLElement,
    protected detailsContainer: HTMLElement,
    protected innerRow: any
  ) {
    super(table, extensionsContainer, detailsContainer);
  }

  public getElement(): HTMLElement {
    return this.innerRow.getElement();
  }

  public getRowData(): HTMLElement {
    return this.innerRow.getData();
  }

  public getDataPosition(): number {
    return this.innerRow.getPosition();
  }

  public remove() {
    this.innerRow.delete();
    super.remove();
  }
}
