import { QuestionDropdownModel, ItemValue, QuestionImagePickerModel, SurveyModel } from "survey-core";
import { SelectBase, hideEmptyAnswersInData } from "../src/selectBase";

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
  question.choices = [].concat(choices);
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
    {

    }
  ];
  selectBase = new SelectBase(question, data, {});
});

test("valuesSource method", () => {
  expect(selectBase.valuesSource().map((itemValue) => itemValue.text)).toEqual(
    choices.map((choice) => choice.text)
  );
});

test("getValues method", () => {
  expect(selectBase.getValues()).toEqual([].concat(choices).reverse().map((choice) => choice.value));
});

test("getLabels method", () => {
  expect(selectBase.getLabels()).toEqual([].concat(choices).reverse().map((choice) => choice.text));
  selectBase["options"].useValuesAsLabels = true;
  expect(selectBase.getLabels()).toEqual([].concat(choices).reverse().map((choice) => choice.value));
  selectBase["options"].useValuesAsLabels = false;
});

test("getCalculatedValues method", () => {
  expect(selectBase.getCalculatedValues()).toEqual([[2, 1, 0, 1, 0, 0].reverse()]);
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
  expect(selectBase.getPercentages()).toEqual([[50, 25, 0, 25, 0, 0].reverse()]);
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
  selectBase.question["choices"] = ["add1"];
  expect(resetCallCount).toEqual(1);
  (<any>selectBase).dataProvider.reset = oldResetFunc;
  selectBase.question["choices"] = choices;
});

test("check that getSelectedItemByText take into account other item", () => {
  selectBase.question.hasOther = true;
  selectBase.question["otherText"] = "Other";
  expect(selectBase.getSelectedItemByText("Other")).toEqual(
    selectBase.question["otherItem"]
  );
});

test("getAnswersData method", () => {
  expect(selectBase.getAnswersData()).toEqual({ "colors": ["#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198"], "datasets": [[2, 1, 0, 1, 0, 0].reverse()], "labels": ["father_text", "mother_text", "brother_text", "sister_text", "son_text", "daughter_text"].reverse(), "seriesLabels": [], "texts": [[2, 1, 0, 1, 0, 0].reverse()] });
});

test("hide empty items", () => {
  expect(selectBase.hideEmptyAnswers).toBe(false);
  expect(selectBase.getAnswersData()).toEqual({ "colors": ["#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198", "#86e1fb", "#3999fb", "#ff6771", "#1eb496", "#ffc152", "#aba1ff", "#7d8da5", "#4ec46c", "#cf37a6", "#4e6198"], "datasets": [[2, 1, 0, 1, 0, 0].reverse()], "labels": ["father_text", "mother_text", "brother_text", "sister_text", "son_text", "daughter_text"].reverse(), "seriesLabels": [], "texts": [[2, 1, 0, 1, 0, 0].reverse()] },);
  selectBase.hideEmptyAnswers = true;
  expect(selectBase.getAnswersData()).toEqual({ "colors": ["#ff6771", "#ffc152", "#aba1ff"], "datasets": [[2, 1, 1].reverse()], "labels": ["father_text", "mother_text", "sister_text"].reverse(), "texts": [[2, 1, 1].reverse()], "seriesLabels": [] });
});

test("change answers order", () => {
  selectBase.hideEmptyAnswers = true;
  expect(selectBase.answersOrder).toBe("default");
  expect(selectBase.getAnswersData()).toEqual({ "colors": ["#ff6771", "#ffc152", "#aba1ff"], "datasets": [[2, 1, 1].reverse()], "labels": ["father_text", "mother_text", "sister_text"].reverse(), "texts": [[2, 1, 1].reverse()], "seriesLabels": [] });
  selectBase.answersOrder = "asc";
  expect(selectBase.getAnswersData()).toEqual({ "colors": ["#aba1ff", "#ff6771", "#ffc152"], "datasets": [[2, 1, 1]], "labels": ["father_text", "sister_text", "mother_text"], "seriesLabels": [], "texts": [[2, 1, 1]] });
  selectBase.answersOrder = "desc";
  expect(selectBase.getAnswersData()).toEqual({ "colors": ["#ff6771", "#ffc152", "#aba1ff"], "datasets": [[1, 1, 2]], "labels": ["sister_text", "mother_text", "father_text"], "seriesLabels": [], "texts": [[1, 1, 2]] });
});

