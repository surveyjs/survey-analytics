var data = [
  { q1: "a" },
  { q1: "b" },
  { q1: "c" },
  { q1: "a" },
  { q1: "b" }
];

var defaultTitleDashboard = new SurveyAnalyticsPlotly.Dashboard({
  items: ["responsecount"],
  data: data,
});
defaultTitleDashboard.render(document.getElementById("summaryContainer"));

var customContainer = document.createElement("div");
customContainer.id = "customTitleContainer";
document.body.appendChild(customContainer);

var customTitleDashboard = new SurveyAnalyticsPlotly.Dashboard({
  items: [{ type: "responsecount", title: "Custom Response Title" }],
  data: data,
});
customTitleDashboard.render(customContainer);
