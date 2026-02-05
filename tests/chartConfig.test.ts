import { getVisualizerTypes, getChartTypes, chartConfig } from "../src/chartConfig";

describe("getVisualizerTypes", () => {
  test("should return unique visualizer types from chart keys", () => {
    const chartKeys = ["bar", "pie", "line", "gauge"];
    const result = getVisualizerTypes(chartKeys);
    expect(result).toEqual(["selectBase", "average"]);
  });

  test("should return unique visualizer types when duplicates exist", () => {
    const chartKeys = ["bar", "pie", "bar", "line", "pie"];
    const result = getVisualizerTypes(chartKeys);
    expect(result).toEqual(["selectBase"]);
  });

  test("should return visualizer type from chartConfig when available", () => {
    const chartKeys = ["bar", "wordcloud", "histogram"];
    const result = getVisualizerTypes(chartKeys);
    expect(result).toEqual(["selectBase", "wordcloud", "histogram"]);
  });

  test("should use chart key as visualizer type when not in chartConfig", () => {
    const chartKeys = ["unknownChart", "bar"];
    const result = getVisualizerTypes(chartKeys);
    expect(result).toEqual(["unknownChart", "selectBase"]);
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
    expect(result).toEqual(["selectBase", "ranking", "matrix", "average", "wordcloud", "histogram"]);
  });
});

describe("getChartTypes", () => {
  test("should group chart types by visualizer type", () => {
    const chartKeys = ["bar", "pie", "gauge", "bullet"];
    const result = getChartTypes(chartKeys);
    expect(result).toEqual({
      selectBase: ["bar", "pie"],
      average: ["gauge", "bullet"]
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
      selectBase: ["bar"],
      histogram: ["histogram"]
    });
  });

  test("should handle charts with same visualizer type", () => {
    const chartKeys = ["bar", "pie", "doughnut", "line"];
    const result = getChartTypes(chartKeys);
    expect(result).toEqual({
      selectBase: ["bar", "pie", "doughnut", "line"]
    });
  });

  test("should handle stackedbar with matrix visualizer type", () => {
    const chartKeys = ["stackedbar", "bar"];
    const result = getChartTypes(chartKeys);
    expect(result).toEqual({
      matrix: ["stackedbar"],
      selectBase: ["bar"]
    });
  });

  test("should use chart key as visualizer type when not in chartConfig", () => {
    const chartKeys = ["unknownChart", "bar"];
    const result = getChartTypes(chartKeys);
    expect(result).toEqual({
      selectBase: ["bar"]
    });
  });

  test("should handle all chart types with chartType property", () => {
    const chartKeys = ["bar", "vbar", "stackedbar", "pie", "doughnut", "radar", "line", "scatter", "gauge", "bullet", "ranking"];
    const result = getChartTypes(chartKeys);
    expect(result.selectBase).toEqual(["bar", "vbar", "pie", "doughnut", "line", "scatter"]);
    expect(result.ranking).toEqual(["radar"]);
    expect(result.matrix).toEqual(["stackedbar"]);
    expect(result.average).toEqual(["gauge", "bullet"]);
  });
});
