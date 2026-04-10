import { CardVisualizer, ResponseCountVisualizer } from "../src/card";
import { VisualizationPanel } from "../src/visualizationPanel";
import { NumberModel } from "../src/number";
export * from "../src/card";

test("Create visualizer by visualizerType", async () => {
  const itemDefinition = {
    visualizerType: "card",
    name: "test",
    visualizer: {
      displayValueName: "count"
    },
    title: "Total answers count"
  };

  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }, {}];
  let visPanel = new VisualizationPanel([itemDefinition], data, {});

  expect(visPanel.visualizers.length).toEqual(1);
  expect(visPanel.visualizers[0].type).toEqual(itemDefinition.visualizerType);
  expect((visPanel.visualizers[0] as CardVisualizer).displayValueName).toEqual("count");
});

test("ResponseCountVisualizer: type is responsecount", () => {
  const data = [{ q1: "a" }, { q1: "b" }, { q1: "c" }];
  const visPanel = new VisualizationPanel(
    [{ visualizerType: "responsecount", name: "responsecount" }],
    data,
    {}
  );

  expect(visPanel.visualizers.length).toBe(1);
  expect(visPanel.visualizers[0].type).toBe("responsecount");
});

test("ResponseCountVisualizer: displayValueName defaults to count", () => {
  const data = [{ q1: "a" }, { q1: "b" }];
  const visPanel = new VisualizationPanel(
    [{ visualizerType: "responsecount", name: "responsecount" }],
    data,
    {}
  );

  expect((visPanel.visualizers[0] as ResponseCountVisualizer).displayValueName).toBe("count");
});

test("ResponseCountVisualizer: default title is 'Total responses'", () => {
  const data = [{ q1: "a" }];
  const visPanel = new VisualizationPanel(
    [{ visualizerType: "responsecount", name: "responsecount" }],
    data,
    {}
  );

  const visualizer = visPanel.visualizers[0] as ResponseCountVisualizer;
  expect(visualizer.provideTitle).toBe(true);
  expect(visualizer.title).toBe("Total responses");
});

test("ResponseCountVisualizer: pass custom title", () => {
  const data = [{ q1: "a" }];
  const visPanel = new VisualizationPanel(
    [{ visualizerType: "responsecount", name: "responsecount", title: "Custom Title" }],
    data,
    {}
  );

  const visualizer = visPanel.visualizers[0] as ResponseCountVisualizer;
  expect(visualizer.provideTitle).toBe(undefined);
  expect(visualizer.title).toBe("Custom Title");
});

test("ResponseCountVisualizer: getCalculatedValues returns correct response count", async () => {
  const data = [{ q1: "a" }, { q1: "b" }, { q1: "c" }];
  const visPanel = new VisualizationPanel(
    [{ visualizerType: "responsecount", name: "responsecount" }],
    data,
    {}
  );

  const visualizer = visPanel.visualizers[0] as NumberModel;
  const result = await visualizer.getCalculatedValues();

  expect(result.values).toContain("count");
  expect(result.data[0][result.values.indexOf("count")]).toBe(3);
});

test("ResponseCountVisualizer: count is zero for empty data", async () => {
  const data: Array<{ [key: string]: any }> = [];
  const visPanel = new VisualizationPanel(
    [{ visualizerType: "responsecount", name: "responsecount" }],
    data,
    {}
  );

  const visualizer = visPanel.visualizers[0] as NumberModel;
  const result = await visualizer.getCalculatedValues();

  expect(result.data[0][result.values.indexOf("count")]).toBe(0);
});

test("ResponseCountVisualizer: count reflects all rows regardless of field values", async () => {
  const data = [{}, {}, { q1: "x" }, {}];
  const visPanel = new VisualizationPanel(
    [{ visualizerType: "responsecount", name: "responsecount" }],
    data,
    {}
  );

  const visualizer = visPanel.visualizers[0] as NumberModel;
  const result = await visualizer.getCalculatedValues();

  expect(result.data[0][result.values.indexOf("count")]).toBe(4);
});

test("ResponseCountVisualizer: is instance of CardVisualizer", () => {
  const data = [{ q1: "a" }];
  const visPanel = new VisualizationPanel(
    [{ visualizerType: "responsecount", name: "responsecount" }],
    data,
    {}
  );

  expect(visPanel.visualizers[0]).toBeInstanceOf(ResponseCountVisualizer);
  expect(visPanel.visualizers[0]).toBeInstanceOf(CardVisualizer);
});

test("ResponseCountVisualizer: created via VisualizationPanel with visualizerType string", async () => {
  const data = [{ q1: 1 }, { q1: 2 }, { q1: 3 }, { q1: 4 }, { q1: 5 }];
  const visPanel = new VisualizationPanel(
    [{ visualizerType: "responsecount", name: "responsecount" }],
    data,
    {}
  );

  const visualizer = visPanel.visualizers[0] as NumberModel;
  const result = await visualizer.getCalculatedValues();

  expect(visualizer.type).toBe("responsecount");
  expect(result.data[0][result.values.indexOf("count")]).toBe(5);
});