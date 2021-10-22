import { SurveyModel } from "survey-core";
import { Tabulator } from "../../src/tables/tabulator";

jest.mock("tabulator-tables", () => {
  return { default: jest.requireActual("tabulator-tables") };
});

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
    '[{"name":"car","displayName":"What car are you driving?","dataType":0,"isVisible":true,"isPublic":true,"location":0},{"name":"photo","displayName":"photo","dataType":1,"isVisible":true,"isPublic":true,"location":0}]'
  );
});
test("getColumns method", () => {
  const survey = new SurveyModel(json);
  const tabulator = new Tabulator(survey, [], null);

  const columns = <any>tabulator["getColumns"]();

  expect(JSON.stringify(columns)).toBe(
    '[{"field":"","title":"","download":false,"resizable":false,"minWidth":60,"width":60},{"field":"car","title":"What car are you driving?","widthShrink":1,"visible":true,"headerSort":false,"formatter":"plaintext"},{"field":"photo","title":"photo","widthShrink":1,"visible":true,"headerSort":false,"formatter":"html"}]'
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
      isVisible: true,
      isPublic: true,
      location: 0,
      width: 50,
    },
    {
      name: "q2",
      displayName: "q2",
      dataType: 0,
      isVisible: true,
      isPublic: true,
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
      isVisible: true,
      isPublic: true,
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
  (<any>tabulator).options.tabulatorOptions.downloadRowRange = "active";
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
      isVisible: true,
      isPublic: true,
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

test("useNamesAsTitles option", () => {
  const surveyJson = {
    questions: [
      {
        type: "text",
        name: "str",
        title: "String",
      },
    ],
  };
  const survey = new SurveyModel(surveyJson);

  let tabulator = new Tabulator(survey, [], null);
  let columns = <any>tabulator.getColumns();
  expect(JSON.stringify(columns)).toBe(
    "[{\"field\":\"\",\"title\":\"\",\"download\":false,\"resizable\":false,\"minWidth\":60,\"width\":60},{\"field\":\"str\",\"title\":\"String\",\"widthShrink\":1,\"visible\":true,\"headerSort\":false,\"formatter\":\"plaintext\"}]"
  );

  tabulator = new Tabulator(survey, [], <any>{ useNamesAsTitles: true });
  columns = <any>tabulator.getColumns();
  expect(JSON.stringify(columns)).toBe(
    "[{\"field\":\"\",\"title\":\"\",\"download\":false,\"resizable\":false,\"minWidth\":60,\"width\":60},{\"field\":\"str\",\"title\":\"str\",\"widthShrink\":1,\"visible\":true,\"headerSort\":false,\"formatter\":\"plaintext\"}]"
  );
});

test("check pdf options before download", () => {
  const surveyJson = {
    questions: [
      {
        type: "text",
        name: "question 1",
      },
      {
        type: "text",
        name: "question 2",
      },
      {
        type: "text",
        name: "question 3",
      },
      {
        type: "text",
        name: "question 4",
      },
      {
        type: "text",
        name: "question 5",
      },
      {
        type: "text",
        name: "question 6",
      },
    ],
  };
  const survey = new SurveyModel(surveyJson);
  const tabulator = new Tabulator(survey, [], null);
  tabulator.render(document.createElement("div"));
  let options = tabulator["getDownloadOptions"]("pdf");
  expect(options.jsPDF.format).toEqual([595.28, 1120.32]);
  tabulator.setColumnVisibility("question 1", false);
  options = tabulator["getDownloadOptions"]("pdf");
  expect(options.jsPDF.format).toEqual([595.28, 933.6]);
  tabulator.setColumnVisibility("question 2", false);
  options = tabulator["getDownloadOptions"]("pdf");
  expect(options.jsPDF).toEqual(undefined); //a4 default format
  tabulator.setColumnVisibility("question 3", false);
  options = tabulator["getDownloadOptions"]("pdf");
  expect(options.jsPDF).toEqual(undefined); //a4 default format
});

test("image and file export formatter", () => {
  const surveyJson = {
    questions: [
      {
        type: "signaturepad",
        name: "signature",
        title:
          "Signature",
      },
      {
        type: "file",
        title: "Please upload your photo",
        name: "image"
      }
    ],
  };
  const survey = new SurveyModel(surveyJson);

  const data = [{
    signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICAYAAABS39xVAA",
    "image": [
      { "name": "file1.png", "type": "image/png", "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICAYAAABS39xVAA" },
      { "name": "file2.png", "type": "image/png", "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICAYAAABS39xVAA" }]
  }];

  const tabulator = new Tabulator(survey, data, null);
  const columns = <any>tabulator.getColumns();
  const accessorDownload: any = columns[1].accessorDownload;

  const fileCell = accessorDownload(undefined, undefined, undefined, undefined, { getDefinition: () => ({ field: "image" }) }, { getPosition: () => 0 });
  expect(fileCell).toBe("file1.png, file2.png");

  const imageCell = accessorDownload(undefined, undefined, undefined, undefined, { getDefinition: () => ({ field: "signature" }) }, { getPosition: () => 0 });
  expect(imageCell).toBe("signature");
});