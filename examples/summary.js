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

//   var normalizedData = result.Data.map(function(item) {
//     survey.getAllQuestions().forEach(function(q) {
//       if (!item[q.name]) {
//         item[q.name] = "";
//       }
//     });
//     return item;
//   });

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
//     document.getElementById("summaryContainer"),
//     survey.getAllQuestions(),
//     normalizedData
//   );
//   visPanel.showHeader = true;
//   visPanel.render();
// };
// xhr.send();

var normalizedData = data.map(function(item) {
  survey.getAllQuestions().forEach(function(q) {
    if (item[q.name] === undefined) {
      item[q.name] = "";
    }
  });
  return item;
});

// SurveyAnalytics.SelectBasePlotly.displayModeBar = false;

var options = {
  // allowDynamicLayout: false,
  // allowHideQuestions: false
}

var visPanel = new SurveyAnalytics.VisualizationPanel(
  document.getElementById("summaryContainer"),
  survey.getAllQuestions(),
  normalizedData,
  options
);
visPanel.showHeader = true;
visPanel.render();
