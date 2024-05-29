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
  "Quality": {
    "affordable": {
      1: 0,
      2: 0,
      3: 2,
      4: 1,
      5: 1
    },
    "does what it claims": {
      1: 0,
      2: 2,
      3: 0,
      4: 0,
      5: 1
    },
    "better then others": {
      1: 0,
      2: 0,
      3: 0,
      4: 1,
      5: 1
    },
    "easy to use": {
      1: 0,
      2: 0,
      3: 2,
      4: 0,
      5: 1
    },
  },
  // boolean - true - false
  "boolValue": { true: 2, false: 1 },
  // radiogroup - 5 + other
  "organization_type": {
    "ISV": 2,
    "Consulting": 3,
    "Custom": 2,
    "In-house": 4,
    "Hobbyist": 0,
    "other": 1
  },
  "organization_type-Comment_wordcloud": {"start": 1},
  // radiogroup - 5
  "developer_count": {
    "1": 2,
    "2": 1,
    "3-5": 6,
    "6-10": 1,
    "> 10": 2
  },
  // radiogroup - 27 + other
  "VerticalMarket": {
    "Automotive": 1,
    "Banking": 2,
    "Education": 5,
    "Energy": 1,
    "Financial": 7,
    "Healthcare": 3,
    "Media": 1,
    "Not-for-profit": 2,
  },
  "VerticalMarket-Comment": [],
  // radiogroup - 7 + other
  "product_discovering": [[0,0,0,0,0,0,6,6]],
  "product_discovering-Comment": [],
  // checkbox - 11 + other
  "javascript_frameworks": {
    "React": 1,
    "Angular": 4,
    "jQuery": 8,
    "Vue": 3,
    "other": 3
  },
  "javascript_frameworks-Comment_wordcloud": {
    "react": 1,
    "native": 1,
    "angularjs": 1
  },
  // checkbox - 7 + other
  "backend_language": {
    "Java": 2,
    "Python": 1,
    "Node.js": 2,
    "Go": 0,
    "Django": 1,
    "Asp.net": 2,
    "Ruby": 2,
    "other": 5
  },
  // checkbox other texts for wordcloud
  "backend_language-Comment_wordcloud": {"php": 5},
  // tagbox - 7 + other
  "backend_language_tag": {
    "Java": 2,
    "Python": 1,
    "Node.js": 2,
    "Go": 0,
    "Django": 1,
    "Asp.net": 2,
    "Ruby": 2,
    "other": 5
  },
  "backend_language_tag-Comment_wordcloud": {"ease":1,"creating":10},
  // radiogroup - 2
  "useproduct": {
    "Yes": 9,
    "No": 3
  },
  // checkbox - 2
  "uselibraries": {
    "Survey Library (Runner)": 10,
    "Survey Creator (Designer)": 2
  },
  // checkbox - 2
  "product_new": {
    "Export to PDF (survey and its result)": 5,
    "Analytics (Create Analytics based on JSON results)": 6
  },
  // checkbox - 3
  "supported_devices": {
    "Desktop": 4,
    "Tablete": 1,
    "Mobile": 2
  },
  // radiogroup - 4
  "native_mobile_support": {
  },
  // radiogroup - 5 + other
  "native_framework": {},
  "native_framework-Comment_text": {},
  // radiogroup - 2 + other
  "product_alternative": {
    "Use popular Survey cloud platforms": 10,
    "Develop ourselves": 2
  },
  "product_alternative-Comment": [],
  // text
  "survey_cloud_platform": [],
  // radiogroup - 2
  "product_recommend": {
    "Yes": 13,
    "No": 1
  },
  // rating - 0-10 (histogram)
  "nps_score_histogram": [0,0,0,1,0,0,2,0,6,1,2],
  // rating - 0-10 (number)
  "nps_score_number": {value: 6.7, minValue: 1, maxValue: 10},
  // comment (wordcloud)
  "favorite_functionality_wordcloud": {"ease": 1, "creating": 1, "survey": 2, "builder": 1, "rendering": 1, "html": 1, "web": 1, "browser": 1, "flexibility": 1, "surveyjs": 1, "dgefd": 1, "audio": 1, "recordingnicely": 1, "handle": 1, "logical": 1, "checks": 1},
  // comment (text)
  "favorite_functionality_text": { columnsCount: 2, data: [["aswdasdasd sadf asfda sd"], ["sdf sdf sdf sfdasdf ga"], ["word", "some text"]] },
  // comment
  "product_improvement": {"native": 3, "support": 7, "mobile": 1, "platform": 1, "großmutter": 9, "product": 1, "super": 1, "functional": 1, "ux": 1, "challenging": 1, "goals": 1, "attract": 1, "audience": 3, "survey": 2, "builder": 5, "site": 1, "revisit": 1, "usability": 1, "ui": 2, "able": 1, "successfully": 1, "don't": 1, "input": 1, "negative": 1, "trial": 1, "error": 1, "learning": 1, "logic": 1, "surveymonkey": 1, "dfgdfg": 1, "fix": 1, "rtl": 1, "bugs\nsave": 1, "\"not": 1, "answered": 1, "questions\"": 1, "matrix": 1, "survey's": 1, "json": 1, "lack": 1, "accessibility": 1, "huge": 1, "disadvantage": 1, "that's": 1, "reason": 1, "projects": 1},
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
