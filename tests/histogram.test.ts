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

test("number custom intervals", () => {
  const question: any = {
    getType: () => "text",
    type: "text",
    inputType: "number",
    name: "age",
  };
  const ages = [
    { age: 1 }, { age: 1 }, { age: 1 }, { age: 1 }, { age: 1 }, { age: 1 }, { age: 1 },
    { age: 2 }, { age: 2 }, { age: 2 }, { age: 2 }, { age: 2 },
    { age: 8 }, { age: 8 }, { age: 8 }, { age: 8 }, { age: 8 }, { age: 8 },
    { age: 9 },
    { age: 10 },
    { age: 11 },
    { age: 12 },
    { age: 13 },
    { age: 14 },
    { age: 15 },
    { age: 16 },
    { age: 17 },
    { age: 18 },
    { age: 19 },
    { age: 20 },
    { age: 21 },
    { age: 22 },
    { age: 23 },
    { age: 24 },
    { age: 25 },
    { age: 26 },
    { age: 27 },
    { age: 28 },
    { age: 29 },
    { age: 75 },
  ];
  const date = new HistogramModel(question, ages, {
    age: {
      intervals: [
        { start: 0, end: 7, label: "childhood" },
        { start: 7, end: 14, label: "adolescence" },
        { start: 14, end: 19, label: "youth" },
        { start: 19, end: 70, label: "adult" },
        { start: 70, end: 100, label: "old age" }
      ]
    }
  });

  const histValues = date.getValues();
  const histIntervals = date.intervals;
  const histData = date.getData();

  expect(histIntervals.length).toBe(5);
  expect(histValues).toMatchObject([
    "childhood",
    "adolescence",
    "youth",
    "adult",
    "old age"
  ]);
  expect(histData).toMatchObject([[12,
    11,
    5,
    11,
    1]]);
});

test("number custom intervals for small result sets", () => {
  const question: any = {
    getType: () => "text",
    type: "text",
    inputType: "number",
    name: "age",
  };
  const date = new HistogramModel(question, data, {
    age: {
      intervals: [
        { start: 0, end: 7, label: "childhood" },
        { start: 7, end: 14, label: "adolescence" },
        { start: 14, end: 19, label: "youth" },
        { start: 19, end: 70, label: "adult" },
        { start: 70, end: 100, label: "old age" }
      ]
    }
  });

  const histValues = date.getValues();
  const histIntervals = date.intervals;
  const histData = date.getData();

  expect(histIntervals.length).toBe(5);
  expect(histValues).toMatchObject([
    "childhood",
    "adolescence",
    "youth",
    "adult",
    "old age"
  ]);
  expect(histData).toMatchObject([[0, 0, 3, 5, 0]]);
});

test("histogram series default algorithm data", () => {
  const question: any = {
    getType: () => "text",
    type: "text",
    inputType: "number",
    name: "Column 2",
  };
  const preparedData = [
    {
      "Column 1": 1,
      "Column 2": 1,
      "__sa_series_name": "Row 1"
    },
    {
      "Column 1": 2,
      "Column 2": 2,
      "__sa_series_name": "Row 2"
    },
    {
      "Column 1": 3,
      "Column 2": 1,
      "__sa_series_name": "Row 3"
    },
    {
      "Column 1": 4,
      "Column 2": 4,
      "__sa_series_name": "Row 4"
    },
    {
      "Column 1": 5,
      "Column 2": 5,
      "__sa_series_name": "Row 5"
    },
  ];

  const series = ["Row 1", "Row 2", "Row 3", "Row 4", "Row 5"];
  const number = new HistogramModel(question, preparedData, {
    seriesValues: series,
    seriesLabels: series,
  });

  expect(number.getSeriesValues()).toMatchObject(series);
  expect(number.getSeriesLabels()).toMatchObject(series);

  const chartData = number.getData();
  expect(chartData).toMatchObject([[1, 0, 0, 0], [0, 1, 0, 0], [1, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
});

test("histogram series intervals data", () => {
  const preparedData = [
    {
      "Column 2": 1,
      "__sa_series_name": "Row 1"
    },
    {
      "Column 2": 2,
      "__sa_series_name": "Row 2"
    },
    {
      "Column 2": 1,
      "__sa_series_name": "Row 3"
    },
    {
      "Column 2": 4,
      "__sa_series_name": "Row 4"
    },
    {
      "Column 2": 5,
      "__sa_series_name": "Row 5"
    },
    {
      "Column 2": 6,
      "__sa_series_name": "Row 1"
    },
    {
      "Column 2": 7,
      "__sa_series_name": "Row 2"
    },
    {
      "Column 2": 8,
      "__sa_series_name": "Row 3"
    },
    {
      "Column 2": 9,
      "__sa_series_name": "Row 4"
    },
    {
      "Column 2": 10,
      "__sa_series_name": "Row 5"
    },
    {
      "Column 2": 11,
      "__sa_series_name": "Row 1"
    },
    {
      "Column 2": 12,
      "__sa_series_name": "Row 2"
    },
    {
      "Column 2": 13,
      "__sa_series_name": "Row 3"
    },
    {
      "Column 2": 14,
      "__sa_series_name": "Row 4"
    },
    {
      "Column 2": 16,
      "__sa_series_name": "Row 5"
    },
    {
      "Column 2": 16,
      "__sa_series_name": "Row 5"
    },
  ];
  const question: any = {
    getType: () => "text",
    type: "text",
    inputType: "number",
    name: "Column 2",
  };
  const series = ["Row 1", "Row 2", "Row 3", "Row 4", "Row 5"];
  const number = new HistogramModel(question, preparedData, {
    seriesValues: series,
    seriesLabels: series,
  });

  const chartData = number.getData();
  expect(chartData).toMatchObject([
    [
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      0,
    ],
    [
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
    ],
    [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
    ],
    [
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
    ],
    [
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      0,
      2,
    ],
  ]);
});
