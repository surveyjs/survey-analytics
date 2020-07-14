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
import { TableRow } from "./tools/rowtools";
import { ColumnTools } from "./tools/columntools";
import { TableTools } from "./tools/tabletools";

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
    targetNode.className += " sa-datatables";

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

  public setColumnVisibility(columnName: string, visibility: ColumnVisibility) {
    super.setColumnVisibility(columnName, visibility);
    this.datatableApi.column(columnName + ":name").visible(false);
  }

  public setColumnLocation(columnName: string, location: QuestionLocation) {
    super.setColumnLocation(columnName, location);
    var column = this.datatableApi.column(columnName + ":name");
    if (location == QuestionLocation.Row) column.visible(false);
    else column.visible(true);
  }

  createActionContainer() {
    var container = document.createElement("div");
    container.className = "sa-table__action-container";
    return container;
  }

  public applyFilter(value: string) {
    this.datatableApi.search(value).draw(false);
  }

  public applyColumnFilter(columnName: string, value: string): void {
    var column = this.datatableApi.column(columnName + ":name");
    if (column.search() !== value) {
      column.search(value).draw(false);
    }
  }

  public sortByColumn(columnName: string, direction: string): void {
    var column = this.datatableApi.column(columnName + ":name");
    column.order(direction).draw(false);
  }

  public setPageSize(value: number): void {
    this.datatableApi.page.len(value);
  }

  render() {
    var self = this;
    const tableNode = document.createElement("table");
    var columns = this.getColumns();
    var columnsData: any = columns.map((c: any) => c.data);
    const dtButtonClass =
      "sa-table__btn sa-table__btn--small sa-table__btn--gray";
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
        dom: 'B<"sa-datatables__tools">prtip',
        // ordering: false,
        data: this.tableData,
        pageLength: 5,
        responsive: false,
        scrollX: true,
        columns: columns,
        colReorder: {
          fixedColumnsLeft: 1,
          realtime: false,
        },
        //orderFixed: [[1, "asc"]],
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
              $thNode.unbind("click.DT");
              if (!!columnsData[index] && $thNode.has("button").length === 0) {
                var container = self.createActionContainer();
                var columnTools = new ColumnTools(
                  container,
                  self,
                  columnsData[index],
                  this.isTrustedAccess
                );
                columnTools.render();
              }
              $thNode.prepend(container);
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
    var toolsContainer = $("div.sa-datatables__tools")[0];

    var tools = new TableTools(toolsContainer, this);
    tools.render();

    datatableApiRef.page(self.currentPageNumber);
    this.datatableApi.rowGroup().enable(false).draw(false);

    datatableApiRef.on(
      "column-reorder",
      (e: any, settings: any, details: any) => {
        var deletedColumns = this._columns.splice(details.from - 1, 1);
        this._columns.splice(details.to - 1, 0, deletedColumns[0]);
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

  public detailButtonCreators: Array<(columnName?: string) => HTMLElement> = [];

  getColumns(): Array<Object> {
    const availableColumns = this.getAvailableColumns();
    const columns: any = availableColumns.map((column, index) => {
      var question = this.survey.getQuestionByName(column.name);
      return {
        name: column.name,
        data: column.name,
        sTitle: (question && question.title) || column.displayName,
        visible: column.visibility !== ColumnVisibility.Invisible,
        mRender: (_data: object, _type: string, row: any) => {
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
