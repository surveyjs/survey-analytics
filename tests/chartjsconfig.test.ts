import { QuestionDropdownModel, QuestionSelectBase } from "survey-core";
import { SelectBase } from "../src/selectBase";
import { ChartJsSetup } from "../src/chartjs/setup";

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

test("check bar config tick labels", async () => {
  const labelTruncateLength = selectBase.labelTruncateLength;
  selectBase.labelTruncateLength = 5;

  const config = ChartJsSetup.setupBar(selectBase, await selectBase.getAnswersData());
  const tickCallback = config.options.scales.y.ticks.callback;

  expect(tickCallback(0, 0)).toEqual(ChartJsSetup.getTruncatedLabel(config.data.labels[0], 5));
  expect(tickCallback(0, 1)).toEqual(ChartJsSetup.getTruncatedLabel(config.data.labels[1], 5));

  selectBase.labelTruncateLength = labelTruncateLength;
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
