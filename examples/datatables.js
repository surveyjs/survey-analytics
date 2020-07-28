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

//   var data = result.Data.map(function(item) {
//     survey.getAllQuestions().forEach(function(q) {
//       if (!item[q.name]) {
//         item[q.name] = q.name;
//       }
//     });
//     return item;
//   });

//   var surveyAnalyticsDataTables = new SurveyAnalytics.DataTables(
//     document.getElementById("dataTablesContainer"),
//     survey,
//     data
//   );

//   surveyAnalyticsDataTables.render();
// };
// xhr.send();

// data normalization
var normalizedData = data.map(function (item) {
  survey.getAllQuestions().forEach(function (q) {
    if (!item[q.name]) {
      item[q.name] = "";
    }
  });
  return item;
});

var surveyAnalyticsDataTables = new SurveyAnalyticsDatatables.DataTables(
  survey,
  normalizedData
);

surveyAnalyticsDataTables.render(
  document.getElementById("dataTablesContainer")
);
