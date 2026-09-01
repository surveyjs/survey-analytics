import { QuestionDropdownModel, QuestionSelectBase } from "survey-core";
import { SelectBase } from "../src/selectBase";
import { ChartJsSetup } from "../src/chartjs/setup";
import { HistogramModel } from "../src/histogram";
import { NumberModel } from "../src/number";

const choices = [
  { value: "father", text: "father_text" },
  { value: "mother", text: "mother_text" },
  { value: "brother", text: "brother_text" },
  { value: "sister", text: "sister_text" },
  { value: "son", text: "son_text" },
  { value: "daughter", text: "daughter_text" },
];

const question = new QuestionDropdownModel("q1");
question.choices = choices;

const data = [
  { q1: "mother" },
  { q1: "father" },
  { q1: "father" },
  { q1: "sister" },
];

const selectBase = new SelectBase(question, data, {});

test("check bar height with different numbers of choices", async () => {
  let config = ChartJsSetup.setupBar(selectBase, await selectBase.getAnswersData());
  expect(config.height).toEqual(250);

  (selectBase.question as QuestionSelectBase).choices = [
    { value: "add1" },
    { value: "add2" },
    { value: "add3" },
    { value: "add4" },
    { value: "add5" },
  ].concat(choices);

  config = ChartJsSetup.setupBar(selectBase, await selectBase.getAnswersData());
  expect(config.height).toEqual(400);

  (selectBase.question as QuestionSelectBase).choices = choices;
});

function createBarLabelContext(options: {
  value: number,
  width?: number,
  height?: number,
  fontSize?: number,
  measureWidth?: (text: string) => number,
}): any {
  const { value, width = 200, height = 40, fontSize = 14, measureWidth } = options;
  return {
    dataIndex: 0,
    datasetIndex: 0,
    dataset: { data: [value] },
    chart: {
      ctx: {
        font: "",
        measureText: (text: string) => ({
          width: measureWidth ? measureWidth(text) : String(text).length * 8,
        }),
      },
      getDatasetMeta: () => ({
        data: [{ width, height }],
      }),
      options: {
        plugins: {
          datalabels: {
            font: { size: fontSize, family: "Arial", weight: "normal" },
          },
        },
      },
    },
  };
}

test("hide bar datalabels that do not fit inside the bar", () => {
  expect(ChartJsSetup.shouldDisplayBarDataLabel(createBarLabelContext({ value: 0, width: 200, height: 40 }))).toBe(false);

  expect(ChartJsSetup.shouldDisplayBarDataLabel(
    createBarLabelContext({ value: 12, width: 200, height: 40 }),
    (val) => String(val)
  )).toBe(true);

  expect(ChartJsSetup.shouldDisplayBarDataLabel(
    createBarLabelContext({ value: 12, width: 10, height: 40 }),
    () => "1.25M (99.99%)"
  )).toBe(false);

  expect(ChartJsSetup.shouldDisplayBarDataLabel(
    createBarLabelContext({ value: 12, width: 200, height: 8 }),
    (val) => String(val)
  )).toBe(false);
});

test("bar datalabels hide overflow but keep tooltip enabled", async () => {
  const barConfig = ChartJsSetup.setupBar(selectBase, await selectBase.getAnswersData());
  expect(typeof barConfig.options.plugins.datalabels.display).toBe("function");
  expect(barConfig.options.plugins.tooltip.enabled).toBe(true);

  const vbarConfig = ChartJsSetup.setupVBar(selectBase, await selectBase.getAnswersData());
  expect(typeof vbarConfig.options.plugins.datalabels.display).toBe("function");
  expect(vbarConfig.options.plugins.tooltip.enabled).toBe(true);

  const stackedConfig = ChartJsSetup.setupStackedBar(selectBase, await selectBase.getAnswersData());
  expect(typeof stackedConfig.options.plugins.datalabels.display).toBe("function");
  expect(stackedConfig.options.plugins.tooltip.enabled).toBe(true);
});

