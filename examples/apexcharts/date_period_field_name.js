var survey = new Survey.SurveyModel(json);

var options = {
  dateFieldName: "timestamp",
  datePeriod: "lastYear",
  availableDatePeriods: [],
  dateRange: [],
  showAnswerCount: true,
  showDatePanel: true,
  includeToday: true,
  onDateRangeChanged: (dateRange, datePeriod) => {
    console.log(datePeriod);
  }
};

var visPanel = new SurveyAnalyticsApexcharts.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
