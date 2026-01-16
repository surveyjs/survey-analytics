import { SurveyModel } from "survey-core";
import { WordCloud } from "../src/wordcloud/wordcloud";
import { Text } from "../src/text";
import { SelectBase } from "../src/selectBase";
import { AlternativeVisualizersWrapper } from "../src/alternativeVizualizersWrapper";
import { VisualizationPanel } from "../src/visualizationPanel";
import { VisualizationManager } from "../src/visualizationManager";
import { PivotModel } from "../src/pivot";
import { LayoutEngine } from "../src/layout-engine";
import { HistogramModel } from "../src/histogram";
import { ApexChartsAdapter } from "../src/apexcharts/chart-adapter";
import { VisualizerBase } from "../src/visualizerBase";
import { NumberModel } from "../src/number";
export * from "../src/number";
export * from "../src/nps";

VisualizationPanel.LayoutEngine = LayoutEngine;
VisualizationManager.registerVisualizer("comment", Text);
VisualizationManager.registerVisualizer("comment", WordCloud);
VisualizationManager.registerAltVisualizerSelector(AlternativeVisualizersWrapper);
VisualizationManager.registerPivotVisualizer(PivotModel);
VisualizationManager.unregisterVisualizer("number", HistogramModel);

VisualizerBase.chartAdapterType = ApexChartsAdapter;

test("Combining visualizer types and chart types", () => {
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
  expect(visualizerSwitchItems.length).toBe(7);
  expect(visualizerSwitchItems.map(i => i.value)).toStrictEqual(["bar", "vbar", "pie", "doughnut", "gauge", "bullet", "histogram"]);
  expect(visualizerSwitchItems.map(i => i.text)).toStrictEqual(["Bar", "Vertical Bar", "Pie", "Doughnut", "Gauge", "Bullet", "chartType_histogram"]);
});

test("setVisualizer by chartType", () => {
  const json = { elements: [{ type: "rating", name: "score", rateMin: 1, rateMax: 10, }] };
  const data = [{ "score": 1 }, { "score": 2 }, { "score": 3 }, { "score": 4 }, { "score": 5 }, { "score": 6 }, { "score": 1 }, { "score": 2 }, { "score": 7 }, { "score": 9 }, { "score": 9 }, { "score": 1 }, { "score": 2 }, { "score": 10 }, { "score": 3 }];
  const survey = new SurveyModel(json);
  let visPanel = new VisualizationPanel(survey.getAllQuestions(), data);
  let altVisualizer = visPanel.getVisualizer("score") as AlternativeVisualizersWrapper;

  expect(altVisualizer.getVisualizer().type).toBe("selectBase");
  expect((altVisualizer.getVisualizer() as SelectBase).chartType).toBe("bar");

  altVisualizer.setVisualizer("bullet");
  expect(altVisualizer.getVisualizer().type).toBe("number");
  expect((altVisualizer.getVisualizer() as NumberModel).chartType).toBe("bullet");

  altVisualizer.setVisualizer("pie");
  expect(altVisualizer.getVisualizer().type).toBe("selectBase");
  expect((altVisualizer.getVisualizer() as SelectBase).chartType).toBe("pie");

  altVisualizer.setVisualizer("vbar");
  expect(altVisualizer.getVisualizer().type).toBe("selectBase");
  expect((altVisualizer.getVisualizer() as SelectBase).chartType).toBe("vbar");
});