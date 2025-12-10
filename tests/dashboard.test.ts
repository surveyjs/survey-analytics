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
import { LayoutEngine } from "../src/layout-engine";
import { NumberModel } from "../src/number";
import { HistogramModel } from "../src/histogram";
import { QuestionTextModel, SurveyModel } from "survey-core";
export * from "../src/card";
export * from "../src/text";
export * from "../src/number";
export * from "../src/nps";
export * from "../src/pivot";

test("Dashboard should accept visualizer definitions", () => {
  const visualizerDefinition = {
    type: "nps",
    dataField: "test"
  };
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition] });
  expect(dashboard.panel.visualizers.length).toBe(1);
  expect(dashboard.panel.visualizers[0].type).toBe("nps");

  dashboard = new Dashboard({ visualizers: [visualizerDefinition, visualizerDefinition] });
  expect(dashboard.panel.visualizers.length).toBe(2);
  expect(dashboard.panel.visualizers[0].type).toBe("nps");
  expect(dashboard.panel.visualizers[1].type).toBe("nps");
});

test("Dashboard should accept questions", () => {
  const json = {
    elements: [
      { type: "text", name: "question1" },
      { type: "text", name: "question2" },
      { type: "text", name: "question3" },
    ],
  };
  const survey = new SurveyModel(json);
  let dashboard = new Dashboard({ questions: survey.getAllQuestions() });
  expect(dashboard.panel.visualizers.length).toBe(3);
  expect(dashboard.panel.visualizers[0].type).toBe("text");
  expect(dashboard.panel.visualizers[0].dataNames).toStrictEqual(["question1"]);
  expect(dashboard.panel.visualizers[1].type).toBe("text");
  expect(dashboard.panel.visualizers[1].dataNames).toStrictEqual(["question2"]);
  expect(dashboard.panel.visualizers[2].type).toBe("text");
  expect(dashboard.panel.visualizers[2].dataNames).toStrictEqual(["question3"]);
});

test("Dashboard should show questions mentioned in visualazers parameter", () => {
  const json = {
    elements: [
      { type: "text", name: "question1" },
      { type: "text", name: "question2" },
      { type: "text", name: "question3" },
    ],
  };
  const survey = new SurveyModel(json);
  let dashboard = new Dashboard({ questions: survey.getAllQuestions(), visualizers: ["question2", "question3"] });
  expect(dashboard.panel.visualizers.length).toBe(2);
  expect(dashboard.panel.visualizers[0].type).toBe("text");
  expect(dashboard.panel.visualizers[0].dataNames).toStrictEqual(["question2"]);
  expect(dashboard.panel.visualizers[1].type).toBe("text");
  expect(dashboard.panel.visualizers[1].dataNames).toStrictEqual(["question3"]);
});

test("Create nps visualizer from definition with dataName", async () => {
  const visualizerDefinition = {
    type: "nps",
    dataField: "test"
  };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition], data });
  const nps = dashboard.panel.visualizers[0];

  let result: any = await nps.getCalculatedValues();

  expect(result).toStrictEqual({
    "data": [[1, 2, 3, 6]],
    "values": ["detractors", "passive", "promoters", "total"],
  });
});

test("Create nps visualizer from definition with questionName", async () => {
  const visualizerDefinition = {
    type: "nps",
    dataField: "test"
  };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition], data });
  const nps = dashboard.panel.visualizers[0];

  let result: any = (await nps.getCalculatedValues());

  expect(result).toStrictEqual({
    "data": [[1, 2, 3, 6]],
    "values": ["detractors", "passive", "promoters", "total"],
  });
});

test("Create nps visualizer from definition with question", async () => {
  const visualizerDefinition = {
    type: "nps",
    dataField: "test"
  };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition], questions: [new QuestionTextModel("test")], data });
  const nps = dashboard.panel.visualizers[0];

  let result: any = (await nps.getCalculatedValues());

  expect(result).toStrictEqual({
    "data": [[1, 2, 3, 6]],
    "values": ["detractors", "passive", "promoters", "total"],
  });
});

test("Create number visualizer from definition", async () => {
  const visualizerDefinition = {
    type: "card",
    dataField: "test",
    aggregationType: "count"
  };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }, {}];
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition], data });
  const numberVis = dashboard.panel.visualizers[0] as NumberModel;

  let result: any = (await numberVis.getCalculatedValues()).data[0];

  expect(result).toStrictEqual([7.34, 1, 10, 7]);
  expect(numberVis.dataNames[0]).toEqual(visualizerDefinition.dataField);
  expect(numberVis.name.indexOf("visualizer")).toEqual(0);
  expect(dashboard.panel.visibleElements[0].name.indexOf("visualizer")).toEqual(0);
});

test("Options passed to root panel and visualizer", async () => {
  const visualizerDefinition = {
    type: "gauge",
    dataField: "test",
    aggregationType: "count",
    someVisualizerOption: "vis"
  };
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition], somePanelOption: "panel" });
  expect(Object.keys(dashboard.panel.options)).toStrictEqual(["somePanelOption"]);
  expect((dashboard.panel.options as any).somePanelOption).toEqual("panel");
  expect(dashboard.panel.visualizers.length).toBe(1);

  const visualizer = dashboard.panel.visualizers[0] as NumberModel;
  expect(visualizer.options.someVisualizerOption).toEqual("vis");
  expect(visualizer.options.somePanelOption).toEqual("panel");
  expect(visualizer.type).toBe("number");
  expect(visualizer.dataNames[0]).toEqual(visualizerDefinition.dataField);
});

test("Create pivot visualizer with empty config", async () => {
  const visualizerDefinition: any = {
    type: "pivot",
  };
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition] });
  expect(dashboard.panel.visualizers.length).toBe(1);
  const visualizer = dashboard.panel.visualizers[0] as PivotModel;
  expect(visualizer.type).toBe("pivot");
});

test("Create pivot visualizer with questions", async () => {
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
    questions: survey.getAllQuestions()
  };
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition] });
  expect(dashboard.panel.visualizers.length).toBe(1);
  const visualizer = dashboard.panel.visualizers[0] as PivotModel;
  expect(visualizer.type).toBe("pivot");
  expect(visualizer.questions.length).toBe(3);
  expect(visualizer.axisXQuestionName).toBe("question1");
  expect(visualizer.axisYQuestionNames).toStrictEqual([]);
});

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
  expect(dashboard.panel.getVisualizer("visualizer1")).toBeDefined();
  expect(dashboard.panel.getElement("visualizer1")).toStrictEqual({
    "displayName": "",
    "isPublic": true,
    "isVisible": true,
    "name": "visualizer1",
  });
  const visualizer = dashboard.panel.visualizers[0] as PivotModel;
  expect(visualizer.type).toBe("pivot");
  expect(visualizer.name).toBe("visualizer1");
  expect(visualizer.questions.length).toBe(3);
  expect(visualizer.axisXQuestionName).toBe("question2");
  expect(visualizer.axisYQuestionNames).toStrictEqual(["question1", "question3"]);
});
