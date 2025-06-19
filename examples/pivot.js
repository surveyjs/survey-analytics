var json = {
  "elements": [
    {
      "type": "radiogroup",
      "name": "question1",
      "title": "Sex",
      "choices": [
        "female",
        "male"
      ]
    },
    {
      "type": "dropdown",
      "name": "question2",
      "title": "Item kind",
      "choices": [
        "Item 1",
        "Item 2",
        "Item 3"
      ],
    },
    {
      "type": "text",
      "inputType": "number",
      "name": "question3",
      "title": "Bill amount",
    }
  ]
};
var data = [
  { question1: "male", question2: "Item 1", question3: 100 },
  { question1: "male", question2: "Item 1", question3: 200 },
  { question1: "male", question2: "Item 2", question3: 300 },
  { question1: "male", question2: "Item 3", question3: 400 },
  { question1: "female", question2: "Item 2", question3: 500 },
  { question1: "female", question2: "Item 2", question3: 600 },
  { question1: "female", question2: "Item 2", question3: 100 },
  { question1: "female", question2: "Item 3", question3: 200 },
  { question1: "female", question2: "Item 3", question3: 300 },
  { question1: "female", question2: "Item 3", question3: 300 },
  { question1: "female", question2: "Item 3", question3: 400 },
  { question1: "female", question2: "Item 3", question3: 150 },
  { question1: "female", question2: "Item 1", question3: 250 },
];

var options = {
  // allowDynamicLayout: false,
  // allowDragDrop: false,
  // allowHideQuestions: false,
  // allowShowPercentages: true,
  // showPercentages: true,
  // showOnlyPercentages: true,
  // useValuesAsLabels: false
  // haveCommercialLicense: false,
  // allowSortAnswers: true,
  // answersOrder: "desc"
  // allowHideEmptyAnswers: true,
  // hideEmptyAnswers: true,
  // allowTopNAnswers: true,
  // showCorrectAnswers: true
  // labelTruncateLength: 27,
};

var survey = new Survey.SurveyModel(json);

var pivotChart = new SurveyAnalytics.PivotPlotly(
  survey.getAllQuestions(),
  data,
  options
);
pivotChart.render(document.getElementById("pivotContainer"));

// var visPanel = new SurveyAnalytics.VisualizationPanel(
//   [ [ survey.getQuestionByName("question2"), survey.getQuestionByName("question1") ], [ survey.getQuestionByName("question1"), survey.getQuestionByName("question2") ] ],
//   data,
//   options
// );
// visPanel.showToolbar = true;
// visPanel.render(document.getElementById("summaryContainer"));

// var pivot_survey = new Survey.SurveyModel(pivot_json);

// var crossQuestion = new SurveyAnalytics.PivotPlotly(
//   pivot_survey.getAllQuestions(),
//   pivot_data,
//   options
// );
// crossQuestion.render(document.getElementById("groupContainer"));
