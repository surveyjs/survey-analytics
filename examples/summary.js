var surveyId = "";
var accessKey = "";

var survey = new Survey.SurveyModel(json);

// var xhr = new XMLHttpRequest();
// xhr.open(
//   "GET",
//   "http://surveyjs.io/api/MySurveys/getSurveyResults/" +
//     surveyId +
//     "?accessKey=" +
//     accessKey
// );
// xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
// xhr.onload = function() {
//   var result = xhr.response ? JSON.parse(xhr.response) : [];

//   var visPanel = new SurveyAnalyticsPlotly.VisualizationPanel(
//     survey.getAllQuestions(),
//     data
//   );
//   visPanel.showToolbar = true;
//   visPanel.render(document.getElementById("summaryContainer"));
// };
// xhr.send();

// SurveyAnalyticsPlotly.SelectBasePlotly.displayModeBar = false;

// SurveyAnalyticsPlotly.VisualizerBase.suppressVisualizerStubRendering = true;

// SurveyAnalyticsPlotly.VisualizationManager.registerVisualizer("rating", SurveyAnalyticsPlotly.NpsVisualizer);

SurveyAnalyticsPlotly.PlotlySetup.onImageSaving.add(function (selectBaseVisualizer, options) {
  options.filename = "Exported " + selectBaseVisualizer.question.name;
});

// SurveyAnalyticsPlotly.PlotlySetup.onPlotCreating.add(function(selectBaseVisualizer, options) {
//   options.config.modeBarButtonsToRemove.push("lasso2d");
// });

var options = {
  // allowTransposeData: true,
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

// SurveyAnalyticsPlotly.WordCloudAdapter.drawOutOfBound = false;
// SurveyAnalyticsPlotly.WordCloudAdapter.shrinkToFit = true;
// SurveyAnalyticsPlotly.WordCloudAdapter.weightFactor = 30;

var visPanel = new SurveyAnalyticsPlotly.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  data,
  options
);

SurveyAnalyticsExamples.setupThemeSelector("theme-selector", visPanel);

// visPanel.applyTheme(SurveyTheme.DefaultDark);
// visPanel.applyTheme(SurveyTheme.DefaultLight);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
