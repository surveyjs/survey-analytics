import { WordCloud } from "../src/wordcloud/wordcloud";
import { Text } from "../src/text";
import { SelectBase } from "../src/selectBase";
import { AlternativeVisualizersWrapper } from "../src/alternativeVizualizersWrapper";
import { VisualizationPanel } from "../src/visualizationPanel";
import { Dashboard } from "../src/dashboard";
import { IState } from "../src/config";
import { VisualizationManager } from "../src/visualizationManager";
import { PostponeHelper } from "../src/visualizerBase";
import { IPivotChartVisualizerOptions, PivotModel } from "../src/pivot";
import { NumberModel } from "../src/number";
import { HistogramModel } from "../src/histogram";
import { QuestionTextModel, SurveyModel } from "survey-core";
export * from "../src/card";
export * from "../src/text";
export * from "../src/number";
export * from "../src/nps";
export * from "../src/pivot";

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
  expect(dashboard.panel.visualizers.length).toBe(1);
  expect(dashboard.panel.getElements().length).toBe(1);
  expect(dashboard.panel.getElement("visualizer1")).toStrictEqual({
    "displayName": "",
    "isPublic": true,
    "isVisible": true,
    "name": "visualizer1",
  });
  expect(dashboard.panel.getVisualizer("visualizer1")).toBeDefined();

  const visualizer = dashboard.panel.visualizers[0] as PivotModel;
  expect(visualizer.type).toBe("pivot");
  expect(visualizer.name).toBe("visualizer1");
  expect(visualizer.questions.length).toBe(3);
  expect(visualizer.axisXQuestionName).toBe("question2");
  expect(visualizer.axisYQuestionNames).toStrictEqual(["question1", "question3"]);
});
