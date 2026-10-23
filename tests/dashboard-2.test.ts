import { ApexChartsAdapter } from "../src/apexcharts/chart-adapter";
import { SelectBase } from "../src/selectBase";
import { AlternativeVisualizersWrapper } from "../src/alternativeVizualizersWrapper";
import { Dashboard } from "../src/dashboard";
import { VisualizationManager } from "../src/visualizationManager";
import { PostponeHelper, VisualizerBase } from "../src/visualizerBase";
import { QuestionTextModel, SurveyModel } from "survey-core";
export * from "../src/wordcloud/wordcloud";
export * from "../src/card";
export * from "../src/text";
export * from "../src/number";
export * from "../src/nps";
export * from "../src/pivot";
export * from "../src/statistics-table";

VisualizerBase.chartAdapterType = ApexChartsAdapter;

test("Strange visualizer in avaiable types list", () => {
  const json = {
    elements: [
      {
        "type": "dropdown",
        "name": "program",
        "title": "Program and specialization",
        "choices": [
          { "value": "item1", "text": "Computer Science" },
          { "value": "item2", "text": "Physics" },
          { "value": "item3", "text": "Chemistry" },
        ],
      },
    ]
  };
  const survey = new SurveyModel(json);
  const dashboard = new Dashboard({
    questions: survey.getAllQuestions(),
    items: ["program"]
  });
  expect(dashboard.items.length).toBe(1);
  const item = dashboard.items[0];
  expect(item.availableTypes).toStrictEqual(["bar", "vbar", "pie", "doughnut"]);
  expect(dashboard.visualizers.length).toBe(1);
  const visualizer = dashboard.visualizers[0] as AlternativeVisualizersWrapper;
  expect(visualizer.type).toBe("alternative");
  expect(visualizer.getVisualizers().length).toBe(2);
  expect(visualizer.getVisualizers()[0].type).toBe("selectBase");
  expect((visualizer.getVisualizers()[0] as SelectBase).chartTypes).toStrictEqual(["bar", "vbar", "pie", "doughnut"]);
  expect(visualizer.getVisualizers()[1].type).toBe("choices");
});

test("Strange visualizer in avaiable types list for boolean question", () => {
  const json = {
    elements: [
      { "type": "boolean", "name": "recommended", "title": "Have you recommended our product?" },
    ]
  };
  const survey = new SurveyModel(json);
  const dashboard = new Dashboard({
    questions: survey.getAllQuestions(),
    data: [{ recommended: true }]
  });
  expect(dashboard.items.length).toBe(1);
  const item = dashboard.items[0];
  expect(item.visualizerTypes).toStrictEqual(["boolean", "options"]);
  expect(item.availableTypes).toStrictEqual(["pie", "doughnut", "bar"]);
  expect(dashboard.visualizers.length).toBe(1);
  const visualizer = dashboard.visualizers[0] as AlternativeVisualizersWrapper;
  expect(visualizer.type).toBe("alternative");
  expect(visualizer.getVisualizers().map(v => v.type)).toStrictEqual(["boolean", "options"]);
  const switchItems = visualizer["getVisualizerSwitchItems"]();
  expect(switchItems.map(i => i.value)).toStrictEqual(["pie", "doughnut", "bar", "options"]);
  expect(switchItems.filter(i => i.text.indexOf("visualizer_") === 0)).toStrictEqual([]);
});