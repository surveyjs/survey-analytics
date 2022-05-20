var survey = new Survey.SurveyModel(json);

var normalizedData = data.map(function (item) {
  survey.getAllQuestions().forEach(function (q) {
    if (!item[q.name]) {
      item[q.name] = "";
    }
  });
  return item;
});

// SurveyAnalyticsTabulator.TableExtensions.unregisterExtension("header", "changelocale");

SurveyAnalyticsTabulator.Table.showFilesAsImages = true;

var surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
  survey,
  normalizedData,
  {
    // useNamesAsTitles: true
  }
);

SurveyAnalyticsTabulator.TableExtensions.registerExtension({
  location: "details",
  name: "showinsurvey",
  visibleIndex: 0,
  render: (table, opt) => {
    const btn = SurveyAnalyticsTabulator.DocumentHelper.createElement(
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

SurveyAnalyticsTabulator.TableExtensions.registerExtension({
  location: "details",
  name: "delete",
  visibleIndex: 1,
  render: (table, opt) => {
    const btn = SurveyAnalyticsTabulator.DocumentHelper.createElement(
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

var surveyAnalyticsDataTables = new SurveyAnalyticsTabulator.Tabulator(
  survey,
  normalizedData
);

SurveyAnalyticsTabulator.TableExtensions.findExtension(
  "row",
  "details"
).visibleIndex = 1;

SurveyAnalyticsTabulator.TableExtensions.findExtension(
  "row",
  "details"
).visibleIndex = 1;

SurveyAnalyticsTabulator.TableExtensions.findExtension(
  "row",
  "select"
).visibleIndex = 0;

SurveyAnalyticsTabulator.TableExtensions.findExtension(
  "header",
  "removerows"
).visibleIndex = 0;

SurveyAnalyticsTabulator.TableExtensions.findExtension(
  "header",
  "filter"
).visibleIndex = 1;

surveyAnalyticsTabulator.options.actionsColumnWidth = 100;

surveyAnalyticsTabulator.render("tabulatorContainer");
