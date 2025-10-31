var survey = new Survey.SurveyModel(json);

var options = {
  datePeriodFieldName: "timestamp",
};

var visPanel = new SurveyAnalyticsApexcharts.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  data,
  options
);
visPanel.onDatePeriodElementShown.add((sender, options) => {
  options.initialRange = {
    start: Date.parse("2025-10-15"),
    end: Date.parse("2025-10-15")
  };
  // options.showTotalCount = false;
  // options.chipsConfig = null;
});
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
