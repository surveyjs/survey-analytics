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

test("getData method", () => {
  expect(selectBase.getData()).toEqual([[2, 1, 0, 1, 0, 0]]);
});

test("createToolbarItems", () => {
  selectBase["chartTypes"] = ["one", "two"];
  var toolbarContainer = document.createElement("div");
  selectBase["createToolbarItems"](toolbarContainer);
  expect(toolbarContainer.children.length).toBe(1);
  selectBase["chartTypes"] = ["one"];
  toolbarContainer = document.createElement("div");
  selectBase["createToolbarItems"](toolbarContainer);
  expect(toolbarContainer.children.length).toBe(0);
});