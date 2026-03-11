import { ApexChartsAdapter } from "../src/apexcharts/chart-adapter";
import { WordCloud } from "../src/wordcloud/wordcloud";
import { SelectBase } from "../src/selectBase";
import { AlternativeVisualizersWrapper } from "../src/alternativeVizualizersWrapper";
import { Dashboard } from "../src/dashboard";
import { VisualizationManager } from "../src/visualizationManager";
import { PostponeHelper, VisualizerBase } from "../src/visualizerBase";
import { IPivotChartVisualizerOptions, PivotModel } from "../src/pivot";
import { HistogramModel } from "../src/histogram";
import { QuestionTextModel, SurveyModel } from "survey-core";
export * from "../src/card";
export * from "../src/text";
export * from "../src/number";
export * from "../src/nps";
export * from "../src/pivot";

VisualizerBase.chartAdapterType = ApexChartsAdapter;

test("Create pivot visualizer with axis options", async () => {
  const json = {
    elements: [
      { type: "text", name: "question1" },
      { type: "text", name: "question2" },
      { type: "text", name: "question3" },
    ],
  };
  const survey = new SurveyModel(json);
  const visualizerDefinition: any = {
    type: "pivot",
    questions: survey.getAllQuestions(),
    categoryField: "question2",
    seriesFields: ["question1", "question3"]
  };
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition] });
  const items = dashboard.items;
  expect(items.length).toBe(1);
  expect(items[0].visualizerType).toBe("pivot");
  expect(items[0].name).toBe("visualizer1");
  expect(items[0].visualizer).toBeDefined();
  expect(dashboard.visualizers.length).toBe(1);
  expect(dashboard.getElements().length).toBe(1);
  expect(dashboard.getElement("visualizer1").getState()).toStrictEqual({
    "isPublic": true,
    "isVisible": true,
    "name": "visualizer1",
    "type": "pivot",
  });
  expect(dashboard.getVisualizer("visualizer1")).toBeDefined();

  const visualizer = dashboard.visualizers[0] as PivotModel;
  expect(visualizer.type).toBe("pivot");
  expect(visualizer.name).toBe("visualizer1");
  expect(visualizer.questions.length).toBe(3);
  expect(visualizer.axisXQuestionName).toBe("question2");
  expect(visualizer.axisYQuestionNames).toStrictEqual(["question1", "question3"]);
});

test("Dashboard item should control visualizer and chart type", () => {
  const json = {
    elements: [
      { type: "checkbox", name: "question1" },
      { type: "rating", name: "question2" },
    ],
  };
  const survey = new SurveyModel(json);
  let dashboard = new Dashboard({ questions: survey.getAllQuestions() });
  const items = dashboard.items;
  expect(items.length).toBe(2);
  expect(items[0].type).toBe("bar");
  // expect(items[0].chartType).toBe("bar");
  expect(items[0].visualizerType).toBe("selectBase");
  expect(items[0].visualizerTypes).toStrictEqual(["selectBase"]);
  expect(items[0]._availableTypes).toStrictEqual({ "selectBase": ["bar", "vbar", "pie", "doughnut"] });
  expect(items[0].availableTypes).toStrictEqual(["bar", "vbar", "pie", "doughnut"]);
  expect(items[1].type).toBe("bar");
  // expect(items[0].chartType).toBe("bar");
  expect(items[1].visualizerType).toBe("selectBase");
  expect(items[1].visualizerTypes).toStrictEqual(["selectBase", "average", "histogram"]);
  expect(items[1]._availableTypes).toStrictEqual({ "average": ["gauge", "bullet"], "histogram": ["vhistogram", "histogram"], "selectBase": ["bar", "vbar", "pie", "doughnut"] });
  expect(items[1].availableTypes).toStrictEqual(["bar", "vbar", "pie", "doughnut", "gauge", "bullet", "vhistogram", "histogram"]);
  expect(dashboard.visualizers.length).toBe(2);
  expect(dashboard.visualizers[0].type).toBe("selectBase");
  expect(dashboard.visualizers[1].type).toBe("alternative");

  const chartVisualizer = dashboard.visualizers[0] as SelectBase;
  expect(chartVisualizer["chartTypes"]).toStrictEqual(["bar", "vbar", "pie", "doughnut"]);
  expect(chartVisualizer.chartType).toBe("bar");
  items[0].type = "pie";
  // expect(chartVisualizer.chartType).toBe("pie");
  expect(items[0].type).toBe("pie");
  items[0].type = "doughnut";
  expect(chartVisualizer.chartType).toBe("doughnut");
  // expect(items[0].chartType).toBe("doughnut");

  const rankingVisualizer = dashboard.visualizers[1] as AlternativeVisualizersWrapper;
  expect(rankingVisualizer.getVisualizer().type).toBe("selectBase");
  expect((rankingVisualizer.getVisualizer() as any).chartTypes).toStrictEqual(["bar", "vbar", "pie", "doughnut"]);
  items[1].visualizerType = "average";
  expect(rankingVisualizer.getVisualizer().type).toBe("average");
  expect(items[1].type).toBe("gauge");
  // expect(items[1].chartType).toBe("gauge");
  items[1].visualizerType = "histogram";
  expect(rankingVisualizer.getVisualizer().type).toBe("histogram");
  expect(items[1].type).toBe("histogram");
  // expect(items[1].chartType).toBe("vhistogram");

  items[1].type = "bullet";
  expect(rankingVisualizer.getVisualizer().type).toBe("average");
  // expect(items[1].chartType).toBe("bullet");
});