import { ITableOptions, Table, TableRow } from "./table";
import { SurveyModel } from "survey-core";
import { ColumnDataType, QuestionLocation } from "./config";

import "./tabulator.scss";
import { DocumentHelper } from "../utils";
import { localization } from "../localizationManager";
import TabulatorTables from "tabulator-tables";

if (!!document) {
  const svgTemplate = require("html-loader?interpolate!val-loader!../svgbundle.html");
  const templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.appendChild(templateHolder);
}

interface ITabulatorOptions extends ITableOptions {
  tabulatorOptions?: any;
  downloadHiddenColumns?: boolean;
  actionsColumnWidth?: number;
  downloadButtons: Array<string>;
  downloadOptions?: { [type: string]: any };
}

const defaultDownloadOptions = {
  fileName: "results",
  pdf: {
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
  csv: { delimiter: "," },
  xlsx: { sheetName: "results" },
};

const defaultOptions: ITabulatorOptions = {
  tabulatorOptions: {},
  actionsColumnWidth: 60,
  downloadHiddenColumns: false,
  downloadButtons: ["pdf", "xlsx", "csv"],
  downloadOptions: defaultDownloadOptions,
};

export class Tabulator extends Table {
  public static set haveCommercialLicense(val: boolean) {
    Table.haveCommercialLicense = val;
  }

  constructor(
    survey: SurveyModel,
    data: Array<Object>,
    options: ITabulatorOptions,
    _columns: Array<any> = []
  ) {
    super(survey, data, options, _columns);
    var patchedOptions = {};
    Object.assign(patchedOptions, defaultOptions, options);
    this.options = patchedOptions;
  }

  private readonly COLUMN_MIN_WIDTH = 155;
  public tabulatorTables: any = null;
  private tableContainer: HTMLElement = null;

  public render(targetNode: HTMLElement): void {
    super.render(targetNode);
    targetNode.className += " sa-table sa-tabulator";

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

    var config = {};
    Object.assign(
      config,
      {
        data,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: this.currentPageSize,
        movableColumns: true,
        maxHeight: "100%",
        columns,
        rowFormatter: this.rowFormatter,
        paginationElement: paginationElement,
        columnMoved: this.columnMovedCallback,
        columnResized: this.columnResizedCallback,
        tooltipsHeader: true,
        tooltips: (cell: any) => cell.getValue(),
        downloadRowRange: "all",
        columnMinWidth: 248,
        paginationButtonCount: 3,
      },
      this.options.tabulatorOptions
    );

    this.tabulatorTables = new TabulatorTables(this.tableContainer, config);

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

    this.options.downloadButtons.forEach((type: string) => {
      container.appendChild(
        createDownloadButton(
          type,
          localization.getString(`${type}DownloadCaption`)
        )
      );
    });
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
    const columns: any = this.columns.map((column, index) => {
      var question = this.survey.getQuestionByName(column.name);
      return {
        field: column.name,
        title: (question && question.title) || column.displayName,
        width: column.width,
        widthShrink: !column.width ? 1 : 0,
        visible: this.isColumnVisible(column),
        headerSort: false,
        download: this.options.downloadHiddenColumns ? true : undefined,
        formatter:
          column.dataType == ColumnDataType.FileLink ? "html" : "plaintext",
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
      minWidth: this.options.actionsColumnWidth,
      width: this.options.actionsColumnWidth,
    });

    return columns;
  }

  public setColumnVisibility(columnName: string, isVisible: boolean) {
    super.setColumnVisibility(columnName, isVisible);
    if (this.isRendered) {
      if (isVisible) {
        this.tabulatorTables.showColumn(columnName);
      } else {
        this.tabulatorTables.hideColumn(columnName);
      }
      this.layout();
    }
  }

  public setColumnLocation(columnName: string, location: QuestionLocation) {
    super.setColumnLocation(columnName, location);
    if (this.isRendered) {
      if (location == QuestionLocation.Row)
        this.tabulatorTables.hideColumn(columnName);
      else this.tabulatorTables.showColumn(columnName);
      this.layout();
    }
  }

  public setColumnWidth(columnName: string, width: number | string) {
    super.setColumnWidth(columnName, width);
    if (this.isRendered) {
      var definition = this.tabulatorTables
        .getColumn(columnName)
        .getDefinition();
      definition.width = width;
      definition.widthShrink = 0;
      this.layout();
    }
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
      `${this.options.downloadOptions.fileName}.${type}`,
      this.options.downloadOptions[type] || defaultOptions.downloadOptions[type]
    );
  }

  public layout(hard: boolean = false) {
    this.tabulatorTables.redraw(hard);
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
