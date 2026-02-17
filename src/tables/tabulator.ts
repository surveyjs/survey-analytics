import { GetDataFn, ITableOptions, Table, TableRow, TabulatorSortOrder } from "./table";
import { SurveyModel } from "survey-core";
import { ColumnDataType, IColumnData, QuestionLocation } from "./config";
import { DocumentHelper } from "../utils";
import { localization } from "../localizationManager";
import { ARIAL_FONT } from "./custom_jspdf_font";
import { svgTemplate } from "../svgbundle";
import type { DownloadType, SortDirection, TabulatorFull, RowComponent } from "tabulator-tables";
import { TableExtensions } from "./extensions/tableextensions";
import { DashboardTheme, IDashboardTheme } from "../theme";
import "./tabulator.scss";

if(!!document) {
  const templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.appendChild(templateHolder);
}
interface ITabulatorOptions extends ITableOptions {
  tabulatorOptions?: any;
  downloadHiddenColumns?: boolean;
  actionsColumnWidth?: number;
  columnMinWidth?: number;
  downloadButtons?: Array<string>;
  downloadOptions?: { [type: string]: any };
  /*
   *use  to change options dynamically
   */
  onDownloadCallbacks?: {
    [type: string]: (tabulator: Tabulator, options: any) => void,
  };
  xlsx?: any;
  jspdf?: any;
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
          minCellWidth: 100,
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
  actionsColumnWidth: 56,
  columnMinWidth: 384,
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
      if(minWidth > 841.89) {
        options.jsPDF = { format: [595.28, minWidth] };
      }
    },
  },
};

const escapeCellFormula = (field: string) => {
  const formulaPrefix = ["=", "+", "-", "@", String.fromCharCode(0x09), String.fromCharCode(0x0d)];
  if(formulaPrefix.some(prefix => field.startsWith(prefix))) {
    return "'" + field;
  } else {
    return field;
  }
};

type TabulatorParameters = ConstructorParameters<typeof TabulatorFull>;
type TabulatorConstuctor = { new (...args: TabulatorParameters): TabulatorFull };
export class Tabulator extends Table {
  private _appliedTheme: DashboardTheme;
  private _theme = new DashboardTheme();

