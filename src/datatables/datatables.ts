import * as $ from "jquery";
import { SurveyModel, Question, Event } from "survey-core";
import { ITableColumn, ColumnVisibility, QuestionLocation, ColumnDataType } from "./config";
import { localization } from "../localizationManager";

import "./datatables.scss";

interface DataTablesOptions {
  buttons:
    | boolean
    | string[]
    | any[]
    | any;

  dom: string;

  orderFixed: Array<number | string> | Array<Array<number | string>> | object;

  rowGroup: boolean | any;

  headerCallback: any;
}

export class DataTables {
  private datatableApi: any;
  private tableData: any;

  /**
   * The event is fired columns configuration has been changed.
   * <br/> sender the datatables adapter
   * <br/> options.survey current survey
   * @see getColumns
   */
  public columnsChanged: Event<(sender: DataTables, options: any) => any, any> = new Event<(sender: DataTables, options: any) => any, any>();

  constructor(
    private targetNode: HTMLElement,
    private survey: SurveyModel,
    private data: Array<Object>,
    private options: DataTablesOptions,
    private _columns: Array<ITableColumn> = [],
    private isTrustedAccess = false
  ) {
    this.headerButtonCreators = [ this.createGroupingButton, this.createHideButton, this.createAddColumnButton, this.createMoveToDetailButton ];
    this.detailButtonCreators = [ this.createShowAsColumnButton ];
    if(_columns.length === 0) {
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
        if(question) {
          displayValue = question.displayValue;
        }
        dataItem[column.name] = typeof displayValue === "string" ? displayValue : JSON.stringify(displayValue) || "";
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
        dataType: question.getType() !== "file" ? ColumnDataType.Text : ColumnDataType.FileLink,
        visibility: question.getType() !== "file" ? ColumnVisibility.Visible : ColumnVisibility.Invisible,
        location: QuestionLocation.Column
      }
    });
  }

  public isVisible(visibility: ColumnVisibility) {
    return this.isTrustedAccess && visibility !== ColumnVisibility.Invisible || !this.isTrustedAccess && visibility === ColumnVisibility.Visible;
  }

  public get columns() {
    return [].concat(this._columns);
  }
  public set columns(columns: Array<ITableColumn>) {
    this._columns = columns;
    this.update();
  }

  public update() {
    if(this.isRendered) {
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
    if ((<any>$.fn).DataTable.isDataTable(tableNode) ) {
      $(tableNode).DataTable().destroy();
    }
    this.datatableApi = undefined;
    this.targetNode.innerHTML = "";
  }

  render() {
    const tableNode = document.createElement("table");
    var columns = this.getColumns();
    var columnsData: any = columns.map((c: any) => c.data);
    var self = this;

    const options = $.extend(true, {
      buttons: ["copy", "csv", "print"],
      dom: "Blfrtip",
      data: this.tableData,
      responsive: {
        details: false
      },
      columns: columns,
      // orderFixed: [[1, "asc"]],
      rowGroup: {
        dataSrc: columnsData[0],
        endRender: (rows: any, group: any) => {
          return "Count: " + rows.data().count();
        }
      },
      select: "api",
      headerCallback: (thead: any, data: any, start: any, end: any, display: any) => {
        var datatableApi = $(tableNode)
          .dataTable()
          .api();
        $(thead)
          .children("th")
          .each(function(index, node) {
            var $thNode = $(this);
            if (!!columnsData[index] && $thNode.has("button").length === 0) {
              var container = document.createElement("div");
              container.className = "sa-datatable-action-container";
              self.headerButtonCreators.forEach(creator => {
                var element = creator(datatableApi, index, columnsData[index]);
                if(!!element) {
                  container.appendChild(element);
                }
              });
              $thNode.prepend(container);
            }
          });
      }
    }, this.options);

    this.targetNode.appendChild(tableNode);
    tableNode.width = "100%";
    tableNode.className = "sa-datatable display responsive dataTable";

    const datatableApiRef = this.datatableApi = $(tableNode).DataTable(options);
    this.datatableApi
      .rowGroup()
      .enable(false)
      .draw();

    // this.datatableApi.on("rowgroup-datasrc", (e, dt, val) => {
    //   this.datatableApi.order.fixed({ pre: [[columnsData.indexOf(val), "asc"]] }).draw();
    // });
    this.datatableApi.on('column-reorder', (e: any, settings: any, details: any) => {
      var columns = this._columns.splice(details.from, 1);
      this._columns.splice(details.to, 0, columns[0]);
      //console.log(this._columns);
      this.onColumnsChanged();
    });
    $(tableNode).find('tbody').on('click', 'td.sa-datatable-action-column', function () {
      var tr = $(this).closest('tr');
      var row = datatableApiRef.row(tr);

      if (row.child.isShown()) {
          row.child.hide();
          tr.removeClass('sa-datatable-detail-row');
      }
      else {
          row.child(self.createDetailMarkup(row.data())).show();
          tr.addClass('sa-datatable-detail-row');
      }
    });
  }

  protected createDetailMarkup(data: any) {
    var table = document.createElement("table");
    table.cellPadding = "5";
    table.cellSpacing = "0";
    table.border = "0";
    table.className = "sa-datatable-detail";

    this.columns
      .filter(column => column.location === QuestionLocation.Row && this.isVisible(column.visibility))
      .forEach(column => {
        var row = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.textContent = column.displayName;
        var td2 = document.createElement("td");
        td2.textContent = data[column.name];
        var td3 = document.createElement("td");
        this.detailButtonCreators.forEach(creator => td3.appendChild(creator(column.name)));
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        table.appendChild(row);
    });

    if(!!this.datatableApi && this.datatableApi.responsive.hasHidden()) {
      var columnsVisibility = this.datatableApi.columns().responsiveHidden();
      var columns = this.datatableApi.settings().init().columns;
      for(var index = 0; index < columnsVisibility.length; index++) {
        if(!columnsVisibility[index]) {
          var column = columns[index];
          var row = document.createElement("tr");
          var td1 = document.createElement("td");
          td1.textContent = column.sTitle;
          var td2 = document.createElement("td");
          td2.textContent = data[column.mData];
          var td3 = document.createElement("td");
          //this.detailButtonCreators.forEach(creator => td3.appendChild(creator(column.mData)));
          row.appendChild(td1);
          row.appendChild(td2);
          row.appendChild(td3);
          table.appendChild(row);
        }
      }
    }

    if(!!this.renderDetailActions) {
      var row = document.createElement("tr");
      var td = document.createElement("td");
      row.appendChild(td);
      var td1 = document.createElement("td");
      row.appendChild(td1);
      var td2 = document.createElement("td");
      row.appendChild(td2);
      table.appendChild(row);
      this.renderDetailActions(td, data);
    }

    return table;
  }

  public renderDetailActions: (container: HTMLElement, data: any) => HTMLElement;

  public headerButtonCreators: Array<(
    datatableApi: any,
    colIdx: number,
    columnName: string
  ) => HTMLElement> = [];

  public detailButtonCreators: Array<(
    columnName?: string
  ) => HTMLElement> = [];

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

  createHideButton = (
    datatableApi: any,
    colIdx: number,
    columnName: string
  ): HTMLElement => {
    const button = document.createElement("button");
    button.innerHTML = localization.getString("hideColumn");

    button.onclick = e => {
      e.stopPropagation();

      this._columns.filter(column => column.name === columnName)[0].visibility = ColumnVisibility.Invisible;
      datatableApi.columns([colIdx]).visible(false);

      // TODO: Use datatables to update headers (show columns options)
      this.update();

      this.onColumnsChanged();
    };

    return button;
  };

  createAddColumnButton = (
    datatableApi: any,
    colIdx: number,
    columnName: string
  ): HTMLElement => {
    const selector = document.createElement("select");
    selector.onclick = e => {
      e.stopPropagation();
    }

    var hiddenColumns = this.columns.filter(column => column.visibility === ColumnVisibility.Invisible);

    if(hiddenColumns.length === 0) {
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
        if(text.length > 20) {
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
      if(!$(this).val()) return;

      var column = self._columns.filter(column => column.name === $(this).val())[0];
      column.visibility = ColumnVisibility.Visible;
      datatableApi.columns([self._columns.indexOf(column)]).visible(true);

      // TODO: Use datatables to update headers (show columns options)
      self.update();

      self.onColumnsChanged();
    };

    return selector;
  };

  createMoveToDetailButton = (
    datatableApi: any,
    colIdx: number,
    columnName: string
  ): HTMLElement => {
    const button = document.createElement("button");
    button.innerHTML = localization.getString("moveToDetail");

    button.onclick = e => {
      e.stopPropagation();

      this._columns.filter(column => column.name === columnName)[0].location = QuestionLocation.Row;
      this.update();

      this.onColumnsChanged();
    };

    return button;
  };

  createShowAsColumnButton = (
    columnName?: string
  ): HTMLElement => {
    const button = document.createElement("button");
    button.innerHTML = localization.getString("showAsColumn");

    button.onclick = e => {
      e.stopPropagation();

      this._columns.filter(column => column.name === columnName)[0].location = QuestionLocation.Row;
      this.update();

      this.onColumnsChanged();
    };

    return button;
  };

  getColumns(): Array<Object> {
    const availableColumns = this.columns.filter(column => column.location === QuestionLocation.Column && this.isVisible(column.visibility));
    const columns: any = availableColumns.map((column, index) => {
      return {
        data: column.name,
        sTitle: column.displayName,
        visible: column.visibility !== ColumnVisibility.Invisible,
        mRender: (data: object, type: string, row: any) => row[column.name]
      };
    });

    return [{
      "className": 'sa-datatable-action-column',
      "orderable": false,
      "data": null,
      "defaultContent": '',
    }].concat(columns);
  }

  public onColumnSelected: (dataName: string) => void;

  public layout() {
    !!this.datatableApi && this.datatableApi.columns.adjust();
  }
}
