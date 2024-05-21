import { GetDataFn, ITableOptions, Table, TableRow } from "./table";
import { SurveyModel } from "survey-core";
import { ColumnDataType, IColumnData, QuestionLocation } from "./config";
import { DocumentHelper } from "../utils";
import { localization } from "../localizationManager";
import TabulatorTables from "tabulator-tables";
import { ARIAL_FONT } from "./custom_jspdf_font";

var styles = require("./tabulator.scss");

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
  /*
   *use  to change options dynamically
   */
  onDownloadCallbacks?: {
    [type: string]: (tabulator: Tabulator, options: any) => void,
  };
}

export const defaultDownloadOptions = {
  fileName: "results",
  pdf: {
    orientation: "landscape",
    autoTable: function (doc: any) {
      doc.addFileToVFS("custom_helvetica.ttf", ARIAL_FONT);
      doc.addFont("custom_helvetica.ttf", "custom_helvetica", "normal");
      return {
        styles: {
          font: "custom_helvetica",
          fontStyle: "normal",
          cellWidth: 1,
        },
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
      };
    },
  },
  csv: { delimiter: "," },
  xlsx: { sheetName: "results" },
};

export const defaultOptions: ITabulatorOptions = {
  tabulatorOptions: {},
  actionsColumnWidth: 60,
  downloadHiddenColumns: false,
  downloadButtons: ["csv"],
  downloadOptions: defaultDownloadOptions,
  onDownloadCallbacks: {
    pdf: (tabulator: Tabulator, options) => {
      const minWidth =
        (tabulator.tabulatorTables
          .getColumns(true)
          .filter((col: any) => col.isVisible()).length -
          1) *
        186.72;
      if (minWidth > 841.89) {
        options.jsPDF = { format: [595.28, minWidth] };
      }
    },
  },
};

const escapeCellFormula = (field: string) => {
  const formulaPrefix = ["=", "+", "-", "@", String.fromCharCode(0x09), String.fromCharCode(0x0d)];
  if (formulaPrefix.some(prefix => field.startsWith(prefix))) {
    return "'" + field;
  } else {
    return field;
  }
};

export class Tabulator extends Table {
  public static set haveCommercialLicense(val: boolean) {
    Table.haveCommercialLicense = val;
  }

  constructor(
    survey: SurveyModel,
    data: Array<Object> | GetDataFn,
    options?: ITabulatorOptions,
    _columnsData: Array<IColumnData> = []
  ) {
    super(survey, data, options, _columnsData);
    if(!!window && window["XLSX"] !== undefined && defaultOptions.downloadButtons.indexOf("xlsx") === -1) {
      defaultOptions.downloadButtons.unshift("xlsx");
    }
    if(!!window && window["jsPDF"] !== undefined && defaultOptions.downloadButtons.indexOf("pdf") === -1) {
      defaultOptions.downloadButtons.unshift("pdf");
    }
    this._options = Object.assign({}, defaultOptions, options);
  }

  private readonly COLUMN_MIN_WIDTH = 155;
  public tabulatorTables: any = null;
  private tableContainer: HTMLElement = null;
  private currentDownloadType: string = "";

