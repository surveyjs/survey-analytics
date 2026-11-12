import { SurveyModel } from "survey-core";
import { vi } from "vitest";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Tabulator } from "../../src/entries/tabulator-umd";
import { TableTest } from "./tables.test";
import { QuestionLocation } from "../../src/tables/config";

vi.mock("tabulator-tables", async () => {
  const tabulatorModule = await vi.importActual<any>("tabulator-tables");
  return { default: tabulatorModule.TabulatorFull || tabulatorModule.Tabulator };
});

const trueTimeout = window.setTimeout;
function mockTimeout() {
  window.setTimeout = ((callback: any) => { callback(); }) as any;
}
function restoreTimeout() {
  window.setTimeout = trueTimeout;
}

const innerElements = [
  { type: "text", name: "street", title: "Street name" },
  { type: "radiogroup", name: "kind", title: "Kind", choices: [{ value: "a", text: "Kind A" }, { value: "b", text: "Kind B" }] },
  { type: "checkbox", name: "pets", choices: ["cat", "dog"], showOtherItem: true },
  { type: "matrix", name: "m", columns: [{ value: "c1", text: "Col 1" }, "c2"], rows: ["r1", "r2"] },
  { type: "matrixdropdown", name: "md", columns: [{ name: "col1" }], rows: ["r1"], cellType: "text" },
  { type: "multipletext", name: "mt", items: [{ name: "i1" }, { name: "i2" }] },
  { type: "file", name: "f" },
  { type: "signaturepad", name: "sig" },
  { type: "paneldynamic", name: "pd", templateElements: [{ type: "text", name: "title" }, { type: "dropdown", name: "level", choices: [{ value: 1, text: "Low" }, { value: 2, text: "High" }] }] },
  { type: "matrixdynamic", name: "mdyn", columns: [{ name: "x", cellType: "text" }, { name: "y", cellType: "dropdown", choices: [{ value: "y1", text: "Yes" }] }] },
];
const innerNames = ["street", "kind", "pets", "pets-Comment", "m.r1", "m.r2", "md.r1.col1", "mt", "f", "sig", "pd", "mdyn"];

const answers = [
  {
    street: "main", kind: "a", pets: ["cat", "other"], "pets-Comment": "fish", m: { r1: "c1", r2: "c2" }, md: { r1: { col1: "v1" } },
    mt: { i1: "t1", i2: "t2" }, f: [{ name: "a.png", type: "image/png", content: "data:image/png;base64,AA" }, { name: "b.png", type: "image/png", content: "data:image/png;base64,BB" }],
    sig: "data:image/png;base64,SS", pd: [{ title: "T1", level: 2 }, { title: "T2" }], mdyn: [{ x: "x1", y: "y1" }, { x: "x2" }]
  },
  { street: "side", kind: "b", pets: ["dog"], m: { r1: "c2" }, mdyn: [{ x: "x3" }] },
];
const flatRows = () => answers.map((a, i) => Object.assign({ q1: "x" + i }, JSON.parse(JSON.stringify(a))));
const nestedRows = () => answers.map((a, i) => ({ q1: "x" + i, address: JSON.parse(JSON.stringify(a)) }));

function createSurvey(nested: boolean, dataNesting?: string): SurveyModel {
  const json: any = {
    elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "panel1", valueName: nested ? "address" : undefined, elements: innerElements },
    ],
  };
  if(dataNesting) json.dataNesting = dataNesting;
  return new SurveyModel(json);
}

const tableOptions = [{}, { splitMultiSelectIntoColumns: true }, { useNestedTables: false }, { useValuesAsLabels: true }];

function cellOf(table: any, name: string, data: any) {
  return table.getColumnByName(name).getCellData(table, data).displayValue;
}

