import * as $ from "jquery";
import { SurveyModel, Question } from "survey-core";
import "./datatables.scss";

export class DataTables {
  constructor(
    private targetNode: HTMLElement,
    private survey: SurveyModel,
    private data: Array<Object>
  ) {}

  render() {
    const tableNode = document.createElement("table");
    const columns = this.getColumns();

    tableNode.className = "sa-datatables";

    $(tableNode).DataTable({
      columns: columns,
      data: this.data
    });

    this.targetNode.appendChild(tableNode);
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
