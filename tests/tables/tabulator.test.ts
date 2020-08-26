import { SurveyModel } from "survey-core";
import { Tabulator } from "../../src/tables/tabulator";
import { ColumnVisibility } from "../../src/tables/config";

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
  const tabulator = new Tabulator(survey, [], null);

  const columns = <any>tabulator["buildColumns"](survey);

  expect(JSON.stringify(columns)).toBe(
    '[{"name":"car","displayName":"What car are you driving?","dataType":0,"visibility":0,"location":0},{"name":"photo","displayName":"photo","dataType":1,"visibility":1,"location":0}]'
  );
});

test("isVisible method", () => {
  let tabulator = new Tabulator(new SurveyModel(), [], null);
  expect(tabulator.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(tabulator.isVisible(ColumnVisibility.PublicInvisible)).toBeFalsy();
  expect(tabulator.isVisible(ColumnVisibility.Visible)).toBeTruthy();

  tabulator = new Tabulator(new SurveyModel(), [], null, [], true);
  expect(tabulator.isVisible(ColumnVisibility.Invisible)).toBeFalsy();
  expect(tabulator.isVisible(ColumnVisibility.PublicInvisible)).toBeTruthy();
  expect(tabulator.isVisible(ColumnVisibility.Visible)).toBeTruthy();
});

test("getColumns method", () => {
  const survey = new SurveyModel(json);
  const tabulator = new Tabulator(survey, [], null);

  const columns = <any>tabulator["getColumns"]();

  expect(JSON.stringify(columns)).toBe(
    '[{"field":"","title":"","download":false,"resizable":false,"width":60},{"field":"car","title":"What car are you driving?","minWidth":248,"widthShrink":1,"visible":true,"headerSort":false},{"field":"photo","title":"photo","minWidth":248,"widthShrink":1,"visible":false,"headerSort":false}]'
  );
});

test("move column callback", () => {
  var json = {
    questions: [
      {
        name: "q1",
        type: "text",
      },
      {
        name: "q2",
        type: "text",
      },
      {
        name: "q3",
        type: "text",
      },
      {
        name: "q4",
        type: "text",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const tabulator = new Tabulator(survey, [], null);
  tabulator.render(document.createElement("table"));
  (<any>tabulator).tabulatorTables.moveColumn("q1", "q3", true);
  var trueOrder = ["q2", "q3", "q1", "q4"];
  var order = tabulator.columns.map((column) => column.name);
  expect(order).toEqual(trueOrder);
});

test("check that tabulator takes into account column's width", () => {
  const tabulator = new Tabulator(new SurveyModel(null), [], null);
  tabulator.columns = [
    {
      name: "q1",
      displayName: "q1",
      dataType: 0,
      visibility: 0,
      location: 0,
      width: 50,
    },
    {
      name: "q2",
      displayName: "q2",
      dataType: 0,
      visibility: 0,
      location: 0,
    },
  ];
  var tabulatorColumns = tabulator.getColumns();
  expect(tabulatorColumns[1].width).toBe(50);
  expect(tabulatorColumns[1].widthShrink).toBe(0);
  expect(tabulatorColumns[2].width).toBe(undefined);
  expect(tabulatorColumns[2].widthShrink).toBe(1);
});

test("check that tabulator take into account column's width after layout (check widthShrink)", () => {
  const tabulator = new Tabulator(new SurveyModel(null), [], null);
  tabulator.columns = [
    {
      name: "q1",
      displayName: "q1",
      dataType: 0,
      visibility: 0,
      location: 0,
    },
  ];
  tabulator.render(document.createElement("table"));
  var columnDefinitions = tabulator.tabulatorTables.getColumnDefinitions();
  expect(columnDefinitions[1].width).toBe(undefined);
  expect(columnDefinitions[1].widthShrink).toBe(1);
  tabulator.setColumnWidth("q1", 150);
  expect(columnDefinitions[1].width).toBe(150);
  expect(columnDefinitions[1].widthShrink).toBe(0);
});

test("check that tabulator take into account downloadRowRange option", () => {
  const tabulator = new Tabulator(new SurveyModel(null), [], null);
  tabulator.render(document.createElement("table"));
  expect(tabulator.tabulatorTables.options.downloadRowRange).toBe("all");
  (<any>tabulator).options.downloadRowRange = "active";
  tabulator.render(document.createElement("table"));
  expect(tabulator.tabulatorTables.options.downloadRowRange).toBe("active");
});

test("check that tabulator take into account downloadHiddenColumns option", () => {
  const tabulator = new Tabulator(new SurveyModel(null), [], null);
  tabulator.columns = [
    {
      name: "q1",
      displayName: "q1",
      dataType: 0,
      visibility: 0,
      location: 0,
    },
  ];

  tabulator.render(document.createElement("table"));
  expect(tabulator.tabulatorTables.getColumnDefinitions()[1].download).toBe(
    undefined
  );

  (<any>tabulator).options.downloadHiddenColumns = true;
  tabulator.render(document.createElement("table"));
  expect(tabulator.tabulatorTables.getColumnDefinitions()[1].download).toBe(
    true
  );
});

test("check that action column doesn't export", () => {
  const tabulator = new Tabulator(new SurveyModel(null), [], null);
  tabulator.render(document.createElement("table"));
  expect(tabulator.tabulatorTables.getColumnDefinitions()[0].download).toBe(
    false
  );
  (<any>tabulator).options.downloadHiddenColumns = true;
  tabulator.render(document.createElement("table"));
  expect(tabulator.tabulatorTables.getColumnDefinitions()[0].download).toBe(
    false
  );
});