describe("Table View reads each answer at the question's data path (nested data, survey-library #12233)", () => {
  test("nested rows give the same cells as flat rows of the flat survey (nested data, survey-library #12233)", () => {
    for(const options of tableOptions) {
      const flatTable = new TableTest(createSurvey(false), flatRows(), Object.assign({}, options), []);
      const nestedTable = new TableTest(createSurvey(true), nestedRows(), Object.assign({}, options), []);
      const label = JSON.stringify(options);
      expect(nestedTable.columns.map(c => c.name), label).toEqual(flatTable.columns.map(c => c.name));
      expect(nestedTable.columns.map(c => c.displayName), label).toEqual(flatTable.columns.map(c => c.displayName));
      const flatData = flatTable.getTableData();
      const nestedData = nestedTable.getTableData();
      flatTable.columns.filter(c => c.name !== "pets.dog").forEach(c => {
        expect(JSON.stringify(flatData[0][c.name]), label + " " + c.name + " has a value").not.toMatch(/^""$|^undefined$/);
      });
      expect(nestedData, label).toEqual(flatData);
    }
  });

  test("a column per inner question, named by question.name, header by question.title (nested data, survey-library #12233)", () => {
    const table = new TableTest(createSurvey(true), nestedRows(), {}, []);
    expect(table.columns.map(c => c.name)).toEqual(["q1"].concat(innerNames));
    expect(table.getColumnByName("street").displayName).toBe("Street name");
    expect(table.getColumnByName("kind").displayName).toBe("Kind");
    const data = table.getTableData();
    expect(data[0]["m.r1"]).toBe("Col 1");
    expect(data[0]["md.r1.col1"]).toBe("v1");
    expect(data[0]["f"]).toContain("a.png");
    expect(data[0]["pd"]).toEqual([{ title: "T1", level: 2 }, { title: "T2" }]);
    expect(data[1]["mdyn"]).toEqual([{ x: "x3" }]);

    const split = new TableTest(createSurvey(true), nestedRows(), { splitMultiSelectIntoColumns: true }, []);
    const splitData = split.getTableData();
    expect([splitData[0]["pets.cat"], splitData[0]["pets.dog"], splitData[0]["pets.other"]]).toEqual(["&#10004;", "", "&#10004;"]);
    expect(splitData[0]["pets-Comment"]).toBe("fish");
  });

  test("old flat rows and nested rows in one data set (nested data, survey-library #12233)", () => {
    const rows = [flatRows()[0], nestedRows()[0]];
    const table = new TableTest(createSurvey(true), rows, { splitMultiSelectIntoColumns: true }, []);
    const data = table.getTableData();
    expect(data[0]["q1"]).toBe("x0");
    expect(data[1]["q1"]).toBe("x0");
    table.columns.filter(c => c.name !== "q1").forEach(c => {
      expect(data[0][c.name], "flat row, " + c.name).toBe("");
      if(c.name !== "pets.dog") expect(data[1][c.name], "nested row, " + c.name).not.toBe("");
    });
  });

  test("a choice-nested question of a question inside a nesting panel (nested data, survey-library #12233)", () => {
    // survey-core stores a choice panel's question at the survey root ({ address: { ai }, aiTool }): its data path
    // is ["aiTool"] and its value scope is the survey (see report-03, follow-ups).
    const survey = new SurveyModel({
      elements: [{
        type: "panel", name: "panel1", valueName: "address", elements: [
          { type: "radiogroup", name: "ai", choices: ["no", { value: "yes", elements: [{ type: "text", name: "aiTool" }, { type: "file", name: "aiFile" }] }] },
        ]
      }]
    });
    const aiTool = survey.getQuestionByName("aiTool");
    expect(aiTool.getDataPath()).toEqual(["aiTool"]);
    const file = [{ name: "a.png", type: "image/png", content: "data:image/png;base64,AA" }];
    const rows = [{ address: { ai: "yes" }, aiTool: "GPT", aiFile: file }, { address: { ai: "no" } }, { address: { ai: "yes" }, aiTool: "Other" }];
    const table = new TableTest(survey, rows, {}, []);
    expect(table.columns.map(c => c.name)).toEqual(["ai", "aiTool", "aiFile"]);
    expect(table.getTableData().map(r => r["aiTool"])).toEqual(["GPT", "", "Other"]);
    expect(table.getTableData().map(r => r["aiFile"].indexOf("a.png") > -1)).toEqual([true, false, false]);
  });

  test("a choice-nested question in a dynamic panel's template, rows with more panels (nested data, survey-library #12233)", () => {
    // a panel created for a later row holds choice-nested questions with no data yet: no value scope to read from
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "items", templateElements: [
          { type: "text", name: "title" },
          { type: "radiogroup", name: "rg", choices: ["a", { value: "b", elements: [{ type: "text", name: "rgt" }] }] },
        ]
      }]
    });
    const rows = [{ items: [{ title: "T1", rg: "b", rgt: "X1" }] }, { items: [{ title: "T2" }, { title: "T3" }] }];
    for(const options of [{}, { useNestedTables: false }]) {
      const table = new TableTest(survey, rows, Object.assign({}, options), []);
      const data = table.getTableData();
      expect(data.length, JSON.stringify(options)).toBe(2);
      expect(JSON.stringify(data[1]["items"]), JSON.stringify(options)).toContain("T3");
    }
  });

  test("state round-trips, and a state saved from the flat survey applies (nested data, survey-library #12233)", () => {
    const flatTable = new TableTest(createSurvey(false), flatRows(), {}, []);
    flatTable.setColumnVisibility("street", false);
    flatTable.setColumnLocation("m.r1", QuestionLocation.Row);
    flatTable.moveColumn(1, 3);
    const flatState = JSON.parse(JSON.stringify(flatTable.state));

    const nestedTable = new TableTest(createSurvey(true), nestedRows(), {}, []);
    nestedTable.state = JSON.parse(JSON.stringify(flatState));
    expect(nestedTable.state).toEqual(flatState);
    expect(nestedTable.getColumnByName("street").isVisible).toBe(false);
    expect(nestedTable.getColumnByName("m.r1").location).toBe(QuestionLocation.Row);
    expect(nestedTable.columns.map(c => c.name)).toEqual(flatTable.columns.map(c => c.name));

    const state = JSON.parse(JSON.stringify(nestedTable.state));
    const restored = new TableTest(createSurvey(true), nestedRows(), {}, []);
    restored.state = state;
    expect(restored.state).toEqual(state);
    expect(restored.getTableData()).toEqual(nestedTable.getTableData());
  });

  test("dataNesting \"none\" with a panel valueName reads flat rows only (nested data, survey-library #12233)", () => {
    const survey = createSurvey(true, "none");
    expect(survey.getQuestionByName("street").getDataPath()).toEqual(["street"]);
    const flatTable = new TableTest(createSurvey(false), flatRows(), {}, []);
    const table = new TableTest(survey, flatRows().concat(nestedRows()), {}, []);
    const data = table.getTableData();
    expect(data.slice(0, 2)).toEqual(flatTable.getTableData());
    table.columns.filter(c => c.name !== "q1").forEach(c => {
      expect(data[2][c.name], "nested row, " + c.name).toBe("");
    });
  });

  test("records: a dynamic panel whose template holds a nesting panel (nested data, survey-library #12233)", () => {
    const createRecordsSurvey = (nested: boolean) => new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "items", templateElements: [
          { type: "text", name: "title" },
          { type: "panel", name: "pp", valueName: nested ? "addr" : undefined, elements: [{ type: "dropdown", name: "kind2", choices: [{ value: "k1", text: "Kind 1" }, "k2"] }] },
        ]
      }]
    });
    const flatData = [{ items: [{ title: "T1", kind2: "k1" }, { title: "T2", kind2: "k2" }] }];
    const nestedData = [{ items: [{ title: "T1", addr: { kind2: "k1" } }, { title: "T2", addr: { kind2: "k2" } }] }];

    const plainFlat = new TableTest(createRecordsSurvey(false), flatData, { useNestedTables: false }, []);
    const plainNested = new TableTest(createRecordsSurvey(true), nestedData, { useNestedTables: false }, []);
    expect(plainFlat.getTableData()[0]["items"]).toContain("Kind 1");
    expect(plainNested.getTableData()[0]["items"]).toContain("Kind 1");
    expect(plainNested.getTableData()[0]["items"]).toContain("k2");

    const survey = createRecordsSurvey(true);
    const tabulator = new Tabulator(survey, nestedData, null);
    const column = tabulator.getColumns().filter((c: any) => c.field === "items")[0];
    const cellData = tabulator.getTableData()[0]["items"];
    expect(cellData).toEqual(nestedData[0].items);
    const element: HTMLElement = column.formatter({ getValue: () => cellData }, {}, () => { });
    const cells = Array.prototype.map.call(element.querySelectorAll("tbody tr"), (tr: HTMLElement) =>
      Array.prototype.map.call(tr.querySelectorAll("td"), (td: HTMLElement) => td.textContent));
    expect(cells).toEqual([["T1", "Kind 1"], ["T2", "k2"]]);
    expect(column.tooltip(undefined, { getValue: () => cellData })).toBe("[title | kind2]\nT1 | Kind 1\nT2 | k2");

    // useNestedTables set to a value other than true builds an inner Tabulator: capture its config
    const nestedTabulator = new Tabulator(createRecordsSurvey(true), nestedData, { useNestedTables: "tabulator" } as any);
    const innerColumn = nestedTabulator.getColumns().filter((c: any) => c.field === "items")[0];
    const constructorHolder: any = Tabulator;
    const prevConstructor = constructorHolder.tabulatorTablesConstructor;
    let innerConfig: any;
    constructorHolder.tabulatorTablesConstructor = function (_: HTMLElement, config: any) {
      innerConfig = config;
      return { on: () => { } };
    };
    try {
      innerColumn.formatter({ getValue: () => nestedTabulator.getTableData()[0]["items"], getRow: () => undefined }, {}, (callback: () => void) => callback());
    } finally {
      constructorHolder.tabulatorTablesConstructor = prevConstructor;
    }
    expect(innerConfig.columns).toEqual([{ title: "title", field: "title" }, { title: "kind2", field: "kind2" }]);
    expect(innerConfig.data).toEqual([{ title: "T1", kind2: "Kind 1" }, { title: "T2", kind2: "k2" }]);
  });

  test("a top-level question with its own valueName reads its raw-row columns by the value name (nested data, survey-library #12233)", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "file", name: "f", valueName: "files" },
        { type: "matrix", name: "m", valueName: "mv", columns: ["c1", "c2"], rows: ["r1"] },
        { type: "checkbox", name: "c", valueName: "cv", choices: ["a", "b"] },
      ]
    });
    const rows = [{ files: [{ name: "a.png", type: "image/png", content: "data:image/png;base64,AA" }], mv: { r1: "c2" }, cv: ["b"] }];
    const table = new TableTest(survey, rows, { splitMultiSelectIntoColumns: true }, []);
    const data = table.getTableData();
    expect(data[0]["f"]).toContain("a.png");
    expect(data[0]["m.r1"]).toBe("c2");
    expect([data[0]["c.a"], data[0]["c.b"]]).toEqual(["", "&#10004;"]);
  });
});

