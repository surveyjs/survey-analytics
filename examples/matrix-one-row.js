var json = {
  "pages": [
    {
      "name": "page_info",
      "elements": [
        {
          "type": "matrix",
          "name": "Quality",
          "title": "Please indicate if you agree or disagree with the following statements",
          "columns": [
            {
              "value": 1,
              "text": "Strongly Disagree"
            },
            {
              "value": 2,
              "text": "Disagree"
            },
            {
              "value": 3,
              "text": "Neutral"
            },
            {
              "value": 4,
              "text": "Agree"
            },
            {
              "value": 5,
              "text": "Strongly Agree"
            }
          ],
          "rows": [
            {
              "value": "affordable",
              "text": "Product is affordable"
            }
          ]
        }
      ]
    }
  ]
};

var survey = new Survey.SurveyModel(json);

var data = [
  {
      Quality: {
          affordable: "3",
      },
  },
  {
      Quality: {
        affordable: "3",
      },
  },
  {
      Quality: {
          affordable: "5",
      },
  },
];

var options = {
  // allowDynamicLayout: false,
  // allowHideQuestions: false,
  // allowChangeAnswersOrder: true,
  // allowTransposeData: true
};

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
