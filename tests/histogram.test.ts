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
  const histData = number.getCalculatedValues();

  expect(number["valueType"]).toBe("number");
  expect(histValues).toMatchObject([17, 19.3, 21.6, 23.9, 26.2, 28.5, 30.8, 33.1, 35.4, 37.7]);
  expect(histLabels).toMatchObject(["17-19.3", "19.3-21.6", "21.6-23.9", "23.9-26.2", "26.2-28.5", "28.5-30.8", "30.8-33.1", "33.1-35.4", "35.4-37.7", "37.7-40"]);
  expect(histData).toMatchObject([[3, 0, 0, 1, 0, 2, 0, 0, 0, 2]]);

  expect(number["isSupportMissingAnswers"]()).toBeFalsy();
  expect(number["isSupportAnswersOrder"]()).toBeTruthy();
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
  const histLabels = date.getLabels();
  const histData = date.getCalculatedValues();

  expect(date["valueType"]).toBe("date");
  expect(histValues).toMatchObject([1097625600000, 1151271360000, 1204917120000, 1258562880000, 1312208640000, 1365854400000, 1419500160000, 1473145920000, 1526791680000, 1580437440000]);
  expect(histLabels).toMatchObject([
    "10/13/2004-6/25/2006",
    "6/25/2006-3/7/2008",
    "3/7/2008-11/18/2009",
    "11/18/2009-8/1/2011",
    "8/1/2011-4/13/2013",
    "4/13/2013-12/25/2014",
    "12/25/2014-9/6/2016",
    "9/6/2016-5/20/2018",
    "5/20/2018-1/31/2020",
    "1/31/2020-10/13/2021",
  ]);
  expect(histData).toMatchObject([[2, 0, 0, 0, 2, 0, 0, 1, 0, 3]]);

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
  const histData = date.getCalculatedValues();

  expect(histIntervals.length).toBe(10);
  expect(histValues).toMatchObject([
    1577836800000,
    1578096000000,
    1578355200000,
    1578614400000,
    1578873600000,
    1579132800000,
    1579392000000,
    1579651200000,
    1579910400000,
    1580169600000,
  ]);
  expect(histLabels).toMatchObject([
    "1/1/2020-1/4/2020",
    "1/4/2020-1/7/2020",
    "1/7/2020-1/10/2020",
    "1/10/2020-1/13/2020",
    "1/13/2020-1/16/2020",
    "1/16/2020-1/19/2020",
    "1/19/2020-1/22/2020",
    "1/22/2020-1/25/2020",
    "1/25/2020-1/28/2020",
    "1/28/2020-1/31/2020",
  ]);
  expect(histData).toMatchObject([[3, 3, 3, 3, 3, 3, 3, 3, 3, 4]]);
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
  const histData = date.getCalculatedValues();

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
  const histData = date.getCalculatedValues();

  expect(histIntervals.length).toBe(5);
  expect(histValues).toMatchObject([
    0,
    7,
    14,
    19,
    70
  ]);
  expect(histData).toMatchObject([[
    12,
    11,
    5,
    11,
    1
  ]]);
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
  const histData = date.getCalculatedValues();

  expect(histIntervals.length).toBe(5);
  expect(histValues).toMatchObject([
    0,
    7,
    14,
    19,
    70
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

  const chartData = number.getCalculatedValues();
  expect(chartData).toMatchObject([
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  ]);
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

  const chartData = number.getCalculatedValues();
  expect(chartData).toMatchObject([
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 2],
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
    rateMin: 1,
    rateMax: 5,
    rateStep: 1
  };
  const number = new HistogramModel(question, [{ "question2": "Yes", "question1": 3 }, { "question2": "It is going so well!!!", "question1": 5 }, { "question2": false, "question1": 5 }, { "question2": true, "question1": 1 }, { "question2": false, "question1": 5 }, { "question3": "item2", "question2": false, "question1": 5 }]);
  expect(number["valueType"]).toBe("number");
  expect(number.getValues()).toEqual([1, 2, 3, 4, 5]);
  expect(number.getLabels()).toEqual(["1", "2", "3", "4", "5"]);

  const selectedItem = number.getSelectedItemByText("5");
  expect(selectedItem.value).toBe(5);
  expect(selectedItem.text).toBe("5");
});

test("histogram rating should be numeric", () => {
  const question: any = {
    getType: () => "rating",
    type: "rating",
    name: "question1",
    rateMin: 0,
    rateMax: 10,
    rateStep: 1
  };
  const number = new HistogramModel(question, []);
  expect(number["valueType"]).toBe("number");
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
      "end": 2,
      "label": "15 minutes",
      "start": 1,
    },
    {
      "end": 3,
      "label": "30 minutes",
      "start": 2,
    },
    {
      "end": 4,
      "label": "1 hour",
      "start": 3,
    },
  ]);
  expect(rating.getValues()).toEqual([1, 2, 3]);
  expect(rating.getLabels()).toEqual(["15 minutes", "30 minutes", "1 hour"]);
  expect(rating.getCalculatedValues()).toEqual([[0, 0, 1]]);
});

