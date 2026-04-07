import { QuestionDropdownModel } from "survey-core";
import { SelectBase } from "../src/selectBase";
import { NumberModel } from "../src/number";
import { VisualizationPanel } from "../src/visualizationPanel";
import { VisualizerBase } from "../src/visualizerBase";
import { ChartJsAdapter, chartTypes } from "../src/chartjs/chart-adapter";

VisualizerBase.chartAdapterType = ChartJsAdapter;

var adapter: ChartJsAdapter;
var mockModel: SelectBase | VisualizerBase;

test("Use chart type from itemDefinition", () => {
  const itemDefinition = {
    visualizerType: "average",
    chartType: "bullet",
    name: "test",
    visualizer: {
      displayValueName: "count"
    },
    title: "Total answers count"
  };

  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }, {}];
  const visPanel = new VisualizationPanel([itemDefinition], data, {});

  expect(visPanel.visualizers.length).toEqual(1);
  expect(visPanel.visualizers[0].type).toEqual("average");
  expect((visPanel.visualizers[0] as NumberModel).chartType).toEqual("bullet");
  expect((visPanel.visualizers[0] as NumberModel).displayValueName).toEqual("count");
});

test("Determine the default charts", () => {
  const originalTypes = chartTypes["selectBase"];
  const selectQuestion = new QuestionDropdownModel("q1");
  selectQuestion.choices = [
    { value: "option1", text: "Option 1" },
    { value: "option2", text: "Option 2" }
  ];
  const selectData = [
    { q1: "option1" },
    { q1: "option2" },
    { q1: "option1" }
  ];
  mockModel = new SelectBase(selectQuestion, selectData, {});
  adapter = new ChartJsAdapter(mockModel);

  expect(adapter.getChartTypes()).toStrictEqual(["bar", "vbar", "pie", "doughnut"]);

  chartTypes["selectBase"] = ["pie", "bar", "line"];
  expect(adapter.getChartTypes()).toStrictEqual(["pie", "bar", "line"]);

  chartTypes["selectBase"] = originalTypes;
});

test("getChartTypesByVisualizerType returns a copy", () => {
  const originalTypes = chartTypes["selectBase"].slice();
  const adapterTypes = ChartJsAdapter.getChartTypesByVisualizerType("selectBase");
  adapterTypes.push("scatter");

  expect(chartTypes["selectBase"]).toEqual(originalTypes);
});

test("getChartTypesByVisualizerType returns empty array for unknown type", () => {
  const adapterTypes = ChartJsAdapter.getChartTypesByVisualizerType("unknown");
  expect(adapterTypes).toEqual([]);
});
