var survey = new Survey.SurveyModel(json);

var visPanel = new SurveyAnalytics.Dashboard({
    questions: survey.getAllQuestions(),
    data, 
    dateFieldName: "timestamp",
    dateRange: [Date.parse("2025-10-15"), Date.parse("2025-10-15")],
});
visPanel.showToolbar = true;

SurveyAnalyticsExamples.setupThemeSelector("theme-selector", visPanel);

visPanel.render(document.getElementById("summaryContainer"));
