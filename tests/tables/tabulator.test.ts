import { SurveyModel, Question } from "survey-core";
import { Tabulator } from "../../src/tables/tabulator";
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
  const tabulator = new Tabulator(
    document.createElement("table"),
    survey,
    [],
    null
  );

  const columns = <any>tabulator["buildColumns"](survey);

  expect(JSON.stringify(columns)).toBe(
    '[{"name":"car","displayName":"What car are you driving?","dataType":0,"visibility":0,"location":0},{"name":"photo","displayName":"photo","dataType":1,"visibility":1,"location":0}]'
  );
});

test("isVisible method", () => {
  let tabulator = new Tabulator(
    document.createElement("table"),
    new SurveyModel(),
    [],
    null
  );
  expect(tabulator.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(tabulator.isVisible(ColumnVisibility.PublicInvisible)).toBeFalsy();
  expect(tabulator.isVisible(ColumnVisibility.Visible)).toBeTruthy();

  tabulator = new Tabulator(
    document.createElement("table"),
    new SurveyModel(),
    [],
    null,
    [],
    true
  );
  expect(tabulator.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(tabulator.isVisible(ColumnVisibility.PublicInvisible)).toBeTruthy();
  expect(tabulator.isVisible(ColumnVisibility.Visible)).toBeTruthy();
});

test("getColumns method", () => {
  const survey = new SurveyModel(json);
  const tabulator = new Tabulator(
    document.createElement("table"),
    survey,
    [],
    null
  );

  const columns = <any>tabulator["getColumns"]();

  expect(JSON.stringify(columns)).toBe(
    '[{"field":"car","title":"What car are you driving?","visible":true}]'
  );
});
