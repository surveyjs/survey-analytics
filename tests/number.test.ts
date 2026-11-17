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

test("result average is rounded to the nearest hundredth for positives", async () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ test: 10 }, { test: 50 }, { test: 100 }];
  const number = new NumberModel(question, data);

  let result = await number.getCalculatedValues();
  expect(result).toStrictEqual({
    "data": [[53.33, 10, 100, 3]],
    "values": ["average", "min", "max", "count"],
  });
});

test("result average is not inflated by floating point errors", async () => {
  const question: any = { type: "text", inputType: "number", name: "test" };

  const ratingLike = new NumberModel(question, [1, 1, 1, 1, 1, 1, 1, 1, 1, 2].map(test => ({ test })));
  expect((await ratingLike.getCalculatedValues()).data[0][0]).toBe(1.1);

  const fraction = new NumberModel(question, [{ test: 0.07 }]);
  expect((await fraction.getCalculatedValues()).data[0][0]).toBe(0.07);
});

test("result min max are 0 when there are no answers", async () => {
  const question: any = { type: "text", inputType: "number", name: "test" };
  const data = [{ }, { }];
  const number = new NumberModel(question, data);

  let result = await number.getCalculatedValues();
  expect(result).toStrictEqual({
    "data": [[0, 0, 0, 2]],
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

