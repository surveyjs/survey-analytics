import { SurveyModel, Question } from "survey-core";
import { Table } from "../../src/tables/table";
import { ITableState } from "../../src/tables/config";

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
  sortByColumn() {}
}

test("buildColumns method", () => {
  const survey = new SurveyModel(json);
  const tables = new TableTest(survey, [], null, []);

  const columns = <any>tables["buildColumns"](survey);

  expect(JSON.stringify(columns)).toBe(
    '[{"name":"car","displayName":"What car are you driving?","dataType":0,"isVisible":true,"isPublic":true,"location":0},{"name":"photo","displayName":"photo","dataType":1,"isVisible":true,"isPublic":true,"location":0}]'
  );
});

test("locale", () => {
  const survey = new SurveyModel(json);
  const tables = new TableTest(survey, [], null, []);

  expect(tables.locale).toBe("");
  tables.locale = "ru";
  expect(tables.locale).toBe("ru");
});

test("get/set permissions, onPermissionsChangedCallback", () => {
  let tables = new TableTest(new SurveyModel(json), [], null, []);
  let count = 0;

  const p = tables.permissions;
  tables.permissions = p;

  tables.onPermissionsChangedCallback = () => {
    count++;
  };

  expect(tables.permissions[0].name).toEqual("car");
  expect(tables.permissions[0].isPublic).toEqual(true);

  const newPermissions = tables.permissions;
  newPermissions[0].isPublic = false;

  tables.permissions = newPermissions;

  expect(count).toEqual(1);
  expect(tables.permissions[0].isPublic).toEqual(false);
});

test("getState, setState, onStateChanged", () => {
  let tables = new TableTest(new SurveyModel(), [], null, []);

  let initialState: ITableState = {
    locale: "",
    elements: [],
    pageSize: 5,
  };
  let newState: ITableState = {
    locale: "fr",
    elements: [],
    pageSize: 5,
  };
  let count = 0;

  tables.onStateChanged.add(() => {
    count++;
  });

  expect(tables.state).toEqual(initialState);
  tables.state = null;

  tables.state = newState;
  expect(tables.state).toEqual(newState);
  expect(count).toBe(0);

  tables.locale = "ru";
  expect(count).toBe(1);
  expect(tables.state.locale).toEqual("ru");
});

test("partial state", () => {
  let tables = new TableTest(new SurveyModel(), [], null, []);
  tables.state = { locale: "ru" };
  tables.state = { pageSize: 4 };
  tables.state = { elements: [] };
});

test("move column method", () => {
  var table = new TableTest(new SurveyModel(), [], null, []);
  table.columns = [
    {
      name: "column1",
      displayName: "column1",
      dataType: 0,
      isVisible: true,
      isPublic: true,
      location: 0,
    },
    {
      name: "column2",
      displayName: "column2",
      dataType: 0,
      isVisible: true,
      isPublic: true,
      location: 0,
    },
    {
      name: "column3",
      displayName: "column3",
      dataType: 0,
      isVisible: true,
      isPublic: true,
      location: 0,
    },
  ];
  table.moveColumn(0, 1);
  var names = table.columns.map((column) => column.name);
  expect(names).toEqual(["column2", "column1", "column3"]);
  table.moveColumn(0, 2);
  names = table.columns.map((column) => column.name);
  expect(names).toEqual(["column1", "column3", "column2"]);
});

test("check that setPageSize fires onStateChanged", () => {
  var table = new TableTest(new SurveyModel(), [], null, []);
  var count = 0;
  table.onStateChanged.add(() => {
    count++;
  });
  table.setPageSize(2);
  expect(count).toBe(1);
});

test("check save/restore page size in the state", () => {
  var table = new TableTest(new SurveyModel(), [], null, []);
  table.setPageSize(2);
  expect(table.state.pageSize).toBe(2);
  table.state = { elements: [], locale: "", pageSize: 4 };
  expect(table.getPageSize()).toBe(4);
});

test("check setColumnWidth method", () => {
  var table = new TableTest(new SurveyModel(), [], null, []);
  table.columns = [
    {
      name: "column1",
      displayName: "column1",
      dataType: 0,
      isVisible: true,
      isPublic: true,
      location: 0,
    },
  ];
  table.setColumnWidth("column1", 50);
  expect(table.columns[0].width).toBe(50);
});

test("check that setColumnWidth fires onStateChanged", () => {
  var table = new TableTest(new SurveyModel(), [], null, []);
  var count = 0;
  table.columns = [
    {
      name: "column1",
      displayName: "column1",
      dataType: 0,
      isVisible: true,
      isPublic: true,
      location: 0,
    },
  ];
  table.onStateChanged.add(() => {
    count++;
  });
  table.setColumnWidth("column1", 50);
  expect(count).toBe(1);
});

test("check useValuesAsLabels option", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        name: "radio",
        choices: [{ value: "choiceValue", text: "choiceText" }],
      },
    ],
  };
  const survey = new SurveyModel(json);
  var data = [{ radio: "choiceValue" }];
  var table = new TableTest(survey, data, {}, []);
  expect((<any>table).tableData[0]["radio"]).toEqual("choiceText");
  table = new TableTest(survey, data, { useValuesAsLabels: true }, []);
  expect((<any>table).tableData[0]["radio"]).toEqual("choiceValue");
});

test("check onGetQuestionValue event", () => {
  const json = {
    questions: [
      {
        type: "radiogroup",
        name: "radio",
        choices: [{ value: "choiceValue", text: "choiceText" }],
      },
    ],
  };
  const survey = new SurveyModel(json);
  var data = [{ radio: "choiceValue" }];
  var table = new TableTest(survey, data, {}, []);
  expect((<any>table).tableData[0]["radio"]).toEqual("choiceText");
  table = new TableTest(
    survey,
    data,
    {
      onGetQuestionValue: (opt) => {
        opt.displayValue = opt.question.value;
      },
    },
    []
  );
  expect((<any>table).tableData[0]["radio"]).toEqual("choiceValue");
});
