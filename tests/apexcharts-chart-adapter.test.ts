import { SurveyModel } from "survey-core";
import { SelectBase } from "../src/selectBase";
import { AlternativeVisualizersWrapper } from "../src/alternativeVizualizersWrapper";
import { VisualizationPanel } from "../src/visualizationPanel";
import { HistogramModel } from "../src/histogram";
import { ApexChartsAdapter } from "../src/apexcharts/chart-adapter";
import { VisualizerBase } from "../src/visualizerBase";
import { NumberModel } from "../src/number";
import { BooleanModel } from "../src/boolean";
import { StatisticsTableBoolean } from "./apexcharts-chart-adapter.test";
export * from "../src/text";
export * from "../src/number";
export * from "../src/nps";
export * from "../src/boolean";
export * from "../src/statistics-table";
export * from "../src/pivot";

VisualizerBase.chartAdapterType = ApexChartsAdapter;

test("Combining visualizer types and chart types for rating", () => {
  const json = { elements: [{ type: "rating", name: "score", rateMin: 1, rateMax: 10, }] };
  const data = [{ "score": 1 }, { "score": 2 }, { "score": 3 }, { "score": 4 }, { "score": 5 }, { "score": 6 }, { "score": 1 }, { "score": 2 }, { "score": 7 }, { "score": 9 }, { "score": 9 }, { "score": 1 }, { "score": 2 }, { "score": 10 }, { "score": 3 }];
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), data);
  let altVisualizer = visPanel.getVisualizer("score") as AlternativeVisualizersWrapper;

  const visualizations = altVisualizer.getVisualizers();
  expect(visualizations.length).toBe(3);
  expect(visualizations[0].type).toBe("selectBase");
  expect((visualizations[0] as SelectBase)["chartTypes"]).toStrictEqual(["bar", "vbar", "pie", "doughnut"]);
  expect(visualizations[1].type).toBe("number");
  expect((visualizations[1] as NumberModel)["chartTypes"]).toStrictEqual(["gauge", "bullet"]);
  expect(visualizations[2].type).toBe("histogram");
  expect((visualizations[2] as HistogramModel)["chartTypes"]).toStrictEqual(["vbar", "bar"]);

  const visualizerSwitchItems = altVisualizer["getVisualizerSwitchItems"]();
  expect(visualizerSwitchItems.length).toBe(8);
  expect(visualizerSwitchItems.map(i => i.value)).toStrictEqual(["bar", "vbar", "pie", "doughnut", "gauge", "bullet", "vbar", "bar"]);
  expect(visualizerSwitchItems.map(i => i.visualizerType)).toStrictEqual(["selectBase", "selectBase", "selectBase", "selectBase", "number", "number", "histogram", "histogram"]);
  // expect(visualizerSwitchItems.map(i => i.text)).toStrictEqual(["Bar", "Vertical Bar", "Pie", "Doughnut", "Gauge", "Bullet", "Histogram", "chartType_vistogram"]);
});

test("Combining visualizer types and chart types for boolean", () => {
  const json = { elements: [{ type: "boolean", name: "bool", valueName: "boolValue" }] };
  const data = [{ "boolValue": true }, { "boolValue": true }, { "boolValue": false }, { "boolValue": true }, { "boolValue": false }, { "boolValue": true }, { "boolValue": false }, { "boolValue": true }];
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), data);
  let altVisualizer = visPanel.getVisualizer("bool") as AlternativeVisualizersWrapper;

  const visualizations = altVisualizer.getVisualizers();
  expect(visualizations.length).toBe(2);
  expect(visualizations[0].type).toBe("boolean");
  expect((visualizations[0] as BooleanModel)["chartTypes"]).toStrictEqual(["pie", "doughnut", "bar"]);
  expect(visualizations[1].type).toBe("options");
  expect((visualizations[1] as StatisticsTableBoolean)["chartTypes"]).toStrictEqual([]);

  const visualizerSwitchItems = altVisualizer["getVisualizerSwitchItems"]();
  expect(visualizerSwitchItems.length).toBe(4);
  expect(visualizerSwitchItems.map(i => i.value)).toStrictEqual(["pie", "doughnut", "bar", "options"]);
  expect(visualizerSwitchItems.map(i => i.visualizerType)).toStrictEqual(["boolean", "boolean", "boolean", "options"]);
  // expect(visualizerSwitchItems.map(i => i.text)).toStrictEqual(["Pie", "Doughnut", "Bar", "chartType_options"]);
});

test("setVisualizer by chartType for rating", () => {
  const json = { elements: [{ type: "rating", name: "score", rateMin: 1, rateMax: 10, }] };
  const data = [{ "score": 1 }, { "score": 2 }, { "score": 3 }, { "score": 4 }, { "score": 5 }, { "score": 6 }, { "score": 1 }, { "score": 2 }, { "score": 7 }, { "score": 9 }, { "score": 9 }, { "score": 1 }, { "score": 2 }, { "score": 10 }, { "score": 3 }];
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), data);
  let altVisualizer = visPanel.getVisualizer("score") as AlternativeVisualizersWrapper;

  expect(altVisualizer.getVisualizer().type).toBe("selectBase");
  expect((altVisualizer.getVisualizer() as SelectBase).chartType).toBe("bar");

  altVisualizer["_setVisualizer"]({ value: "bullet", visualizerType: "number" });
  expect(altVisualizer.getVisualizer().type).toBe("number");
  expect((altVisualizer.getVisualizer() as NumberModel).chartType).toBe("bullet");

  altVisualizer["_setVisualizer"]({ value: "vbar", visualizerType: "selectBase" });
  expect(altVisualizer.getVisualizer().type).toBe("selectBase");
  expect((altVisualizer.getVisualizer() as SelectBase).chartType).toBe("vbar");

  altVisualizer["_setVisualizer"]({ value: "pie", visualizerType: "selectBase" });
  expect(altVisualizer.getVisualizer().type).toBe("selectBase");
  expect((altVisualizer.getVisualizer() as SelectBase).chartType).toBe("pie");
});

test("setVisualizer by chartType for boolean", () => {
  const json = { elements: [{ type: "boolean", name: "bool", valueName: "boolValue" }] };
  const data = [{ "boolValue": true }, { "boolValue": true }, { "boolValue": false }, { "boolValue": true }, { "boolValue": false }, { "boolValue": true }, { "boolValue": false }, { "boolValue": true }];
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), data);
  let altVisualizer = visPanel.getVisualizer("bool") as AlternativeVisualizersWrapper;

  expect(altVisualizer.getVisualizer().type).toBe("boolean");
  expect((altVisualizer.getVisualizer() as BooleanModel).chartType).toBe("pie");

  altVisualizer["_setVisualizer"]({ value: "options", visualizerType: "options" });
  expect(altVisualizer.getVisualizer().type).toBe("options");
  expect((altVisualizer.getVisualizer() as StatisticsTableBoolean).chartType).toBe("bar");

  altVisualizer["_setVisualizer"]({ value: "pie", visualizerType: "boolean" });
  expect(altVisualizer.getVisualizer().type).toBe("boolean");
  expect((altVisualizer.getVisualizer() as BooleanModel).chartType).toBe("pie");

  altVisualizer["_setVisualizer"]({ value: "bar", visualizerType: "boolean" });
  expect(altVisualizer.getVisualizer().type).toBe("boolean");
  expect((altVisualizer.getVisualizer() as BooleanModel).chartType).toBe("bar");
});