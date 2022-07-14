import { SurveyModel } from "survey-core";
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
  const histLabels = number.getLabels();
  const histData = number.getData();

  expect(number["valueType"]).toBe("number");
  expect(histValues).toMatchObject([17, 25, 30, 40]);
  expect(histLabels).toMatchObject(["17", "25", "30", "40"]);
  expect(histData).toMatchObject([[3, 1, 2, 2]]);

  expect(number["isSupportMissingAnswers"]()).toBeFalsy();
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

  expect(date["isSupportMissingAnswers"]()).toBeFalsy();
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
  const histLabels = date.getLabels();
  const histIntervals = date.intervals;
  const histData = date.getData();

  expect(histIntervals.length).toBe(10);
  expect(histValues).toMatchObject([
    1577836799999,
    1578095999999.2,
    1578355199999.4,
    1578614399999.5999,
    1578873599999.7998,
    1579132799999.9998,
    1579392000000.1997,
    1579651200000.3997,
    1579910400000.5996,
    1580169600000.7996,

  ]);
  expect(histLabels).toMatchObject([
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
  const dates: any[] = [];
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
    70,
    19,
    14,
    7,
    0,
  ]);
  expect(histData).toMatchObject([[
    1,
    11,
    5,
    11,
    12]
  ]);
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
    70,
    19,
    14,
    7,
    0,
  ]);
  expect(histData).toMatchObject([[0, 5, 3, 0, 0]]);
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

test("custom widget default histogram", () => {
  const question: any = {
    getType: () => "nouislider",
    type: "nouislider",
    name: "age",
  };
  const number = new HistogramModel(question, data);
  expect(number["valueType"]).toBe("number");
});

test("histogram original data keep number original values", () => {
  const question: any = {
    getType: () => "rating",
    type: "rating",
    name: "question1",
  };
  const number = new HistogramModel(question, [{ "question2": "Yes", "question1": 3 }, { "question2": "It is going so well!!!", "question1": 5 }, { "question2": false, "question1": 5 }, { "question2": true, "question1": 1 }, { "question2": false, "question1": 5 }, { "question3": "item2", "question2": false, "question1": 5 }]);
  expect(number.getValues()).toEqual([1, 3, 5]);
  expect(number.getLabels()).toEqual(["1", "3", "5"]);

  const selectedItem = number.getSelectedItemByText("5");
  expect(selectedItem.value).toBe(5);
  expect(selectedItem.text).toBe("5");
});

test("histogram should use rate values", () => {
  const json = {
    questions: [
      { "type": "rating", "name": "question1", "rateValues": [{ "value": 1, "text": "15 minutes" }, { "value": 2, "text": "30 minutes" }, { "value": 3, "text": "1 hour" }] }
    ],
  };
  const survey = new SurveyModel(json);
  const rating = new HistogramModel(survey.getAllQuestions()[0], [{ "question1": 3 }]);
  expect(rating.intervals).toEqual([
    {
      "end": 4,
      "label": "1 hour",
      "start": 3,
    },
    {
      "end": 3,
      "label": "30 minutes",
      "start": 2,
    },
    {
      "end": 2,
      "label": "15 minutes",
      "start": 1,
    },
  ]);
  expect(rating.getValues()).toEqual([3, 2, 1]);
  expect(rating.getLabels()).toEqual(["1 hour", "30 minutes", "15 minutes"]);
  expect(rating.getData()).toEqual([[
    1,
    0,
    0,
  ]]);
});