test("check bar tooltip config with showPercentages", async () => {
  selectBase.showPercentages = true;
  const config = ChartJsSetup.setupBar(selectBase, await selectBase.getAnswersData());
  const labelCallback = config.options.plugins.tooltip.callbacks.label;

  const label = labelCallback({
    datasetIndex: 0,
    dataIndex: 0,
    parsed: { x: 2 }
  });

  expect(label).toContain("2 (");
  expect(label).toContain("%)");

  selectBase.showPercentages = false;
});

test("getTruncatedLabel method", () => {
  const label = "Some very very very very long string for unit testing !";

  expect(ChartJsSetup.getTruncatedLabel(label, -1).length).toBe(55);
  expect(ChartJsSetup.getTruncatedLabel(label, null as any).length).toBe(55);
  expect(ChartJsSetup.getTruncatedLabel(label, 125).length).toBe(55);

  expect(ChartJsSetup.getTruncatedLabel(label, 5).indexOf("...")).not.toBe(-1);
  expect(ChartJsSetup.getTruncatedLabel(label, 5).length).toBe(8);

  expect(ChartJsSetup.getTruncatedLabel(label, 50).indexOf("...")).not.toBe(-1);
  expect(ChartJsSetup.getTruncatedLabel(label, 50).length).toBe(53);
});

test("left non-empty pies only for hasSeries mode", async () => {
  const answersData = {
    datasets: [
      [0, 0, 0],
      [1, 2, 3],
      [0, 0, 0],
    ],
    labels: ["A", "B", "C"],
    colors: ["#111111", "#222222", "#333333"],
    texts: [
      ["0", "0", "0"],
      ["16.7", "33.3", "50"],
      ["0", "0", "0"],
    ],
    seriesLabels: ["s1", "s2", "s3"],
    values: ["A", "B", "C"],
  } as any;

  const config = ChartJsSetup.setupPie(selectBase, answersData);

  expect(config.hasSeries).toBeTruthy();
  expect(config.pieSeries.length).toEqual(1);
  expect(config.pieSeries[0].title).toEqual("s2");
  expect(config.height).toEqual(250);
});

test("vertical histogram bars use full category width", async () => {
  const histogramQuestion: any = {
    getType: () => "text",
    type: "text",
    inputType: "number",
    name: "age",
  };
  const histogramData = [
    { age: 17 },
    { age: 18 },
    { age: 18 },
    { age: 19 },
    { age: 20 },
    { age: 21 },
  ];
  const histogram = new HistogramModel(histogramQuestion, histogramData);

  const config = ChartJsSetup.setupVBar(histogram, await histogram.getAnswersData());
  const firstDataset = config.data.datasets[0] as any;

  expect(firstDataset.barPercentage).toBe(1);
  expect(firstDataset.categoryPercentage).toBe(1);
});

test("gauge setup includes custom value plugin with default offsetY", () => {
  const model = {
    displayValueName: "value",
    dataType: "number",
    theme: {
      gaugeBarColor: "#00aa00",
      gaugeBackground: "#dddddd",
      gaugeValueFont: {
        color: "#111111",
        size: "14",
        family: "Arial",
        weight: "bold",
      },
    },
  } as any as NumberModel;

  const answersData = {
    datasets: [[42, 0, 100]],
    values: ["value", "min", "max"],
  } as any;

  const config = ChartJsSetup.setupGauge(model, answersData);

  expect(config.type).toBe("doughnut");
  expect(config.options.plugins.saGaugeValue.text).toBe("42");
  expect(config.options.plugins.saGaugeValue.offsetY).toBe(0);
});

test("gauge setup falls back to 0 and noData title for invalid values", () => {
  const model = {
    name: "Average score",
    displayValueName: "value",
    dataType: "number",
    theme: {
      gaugeBarColor: "#00aa00",
      gaugeBackground: "#dddddd",
      gaugeValueFont: {
        color: "#111111",
        size: "14",
        family: "Arial",
        weight: "bold",
      },
    },
  } as any as NumberModel;

  const answersData = {
    datasets: [[NaN, 0, NaN]],
    values: ["value", "min", "max"],
  } as any;

  const config = ChartJsSetup.setupGauge(model, answersData);

  expect(config.options.plugins.saGaugeValue.text).toBe("0");
  expect(config.data.labels[0]).toBe("No data");
  expect(config.data.datasets[0].data[0]).toBe(0);
});
