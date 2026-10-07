import { QuestionRadiogroupModel } from "survey-core";
import { expect, test } from "vitest";
import { SelectBase } from "../src/selectBase";
import { ApexChartsSetup } from "../src/apexcharts/setup";

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
  const config = ApexChartsSetup.setupBar(visualizer, answersData);

  expect(answersData.datasets[0]).toEqual([25, 24, 941]);
  expect(answersData.texts[0]).toEqual([2.53, 2.42, 95.05]);
  expect(config.labels).toEqual(["Agree", "Disagree", "Neutral"]);
  expect(config.series[0].data).toEqual([941, 24, 25]);

  const dataLabel = config.dataLabels.formatter;
  const expectedLabels = ["941 (95.05%)", "24 (2.42%)", "25 (2.53%)"];

  expectedLabels.forEach((expectedLabel, dataPointIndex) => {
    const value = config.series[0].data[dataPointIndex];
    expect(dataLabel(value, { seriesIndex: 0, dataPointIndex })).toBe(expectedLabel);
  });
});
