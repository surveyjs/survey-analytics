var survey = new Survey.SurveyModel(json);

var normalizedData = data.map(function(item) {
  survey.getAllQuestions().forEach(function(q) {
    if (item[q.name] === undefined) {
      item[q.name] = "";
    }
  });
  return item;
});

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  normalizedData
);
visPanel.showHeader = true;
visPanel.render(document.getElementById("summaryContainer"));
