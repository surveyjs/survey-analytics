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
  expect(values).toEqual(matrixJson.choices);
});

test("getValues method", () => {
  expect(matrix.getValues()).toEqual(matrixJson.choices.reverse());
});

test("getLabels method", () => {
  expect(matrix.getLabels()).toEqual(matrixJson.choices.reverse());
});

test("getSeriesValues method", () => {
  expect(matrix.getSeriesValues()).toEqual(columns);
});

test("getSeriesLabels method", () => {
  expect(matrix.getSeriesLabels()).toEqual(columns);
});

test("name property", () => {
  expect(matrix.name).toEqual(columns);
});

test("getCalculatedValues method", () => {
  expect(matrix.getCalculatedValues()).toEqual([
    [1, 1, 0],
    [1, 1, 0],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 0],
  ].reverse());
});

test("check getPercentages method", () => {
  expect(matrix.getPercentages()).toEqual([
    [33, 33, 0],
    [33, 33, 0],
    [33, 33, 33],
    [0, 0, 33],
    [0, 0, 33],
    [0, 0, 0],
  ].reverse());
});

test("SupportMissingAnswers", () => {
  expect(matrix["isSupportMissingAnswers"]()).toBeFalsy();
  expect(matrix.showMissingAnswers).toBeFalsy();
});
