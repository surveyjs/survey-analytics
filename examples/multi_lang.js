var customPlotlyLocale = {
  moduleType:"locale",
  name: "ar",
  dictionary: {
    "Zoom": "تكبير/تصغير",
    "Pan": "تحريك",
    "Box select": "تحديد مربع",
    "Lasso select": "تحديد لاسو",
    "Zoom in": "تكبير",
    "Zoom out": "صغر",
    "Autoscale": "تصغير تلقائي",
    "Reset axes": "إعادة ضبط المحاور",
  },
};
Plotly.register(customPlotlyLocale);

var survey = new Survey.SurveyModel(json);

var options = {
  // allowDynamicLayout: false,
  // allowHideQuestions: false,
  survey: survey,
};

var visPanel = new SurveyAnalytics.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
