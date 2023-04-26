function CustomVisualizer(question, data) {
  var values = [];

  var dataProvider = new SurveyAnalytics.DataProvider(data);

  dataProvider.getDataCore = function (visualizer) {
    var result = {};
    this.filteredData.forEach(function (row) {
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

  var visualizer = new SurveyAnalytics.SelectBasePlotly(
    question,
    data,
    {
      dataProvider: dataProvider
    },
    "textChartVisualizer"
  );
  visualizer.getValues = function () { return values; };
  visualizer.getLabels = function () { return values; };

  return visualizer;
}

// Unregister other visualizers for the "text" question type
SurveyAnalytics.VisualizationManager.unregisterVisualizer(
  "text",
  SurveyAnalytics.WordCloud
);
SurveyAnalytics.VisualizationManager.unregisterVisualizer(
  "text",
  SurveyAnalytics.Text
);
// Register custom visualizer for the given question type
SurveyAnalytics.VisualizationManager.registerVisualizer(
  "text",
  CustomVisualizer
);
// Set localized title of this visualizer
SurveyAnalytics.localization.locales["en"]["visualizer_textChartVisualizer"] =
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

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  data
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