test("histogram intervals alignment and rounding", () => {
  var data = [
    {
      nps_score: 1,
      date: "2021-10-13",
      age: 17
    },
    {
      nps_score: 1,
      date: "2021-10-13",
      age: 17
    },
    {
      nps_score: 5,
      date: "2021-10-13",
      age: 17
    },
    {
      nps_score: 10,
      date: "2011-10-13",
      age: 30
    },
    {
      nps_score: 5,
      date: "2011-10-13",
      age: 30
    },
    {
      nps_score: 5,
      date: "2004-10-13",
      age: 40
    },
    {
      nps_score: 5,
      date: "2004-10-13",
      age: 40
    },
    {
      nps_score: 5,
      date: "2016-10-13",
      age: 25
    },
    {
      nps_score: 6,
      date: "2017-10-13",
      age: 25
    },
    {
      date: "2018-10-13",
      age: 25
    },
    {
      date: "2019-10-13",
      age: 25
    },
    {
      date: "2020-10-13",
      age: 25
    },
    {
      date: "2021-10-13",
      age: 25
    },
    {
      nps_score: 7,
      date: "2022-10-13",
      age: 25
    },
    {
      nps_score: 8,
      date: "2023-10-13",
      age: 25
    },
    {
      nps_score: 9,
      date: "2024-10-13",
      age: 25
    },
    {
      nps_score: 2,
      date: "2025-10-13",
      age: 25
    },
    {
      nps_score: 2,
      date: "2026-10-13",
      age: 25
    },
    {
      nps_score: 3,
      date: "2027-10-13",
      age: 25
    },
    {
      nps_score: 4,
      date: "2028-10-13",
      age: 25
    },
    {
      nps_score: 4,
      date: "2029-10-13",
      age: 25
    },
    {
      nps_score: 0,
      date: "2030-10-13",
      age: 25
    },
    { "question1": 3 }
  ];
  const question: any = {
    getType: () => "rating",
    type: "rating",
    name: "nps_score",
  };
  const number = new HistogramModel(question, data);
  expect(number.getValues()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  expect(number.getLabels()).toEqual(["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"]);
});

test("number histogram answers order", () => {
  const question: any = {
    getType: () => "text",
    type: "text",
    inputType: "number",
    name: "question2",
  };
  const number = new HistogramModel(question, [
    {
      "question2": 15.1232432423
    }, {
      "question2": 32.1435232
    }, {
      "question2": 14.1232432423
    }, {
      "question2": 13.1435232232
    }, {
      "question2": 16.21
    }, {
      "question2": 11.14352
    }, {
      "question2": 11.1435232232
    }, {
      "question2": 11.1435232232
    }, {
      "question2": 15
    }, {
      "question2": 44
    },
  ] as Array<any>);

  const histValues = number.getValues();
  const histLabels = number.getLabels();

  expect(number["valueType"]).toBe("number");
  expect(number.intervals).toEqual([
    {
      "end": 14.43,
      "label": "11.14-14.43",
      "start": 11.14,
    },
    {
      "end": 17.71,
      "label": "14.43-17.71",
      "start": 14.43,
    },
    {
      "end": 21,
      "label": "17.71-21",
      "start": 17.71,
    },
    {
      "end": 24.29,
      "label": "21-24.29",
      "start": 21,
    },
    {
      "end": 27.57,
      "label": "24.29-27.57",
      "start": 24.29,
    },
    {
      "end": 30.86,
      "label": "27.57-30.86",
      "start": 27.57,
    },
    {
      "end": 34.14,
      "label": "30.86-34.14",
      "start": 30.86,
    },
    {
      "end": 37.43,
      "label": "34.14-37.43",
      "start": 34.14,
    },
    {
      "end": 40.71,
      "label": "37.43-40.71",
      "start": 37.43,
    },
    {
      "end": 44.03285648,
      "label": "40.71-44",
      "start": 40.71,
    },
  ]);
  expect(histValues).toMatchObject([11.14, 14.43, 17.71, 21, 24.29, 27.57, 30.86, 34.14, 37.43, 40.71]);
  expect(histLabels).toMatchObject(["11.14-14.43", "14.43-17.71", "17.71-21", "21-24.29", "24.29-27.57", "27.57-30.86", "30.86-34.14", "34.14-37.43", "37.43-40.71", "40.71-44"]);

  const histData = number.getCalculatedValues();
  expect(histData).toMatchObject([[5, 3, 0, 0, 0, 0, 1, 0, 0, 1]]);
});
