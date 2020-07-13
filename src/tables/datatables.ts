import * as $ from "jquery";
import { Table } from "./table";
import { SurveyModel, Question, Event } from "survey-core";
import {
  ITableColumn,
  ColumnVisibility,
  QuestionLocation,
  ColumnDataType,
} from "./config";
import { localization } from "../localizationManager";

import "./datatables.scss";
import { TableRow } from "./tools/RowTools";

if (!!document) {
  var svgTemplate = require("html-loader?interpolate!val-loader!../svgbundle.html");
  var templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.appendChild(templateHolder);
}

interface DataTablesOptions {
  buttons: boolean | string[] | any[] | any;

  dom: string;

  orderFixed: Array<number | string> | Array<Array<number | string>> | object;

  rowGroup: boolean | any;

  headerCallback: any;
}

export class DataTables extends Table {
  private svgNode: HTMLElement;
  private datatableApi: any;

  public currentPageNumber: number = 0;

  /**
   * The event is fired columns configuration has been changed.
   * <br/> sender the datatables adapter
   * <br/> options.survey current survey
   * @see getColumns
   */
  public columnsChanged: Event<
    (sender: DataTables, options: any) => any,
    any
  > = new Event<(sender: DataTables, options: any) => any, any>();

  constructor(
    targetNode: HTMLElement,
    survey: SurveyModel,
    data: Array<Object>,
    options: DataTablesOptions,
    _columns: Array<ITableColumn> = [],
    isTrustedAccess = false
  ) {
    super(targetNode, survey, data, options, _columns, isTrustedAccess);
    targetNode.className += "sa-datatables";

    this.headerButtonCreators = [
      // this.createGroupingButton,
      this.createSortButton,
      this.createHideButton,
      this.createMoveToDetailButton,
      this.createDragButton,
    ];

    if (this.isTrustedAccess) {
      this.headerButtonCreators.splice(2, 0, this.createColumnPrivateButton);
    }

    this.detailButtonCreators = [this.createShowAsColumnButton];
    if (_columns.length === 0) {
      this._columns = this.buildColumns(survey);
    }
  }

  protected onColumnsChanged() {
    this.columnsChanged.fire(this, { survey: this.survey });
  }

  public get columns() {
    return [].concat(this._columns);
  }
  public set columns(columns: Array<ITableColumn>) {
    this._columns = columns;
    this.update(true);
  }

  public update(hard: boolean = false) {
    if (this.isRendered) {
      if (hard) {
        this.initTableData(this.data);
      }
      this.currentPageNumber = this.datatableApi.page.info().page;
      this.destroy();
      this.render();
    }
  }

  public get isRendered() {
    return this.targetNode.children.length > 0;
  }

  groupBy: Array<string> = [];

  destroy() {
    //if(!this.targetNode) return;
    const tableNode = this.targetNode.children[0];
    if ((<any>$.fn).DataTable.isDataTable(tableNode)) {
      $(tableNode).DataTable().destroy();
    }
    this.datatableApi = undefined;
    this.targetNode.innerHTML = "";
  }

  createActionContainer() {
    var container = document.createElement("div");
    container.className = "sa-datatables__action-container";

    return container;
  }

