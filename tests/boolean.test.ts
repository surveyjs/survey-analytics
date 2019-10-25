import { QuestionBooleanModel } from "survey-core";
import { BooleanPlotly } from "../src/plotly/boolean";

let boolean: BooleanPlotly;

const values = [ true, false ];
const labels = [ "Yes", "No" ];

beforeEach(() => {
  var question = new QuestionBooleanModel("q1");
  var data = [
    {
      q1: true
    },
    {
      q1: true
    },
    {
      q1: false
    },
    {
      q1: true
    }
  ];
  boolean = new BooleanPlotly(null, question, data, {});
});

test("getValues method", () => {
  expect(boolean.getValues()).toEqual(values);
});

test("getLabels method", () => {
  expect(boolean.getLabels()).toEqual(labels);
});

test("getData method", () => {
  expect(boolean.getData()).toEqual([[3, 1]]);
});
