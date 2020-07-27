var survey = new Survey.SurveyModel(json);

var normalizedData = data.map(function (item) {
  survey.getAllQuestions().forEach(function (q) {
    if (item[q.name] === undefined) {
      item[q.name] = "";
    }
  });
  return item;
});

var options = {
  // allowDynamicLayout: false,
  // allowHideQuestions: false,
  survey: survey,
};

var visPanel = new SurveyAnalytics.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  normalizedData,
  options
);
visPanel.showHeader = true;
visPanel.render(document.getElementById("summaryContainer"));
