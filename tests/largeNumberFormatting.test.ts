import { QuestionDropdownModel } from "survey-core";
import { SelectBase } from "../src/selectBase";
import { ChartJsSetup } from "../src/chartjs/setup";
import { PlotlySetup } from "../src/plotly/setup";
import { ApexChartsSetup } from "../src/apexcharts/setup";
import { IAnswersData } from "../src/visualizerBase";

const largeNumberAnswersData: IAnswersData = {
  datasets: [[15600, 1250000, 2000000, 2530000]],
  labels: ["Item A", "Item B", "Item C", "Item D"],
  colors: ["#f00", "#0f0", "#00f", "#ff0"],
  texts: [[15600, 1250000, 2000000, 2530000]],
  seriesLabels: ["Series 1"],
  values: ["item_a", "item_b", "item_c", "item_d"],
};

const choices = [
  { value: "item_a", text: "Item A" },
  { value: "item_b", text: "Item B" },
  { value: "item_c", text: "Item C" },
  { value: "item_d", text: "Item D" },
];

const question = new QuestionDropdownModel("q1");
question.choices = choices;
const data = [{ q1: "item_a" }];
const selectBase = new SelectBase(question, data, {});

describe("ChartJs large number formatting", () => {
  test("setupBar x-axis tick callback formats large numbers", () => {
    const config = ChartJsSetup.setupBar(selectBase, largeNumberAnswersData);
    const tickCallback = config.options.scales.x.ticks.callback;
    expect(tickCallback(15600, 0)).toBe("15.6K");
    expect(tickCallback(1250000, 0)).toBe("1.25M");
    expect(tickCallback(5000, 0)).toBe("5000");
  });

  test("setupBar datalabels formatter formats large values", () => {
    const config = ChartJsSetup.setupBar(selectBase, largeNumberAnswersData);
    const formatter = config.options.plugins.datalabels.formatter;
    const result = formatter(1250000, { datasetIndex: 0, dataIndex: 1 });
    expect(result).toBe("1.25M");
  });

  test("setupVBar y-axis tick callback formats large numbers", () => {
    const config = ChartJsSetup.setupVBar(selectBase, largeNumberAnswersData);
    const yScale = config.options.scales.y;
    const tickCallback = yScale.ticks.callback;
    expect(tickCallback(2530000, 0)).toBe("2.53M");
    expect(tickCallback(500, 0)).toBe("500");
  });

  test("setupVBar datalabels formatter formats large values", () => {
    const config = ChartJsSetup.setupVBar(selectBase, largeNumberAnswersData);
    const formatter = config.options.plugins.datalabels.formatter;
    const result = formatter(2000000, { datasetIndex: 0, dataIndex: 2 });
    expect(result).toBe("2M");
  });

  test("setupStackedBar x-axis tick callback formats large numbers", () => {
    const config = ChartJsSetup.setupStackedBar(selectBase, largeNumberAnswersData);
    const tickCallback = config.options.scales.x.ticks.callback;
    expect(tickCallback(15600, 0)).toBe("15.6K");
  });
});

describe("Plotly large number formatting", () => {
  test("setupBar trace text contains formatted values", () => {
    const plotlyOptions = PlotlySetup.setupBar(selectBase, largeNumberAnswersData);
    const trace = plotlyOptions.traces[0];
    expect(trace.text).toContain("15.6K");
    expect(trace.text).toContain("1.25M");
    expect(trace.text).toContain("2M");
    expect(trace.text).toContain("2.53M");
  });

  test("setupBar xaxis has formatted tick values", () => {
    const plotlyOptions = PlotlySetup.setupBar(selectBase, largeNumberAnswersData);
    const xaxis = plotlyOptions.layout.xaxis;
    expect(xaxis.tickmode).toBe("array");
    expect(xaxis.tickvals).toBeDefined();
    expect(xaxis.ticktext).toBeDefined();
    expect(xaxis.ticktext.length).toBeGreaterThan(0);
  });

  test("setupVBar trace text contains formatted values", () => {
    const plotlyOptions = PlotlySetup.setupVBar(selectBase, largeNumberAnswersData);
    const trace = plotlyOptions.traces[0];
    expect(trace.text).toContain("15.6K");
    expect(trace.text).toContain("2.53M");
  });

  test("setupVBar yaxis has formatted tick values", () => {
    const plotlyOptions = PlotlySetup.setupVBar(selectBase, largeNumberAnswersData);
    const yaxis = plotlyOptions.layout.yaxis;
    expect(yaxis.tickmode).toBe("array");
    expect(yaxis.tickvals).toBeDefined();
    expect(yaxis.ticktext).toBeDefined();
  });
});

describe("ApexCharts large number formatting", () => {
  test("setupBar xaxis labels has formatter", () => {
    const config = ApexChartsSetup.setupBar(selectBase, largeNumberAnswersData);
    expect(config.xaxis.labels.formatter).toBeDefined();
    expect(config.xaxis.labels.formatter(15600)).toBe("15.6K");
    expect(config.xaxis.labels.formatter(2530000)).toBe("2.53M");
    expect(config.xaxis.labels.formatter(500)).toBe("500");
  });

  test("setupBar datalabels formatter formats large values", () => {
    const config = ApexChartsSetup.setupBar(selectBase, largeNumberAnswersData);
    const formatter = config.dataLabels.formatter;
    const result = formatter(1250000, { seriesIndex: 0, dataPointIndex: 1 });
    expect(result).toBe("1.25M");
  });

  test("setupVBar yaxis labels has formatter", () => {
    const config = ApexChartsSetup.setupVBar(selectBase, largeNumberAnswersData);
    const yaxis = Array.isArray(config.yaxis) ? config.yaxis[0] : config.yaxis;
    expect(yaxis.labels.formatter).toBeDefined();
    expect(yaxis.labels.formatter(2000000)).toBe("2M");
    expect(yaxis.labels.formatter(500)).toBe("500");
  });

  test("setupVBar datalabels formatter formats large values", () => {
    const config = ApexChartsSetup.setupVBar(selectBase, largeNumberAnswersData);
    const formatter = config.dataLabels.formatter;
    const result = formatter(2530000, { seriesIndex: 0, dataPointIndex: 3 });
    expect(result).toBe("2.53M");
  });
});
