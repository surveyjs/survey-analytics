//import { GaugePlotly } from "../../src/plotly/rating";

// some problem with jest
//https://stackoverflow.com/questions/52968969/jest-url-createobjecturl-is-not-a-function 

test.skip("test result resultMax resultMin", () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ test: 0 }, { test: 50 }, { test: 100 }];
  const gauge = new GaugePlotly(question, data);

  expect(gauge.result).toBe(50);
  expect(gauge.resultMax).toBe(100);
  expect(gauge.resultMin).toBe(0);
});
