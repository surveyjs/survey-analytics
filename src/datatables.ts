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

  render() {
    const tableNode = document.createElement("table");
    const createButton = this.createGroupingButton;

    var columnsData: any = this.getColumns().map((c: any) => c.data);

    const options = this.options || {
      buttons: ["copy", "csv", "print"],
      dom: "Blfrtip",
      data: this.data,
      columns: this.getColumns(),
      // orderFixed: [[1, "asc"]],
      rowGroup: {
        dataSrc: columnsData[0]
      },
      headerCallback: (thead, data, start, end, display) => {
        var datatableApi = $(tableNode)
          .dataTable()
          .api();
        $(thead)
          .children("th")
          .each(function(index, node) {
            var thNode = $(this);

            if (thNode.has("button").length === 0) {
              thNode.append(createButton(datatableApi, columnsData[index]));
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

  createGroupingButton(
    datatableApi: DataTables.Api,
    columnName: any
  ): HTMLButtonElement {
    const button = document.createElement("button");
    button.innerHTML = "Group By Me";

    button.onclick = e => {
      e.stopPropagation();

      datatableApi.rowGroup().enable();
      datatableApi
        .rowGroup()
        .dataSrc(columnName)
        .draw();
      // datatableApi.rowGroup().enable();
      // datatableApi.draw();
    };

    return button;
  }

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
}
