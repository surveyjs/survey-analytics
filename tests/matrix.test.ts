import { QuestionMatrixModel } from "survey-core";
import { Matrix } from "../src/matrix";

let matrix: Matrix;
const matrixJson = {
  type: "matrix",
  name: "question1",
  title: "What is your perception of these brands?",
  columns: [
    "Excellent",
    "Very Good",
    "Good",
    "Fair",
    "Neither Fair Nor Poor",
    "Poor",
  ],
  rows: ["Lizol", "Harpic"],
};

beforeEach(() => {
  let question = new QuestionMatrixModel("question1");
  question.fromJSON(matrixJson);
  const data = [
    {
      question1: { Lizol: "Excellent", Harpic: "Excellent" },
    },
    {
      question1: { Lizol: "Very Good", Harpic: "Very Good" },
    },
    {
      question1: { Lizol: "Very Good", Harpic: "Good" },
    },
  ];
  matrix = new Matrix(question, data, {});
});

test("valuesSource method", () => {
  expect(matrix.valuesSource().map((itemValue) => itemValue.text)).toEqual(
    matrixJson.columns
  );
});

test("getValues method", () => {
  expect(matrix.getValues()).toEqual(matrixJson.columns);
});

test("getLabels method", () => {
  expect(matrix.getLabels()).toEqual(matrixJson.columns);
});

test("getSeriesValues method", () => {
  expect(matrix.getSeriesValues()).toEqual(matrixJson.rows);
});

test("getSeriesLabels method", () => {
  expect(matrix.getSeriesLabels()).toEqual(matrixJson.rows);
});

test("getData method", () => {
  expect(matrix.getData()).toEqual([
    [1, 1],
    [2, 1],
    [0, 1],
    [0, 0],
    [0, 0],
    [0, 0],
  ]);
});

test("check getPercentages method", () => {
  expect(matrix.getPercentages()).toEqual([
    [33, 33],
    [67, 33],
    [0, 33],
    [0, 0],
    [0, 0],
    [0, 0],
  ]);
});

test("hide empty answers", () => {
  const question = new QuestionMatrixModel("q1");
  question.columns = ["Morning", "Afternoon"];
  question.rows = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  var data: any = [
    {
      q1: {
        Monday: "Morning",
        Tuesday: "Afternoon",
      },
    },
    {
      q1: {
        Monday: "Morning",
        Tuesday: "Afternoon",
      },
    },
  ];
  var matrix = new Matrix(question, data);
  matrix.hideEmptyAnswers = true;
  expect(matrix.getAnswersData()).toEqual({
    colors: ["#86e1fb", "#3999fb"],
    datasets: [
      [2, 0],
      [0, 2],
    ],
    labels: ["Morning", "Afternoon"],
    seriesLabels: ["Monday", "Tuesday"],
    texts: [
      [2, 0],
      [0, 2],
    ],
  });
  data = [
    {
      q1: {
        Monday: "Afternoon",
      },
    },
    {
      q1: {
        Tuesday: "Afternoon",
      },
    },
  ];
  var matrix = new Matrix(question, data);
  matrix.hideEmptyAnswers = true;
  expect(matrix.getAnswersData()).toEqual({
    colors: ["#3999fb"],
    datasets: [[1, 1]],
    labels: ["Afternoon"],
    seriesLabels: ["Monday", "Tuesday"],
    texts: [[1, 1]],
  });
});
