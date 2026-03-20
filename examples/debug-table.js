
// var json = JSON.parse(jsonStr);
var json = {}; // surveyInfo[0].survey_config_json;
var survey = new Survey.SurveyModel(json);

var data = []; //dataInfo.map(item => item.response_json);

function getPaginatedData({ offset, limit, filter, sort }) {
  console.log(JSON.stringify(filter));
  console.log(JSON.stringify(sort));
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: data.slice(offset, offset + limit), totalCount: data.length });
    }, 1);
  });
}

// var surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
//   survey,
//   data,
// );
var surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
  survey,
  getPaginatedData,
);

surveyAnalyticsTabulator.render("tabulatorContainer");
