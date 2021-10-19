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
    }
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
];

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  {
    allowChangeAnswersOrder: true,
    allowShowPercentages: true,
    allowHideEmptyAnswers: false,
    allowTransposeData: false,
    allowTopNAnswers: true
  }
);
visPanel.showHeader = true;
visPanel.render(document.getElementById("summaryContainer"));
