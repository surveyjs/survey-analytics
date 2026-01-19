import { getVisualizerTypes, getChartTypes, getVisualizerNameByType, chartConfig } from "../src/chartConfig";

describe("getVisualizerTypes", () => {
  test("should return unique visualizer types from chart keys", () => {
    const chartKeys = ["bar", "pie", "line", "gauge"];
    const result = getVisualizerTypes(chartKeys);
    expect(result).toEqual(["chartmodel", "numbermodel"]);
  });

  test("should return unique visualizer types when duplicates exist", () => {
    const chartKeys = ["bar", "pie", "bar", "line", "pie"];
    const result = getVisualizerTypes(chartKeys);
    expect(result).toEqual(["chartmodel"]);
  });

  test("should return visualizer type from chartConfig when available", () => {
    const chartKeys = ["bar", "wordcloud", "histogram"];
    const result = getVisualizerTypes(chartKeys);
    expect(result).toEqual(["chartmodel", "wordcloudmodel", "histogrammodel"]);
  });

  test("should use chart key as visualizer type when not in chartConfig", () => {
    const chartKeys = ["unknownChart", "bar"];
    const result = getVisualizerTypes(chartKeys);
    expect(result).toEqual(["unknownChart", "chartmodel"]);
  });

  test("should return empty array for empty input", () => {
    const chartKeys: string[] = [];
    const result = getVisualizerTypes(chartKeys);
    expect(result).toEqual([]);
  });

  test("should return null/undefined when input is null", () => {
    const result = getVisualizerTypes(null as any);
    expect(result).toBeNull();
  });

  test("should return undefined when input is undefined", () => {
    const result = getVisualizerTypes(undefined as any);
    expect(result).toBeUndefined();
  });

  test("should handle all chart types from chartConfig", () => {
    const chartKeys = Object.keys(chartConfig);
    const result = getVisualizerTypes(chartKeys);
    expect(result).toContain("chartmodel");
    expect(result).toContain("matrixmodel");
    expect(result).toContain("numbermodel");
    expect(result).toContain("wordcloudmodel");
    expect(result).toContain("histogrammodel");
  });
});

describe("getChartTypes", () => {
  test("should group chart types by visualizer type", () => {
    const chartKeys = ["bar", "pie", "gauge", "bullet"];
    const result = getChartTypes(chartKeys);
    expect(result).toEqual({
      chartmodel: ["bar", "pie"],
      numbermodel: ["gauge", "bullet"]
    });
  });

  test("should return empty object for empty input", () => {
    const chartKeys: string[] = [];
    const result = getChartTypes(chartKeys);
    expect(result).toEqual({});
  });

  test("should return empty object when input is null", () => {
    const result = getChartTypes(null as any);
    expect(result).toEqual({});
  });

  test("should return empty object when input is undefined", () => {
    const result = getChartTypes(undefined as any);
    expect(result).toEqual({});
  });

  test("should exclude charts without chartType property", () => {
    const chartKeys = ["bar", "wordcloud", "histogram"];
    const result = getChartTypes(chartKeys);
    expect(result).toEqual({
      chartmodel: ["bar"],
      histogrammodel: ["vbar"]
    });
  });

  test("should handle charts with same visualizer type", () => {
    const chartKeys = ["bar", "pie", "doughnut", "line"];
    const result = getChartTypes(chartKeys);
    expect(result).toEqual({
      chartmodel: ["bar", "pie", "doughnut", "line"]
    });
  });

  test("should handle stackedbar with matrix visualizer type", () => {
    const chartKeys = ["stackedbar", "bar"];
    const result = getChartTypes(chartKeys);
    expect(result).toEqual({
      matrixmodel: ["stackedbar"],
      chartmodel: ["bar"]
    });
  });

  test("should use chart key as visualizer type when not in chartConfig", () => {
    const chartKeys = ["unknownChart", "bar"];
    const result = getChartTypes(chartKeys);
    expect(result).toEqual({
      chartmodel: ["bar"]
    });
  });

  test("should handle all chart types with chartType property", () => {
    const chartKeys = ["bar", "vbar", "stackedbar", "pie", "doughnut", "radar", "line", "scatter", "gauge", "bullet", "ranking"];
    const result = getChartTypes(chartKeys);
    expect(result.chartmodel).toEqual(["bar", "vbar", "pie", "doughnut", "radar", "line", "scatter"]);
    expect(result.rankingmodel).toEqual(["radar"]);
    expect(result.matrixmodel).toEqual(["stackedbar"]);
    expect(result.numbermodel).toEqual(["gauge", "bullet"]);
  });
});

describe("getVisualizerNameByType", () => {
  test("should return chart names matching visualizer type and chart types", () => {
    const visualizerType = "chartmodel";
    const chartTypes = ["bar", "pie"];
    const result = getVisualizerNameByType(visualizerType, chartTypes);
    expect(result).toEqual(["bar", "pie"]);
  });

  test("should return all charts for visualizer type when chartTypes is empty", () => {
    const visualizerType = "numbermodel";
    const chartTypes: string[] = [];
    const result = getVisualizerNameByType(visualizerType, chartTypes);
    expect(result).toEqual(["gauge", "bullet"]);
  });

  test("should convert selectBase to chart", () => {
    const visualizerType = "chartmodel";
    const chartTypes = ["bar", "pie"];
    const result = getVisualizerNameByType(visualizerType, chartTypes);
    expect(result).toEqual(["bar", "pie"]);
  });

  test("should return empty array when no charts match", () => {
    const visualizerType = "nonexistent";
    const chartTypes = ["bar"];
    const result = getVisualizerNameByType(visualizerType, chartTypes);
    expect(result).toEqual([]);
  });

  test("should filter by chartType when provided", () => {
    const visualizerType = "chartmodel";
    const chartTypes = ["bar"];
    const result = getVisualizerNameByType(visualizerType, chartTypes);
    expect(result).toEqual(["bar"]);
  });

  test("should return charts without chartType when chartTypes array includes them", () => {
    const visualizerType = "wordcloudmodel";
    const chartTypes: string[] = [];
    const result = getVisualizerNameByType(visualizerType, chartTypes);
    expect(result).toEqual(["wordcloud"]);
  });

  test("should handle gauge visualizer type", () => {
    const visualizerType = "numbermodel";
    const chartTypes = ["gauge", "bullet"];
    const result = getVisualizerNameByType(visualizerType, chartTypes);
    expect(result).toEqual(["gauge", "bullet"]);
  });

  test("should handle matrix visualizer type", () => {
    const visualizerType = "matrixmodel";
    const chartTypes = ["stackedbar"];
    const result = getVisualizerNameByType(visualizerType, chartTypes);
    expect(result).toEqual(["stackedbar"]);
  });

  test("should handle histogram visualizer type", () => {
    const visualizerType = "histogrammodel";
    const chartTypes: string[] = [];
    const result = getVisualizerNameByType(visualizerType, chartTypes);
    expect(result).toContain("histogram");
  });
});
