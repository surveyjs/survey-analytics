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

//   // SurveyAnalytics.SelectBasePlotly.types = ["pie", "scatter"];
//   // SurveyAnalytics.VisualizerBase.customColors = [
//   //   "F85A40",
//   //   "185A32",
//   //   "BC1CEC",
//   //   "DC4E75",
//   //   "747F4B",
//   //   "000000"
//   // ];

//   var visPanel = new SurveyAnalytics.VisualizationPanel(
//     survey.getAllQuestions(),
//     data
//   );
//   visPanel.showToolbar = true;
//   visPanel.render(document.getElementById("summaryContainer"));
// };
// xhr.send();

// SurveyAnalytics.SelectBasePlotly.displayModeBar = false;

// SurveyAnalytics.VisualizerBase.suppressVisualizerStubRendering = true;

SurveyAnalytics.PlotlySetup.onImageSaving.add(function (selectBaseVisualizer, options) {
  options.filename = "Exported " + selectBaseVisualizer.question.name;
});

// SurveyAnalytics.PlotlySetup.onPlotCreating.add(function(selectBaseVisualizer, options) {
//   options.config.modeBarButtonsToRemove.push("lasso2d");
// });

var options = {
  // allowDynamicLayout: false,
  // allowDragDrop: false,
  // allowHideQuestions: false,
  // allowShowPercentages: true,
  // showPercentages: true,
  // showOnlyPercentages: true,
  // useValuesAsLabels: false
  // haveCommercialLicense: false,
  // allowChangeAnswersOrder: true,
  // answersOrder: "desc"
  // allowHideEmptyAnswers: true,
  // hideEmptyAnswers: true,
  // allowTopNAnswers: true,
  // showCorrectAnswers: true
  // labelTruncateLength: 27,
};

// SurveyAnalytics.WordCloudAdapter.drawOutOfBound = false;
// SurveyAnalytics.WordCloudAdapter.shrinkToFit = true;
// SurveyAnalytics.WordCloudAdapter.weightFactor = 30;

var visPanel = new SurveyAnalytics.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
