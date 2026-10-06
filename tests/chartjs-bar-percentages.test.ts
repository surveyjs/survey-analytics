import { QuestionRadiogroupModel } from "survey-core";
import { expect, test } from "vitest";
import { SelectBase } from "../src/selectBase";
import { ChartJsSetup } from "../src/chartjs/setup";

test("horizontal bar percentages match radiogroup responses in default choice order", async () => {
  const radiogroup = new QuestionRadiogroupModel("q1");
  radiogroup.choices = [
    { value: "agree", text: "Agree" },
    { value: "disagree", text: "Disagree" },
    { value: "neutral", text: "Neutral" },
  ];
  const responses = [
    ...Array.from({ length: 941 }, () => ({ q1: "agree" })),
    ...Array.from({ length: 24 }, () => ({ q1: "disagree" })),
    ...Array.from({ length: 25 }, () => ({ q1: "neutral" })),
  ];
  const visualizer = new SelectBase(radiogroup, responses, {
    answersOrder: "default",
    percentagePrecision: 2,
    showPercentages: true,
  });
  const answersData = await visualizer.getAnswersData();
  const config = ChartJsSetup.setupBar(visualizer, answersData);

  expect(answersData.datasets[0]).toEqual([25, 24, 941]);
  expect(answersData.texts[0]).toEqual([2.53, 2.42, 95.05]);
  expect(config.data.labels).toEqual(["Agree", "Disagree", "Neutral"]);
  expect(config.data.datasets[0].data).toEqual([941, 24, 25]);

  const tooltipLabel = config.options.plugins.tooltip.callbacks.label;
  const dataLabel = config.options.plugins.datalabels.formatter;
  const expectedLabels = ["941 (95.05%)", "24 (2.42%)", "25 (2.53%)"];

  expectedLabels.forEach((expectedLabel, dataIndex) => {
    const value = config.data.datasets[0].data[dataIndex];
    expect(tooltipLabel({ datasetIndex: 0, dataIndex, parsed: { x: value } })).toBe(expectedLabel);
    expect(dataLabel(value, { datasetIndex: 0, dataIndex })).toBe(expectedLabel);
  });
});