import { NumberModel } from "../src/number";

test("result resultMin resultMax", async () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ test: 0 }, { test: 50 }, { test: 100 }];
  const number = new NumberModel(question, data);

  let [level, minValue, maxValue] = await number.getCalculatedValues() as any;

  expect(level).toBe(50);
  expect(minValue).toBe(0);
  expect(maxValue).toBe(100);
});

test("result resultMin resultMax for negatives", async () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ test: -10 }, { test: -50 }, { test: -100 }];
  const number = new NumberModel(question, data);

  let [level, minValue, maxValue] = await number.getCalculatedValues() as any;

  expect(level).toBe(-53.33);
  expect(minValue).toBe(-100);
  expect(maxValue).toBe(-10);
});

test("result average", async () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ }, { test: 2 }, { test: 4 }];
  const number = new NumberModel(question, data);

  let [level, minValue, maxValue] = await number.getCalculatedValues() as any;

  expect(level).toBe(3);
  expect(minValue).toBe(2);
  expect(maxValue).toBe(4);
});

test("result average for strings", async () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ }, { test: "2" }, { test: "4" }];
  const number = new NumberModel(question, data);

  let [level, minValue, maxValue] = await number.getCalculatedValues() as any;

  expect(level).toBe(3);
  expect(minValue).toBe(2);
  expect(maxValue).toBe(4);
});

test("convertFromExternalData", () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ }, { test: 2 }, { test: 4 }];
  const number = new NumberModel(question, data);
  const externalCalculatedData = {
    minValue: 2,
    value: 3,
    maxValue: 4,
  };
  const calculatedData = (number as any).getCalculatedValuesCore();
  expect(calculatedData).toEqual([3, 2, 4]);
  expect(number.convertFromExternalData(externalCalculatedData)).toStrictEqual(calculatedData);
});
