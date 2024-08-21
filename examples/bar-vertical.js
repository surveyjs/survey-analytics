var surveyId = "";
var accessKey = "";

var survey = new Survey.SurveyModel(json);

SurveyAnalytics.PlotlySetup.onImageSaving.add(function (selectBaseVisualizer, options) {
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
  allowChangeAnswersOrder: true,
  // answersOrder: "desc"
  allowHideEmptyAnswers: true,
  // hideEmptyAnswers: true,
  allowTopNAnswers: true,
  // allowShowMissingAnswers: true,
  allowExperimentalFeatures: true,
  defaultChartType: "vbar"
};


var visPanel = new SurveyAnalytics.VisualizationPanel(
  [survey.getQuestionByName("backend_language")],
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
