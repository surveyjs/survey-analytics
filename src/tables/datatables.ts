import { ITableOptions, Table, TableRow } from "./table";
import { SurveyModel, Event } from "survey-core";
import { ColumnDataType, IColumn, IColumnData, QuestionLocation } from "./config";
import { DocumentHelper } from "../utils";

var styles = require("./datatables.scss");

if (!!document) {
  var svgTemplate = require("html-loader?interpolate!val-loader!../svgbundle.html");
  var templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.appendChild(templateHolder);
}

var jQuery = (<any>window)["jQuery"];

interface DataTablesOptions extends ITableOptions {
  buttons: boolean | string[] | any[] | any;

  dom: string;

  orderFixed: Array<number | string> | Array<Array<number | string>> | object;

  rowGroup: boolean | any;

  headerCallback: any;
}

export class DataTables extends Table {
  public datatableApi: any;

  public currentPageNumber: number = 0;

  /**
   * The event is fired columns configuration has been changed.
   * <br/> sender the datatables adapter
   * <br/> options.survey current survey
   * @see getColumns
   */
  public onColumnsReorder: Event<
    (sender: DataTables, options: any) => any,
    DataTables,
    any
  > = new Event<(sender: DataTables, options: any) => any, DataTables, any>();

  public static initJQuery($: any) {
    jQuery = $;
  }

  public static set haveCommercialLicense(val: boolean) {
    Table.haveCommercialLicense = val;
  }

  constructor(
    survey: SurveyModel,
    data: Array<Object>,
    options?: DataTablesOptions,
    _columnsData: Array<IColumnData> = []
  ) {
    super(survey, data, options, _columnsData);
  }

  public destroy() {
    if (!this.renderResult) return;
    const tableNode = this.renderResult.children[0];
    if (jQuery.fn.DataTable.isDataTable(tableNode)) {
      jQuery(tableNode).DataTable().destroy();
    }
    this.datatableApi = undefined;
    super.destroy();
  }

  public setColumnVisibility(columnName: string, isVisible: boolean) {
    super.setColumnVisibility(columnName, isVisible);
    this.datatableApi.column(columnName + ":name").visible(isVisible);
  }

  public setColumnLocation(columnName: string, location: QuestionLocation) {
    super.setColumnLocation(columnName, location);
    var column = this.datatableApi.column(columnName + ":name");
    var isColumnLocation = location == QuestionLocation.Column;
    column.visible(isColumnLocation);
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
    super.setPageSize(value);
    if (this.isRendered) {
      this.datatableApi.page.len(value).draw(false);
    }
  }

  public setPageNumber(value: number): void {
    super.setPageNumber(value);
    if (this.isRendered) {
      this.datatableApi.page(value).draw(false);
    }
  }

  public getPageNumber(): number {
    if (!this.isRendered) {
      return 0;
    }
    return this.datatableApi.page();
  }

  public render(targetNode: HTMLElement | string): void {
    super.render(targetNode);
    var self = this;
    if (typeof targetNode === "string") {
      targetNode = document.getElementById(targetNode);
    }
    targetNode.className += " sa-table sa-datatables";

    const tableNode = <HTMLTableElement>(
      DocumentHelper.createElement("table", "")
    );
    var columns = this.getColumns();
    var columnsData: any = columns.map((c: any) => c.data);
    const dtButtonClass =
      "sa-table__btn sa-table__btn--small sa-table__btn--gray";
    const options = jQuery.extend(
      true,
      {
        buttons: [
          { extend: "copy", className: dtButtonClass },
          { extend: "csv", className: dtButtonClass },
          { extend: "print", className: dtButtonClass },
        ],
        dom: 'B<"sa-table__header-extensions">prtip',
        // ordering: false,
        data: this.tableData,
        pageLength: this.currentPageSize,
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
          var datatableApi = jQuery(tableNode).dataTable().api();
          var self = this;
          datatableApi
            .columns()
            .eq(0)
            .each((index: number) => {
              var $thNode = jQuery(datatableApi.columns(index).header());
              $thNode.unbind("click.DT");
              if (!!columnsData[index] && $thNode.has("button").length === 0) {
                var container = DocumentHelper.createElement(
                  "div",
                  "sa-table__action-container"
                );
                self.extensions.render(container, "column", {
                  columnName: columnsData[index],
                });
                container.onmousedown = (e) => {
                  if (!self.isColumnReorderEnabled) {
                    e.stopPropagation();
                  } else {
                    this.disableColumnReorder();
                  }
                };
              }
              $thNode.prepend(container);
            });
        },
      },
      this._options
    );

