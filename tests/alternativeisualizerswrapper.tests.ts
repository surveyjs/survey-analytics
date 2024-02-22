import { QuestionDropdownModel, ItemValue } from "survey-core";
import { SelectBase } from "../src/selectBase";
import { AlternativeVisualizersWrapper } from "../src/alternativeVizualizersWrapper";

let selectBase: SelectBase;
let anotherSelectBase: SelectBase;
let alternativeVisualizersWrapper: AlternativeVisualizersWrapper;
let choices = [
  { value: "father", text: "father_text" },
  { value: "mother", text: "mother_text" },
  { value: "sister", text: "sister_text" },
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
  selectBase = new SelectBase(question, data, {}, "sb1");
  selectBase["chartTypes"] = ["bar", "pie"];
  anotherSelectBase = new SelectBase(question, data, {}, "sb2");
  anotherSelectBase["chartTypes"] = ["bar", "pie"];
  alternativeVisualizersWrapper = new AlternativeVisualizersWrapper(
    [selectBase, anotherSelectBase],
    question,
    data
  );
});

test("onDataItemSelected", () => {
  var onDataItemSelected = () => { };
  alternativeVisualizersWrapper.onDataItemSelected = onDataItemSelected;

  //alternativeVisualizersWrapper doesn't need in onDataItemSelected
  expect(alternativeVisualizersWrapper.onDataItemSelected).toEqual(undefined);

  expect(selectBase.onDataItemSelected).toEqual(onDataItemSelected);
  expect(anotherSelectBase.onDataItemSelected).toEqual(onDataItemSelected);
});

test("setSelection and getSelection", () => {
  selectBase.setSelection(new ItemValue(1, "One"));
  expect(anotherSelectBase.selection).toEqual(undefined);
  expect(alternativeVisualizersWrapper.selection.value).toEqual(1);

  //alternativeVisualizersWrapper gets selection of visible visualizer
  anotherSelectBase.setSelection(new ItemValue(2, "Two"));
  expect(selectBase.selection.value).toEqual(1);
  expect(alternativeVisualizersWrapper.selection.value).toEqual(1);

  //set selection for alternativeVisualizersWrapper updates selectBase visualizers selections
  alternativeVisualizersWrapper.setSelection(new ItemValue(3, "Three"));
  expect(selectBase.selection.value).toEqual(3);
  expect(anotherSelectBase.selection.value).toEqual(3);
});

test("check onAfterRender", () => {
  var count = 0;
  alternativeVisualizersWrapper.onAfterRender.add(() => {
    count++;
  });
  alternativeVisualizersWrapper.render(document.createElement("div"));
  expect(count).toEqual(1);
  alternativeVisualizersWrapper.setVisualizer(
    (<any>alternativeVisualizersWrapper).visualizers[1].type
  );
  expect(count).toEqual(1);
  (<any>alternativeVisualizersWrapper).renderContent(
    (<any>alternativeVisualizersWrapper).contentContainer
  );
  expect(count).toEqual(2);
});

test("check onVisualizerChanged and setVisualizer", () => {
  let log = "";
  alternativeVisualizersWrapper.onVisualizerChanged.add((s, o) => {
    log += "->" + o.visualizer.type;
  });
  alternativeVisualizersWrapper.setVisualizer(
    (<any>alternativeVisualizersWrapper).visualizers[1].type
  );
  expect(log).toEqual("->sb2");
  alternativeVisualizersWrapper.setVisualizer(
    (<any>alternativeVisualizersWrapper).visualizers[1].type
  );
  expect(log).toEqual("->sb2");
  alternativeVisualizersWrapper.setVisualizer(
    (<any>alternativeVisualizersWrapper).visualizers[0].type
  );
  expect(log).toEqual("->sb2->sb1");
});

test("get/set state", () => {
  const initialState = {
    "visualizer": "sb1",
    "state": {
      "answersOrder": "default",
      "chartType": "bar",
      "hideEmptyAnswers": false,
      "topN": -1,
    },
  };
  let state = alternativeVisualizersWrapper.getState();
  expect(state).toStrictEqual(initialState);

  state.visualizer = "sb2";
  state.state.chartType = "pie";
  alternativeVisualizersWrapper.setState(state);

  state = alternativeVisualizersWrapper.getState();
  const currentVisualizer = alternativeVisualizersWrapper["visualizer"];
  expect(currentVisualizer.type).toEqual("sb2");
  expect(currentVisualizer["chartType"]).toEqual("pie");
});

test("onStateChanged", () => {
  let count = 0;
  alternativeVisualizersWrapper.onStateChanged.add(() => {
    count++;
  });
  let currentVisualizer = alternativeVisualizersWrapper["visualizer"];
  expect(currentVisualizer.type).toEqual("sb1");
  expect(count).toBe(0);

  alternativeVisualizersWrapper.getVisualizers()[0]["setChartType"]("pie");
  expect(count).toBe(1);

  alternativeVisualizersWrapper.getVisualizers()[1]["setChartType"]("pie");
  expect(count).toBe(1);

  alternativeVisualizersWrapper.setVisualizer("sb2");
  currentVisualizer = alternativeVisualizersWrapper["visualizer"];
  expect(currentVisualizer.type).toEqual("sb2");
  expect(count).toBe(2);

  alternativeVisualizersWrapper.getVisualizers()[0]["setChartType"]("bar");
  expect(count).toBe(2);

  alternativeVisualizersWrapper.getVisualizers()[1]["setChartType"]("bar");
  expect(count).toBe(3);
});
