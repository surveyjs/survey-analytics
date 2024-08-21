var json = {
  elements: [
    {
      "type": "rating",
      "name": "nps_score",
      "title": "How likely are you to recommend our product to a friend or colleague?"
    },
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
    { "type": "rating", "name": "question1", "rateValues": [{ "value": 1, "text": "15 minutes" }, { "value": 2, "text": "30 minutes" }, { "value": 3, "text": "1 hour" }] },
    {
      "type": "text",
      "name": "question2",
      "inputType": "number"    
     }
  ]
}
var survey = new Survey.SurveyModel(json);

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
  { "question1": 3 },
  { "question1": 1 },
  { "question1": 3 },
];

data = data.concat([
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
]);

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  {
    labelTruncateLength: 5,
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
visPanel.showToolbar = true;
visPanel.onAlternativeVisualizerChanged.add(function(sender, options) {
  visPanel.visualizers.forEach(visualizer => {
    if(typeof visualizer.setVisualizer === "function") {
      visualizer.setVisualizer(options.visualizer.type, true);
    }
  });
});
visPanel.render(document.getElementById("summaryContainer"));
