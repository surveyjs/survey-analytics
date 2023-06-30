
// var json = JSON.parse(jsonStr);
var json = {};
var survey = new Survey.SurveyModel(json);

var data = [];

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  {
    allowChangeAnswersOrder: true,
    allowShowPercentages: true,
    allowHideEmptyAnswers: false,
    allowTransposeData: false,
    allowTopNAnswers: true,
  }
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
