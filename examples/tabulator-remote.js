var survey = new Survey.SurveyModel(json);

var normalizedData = data.map(function (item) {
  survey.getAllQuestions().forEach(function (q) {
    if (!item[q.name]) {
      item[q.name] = "";
    }
  });
  return item;
});

SurveyAnalyticsTabulator.Table.showFilesAsImages = true;

function getPaginatedData({ offset, limit, callback }) {
  // const url = "http://www.example.com/";
  // const reqBody = { skip, take, pageSize };
  // return fetch(url, { body: reqBody });
  setTimeout(() => {
    callback({ data: normalizedData.slice(offset, offset + limit), total: normalizedData.length });
  }, 1000);
}

var surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
  survey,
  getPaginatedData
);

surveyAnalyticsTabulator.render("tabulatorContainer");
