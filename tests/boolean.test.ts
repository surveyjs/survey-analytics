import { QuestionBooleanModel, SurveyModel } from "survey-core";
import { BooleanModel } from "../src/boolean";

let boolean: BooleanModel;

const values = [true, false];
const labels = ["Yes", "No"];

beforeEach(() => {
  var question = new QuestionBooleanModel("q1");
  var data = [
    {
      q1: true
    },
    {
      q1: true
    },
    {
      q1: false
    },
    {
      q1: true
    }
  ];
  boolean = new BooleanModel(question, data, {});
});

test("getValues method", () => {
  expect(boolean.getValues()).toEqual(values);
});

test("getLabels method", () => {
  expect(boolean.getLabels()).toEqual(labels);
});

test("getCalculatedValues method", () => {
  expect(boolean.getCalculatedValues()).toEqual([[3, 1]]);
});

test("getCalculatedValues localized", () => {
  var survey = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "boolean",
            "name": "bool",
            "title": "Are you 21 or older?",
            "label": "Are you 21 or older?",
            "labelTrue": "Oui",
            "labelFalse": "Non"
          }
        ]
      }
    ]
  });
  survey.locale = "fr";
  var firstResult = { "bool": true, "organization_type": "Hobbyist" };
  var secondResult = { "bool": false, "organization_type": "In-house" };
  var test = [firstResult, secondResult];
  boolean = new BooleanModel(survey.getQuestionByName("bool"), test);
  expect(boolean.getCalculatedValues()).toEqual([[1, 1]]);
});

test("hasHeader and correct answer text", () => {
  var survey = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            type: "boolean",
            name: "bool",
            valueName: "boolValue",
            correctAnswer: true,
            labelTrue: "Label True",
            labelFalse: "Label False",
          },
        ]
      }
    ]
  });
  boolean = new BooleanModel(survey.getQuestionByName("bool"), [], { showCorrectAnswers: true });
  expect(boolean.hasHeader).toBeTruthy();
  expect(boolean["getCorrectAnswerText"]()).toEqual("Label True");
});
