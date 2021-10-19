import { HistogramModel } from "../src/histogram";

const data = [
  {
    date: "2021-10-13",
    age: 17
  },
  {
    date: "2021-10-13",
    age: 17
  },
  {
    date: "2021-10-13",
    age: 17
  },
  {
    date: "2011-10-13",
    age: 30
  },
  {
    date: "2011-10-13",
    age: 30
  },
  {
    date: "2004-10-13",
    age: 40
  },
  {
    date: "2004-10-13",
    age: 40
  },
  {
    date: "2016-10-13",
    age: 25
  },
];

test("number default histogram", () => {
  const question: any = {
    getType: () => "text",
    type: "text",
    inputType: "number",
    name: "age",
  };
  const number = new HistogramModel(question, data);

  const histValues = number.getValues();
  const histData = number.getData();

  expect(number["valueType"]).toBe("number");
  expect(histValues).toMatchObject(["17", "25", "30", "40"]);
  expect(histData).toMatchObject([[3, 1, 2, 2]]);
});

test("date default histogram", () => {
  const question: any = {
    getType: () => "text",
    type: "text",
    inputType: "date",
    name: "date",
  };
  const date = new HistogramModel(question, data);

  const histValues = date.getValues();
  const histData = date.getData();

  expect(date["valueType"]).toBe("date");
  expect(histValues).toMatchObject(["2004-10-13", "2011-10-13", "2016-10-13", "2021-10-13"]);
  expect(histData).toMatchObject([[2, 2, 1, 3]]);
});

test("date default intervals", () => {
  const question: any = {
    getType: () => "text",
    type: "text",
    inputType: "date",
    name: "date",
  };
  const dates = [];
  const currDate = new Date(2020, 0);
  for (let i = 0; i < 31; i++) {
    dates.push({ date: currDate.toISOString() });
    currDate.setDate(currDate.getDate() + 1);
  }
  const date = new HistogramModel(question, dates);

  const histValues = date.getValues();
  const histIntervals = date.intervals;
  const histData = date.getData();

  expect(histIntervals.length).toBe(10);
  expect(histValues).toMatchObject([
    "12/31/2019-1/3/2020",
    "1/3/2020-1/6/2020",
    "1/6/2020-1/9/2020",
    "1/9/2020-1/12/2020",
    "1/12/2020-1/15/2020",
    "1/15/2020-1/19/2020",
    "1/19/2020-1/22/2020",
    "1/22/2020-1/25/2020",
    "1/25/2020-1/28/2020",
    "1/28/2020-1/31/2020",
  ]);
  expect(histData).toMatchObject([[3, 3, 3, 3, 3, 4, 3, 3, 3, 3]]);
});

test("date empty data", () => {
  const question: any = {
    getType: () => "text",
    type: "text",
    inputType: "date",
    name: "date",
  };
  const dates = [];
  const date = new HistogramModel(question, dates);

  const histValues = date.getValues();
  const histIntervals = date.intervals;
  const histData = date.getData();

  expect(histIntervals.length).toBe(0);
  expect(histValues).toMatchObject([]);
  expect(histData).toMatchObject([[]]);
});