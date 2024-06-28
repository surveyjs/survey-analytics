var json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "matrix",
          name: "Quality",
          title: "[matrix] Please indicate if you agree or disagree with the following statements",
          columns: [
            {
              value: 1,
              text: "Strongly Disagree",
            },
            {
              value: 2,
              text: "Disagree",
            },
            {
              value: 3,
              text: "Neutral",
            },
            {
              value: 4,
              text: "Agree",
            },
            {
              value: 5,
              text: "Strongly Agree",
            },
          ],
          rows: [
            {
              value: "affordable",
              text: "Product is affordable",
            },
            {
              value: "does what it claims",
              text: "Product does what it claims",
            },
            {
              value: "better then others",
              text: "Product is better than other products on the market",
            },
            {
              value: "easy to use",
              text: "Product is easy to use",
            },
          ],
        },
        {
          type: "boolean",
          name: "bool",
          valueName: "boolValue",
          title: "[boolean] Please answer the question",
          label: "Are you 21 or older?",
          correctAnswer: true,
          //"valueTrue": "true",
          //"valueFalse": "false",
          labelTrue: "Label True",
          labelFalse: "Label False",
        },
        {
          type: "radiogroup",
          name: "organization_type",
          title: "[radiogroup] Which of the following best describes you or your organization?",
          hasOther: true,
          choices: [
            {
              value: "ISV",
              text: "ISV (building commercial/shrink wrapped software)",
            },
            {
              value: "Consulting",
              text:
                "Software consulting firm (provide development services to other organizations)",
            },
            {
              value: "Custom",
              text: "Custom software development (as a freelancer/contractor)",
            },
            { value: "In-house", text: "In-house software development" },
            {
              value: "Hobbyist",
              text: "Hobbyist (develop apps for personal use)",
            },
          ],
          colCount: 2,
          correctAnswer: "Hobbyist",
        },
        {
          type: "checkbox",
          name: "backend_language",
          title: "[checkbox] What Web Backend programming language do you use?",
          hasOther: true,
          choices: [
            "Java",
            "Python",
            "Node.js",
            "Go",
            "Django",
            "Asp.net",
            "Ruby",
          ],
          choicesOrder: "asc",
          otherText: "Other (Please name it)",
          colCount: 3,
        },
        {
          type: "tagbox",
          name: "backend_language_tag",
          title: "[tagbox] What Web Backend programming language do you use?",
          hasOther: true,
          choices: [
            "Java",
            "Python",
            "Node.js",
            "Go",
            "Django",
            "Asp.net",
            "Ruby",
          ],
          choicesOrder: "asc",
          otherText: "Other (Please name it)",
          colCount: 3,
        },
        {
          type: "text",
          name: "survey_cloud_platform",
          title: "[text] What Survey cloud platform would be your choice?",
        },
        {
          type: "rating",
          name: "nps_score",
          title: "[rating] How likely are you to recommend SurveyJS to a friend or colleague?",
          isRequired: true,
          rateMin: 0,
          rateMax: 10,
          minRateDescription: "Most unlikely",
          maxRateDescription: "Most likely",
        },
        {
          type: "comment",
          name: "favorite_functionality",
          title: "[comment] What's your favorite functionality / add-on?",
        },
        {
          type: "ranking",
          name: "smartphone-features",
          title: "[ranking] Please rank the following smartphone features in order of importance:",
          isRequired: true,
          choices: [
            "Battery life",
            "Screen size",
            "Storage space",
            "Camera quality",
            "Durability",
            "Processor power",
            "Price",
          ],
        }
      ],
    },
  ],
};

var survey = new Survey.SurveyModel(json);

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
  "organization_type-Comment_wordcloud": { "start": 1 },
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
  "backend_language-Comment_wordcloud": { "php": 5 },
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
  "backend_language_tag-Comment_wordcloud": { "ease": 1, "creating": 10 },
  "backend_language_tag-Comment_text": { columnsCount: 2, data: [["aswdasdasd sadf asfda sd"], ["sdf sdf sdf sfdasdf ga"], ["word", "some text"]] },
  // text (text)
  "survey_cloud_platform_text": { columnsCount: 1, data: [["aswdasdasd sadf asfda sd"], ["sdf sdf sdf sfdasdf ga"], ["some text"]] },
  // text (wordcloud)
  "survey_cloud_platform_wordcloud": { "ease": 9, "creating": 1, "survey": 2, "builder": 3, "rendering": 3, "html": 4, "web": 8, "browser": 1, },
  // rating - 0-10 (histogram)
  "nps_score_histogram": [0,0,0,1,0,0,2,0,6,1,2],
  // rating - 0-10 (number)
  "nps_score_number": { value: 6.7, minValue: 1, maxValue: 10 },
  // comment (wordcloud)
  "favorite_functionality_wordcloud": { "ease": 1, "creating": 1, "survey": 2, "builder": 1, "rendering": 1, "html": 1, "web": 1, "browser": 1, "flexibility": 1, "surveyjs": 1, "dgefd": 1, "audio": 1, "recordingnicely": 1, "handle": 1, "logical": 1, "checks": 1 },
  // comment (text)
  "favorite_functionality_text": { columnsCount: 2, data: [["aswdasdasd sadf asfda sd"], ["sdf sdf sdf sfdasdf ga"], ["word", "some text"]] },
  // ranking
  "smartphone-features": {
    "Battery life": 12,
    "Screen size": 15,
    "Storage space": 8,
    "Camera quality": 5,
    "Durability": 0,
    "Processor power": 6,
    "Price": 15,
  }
}

// function getSummaryData({ visualizer, filter, callback }) {
//   console.log(JSON.stringify(filter));
//   setTimeout(() => {
//     callback({ data: summaryData[questionName + "_" + visualizer.type] });
//   }, 1000);
// }

// function getSummaryData({ visualizer, filter }) {
//   const url = "http://www.example.com/";
//   const reqBody = { visualizer.name, filter, type: visualizer.type };
//   return fetch(url, { body: reqBody });
// }

function getSummaryData({ visualizer, filter }) {
  console.log("Question: " + JSON.stringify(visualizer.name));
  console.log("Filter: " + JSON.stringify(filter));
  return new Promise((resolve, reject) => {
    let dataSetName = visualizer.name;
    if(["histogram", "number", "wordcloud", "text"].indexOf(visualizer.type) != -1) {
      dataSetName += "_" + visualizer.type;
    }
    const data = summaryData[dataSetName] || summaryData[visualizer.name];
    if(data !== undefined) {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    } else {
      reject("Haven't found data for " + visualizer.name);
    }
  });
}

var visPanel = new SurveyAnalytics.VisualizationPanel(
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey.getAllQuestions(),
  getSummaryData,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
