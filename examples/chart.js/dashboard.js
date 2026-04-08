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

const checkbox = document.getElementById('toggle-checkbox');
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    dashboard.applyTheme(SurveyAnalyticsTheme.DefaultDark);
  } else {
    dashboard.applyTheme(SurveyAnalyticsTheme.DefaultLight);
  }
});

// dashboard.applyTheme(SurveyAnalyticsTheme.DefaultDark);
// dashboard.applyTheme(SurveyAnalyticsTheme.DefaultLight);
dashboard.showToolbar = true;
dashboard.render(document.getElementById("summaryContainer"));
