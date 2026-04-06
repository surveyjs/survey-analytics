var json = {
  elements: [
    {
      type: "ranking",
      name: "smartphone-features",
      title:
        "Please rank the following smartphone features in order of importance:",
      isRequired: true,
      choices: [
        "Battery life",
        "Screen size",
        "Storage space",
        "Camera quality",
        "Durability",
        "Processor power",
        "Price",
      ],
    },
  ],
};

var data = [
  {
    "smartphone-features": [
      "Price",
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
    ],
  },
  {
    "smartphone-features": [
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
      "Price",
    ],
  },
  {
    "smartphone-features": [
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
      "Price",
    ],
  },
];

var survey = new Survey.SurveyModel(json);

var options = {};

var visPanel = new SurveyAnalyticsChartjs.VisualizationPanel(
  survey.getAllQuestions(),
  data
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("rankingContainer"));
