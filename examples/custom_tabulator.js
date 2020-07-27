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

SurveyAnalyticsTabulator.TableTools.registerTool(
  "header",
  "removerows",
  function (table) {
    var btn = document.createElement("button");
    btn.className = "sa-table__btn sa-table__btn--green";
    btn.innerHTML = "Remove rows";
    btn.style.marginRight = "20px";
    btn.onclick = function () {
      table.tabulatorTables.getSelectedRows().forEach(function (row) {
        if (row.isSelected) {
          row.delete();
        }
      });
    };
    return btn;
  }
);

SurveyAnalyticsTabulator.TableTools.registerTool("row", "select", function (
  table,
  opt
) {
  var row = opt.row;
  var checkbox = SurveyAnalyticsTabulator.DocumentHelper.createElement(
    "input",
    "",
    {
      type: "checkbox",
    }
  );
  checkbox.style.height = "auto";
  checkbox.style.marginLeft = "10px";
  checkbox.onchange = function (ev) {
    row.innerRow.toggleSelect();
  };
  return checkbox;
});

SurveyAnalyticsTabulator.TableTools.registerTool(
  "details",
  "showinsurvey",
  (table, opt) => {
    const btn = document.createElement("button");
    btn.innerHTML = "Show in Survey";
    btn.className = "rounded-button";
    btn.onclick = (e) => {
      e.stopPropagation();
    };
    return btn;
  }
);

SurveyAnalyticsTabulator.TableTools.registerTool(
  "details",
  "delete",
  (table, opt) => {
    const btn = document.createElement("button");
    btn.className = "rounded-button rounded-button--danger";
    btn.innerHTML = "Delete Result";
    btn.onclick = (e) => {
      e.stopPropagation();
      opt.row.innerRow.delete();
    };
    return btn;
  }
);

var surveyAnalyticsDataTables = new SurveyAnalyticsTabulator.Tabulator(
  survey,
  normalizedData
);
surveyAnalyticsDataTables.toolsOptions.row.push("select");
surveyAnalyticsDataTables.toolsOptions.header = ["removerows"].concat(
  surveyAnalyticsDataTables.toolsOptions.header
);
surveyAnalyticsTabulator.toolsOptions.details = ["showinsurvey", "delete"];

surveyAnalyticsTabulator.render(document.getElementById("tabulatorContainer"));
surveyAnalyticsTabulator.tabulatorTables.getColumns()[0].setWidth("100");
