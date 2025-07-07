import { AggregatorFunctions, SurveyResultDataTypes, VisualizerNew } from "../src/visualizerNew";
import { QuestionDropdownModel, QuestionRatingModel, QuestionSignaturePadModel, QuestionTextModel, SurveyModel } from "survey-core";

test("question data types", () => {
  const q1 = new QuestionTextModel("q1");
  q1.inputType = "number";
  const visualizer = new VisualizerNew(q1, []);

  expect(visualizer.dataType).toBe(SurveyResultDataTypes.Number);

  q1.inputType = "datetime";
  expect(visualizer.dataType).toBe(SurveyResultDataTypes.Date);

  q1.inputType = "text";
  expect(visualizer.dataType).toBe(SurveyResultDataTypes.Text);

  const q2 = new QuestionDropdownModel("q2");
  const visualizer2 = new VisualizerNew(q2, []);
  expect(visualizer2.dataType).toBe(SurveyResultDataTypes.Enum);

  const q3 = new QuestionRatingModel("q3");
  const visualizer3 = new VisualizerNew(q3, []);
  expect(visualizer3.dataType).toBe(SurveyResultDataTypes.Number);

  const q4 = new QuestionSignaturePadModel("q4");
  const visualizer4 = new VisualizerNew(q4, []);
  expect(visualizer4.dataType).toBe(SurveyResultDataTypes.Unknown);
});

test("data aggregation types", () => {
  const q1 = new QuestionTextModel("q1");
  q1.inputType = "number";
  const visualizer = new VisualizerNew(q1, []);
  expect(visualizer.aggregators).toHaveLength(3);
  expect(visualizer.aggregators[0]).toBe(AggregatorFunctions.Categorial);
  expect(visualizer.aggregators[1]).toBe(AggregatorFunctions.Continious);
  expect(visualizer.aggregators[2]).toBe(AggregatorFunctions.Math);
});

test("chart types", () => {
  const q1 = new QuestionTextModel("q1");
  q1.inputType = "number";
  const visualizer = new VisualizerNew(q1, []);
  const _diagramTypes = visualizer.chartData.map(dt => {
    const prefix = dt.aggregator === AggregatorFunctions.Categorial ? "cat_" : (dt.aggregator === AggregatorFunctions.Continious ? "cont_" : "math_");
    return prefix + dt.chartType;
  });
  expect(_diagramTypes).toStrictEqual(["cat_bar", "cat_vbar", "cat_stackedbar", "cat_pie", "cat_doughnut", "cont_bar", "cont_vbar", "math_gauge", "math_bullet"]);
});