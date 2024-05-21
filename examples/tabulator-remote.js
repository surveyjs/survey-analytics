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

// function getPaginatedData({ offset, limit, filter, sort, callback }) {
//   console.log(JSON.stringify(filter));
//   console.log(JSON.stringify(sort));
//   setTimeout(() => {
//     callback({ data: normalizedData.slice(offset, offset + limit), totalCount: normalizedData.length });
//   }, 1000);
// }

// function getPaginatedData({ offset, limit, filter, sort}) {
//   const url = "http://www.example.com/";
//   const reqBody = { offset, limit, filter, sort };
//   return fetch(url, { body: reqBody });
// }

function getPaginatedData({ offset, limit, filter, sort }) {
  console.log(JSON.stringify(filter));
  console.log(JSON.stringify(sort));
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: normalizedData.slice(offset, offset + limit), totalCount: normalizedData.length });
    }, 1000);
  });
}

var surveyAnalyticsTabulator = new SurveyAnalyticsTabulator.Tabulator(
  survey,
  getPaginatedData
);

surveyAnalyticsTabulator.render("tabulatorContainer");
