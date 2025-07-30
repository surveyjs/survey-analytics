jest.mock("plotly.js", () => { }, { virtual: true });
jest.mock("plotly.js-dist-min", () => ({ default: { Icons: {}, react: () => { } } }), { virtual: true });
(<any>global).URL.createObjectURL = jest.fn();

import { PlotlyChartAdapter } from "../src/plotly/chart-adapter";
import { QuestionBooleanModel, QuestionDropdownModel, QuestionRatingModel } from "survey-core";
import { SelectBase } from "../src/selectBase";
import { BooleanModel } from "../src/boolean";
import { NumberModel } from "../src/number";
import { VisualizerBase } from "../src/visualizerBase";
import { BooleanPlotly } from "../src/plotly/legacy";

VisualizerBase.chartAdapterType = PlotlyChartAdapter;

var adapter: PlotlyChartAdapter;
var mockModel: SelectBase | VisualizerBase;
var chartNode: object;
var traces: Array<any>;
var layout: object;
var config: any;

beforeEach(() => {
  chartNode = {};
  traces = [];
  layout = {};
  config = {};
});

test("should set colors for pie chart with boolean question type", () => {
  var booleanQuestion = new QuestionBooleanModel("q1");
  booleanQuestion.labelTrue = "Yes";
  booleanQuestion.labelFalse = "No";
  var booleanData = [
    { q1: true },
    { q1: false },
    { q1: true },
    { q1: undefined }
  ];
  mockModel = new BooleanModel(booleanQuestion, booleanData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  (mockModel as any).chartType = "pie";
  traces = [
    { name: "trace1" },
    { name: "trace2" }
  ];

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(traces[0].marker).toBeDefined();
  expect(traces[0].marker.colors).toBeDefined();
  expect(traces[1].marker).toBeDefined();
  expect(traces[1].marker.colors).toBeDefined();
  expect(traces[0].marker.colors).toEqual(traces[1].marker.colors);
});

test("should set colors for doughnut chart with boolean question type", () => {
  var booleanQuestion = new QuestionBooleanModel("q1");
  booleanQuestion.labelTrue = "Yes";
  booleanQuestion.labelFalse = "No";
  var booleanData = [
    { q1: true },
    { q1: false },
    { q1: true },
    { q1: undefined }
  ];
  mockModel = new BooleanModel(booleanQuestion, booleanData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  (mockModel as any).chartType = "doughnut";
  traces = [{ name: "trace1" }];

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(traces[0].marker).toBeDefined();
  expect(traces[0].marker.colors).toBeDefined();
});

test("should set colors for bar chart with boolean question type", () => {
  var booleanQuestion = new QuestionBooleanModel("q1");
  booleanQuestion.labelTrue = "Yes";
  booleanQuestion.labelFalse = "No";
  var booleanData = [
    { q1: true },
    { q1: false },
    { q1: true },
    { q1: undefined }
  ];
  mockModel = new BooleanModel(booleanQuestion, booleanData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  (mockModel as any).chartType = "bar";
  traces = [
    { name: "trace1" },
    { name: "trace2" }
  ];

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(traces[0].marker).toBeDefined();
  expect(traces[0].marker.color).toBeDefined();
  expect(traces[1].marker).toBeDefined();
  expect(traces[1].marker.color).toBeDefined();
  expect(traces[0].marker.color).toEqual(traces[1].marker.color);
});

test("should use colors from BooleanModel if they are set", () => {
  var booleanQuestion = new QuestionBooleanModel("q1");
  booleanQuestion.labelTrue = "Yes";
  booleanQuestion.labelFalse = "No";
  var booleanData = [
    { q1: true },
    { q1: false },
    { q1: true },
    { q1: undefined }
  ];
  mockModel = new BooleanModel(booleanQuestion, booleanData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  BooleanModel.trueColor = "#00ff00";
  BooleanModel.falseColor = "#ff0000";
  (mockModel as any).chartType = "pie";
  traces = [{ name: "trace1" }];

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(traces[0].marker.colors).toContain("#00ff00");
  expect(traces[0].marker.colors).toContain("#ff0000");

  BooleanModel.trueColor = "";
  BooleanModel.falseColor = "";
});

test("should add color for missing answers if showMissingAnswers is enabled", () => {
  var booleanQuestion = new QuestionBooleanModel("q1");
  booleanQuestion.labelTrue = "Yes";
  booleanQuestion.labelFalse = "No";
  var booleanData = [
    { q1: true },
    { q1: false },
    { q1: true },
    { q1: undefined }
  ];
  mockModel = new BooleanModel(booleanQuestion, booleanData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  (mockModel as SelectBase).showMissingAnswers = true;
  (mockModel as any).chartType = "pie";
  traces = [{ name: "trace1" }];

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(traces[0].marker.colors).toHaveLength(3);
});

test("should not modify traces if chartType is not supported", () => {
  BooleanPlotly.types.push("line");

  var booleanQuestion = new QuestionBooleanModel("q1");
  booleanQuestion.labelTrue = "Yes";
  booleanQuestion.labelFalse = "No";
  var booleanData = [
    { q1: true },
    { q1: false },
    { q1: true },
    { q1: undefined }
  ];
  mockModel = new BooleanModel(booleanQuestion, booleanData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  (mockModel as any).chartType = "line";
  var originalTraces = [
    { name: "trace1", marker: { color: "red" } }
  ];
  traces = JSON.parse(JSON.stringify(originalTraces));

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(traces).toEqual(originalTraces);

  BooleanPlotly.types.pop();
});

test("should create marker object if it doesn't exist", () => {
  var booleanQuestion = new QuestionBooleanModel("q1");
  booleanQuestion.labelTrue = "Yes";
  booleanQuestion.labelFalse = "No";
  var booleanData = [
    { q1: true },
    { q1: false },
    { q1: true },
    { q1: undefined }
  ];
  mockModel = new BooleanModel(booleanQuestion, booleanData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  (mockModel as any).chartType = "pie";
  traces = [{ name: "trace1" }];

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(traces[0].marker).toBeDefined();
  expect(traces[0].marker.colors).toBeDefined();
});

test("should preserve existing marker properties", () => {
  var booleanQuestion = new QuestionBooleanModel("q1");
  booleanQuestion.labelTrue = "Yes";
  booleanQuestion.labelFalse = "No";
  var booleanData = [
    { q1: true },
    { q1: false },
    { q1: true },
    { q1: undefined }
  ];
  mockModel = new BooleanModel(booleanQuestion, booleanData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  (mockModel as any).chartType = "pie";
  traces = [{
    name: "trace1",
    marker: {
      size: 10,
      line: { width: 2 }
    }
  }];

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(traces[0].marker.size).toBe(10);
  expect(traces[0].marker.line.width).toBe(2);
  expect(traces[0].marker.colors).toBeDefined();
});

test("should set displayModeBar to true for number question type", () => {
  var numberQuestion = new QuestionRatingModel("q1");
  var numberData = [
    { q1: 1 },
    { q1: 2 },
    { q1: 3 },
    { q1: 4 },
    { q1: 5 }
  ];
  mockModel = new NumberModel(numberQuestion, numberData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  config.displayModeBar = false;

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(config.displayModeBar).toBe(true);
});

test("should preserve other config properties for number question type", () => {
  var numberQuestion = new QuestionRatingModel("q1");
  var numberData = [
    { q1: 1 },
    { q1: 2 },
    { q1: 3 },
    { q1: 4 },
    { q1: 5 }
  ];
  mockModel = new NumberModel(numberQuestion, numberData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  config.displayModeBar = false;
  config.responsive = true;
  config.locale = "en";

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(config.displayModeBar).toBe(true);
  expect(config.responsive).toBe(true);
  expect(config.locale).toBe("en");
});

test("should not modify traces for non-boolean types", () => {
  var selectQuestion = new QuestionDropdownModel("q1");
  selectQuestion.choices = [
    { value: "option1", text: "Option 1" },
    { value: "option2", text: "Option 2" }
  ];
  var selectData = [
    { q1: "option1" },
    { q1: "option2" },
    { q1: "option1" }
  ];
  mockModel = new SelectBase(selectQuestion, selectData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  var originalTraces = [
    { name: "trace1", marker: { color: "blue" } }
  ];
  traces = JSON.parse(JSON.stringify(originalTraces));

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(traces).toEqual(originalTraces);
});

test("should not modify config for non-number types", () => {
  var selectQuestion = new QuestionDropdownModel("q1");
  selectQuestion.choices = [
    { value: "option1", text: "Option 1" },
    { value: "option2", text: "Option 2" }
  ];
  var selectData = [
    { q1: "option1" },
    { q1: "option2" },
    { q1: "option1" }
  ];
  mockModel = new SelectBase(selectQuestion, selectData, {});
  adapter = new PlotlyChartAdapter(mockModel);

  config.displayModeBar = false;

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(config.displayModeBar).toBe(false);
});

test("should handle boolean and number types simultaneously", () => {
  var booleanQuestion = new QuestionBooleanModel("q1");
  var booleanData = [{ q1: true }, { q1: false }];
  mockModel = new BooleanModel(booleanQuestion, booleanData, {});
  (mockModel as any).chartType = "pie";
  adapter = new PlotlyChartAdapter(mockModel);

  traces = [{ name: "trace1" }];
  config.displayModeBar = false;

  (adapter as any).patchConfigParameters(chartNode, traces, layout, config);

  expect(traces[0].marker.colors).toBeDefined();
  expect(config.displayModeBar).toBe(false);
});

test("should handle empty traces correctly", () => {
  var booleanQuestion = new QuestionBooleanModel("q1");
  var booleanData = [{ q1: true }];
  mockModel = new BooleanModel(booleanQuestion, booleanData, {});
  (mockModel as any).chartType = "pie";
  adapter = new PlotlyChartAdapter(mockModel);

  traces = [];

  expect(() => {
    (adapter as any).patchConfigParameters(chartNode, traces, layout, config);
  }).not.toThrow();
});

test("should handle null/undefined values correctly", () => {
  var booleanQuestion = new QuestionBooleanModel("q1");
  var booleanData = [{ q1: true }];
  mockModel = new BooleanModel(booleanQuestion, booleanData, {});
  (mockModel as any).chartType = "pie";
  adapter = new PlotlyChartAdapter(mockModel);

  traces = [null, undefined, { name: "trace1" }];

  expect(() => {
    (adapter as any).patchConfigParameters(chartNode, traces, layout, config);
  }).not.toThrow();

  expect(traces[2].marker).toBeDefined();
  expect(traces[2].marker.colors).toBeDefined();
});