var json = {
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "radiogroup",
          "name": "question1",
          "choices": [
            "female",
            "male"
          ]
        },
        {
          "type": "radiogroup",
          "name": "question2",
          "choices": [
            "Item 1",
            "Item 2",
            "Item 3"
          ],
        }
      ]
    }
  ],
};
var survey = new Survey.SurveyModel(json);
var data = [
  { question1: "male", question2: "Item 1" },
  { question1: "male", question2: "Item 1" },
  { question1: "male", question2: "Item 2" },
  { question1: "male", question2: "Item 3" },
  { question1: "female", question2: "Item 2" },
  { question1: "female", question2: "Item 2" },
  { question1: "female", question2: "Item 2" },
  { question1: "female", question2: "Item 3" },
  { question1: "female", question2: "Item 3" },
  { question1: "female", question2: "Item 3" },
  { question1: "female", question2: "Item 3" },
  { question1: "female", question2: "Item 1" },
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

var visPanel = new SurveyAnalytics.VisualizationPanel(
  [ [ survey.getQuestionByName("question2"), survey.getQuestionByName("question1") ], [ survey.getQuestionByName("question1"), survey.getQuestionByName("question2") ] ],
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
