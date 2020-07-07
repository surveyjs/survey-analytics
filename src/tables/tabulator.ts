import { Table, Event } from "./table";
import { SurveyModel } from "survey-core";
import { ColumnVisibility, QuestionLocation } from "./config";
import { localization } from "../localizationManager";

import "./tabulator.scss";
import { ActionsHelper } from "../utils";

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
  columnMinWidth: 208,
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
    targetNode.className += "sa-tabulator";
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

  public onColumnsVisibilityChanged: Event<
    (sender: Tabulator, options: any) => any,
    any
  > = new Event<(sender: Tabulator, options: any) => any, any>();

  public onColumnsLocationChanged: Event<
    (sender: Tabulator, options: any) => any,
    any
  > = new Event<(sender: Tabulator, options: any) => any, any>();

  public getTabulatorTables(): any {
    return this.tabulatorTables;
  }

  public getData() {
    return this.data;
  }

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
      rowFormatter: this.toggleDetails,
      paginationButtonCount: this.options.paginationButtonCount,
      paginationElement: paginationElement,
    });

    const toolsContainer = this.createToolsContainer();
    header.appendChild(toolsContainer);
    header.appendChild(paginationElement);
    header.appendChild(this.getEntriesContainer());
    this.tableTools = new TableTools(toolsContainer, this, this.options);
    this.tableTools.render();

    this.onColumnsLocationChanged.add(() => {
      this.update();
    });
    this.onColumnsVisibilityChanged.add(() => {
      this.update();
    });
  };

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

  toggleDetails = (row: any): void => {
    var rowTools = new RowTools(
      row.getCells()[0].getElement(),
      this,
      row,
      this.renderDetailActions
    );
    rowTools.render();
  };

  getDetailsBtn = (row: any) => {
    const btn = ActionsHelper.createSvgButton("detail");
    btn.title = localization.getString("showMinorColumns");
    var self = this;
    var detailsTable = document.createElement("table");
    detailsTable.style.display = "none";
    row.getElement().appendChild(detailsTable);

    var isExpand = false;
    var detailedRow = row;

    btn.onclick = function () {
      if (isExpand) {
        detailsTable.style.display = "none";
        isExpand = false;
        return;
      }

      isExpand = true;
      detailsTable.style.display = "table";
      detailsTable.className = "sa-tabulator__detail-table";
      detailsTable.innerHTML = "";

      var rows: HTMLElement[] = [];
      self.columns
        .filter((column) => column.location === QuestionLocation.Row && column)
        .forEach((column) => {
          var row = document.createElement("tr");
          row.className = "sa-tabulator__detail";
          var td1 = document.createElement("td");
          td1.textContent = column.displayName;
          var td2 = document.createElement("td");
          td2.textContent = detailedRow.getData()[column.name];
          var td3 = document.createElement("td");
          self.detailButtonCreators.forEach((creator) =>
            td3.appendChild(creator(column.name))
          );
          row.appendChild(td1);
          row.appendChild(td2);
          row.appendChild(td3);
          rows.push(row);
        });
      if (!!self.renderDetailActions) {
        var row = document.createElement("tr");
        row.className = "sa-tabulator__detail";
        var td = document.createElement("td");
        row.appendChild(td);
        rows.push(row);
        self.renderDetailActions(td, self.data, row);
      }
      rows.forEach(function (row) {
        detailsTable.appendChild(row);
      });
      detailedRow.normalizeHeight();
    };
    return btn;
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
    container.classList.add("sa-tabulator__action-container");
    const columnActions = new ColumnTools(container, this, columnName);
    columnActions.render();
    return container;
  };

  getEntriesContainer(): HTMLElement {
    const selectorContainer = document.createElement("div");
    selectorContainer.className = "sa-tabulator__entries";
    const showSpan = document.createElement("span");
    showSpan.innerHTML = "Show";
    const entriesSpan = document.createElement("span");
    entriesSpan.innerHTML = "entries";
    entriesSpan.className =
      "sa-tabulator__entries-label sa-tabulator__entries-label--left";
    selectorContainer.appendChild(showSpan);
    showSpan.className =
      "sa-tabulator__entries-label sa-tabulator__entries-label--right";
    selectorContainer.appendChild(this.getEntriesDropdown());
    selectorContainer.appendChild(entriesSpan);
    return selectorContainer;
  }

  getEntriesDropdown(): HTMLElement {
    const el = document.createElement("select");
    var optionsValues = ["1", "5", "10", "25", "50", "75", "100"];
    optionsValues.forEach(function (val) {
      var option = document.createElement("option");
      option.innerHTML = val;
      el.appendChild(option);
    });
    el.value = "5";

    el.onchange = () => {
      this.tabulatorTables.setPageSize(el.value);
    };

    return el;
  }

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
      download: false,
      resizable: false,
      width: 60,
    });

    return columns;
  };

  public update() {
    this.tabulatorTables.redraw();
  }
}

