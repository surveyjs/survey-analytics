import { QuestionDropdownModel, ItemValue, QuestionImagePickerModel, SurveyModel, ComponentCollection, QuestionRatingModel } from "survey-core";
import { SelectBase, hideEmptyAnswersInData } from "../src/selectBase";
import { VisualizationManager } from "../src/visualizationManager";
import { VisualizerBase } from "../src/visualizerBase";

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

test("getCalculatedValues method", async () => {
  expect((await selectBase.getCalculatedValues()).data).toEqual([[2, 1, 0, 1, 0, 0].reverse()]);
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

test("onStateChanged reised on setSelection", () => {
  let log = "";
  selectBase.onStateChanged.add((s, o) => {
    log += "->" + o.filter;
  });

  selectBase.setSelection(new ItemValue(1, "One"));
  expect(log).toEqual("->1");

  selectBase.setSelection(undefined as any);
  expect(log).toEqual("->1->undefined");
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

test("check getPercentages method", async () => {
  expect(selectBase.getPercentages((await selectBase.getAnswersData()).datasets)).toEqual([[50, 25, 0, 25, 0, 0].reverse()]);
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

test("change visible choices triggers dataProvider raiseDataChanged", () => {
  var raiseDataChangedCallCount = 0;
  var oldRaiseDataChangedFunc = (<any>selectBase).dataProvider.raiseDataChanged;
  (<any>selectBase).dataProvider.raiseDataChanged = () => {
    raiseDataChangedCallCount++;
  };
  selectBase.question["choices"] = ["add1"];
  expect(raiseDataChangedCallCount).toEqual(1);
  (<any>selectBase).dataProvider.raiseDataChanged = oldRaiseDataChangedFunc;
  selectBase.question["choices"] = choices;
});

test("check that getSelectedItemByText take into account other item", () => {
  selectBase.question.hasOther = true;
  selectBase.question["otherText"] = "Other";
  expect(selectBase.getSelectedItemByText("Other")).toEqual(
    selectBase.question["otherItem"]
  );
});

test("getAnswersData method", async () => {
  const colors = VisualizerBase.getColors();
  expect(await selectBase.getAnswersData()).toEqual({
    "colors": colors,
    "datasets": [[2, 1, 0, 1, 0, 0].reverse()],
    "labels": ["father_text", "mother_text", "brother_text", "sister_text", "son_text", "daughter_text"].reverse(),
    "seriesLabels": [], "texts": [[2, 1, 0, 1, 0, 0].reverse()],
    "values": ["daughter", "son", "sister", "brother", "mother", "father"],
  });
});

test("hide empty items", async () => {
  const colors = VisualizerBase.getColors();
  expect(selectBase.hideEmptyAnswers).toBe(false);
  expect(await selectBase.getAnswersData()).toEqual({
    "colors": colors, "datasets": [[2, 1, 0, 1, 0, 0].reverse()],
    "labels": ["father_text", "mother_text", "brother_text", "sister_text", "son_text", "daughter_text"].reverse(),
    "seriesLabels": [], "texts": [[2, 1, 0, 1, 0, 0].reverse()],
    "values": ["daughter", "son", "sister", "brother", "mother", "father"],
  },);
  selectBase.hideEmptyAnswers = true;
  expect(await selectBase.getAnswersData()).toEqual({
    "colors": ["#ff6771", "#ffc152", "#aba1ff"],
    "datasets": [[2, 1, 1].reverse()],
    "values": ["sister", "mother", "father"],
    "labels": ["father_text", "mother_text", "sister_text"].reverse(),
    "texts": [[2, 1, 1].reverse()],
    "seriesLabels": [],
  });
});

test("change answers order", async () => {
  selectBase.hideEmptyAnswers = true;
  const color1 = "#ff6771";
  const color2 = "#ffc152";
  const color3 = "#aba1ff";
  expect(selectBase.answersOrder).toBe("default");
  expect(await selectBase.getAnswersData()).toEqual({
    "colors": [color1, color2, color3],
    "datasets": [[2, 1, 1].reverse()],
    "labels": ["father_text", "mother_text", "sister_text"].reverse(),
    "values": ["sister", "mother", "father"],
    "texts": [[2, 1, 1].reverse()],
    "seriesLabels": []
  });
  selectBase.answersOrder = "asc";
  expect(await selectBase.getAnswersData()).toEqual({
    "colors": [color3, color1, color2],
    "datasets": [[2, 1, 1]],
    "labels": ["father_text", "sister_text", "mother_text"],
    "values": ["father", "sister", "mother"],
    "seriesLabels": [],
    "texts": [[2, 1, 1]]
  });
  selectBase.answersOrder = "desc";
  expect(await selectBase.getAnswersData()).toEqual({
    "colors": [color1, color2, color3],
    "datasets": [[1, 1, 2]],
    "labels": ["sister_text", "mother_text", "father_text"],
    "values": ["sister", "mother", "father"],
    "seriesLabels": [],
    "texts": [[1, 1, 2]]
  });
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

test("getPercentages method", async () => {
  selectBase.updateData([
    { q1: "father", },
    { q1: "father", },
    { q1: "father", },
    { q1: "mother", },
    { q1: "mother", },
    { q1: "sister", },
  ]);
  expect(selectBase.getPercentages((await selectBase.getAnswersData()).datasets)).toEqual([[50, 33.33, 0, 16.67, 0, 0].reverse()]);
});

test("showMissingAnswers", async () => {
  expect(selectBase["isSupportMissingAnswers"]()).toBeTruthy();
  expect(selectBase.showMissingAnswers).toBeFalsy();
  expect(selectBase.getValues()).toEqual(["father", "mother", "brother", "sister", "son", "daughter"].reverse());
  expect(selectBase.getLabels()).toEqual(["father_text", "mother_text", "brother_text", "sister_text", "son_text", "daughter_text"].reverse());
  expect((await selectBase.getCalculatedValues()).data).toEqual([[2, 1, 0, 1, 0, 0].reverse()]);
  selectBase.showMissingAnswers = true;
  expect(selectBase.getValues()).toEqual([undefined, "father", "mother", "brother", "sister", "son", "daughter"].reverse());
  expect(selectBase.getLabels()).toEqual(["Missing answers", "father_text", "mother_text", "brother_text", "sister_text", "son_text", "daughter_text"].reverse());
  expect((await selectBase.getCalculatedValues()).data).toEqual([[1, 2, 1, 0, 1, 0, 0].reverse()]);
});

test("valueName used for getCalculatedValues https://surveyjs.answerdesk.io/internal/ticket/details/T9071", async () => {
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
  expect((await selectBase.getCalculatedValues()).data).toEqual([[2, 1, 0, 1, 0, 0].reverse()]);
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

test("save selection to state / restore selection from state", () => {
  selectBase.setSelection(new ItemValue(1, "One"));

  let state = selectBase.getState();
  expect(state).toStrictEqual({
    "chartType": "bar",
    "filter": 1,
  });
  state.filter = "father";
  selectBase.setState(state);
  expect(selectBase.selection.value).toEqual("father");
});

test("get/set/reset state", () => {
  selectBase["chartTypes"] = ["bar", "pie"];
  const initialState = { };

  let state = selectBase.getState();
  expect(state).toStrictEqual(initialState);

  selectBase.answersOrder = "asc";
  selectBase.hideEmptyAnswers = true;
  selectBase.topN = 3;
  selectBase.chartType = "pie";
  state = selectBase.getState();
  expect(state).toStrictEqual({
    "answersOrder": "asc",
    "chartType": "pie",
    "hideEmptyAnswers": true,
    "topN": 3,
  });

  selectBase.resetState();
  state = selectBase.getState();
  expect(state).toStrictEqual(initialState);
});

test("hideEmptyAnswersInData", () => {
  const answersData = {
    "datasets": [[1, 2], [2, 1]],
    "labels": ["31-39", "40-50"],
    "values": ["31-39", "40-50"],
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
    "values": ["0-9", "11-20"],
    "colors": ["#86e1fb", "#3999fb", "#ff6771", "#1eb496"],
    "texts": [[0, 1], [0, 2]],
    "seriesLabels": ["Age Group", "Gender"]
  });
  expect(result).toStrictEqual({
    "datasets": [[1], [2]],
    "labels": ["11-20"],
    "values": ["11-20"],
    "colors": ["#3999fb"],
    "texts": [[1], [2]],
    "seriesLabels": ["Age Group", "Gender"]
  });

  result = hideEmptyAnswersInData({
    "datasets": [[0, 0], [3, 2]],
    "labels": ["0-9", "11-20"],
    "values": ["0-9", "11-20"],
    "colors": ["#86e1fb", "#3999fb", "#ff6771", "#1eb496"],
    "texts": [[0, 0], [3, 2]],
    "seriesLabels": ["Age Group", "Gender"]
  });
  expect(result).toStrictEqual({
    "datasets": [[3, 2]],
    "labels": ["0-9", "11-20"],
    "values": ["0-9", "11-20"],
    "colors": ["#86e1fb", "#3999fb"],
    "texts": [[3, 2]],
    "seriesLabels": ["Gender"]
  });
});

test("convertFromExternalData", async () => {
  var question = new QuestionDropdownModel("q1");
  question.choices = choices;
  question.valueName = "q1value";
  const data = [
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
  const externalCalculatedData = {
    "father": 2,
    "mother": 1,
    "brother": 0,
    "sister": 1,
    "son": 0,
    "daughter": 0
  };
  selectBase = new SelectBase(question, data, {});

  const calculatedData = (selectBase as any).getCalculatedValuesCore().data;
  expect(calculatedData).toEqual([[2, 1, 0, 1, 0, 0].reverse()]);
  expect(selectBase.convertFromExternalData(externalCalculatedData).data).toStrictEqual(calculatedData);
});

test("isSupportAnswersOrder and allowSortAnswers or allowChangeAnswersOrder options", () => {
  expect(selectBase["isSupportAnswersOrder"]()).toBeTruthy();

  let sb = new SelectBase(new QuestionDropdownModel("q1"), [], { allowChangeAnswersOrder: false });
  expect(sb["isSupportAnswersOrder"]()).toBeFalsy();

  sb = new SelectBase(new QuestionDropdownModel("q1"), [], { allowSortAnswers: false });
  expect(sb["isSupportAnswersOrder"]()).toBeFalsy();

  sb = new SelectBase(new QuestionDropdownModel("q1"), [], { allowChangeAnswersOrder: true });
  expect(sb["isSupportAnswersOrder"]()).toBeTruthy();

  sb = new SelectBase(new QuestionDropdownModel("q1"), [], { allowSortAnswers: true });
  expect(sb["isSupportAnswersOrder"]()).toBeTruthy();
});

test("renderContent function shouldn't be passed to question footer visualizer", () => {
  var survey = new SurveyModel({
    "elements": [{
      "type": "radiogroup",
      "name": "q1",
      "title": "Which of the following best describes you or your organization?",
      "showOtherItem": true,
      "choices": [{
        "value": "ISV",
        "text": "ISV (building commercial/shrink-wrapped software)"
      }, {
        "value": "Consulting",
        "text": "Software consulting firm (providing development services to other organizations)"
      }, {
        "value": "Custom",
        "text": "Custom software development (as a freelancer/contractor)"
      }, {
        "value": "In-house",
        "text": "In-house software development"
      }, {
        "value": "Hobbyist",
        "text": "Hobbyist (developing apps for personal use)"
      }]
    }]
  });
  const customRenderContent = () => {};
  const selectBase = new SelectBase(survey.getQuestionByName("q1"), [], { renderContent: customRenderContent });
  expect(selectBase.footerVisualizer).toBeDefined();
  expect(selectBase.footerVisualizer.options.renderContent).toBeUndefined();
});

test("choices from composite question", () => {
  ComponentCollection.Instance.add({
    name: "custom_select",
    inheritBaseProps: ["choices"],
    questionJSON: {
      type: "dropdown",
      choices: [
        { value: "FRA", text: "France" },
        { value: "ATG", text: "Antigua and Barbuda" },
        { value: "ALB", text: "Albania" },
      ],
    },
  });
  VisualizationManager.registerVisualizer("custom_select", SelectBase);

  var survey = new SurveyModel({
    pages: [
      {
        elements: [
          { type: "custom_select", name: "q1", }
        ]
      }
    ]
  });
  const selectBase1 = new SelectBase(survey.getQuestionByName("q1"), []);
  expect(selectBase1.getValues()).toStrictEqual(["ALB", "ATG", "FRA"]);
  expect(selectBase1.getLabels()).toStrictEqual(["Albania", "Antigua and Barbuda", "France"]);
});

test("SelectBase supportSelection and allowSelection option", () => {
  var q = new QuestionDropdownModel("q1");

  let vis = new SelectBase(q, []);
  expect(vis.supportSelection).toBe(true);

  vis = new SelectBase(q, [], { allowSelection: true });
  expect(vis.supportSelection).toBe(true);

  vis = new SelectBase(q, [], { allowSelection: false });
  expect(vis.supportSelection).toBe(false);
});

test("getSelectedItemByText works for QuestionRatingModel", () => {
  const question = new QuestionRatingModel("q1");
  question.fromJSON({
    "name": "nps_score",
    "type": "rating",
    "title": "How you rate our sales process?",
    "rateType": "stars",
  });

  let vis = new SelectBase(question, []);
  let item = vis.getSelectedItemByText("2");
  expect(item.value).toEqual(2);
  expect(item.text).toEqual("2");

  question.rateValues = [1, 2, 3, 4, 5];
  item = vis.getSelectedItemByText("2");
  expect(item).toEqual(question.rateValues[1]);

  item = vis.getSelectedItemByText("10");
  expect(item.value).toEqual(10);
  expect(item.text).toEqual("10");
});
