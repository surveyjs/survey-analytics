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
//   visPanel.showHeader = true;
//   visPanel.render(document.getElementById("summaryContainer"));
// };
// xhr.send();

// SurveyAnalytics.SelectBasePlotly.displayModeBar = false;

var options = {
  // allowDynamicLayout: false,
  // allowHideQuestions: false
};

var visPanel = new SurveyAnalytics.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  data,
  options
);
visPanel.showHeader = true;
visPanel.render(document.getElementById("summaryContainer"));
