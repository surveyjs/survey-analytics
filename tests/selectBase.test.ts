import { SurveyModel, Question, QuestionDropdownModel } from "survey-core";
import { SelectBase } from "../src/selectBase";

let selectBase: SelectBase;
let choices = ["father", "mother", "brother", "sister", "son", "dauhter"];

beforeEach(() => {
  var question = new QuestionDropdownModel("q1");
  question.choices = choices;
  var data = [
    {
      q1: "father"
    },
    {
      q1: "father"
    },
    {
      q1: "mother"
    },
    {
      q1: "sister"
    }
  ];
  selectBase = new SelectBase(null, question, data, {});
});

test("valuesSource method", () => {
  expect(selectBase.valuesSource().map(itemValue => itemValue.text)).toEqual(
    choices
  );
});

test("getValues method", () => {
  expect(selectBase.getValues()).toEqual(choices);
});

test("getLabels method", () => {
  expect(selectBase.getLabels()).toEqual(choices);
});
