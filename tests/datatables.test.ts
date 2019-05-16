import { SurveyModel, Question } from "survey-core";
import { DataTables } from "../src/datatables";

test("getColumns method", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        name: "car",
        title: "What car are you driving?",
        isRequired: true,
        colCount: 4,
        choices: ["None", "Ford", "Vauxhall"]
      }
    ]
  };

  const survey = new SurveyModel(json);

  const dataTables = new DataTables(
    document.createElement("table"),
    survey,
    [],
    null
  );

  const columns = <any>dataTables.getColumns();

  expect(JSON.stringify(columns)).toBe(
    '[{"data":"car","sTitle":"What car are you driving?"}]'
  );
});
