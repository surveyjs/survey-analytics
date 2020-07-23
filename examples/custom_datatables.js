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

SurveyAnalyticsDatatables.TableTools.registerTool(
  "header",
  "removerows",
  function (table) {
    var btn = document.createElement("button");
    btn.className = "sa-table__btn sa-table__btn--green";
    btn.innerHTML = "Remove rows";
    btn.style.marginLeft = "20px";
    btn.onclick = function () {
      table.getCreatedRows().forEach(function (row) {
        if (row.isSelected) {
          row.remove();
        }
      });
      table.datatableApi.draw();
    };
    return btn;
  }
);

SurveyAnalyticsDatatables.TableTools.registerTool("row", "select", function (
  table,
  opt
) {
  var row = opt.row;
  row.setIsSelected = function (val) {
    row.isSelected = val;
  };
  row.remove = function (needUpdate) {
    row.innerRow.remove();
    if (needUpdate) {
      row.innerRow.draw();
    }
  };
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onchange = function (ev) {
    row.setIsSelected(checkbox.value == "on");
  };
  return checkbox;
});

SurveyAnalyticsDatatables.TableTools.registerTool(
  "showinsurvey",
  "details",
  (table, row) => {
    const button1 = document.createElement("button");
    button1.innerHTML = "Show in Survey";
    button1.className = "rounded-button";
    button1.onclick = (e) => {
      e.stopPropagation();
    };
    return button;
  }
);

SurveyAnalyticsDatatables.TableTools.registerTool(
  "delete",
  "details",
  (table, row) => {
    const button2 = document.createElement("button");
    button2.className = "rounded-button rounded-button--danger";
    button2.innerHTML = "Delete Result";
    button2.onclick = (e) => {
      e.stopPropagation();
      row.remove(true);
    };
  }
);

var surveyAnalyticsDataTables = new SurveyAnalyticsDatatables.DataTables(
  survey,
  normalizedData
);
surveyAnalyticsDataTables.toolsOptions.row.push("select");
surveyAnalyticsDataTables.toolsOptions.header.push("removerows");

surveyAnalyticsDataTables.render(
  document.getElementById("dataTablesContainer")
);
