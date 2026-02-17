import { VisualizationPanel } from "../src/visualizationPanel";
export * from "../src/card";

test("Create visualizer by visualizerType", async () => {
  const visualizerDefinition = {
    visualizerType: "card",
    dataName: "test",
    displayValueName: "count",
    title: "Total answers count"
  };

  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }, {}];
  let visPanel = new VisualizationPanel([visualizerDefinition], data, {});

  expect(visPanel.visualizers.length).toEqual(1);
  expect(visPanel.visualizers[0].type).toEqual(visualizerDefinition.visualizerType);
});