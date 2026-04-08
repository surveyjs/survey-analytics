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

var visPanel = new SurveyAnalytics.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  data,
  options
);

const checkbox = document.getElementById('toggle-checkbox');
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    visPanel.applyTheme(SurveyAnalyticsTheme.DefaultDark);
  } else {
    visPanel.applyTheme(SurveyAnalyticsTheme.DefaultLight);
  }
});

visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
