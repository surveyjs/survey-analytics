var surveyId = "";
var accessKey = "";

var survey = new Survey.SurveyModel(json);

var normalizedData = data.map(function (item) {
  survey.getAllQuestions().forEach(function (q) {
    if (!item[q.name]) {
      item[q.name] = "";
    }
  });
  return item;
});

SurveyAnalyticsDatatables.TableExtensions.registerExtension({
  location: "details",
  name: "showinsurvey",
  visibleIndex: 0,
  render: (table, opt) => {
    const btn = document.createElement("button");
    btn.innerHTML = "Show in Survey";
    btn.className = "rounded-button";
    btn.onclick = (e) => {
      e.stopPropagation();
    };
    return btn;
  },
});

SurveyAnalyticsDatatables.TableExtensions.registerExtension({
  location: "details",
  name: "delete",
  visibleIndex: 1,
  render: (table, opt) => {
    const btn = document.createElement("button");
    btn.className = "rounded-button rounded-button--danger";
    btn.innerHTML = "Delete Result";
    btn.onclick = (e) => {
      e.stopPropagation();
      opt.row.remove();
    };
    return btn;
  },
});

SurveyAnalyticsDatatables.TableExtensions.findExtension(
  "row",
  "details"
).visibleIndex = 1;

SurveyAnalyticsDatatables.TableExtensions.findExtension(
  "row",
  "select"
).visibleIndex = 0;

SurveyAnalyticsDatatables.TableExtensions.findExtension(
  "header",
  "removerows"
).visibleIndex = 0;

SurveyAnalyticsDatatables.TableExtensions.findExtension(
  "header",
  "filter"
).visibleIndex = 1;

var surveyAnalyticsDataTables = new SurveyAnalyticsDatatables.DataTables(
  survey,
  normalizedData
);

surveyAnalyticsDataTables.render(
  document.getElementById("dataTablesContainer")
);