  render() {
    var self = this;
    const tableNode = document.createElement("table");
    var columns = this.getColumns();
    var columnsData: any = columns.map((c: any) => c.data);
    const dtButtonClass =
      "sa-datatables__button sa-datatables__button--small sa-datatables__button--gray";
    const options = $.extend(
      true,
      {
        buttons: [
          { extend: "copy", className: dtButtonClass },
          { extend: "csv", className: dtButtonClass },
          { extend: "print", className: dtButtonClass },
        ],
        createdRow: (
          rowElement: any,
          rowData: any,
          dataIndex: any,
          cells: any
        ) => {
          var detailsTr = document.createElement("tr");
          var detailsTd = document.createElement("td");
          detailsTr.appendChild(detailsTd);
          var tableRow = new TableRow(
            this,
            rowElement,
            rowData,
            cells[0],
            detailsTd,
            null
          );
          tableRow.onToggleDetails.add((sender: TableRow, options: any) => {
            if (options.isExpanded) {
              detailsTd.colSpan = rowElement.childElementCount;
              rowElement.parentNode.insertBefore(
                detailsTr,
                rowElement.nextSibling
              );
            } else {
              detailsTr.remove();
            }
          });
          tableRow.render();
        },
        dom: "Bfplrtip",
        data: this.tableData,
        pageLength: 5,
        lengthMenu: [1, 5, 10, 25, 50, 75, 100],
        responsive: false,
        scrollX: true,
        columns: columns,
        colReorder: {
          fixedColumnsLeft: 1,
          realtime: false,
        },
        // orderFixed: [[1, "asc"]],
        rowGroup: {
          dataSrc: columnsData[0],
          endRender: (rows: any, group: any) => {
            return "Count: " + rows.data().count();
          },
        },
        language: {
          sSearch: " ",
          searchPlaceholder: "Search...",
          sLengthMenu: "Show _MENU_ entries",
          paginate: {
            previous: " ",
            next: " ",
          },
        },
        select: "api",
        headerCallback: (
          thead: any,
          data: any,
          start: any,
          end: any,
          display: any
        ) => {
          var datatableApi = $(tableNode).dataTable().api();
          var self = this;
          $(thead)
            .children("th")
            .each(function (index: number) {
              var $thNode = $(this);
              if (!!columnsData[index] && $thNode.has("button").length === 0) {
                var container = self.createActionContainer();
                self.headerButtonCreators.forEach((creator) => {
                  var element = creator(
                    datatableApi,
                    index,
                    columnsData[index]
                  );
                  if (!!element) {
                    container.appendChild(element);
                  }
                });

                var filterContainer = document.createElement("div");
                filterContainer.className = "sa-datatables__filter-container";
                filterContainer.innerHTML =
                  "<input type='text' placeholder='Search...' />";
                var column = datatableApi.column(index);
                $("input", $(filterContainer)).on("click", (e) =>
                  e.stopPropagation()
                );
                $("input", $(filterContainer)).on("keyup change", function () {
                  let value = (<HTMLInputElement>this).value;
                  if (column.search() !== value) {
                    column.search(value).draw(false);
                  }
                });
                $thNode.prepend(filterContainer);
                $thNode.prepend(container);
              }
            });
        },
      },
      this.options
    );

    this.targetNode.appendChild(tableNode);
    tableNode.width = "100%";
    tableNode.className = "sa-datatables__table display responsive dataTable";

    const datatableApiRef = (this.datatableApi = $(tableNode).DataTable(
      options
    ));
    datatableApiRef.page(self.currentPageNumber);
    this.datatableApi.rowGroup().enable(false).draw(false);

    // this.datatableApi.on("rowgroup-datasrc", (e, dt, val) => {
    //   this.datatableApi.order.fixed({ pre: [[columnsData.indexOf(val), "asc"]] }).draw();
    // });
    var target = $(this.targetNode).find(".dataTables_filter");
    var button = this.createAddColumnButton(this.datatableApi);
    $(button).insertAfter(target[0]);

    datatableApiRef.on(
      "column-reorder",
      (e: any, settings: any, details: any) => {
        var deletedColumns = this._columns.splice(details.from - 1, 1);
        this._columns.splice(details.to - 1, 0, deletedColumns[0]);
        var headerCell = $(datatableApiRef.column(details.to).header());
        this.onColumnsChanged();
      }
    );
  }

  public doStateSave() {
    this.datatableApi.state.save();
  }
  public stateSaveCallback(settings: any, data: any) {}

  public renderDetailActions: (
    container: HTMLElement,
    data: any,
    datatablesRow: any
  ) => HTMLElement;

