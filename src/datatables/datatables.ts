import * as $ from "jquery";
import { SurveyModel, Question } from "survey-core";
import { ITableColumn, ColumnVisibility, QuestionLocation, ColumnDataType } from "./config";
import { localization } from "../localization";

import "./datatables.scss";

interface DataTablesOptions {
  buttons:
    | boolean
    | string[]
    | any
    | any[];

  dom: string;

  orderFixed: Array<number | string> | Array<Array<number | string>> | object;

  rowGroup: boolean | any;

  headerCallback: any;
}

export class DataTables {
  constructor(
    private targetNode: HTMLElement,
    private survey: SurveyModel,
    private data: Array<Object>,
    private options: DataTablesOptions,
    private _columns: Array<ITableColumn> = [],
    private isTrustedAccess = false
  ) {
    this.headerButtonCreators = [this.createGroupingButton, this.createSelectButton, this.createHideButton, this.createAddColumnButton];
    if(_columns.length === 0) {
      this._columns = this.buildColumns(survey);
    }
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
    this.targetNode.innerHTML = "";
  }

  render() {
    const tableNode = document.createElement("table");
    var columnsData: any = this.getColumns().map((c: any) => c.data);
    var self = this;

    const options = $.extend(true, {
      buttons: ["copy", "csv", "print"],
      dom: "Blfrtip",
      data: this.data,
      columns: this.getColumns(),
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
            if ($thNode.has("button").length === 0) {
              var container = document.createElement("div");
              container.className = "sa-datatable-action-container";
              self.headerButtonCreators.forEach(creator => container.appendChild(creator(datatableApi, index, columnsData[index])));
              $thNode.prepend(container);
            }
          });
      }
    }, this.options);

    this.targetNode.appendChild(tableNode);
    tableNode.className = "sa-datatable display dataTable";

    const datatableApi = $(tableNode).DataTable(options);
    datatableApi
      .rowGroup()
      .enable(false)
      .draw();

    // datatableApi.on("rowgroup-datasrc", (e, dt, val) => {
    //   datatableApi.order.fixed({ pre: [[columnsData.indexOf(val), "asc"]] }).draw();
    // });
    datatableApi.on('column-reorder', (e, settings, details) => {
      var columns = this._columns.splice(details.from, 1);
      this._columns.splice(details.to, 0, columns[0]);
      //console.log(this._columns);
    });
    $(tableNode).find('tbody').on('click', 'td.sa-datatable-action-column', function () {
      var tr = $(this).closest('tr');
      var row = datatableApi.row(tr);

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

  private createDetailMarkup(data: any) {
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
        row.appendChild(td1);
        row.appendChild(td2);
        table.appendChild(row);
    });

    var row = document.createElement("tr");
    var td = document.createElement("td");
    this.renderDetailActions(td);
    row.appendChild(td);
    table.appendChild(row);

    return table;
  }

  renderDetailActions(container: HTMLElement) {
  }

  public headerButtonCreators: Array<(
    datatableApi: any,
    colIdx: number,
    columnName: string
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

    var option = document.createElement("option");
    option.text = localization.getString("showColumn");
    option.disabled = true;
    option.selected = true;
    selector.appendChild(option);

    this.columns
      .filter(column => column.visibility === ColumnVisibility.Invisible)
      .forEach(column => {
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
    };

    return selector;
  };

  getColumns(): Array<Object> {
    const columns: any = this.columns
    .filter(column => column.location === QuestionLocation.Column && this.isVisible(column.visibility))
    .map(column => {
      const question = this.survey.getQuestionByName(column.name);
      return {
        data: column.name,
        sTitle: column.displayName,
        visible: column.visibility !== ColumnVisibility.Invisible,
        mRender: (data: object, type: string, row: any) => {
          var displayValue = row[column.name];
          if(question) {
            this.survey.data = row;
            displayValue = question.displayValue;
          }
          return (
            (typeof displayValue === "string"
              ? displayValue
              : JSON.stringify(displayValue)) || ""
          );
        }
      };
    });

    return [{
      "className": 'sa-datatable-action-column',
      "orderable": false,
      "data": null,
      "defaultContent": ''
    }].concat(columns);
  }

  public onColumnSelected: (dataName: string) => void;
}
