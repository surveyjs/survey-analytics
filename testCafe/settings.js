import { ClientFunction } from "testcafe";
export const url = "http://127.0.0.1:8080/examples/summarytest.html";

export const initSummary = ClientFunction((json, data, options, elements) => {
  var model = new window.Survey.SurveyModel(json);
  window.survey = model;
  if (!!window.visPanel) {
    window.visPanel.destroy();
  }
  var visPanel = (window.visPanel = new window.SurveyAnalytics.VisualizationPanel(
    survey.getAllQuestions(),
    data,
    options,
    elements
  ));
  visPanel.showHeader = true;
  visPanel.render(document.getElementById("summaryContainer"));
});

export function RGBToHex(rgb) {
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}
