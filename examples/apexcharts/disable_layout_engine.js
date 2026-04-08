var survey = new Survey.SurveyModel(json);
var options = {
  // allowTransposeData: true,
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
  allowDynamicLayout: false,
};

var visPanel = new SurveyAnalyticsApexcharts.VisualizationPanel(
  [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  // survey.getAllQuestions(),
  data,
  options
);

visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
