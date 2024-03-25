import { NumberModel } from "../src/number";

test("result resultMin resultMax", () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ test: 0 }, { test: 50 }, { test: 100 }];
  const number = new NumberModel(question, data);

  let [level, minValue, maxValue] = number.getCalculatedValues();

  expect(level).toBe(50);
  expect(minValue).toBe(0);
  expect(maxValue).toBe(100);
});

test("result resultMin resultMax for negatives", () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ test: -10 }, { test: -50 }, { test: -100 }];
  const number = new NumberModel(question, data);

  let [level, minValue, maxValue] = number.getCalculatedValues();

  expect(level).toBe(-53.33);
  expect(minValue).toBe(-100);
  expect(maxValue).toBe(-10);
});

test("result average", () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ }, { test: 2 }, { test: 4 }];
  const number = new NumberModel(question, data);

  let [level, minValue, maxValue] = number.getCalculatedValues();

  expect(level).toBe(3);
  expect(minValue).toBe(2);
  expect(maxValue).toBe(4);
});

test("result average for strings", () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ }, { test: "2" }, { test: "4" }];
  const number = new NumberModel(question, data);

  let [level, minValue, maxValue] = number.getCalculatedValues();

  expect(level).toBe(3);
  expect(minValue).toBe(2);
  expect(maxValue).toBe(4);
});
