import { NumberModel } from "../src/number";

test("result resultMin resultMax", () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ test: 0 }, { test: 50 }, { test: 100 }];
  const number = new NumberModel(question, data);

  let [level, minValue, maxValue] = number.getData();

  expect(level).toBe(50);
  expect(minValue).toBe(0);
  expect(maxValue).toBe(100);
});

test("result resultMin resultMax for negatives", () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ test: -10 }, { test: -50 }, { test: -100 }];
  const number = new NumberModel(question, data);

  let [level, minValue, maxValue] = number.getData();

  expect(level).toBe(-53.33);
  expect(minValue).toBe(-100);
  expect(maxValue).toBe(-10);
});
