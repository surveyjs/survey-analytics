import { ClientFunction } from "testcafe";
export const url = "http://127.0.0.1:8080/examples/summarytest.html";

export const initSummary = ClientFunction((json, data, options) => {
  var model = new window.Survey.SurveyModel(json);
  window.survey = model;
  if (!!window.visPanel) {
    window.visPanel.destroy();
  }
  var visPanel = (window.visPanel = new window.SurveyAnalytics.VisualizationPanel(
    survey.getAllQuestions(),
    data,
    options
  ));
  visPanel.showHeader = true;
  visPanel.render(document.getElementById("summaryContainer"));
});
