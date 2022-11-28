import { VisualizerBase } from "../src/visualizerBase";
import { QuestionDropdownModel } from "survey-core";

test("custom colors", () => {
  expect(new VisualizerBase(null, null).getColors(1)).toEqual([
    "#86e1fb",
    "#3999fb",
    "#ff6771",
    "#1eb496",
    "#ffc152",
    "#aba1ff",
    "#7d8da5",
    "#4ec46c",
    "#cf37a6",
    "#4e6198",
  ]);

  VisualizerBase.customColors = ["red", "green", "blue"];

  expect(new VisualizerBase(null, null).getColors(2)).toEqual([
    "red",
    "green",
    "blue",
    "red",
    "green",
    "blue",
  ]);
});

test("series options", () => {
  const seriesValues = ["1", "2"];
  const seriesLabels = ["One", "Two"];
  let visualizer = new VisualizerBase(null, null, {
    seriesValues: seriesValues,
  });
  expect(visualizer.getSeriesValues()).toEqual(seriesValues);
  expect(visualizer.getSeriesLabels()).toEqual(seriesValues);
  visualizer = new VisualizerBase(null, null, {
    seriesValues: seriesValues,
    seriesLabels: seriesLabels,
  });
  expect(visualizer.getSeriesValues()).toEqual(seriesValues);
  expect(visualizer.getSeriesLabels()).toEqual(seriesLabels);
});

test("footer visualizer data, updateData", () => {
  var question = new QuestionDropdownModel("q1");
  question.hasOther = true;

  let visualizer = new VisualizerBase(question, []);
  expect(visualizer.hasFooter).toBeTruthy();
  expect(visualizer["data"]).toEqual([]);
  expect(visualizer.footerVisualizer["data"]).toEqual([]);

  const newData = [{ q1: 255 }];
  visualizer.updateData(newData);
  expect(visualizer["data"]).toEqual(newData);
  expect(visualizer["_footerVisualizer"]["data"]).toEqual(newData);
});

test("check onAfterRender", () => {
  var question = new QuestionDropdownModel("q1");
  question.hasOther = true;

  let count = 0;
  let visualizer = new VisualizerBase(question, []);
  visualizer.onAfterRender.add(() => {
    count++;
  });
  (<any>visualizer).renderContent(document.createElement("div"));
  expect(count).toEqual(1);
});

test("Use valueName for data https://surveyjs.answerdesk.io/internal/ticket/details/T9071", () => {
  var question = new QuestionDropdownModel("q1");
  let visualizer = new VisualizerBase(question, []);

  expect(visualizer.dataName).toEqual("q1");

  question.valueName = "q1value";
  expect(visualizer.dataName).toEqual("q1value");
});

test("options.labelTruncateLength", () => {
  var question = new QuestionDropdownModel("q1");
  let visualizer = new VisualizerBase(question, [], { labelTruncateLength: 3 });

  expect(visualizer.labelTruncateLength).toEqual(3);
});
