import { SurveyModel, Question, QuestionDropdownModel } from "survey-core";
import { SelectBase } from "../src/selectBase";

let selectBase: SelectBase;
let choices = [
  { value: "father", text: "father_text" },
  { value: "mother", text: "mother_text" },
  { value: "brother", text: "brother_text" },
  { value: "sister", text: "sister_text" },
  { value: "son", text: "son_text" },
  { value: "daughter", text: "daughter_text" },
];

beforeEach(() => {
  var question = new QuestionDropdownModel("q1");
  question.choices = choices;
  var data = [
    {
      q1: "father",
    },
    {
      q1: "father",
    },
    {
      q1: "mother",
    },
    {
      q1: "sister",
    },
  ];
  selectBase = new SelectBase(question, data, {});
});

test("valuesSource method", () => {
  expect(selectBase.valuesSource().map((itemValue) => itemValue.text)).toEqual(
    choices.map((choice) => choice.text)
  );
});

test("getValues method", () => {
  expect(selectBase.getValues()).toEqual(choices.map((choice) => choice.value));
});

test("getLabels method", () => {
  expect(selectBase.getLabels()).toEqual(choices.map((choice) => choice.text));
  selectBase["options"].useValuesAsLabels = true;
  expect(selectBase.getLabels()).toEqual(choices.map((choice) => choice.value));
  selectBase["options"].useValuesAsLabels = false;
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
