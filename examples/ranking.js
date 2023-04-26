var surveyId = "";
var accessKey = "";

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

// var data = [
//   {
//     "smartphone-features": [
//       "Battery life",
//       "Screen size",
//       "Storage space",
//       "Camera quality",
//       "Durability",
//       "Processor power",
//       "Price",
//     ],
//   },
//   {
//     "smartphone-features": [
//       "Price",
//       "Processor power",
//       "Battery life",
//       "Screen size",
//       "Storage space",
//       "Camera quality",
//       "Durability",
//     ],
//   },
//   {
//     "smartphone-features": [
//       "Durability",
//       "Screen size",
//       "Battery life",
//       "Storage space",
//       "Processor power",
//       "Price",
//       "Camera quality",
//     ],
//   },
// ];

var survey = new Survey.SurveyModel(json);

SurveyAnalytics.PlotlySetup.onImageSaving.add(function (
  selectBaseVisualizer,
  options
) {
  options.filename = "Exported " + selectBaseVisualizer.question.name;
});

SurveyAnalytics.PlotlySetup.onPlotCreating.add(function (
  selectBaseVisualizer,
  options
) {
  options.config.modeBarButtonsToRemove.push("lasso2d");
});

var options = {};

var visPanel = new SurveyAnalytics.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  data
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("rankingContainer"));
