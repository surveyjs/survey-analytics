function CustomVisualizer(question, data) {
  var values = [];

  var visualizer = new SurveyAnalyticsPlotly.SelectBasePlotly(
    question,
    data,
    { },
    "textChartVisualizer"
  );
  visualizer.getValues = function () { return values; };
  visualizer.getLabels = function () { return values; };
  visualizer.getCalculatedValuesCore = function () {
    var result = {};
    values.length = 0;
    visualizer.surveyData.forEach(function (row) {
      var rowValue = row[visualizer.question.name];
      if (rowValue !== undefined) {
        if(result[rowValue] === undefined) {
          result[rowValue] = 1;
        } else {
          result[rowValue]++;
        }
      }
    });

    values.push.apply(values, Object.keys(result));
    return [values.map(function(value) { return result[value]; })];
  };

  return visualizer;
}

// Unregister other visualizers for the "text" question type
SurveyAnalyticsPlotly.VisualizationManager.unregisterVisualizer(
  "text",
  SurveyAnalyticsPlotly.WordCloud
);
SurveyAnalyticsPlotly.VisualizationManager.unregisterVisualizer(
  "text",
  SurveyAnalyticsPlotly.Text
);
// Register custom visualizer for the given question type
SurveyAnalyticsPlotly.VisualizationManager.registerVisualizer(
  "text",
  CustomVisualizer
);
// Set localized title of this visualizer
SurveyAnalyticsPlotly.localization.locales["en"]["visualizer_textChartVisualizer"] =
  "Text as Chart";

var json = {
  elements: [
    {
      type: "text",
      inputType: "text",
      name: "zipcode",
      title: "Postal code"
    }
  ]
}
var survey = new Survey.SurveyModel(json);

var data = [
  { zipcode: "000001" }, { zipcode: "100001" }, { zipcode: "500001" }, { zipcode: "000001" }, { zipcode: "500001" }, { zipcode: "000001" }
]

var visPanel = new SurveyAnalyticsPlotly.VisualizationPanel(
  survey.getAllQuestions(),
  data
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
