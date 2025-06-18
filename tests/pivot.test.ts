import { SurveyModel } from "survey-core";
import { PivotModel } from "../src/pivot";

var json = {
  "elements": [
    {
      "type": "radiogroup",
      "name": "question1",
      "title": "Sex",
      "choices": [
        "female",
        "male"
      ]
    },
    {
      "type": "dropdown",
      "name": "question2",
      "title": "Item kind",
      "choices": [
        "Item 1",
        "Item 2",
        "Item 3"
      ],
    },
    {
      "type": "text",
      "inputType": "number",
      "name": "question3",
      "title": "Bill amount",
    }
  ]
};
var data = [
  { question1: "male", question2: "Item 1", question3: 100 },
  { question1: "male", question2: "Item 1", question3: 200 },
  { question1: "male", question2: "Item 2", question3: 300 },
  { question1: "male", question2: "Item 3", question3: 400 },
  { question1: "female", question2: "Item 2", question3: 500 },
  { question1: "female", question2: "Item 2", question3: 600 },
  { question1: "female", question2: "Item 2", question3: 100 },
  { question1: "female", question2: "Item 3", question3: 200 },
  { question1: "female", question2: "Item 3", question3: 300 },
  { question1: "female", question2: "Item 3", question3: 400 },
  { question1: "female", question2: "Item 3", question3: 150 },
  { question1: "female", question2: "Item 1", question3: 250 },
];

var survey = new SurveyModel(json);

test("default settings", async () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);

  expect(pivot["isSupportMissingAnswers"]()).toBeFalsy();
  expect(pivot["isSupportAnswersOrder"]()).toBeTruthy();

  const values = pivot.getValues();
  const labels = pivot.getLabels();
  const seriesValues = pivot.getSeriesValues();
  const seriesLabels = pivot.getSeriesLabels();

  expect(pivot.axisXQuestionName).toBe("question1");
  expect(pivot.axisYQuestionName).toBe(undefined);
  expect(values).toStrictEqual(["female", "male"]);
  expect(labels).toStrictEqual(["female", "male"]);
  expect(seriesValues).toStrictEqual([]);
  expect(seriesLabels).toStrictEqual([]);

  expect(await pivot.getCalculatedValues()).toStrictEqual([[8, 4]]);
});

test("getSeriesValues and getSeriesLabels + values and labels", async () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);

  let values = pivot.getValues();
  let labels = pivot.getLabels();
  let seriesValues = pivot.getSeriesValues();
  let seriesLabels = pivot.getSeriesLabels();

  expect(pivot.axisXQuestionName).toBe("question1");
  expect(pivot.axisYQuestionName).toBe(undefined);
  expect(values).toStrictEqual(["female", "male"]);
  expect(labels).toStrictEqual(["female", "male"]);
  expect(seriesValues).toStrictEqual([]);
  expect(seriesLabels).toStrictEqual([]);

  pivot.setAxisQuestions("question2", "question1");

  values = pivot.getValues();
  labels = pivot.getLabels();
  seriesValues = pivot.getSeriesValues();
  seriesLabels = pivot.getSeriesLabels();

  expect(pivot.axisXQuestionName).toBe("question2");
  expect(pivot.axisYQuestionName).toBe("question1");
  expect(values).toStrictEqual(["Item 1", "Item 2", "Item 3"]);
  expect(labels).toStrictEqual(["Item 1", "Item 2", "Item 3"]);
  expect(seriesValues).toStrictEqual(["female", "male"]);
  expect(seriesLabels).toStrictEqual(["female", "male"]);
  expect(pivot.getSeriesValueIndexes()).toStrictEqual({
    "question1_female": 0,
    "question1_male": 1,
  });
});

test("getCalculatedValues", async () => {
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  pivot.setAxisQuestions("question1", "question2");
  let values = pivot.getValues();
  let seriesValues = pivot.getSeriesValues();
  expect(values).toStrictEqual(["female", "male"]);
  expect(seriesValues).toStrictEqual(["Item 1", "Item 2", "Item 3"]);
  expect(await pivot.getCalculatedValues()).toStrictEqual([[1, 2], [3, 1], [4, 1]]);

  pivot.setAxisQuestions("question2", "question1");
  values = pivot.getValues();
  seriesValues = pivot.getSeriesValues();
  expect(values).toStrictEqual(["Item 1", "Item 2", "Item 3"]);
  expect(seriesValues).toStrictEqual(["female", "male"]);
  expect(await pivot.getCalculatedValues()).toStrictEqual([[1, 3, 4], [2, 1, 1]]);

  pivot.setAxisQuestions("question1", "question3");
  values = pivot.getValues();
  seriesValues = pivot.getSeriesValues();
  expect(values).toStrictEqual(["female", "male"]);
  expect(seriesValues).toStrictEqual(["question3"]);
  expect(await pivot.getCalculatedValues()).toStrictEqual([[2500, 1000]]);

  pivot.setAxisQuestions("question2", "question3");
  values = pivot.getValues();
  seriesValues = pivot.getSeriesValues();
  expect(values).toStrictEqual(["Item 1", "Item 2", "Item 3"]);
  expect(seriesValues).toStrictEqual(["question3"]);
  expect(await pivot.getCalculatedValues()).toStrictEqual([[550, 1500, 1450]]);

  pivot.setAxisQuestions("question3", "question1");
  values = pivot.getValues();
  seriesValues = pivot.getSeriesValues();
  expect(values).toStrictEqual([100, 150, 200, 250, 300, 350, 400, 450, 500, 550]);
  expect(seriesValues).toStrictEqual(["female", "male"]);
  expect(await pivot.getCalculatedValues()).toStrictEqual([[1, 1, 1, 1, 1, 0, 1, 0, 1, 1], [1, 0, 1, 0, 1, 0, 1, 0, 0, 0]]);
});