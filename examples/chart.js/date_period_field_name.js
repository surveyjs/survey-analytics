var survey = new Survey.SurveyModel(json);

var visPanel = new SurveyAnalytics.Dashboard({
    questions: survey.getAllQuestions(),
    data, 
    dateFieldName: "timestamp",
    dateRange: [Date.parse("2025-10-15"), Date.parse("2025-10-15")],
});
visPanel.showToolbar = true;

const checkbox = document.getElementById('toggle-checkbox');
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    visPanel.applyTheme(SurveyTheme.DefaultDark);
  } else {
    visPanel.applyTheme(SurveyTheme.DefaultLight);
  }
});

visPanel.render(document.getElementById("summaryContainer"));
