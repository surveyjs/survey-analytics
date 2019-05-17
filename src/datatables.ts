import * as $ from "jquery";
import { SurveyModel, Question } from "survey-core";
import "./datatables.scss";

interface DataTablesOptions {
  buttons:
    | boolean
    | string[]
    | DataTables.ButtonsSettings
    | DataTables.ButtonSettings[];

  dom: string;

  orderFixed: Array<number | string> | Array<Array<number | string>> | object;

  rowGroup: boolean | DataTables.RowGroupSettings;

  headerCallback: DataTables.FunctionHeaderCallback;
}

export class DataTables {
  constructor(
    private targetNode: HTMLElement,
    private survey: SurveyModel,
    private data: Array<Object>,
    private options: DataTablesOptions
  ) {}

  groupBy: Array<string> = [];

  render() {
    const tableNode = document.createElement("table");
    const createGroupingButton = this.createGroupingButton;
    const createSelectButton = this.createSelectButton;

    var columnsData: any = this.getColumns().map((c: any) => c.data);

    const options = this.options || {
      buttons: ["copy", "csv", "print"],
      dom: "Blfrtip",
      data: this.data,
      columns: this.getColumns(),
      // orderFixed: [[1, "asc"]],
      rowGroup: {
        dataSrc: columnsData[0],
        endRender: function(rows, group) {
          return "Count: " + rows.data().count();
        }
      },
      select: "api",
      headerCallback: (thead, data, start, end, display) => {
        var datatableApi = $(tableNode)
          .dataTable()
          .api();
        $(thead)
          .children("th")
          .each(function(index, node) {
            var thNode = $(this);

            if (thNode.has("button").length === 0) {
              thNode.prepend(
                createGroupingButton(datatableApi, columnsData[index])
              );
              thNode.prepend(
                createSelectButton(datatableApi, index, columnsData[index])
              );
            }
          });
      }
    };

    this.targetNode.appendChild(tableNode);
    tableNode.className = "sa-datatable display dataTable";

    const datatableApi = $(tableNode).DataTable(options);
    datatableApi
      .rowGroup()
      .enable(false)
      .draw();

    // datatableApi.on("rowgroup-datasrc", function(e, dt, val) {
    // datatableApi.order.fixed({ pre: [[columnsData.indexOf(val), "asc"]] }).draw();
    // });
  }

  createSelectButton = (
    datatableApi: DataTables.Api,
    colIdx: number,
    columnName: string
  ): HTMLButtonElement => {
    const button = document.createElement("button");
    button.innerHTML = "Select Me";
    button.onclick = e => {
      e.stopPropagation();
      (<any>datatableApi.columns()).deselect();
      (<any>datatableApi.column(colIdx)).select();
      !!this.onColumnSelected && this.onColumnSelected(columnName);
    };
    return button;
  };

  createGroupingButton = (
    datatableApi: DataTables.Api,
    columnName: string
  ): HTMLButtonElement => {
    const button = document.createElement("button");
    button.innerHTML = "Group By Me";

    button.onclick = e => {
      e.stopPropagation();

      const index = this.groupBy.indexOf(columnName);
      if (index === -1) {
        this.groupBy.push(columnName);
        button.innerHTML = "Ungroup By Me";
      } else {
        button.innerHTML = "Group By Me";
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

  getColumns(): Array<Object> {
    const columns = this.survey.getAllQuestions().map(question => {
      const q = <Question>question;

      return {
        data: q.name,
        sTitle: (q.title || "").trim() || q.name,
        mRender: (data: object, type: string, row: object) => {
          this.survey.data = row;
          var displayValue = q.displayValue;
          return (
            (typeof displayValue === "string"
              ? displayValue
              : JSON.stringify(displayValue)) || ""
          );
        }
      };
    });

    return columns;
  }

  public onColumnSelected: (dataName: string) => void;
}
