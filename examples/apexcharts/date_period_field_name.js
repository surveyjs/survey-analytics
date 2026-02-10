var survey = new Survey.SurveyModel(json);

var options = {
  dateFieldName: "timestamp",
  dateRange: [Date.parse("2025-10-15"), Date.parse("2025-10-15")],
  // datePeriod: "lastYear",
  // availableDatePeriods: [],
  // showAnswerCount: true,
  // showDatePanel: true,
  // includeToday: true,
};

var visPanel = new SurveyAnalyticsApexcharts.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  data,
  options
);
visPanel.showToolbar = true;

const checkbox = document.getElementById('toggle-checkbox');
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    visPanel.applyTheme(SurveyAnalyticsTheme.DefaultDark);
  } else {
    visPanel.applyTheme(SurveyAnalyticsTheme.DefaultLight);
  }
});

visPanel.render(document.getElementById("summaryContainer"));
