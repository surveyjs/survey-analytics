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
  expect(matrix.getValues()).toEqual(matrixJson.columns.reverse());
});

test("getLabels method", () => {
  expect(matrix.getLabels()).toEqual(matrixJson.columns.reverse());
});

test("getSeriesValues method", () => {
  expect(matrix.getSeriesValues()).toEqual(matrixJson.rows);
});

test("getSeriesLabels method", () => {
  expect(matrix.getSeriesLabels()).toEqual(matrixJson.rows);
});

test("getCalculatedValues method", () => {
  expect(matrix.getCalculatedValues()).toEqual([
    [1, 1],
    [2, 1],
    [0, 1],
    [0, 0],
    [0, 0],
    [0, 0],
  ].reverse());
});

test("check getPercentages method", () => {
  expect(matrix.getPercentages()).toEqual([
    [33, 33],
    [67, 33],
    [0, 33],
    [0, 0],
    [0, 0],
    [0, 0],
  ].reverse());
});

test("getPercentages percentagePrecision option", () => {
  const json = {
    "type": "matrix",
    "name": "m1",
    "columns": ["Strongly Agree", "Agree", "Somewhat Agree", "Disagree", "Strongly Disagree"],
    "rows": ["Do you like tomatos?", "Do you like cucumbers?"]
  };

  const data1 = {
    m1: {
      "Do you like tomatos?": "Strongly Agree",
      "Do you like cucumbers?": "Disagree",
    }
  };
  const data2 = {
    m1: {
      "Do you like tomatos?": "Strongly Agree",
      "Do you like cucumbers?": "Somewhat Agree",
    }
  };
  const data3 = {
    m1: {
      "Do you like tomatos?": "Agree",
      "Do you like cucumbers?": "Agree",
    }
  };
  const data4 = {
    m1: {
      "Do you like tomatos?": "Somewhat Agree",
      "Do you like cucumbers?": "Disagree",
    }
  };
  const data5 = {
    m1: {
      "Do you like tomatos?": "Disagree",
      "Do you like cucumbers?": "Somewhat Agree",
    }
  };
  const data6 = {
    m1: {
      "Do you like tomatos?": "Strongly Disagree",
      "Do you like cucumbers?": "Agree",
    }
  };

  const data = [data1, data2, data3, data4, data5, data6];

  const matrix = new QuestionMatrixModel("m1");
  matrix.fromJSON(json);

  let matrixVizualizer = new Matrix(matrix, data, {});

  let percentages = matrixVizualizer.getPercentages();
  let result = 0;

  for (let index = 0; index < percentages.length; index++) {
    result += percentages[index][0];
  }

  expect(result).toEqual(101);

  matrixVizualizer = new Matrix(matrix, data, { percentagePrecision: 2 });

  percentages = matrixVizualizer.getPercentages();
  result = 0;

  for (let index = 0; index < percentages.length; index++) {
    result += percentages[index][0];
  }

  expect(result).toEqual(100.01);
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
    ].reverse(),
    labels: ["Morning", "Afternoon"].reverse(),
    seriesLabels: ["Monday", "Tuesday"],
    texts: [
      [2, 0],
      [0, 2],
    ].reverse(),
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
    colors: ["#86e1fb"],
    datasets: [[1, 1]],
    labels: ["Afternoon"],
    seriesLabels: ["Monday", "Tuesday"],
    texts: [[1, 1]],
  });
});

test("SupportMissingAnswers", () => {
  expect(matrix["isSupportMissingAnswers"]()).toBeFalsy();
  expect(matrix.showMissingAnswers).toBeFalsy();
});
