import { QuestionBooleanModel, SurveyModel } from "survey-core";
import { BooleanPlotly } from "../src/plotly/boolean";

let boolean: BooleanPlotly;

const values = [ true, false ];
const labels = [ "Yes", "No" ];

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
  boolean = new BooleanPlotly(question, data, {});
});

test("getValues method", () => {
  expect(boolean.getValues()).toEqual(values);
});

test("getLabels method", () => {
  expect(boolean.getLabels()).toEqual(labels);
});

test("getData method", () => {
  expect(boolean.getData()).toEqual([[3, 1]]);
});

test("getData localized", () => {
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
  var firstResult = { "bool":true, "organization_type":"Hobbyist" };
  var secondResult = { "bool":false, "organization_type":"In-house" };
  var test = [firstResult, secondResult];
  var normalizedData = test.map(function (item) {
    survey.getAllQuestions().forEach(function (q) {
        if (item[q.name] === undefined) {
          item[q.name] = "";
        }
    });
    return item;
  });
  boolean = new BooleanPlotly(survey.getQuestionByName("bool"), normalizedData, {});
  expect(boolean.getData()).toEqual([[1, 1]]);
});
