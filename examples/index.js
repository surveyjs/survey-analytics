var surveyId = "0edf84f9-14f7-4944-a857-e327e1dceebb";
var accessKey = "dc736a6f384d48f9b71a1dd94d9d5c24";

var survey = new Survey.SurveyModel({
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "checkbox",
          name: "question1",
          title: "What language(s) are you currently using?",
          choices: ["JS", "C#", "Python", "Ruby"]
        }
      ]
    }
  ]
});

var xhr = new XMLHttpRequest();
xhr.open(
  "GET",
  "http://surveyjs.io/api/MySurveys/getSurveyResults/" +
    surveyId +
    "?accessKey=" +
    accessKey
);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.onload = function() {
  var result = xhr.response ? JSON.parse(xhr.response) : [];

  var surveyAnalyticsDataTables = new SurveyAnalytics.DataTables(
    document.getElementById("tableContainer"),
    survey,
    result.Data
  );

  surveyAnalyticsDataTables.render();
};
xhr.send();
