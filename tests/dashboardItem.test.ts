import { SurveyModel } from "survey-core";
import { DashboardItem } from "../src/dashboard-item";
import { AlternativeVisualizersWrapper } from "../src/alternativeVizualizersWrapper";
import { ApexChartsAdapter } from "../src/apexcharts/chart-adapter";
import { VisualizerBase } from "../src/visualizerBase";
import { VisualizerFactory } from "../src/visualizerFactory";

export * from "../src/card";
export * from "../src/text";
export * from "../src/number";
export * from "../src/nps";
export * from "../src/histogram";

VisualizerBase.chartAdapterType = ApexChartsAdapter;

test("constructor should use option name and option title", () => {
  const survey = new SurveyModel({
    elements: [{ type: "checkbox", name: "q1", title: "Question title" }],
  });
  const question = survey.getQuestionByName("q1");

  const item = new DashboardItem({ name: "custom-name", dataField: "q1", type: "bar", title: "Option title" } as any, question);

  expect(item.name).toBe("custom-name");
  expect(item.title).toBe("Option title");
  expect(item.question).toBe(question);
});

test("constructor with question should initialize requested chart type", () => {
  const survey = new SurveyModel({
    elements: [{ type: "checkbox", name: "q1" }],
  });
  const question = survey.getQuestionByName("q1");

  const item = new DashboardItem({ dataField: "q1", type: "pie", availableTypes: ["bar", "pie"] } as any, question);

  expect(item.visualizerType).toBe("selectBase");
  expect(item.type).toBe("pie");
  expect(item.chartType).toBe("pie");
  expect(item.availableTypes).toStrictEqual(["bar", "pie"]);
});

test("constructor with question should keep unknown requested visualizer type", () => {
  const survey = new SurveyModel({
    elements: [{ type: "checkbox", name: "q1" }],
  });
  const question = survey.getQuestionByName("q1");

  const item = new DashboardItem({ dataField: "q1", type: "custom-viz", availableTypes: ["custom-viz"] } as any, question);

  expect(item.visualizerType).toBe("custom-viz");
  expect(item.visualizerTypes?.includes("custom-viz")).toBeTruthy();
  expect(item.type).toBe("custom-viz");
});

test("constructor without question should initialize from chart config", () => {
  const item = new DashboardItem({
    dataField: "score",
    type: "gauge",
    availableTypes: ["gauge", "bullet"],
    title: "Score",
    displayValueName: "Score display",
  } as any);

  expect(item.visualizerType).toBe("average");
  expect(item.chartType).toBe("gauge");
  expect(item.visualizerTypes).toStrictEqual(["average"]);
  expect(item.availableTypes).toStrictEqual(["gauge", "bullet"]);
  expect(item.name).toBe("score");
  expect(item.dataField).toBe("score");
  expect(item.title).toBe("Score");
  expect(item.question.name).toBe("score");
  expect(item.question.valueName).toBe("score");
  expect(item.question.title).toBe("Score");
  expect(item.question.displayValueName).toBe("Score display");
});

test("constructor without question should keep custom type when no chart config exists", () => {
  const item = new DashboardItem({
    dataField: "score",
    type: "custom",
    availableTypes: ["custom"],
  } as any);

  expect(item.visualizerType).toBe("custom");
  expect(item.chartType).toBeUndefined();
  expect(item.visualizerTypes).toStrictEqual(["custom"]);
  expect(item.availableTypes).toStrictEqual([]);
  expect(item.type).toBe("custom");
});

test("dataField getter should fallback to question valueName then name", () => {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1" }],
  });
  const question = survey.getQuestionByName("q1");
  question.valueName = "storedValue";

  const item = new DashboardItem({ type: "wordcloud" } as any, question);

  expect(item.dataField).toBe("storedValue");
  item.dataField = "override";
  expect(item.dataField).toBe("override");
});

test("title getter/setter should proxy displayName", () => {
  const item = new DashboardItem({ dataField: "q1", type: "wordcloud", title: "Initial" } as any);

  expect(item.title).toBe("Initial");
  item.title = "Updated";
  expect(item.title).toBe("Updated");
  expect(item.displayName).toBe("Updated");
});

test("state should include type property", () => {
  const item = new DashboardItem({ dataField: "q1", type: "wordcloud" } as any);

  const state = item.getState();

  expect(state.name).toBe("q1");
  expect(state.type).toBe("wordcloud");
  expect(state.isVisible).toBe(true);
  expect(state.isPublic).toBe(true);
});

test("visualizerType setter should switch wrapper visualizer and sync item type from current chart", () => {
  const item = new DashboardItem({ dataField: "q1", type: "bar", availableTypes: ["bar", "gauge"] } as any);
  const wrappedVisualizer: any = { chartType: "gauge" };
  const fakeWrapper: any = {
    setVisualizer: jest.fn(),
    getVisualizer: jest.fn(() => wrappedVisualizer),
  };
  Object.setPrototypeOf(fakeWrapper, AlternativeVisualizersWrapper.prototype);
  item.visualizerInstance = fakeWrapper;

  item.visualizerType = "average";

  expect(fakeWrapper.setVisualizer).toHaveBeenCalledWith("average");
  expect(item.type).toBe("gauge");
});

