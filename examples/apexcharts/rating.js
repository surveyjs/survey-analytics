var json = {
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          type: "rating",
          name: "score",
          title: "How likely are you to recommend SurveyJS to a friend or colleague?",
          rateMin: 1,
          rateMax: 10,
          minRateDescription: "Most unlikely",
          maxRateDescription: "Most likely",
        },
        {
          "type": "rating",
          "name": "question1",
          title: "What item do you prefer?",
          "autoGenerate": false,
          "rateCount": 2,
          "rateValues": [
            "Item 1",
            "Item 2"
          ]
        }
      ]
    }
  ]
};
var data = [
  { question1: "Item 1", "score": 1 },
  { question1: "Item 1", "score": 2 },
  { question1: "Item 2", "score": 3 },
  { question1: "Item 2", "score": 4 },
  { question1: "Item 2", "score": 5 },
  { question1: "Item 2", "score": 6 },
  { question1: "Item 2", "score": 1 },
  { question1: "Item 1", "score": 2 },
  { question1: "Item 3", "score": 7 },
  { question1: "Item 1", "score": 9 },
  { question1: "Item 2", "score": 9 },
  { question1: "Item 1", "score": 1 },
  { question1: "Item 1", "score": 2 },
  { question1: "Item 1", "score": 10 },
  { question1: "Item 1", "score": 3 },
];

var options = {
  // allowDynamicLayout: false,
  // allowDragDrop: false,
  // allowHideQuestions: false,
  // allowShowPercentages: true,
  // showPercentages: true,
  // showOnlyPercentages: true,
  // useValuesAsLabels: false
  // haveCommercialLicense: false,
  // allowSortAnswers: true,
  // answersOrder: "desc"
  // allowHideEmptyAnswers: true,
  // hideEmptyAnswers: true,
  // allowTopNAnswers: true,
  // showCorrectAnswers: true
  // labelTruncateLength: 27,
};

var survey = new Survey.SurveyModel(json);

var visPanel = new SurveyAnalyticsApexcharts.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
