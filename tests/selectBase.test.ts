import { QuestionDropdownModel, ItemValue } from "survey-core";
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
  expect(toolbarContainer.children.length).toBe(2);
  selectBase["chartTypes"] = ["one"];
  toolbarContainer = document.createElement("div");
  selectBase["createToolbarItems"](toolbarContainer);
  expect(toolbarContainer.children.length).toBe(1);
});

test("setSelection", () => {
  let lastValue = undefined;
  let lastText = undefined;
  selectBase.onDataItemSelected = (val, text) => {
    lastValue = val;
    lastText = text;
  };

  selectBase.setSelection(new ItemValue(1, "One"));
  expect(lastValue).toEqual(1);
  expect(lastText).toEqual("One");

  selectBase.setSelection(undefined);
  expect(lastValue).toEqual(undefined);
  expect(lastText).toEqual("");

  selectBase.setSelection(new ItemValue(false, "False"));
  expect(lastValue).toEqual(false);
  expect(lastText).toEqual("False");

  selectBase.setSelection(new ItemValue(true, "True"));
  expect(lastValue).toEqual(true);
  expect(lastText).toEqual("True");
});

test("set answersOrder triggers renderContent and update", () => {
  selectBase.render(document.createElement("div"));
  let updateCallCount = 0;
  let renderCallCount = 0;
  selectBase.onUpdate = () => {
    updateCallCount++;
  };
  selectBase["renderContent"] = () => {
    renderCallCount++;
  };
  selectBase.answersOrder = "asc";
  expect(updateCallCount).toEqual(1);
  expect(renderCallCount).toEqual(1);
});

test("check getPercentages method", () => {
  expect(selectBase.getPercentages()).toEqual([[50, 25, 0, 25, 0, 0]]);
});

test("setShowPercentages triggers renderContent and update", () => {
  selectBase.render(document.createElement("div"));
  let updateCallCount = 0;
  let renderCallCount = 0;
  selectBase.onUpdate = () => {
    updateCallCount++;
  };
  selectBase["renderContent"] = () => {
    renderCallCount++;
  };
  selectBase.showPercentages = true;
  expect(updateCallCount).toEqual(1);
  expect(renderCallCount).toEqual(1);
});

test("change visible choices triggers dataProvider reset", () => {
  var resetCallCount = 0;
  var oldResetFunc = (<any>selectBase).dataProvider.reset;
  (<any>selectBase).dataProvider.reset = () => {
    resetCallCount++;
  };
  selectBase.question.choices = ["add1"];
  expect(resetCallCount).toEqual(1);
  (<any>selectBase).dataProvider.reset = oldResetFunc;
  selectBase.question.choices = choices;
});

test("check that getSelectedItemByText take into account other item", () => {
  selectBase.question.hasOther = true;
  selectBase.question.otherText = "Other";
  expect(selectBase.getSelectedItemByText("Other")).toEqual(
    selectBase.question.otherItem
  );
});

test("getAnswersData method", () => {
  expect(selectBase.getAnswersData()).toEqual({"colors": ["#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198"], "datasets": [[2, 1, 0, 1, 0, 0]], "labels": ["father_text", "mother_text", "brother_text", "sister_text", "son_text", "daughter_text"], "texts": [[2, 1, 0, 1, 0, 0]]});
});

test("hide empty items", () => {
  expect(selectBase.hideEmptyAnswers).toBe(false);
  expect(selectBase.getAnswersData()).toEqual({"colors": ["#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198"], "datasets": [[2, 1, 0, 1, 0, 0]], "labels": ["father_text", "mother_text", "brother_text", "sister_text", "son_text", "daughter_text"], "texts": [[2, 1, 0, 1, 0, 0]]});
  selectBase.hideEmptyAnswers = true;
  expect(selectBase.getAnswersData()).toEqual({"colors": ["#86e1fb", "#3999fb", "#1eb496"], "datasets": [[2, 1, 1]], "labels": ["father_text", "mother_text", "sister_text"], "texts": [[2, 1, 1]]});
});

test("change answers order", () => {
  selectBase.hideEmptyAnswers = true;
  expect(selectBase.answersOrder).toBe("default");
  expect(selectBase.getAnswersData()).toEqual({"colors": ["#86e1fb", "#3999fb", "#1eb496"], "datasets": [[2, 1, 1]], "labels": ["father_text", "mother_text", "sister_text"], "texts": [[2, 1, 1]]});
  selectBase.answersOrder = "asc";
  expect(selectBase.getAnswersData()).toEqual({"colors": ["#86e1fb", "#3999fb", "#1eb496"], "datasets": [[2, 1, 1]], "labels": ["father_text", "mother_text", "sister_text"], "texts": [[2, 1, 1]]});
  selectBase.answersOrder = "desc";
  expect(selectBase.getAnswersData()).toEqual({"colors": ["#3999fb", "#1eb496", "#86e1fb"], "datasets": [[1, 1, 2]], "labels": ["mother_text", "sister_text", "father_text"], "texts": [[1, 1, 2]]});
});
