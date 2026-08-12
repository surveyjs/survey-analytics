var survey = new Survey.SurveyModel(json);

var visPanel = new SurveyAnalyticsPlotly.VisualizationPanel(
  survey.getAllQuestions(),
  data
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
