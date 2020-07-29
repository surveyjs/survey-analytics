import { SurveyModel, Question } from "survey-core";
import { Table } from "../../src/tables/table";
import {
  ColumnDataType,
  ColumnVisibility,
  QuestionLocation,
  ITableState,
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

class TableTest extends Table {
  applyColumnFilter() {}
  applyFilter() {}
  render() {}
  setPageSize() {}
  sortByColumn() {}
}

test("buildColumns method", () => {
  const survey = new SurveyModel(json);
  const tables = new TableTest(survey, [], null, [], false);

  const columns = <any>tables["buildColumns"](survey);

  expect(JSON.stringify(columns)).toBe(
    '[{"name":"car","displayName":"What car are you driving?","dataType":0,"visibility":0,"location":0},{"name":"photo","displayName":"photo","dataType":1,"visibility":1,"location":0}]'
  );
});

test("isVisible method", () => {
  let tables = new TableTest(new SurveyModel(), [], null, [], false);
  expect(tables.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(tables.isVisible(ColumnVisibility.PublicInvisible)).toBeFalsy();
  expect(tables.isVisible(ColumnVisibility.Visible)).toBeTruthy();

  tables = new TableTest(new SurveyModel(), [], null, [], true);
  expect(tables.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(tables.isVisible(ColumnVisibility.PublicInvisible)).toBeTruthy();
  expect(tables.isVisible(ColumnVisibility.Visible)).toBeTruthy();
});

test("getState, setState, onStateChanged", () => {
  let tables = new TableTest(new SurveyModel(), [], null, [], false);

  let initialState: ITableState = {
    locale: "",
    elements: [],
  };
  let newState: ITableState = {
    locale: "fr",
    elements: [],
  };
  let count = 0;

  tables.onStateChanged.add(() => {
    count++;
  });

  expect(tables.state).toEqual(initialState);

  tables.state = newState;
  expect(tables.state).toEqual(newState);
  expect(count).toBe(1);

  tables.locale = "ru";
  expect(count).toBe(2);
  expect(tables.state.locale).toEqual("ru");
});
