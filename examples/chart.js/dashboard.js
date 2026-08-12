var survey = new Survey.SurveyModel(json);

var options = {
  // allowTransposeData: true,
  // allowDynamicLayout: false,
  // allowDragDrop: false,
  // allowHideQuestions: false,
  // allowShowPercentages: true,
  // showPercentages: true,
  // showOnlyPercentages: true,
  // useValuesAsLabels: false,
  // haveCommercialLicense: false,
  // allowSortAnswers: true,
  // answersOrder: "desc",
  // allowHideEmptyAnswers: true,
  // hideEmptyAnswers: true,
  // allowTopNAnswers: true,
  // showCorrectAnswers: true,
  // labelTruncateLength: 27,
  dateFieldName: "timestamp",
};

var dashboard = new SurveyAnalytics.Dashboard({
  // questions: [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  questions: survey.getAllQuestions(),
  data,
});

SurveyAnalyticsExamples.setupThemeSelector("theme-selector", dashboard);

// dashboard.applyTheme(SurveyTheme.DefaultDark);
// dashboard.applyTheme(SurveyTheme.DefaultLight);
dashboard.showToolbar = true;
dashboard.render(document.getElementById("summaryContainer"));
