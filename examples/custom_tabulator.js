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
    // columnMinWidth: 50
  }
);

SurveyAnalyticsTabulator.TableExtensions.registerExtension({
  location: "details",
  name: "showinsurvey",
  visibleIndex: 0,
  render: (table, opt) => {
    const btn = SurveyAnalyticsTabulator.DocumentHelper.createButton((e) => {
          e.stopPropagation();
        }, "Show in Survey", "sa-button"
    );
    btn.className += " sa-button-brand-tertiary";
    return btn;
  },
});

SurveyAnalyticsTabulator.TableExtensions.registerExtension({
  location: "details",
  name: "delete",
  visibleIndex: 1,
  render: (table, opt) => {
    const btn = SurveyAnalyticsTabulator.DocumentHelper.createButton(
      (e) => {
          e.stopPropagation();
          opt.row.remove();
        }, "Delete Result", "sa-button"
    );
    btn.className += " sa-button-brand-tertiary";
    return btn;
  },
});

var surveyAnalyticsDataTables = new SurveyAnalyticsTabulator.Tabulator(
  survey,
  normalizedData
);

const checkbox = document.getElementById('toggle-checkbox');
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    surveyAnalyticsTabulator.applyTheme(SurveyAnalyticsTabulator.DefaultDark);
  } else {
    surveyAnalyticsTabulator.applyTheme(SurveyAnalyticsTabulator.Default);
  }
});
// surveyAnalyticsTabulator.applyTheme(SurveyAnalyticsTabulator.DefaultDark);
// surveyAnalyticsTabulator.applyTheme(SurveyAnalyticsTabulator.Default);

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
