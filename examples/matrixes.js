var json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "matrix",
          name: "question1",
          title: "What is your perception of these brands?",
          columns: [
            "Excellent",
            "Very Good",
            "Good",
            "Fair",
            "Neither Fair Nor Poor",
            "Poor",
          ],
          rows: ["Lizol", "Harpic"],
        },
        {
          type: "matrixdropdown",
          name: "question2",
          title: "What do you feel about these brands?",
          isRequired: true,
          columns: [
            {
              name: "Column 1",
              title: "My Opinion",
              choices: ["High Quality", "Natural", "Trustworthy"],
            },
            {
              name: "Column 2",
              title: "Review Mark",
              choices: [1, 2, 3, 4, 5],
            },
          ],
          rows: ["Lizol", "Harpic"],
        },
        {
          "type": "matrixdropdown",
          "name": "hystogram-without-series-labels-rows",
          "columns": [
            {
              "name": "Column 1",
              "cellType": "rating",
            },
            {
              "name": "Column 2",
              "cellType": "text",
              "inputType": "number"
            }
          ],
          "rows": [
            "Row 1",
            "Row 2",
            // "Row 3",
            // "Row 4",
            // "Row 5"
          ]
        },
        {
          "type": "matrixdynamic",
          "name": "hystogram-matrixdynamic",
          "columns": [
            {
              "name": "Column 1",
              "cellType": "rating",
              choices: [1, 2, 3, 4, 5],
            },
            {
              "name": "Column 2",
              "cellType": "text",
              "inputType": "number"
            }
          ],
        },
      ],
    },
  ],
};

var survey = new Survey.SurveyModel(json);

var data = [
  {
    "hystogram-without-series-labels-rows": {
      "Row 1": {
        "Column 1": 1,
        "Column 2": 1,
      },
      "Row 2": {
        "Column 1": 2,
        "Column 2": 2
      },
      // "Row 3": {
      //   "Column 1": 3,
      //   "Column 2": 1
      // },
      // "Row 4": {
      //   "Column 1": 4,
      //   "Column 2": 4
      // },
      // "Row 5": {
      //   "Column 1": 5,
      //   "Column 2": 5
      // }
    },
    "hystogram-matrixdynamic": [
      {
        "Column 1": 1,
        "Column 2": 1,
      },
      {
        "Column 1": 2,
        "Column 2": 2
      },
      {
        "Column 1": 3,
        "Column 2": 3
      },
      {
        "Column 1": 4,
        "Column 2": 4
      },
      {
        "Column 1": 5,
        "Column 2": 5
      }
    ],
    question1: { Lizol: "Excellent", Harpic: "Excellent" },
    question2: {
      Lizol: { "Column 1": "Trustworthy", "Column 2": 3 },
      Harpic: { "Column 1": "High Quality", "Column 2": 4 },
    },
  },
  {
    "hystogram-without-series-labels-rows": {
      "Row 1": {
        "Column 1": 5
      },
      "Row 2": {
        "Column 1": 4
      },
      // "Row 3": {
      //   "Column 1": 3
      // },
      // "Row 4": {
      //   "Column 1": 2
      // },
      // "Row 5": {
      //   "Column 1": 1
      // }
    },
    question1: { Lizol: "Very Good", Harpic: "Very Good" },
    question2: {
      Lizol: { "Column 1": "Natural", "Column 2": 3 },
      Harpic: { "Column 1": "Natural", "Column 2": 4 },
    },
  },
  {
    "hystogram-without-series-labels-rows": {
      "Row 1": {
        "Column 1": 1
      },
      "Row 2": {
        "Column 1": 1
      },
      // "Row 3": {
      //   "Column 1": 1
      // },
      // "Row 4": {
      //   "Column 1": 1
      // },
      // "Row 5": {
      //   "Column 1": 1
      // }
    },
    question1: { Lizol: "Very Good", Harpic: "Good" },
    question2: {
      Lizol: { "Column 1": "Natural", "Column 2": 1 },
      Harpic: { "Column 1": "Trustworthy", "Column 2": 5 },
    },
  },
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