test("visualizerType setter should do nothing when value is unchanged", () => {
  const item = new DashboardItem({ dataField: "q1", type: "bar", availableTypes: ["bar", "gauge"] } as any);
  const fakeWrapper: any = {
    setVisualizer: jest.fn(),
    getVisualizer: jest.fn(() => ({ chartType: "bar" })),
  };
  Object.setPrototypeOf(fakeWrapper, AlternativeVisualizersWrapper.prototype);
  item.visualizerInstance = fakeWrapper;

  expect(item.visualizerType).toBe("selectBase");
  item.visualizerType = "selectBase";

  expect(fakeWrapper.setVisualizer).not.toHaveBeenCalled();
});

test("type setter should update chart type via current visualizer", () => {
  const item = new DashboardItem({ dataField: "q1", type: "bar", availableTypes: ["bar", "pie"] } as any);
  const fakeVisualizer: any = {
    setChartType: jest.fn(),
  };
  item.visualizerInstance = fakeVisualizer;

  item.type = "pie";

  expect(item.visualizerType).toBe("selectBase");
  expect(fakeVisualizer.setChartType).toHaveBeenCalledWith("pie");
  expect(item.type).toBe("pie");
});

test("type setter should route through wrapper and change visualizer type", () => {
  const item = new DashboardItem({ dataField: "q1", type: "bar", availableTypes: ["bar", "bullet"] } as any);
  const wrappedVisualizer: any = {
    chartType: "bar",
    setChartType: jest.fn(),
  };
  const fakeWrapper: any = {
    setVisualizer: jest.fn(),
    getVisualizer: jest.fn(() => wrappedVisualizer),
  };
  Object.setPrototypeOf(fakeWrapper, AlternativeVisualizersWrapper.prototype);
  item.visualizerInstance = fakeWrapper;

  item.type = "bullet";

  expect(fakeWrapper.setVisualizer).toHaveBeenCalledWith("average");
  expect(wrappedVisualizer.setChartType).toHaveBeenCalledWith("bullet");
  expect(item.visualizerType).toBe("average");
  expect(item.type).toBe("bullet");
});

test("type setter should still update type for unsupported values", () => {
  const item = new DashboardItem({ dataField: "q1", type: "bar", availableTypes: ["bar", "pie"] } as any);
  const fakeVisualizer: any = {
    setChartType: jest.fn(),
  };
  item.visualizerInstance = fakeVisualizer;

  item.type = "not-supported";

  expect(fakeVisualizer.setChartType).not.toHaveBeenCalled();
  expect(item.type).toBe("not-supported");
  expect(item.visualizerType).toBe("selectBase");
});

test("availableTypes setter should reinitialize types and keep initially passed options.availableTypes", () => {
  const item = new DashboardItem({ dataField: "q1", type: "bar", availableTypes: ["bar", "pie"] } as any);

  item.availableTypes = ["bullet"];

  expect(item.availableTypes).toStrictEqual(["bullet"]);
  expect(item.type).toBe("bullet");
  expect(item.visualizerType).toBe("average");

  item.availableTypes = undefined as any;

  expect(item.availableTypes).toStrictEqual(["bar", "pie"]);
  expect(item.type).toBe("bar");
  expect(item.visualizerType).toBe("selectBase");
});

test("availableTypes setter should recreate visualizer and restore its state", () => {
  const item = new DashboardItem({ dataField: "q1", type: "bar", availableTypes: ["bar", "pie", "bullet"] } as any);
  const oldVisualizer: any = {
    destroy: jest.fn(),
    getState: jest.fn(() => ({ customState: true })),
    onUpdate: jest.fn(),
    options: { optionKey: "value" },
    data: [{ q1: 1 }],
  };
  const newVisualizer: any = {
    setState: jest.fn(),
    render: jest.fn(),
  };
  item.visualizerInstance = oldVisualizer;

  const createSpy = jest.spyOn(VisualizerFactory, "createVisualizer").mockReturnValue(newVisualizer);

  item.availableTypes = ["bullet"];

  expect(oldVisualizer.destroy).toHaveBeenCalled();
  expect(createSpy).toHaveBeenCalled();
  expect(item.visualizerInstance).toBe(newVisualizer);
  expect(newVisualizer.setState).toHaveBeenCalledWith({ customState: true });
  createSpy.mockRestore();
});

test("availableTypes setter should rerender recreated visualizer when item is rendered", () => {
  const item = new DashboardItem({ dataField: "q1", type: "bar", availableTypes: ["bar", "pie", "bullet"] } as any);
  const renderHost = document.createElement("div");
  const oldVisualizer: any = {
    destroy: jest.fn(),
    getState: jest.fn(() => ({ customState: true })),
    onUpdate: jest.fn(),
    options: {},
    data: [],
    renderResult: renderHost,
  };
  const newVisualizer: any = {
    setState: jest.fn(),
    render: jest.fn(),
  };
  item.visualizerInstance = oldVisualizer;
  item.renderedElement = document.createElement("div");

  const createSpy = jest.spyOn(VisualizerFactory, "createVisualizer").mockReturnValue(newVisualizer);

  item.availableTypes = ["bullet"];

  expect(newVisualizer.render).toHaveBeenCalledWith(renderHost, false);
  createSpy.mockRestore();
});
