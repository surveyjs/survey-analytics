import { NumberModel } from "../src/number";

test("result resultMin resultMax", async () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ test: 0 }, { test: 50 }, { test: 100 }];
  const number = new NumberModel(question, data);

  let result = await number.getCalculatedValues();
  expect(result).toStrictEqual({
    "data": [[50, 0, 100, 3]],
    "values": ["average", "min", "max", "count"],
  });
});

test("result resultMin resultMax for negatives", async () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ test: -10 }, { test: -50 }, { test: -100 }];
  const number = new NumberModel(question, data);

  let result = await number.getCalculatedValues();
  expect(result).toStrictEqual({
    "data": [[-53.33, -100, -10, 3]],
    "values": ["average", "min", "max", "count"],
  });
});

test("result average", async () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ }, { test: 2 }, { test: 4 }];
  const number = new NumberModel(question, data);

  let result = await number.getCalculatedValues();
  expect(result).toStrictEqual({
    "data": [[3, 2, 4, 3]],
    "values": ["average", "min", "max", "count"],
  });
});

test("result average for strings", async () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ }, { test: "2" }, { test: "4" }];
  const number = new NumberModel(question, data);

  let result = await number.getCalculatedValues();
  expect(result).toStrictEqual({
    "data": [[3, 2, 4, 3]],
    "values": ["average", "min", "max", "count"],
  });
});

test("convertFromExternalData", () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ }, { test: 2 }, { test: 4 }];
  const number = new NumberModel(question, data);
  const externalCalculatedData = {
    minValue: 2,
    value: 3,
    maxValue: 4,
    count: 3
  };
  const calculatedData = (number as any).getCalculatedValuesCore();
  expect(calculatedData.data[0]).toEqual([3, 2, 4, 3]);
  expect(number.convertFromExternalData(externalCalculatedData)).toStrictEqual(calculatedData);
});
