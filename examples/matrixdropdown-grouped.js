var json = {
  "title": "question11",
  "pages": [
    {
      "name": "page2",
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "question4",
          "title": "Please select the top 3 processes that you perceived as most difficult or troublesome.",
          "showHeader": false,
          "columns": [
            {
              "name": "1st Most Difficult",
            },
            {
              "name": "2nd Most Difficult",
            },
            {
              "name": "3rd Most Difficult",
            }
          ],
          "choices": [
            "Process 1",
            "Process 2",
            "Process 3",
            "Process 4",
            "Process 5",
            "Process 6"
          ],
          "rows": [
            "Process"
          ]
        }
      ]
    }
  ]
};

var survey = new Survey.SurveyModel(json);

var data = [
  {
    "question4": {
      "Process": {
        "1st Most Difficult": "Process 2",
        "2nd Most Difficult": "Process 3",
        "3rd Most Difficult": "Process 5"
      }
    }
  },
  {
    "question4": {
      "Process": {
        "1st Most Difficult": "Process 3",
        "2nd Most Difficult": "Process 1",
        "3rd Most Difficult": "Process 4"
      }
    }
  },
  {
    "question4": {
      "Process": {
        "1st Most Difficult": "Process 1",
        "2nd Most Difficult": "Process 2",
        "3rd Most Difficult": "Process 3"
      }
    }
  },
];

var options = {
  // allowDynamicLayout: false,
  // allowHideQuestions: false,
  allowChangeAnswersOrder: true,
  allowTransposeData: true
};

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