class TableTools {
  constructor(
    private targetNode: HTMLElement,
    private tabulator: Tabulator,
    private options: IOptions
  ) {}
  private showColumnDropdown: HTMLElement;

  render() {
    this.showColumnDropdown = this.createShowColumnDropdown();
    const filterInput = this.createFilterInput();

    this.targetNode.innerHTML = "";

    if (this.options.downloadOptions.xlsx.isVisible) {
      this.targetNode.appendChild(this.createDownloadButton("xlsx", "Excel"));
    }
    if (this.options.downloadOptions.pdf.isVisible) {
      this.targetNode.appendChild(this.createDownloadButton("pdf", "PDF"));
    }
    this.targetNode.appendChild(this.createDownloadButton("csv", "CSV"));

    this.targetNode.appendChild(filterInput);
    if (!!this.showColumnDropdown)
      this.targetNode.appendChild(this.showColumnDropdown);

    this.tabulator.onColumnsVisibilityChanged.add(() => {
      this.update();
    });
  }

  protected createFilterInput(): HTMLElement {
    const input = document.createElement("input");
    input.classList.add("sa-tabulator__global-filter");
    input.placeholder = "Search...";
    input.onchange = (event: any) => {
      this.tabulator
        .getTabulatorTables()
        .setFilter(ActionsHelper.customFilter, {
          value: event.target.value,
        });
    };
    return input;
  }

  protected createShowColumnDropdown = (): HTMLElement => {
    const dropdown = document.createElement("select");
    dropdown.classList.add("sa-tabulator__show-column");

    var hiddenColumns = this.tabulator.columns.filter(
      (column) => column.visibility === ColumnVisibility.Invisible
    );
    if (hiddenColumns.length == 0) return null;
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

      var column = self.tabulator.columns.filter(
        (column) => column.name === val
      )[0];
      column.visibility = ColumnVisibility.Visible;
      self.tabulator.getTabulatorTables().toggleColumn(column.name);
      self.update();
    };

    return dropdown;
  };

  public update() {
    if (!!this.showColumnDropdown) this.showColumnDropdown.remove();
    this.showColumnDropdown = this.createShowColumnDropdown();
    if (!!this.showColumnDropdown)
      this.targetNode.appendChild(this.showColumnDropdown);
  }

  protected createDownloadButton(
    type: string,
    caption: string
  ): HTMLButtonElement {
    const btn = ActionsHelper.createBtn(caption);
    var self = this;
    btn.onclick = (ev) => {
      self.tabulator
        .getTabulatorTables()
        .download(
          type,
          `results.${type}`,
          (<any>this.options.downloadOptions)[type]
        );
    };
    return btn;
  }
}

class ColumnTools {
  constructor(
    private targetNode: HTMLElement,
    private tabulator: Tabulator,
    private columnName: string
  ) {}

  public render() {
    this.targetNode.appendChild(this.createDragBtn());
    this.targetNode.appendChild(this.createSortBtn());
    this.targetNode.appendChild(this.createMoveToDetailsBtn());
    this.targetNode.appendChild(this.createHideBtn());
  }

