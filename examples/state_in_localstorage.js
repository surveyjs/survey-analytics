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

var options = {
  // allowDynamicLayout: false,
  // allowHideQuestions: false,
  // useValuesAsLabels: false
};

var localStorageState = window.localStorage.getItem("saPanelState");
console.log("localstorage getItem");
console.dir(JSON.parse(window.localStorage.getItem("saPanelState")));

var elements = undefined;

if (localStorageState) {
  elements = JSON.parse(localStorageState).elements;
}

var visPanel = new SurveyAnalytics.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  data,
  options,
  elements
);
visPanel.showToolbar = true;

visPanel.onStateChanged.add(function () {
  window.localStorage.setItem("saPanelState", JSON.stringify(visPanel.state));
  console.log("localstorage setItem");
  console.dir(visPanel.state);
});

visPanel.render(document.getElementById("summaryContainer"));

visPanel.onStateChanged.add(function () {
  console.log(visPanel.state.elements[0].displayName);
});
