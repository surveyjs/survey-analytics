var json = {
  "pages": [
    {
      "name": "promotion",
      "elements": [
        {
          "type": "rating",
          "name": "nps",
          "title": "How likely are you to recommend our product to a friend or colleague?",
          "isRequired": true,
          "rateMin": 0,
          "rateMax": 10,
          "minRateDescription": "Most unlikely",
          "maxRateDescription": "Most likely"
        }
      ]
    }   
  ]
};
var survey = new Survey.SurveyModel(json);

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function generateData() {
    const data = [];
    for (let index = 0; index < 1000; index++) {
        data.push({
            nps: (index % 2) ? randomIntFromInterval(0, 10) : randomIntFromInterval(8, 10)
        });
    }
    return data;
}
var dataFromServer = generateData();

var vizPanel = new SurveyAnalytics.VisualizationPanel(
    [{
      visualizerType: "nps",
      question: survey.getAllQuestions()[0]
    }],
    dataFromServer,
    { allowDynamicLayout: false, allowHideQuestions: false }
);
vizPanel.render(document.getElementById("container"));
