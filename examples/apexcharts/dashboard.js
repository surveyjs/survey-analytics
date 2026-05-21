var surveyId = "";
var accessKey = "";

var survey = new Survey.SurveyModel(json);

var options = {
  // allowTransposeData: true,
  // allowDynamicLayout: false,
  // allowDragDrop: false,
  // allowHideQuestions: false,
  // allowShowPercentages: true,
  // showPercentages: true,
  // showOnlyPercentages: true,
  // useValuesAsLabels: false
  // haveCommercialLicense: false,
  // allowSortAnswers: true,
  // answersOrder: "desc"
  // allowHideEmptyAnswers: true,
  // hideEmptyAnswers: true,
  // allowTopNAnswers: true,
  // showCorrectAnswers: true
  // labelTruncateLength: 27,
  dateFieldName: "timestamp",
};

var dashboard = new SurveyAnalyticsApexcharts.Dashboard({
  // questions: [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  questions: survey.getAllQuestions(),
  data,
});

const checkbox = document.getElementById('toggle-checkbox');
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    dashboard.applyTheme(SurveyTheme.DefaultDark);
  } else {
    dashboard.applyTheme(SurveyTheme.DefaultLight);
  }
});

// dashboard.applyTheme(SurveyTheme.DefaultDark);
// dashboard.applyTheme(SurveyTheme.DefaultLight);
dashboard.showToolbar = true;
dashboard.render(document.getElementById("summaryContainer"));

