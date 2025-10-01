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

const visualizerDefinition1 = {
  visualizerType: "gauge",
  chartType: "bullet",
  dataName: "test",
  displayValueName: "count",
  title: "Total answers count - Gauge"
};

const visualizerDefinition2 = {
  visualizerType: "card",
  dataName: "test",
  displayValueName: "count",
  title: "Total answers count - Card"
};

const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }, {}];
let visPanel = new SurveyAnalytics.VisualizationPanel([visualizerDefinition1, visualizerDefinition2], data, options);

visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