    targetNode.appendChild(tableNode);
    tableNode.className = "sa-datatables__table display responsive dataTable";

    const datatableApiRef = (this.datatableApi = jQuery(tableNode).DataTable(
      options
    ));
    var extensionsContainer = jQuery("div.sa-table__header-extensions")[0];

    // this.onTableToolsCreated.fire(this, { extensions: extensions });
    this.extensions.render(extensionsContainer, "header");

    datatableApiRef.page(self.currentPageNumber);
    this.datatableApi.rowGroup().enable(false).draw(false);

    datatableApiRef.on(
      "column-reorder",
      (e: any, settings: any, details: any) => {
        this.moveColumn(details.from - 1, details.to - 1);
        this.disableColumnReorder();
        this.onColumnsReorder.fire(this, { columns: this.columns });
      }
    );

    datatableApiRef
      .rows()
      .eq(0)
      .each((index: number) => {
        var row = datatableApiRef.row(index);
        var detailsTr = DocumentHelper.createElement("tr");
        var detailsTd = <HTMLTableDataCellElement>(
          DocumentHelper.createElement("td", "sa-datatables__details-container")
        );
        detailsTr.appendChild(detailsTd);
        var rowElement = row.node();
        var firstCell = row.cell(row.index(), 0).node();
        var tableRow = new DatatablesRow(this, firstCell, detailsTd, row);
        tableRow.onToggleDetails.add((sender: TableRow, options: any) => {
          if (options.isExpanded) {
            detailsTd.colSpan = rowElement.childElementCount;
            rowElement.parentNode.insertBefore(
              detailsTr,
              rowElement.nextSibling
            );
          } else {
            if (!!detailsTr.parentNode) {
              detailsTr.parentNode.removeChild(detailsTr);
            }
          }
        });
        this._rows.push(tableRow);
        tableRow.render();
      });
    datatableApiRef.draw(false);
    this.renderResult = targetNode;
  }

  public getColumns(): Array<any> {
    const columns: any = this.columns.map((column) => {
      var question = this.survey.getQuestionByName(column.name);
      const columnTitle = (question && (this.options.useNamesAsTitles ? question.name : question.title)) || column.displayName;
      return {
        name: column.name,
        data: column.name,
        sTitle: jQuery?.fn.dataTable.render.text().display(columnTitle) || columnTitle,
        visible: this.isColumnVisible(column),
        orderable: false,
        defaultContent: "",
        width:
          typeof column.width == "number" ? column.width + "px" : column.width,
        render: (_data: object, _type: string, row: any) => {
          var value = row[column.name];
          if (column.dataType === ColumnDataType.FileLink) {
            return value;
          }
          if (column.dataType === ColumnDataType.Image) {
            return "<image src='" + value + "'/>";
          }
          return typeof value === "string"
            ? jQuery("<div>").text(value).html()
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

  public layout() {
    !!this.datatableApi && this.datatableApi.columns.adjust();
  }
}

export class DatatablesRow extends TableRow {
  constructor(
    protected table: Table,
    protected extensionsContainer: HTMLElement,
    protected detailsContainer: HTMLElement,
    private _innerRow: any
  ) {
    super(table, extensionsContainer, detailsContainer);
    this.rowElement = _innerRow.node();
    this.rowData = _innerRow.data();
    this._innerRow = this._innerRow.row(this.rowElement);
    (<DataTables>table).onColumnsReorder.add(() => {
      this.render();
    });
  }
  private rowElement: HTMLElement;
  private rowData: any;

  public get innerRow() {
    return this._innerRow.row(this.rowElement);
  }

  public getElement(): HTMLElement {
    return this.rowElement;
  }

  public getRowData(): HTMLElement {
    return this.rowData;
  }

  public getDataPosition(): number {
    return this.innerRow.index();
  }

  public remove(): void {
    this.innerRow.remove().draw();
    super.remove();
  }
}
