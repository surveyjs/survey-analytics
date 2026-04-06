var survey = new Survey.SurveyModel(json);
var options = {
  allowDynamicLayout: false,
};

var visPanel = new SurveyAnalyticsChartjs.VisualizationPanel(
  [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  data,
  options
);

visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
