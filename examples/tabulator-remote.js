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

// function getPaginatedData({ offset, limit, filter, sorting, callback }) {
//   setTimeout(() => {
//     callback({ data: normalizedData.slice(offset, offset + limit), total: normalizedData.length });
//   }, 1000);
// }

// function getPaginatedData({ offset, limit, filter, sorting}) {
//   const url = "http://www.example.com/";
//   const reqBody = { skip, take, pageSize };
//   return fetch(url, { body: reqBody });
// }

function getPaginatedData({ offset, limit, filter, sorting }) {
  console.log(JSON.stringify(filter));
  console.log(JSON.stringify(sorting));
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: normalizedData.slice(offset, offset + limit), total: normalizedData.length });
    }, 1000);
  });
}

var surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
  survey,
  getPaginatedData
);

surveyAnalyticsTabulator.render("tabulatorContainer");
