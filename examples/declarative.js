var options = {
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
};

SurveyAnalytics.VisualizationManager.registerVisualizer("count", SurveyAnalytics.NumberModel);

const visualizerDefinition = {
  visualizerType: "count",
  dataName: "test",
  displayValueName: "count"
};
const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }, {}];
let visPanel = new SurveyAnalytics.VisualizationPanel([visualizerDefinition], data, options);

visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
