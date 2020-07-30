var survey = new Survey.SurveyModel(json);

var normalizedData = data.map(function (item) {
  survey.getAllQuestions().forEach(function (q) {
    if (!item[q.name]) {
      item[q.name] = "";
    }
  });
  return item;
});

var surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
  survey,
  normalizedData
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
        innerHTML: "Show in Survey",
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
        innerHTML: "Delete Result",
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

surveyAnalyticsTabulator.render(document.getElementById("tabulatorContainer"));
