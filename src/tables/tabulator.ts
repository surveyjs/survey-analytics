import { Table } from "./table";
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
  columnWidth: number;
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
  columnWidth: 208,
  columnMinWidth: 155,
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
      layout: "fitData",
      pagination: "local",
      paginationSize: 5,
      movableColumns: true,
      maxHeight: "100%",
      columns,
      rowFormatter: this.toggleDetails,
      paginationButtonCount: this.options.paginationButtonCount,
      paginationElement: paginationElement,
    });

    this.tableTools = new TableTools(
      header,
      this.tabulatorTables,
      this,
      this.options
    );
    this.tableTools.render();
    header.appendChild(paginationElement);
    header.appendChild(this.getEntriesContainer());
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

  public update() {
    this.tableTools.update();
  }

  toggleDetails = (row: any): void => {
    row.getCells()[0].getElement().appendChild(this.getDetailsBtn(row));
  };

  getDetailsBtn = (row: any) => {
    const btn = ActionsHelper.createSvgButton("detail");
    btn.title = localization.getString("showMinorColumns");
    var self = this;
    var hidden = document.createElement("div");
    hidden.innerHTML = "<p>hidden info</p>";
    hidden.style.display = "none";
    row.getElement().appendChild(hidden);
    btn.onclick = function () {
      if (hidden.style.display === "none") {
        hidden.style.display = "block";
      } else {
        hidden.style.display = "none";
      }

      row.normalizeHeight(); //recalculate the row height
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

  //actions for columns
  getHeaderActions = (columnName: string): HTMLDivElement => {
    var container = document.createElement("div");
    container.classList.add("sa-tabulator__action-container");
    container.appendChild(this.getDragBtn());
    container.appendChild(this.getSortBtn());
    container.appendChild(this.getMoveToDetailsBtn(columnName));
    container.appendChild(this.getHideBtn(columnName));
    return container;
  };

  getDragBtn(): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.className = "sa-tabulator__svg-button sa-tabulator__drag-button";
    btn.appendChild(ActionsHelper.createSvgElement("drag"));
    btn.onclick = (e) => {
      e.stopPropagation();
    };
    return btn;
  }

  getSortBtn(): HTMLButtonElement {
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

  getHideBtn(columnName: string): HTMLButtonElement {
    var btn = ActionsHelper.createSvgButton("hide");
    btn.onclick = () => {
      this._columns.filter(
        (column) => column.name === columnName
      )[0].visibility = ColumnVisibility.Invisible;
      this.tabulatorTables.toggleColumn(columnName);
      this.update();
    };
    return btn;
  }

  getMoveToDetailsBtn(columnName: string): HTMLButtonElement {
    const button = ActionsHelper.createSvgButton("movetodetails");
    button.title = localization.getString("moveToDetail");
    button.onclick = (e) => {
      e.stopPropagation();
      this._columns.filter((column) => column.name === columnName)[0].location =
        QuestionLocation.Row;
      this.tabulatorTables.toggleColumn(columnName);
      this.update();
    };
    return button;
  }

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
        ? this.options.columnMinWidth
        : this.COLUMN_MIN_WIDTH;
    const columns: any = availableColumns.map((column, index) => {
      var question = this.survey.getQuestionByName(column.name);
      return {
        field: column.name,
        title: (question && question.title) || column.displayName,
        minWidth: minColumnWidth,
        width: this.options.columnWidth,
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
    });

    return columns;
  };
}

class TableTools {
  constructor(
    private targetNode: HTMLElement,
    private tabulatorTables: any,
    private tabulator: Tabulator,
    private options: IOptions
  ) {}
  private showColumnDropdown: HTMLElement;
  private toolsContainer: HTMLElement;

  render() {
    this.toolsContainer = this.createToolsContainer();
    this.showColumnDropdown = this.createShowColumnDropdown();
    const filterInput = this.createFilterInput();

    this.toolsContainer.innerHTML = "";

    if (this.options.downloadOptions.xlsx.isVisible) {
      this.toolsContainer.appendChild(
        this.createDownloadButton("xlsx", "Excel")
      );
    }
    if (this.options.downloadOptions.pdf.isVisible) {
      this.toolsContainer.appendChild(this.createDownloadButton("pdf", "PDF"));
    }
    this.toolsContainer.appendChild(this.createDownloadButton("csv", "CSV"));

    this.toolsContainer.appendChild(filterInput);
    if (!!this.showColumnDropdown)
      this.toolsContainer.appendChild(this.showColumnDropdown);
    this.targetNode.appendChild(this.toolsContainer);
  }

  protected createToolsContainer(): HTMLElement {
    var el = document.createElement("div");
    el.classList.add("sa-tabulator__tools-container");
    return el;
  }

  protected createFilterInput(): HTMLElement {
    const input = document.createElement("input");
    input.classList.add("sa-tabulator__global-filter");
    input.placeholder = "Search...";
    input.onchange = (event: any) => {
      this.tabulatorTables.setFilter(ActionsHelper.customFilter, {
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
      self.tabulatorTables.toggleColumn(column.name);
      self.update();
    };

    return dropdown;
  };

  public update() {
    if (!!this.showColumnDropdown) this.showColumnDropdown.remove();
    this.showColumnDropdown = this.createShowColumnDropdown();
    if (!!this.showColumnDropdown)
      this.toolsContainer.appendChild(this.showColumnDropdown);
  }

  protected createDownloadButton(
    type: string,
    caption: string
  ): HTMLButtonElement {
    const btn = ActionsHelper.createBtn(caption);
    var self = this;
    btn.onclick = (ev) => {
      self.tabulatorTables.download(
        type,
        `results.${type}`,
        (<any>this.options.downloadOptions)[type]
      );
    };
    return btn;
  }
}