  private static tabulatorTablesConstructor: TabulatorConstuctor;
  public static initTabulatorConstructor(tabulatorTablesConstructor: TabulatorConstuctor): void {
    this.tabulatorTablesConstructor = tabulatorTablesConstructor;
  }
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
    if(((options && options.xlsx) || (!!window && window["XLSX"] !== undefined)) && defaultOptions.downloadButtons.indexOf("xlsx") === -1) {
      defaultOptions.downloadButtons.unshift("xlsx");
    }
    if(((options && options.jspdf) || (!!window && window["jspdf"] !== undefined)) && defaultOptions.downloadButtons.indexOf("pdf") === -1) {
      defaultOptions.downloadButtons.unshift("pdf");
    }
    this._options = Object.assign({}, defaultOptions, options);
  }

  private readonly COLUMN_MIN_WIDTH = 155;
  public tabulatorTables: TabulatorFull = null;
  private tableContainer: HTMLElement = null;
  private currentDownloadType: string = "";

  protected supportSoftRefresh() {
    return true;
  }

  protected softRefresh() {
    if(!this.isRendered) return;
    this.layout(true);
  }

  public render(targetNode: HTMLElement | string): void {
    super.render(targetNode);
    if(typeof targetNode === "string") {
      targetNode = document.getElementById(targetNode);
    }
    targetNode.className += " sa-table sa-tabulator";
    if(!this._appliedTheme) {
      this._appliedTheme = this.theme;
    }
    if(this._appliedTheme) {
      this._appliedTheme.applyThemeToElement(targetNode);
    }

    const columns = this.getColumns();
    const data = this.tableData;

    var wrapper = DocumentHelper.createElement("div", "sa-tabulator__wrapper");
    var container = DocumentHelper.createElement("div", "sa-tabulator__container");
    var header = DocumentHelper.createElement("div", "sa-tabulator__header");
    var footer = DocumentHelper.createElement("div", "sa-tabulator__footer");
    var paginationElement = DocumentHelper.createElement("div", "sa-tabulator__pagination-container");
    this.tableContainer = DocumentHelper.createElement("div", "sa-tabulator__table-container");

    container.appendChild(header);
    container.appendChild(this.tableContainer);
    container.appendChild(footer);
    wrapper.appendChild(container);
    targetNode.appendChild(wrapper);

    var config: any = {};
    Object.assign(
      config,
      {
        data,
        layout: "fitColumns",
        pagination: this.options.paginationEnabled !== false,
        paginationMode: "local",
        paginationSize: this.currentPageSize,
        movableColumns: true,
        maxHeight: "50vw",
        columns,
        rowFormatter: this.rowFormatter,
        paginationElement: paginationElement,
        tooltipsHeader: true,
        downloadRowRange: "all",
        columnMinWidth: (this.options as ITabulatorOptions).columnMinWidth,
        paginationButtonCount: 3,
        nestedFieldSeparator: false,
        dependencies: {
          jspdf: this._options.jspdf,
          XLSX: this._options.xlsx
        },
        columnDefaults: {
          tooltip: (_: MouseEvent, cell: any) => {
            const span = document.createElement("span");
            span.innerText = cell.getValue();
            return span.innerHTML;
          }
        },
      },
      this._options.tabulatorOptions
    );
    if(data === undefined && typeof this.data === "function") {
      delete config.data;
      config.pagination = true;
      config.paginationMode = "remote";
      config.paginationSize = this.currentPageSize,
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
            filter: this.tabulatorTables?.getFilters(false),
            sort: this.tabulatorTables?.getSorters().map(s => ({ field: s.field, direction: s.dir })),
            callback: dataLoadingCallback
          });
          if(dataLoadingPromise) {
            dataLoadingPromise.then(dataLoadingCallback);
          }
        });
      };
    }

    this.tabulatorTables = new Tabulator.tabulatorTablesConstructor(this.tableContainer, config);
    this.tabulatorTables.on("columnResized", this.columnResizedCallback);
    this.tabulatorTables.on("columnMoved", this.columnMovedCallback);

    const extensionsContainer = DocumentHelper.createElement("div", "sa-table__header-extensions");
    this.extensions.render(extensionsContainer, "header");
    header.appendChild(extensionsContainer);
    header.appendChild(this.createDownloadsBar());
    this.extensions.render(footer, "footer");
    footer.appendChild(paginationElement);
    this.renderResult = targetNode;
  }

  private createDownloadsBar(): HTMLElement {
    /*
    var createDownloadButton = (type: DownloadType, caption: string): HTMLElement => {
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

    this._options.downloadButtons.forEach((type: DownloadType) => {
      container.appendChild(
        createDownloadButton(
          type,
          localization.getString(`${type}DownloadCaption`)
        )
      );
    });
    return container;
    */

    const values = this._options.downloadButtons.map(val => { return { value: val, text: localization.getString(`${val}DownloadCaption`) }; });
    const exportAsAction = DocumentHelper.createActionDropdown({
      options: values,
      isSelected: (option: any) => false,
      handler: (e: any) => {
        if(!!e) {
          this.download(e);
        }
        return true;
      },
      title: localization.getString("exportAs"),
      showArrow: false
    });
    exportAsAction.className += " sa-tabulator__downloads-bar sa-button-brand-secondary";
    return exportAsAction;
  }

  public destroy = () => {
    this.tabulatorTables.destroy();
    super.destroy();
  };

  private columnMovedCallback = (column: any, columns: any[]) => {
    var from = this._columns.indexOf(this.getColumnByName(column.getField()));
    const rowExtensions = TableExtensions.getExtensions("row").filter(e => e.visibleIndex >= 0);
    var to = columns.indexOf(column) - rowExtensions.length;
    this.moveColumn(from, to);
    this.disableColumnReorder();
  };

  private columnResizedCallback = (column: any) => {
    this.setColumnWidth(column.getField(), column.getWidth());
    this.layout();
  };

  private rowFormatter = (row: RowComponent): void => {
    const tableRow = new TabulatorRow(
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
    if(Array.isArray(this.data)) {
      const columnDefinition = columnComponent.getDefinition();
      const questionName = columnDefinition.field;
      const column = this.columns.filter(col => col.name === questionName)[0];
      if(!!column && rowComponent) {
        const dataRow = rowComponent.getData().surveyOriginalData;
        const dataCell = dataRow[questionName];
        if(column.dataType === ColumnDataType.Image) {
          return questionName;
        }
        if(column.dataType === ColumnDataType.FileLink && Array.isArray(dataCell)) {
          return (dataCell || []).map(f => f.name).join(", ");
        }
      }
    }
    if(this.currentDownloadType === "csv" || this.currentDownloadType === "xlsx") {
      return escapeCellFormula(cellData);
    }
    return cellData;
  };

  private getTitleFormatter(
    cell: any,
    formatterParams: any,
    onRendered: any,
    columnName: any
  ): HTMLElement {
    var container = DocumentHelper.createElement("div", "sa-tabulator-column-header");
    var title = DocumentHelper.createElement("span", "sa-tabulator-column-title-text", {
      innerText: cell.getValue(),
    });
    const actionContainer = this.getHeaderActions(columnName);
    const containerFilter = DocumentHelper.createElement("div", "sa-table__filter-container");
    this.extensions.render(containerFilter, "columnfilter", { columnName: columnName });

    container.appendChild(actionContainer);
    container.appendChild(title);
    container.appendChild(containerFilter);
    ["mousemove", "mousedown"].forEach(eventName => actionContainer.addEventListener(eventName, (event) => {
      if(!this.isColumnReorderEnabled) {
        event.stopPropagation();
      }
    }));
    return container;
  }

  private getHeaderActions(columnName: string): HTMLElement {
    const container = DocumentHelper.createElement("div", "sa-table__action-container");
    this.extensions.render(container, "column", { columnName: columnName });
    return container;
  }

  public getColumns(): Array<any> {
    const columns: any = this.columns.map((column, index) => {
      let formatter = "plaintext";
      if(column.dataType == ColumnDataType.FileLink) {
        formatter = "html";
      }
      if(column.dataType == ColumnDataType.Image) {
        formatter = "image";
      }
      return {
        field: column.name,
        title: column.displayName || column.name,
        width: column.width,
        widthShrink: !column.width ? 1 : 0,
        visible: this.isColumnVisible(column),
        headerSort: false,
        minWidth: this._options.columnMinWidth,
        download: this.options.downloadHiddenColumns ? true : undefined,
        formatter,
        headerTooltip: true,
        headerWordWrap: true,
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
    const rowExtensions = TableExtensions.getExtensions("row").filter(e => e.visibleIndex >= 0);
    // const detailsExtension = TableExtensions.getExtensions("details").filter(e => e.visibleIndex >= 0);
    // const hasRowColumns = this.columns.some(c => c.location === QuestionLocation.Row);
    // if(rowExtensions.length > 1 || detailsExtension.length > 0
    //       || rowExtensions.length == 1 && (rowExtensions[0].name == "details" && hasRowColumns || rowExtensions[0].name != "details")) {
    rowExtensions.forEach(ext => {
      columns.unshift({
        download: false,
        resizable: false,
        headerSort: false,
        minWidth: this._options.actionsColumnWidth,
        width: this._options.actionsColumnWidth,
        tooltip: (_: MouseEvent, cell: any) => {
          return undefined;
        }
      });
    });
    // }

    return columns;
  }

  public setColumnVisibility(columnName: string, isVisible: boolean): void {
    super.setColumnVisibility(columnName, isVisible);
    if(this.isRendered) {
      if(isVisible) {
        this.tabulatorTables.showColumn(columnName);
      } else {
        this.tabulatorTables.hideColumn(columnName);
      }
      this.layout();
    }
  }

  public setColumnLocation(columnName: string, location: QuestionLocation): void {
    super.setColumnLocation(columnName, location);
    if(this.isRendered) {
      if(location == QuestionLocation.Row)
        this.tabulatorTables.hideColumn(columnName);
      else this.tabulatorTables.showColumn(columnName);
      this.layout();
    }
  }

  public setColumnWidth(columnName: string, width: number): void {
    super.setColumnWidth(columnName, width);
    if(this.isRendered) {
      const column = this.tabulatorTables.getColumn(columnName);
      if(!!column) {
        const definition = column.getDefinition();
        definition.width = width;
        definition.widthShrink = !!width ? 0 : 1;
        column.setWidth(width);
      }
    }
  }

  public sortByColumn(columnName: string, direction: SortDirection): void {
    this.tabulatorTables.setSort(columnName, direction);
  }

  public applyColumnFilter(columnName: string, value: string): void {
    this.tabulatorTables.setFilter(columnName, "like", value);
  }

  public applyFilter(value: string): void {
    var customFilter = (data: any, filterParams: any) => {
      for(var key in data) {
        if(
          data[key] &&
          typeof data[key] === "string" &&
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
    if(!this.isRendered) {
      return 1;
    }
    const pageNumber = this.tabulatorTables.getPage();
    return pageNumber ? pageNumber : -1;
  }

  public setPageNumber(value: number): void {
    super.setPageNumber(value);
    if(this.isRendered) {
      this.tabulatorTables.setPage(value);
    }
  }

  public setPageSize(value: number): void {
    super.setPageSize(value);
    if(this.isRendered) {
      this.tabulatorTables.setPageSize(value);
    }
  }

  private getDownloadOptions(type: string): any {
    const options = Object.assign(
      {},
      this._options.downloadOptions[type] || defaultOptions.downloadOptions[type]
    );
    const onDownloadCallback = this._options.onDownloadCallbacks[type];
    if(!!onDownloadCallback) onDownloadCallback(this, options);
    return options;
  }

  public download(type: DownloadType): void {
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
  protected processLoadedDataItem(item: any) {
    const dataItem = super.processLoadedDataItem(item);
    dataItem["surveyOriginalData"] = item;
    return dataItem;
  }

  get theme() : DashboardTheme {
    return this._theme;
  }
  set theme(theme: DashboardTheme) {
    this._theme = theme;
    this._appliedTheme = undefined;
  }

  public applyTheme(theme: IDashboardTheme): void {
    this.theme.setTheme(theme);
    this._appliedTheme = this.theme;
    if(this.renderResult) {
      this._appliedTheme.applyThemeToElement(this.renderResult);
    }
  }
}

export class TabulatorRow extends TableRow {
  constructor(
    protected table: Table,
    protected extensionsContainer: HTMLElement,
    protected detailsContainer: HTMLElement,
    protected innerRow: any,
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
    const data = this.table.getData();
    if(Array.isArray(data)) {
      return data.indexOf(this.innerRow.getData().surveyOriginalData);
    }
    return null;
  }

  public render() {
    let rowExtensions = TableExtensions.getExtensions("row").filter(e => e.visibleIndex >= 0);
    rowExtensions = this.extensions.sortExtensions(rowExtensions);
    rowExtensions.forEach((rowExt, index) => {
      const cellAction = this.innerRow.getCells()[index].getElement();
      cellAction.innerHTML = "";
      this.extensions.renderExtension(rowExt, cellAction, { row: this });
      cellAction.classList.add("sa-tabulator-cell__action");
      cellAction.classList.add("sa-tabulator-cell__action-" + rowExt.name.toLowerCase());
    });
  }

  public remove(): void {
    this.innerRow.delete();
    super.remove();
  }
}
