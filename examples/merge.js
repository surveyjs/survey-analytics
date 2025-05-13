Survey.Serializer.addProperty("question", "category");

var json1 = {
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
          "category": "Category 1"
        }
      ]
    }
  ],
};
var survey1 = new Survey.SurveyModel(json1);
var data1 = [
  { question1: "male", question2: "Item 1" },
  { question1: "female", question2: "Item 2" },
];

var json2 = {
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
          "type": "checkbox",
          "name": "question3",
          "choices": [
            "Item 1",
            "Item 2",
            "Item 3"
          ],
          "category": "Category 2"
        }
      ]
    }
  ],
};
var survey2 = new Survey.SurveyModel(json2);
var data2 = [
  { question1: "male", question3: ["Item 1", "Item 2"] },
  { question1: "female", question3: ["Item 2", "Item 3"] },
];

var survey2QuestionNames = survey2.getAllQuestions().map(q => q.name);
survey1.getAllQuestions().forEach(function (q) {
  if(survey2QuestionNames.indexOf(q.name) !== -1) return;
  survey2.pages[0].addQuestion(q);
});

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
  // [ survey.getQuestionByName("organization_type"), survey.getQuestionByName("backend_language") ],
  survey2.getAllQuestions().filter(q => q.category !== "Category 1"),
  data2.concat(data1),
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
