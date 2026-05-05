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
        {
          name: "experience",
          cellType: "dropdown",
          title: "Teaching Experience",
          choices: [
            { value: "item1", text: "Excellent" },
            { value: "item2", text: "Good" },
            { value: "item3", text: "Average" },
            { value: "item4", text: "Poor" },
          ],
        },
      ],
    },
  ],
};

const matrixDynamicData = [
  {
    teachersRate: [
      { subject: "Math", rating: 4, experience: "item1" },
      { subject: "Science", rating: 5, experience: "item2" },
    ],
  },
  {
    teachersRate: [
      { subject: "History", rating: 3, experience: "item3" },
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

test("should display choice text instead of value in paneldynamic nested table", () => {
  const panelWithChoicesJson = {
    questions: [
      {
        type: "paneldynamic",
        name: "question1",
        templateElements: [
          {
            type: "text",
            name: "userName",
            title: "User Name",
          },
          {
            type: "radiogroup",
            name: "favFruit",
            title: "Favorite Fruit",
            choices: [
              { value: "item1", text: "Mango" },
              { value: "item2", text: "Apple" },
              { value: "item3", text: "Banana" },
            ],
          },
        ],
      },
    ],
  };

  const data = [
    {
      question1: [
        { userName: "Alice", favFruit: "item1" },
      ],
    },
    {
      question1: [
        { userName: "Bob", favFruit: "item2" },
        { userName: "Charlie", favFruit: "item3" },
      ],
    },
  ];

  const survey = new SurveyModel(panelWithChoicesJson);
  const tabulator = new Tabulator(survey, data, { useNestedTables: true });

  mockTimeout();
  const container = document.createElement("div");
  tabulator.render(container);

  const columns = tabulator.getColumns();
  const panelColumn = columns.find((col: any) => col.field === "question1");
  expect(panelColumn).toBeDefined();

  // Use the formatter to get the rendered nested table
  const mockCell = {
    getValue: () => [{ userName: "Alice", favFruit: "item1" }],
    getRow: () => ({ getTable: () => ({ on: jest.fn() }) }),
  };
  const result = panelColumn.formatter(mockCell, {}, jest.fn());

  // The result should be an HTML element with the nested table
  expect(result).toBeDefined();
  expect(result instanceof HTMLElement).toBe(true);

  // Check that the table displays "Mango" instead of "item1"
  const cells = result.querySelectorAll("td");
  const cellTexts = Array.from(cells).map((cell: any) => cell.textContent);
  expect(cellTexts).toContain("Alice");
  expect(cellTexts).toContain("Mango");
  expect(cellTexts).not.toContain("item1");

  restoreTimeout();
});

test("should display choice text instead of value in matrixdynamic nested table", () => {
  const survey = new SurveyModel(matrixDynamicJson);
  const tabulator = new Tabulator(survey, matrixDynamicData, { useNestedTables: true });

  mockTimeout();
  const container = document.createElement("div");
  tabulator.render(container);

  const columns = tabulator.getColumns();
  const matrixColumn = columns.find((col: any) => col.field === "teachersRate");
  expect(matrixColumn).toBeDefined();

  // Use the formatter to get the rendered nested table
  const mockCell = {
    getValue: () => [{ subject: "Math", rating: 4, experience: "item1" }],
    getRow: () => ({ getTable: () => ({ on: jest.fn() }) }),
  };
  const result = matrixColumn.formatter(mockCell, {}, jest.fn());

  expect(result).toBeDefined();
  expect(result instanceof HTMLElement).toBe(true);

  // Check that the table displays "Excellent" instead of "item1"
  const cells = result.querySelectorAll("td");
  const cellTexts = Array.from(cells).map((cell: any) => cell.textContent);
  expect(cellTexts).toContain("Math");
  expect(cellTexts).toContain("Excellent");
  expect(cellTexts).not.toContain("item1");

  restoreTimeout();
});

// Nested Tables for Panel Dynamic with complex nested questions
const panelDynamicWithComplexJson = {
  questions: [
    {
      type: "paneldynamic",
      name: "members",
      title: "Family Members",
      templateElements: [
        {
          type: "text",
          name: "name",
          title: "Name",
        },
        {
          type: "matrixdynamic",
          name: "scores",
          title: "Scores",
          columns: [
            { name: "subject", cellType: "text", title: "Subject" },
            { name: "score", cellType: "text", title: "Score" },
          ],
        },
        {
          type: "paneldynamic",
          name: "hobbies",
          title: "Hobbies",
          templateElements: [
            { type: "text", name: "hobbyName", title: "Hobby Name" },
          ],
        },
      ],
    },
  ],
};

const panelDynamicWithComplexData = [
  {
    members: [
      {
        name: "John",
        scores: [
          { subject: "Math", score: 90 },
          { subject: "Science", score: 85 },
        ],
        hobbies: [{ hobbyName: "Reading" }, { hobbyName: "Swimming" }],
      },
    ],
  },
];

test("should display stringified JSON for complex nested values in nested table cells", () => {
  const survey = new SurveyModel(panelDynamicWithComplexJson);
  const tabulator = new Tabulator(survey, panelDynamicWithComplexData, { useNestedTables: true });

  mockTimeout();
  const container = document.createElement("div");
  tabulator.render(container);

  const columns = tabulator.getColumns();
  const membersColumn = columns.find((col: any) => col.field === "members");
  expect(membersColumn).toBeDefined();
  expect(membersColumn.formatter).toBeDefined();

  // Simulate the formatter to verify complex values are stringified
  const nestedTable = tabulator["createNestedTable"](
    [
      { title: "Name", field: "name" },
      { title: "Scores", field: "scores" },
      { title: "Hobbies", field: "hobbies" },
    ],
    panelDynamicWithComplexData[0].members
  );

  const tbody = nestedTable.querySelector("tbody");
  const nestedTableCells = tbody.querySelectorAll("td");

  expect(nestedTableCells[0].textContent).toBe("John");
  expect(nestedTableCells[1].textContent).toBe(JSON.stringify([{ subject: "Math", score: 90 }, { subject: "Science", score: 85 }]));
  expect(nestedTableCells[2].textContent).toBe(JSON.stringify([{ hobbyName: "Reading" }, { hobbyName: "Swimming" }]));

  restoreTimeout();
});

test("should format complex nested values as stringified JSON for export", () => {
  const survey = new SurveyModel(panelDynamicWithComplexJson);
  const tabulator = new Tabulator(survey, panelDynamicWithComplexData, { useNestedTables: true });

  mockTimeout();
  const container = document.createElement("div");
  tabulator.render(container);

  const column = tabulator["columns"].find((col: any) => col.name === "members");
  const result = tabulator["formatNestedDataForExport"](panelDynamicWithComplexData[0].members, column);

  expect(result).toContain("Name");
  expect(result).toContain("John");
  expect(result).toContain(JSON.stringify([{ subject: "Math", score: 90 }, { subject: "Science", score: 85 }]));
  expect(result).toContain(JSON.stringify([{ hobbyName: "Reading" }, { hobbyName: "Swimming" }]));

  restoreTimeout();
});
