import { QuestionMatrixModel } from "survey-core";
import { Matrix } from "../src/matrix";

let matrix: Matrix;
const matrixJson = {
  type: 'matrix',
  name: 'question1',
  title: 'What is your perception of these brands?',
  columns: [
      'Excellent',
      'Very Good',
      'Good',
      'Fair',
      'Neither Fair Nor Poor',
      'Poor',
  ],
  rows: ['Lizol', 'Harpic'],
};

beforeEach(() => {
  let question = new QuestionMatrixModel("question1");
  question.fromJSON(matrixJson);
  const data = [
    {
        question1: { Lizol: 'Excellent', Harpic: 'Excellent' },
    },
    {
        question1: { Lizol: 'Very Good', Harpic: 'Very Good' },
    },
    {
        question1: { Lizol: 'Very Good', Harpic: 'Good' },
    }
  ];
  matrix = new Matrix(question, data, {});
});

test("valuesSource method", () => {
  expect(matrix.valuesSource().map(itemValue => itemValue.text)).toEqual(
    matrixJson.columns
  );
});

test("getValues method", () => {
  expect(matrix.getValues()).toEqual(matrixJson.columns);
});

test("getLabels method", () => {
  expect(matrix.getLabels()).toEqual(matrixJson.rows);
});

test("getSeriesNames method", () => {
  expect(matrix.getSeriesNames()).toEqual(matrixJson.rows);
});

test("getData method", () => {
  expect(matrix.getData()).toEqual([[1, 1], [2, 1], [0, 1], [0, 0], [0, 0], [0, 0]]);
});
