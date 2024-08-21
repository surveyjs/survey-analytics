var survey = new Survey.SurveyModel(json);

var options = {
  // allowDynamicLayout: false,
  // allowHideQuestions: false,
  survey: survey,
};

var visPanel = new SurveyAnalytics.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
