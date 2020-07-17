var survey = new Survey.SurveyModel(json);

var normalizedData = data.map(function (item) {
  survey.getAllQuestions().forEach(function (q) {
    if (!item[q.name]) {
      item[q.name] = "";
    }
  });
  return item;
});

var surveyAnalyticsTabulator = new SurveyAnalytics.Tabulator(
  document.getElementById("tabulatorContainer"),
  survey,
  normalizedData
);

surveyAnalyticsTabulator.onTableToolsCreated.add(function (table, opt) {
  var tools = opt.tools;
  tools.actions.push(function (table) {
    var btn = document.createElement("button");
    btn.className = "sa-table__btn sa-table__btn--green";
    btn.innerHTML = "Remove rows";
    btn.style.marginLeft = "20px";
    btn.onclick = function () {
      table.getRows().forEach(function (row) {
        if (row.isSelected) {
          row.remove();
        }
      });
    };
    return btn;
  });
});

surveyAnalyticsTabulator.onRowCreated.add(function (table, opt) {
  var row = opt.row;
  row.setIsSelected = function (val) {
    row.isSelected = val;
  };
  row.remove = function () {
    row.row.delete();
  };
  var rowTools = opt.row.tools;
  rowTools.actions.push(function (row, table) {
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = function (ev) {
      row.setIsSelected(checkbox.value == "on");
    };
    return checkbox;
  });
  row.row.getCells()[0].getColumn().setWidth("100");
});

surveyAnalyticsTabulator.render();
