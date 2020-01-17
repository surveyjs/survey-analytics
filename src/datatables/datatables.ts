import * as $ from "jquery";
import { SurveyModel, Question, Event } from "survey-core";
import {
  ITableColumn,
  ColumnVisibility,
  QuestionLocation,
  ColumnDataType
} from "./config";
import { localization } from "../localizationManager";

import "./datatables.scss";

if (!!document) {
  var svgTemplate = require("html-loader?interpolate!val-loader!../svgbundle.html");
  var templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.append(templateHolder);
}

interface DataTablesOptions {
  buttons: boolean | string[] | any[] | any;

  dom: string;

  orderFixed: Array<number | string> | Array<Array<number | string>> | object;

  rowGroup: boolean | any;

  headerCallback: any;
}

export class DataTables {
  private svgNode: HTMLElement;
  private datatableApi: any;
  private tableData: any;

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
    private targetNode: HTMLElement,
    private survey: SurveyModel,
    private data: Array<Object>,
    private options: DataTablesOptions,
    private _columns: Array<ITableColumn> = [],
    private isTrustedAccess = false
  ) {
    targetNode.className += "sa-datatables";
    this.headerButtonCreators = [
      // this.createGroupingButton,
      this.createSortButton,
      this.createHideButton,
      this.createMoveToDetailButton,
      this.createDragButton
    ];
    this.detailButtonCreators = [this.createShowAsColumnButton];
    if (_columns.length === 0) {
      this._columns = this.buildColumns(survey);
    }
    this.initTableData(data);
  }

  private initTableData(data: Array<any>) {
    this.tableData = (data || []).map(item => {
      var dataItem: any = {};
      this.survey.data = item;
      this._columns.forEach(column => {
        var displayValue = item[column.name];
        const question = this.survey.getQuestionByName(column.name);
        if (question) {
          displayValue = question.displayValue;
        }
        dataItem[column.name] =
          typeof displayValue === "string"
            ? displayValue
            : JSON.stringify(displayValue) || "";
      });
      return dataItem;
    });
  }

  protected onColumnsChanged() {
    this.columnsChanged.fire(this, { survey: this.survey });
  }

  protected buildColumns(survey: SurveyModel) {
    return this.survey.getAllQuestions().map((question: Question) => {
      return {
        name: question.name,
        displayName: (question.title || "").trim() || question.name,
        dataType:
          question.getType() !== "file"
            ? ColumnDataType.Text
            : ColumnDataType.FileLink,
        visibility:
          question.getType() !== "file"
            ? ColumnVisibility.Visible
            : ColumnVisibility.Invisible,
        location: QuestionLocation.Column
      };
    });
  }

  public isVisible(visibility: ColumnVisibility) {
    return (
      (this.isTrustedAccess && visibility !== ColumnVisibility.Invisible) ||
      (!this.isTrustedAccess && visibility === ColumnVisibility.Visible)
    );
  }

  public get columns() {
    return [].concat(this._columns);
  }
  public set columns(columns: Array<ITableColumn>) {
    this._columns = columns;
    this.update();
  }

  public update(hard: boolean = false) {
    if (this.isRendered) {
      if (hard) {
        this.initTableData(this.data);
      }
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
      $(tableNode)
        .DataTable()
        .destroy();
    }
    this.datatableApi = undefined;
    this.targetNode.innerHTML = "";
  }

  createActionContainer() {
    var container = document.createElement("div");
    container.className = "sa-datatables__action-container";

    return container;
  }
  createMinorColumnsButton() {
    const button = document.createElement("button");
    button.title = localization.getString("showMinorColumns");

    button.className = "sa-datatables__svg-button";
    button.appendChild(this.createSvgElement("detail"));
    return button;
  }
  setMinorColumnsButtonCallback(datatableApiRef: DataTables.Api) {
    var self = this;
    $("td.sa-datatables__action-column button.sa-datatables__svg-button").on(
      "click",
      function() {
        const detailTr = $(this).closest("tr");
        var row = datatableApiRef.row(detailTr);
        if (detailTr.hasClass("sa-datatables__detail-row")) {
          detailTr.nextAll("tr.sa-datatables__detail").remove();
          detailTr.removeClass("sa-datatables__detail-row");
        } else {
          $(self.createDetailMarkup(row.data())).insertAfter(detailTr);
          detailTr.addClass("sa-datatables__detail-row");
        }
      }
    );
  }
  render() {
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
          { extend: "print", className: dtButtonClass }
        ],
        dom: "Bfplrtip",
        data: this.tableData,
        pageLength: 5,
        lengthMenu: [1, 5, 10, 25, 50, 75, 100],
        responsive: false,
        scrollX: true,
        columns: columns,
        colReorder: {
          fixedColumnsLeft: 1,
          realtime: false
        },
        // orderFixed: [[1, "asc"]],
        rowGroup: {
          dataSrc: columnsData[0],
          endRender: (rows: any, group: any) => {
            return "Count: " + rows.data().count();
          }
        },
        language: {
          sSearch: " ",
          searchPlaceholder: "Search...",
          sLengthMenu: "Show _MENU_ entries",
          paginate: {
            previous: " ",
            next: " "
          }
        },
        select: "api",
        headerCallback: (
          thead: any,
          data: any,
          start: any,
          end: any,
          display: any
        ) => {
          var datatableApi = $(tableNode)
            .dataTable()
            .api();
          var self = this;
          $(thead)
            .children("th")
            .each(function(index: number) {
              var $thNode = $(this);
              if (!!columnsData[index] && $thNode.has("button").length === 0) {
                var container = self.createActionContainer();
                self.headerButtonCreators.forEach(creator => {
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
                $("input", $(filterContainer)).on("click", e =>
                  e.stopPropagation()
                );
                $("input", $(filterContainer)).on("keyup change", function() {
                  let value = (<HTMLInputElement>this).value;
                  if (column.search() !== value) {
                    column.search(value).draw();
                  }
                });
                $thNode.prepend(filterContainer);
                $thNode.prepend(container);
              }
            });
        }
      },
      this.options
    );

    this.targetNode.appendChild(tableNode);
    tableNode.width = "100%";
    tableNode.className = "sa-datatables__table display responsive dataTable";

    const datatableApiRef = (this.datatableApi = $(tableNode).DataTable(
      options
    ));
    this.datatableApi
      .rowGroup()
      .enable(false)
      .draw();

    // this.datatableApi.on("rowgroup-datasrc", (e, dt, val) => {
    //   this.datatableApi.order.fixed({ pre: [[columnsData.indexOf(val), "asc"]] }).draw();
    // });
    var target = $(this.targetNode).find(".dataTables_filter");
    var button = this.createAddColumnButton(this.datatableApi);
    $(button).insertAfter(target[0]);

    datatableApiRef.on(
      "column-reorder",
      (e: any, settings: any, details: any) => {
        if (details.drop) {
          var columns = this._columns.splice(details.from, 1);
          this._columns.splice(details.to, 0, columns[0]);
          var headerCell = $(datatableApiRef.column(details.to).header());
          this.setMinorColumnsButtonCallback(datatableApiRef);
          this.onColumnsChanged();
        }
      }
    );
    this.setMinorColumnsButtonCallback(datatableApiRef);
  }

  protected createDetailMarkup(data: any): HTMLElement[] {
    // var table = document.createElement("table");
    // table.cellPadding = "5";
    // table.cellSpacing = "0";
    // table.border = "0";
    // table.className = "sa-datatables__detail";
    var rows: HTMLElement[] = [];
    var self = this;
    var visibleColCount = self.columns.filter(
      column =>
        column.location === QuestionLocation.Column &&
        this.isVisible(column.visibility)
    ).length;
    this.columns
      .filter(
        column =>
          column.location === QuestionLocation.Row &&
          this.isVisible(column.visibility)
      )
      .forEach(column => {
        var row = document.createElement("tr");
        row.className = "sa-datatables__detail";
        var td1 = document.createElement("td");
        td1.textContent = column.displayName;
        td1.colSpan = 2;
        var td2 = document.createElement("td");
        td2.textContent = data[column.name];
        var td3 = document.createElement("td");
        td3.colSpan = Math.max(visibleColCount - 2, 1);
        self.detailButtonCreators.forEach(creator =>
          td3.appendChild(creator(column.name))
        );
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        rows.push(row);
      });

    // if (!!this.datatableApi && this.datatableApi.responsive.hasHidden()) {
    //   var columnsVisibility = this.datatableApi.columns().responsiveHidden();
    //   var columns = this.datatableApi.settings().init().columns;
    //   for (var index = 0; index < columnsVisibility.length; index++) {
    //     if (!columnsVisibility[index]) {
    //       var column = columns[index];
    //       var row = document.createElement("tr");
    //       row.className = "sa-datatables__detail";

    //       var td1 = document.createElement("td");
    //       td1.textContent = column.sTitle;
    //       var td2 = document.createElement("td");
    //       td2.textContent = data[column.mData];
    //       var td3 = document.createElement("td");
    //       //this.detailButtonCreators.forEach(creator => td3.appendChild(creator(column.mData)));
    //       row.appendChild(td1);
    //       row.appendChild(td2);
    //       row.appendChild(td3);
    //       rows.push(row);
    //     }
    //   }
    // }

    if (!!this.renderDetailActions) {
      var row = document.createElement("tr");
      row.className = "sa-datatables__detail";
      var td = document.createElement("td");
      td.colSpan = visibleColCount + 1;
      // row.appendChild(td);
      // var td1 = document.createElement("td");
      // row.appendChild(td1);
      // var td2 = document.createElement("td");
      // row.appendChild(td2);
      // rows.push(row);
      // this.renderDetailActions(td, data);
    }

    return rows;
  }

  public renderDetailActions: (
    container: HTMLElement,
    data: any
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
    button.onclick = e => {
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

    button.onclick = e => {
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
      datatableApi.draw();
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
    button.onclick = e => {
      e.stopPropagation();

      this._columns.filter(column => column.name === columnName)[0].visibility =
        ColumnVisibility.Invisible;
      datatableApi.columns([colIdx]).visible(false);

      // TODO: Use datatables to update headers (show columns options)
      this.update();

      this.onColumnsChanged();
    };

    return button;
  };

  createAddColumnButton = (datatableApi: any): HTMLElement => {
    const selector = document.createElement("select");
    selector.className = "sa-datatables__add-column";
    selector.onclick = e => {
      e.stopPropagation();
    };

    var hiddenColumns = this.columns.filter(
      column => column.visibility === ColumnVisibility.Invisible
    );

    if (hiddenColumns.length === 0) {
      return;
    }

    var option = document.createElement("option");
    option.text = localization.getString("showColumn");
    option.disabled = true;
    option.selected = true;
    selector.appendChild(option);

    hiddenColumns.forEach(column => {
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
    selector.onchange = function(e) {
      e.stopPropagation();
      if (!$(this).val()) return;

      var column = self._columns.filter(
        column => column.name === $(this).val()
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
    button.onclick = e => {
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
    button.onclick = e => {
      button.title = button.title == ascTitle ? descTitle : ascTitle;
    };
    button.ondrag = e => {
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
    button.onclick = e => {
      e.stopPropagation();

      this._columns.filter(column => column.name === columnName)[0].location =
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
    button.onclick = e => {
      e.stopPropagation();

      this._columns.filter(column => column.name === columnName)[0].location =
        QuestionLocation.Column;
      this.update();

      this.onColumnsChanged();
    };

    return button;
  };
  getColumns(): Array<Object> {
    const availableColumns = this.columns.filter(
      column =>
        column.location === QuestionLocation.Column &&
        this.isVisible(column.visibility)
    );
    const columns: any = availableColumns.map((column, index) => {
      var question = this.survey.getQuestionByName(column.name);
      return {
        data: column.name,
        sTitle: (question && question.title) || column.displayName,
        visible: column.visibility !== ColumnVisibility.Invisible,
        mRender: (data: object, type: string, row: any) => row[column.name]
      };
    });

    return [
      {
        className: "sa-datatables__action-column",
        orderable: false,
        data: null,
        defaultContent: this.createMinorColumnsButton().outerHTML
      }
    ].concat(columns);
  }

  public onColumnSelected: (dataName: string) => void;

  public layout() {
    !!this.datatableApi && this.datatableApi.columns.adjust();
  }
}
