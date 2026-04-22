import { SurveyModel } from "survey-core";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Tabulator } from "../../src/entries/tabulator-umd";
import { ColumnDataType } from "../../src/tables/config";

jest.mock("tabulator-tables", () => {
  return { default: jest.requireActual("tabulator-tables") };
});

const trueTimeout = window.setTimeout;

function mockTimeout() {
  window.setTimeout = ((callback: any) => { callback(); }) as any;
}
function restoreTimeout() {
  window.setTimeout = trueTimeout;
}

// Nested Tables for Matrix Dynamic
const matrixDynamicJson = {
  questions: [
    {
      type: "matrixdynamic",
      name: "teachersRate",
      title: "Please rate your teachers",
      columns: [
        {
          name: "subject",
          cellType: "dropdown",
          title: "Select a subject",
          choices: ["Math", "Science", "History"],
        },
        {
          name: "rating",
          cellType: "rating",
          title: "Rating",
        },
      ],
    },
  ],
};

const matrixDynamicData = [
  {
    teachersRate: [
      { subject: "Math", rating: 4 },
      { subject: "Science", rating: 5 },
    ],
  },
  {
    teachersRate: [
      { subject: "History", rating: 3 },
    ],
  },
];

test("should create column for matrixdynamic question when nested tables disabled", () => {
  const survey = new SurveyModel(matrixDynamicJson);
  const tabulator = new Tabulator(survey, matrixDynamicData, { useNestedTables: false });

  const columns = tabulator["buildColumns"](survey);

  expect(columns.length).toBe(1);
  expect(columns[0].name).toBe("teachersRate");
  expect(columns[0].displayName).toBe("Please rate your teachers");
});

test("should create column for matrixdynamic question with nested table capability when enabled", () => {
  const survey = new SurveyModel(matrixDynamicJson);
  const tabulator = new Tabulator(survey, matrixDynamicData, { useNestedTables: true });

  const columns = tabulator["buildColumns"](survey);

  expect(columns.length).toBe(1);
  expect(columns[0].name).toBe("teachersRate");
  expect(columns[0].displayName).toBe("Please rate your teachers");
  expect(columns[0].dataType).toBe(ColumnDataType.NestedTable);
});

test("should generate nested table configuration for matrixdynamic", () => {
  const survey = new SurveyModel(matrixDynamicJson);
  const tabulator = new Tabulator(survey, matrixDynamicData, { useNestedTables: true });

  mockTimeout();
  const container = document.createElement("div");
  tabulator.render(container);

  const columns = tabulator.getColumns();
  const matrixColumn = columns.find((col: any) => col.field === "teachersRate");

  expect(matrixColumn).toBeDefined();
  expect(typeof matrixColumn.formatter).toBe("function");

  restoreTimeout();
});

test("should handle empty matrixdynamic data", () => {
  const survey = new SurveyModel(matrixDynamicJson);
  const emptyData = [{ teachersRate: [] }];
  const tabulator = new Tabulator(survey, emptyData, { useNestedTables: true });

  const columns = tabulator["buildColumns"](survey);

  expect(columns.length).toBe(1);
  expect(columns[0].name).toBe("teachersRate");
});

// Nested Tables for Panel Dynamic
const panelDynamicJson = {
  questions: [
    {
      type: "paneldynamic",
      name: "relatives",
      title: "Please enter details about your relatives",
      templateElements: [
        {
          type: "text",
          name: "relativeType",
          title: "Type of Relative",
        },
        {
          type: "text",
          name: "firstName",
          title: "First Name",
        },
        {
          type: "text",
          name: "lastName",
          title: "Last Name",
        },
      ],
    },
  ],
};

const panelDynamicData = [
  {
    relatives: [
      { relativeType: "Brother", firstName: "John", lastName: "Doe" },
      { relativeType: "Sister", firstName: "Jane", lastName: "Doe" },
    ],
  },
  {
    relatives: [
      { relativeType: "Mother", firstName: "Mary", lastName: "Smith" },
    ],
  },
];

test("should create column for paneldynamic question when nested tables disabled", () => {
  const survey = new SurveyModel(panelDynamicJson);
  const tabulator = new Tabulator(survey, panelDynamicData, { useNestedTables: false });

  const columns = tabulator["buildColumns"](survey);

  expect(columns.length).toBe(1);
  expect(columns[0].name).toBe("relatives");
  expect(columns[0].displayName).toBe("Please enter details about your relatives");
});

test("should create column for paneldynamic question with nested table capability when enabled", () => {
  const survey = new SurveyModel(panelDynamicJson);
  const tabulator = new Tabulator(survey, panelDynamicData, { useNestedTables: true });

  const columns = tabulator["buildColumns"](survey);

  expect(columns.length).toBe(1);
  expect(columns[0].name).toBe("relatives");
  expect(columns[0].displayName).toBe("Please enter details about your relatives");
  expect(columns[0].dataType).toBe(ColumnDataType.NestedTable);
});

test("should handle empty paneldynamic data", () => {
  const survey = new SurveyModel(panelDynamicJson);
  const emptyData = [{ relatives: [] }];
  const tabulator = new Tabulator(survey, emptyData, { useNestedTables: true });

  const columns = tabulator["buildColumns"](survey);

  expect(columns.length).toBe(1);
  expect(columns[0].name).toBe("relatives");
});