test("check allowSelection option", () => {
  const question = new QuestionDropdownModel("q1");
  let visualizer = new SelectBase(question, [], {});
  expect(visualizer.supportSelection).toEqual(true);
  visualizer = new SelectBase(question, [], { allowSelection: true });
  expect(visualizer.supportSelection).toEqual(true);
  visualizer = new SelectBase(question, [], { allowSelection: false });
  expect(visualizer.supportSelection).toEqual(false);
});

test("transpose method", () => {
  const data = [
    [1, 1, 10],
    [1, 1, 11],
    [1, 0, 12],
    [0, 0, 13],
    [0, 0, 14],
    [0, 0, 15],
  ];
  const transposed = selectBase["transpose"](data);
  expect(transposed).toEqual([[1, 1, 1, 0, 0, 0], [1, 1, 0, 0, 0, 0], [10, 11, 12, 13, 14, 15]]);
});

test("imagePicker getValues order", () => {
  const imagePicker = new QuestionImagePickerModel("q1");
  imagePicker.choices = [
    {
      "value": "lion",
      "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
    }, {
      "value": "giraffe",
      "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
    }, {
      "value": "panda",
      "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
    }, {
      "value": "camel",
      "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
    }
  ];
  const visualizer = new SelectBase(imagePicker, [], {});

  expect(visualizer.getValues()).toEqual([
    "lion",
    "giraffe",
    "panda",
    "camel",
  ].reverse());
});

test("getPercentages method", () => {
  selectBase.updateData([
    { q1: "father", },
    { q1: "father", },
    { q1: "father", },
    { q1: "mother", },
    { q1: "mother", },
    { q1: "sister", },
  ]);
  expect(selectBase.getPercentages()).toEqual([[50, 33.33, 0, 16.67, 0, 0].reverse()]);
});

test("showMissingAnswers", () => {
  expect(selectBase["isSupportMissingAnswers"]()).toBeTruthy();
  expect(selectBase.showMissingAnswers).toBeFalsy();
  expect(selectBase.getValues()).toEqual(["father", "mother", "brother", "sister", "son", "daughter"].reverse());
  expect(selectBase.getLabels()).toEqual(["father_text", "mother_text", "brother_text", "sister_text", "son_text", "daughter_text"].reverse());
  expect(selectBase.getCalculatedValues()).toEqual([[2, 1, 0, 1, 0, 0].reverse()]);
  selectBase.showMissingAnswers = true;
  expect(selectBase.getValues()).toEqual([undefined, "father", "mother", "brother", "sister", "son", "daughter"].reverse());
  expect(selectBase.getLabels()).toEqual(["Missing answers", "father_text", "mother_text", "brother_text", "sister_text", "son_text", "daughter_text"].reverse());
  expect(selectBase.getCalculatedValues()).toEqual([[1, 2, 1, 0, 1, 0, 0].reverse()]);
});

test("valueName used for getCalculatedValues https://surveyjs.answerdesk.io/internal/ticket/details/T9071", () => {
  var question = new QuestionDropdownModel("q1");
  question.choices = choices;
  question.valueName = "q1value";
  var data = [
    {
      q1value: "father",
    },
    {
      q1value: "father",
    },
    {
      q1value: "mother",
    },
    {
      q1value: "sister",
    },
    {

    }
  ];
  selectBase = new SelectBase(question, data, {});
  expect(selectBase.getCalculatedValues()).toEqual([[2, 1, 0, 1, 0, 0].reverse()]);
});

