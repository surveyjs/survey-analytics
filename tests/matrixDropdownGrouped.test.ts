import { QuestionMatrixDropdownModel } from "survey-core";
import { MatrixDropdownGrouped } from "../src/matrixDropdownGrouped";

let matrix: MatrixDropdownGrouped;
const matrixJson = {
  "type": "matrixdropdown",
  "name": "question1",
  "title": "Please select the top 3 processes that you perceived as most difficult or troublesome.",
  "columns": [
    { "name": "1st Most Difficult" },
    { "name": "2nd Most Difficult" },
    { "name": "3rd Most Difficult" }
  ],
  "choices": [
    "Process 1",
    "Process 2",
    "Process 3",
    "Process 4",
    "Process 5",
    "Process 6"
  ],
  "rows": [
    "Process"
  ]
};
const columns = ["1st Most Difficult", "2nd Most Difficult", "3rd Most Difficult"];

beforeEach(() => {
  let question = new QuestionMatrixDropdownModel("question1");
  question.fromJSON(matrixJson);
  const data = [
    {
      "__sa_series_name": "Process",
      "1st Most Difficult": "Process 2",
      "2nd Most Difficult": "Process 3",
      "3rd Most Difficult": "Process 5"
    },
    {
      "__sa_series_name": "Process",
      "1st Most Difficult": "Process 3",
      "2nd Most Difficult": "Process 1",
      "3rd Most Difficult": "Process 4"
    },
    {
      "__sa_series_name": "Process",
      "1st Most Difficult": "Process 1",
      "2nd Most Difficult": "Process 2",
      "3rd Most Difficult": "Process 3"
    },
  ];
  matrix = new MatrixDropdownGrouped(question, data, {});
});

test("valuesSource method", () => {
  const values = matrix.valuesSource().map((itemValue) => itemValue.text);
  expect(values).toHaveLength(matrixJson.choices.length); // 6 values
  expect(values).toEqual(matrixJson.choices);
});

test("getValues method", () => {
  expect(matrix.getValues()).toEqual(matrixJson.choices.reverse());
});

test("getLabels method", () => {
  expect(matrix.getLabels()).toEqual(matrixJson.choices.reverse());
});

test("getSeriesValues method", () => {
  const seriesValues = matrix.getSeriesValues();
  expect(seriesValues).toHaveLength(columns.length);
  expect(seriesValues).toEqual(columns);
});

test("getSeriesLabels method", () => {
  expect(matrix.getSeriesLabels()).toEqual(columns);
});

test("name and dataNames property", () => {
  expect(matrix.name).toEqual("question1");
  expect(matrix.dataNames).toEqual(columns);
});

test("getCalculatedValues method", async () => {
  expect(await matrix.getCalculatedValues()).toEqual([
    [0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1, 1],
    [0, 1, 1, 1, 0, 0],
  ]);
});

test("check getPercentages method", () => {
  expect(matrix.getPercentages([
    [0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1, 1],
    [0, 1, 1, 1, 0, 0],
  ])).toEqual([
    [0, 0, 0, 33, 50, 50],
    [0, 0, 0, 33, 50, 50],
    [0, 100, 100, 33, 0, 0],
  ]);
});

test("SupportMissingAnswers", () => {
  expect(matrix["isSupportMissingAnswers"]()).toBeFalsy();
  expect(matrix.showMissingAnswers).toBeFalsy();
});
