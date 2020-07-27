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
      table.datatableApi.rows(".selected").remove().draw();
    };
    return btn;
  }
);

SurveyAnalyticsDatatables.TableTools.registerTool("row", "select", function (
  table,
  opt
) {
  var row = opt.row;
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onchange = function (ev) {
    if (checkbox.value == "on") row.innerRow.select();
    else row.innerRow.deselect();
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
      row.innerRow.remove().draw();
    };
  }
);

var surveyAnalyticsDataTables = new SurveyAnalyticsDatatables.DataTables(
  survey,
  normalizedData
);
surveyAnalyticsDataTables.toolsOptions.row.push("select");
surveyAnalyticsDataTables.toolsOptions.header.push("removerows");

// surveyAnalyticsDataTables.columns =  [{name: "bool", displayName: "Please answer the question", dataType: 0, visibility: 1, location: 0},
// {name: "organization_type", displayName: "Which of the following best describes you or your organization?", dataType: 0, visibility: 0, location: 1},
//  {name: "developer_count", displayName: "How many software developers are in your organization?", dataType: 0, visibility: 0, location: 1},
//  {name: "VerticalMarket", displayName: "What vertical market does your product serve?", dataType: 0, visibility: 0, location: 0},
//  {name: "product_discovering", displayName: "How did you first discover the product?", dataType: 0, visibility: 1, location: 0},
//  {name: "javascript_frameworks", displayName: "What JavaScript framework do you use?", dataType: 0, visibility: 0, location: 0},
//  {name: "backend_language", displayName: "What Web Backend programming language do you use?", dataType: 0, visibility: 0, location: 0},
//  {name: "useproduct", displayName: "Do you currently use our libraries?", dataType: 0, visibility: 0, location: 0},
//  {name: "uselibraries", displayName: "What libraries do you use?", dataType: 0, visibility: 0, location: 0},
//  {name: "product_new", displayName: "We are going to release new libraries shortly. Ple… a product(s), if you are interesting to use them", dataType: 0, visibility: 0, location: 0},
//  {name: "supported_devices", displayName: "What device types do you need to support?", dataType: 0, visibility: 0, location: 0},
//  {name: "native_mobile_support", displayName: "How is important for you a native mobile support?", dataType: 0, visibility: 0, location: 0},
//  {name: "native_framework", displayName: "Please name the framework that you are using or going to use in your native mobile developlment", dataType: 0, visibility: 0, location: 0},
//  {name: "product_alternative", displayName: "What would you use as an alternative if SurveyJS does not exist?", dataType: 0, visibility: 0, location: 0},
//  {name: "survey_cloud_platform", displayName: "What Survey cloud platform would be your choice?", dataType: 0, visibility: 0, location: 0},
//  {name: "product_recommend", displayName: "Have you recommended the product to anyone?", dataType: 0, visibility: 0, location: 0},
//  {name: "nps_score", displayName: "How likely are you to recommend SurveyJS to a friend or colleague?", dataType: 0, visibility: 0, location: 0},
//  {name: "favorite_functionality", displayName: "What's your favorite functionality / add-on?", dataType: 0, visibility: 0, location: 0},
//  {name: "product_improvement", displayName: "How could our products be improved to better meet your needs?", dataType: 0, visibility: 0, location: 0},]

surveyAnalyticsDataTables.render(
  document.getElementById("dataTablesContainer")
);
