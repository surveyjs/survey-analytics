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

// SurveyAnalyticsDatatables.TableExtensions.unregisterExtension("header", "changelocale");

SurveyAnalyticsDatatables.Table.showFilesAsImages = true;

SurveyAnalyticsDatatables.TableExtensions.registerExtension({
  location: "details",
  name: "showinsurvey",
  visibleIndex: 0,
  render: (table, opt) => {
    const btn = SurveyAnalyticsDatatables.DocumentHelper.createElement(
      "button",
      "rounded-button",
      {
        innerText: "Show in Survey",
        onclick: (e) => {
          e.stopPropagation();
        },
      }
    );
    return btn;
  },
});

SurveyAnalyticsDatatables.TableExtensions.registerExtension({
  location: "details",
  name: "delete",
  visibleIndex: 1,
  render: (table, opt) => {
    const btn = SurveyAnalyticsDatatables.DocumentHelper.createElement(
      "button",
      "rounded-button rounded-button--danger",
      {
        innerText: "Delete Result",
        onclick: (e) => {
          e.stopPropagation();
          opt.row.remove();
        },
      }
    );
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
  normalizedData,
  {
    // useNamesAsTitles: true
  }
);

surveyAnalyticsDataTables.render(
  document.getElementById("dataTablesContainer")
);
