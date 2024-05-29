var surveyId = "";
var accessKey = "";

var survey = new Survey.SurveyModel(json);

// var xhr = new XMLHttpRequest();
// xhr.open(
//   "GET",
//   "http://surveyjs.io/api/MySurveys/getSurveyResults/" +
//     surveyId +
//     "?accessKey=" +
//     accessKey
// );
// xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
// xhr.onload = function() {
//   var result = xhr.response ? JSON.parse(xhr.response) : [];

//   // SurveyAnalytics.SelectBasePlotly.types = ["pie", "scatter"];
//   // SurveyAnalytics.VisualizerBase.customColors = [
//   //   "F85A40",
//   //   "185A32",
//   //   "BC1CEC",
//   //   "DC4E75",
//   //   "747F4B",
//   //   "000000"
//   // ];

//   var visPanel = new SurveyAnalytics.VisualizationPanel(
//     survey.getAllQuestions(),
//     data
//   );
//   visPanel.showToolbar = true;
//   visPanel.render(document.getElementById("summaryContainer"));
// };
// xhr.send();

// SurveyAnalytics.SelectBasePlotly.displayModeBar = false;

// SurveyAnalytics.VisualizerBase.suppressVisualizerStubRendering = true;

SurveyAnalytics.PlotlySetup.onImageSaving.add(function (selectBaseVisualizer, options) {
  options.filename = "Exported " + selectBaseVisualizer.question.name;
});

// SurveyAnalytics.PlotlySetup.onPlotCreating.add(function(selectBaseVisualizer, options) {
//   options.config.modeBarButtonsToRemove.push("lasso2d");
// });

var options = {
  // allowDynamicLayout: false,
  // allowDragDrop: false,
  // allowHideQuestions: false,
  // allowShowPercentages: true,
  // showPercentages: true,
  // showOnlyPercentages: true,
  // useValuesAsLabels: false
  // haveCommercialLicense: false,
  // allowChangeAnswersOrder: true,
  // answersOrder: "desc"
  // allowHideEmptyAnswers: true,
  // hideEmptyAnswers: true,
  // allowTopNAnswers: true,
  // showCorrectAnswers: true
  // labelTruncateLength: 27,
};

// SurveyAnalytics.WordCloudAdapter.drawOutOfBound = false;
// SurveyAnalytics.WordCloudAdapter.shrinkToFit = true;
// SurveyAnalytics.WordCloudAdapter.weightFactor = 30;

const summaryData = {
  // matrix - 5 cols - 4 rows
  "Quality": [[0,0,0,0],[0,2,0,0],[2,0,0,2],[1,0,1,0],[1,1,1,1]],
  // boolean - true - false
  "boolValue": [[2,1]],
  // radiogroup - 5 + other
  "organization_type": [[1,0,4,2,3,2]],
  "organization_type-Comment": [["start",1]],
  // radiogroup - 5
  "developer_count": [[2,1,6,1,2]],
  // radiogroup - 27 + other
  "VerticalMarket": [[0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,0,1,0,0,0,2,1,1,1]],
  "VerticalMarket-Comment": [],
  // radiogroup - 7 + other
  "product_discovering": [[0,0,0,0,0,0,6,6]],
  "product_discovering-Comment": [],
  // checkbox - 11 + other
  "javascript_frameworks": [[2,0,0,0,0,0,0,0,3,8,4,1]],
  "javascript_frameworks-Comment": [["react",1],["native",1],["angularjs",1]],
  // checkbox - 7 + other
  "backend_language": [[5,2,2,1,0,2,1,2]],
  // checkbox other texts for wordcloud
  "backend_language-Comment": [["php",5]],
  // tagbox - 7 + other
  "backend_language_tag": [[3,10,7,20,11,4,7,9]],
  "backend_language_tag-Comment": [["ease",1],["creating",10]],
  // radiogroup - 2
  "useproduct": [[3,9]],
  // checkbox - 2
  "uselibraries": [[3,9]],
  // checkbox - 2
  "product_new": [[9,8]],
  // checkbox - 3
  "supported_devices": [[8,7,9]],
  // radiogroup - 4
  "native_mobile_support": [[0,2,5,1]],
  // radiogroup - 5 + other
  "native_framework": [[0,0,0,0,0,2]],
  "native_framework-Comment": [],
  // radiogroup - 2 + other
  "product_alternative": [[0,12,0]],
  "product_alternative-Comment": [],
  // text
  "survey_cloud_platform": [],
  // radiogroup - 2
  "product_recommend": [[2,10]],
  // rating - 0-10 (histogram)
  "nps_score_histogram": [[0,0,0,1,0,0,2,0,6,1,2]],
  // rating - 0-10 (number)
  "nps_score_number": [6.5, 0, 10],
  // comment (wordcloud)
  "favorite_functionality_wordcloud": [["ease",1],["creating",1],["survey",2],["builder",1],["rendering",1],["html",1],["web",1],["browser",1],["flexibility",1],["surveyjs",1],["dgefd",1],["audio",1],["recordingnicely",1],["handle",1],["logical",1],["checks",1]],
  // comment (text)
  "favorite_functionality_text": { columnsCount: 2, data: [["aswdasdasd sadf asfda sd"], ["sdf sdf sdf sfdasdf ga"], ["word", "some text"]] },
  // comment
  "product_improvement": [["native",3],["support",7],["mobile",1],["platform",1],["großmutter",9],["product",1],["super",1],["functional",1],["ux",1],["challenging",1],["goals",1],["attract",1],["audience",3],["survey",2],["builder",5],["site",1],["revisit",1],["usability",1],["ui",2],["able",1],["successfully",1],["don't",1],["input",1],["negative",1],["trial",1],["error",1],["learning",1],["logic",1],["surveymonkey",1],["dfgdfg",1],["fix",1],["rtl",1],["bugs\nsave",1],["\"not",1],["answered",1],["questions\"",1],["matrix",1],["survey's",1],["json",1],["lack",1],["accessibility",1],["huge",1],["disadvantage",1],["that's",1],["reason",1],["projects",1]],
}

// function getSummaryData({ questionNames, filter, sort, callback }) {
//   console.log(JSON.stringify(filter));
//   console.log(JSON.stringify(sort));
//   setTimeout(() => {
//     callback({ data: summaryData[questionNames[0]] });
//   }, 1000);
// }

// function getSummaryData({ questionNames, filter, sort}) {
//   const url = "http://www.example.com/";
//   const reqBody = { questionNames, filter, sort };
//   return fetch(url, { body: reqBody });
// }

function getSummaryData({ visualizer, questionNames, filter, sort }) {
  console.log("Question: " + JSON.stringify(questionNames));
  console.log("Filter: " + JSON.stringify(filter));
  console.log("Sort: " + JSON.stringify(sort));
  return new Promise((resolve, reject) => {
    let dataSetName = questionNames[0];
    if(["histogram", "number", "wordcloud", "text"].indexOf(visualizer.type) != -1) {
      dataSetName += "_" + visualizer.type;
    }
    const data = summaryData[dataSetName] || summaryData[questionNames[0]];
    if(data !== undefined) {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    } else {
      reject("Invalid question name " + questionNames[0]);
    }
  });
}

var visPanel = new SurveyAnalytics.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  // data, 
  getSummaryData,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