describe("Table View export and remote data with nested data (nested data, survey-library #12233)", () => {
  function exportCells(survey: SurveyModel, rows: Array<any>, type: string): Array<any> {
    const tabulator = new Tabulator(survey, rows, null);
    tabulator["currentDownloadType"] = type;
    const columns = tabulator.getColumns().filter((c: any) => !!c.field);
    const tableData = tabulator.getTableData();
    return tableData.map(rowData => columns.map((c: any) => c.accessorDownload(rowData[c.field], rowData, "download", undefined,
      { getDefinition: () => c }, { getData: () => rowData })));
  }

  test("CSV / XLSX accessors give the same values for nested rows as for flat rows (nested data, survey-library #12233)", () => {
    for(const type of ["csv", "xlsx"]) {
      const flat = exportCells(createSurvey(false), flatRows(), type);
      const nested = exportCells(createSurvey(true), nestedRows(), type);
      expect(nested, type).toEqual(flat);
      const columns = new Tabulator(createSurvey(true), nestedRows(), null).getColumns().filter((c: any) => !!c.field).map((c: any) => c.field);
      expect(nested[0][columns.indexOf("f")], type).toBe("a.png, b.png");
      expect(nested[0][columns.indexOf("pd")], type).toBe("[title | level]\nT1 | High\nT2 | ");
      expect(nested[0][columns.indexOf("mdyn")], type).toBe("[x | y]\nx1 | Yes\nx2 | ");
    }
  });

  test("remote mode sends the inner question's data path as the filter and sort field (nested data, survey-library #12233)", async () => {
    const requests: Array<any> = [];
    const getData = (params: any) => {
      requests.push({ filter: params.filter, sort: params.sort });
      return Promise.resolve({ data: nestedRows(), totalCount: 2 });
    };
    const tabulator = new Tabulator(createSurvey(true), getData as any, null);
    mockTimeout();
    try {
      tabulator.render(document.createElement("div"));
    } finally {
      restoreTimeout();
    }
    const tabulatorTables: any = tabulator.tabulatorTables;
    // reload the page, so the last request carries the current filters and sorters
    const getRequest = () => {
      requests.length = 0;
      return tabulatorTables.setData();
    };
    tabulator.applyColumnFilter("street", "main");
    tabulator.sortByColumn("street", "asc");
    await getRequest();
    const last = requests[requests.length - 1];
    expect(last.filter).toEqual([{ field: "address.street", type: "like", value: "main" }]);
    expect(last.sort).toEqual([{ field: "address.street", direction: "asc" }]);

    // a top-level question and the columns with a suffix keep their names
    tabulatorTables.setFilter([
      { field: "q1", type: "like", value: "x" }, { field: "pets-Comment", type: "like", value: "fish" }, { field: "m.r1", type: "=", value: "c1" },
    ]);
    tabulator.sortByColumn("q1", "desc");
    await getRequest();
    const next = requests[requests.length - 1];
    expect(next.filter.map(f => f.field)).toEqual(["q1", "pets-Comment", "m.r1"]);
    expect(next.sort).toEqual([{ field: "q1", direction: "desc" }]);
  });
});
