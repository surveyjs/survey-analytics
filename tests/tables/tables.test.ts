import { SurveyModel, Question } from "survey-core";
import { Table } from "../../src/tables/table";
import {
  ColumnDataType,
  ColumnVisibility,
  QuestionLocation,
} from "../../src/tables/config";

const json = {
  questions: [
    {
      type: "radiogroup",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 4,
      choices: ["None", "Ford", "Vauxhall"],
    },
    {
      type: "file",
      name: "photo",
    },
  ],
};

test("buildColumns method", () => {
  const survey = new SurveyModel(json);
  const tables = new Table(survey, [], null);

  const columns = <any>tables["buildColumns"](survey);

  expect(JSON.stringify(columns)).toBe(
    '[{"name":"car","displayName":"What car are you driving?","dataType":0,"visibility":0,"location":0},{"name":"photo","displayName":"photo","dataType":1,"visibility":1,"location":0}]'
  );
});

test("isVisible method", () => {
  let tables = new Table(new SurveyModel(), [], null);
  expect(tables.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(tables.isVisible(ColumnVisibility.PublicInvisible)).toBeFalsy();
  expect(tables.isVisible(ColumnVisibility.Visible)).toBeTruthy();

  tables = new Table(new SurveyModel(), [], null, [], true);
  expect(tables.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(tables.isVisible(ColumnVisibility.PublicInvisible)).toBeTruthy();
  expect(tables.isVisible(ColumnVisibility.Visible)).toBeTruthy();
});