  protected createDragBtn(): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.className = "sa-tabulator__svg-button sa-tabulator__drag-button";
    btn.appendChild(ActionsHelper.createSvgElement("drag"));
    btn.onclick = (e) => {
      e.stopPropagation();
    };
    return btn;
  }

  protected createSortBtn(): HTMLButtonElement {
    const descTitle = localization.getString("descOrder");
    const ascTitle = localization.getString("ascOrder");
    var btn = ActionsHelper.createSvgButton("sorting");
    btn.onclick = (e) => {
      btn.title = btn.title == ascTitle ? descTitle : ascTitle;
    };
    btn.ondrag = (e) => {
      e.stopPropagation();
    };
    return btn;
  }

  protected createHideBtn(): HTMLButtonElement {
    var btn = ActionsHelper.createSvgButton("hide");
    btn.onclick = () => {
      this.tabulator.columns.filter(
        (column) => column.name === this.columnName
      )[0].visibility = ColumnVisibility.Invisible;
      this.tabulator.getTabulatorTables().toggleColumn(this.columnName);
      this.tabulator.onColumnsVisibilityChanged.fire(this.tabulator, null);
    };
    return btn;
  }

  protected createMoveToDetailsBtn(): HTMLButtonElement {
    const button = ActionsHelper.createSvgButton("movetodetails");
    button.title = localization.getString("moveToDetail");
    button.onclick = (e) => {
      e.stopPropagation();
      this.tabulator.columns.filter(
        (column) => column.name === this.columnName
      )[0].location = QuestionLocation.Row;
      this.tabulator.getTabulatorTables().toggleColumn(this.columnName);
      this.tabulator.onColumnsLocationChanged.fire(this.tabulator, null);
    };
    return button;
  }
}

class RowTools {
  constructor(
    private targetNode: HTMLElement,
    private tabulator: Tabulator,
    private row: any,
    private renderActions: any
  ) {}
  private detailsTable: HTMLElement;
  private isDetailsExpanded: boolean;

  public render() {
    var self = this;
    this.targetNode.appendChild(this.createDetailsBtn(this.row));
    this.tabulator.onColumnsLocationChanged.add(function () {
      self.closeDetails();
    });
  }

  protected createShowAsColumnButton = (columnName?: string): HTMLElement => {
    const button = document.createElement("button");
    button.innerHTML = localization.getString("showAsColumn");
    button.className = "sa-tabulator__btn sa-tabulator__btn--gray";
    button.onclick = (e) => {
      e.stopPropagation();
      this.tabulator.columns.filter(
        (column) => column.name === columnName
      )[0].location = QuestionLocation.Column;
      this.tabulator.getTabulatorTables().toggleColumn(columnName);
      this.tabulator.onColumnsLocationChanged.fire(this.tabulator, null);
    };

    return button;
  };

  protected createDetailsBtn = (row: any) => {
    const btn = ActionsHelper.createSvgButton("detail");
    btn.title = localization.getString("showMinorColumns");
    var self = this;
    var detailsTable = document.createElement("table");
    detailsTable.style.display = "none";

    this.detailsTable = detailsTable;

    row.getElement().appendChild(detailsTable);

    this.isDetailsExpanded = false;
    var detailedRow = row;

    btn.onclick = function () {
      if (self.isDetailsExpanded) {
        self.closeDetails();
        return;
      }
      self.isDetailsExpanded = true;
      self.row.getElement().classList.add("sa-tabulator__detail-row");
      detailsTable.style.display = "table";
      detailsTable.className = "sa-tabulator__detail-table";
      detailsTable.innerHTML = "";

      var rows: HTMLElement[] = [];
      self.tabulator.columns
        .filter((column) => column.location === QuestionLocation.Row && column)
        .forEach((column) => {
          var row = document.createElement("tr");
          row.className = "sa-tabulator__detail";
          var td1 = document.createElement("td");
          td1.textContent = column.displayName;
          var td2 = document.createElement("td");
          td2.textContent = detailedRow.getData()[column.name];
          var td3 = document.createElement("td");
          td3.appendChild(self.createShowAsColumnButton(column.name));
          row.appendChild(td1);
          row.appendChild(td2);
          row.appendChild(td3);
          rows.push(row);
        });
      if (!!self.renderActions) {
        var row = document.createElement("tr");
        row.className = "sa-tabulator__detail";
        var td = document.createElement("td");
        row.appendChild(td);
        rows.push(row);
        self.renderActions(td, self.tabulator.getData(), row);
      }
      rows.forEach(function (row) {
        detailsTable.appendChild(row);
      });
      detailedRow.normalizeHeight();
    };
    return btn;
  };

  protected closeDetails() {
    this.detailsTable.style.display = "none";
    this.isDetailsExpanded = false;
    this.row.getElement().classList.remove("sa-tabulator__detail-row");
    this.row.normalizeHeight();
  }
}
