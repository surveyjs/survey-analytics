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

test("getCalculatedValues method", async () => {
  expect(await matrix.getCalculatedValues()).toEqual([
    [0, 0, 0, 0, 2, 1],
    [0, 0, 0, 1, 1, 1],
  ]);
});

test("check getPercentages method", () => {
  expect(matrix.getPercentages([
    [1, 1],
    [2, 1],
    [0, 1],
    [0, 0],
    [0, 0],
    [0, 0],
  ].reverse())).toEqual([
    [33, 33],
    [67, 33],
    [0, 33],
    [0, 0],
    [0, 0],
    [0, 0],
  ].reverse());
});

test("getPercentages percentagePrecision option", async () => {
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
  let datasets = (await matrixVizualizer.getAnswersData()).datasets;

  let percentages = matrixVizualizer.getPercentages(datasets);
  let result = 0;

  for (let index = 0; index < percentages.length; index++) {
    result += percentages[index][0];
  }

  expect(result).toEqual(101);

  matrixVizualizer = new Matrix(matrix, data, { percentagePrecision: 2 });
  datasets = (await matrixVizualizer.getAnswersData()).datasets;

  percentages = matrixVizualizer.getPercentages(datasets);
  result = 0;

  for (let index = 0; index < percentages.length; index++) {
    result += percentages[index][0];
  }

  expect(result).toEqual(100.01);
});

test("hide empty answers", async () => {
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
  expect(await matrix.getAnswersData()).toEqual({
    colors: ["#e50a3e", "#19b394"],
    datasets: [
      [2, 0],
      [0, 2],
    ].reverse(),
    labels: ["Monday", "Tuesday"],
    seriesLabels: ["Morning", "Afternoon"].reverse(),
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
  expect(await matrix.getAnswersData()).toEqual({
    colors: ["#e50a3e", "#19b394"],
    datasets: [[1, 1]],
    labels: ["Monday", "Tuesday"],
    seriesLabels: ["Afternoon"],
    texts: [[1, 1]],
  });
});

test("SupportMissingAnswers", () => {
  expect(matrix["isSupportMissingAnswers"]()).toBeFalsy();
  expect(matrix.showMissingAnswers).toBeFalsy();
});

test("convertFromExternalData", async () => {
  const externalCalculatedData = {
    "Lizol": {
      "Excellent": 1,
      "Very Good": 2,
      "Good": 0,
      "Fair": 0,
      "Neither Fair Nor Poor": 0,
      "Poor": 0,
    },
    "Harpic": {
      "Excellent": 1,
      "Very Good": 1,
      "Good": 1,
    }
  };
  const calculatedData = (matrix as any).getCalculatedValuesCore();
  expect(calculatedData).toEqual([
    [0, 0, 0, 0, 2, 1],
    [0, 0, 0, 1, 1, 1],
  ]);
  expect(matrix.convertFromExternalData(externalCalculatedData)).toStrictEqual(calculatedData);
});
