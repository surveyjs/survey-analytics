var surveyId = "";
var accessKey = "";

var survey = new Survey.SurveyModel(json);

SurveyAnalyticsPlotly.PlotlySetup.onImageSaving.add(function (selectBaseVisualizer, options) {
  options.filename = "Exported " + selectBaseVisualizer.question.name;
});


var options = {
  // allowDynamicLayout: false,
  // allowHideQuestions: false,
  allowShowPercentages: true,
  showPercentages: true,
  showOnlyPercentages: true,
  // useValuesAsLabels: false
  // haveCommercialLicense: false,
  allowSortAnswers: true,
  // answersOrder: "desc"
  allowHideEmptyAnswers: true,
  // hideEmptyAnswers: true,
  allowTopNAnswers: true,
  // allowShowMissingAnswers: true,
  allowExperimentalFeatures: true,
  defaultChartType: "vbar"
};


var visPanel = new SurveyAnalyticsPlotly.VisualizationPanel(
  [survey.getQuestionByName("backend_language")],
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
