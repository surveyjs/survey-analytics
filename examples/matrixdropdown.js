var json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          "type": "matrixdropdown",
          "name": "question1",
          "columns": [
            {
              "name": "column1"
            }
          ],
          "choices": [
            "908",
            "34",
            "24",
            "234",
            "234"
          ],
          "rows": [
            "Row 1",
            "Row 2"
          ]
        },

      ],
    },
  ],
};

var survey = new Survey.SurveyModel(json);

var data = [
  {
    "question1": {
      "Row 1": {
        "column1": "908"
      },
      "Row 2": {
        "column1": "908"
      }
    },
  },
  {
    "question1": {
      "Row 1": {
        "column1": "908"
      },
      "Row 2": {
        "column1": "908"
      }
    },
  }
];

var options = {
  // allowDynamicLayout: false,
  // allowHideQuestions: false
};

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
