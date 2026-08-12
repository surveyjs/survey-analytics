var survey = new Survey.SurveyModel(json);

var visPanel = new SurveyAnalyticsApexcharts.Dashboard({
    questions: survey.getAllQuestions(), // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
    data, 
    dateFieldName: "timestamp",
    dateRange: [Date.parse("2025-10-15"), Date.parse("2025-10-15")],
    // datePeriod: "lastYear",
    // availableDatePeriods: [],
    // showAnswerCount: true,
    // showDatePanel: true,
    // includeToday: true,
});
visPanel.showToolbar = true;

SurveyAnalyticsExamples.setupThemeSelector("theme-selector", visPanel);

visPanel.render(document.getElementById("summaryContainer"));
