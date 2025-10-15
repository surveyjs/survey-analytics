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
};

SurveyAnalytics.VisualizerBase.customColors = [
  "#f3cec9",
  "#e7a4b6",
  "#cd7eaf",
  "#a262a9",
  "#6f4d96",
  "#3d3b72",
  "#182844",
  "#6f4d96",
  "#3d3b72",
  "#182844",
];

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  options
);

// visPanel.applyTheme(SurveyAnalytics.DefaultDark);
// visPanel.applyTheme(SurveyAnalytics.Default);
const newTheme = {};
Object.assign(newTheme, SurveyAnalytics.Default, {
  cssVariables: {
    "--sjs2-color-bg-basic-primary": "gray",
    "--sjs2-color-utility-sheet": "gray",
    "--sjs2-color-control-formbox-focused-bg": "darkgray",
  }
});
visPanel.applyTheme(newTheme);

visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));

const checkbox = document.getElementById('toggle-checkbox');
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    visPanel.applyTheme(SurveyAnalytics.DefaultDark);
  } else {
    visPanel.applyTheme(SurveyAnalytics.Default);
  }
});