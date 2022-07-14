var json = {
  elements: [
    {
      type: "text",
      inputType: "date",
      name: "date",
    },
    {
      type: "text",
      inputType: "number",
      name: "age",
    },
    { "type": "rating", "name": "question1", "rateValues": [{ "value": 1, "text": "15 minutes" }, { "value": 2, "text": "30 minutes" }, { "value": 3, "text": "1 hour" }] }
  ]
}
var survey = new Survey.SurveyModel(json);

var data = [
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
  {
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
    date: "2022-10-13",
    age: 25
  },
  {
    date: "2023-10-13",
    age: 25
  },
  {
    date: "2024-10-13",
    age: 25
  },
  {
    date: "2025-10-13",
    age: 25
  },
  {
    date: "2026-10-13",
    age: 25
  },
  {
    date: "2027-10-13",
    age: 25
  },
  {
    date: "2028-10-13",
    age: 25
  },
  {
    date: "2029-10-13",
    age: 25
  },
  {
    date: "2030-10-13",
    age: 25
  },
  { "question1": 3 }
];

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  {
    allowChangeAnswersOrder: true,
    allowShowPercentages: true,
    allowHideEmptyAnswers: false,
    allowTransposeData: false,
    allowTopNAnswers: true,
    age: {
      intervals: [
        { start: 0, end: 7, label: "childhood" },
        { start: 7, end: 14, label: "adolescence" },
        { start: 14, end: 19, label: "youth" },
        { start: 19, end: 70, label: "adult" },
        { start: 70, end: 100, label: "old age" }
      ]
    }
  }
);
visPanel.showHeader = true;
visPanel.render(document.getElementById("summaryContainer"));
