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
    const columns = this.getColumns();
    const options = this.options || {
      buttons: ["copy", "csv", "print"],
      orderFixed: {
        pre: [1, "asc"]
      },
      rowGroup: {
        dataSrc: "satisfaction"
      },
      dom: "Blfrtip"
    };

    this.targetNode.appendChild(tableNode);
    tableNode.className = "sa-datatable display dataTable";

    $(tableNode).DataTable({
      columns: columns,
      data: this.data,
      dom: options.dom,
      buttons: options.buttons,
      orderFixed: options.orderFixed,
      rowGroup: options.rowGroup
    });
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