test("hasHeader and correct answer text", () => {
  var survey = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            type: "radiogroup",
            name: "organization_type",
            title:
              "Which of the following best describes you or your organization?",
            hasOther: true,
            choices: [
              {
                value: "ISV",
                text: "ISV (building commercial/shrink wrapped software)",
              },
              {
                value: "Consulting",
                text:
                  "Software consulting firm (provide development services to other organizations)",
              },
              {
                value: "Custom",
                text: "Custom software development (as a freelancer/contractor)",
              },
              { value: "In-house", text: "In-house software development" },
              {
                value: "Hobbyist",
                text: "Hobbyist (develop apps for personal use)",
              },
            ],
            colCount: 2,
            correctAnswer: "Hobbyist",
          },
        ]
      }
    ]
  });
  selectBase = new SelectBase(survey.getQuestionByName("organization_type"), [], { showCorrectAnswers: true });
  expect(selectBase.hasHeader).toBeTruthy();
  expect(selectBase["getCorrectAnswerText"]()).toEqual("Hobbyist (develop apps for personal use)");
});

test("has none item", () => {
  var survey = new SurveyModel({
    pages: [
      {
        elements: [
          {
            type: "checkbox",
            name: "q1",
            choices: ["Item 1", "Item 2", "Item 3"],
            noneText: "None Item",
            showNoneItem: true
          },
        ]
      }
    ]
  });
  const selectBase1 = new SelectBase(survey.getQuestionByName("q1"), []);
  expect(selectBase1.getValues()).toStrictEqual(["none", "Item 3", "Item 2", "Item 1"]);
  expect(selectBase1.getLabels()).toStrictEqual(["None Item", "Item 3", "Item 2", "Item 1"]);
});

test("choicesFromQuestion", () => {
  var survey = new SurveyModel({
    pages: [
      {
        elements: [
          {
            type: "checkbox",
            name: "q1",
            choices: ["Item 1", "Item 2", "Item 3"],
            showNoneItem: true
          },
          {
            type: "checkbox",
            name: "q2",
            choicesFromQuestion: "q1",
            choicesFromQuestionMode: "selected",
          }
        ]
      }
    ]
  });
  const selectBase1 = new SelectBase(survey.getQuestionByName("q1"), []);
  expect(selectBase1.getValues()).toStrictEqual(["none", "Item 3", "Item 2", "Item 1"]);
  const selectBase2 = new SelectBase(survey.getQuestionByName("q2"), []);
  expect(selectBase2.getValues()).toStrictEqual(["Item 3", "Item 2", "Item 1"]);
});

test("save selection in state", () => {
  selectBase.setSelection(new ItemValue(1, "One"));

  let state = selectBase.getState();
  expect(state).toStrictEqual({
    "answersOrder": "default",
    "chartType": "bar",
    "filter": 1,
    "hideEmptyAnswers": false,
    "topN": -1,
  });
  state.filter = "father";
  selectBase.setState(state);
  expect(selectBase.selection.value).toEqual("father");
});

test("hideEmptyAnswersInData", () => {
  const answersData = {
    "datasets": [[1, 2], [2, 1]],
    "labels": ["31-39", "40-50"],
    "colors": ["#86e1fb", "#3999fb", "#ff6771", "#1eb496"],
    "texts": [[1, 2], [2, 1]],
    "seriesLabels": ["Age Group", "Gender"]
  };

  let result = hideEmptyAnswersInData(answersData);
  expect(result.datasets.length).toBe(2);
  expect(result.datasets).toStrictEqual(answersData.datasets);

  result = hideEmptyAnswersInData({
    "datasets": [[0, 1], [0, 2]],
    "labels": ["0-9", "11-20"],
    "colors": ["#86e1fb", "#3999fb", "#ff6771", "#1eb496"],
    "texts": [[0, 1], [0, 2]],
    "seriesLabels": ["Age Group", "Gender"]
  });
  expect(result).toStrictEqual({ "datasets": [[1], [2]], "labels": ["0-9", "11-20"], "colors": ["#86e1fb", "#3999fb"], "texts": [[1], [2]], "seriesLabels": ["Gender"] });

  result = hideEmptyAnswersInData({
    "datasets": [[0, 0], [3, 2]],
    "labels": ["0-9", "11-20"],
    "colors": ["#86e1fb", "#3999fb", "#ff6771", "#1eb496"],
    "texts": [[0, 0], [3, 2]],
    "seriesLabels": ["Age Group", "Gender"]
  });
  expect(result).toStrictEqual({ "datasets": [[3, 2]], "labels": ["11-20"], "colors": ["#3999fb"], "texts": [[3, 2]], "seriesLabels": ["Age Group", "Gender"] });
});