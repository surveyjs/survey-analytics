import { NpsVisualizer, NpsVisualizerWidget } from "../src/nps";

test("result resultMin resultMax", async () => {
  const question: any = { type: "rating", name: "test" };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  const nps = new NpsVisualizer(question, data);

  let result: any = await nps.getCalculatedValues();

  expect(result.total).toBe(6);
  expect(result.detractors).toBe(1);
  expect(result.passive).toBe(2);
  expect(result.promoters).toBe(3);
});

test("result precision is 2 digits", async () => {
  const question: any = { type: "rating", name: "test" };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  const nps = new NpsVisualizer(question, data);
  const calculations = await nps.getCalculatedValues();
  const widget = new NpsVisualizerWidget(nps, calculations as any);

  expect(widget.npsScore).toBe(33.33);
  expect(widget.detractorsPercent).toBe(16.67);
  expect(widget.passivePercent).toBe(33.33);
  expect(widget.promotersPercent).toBe(50);
});