  public headerButtonCreators: Array<
    (datatableApi: any, colIdx: number, columnName: string) => HTMLElement
  > = [];

  public detailButtonCreators: Array<(columnName?: string) => HTMLElement> = [];

  createSelectButton = (
    datatableApi: any,
    colIdx: number,
    columnName: string
  ): HTMLElement => {
    const button = document.createElement("button");
    button.innerHTML = localization.getString("selectButton");
    button.onclick = (e) => {
      e.stopPropagation();
      (<any>datatableApi.columns()).deselect();
      (<any>datatableApi.column(colIdx)).select();
      !!this.onColumnSelected && this.onColumnSelected(columnName);
    };
    return button;
  };

  createGroupingButton = (
    datatableApi: any,
    colIdx: number,
    columnName: string
  ): HTMLElement => {
    const button = document.createElement("button");
    button.innerHTML = localization.getString("groupButton");

    button.onclick = (e) => {
      e.stopPropagation();

      const index = this.groupBy.indexOf(columnName);
      if (index === -1) {
        this.groupBy.push(columnName);
        button.innerHTML = localization.getString("ungroupButton");
      } else {
        button.innerHTML = localization.getString("groupButton");
        this.groupBy.splice(index, 1);
      }

      datatableApi.rowGroup().enable(this.groupBy.length > 0);
      if (this.groupBy.length > 0) {
        datatableApi.rowGroup().dataSrc(<any>this.groupBy);
      }
      datatableApi.draw(false);
    };

    return button;
  };
  createSvgElement = (path: string): SVGElement => {
    var svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const useElem = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use"
    );
    useElem.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      "#sa-svg-" + path
    );
    svgElem.appendChild(useElem);
    return svgElem;
  };

  createHideButton = (
    datatableApi: any,
    colIdx: number,
    columnName: string
  ): HTMLElement => {
    const button = document.createElement("button");
    button.title = localization.getString("hideColumn");
    button.className = "sa-datatables__svg-button";
    button.appendChild(this.createSvgElement("hide"));
    button.onclick = (e) => {
      e.stopPropagation();

      this._columns.filter(
        (column) => column.name === columnName
      )[0].visibility = ColumnVisibility.Invisible;
      datatableApi.columns([colIdx]).visible(false);

      // TODO: Use datatables to update headers (show columns options)
      this.update();

      this.onColumnsChanged();
    };

    return button;
  };

  createColumnPrivateButton = (
    datatableApi: any,
    colIdx: number,
    columnName: string
  ): HTMLElement => {
    const column = this._columns.filter(
      (column) => column.name === columnName
    )[0];
    const button = document.createElement("button");
    const makePrivateSvg = this.createSvgElement("makeprivate");
    const makePublicSvg = this.createSvgElement("makepublic");
    updateState(column.visibility);
    button.appendChild(makePrivateSvg);
    button.appendChild(makePublicSvg);
    button.onclick = (e) => {
      e.stopPropagation();

      if (column.visibility === ColumnVisibility.PublicInvisible) {
        column.visibility = ColumnVisibility.Visible;
      } else {
        column.visibility = ColumnVisibility.PublicInvisible;
      }

      updateState(column.visibility);
    };

    function updateState(visibility: ColumnVisibility) {
      const isPrivate = visibility === ColumnVisibility.PublicInvisible;
      if (isPrivate) {
        button.className =
          "sa-datatables__svg-button sa-datatables__svg-button--active";
        button.title = localization.getString("makePublicColumn");
        makePrivateSvg.style.display = "block";
        makePublicSvg.style.display = "none";
      } else {
        button.className = "sa-datatables__svg-button";
        button.title = localization.getString("makePrivateColumn");
        makePrivateSvg.style.display = "none";
        makePublicSvg.style.display = "block";
      }
    }

    return button;
  };

  createAddColumnButton = (datatableApi: any): HTMLElement => {
    const selector = document.createElement("select");
    selector.className = "sa-datatables__add-column";
    selector.onclick = (e) => {
      e.stopPropagation();
    };

    var hiddenColumns = this.columns.filter(
      (column) => column.visibility === ColumnVisibility.Invisible
    );

    if (hiddenColumns.length === 0) {
      return;
    }

    var option = document.createElement("option");
    option.text = localization.getString("showColumn");
    option.disabled = true;
    option.selected = true;
    selector.appendChild(option);

    hiddenColumns.forEach((column) => {
      var option = document.createElement("option");
      var text = column.displayName;
      if (text.length > 20) {
        text = text.substring(0, 20) + "...";
      }
      option.text = text;
      option.title = column.displayName;
      option.value = column.name;
      selector.appendChild(option);
    });

    var self = this;
    selector.onchange = function (e) {
      e.stopPropagation();
      if (!$(this).val()) return;

      var column = self._columns.filter(
        (column) => column.name === $(this).val()
      )[0];
      column.visibility = ColumnVisibility.Visible;
      datatableApi.column(column.name + ":name").visible(true);

      // TODO: Use datatables to update headers (show columns options)
      self.update();

      self.onColumnsChanged();
    };

    return selector;
  };
  createDragButton = (
    datatableApi: any,
    colIdx: any,
    columnName: string
  ): HTMLElement => {
    const button = document.createElement("button");
    button.className = "sa-datatables__svg-button sa-datatables__drag-button";
    button.appendChild(this.createSvgElement("drag"));
    button.onclick = (e) => {
      e.stopPropagation();
    };
    return button;
  };
  createSortButton = (
    datatableApi: any,
    colIdx: any,
    columnName: string
  ): HTMLElement => {
    const button = document.createElement("button");
    const descTitle = localization.getString("descOrder");
    const ascTitle = localization.getString("ascOrder");
    button.className = "sa-datatables__svg-button";
    button.title = ascTitle;
    button.appendChild(this.createSvgElement("sorting"));
    button.onclick = (e) => {
      button.title = button.title == ascTitle ? descTitle : ascTitle;
    };
    button.ondrag = (e) => {
      e.stopPropagation;
    };
    return button;
  };
  createMoveToDetailButton = (
    datatableApi: any,
    colIdx: number,
    columnName: string
  ): HTMLElement => {
    const button = document.createElement("button");
    button.title = localization.getString("moveToDetail");
    button.className = "sa-datatables__svg-button";
    button.appendChild(this.createSvgElement("movetodetails"));
    button.onclick = (e) => {
      e.stopPropagation();

      this._columns.filter((column) => column.name === columnName)[0].location =
        QuestionLocation.Row;
      this.update();

      this.onColumnsChanged();
    };

    return button;
  };

  createShowAsColumnButton = (columnName?: string): HTMLElement => {
    const button = document.createElement("button");
    button.innerHTML = localization.getString("showAsColumn");
    button.className = "sa-datatables__button sa-datatables__button--gray";
    button.onclick = (e) => {
      e.stopPropagation();

      this._columns.filter((column) => column.name === columnName)[0].location =
        QuestionLocation.Column;
      this.update();

      this.onColumnsChanged();
    };

    return button;
  };
  getColumns(): Array<Object> {
    const availableColumns = this.getAvailableColumns();
    const columns: any = availableColumns.map((column, index) => {
      var question = this.survey.getQuestionByName(column.name);
      return {
        data: column.name,
        sTitle: (question && question.title) || column.displayName,
        visible: column.visibility !== ColumnVisibility.Invisible,
        mRender: (data: object, type: string, row: any) => {
          var value = row[column.name];
          return typeof value === "string"
            ? $("<div>").text(value).html()
            : JSON.stringify(value);
        },
      };
    });

    return [
      {
        orderable: false,
        data: null,
        defaultContent: "",
      },
    ].concat(columns);
  }

  public onColumnSelected: (dataName: string) => void;

  public layout() {
    !!this.datatableApi && this.datatableApi.columns.adjust();
  }
}
