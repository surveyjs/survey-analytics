var survey = new Survey.SurveyModel(json);

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  data
);
visPanel.showHeader = true;
visPanel.render(document.getElementById("summaryContainer"));