  public render(targetNode: HTMLElement | string): void {
    super.render(targetNode);
    if (typeof targetNode === "string") {
      targetNode = document.getElementById(targetNode);
    }
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

    var config: any = {};
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
        nestedFieldSeparator: false,
      },
      this._options.tabulatorOptions
    );
    if(data === undefined && typeof this.data === "function") {
      delete config.data;
      config.pagination = "remote";
      config.ajaxFiltering = true; // Tabulator v4.8
      config.filterMode = "remote"; // Tabulator v6.2
      config.ajaxSorting = true; // Tabulator v4.8
      config.sortMode = "remote"; // Tabulator v6.2
      config.ajaxURL = "function",
      config.ajaxRequestFunc = (url, config, params) => {
        return new Promise<{ data: Array<Object>, last_page: number }>((resolve, reject) => {
          const dataLoadingCallback = (loadedData: { data: Array<Object>, totalCount: number, error?: any }) => {
            if(!loadedData.error && Array.isArray(loadedData.data)) {
              resolve({ data: loadedData.data.map(item => this.processLoadedDataItem(item)), last_page: Math.ceil(loadedData.totalCount / params.size) });
            } else {
              reject();
            }
          };
          const dataLoadingPromise = (this.data as GetDataFn)({
            offset: (params.page - 1) * params.size,
            limit: params.size,
            filter: this.tabulatorTables?.getFilters(),
            sort: this.tabulatorTables?.getSorters().map(s => ({ field: s.field, dir: s.dir })),
            callback: dataLoadingCallback
          });
          if(dataLoadingPromise) {
            dataLoadingPromise.then(dataLoadingCallback);
          }
        });
      };
    }

    this.tabulatorTables = new TabulatorTables(this.tableContainer, config);

    const extensionsContainer = DocumentHelper.createElement(
      "div",
      "sa-table__header-extensions"
    );
    header.appendChild(this.createDownloadsBar());
    this.extensions.render(header, "header");
    // header.appendChild(extensionsContainer);
    header.appendChild(paginationElement);
    this.renderResult = targetNode;
  }

  private createDownloadsBar(): HTMLElement {
    var createDownloadButton = (type: string, caption: string): HTMLElement => {
      const btn = DocumentHelper.createElement(
        "button",
        "sa-table__btn sa-table__btn--small sa-table__btn--gray",
        {
          innerText: caption,
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

    this._options.downloadButtons.forEach((type: string) => {
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
  private accessorDownload = (cellData: any, rowData: any, reason: string, _: any, columnComponent: any, rowComponent: any) => {
    const columnDefinition = columnComponent.getDefinition();
    const questionName = columnDefinition.field;
    const column = this.columns.filter(col => col.name === questionName)[0];
    if (!!column && rowComponent) {
      const dataRow = this.data[rowComponent.getPosition()];
      const dataCell = dataRow[questionName];
      if (column.dataType === ColumnDataType.Image) {
        return questionName;
      }
      if (column.dataType === ColumnDataType.FileLink && Array.isArray(dataCell)) {
        return (dataCell || []).map(f => f.name).join(", ");
      }
    }
    if (this.currentDownloadType === "csv" || this.currentDownloadType === "xlsx") {
      return escapeCellFormula(cellData);
    }
    return cellData;
  }

  private getTitleFormatter(
    cell: any,
    formatterParams: any,
    onRendered: any,
    columnName: any
  ): HTMLElement {
    var container = DocumentHelper.createElement("div");
    var title = DocumentHelper.createElement("span", "", {
      innerText: cell.getValue(),
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
      let question = this._survey.getQuestionByName(column.name);
      let formatter = "plaintext";
      if (column.dataType == ColumnDataType.FileLink) {
        formatter = "html";
      }
      if (column.dataType == ColumnDataType.Image) {
        formatter = "image";
      }
      return {
        field: column.name,
        title:
          (question &&
            (this._options.useNamesAsTitles ? question.name : question.title)) ||
          column.displayName,
        width: column.width,
        widthShrink: !column.width ? 1 : 0,
        visible: this.isColumnVisible(column),
        headerSort: false,
        download: this._options.downloadHiddenColumns ? true : undefined,
        formatter,
        accessorDownload: this.accessorDownload,
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
      minWidth: this._options.actionsColumnWidth,
      width: this._options.actionsColumnWidth,
    });

    return columns;
  }

  public setColumnVisibility(columnName: string, isVisible: boolean): void {
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

  public setColumnLocation(columnName: string, location: QuestionLocation): void {
    super.setColumnLocation(columnName, location);
    if (this.isRendered) {
      if (location == QuestionLocation.Row)
        this.tabulatorTables.hideColumn(columnName);
      else this.tabulatorTables.showColumn(columnName);
      this.layout();
    }
  }

  public setColumnWidth(columnName: string, width: number | string): void {
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

  public sortByColumn(columnName: string, direction: string): void {
    this.tabulatorTables.setSort(columnName, direction);
  }

  public applyColumnFilter(columnName: string, value: string): void {
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

  private getDownloadOptions(type: string): any {
    const options = Object.assign(
      {},
      this._options.downloadOptions[type] || defaultOptions.downloadOptions[type]
    );
    const onDownloadCallback = this._options.onDownloadCallbacks[type];
    if (!!onDownloadCallback) onDownloadCallback(this, options);
    return options;
  }

  public download(type: string): void {
    this.currentDownloadType = type;
    this.tabulatorTables.download(
      type,
      `${this._options.downloadOptions.fileName}.${type}`,
      this.getDownloadOptions(type)
    );
  }

  public layout(hard: boolean = false): void {
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

  public remove(): void {
    this.innerRow.delete();
    super.remove();
  }
}
