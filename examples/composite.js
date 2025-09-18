Survey.ComponentCollection.Instance.add({
  name: "customtext",
  inheritBaseProps: ["placeholder"],
  questionJSON: {
    type: "text",
    placeholder: "placeholder"
  },
});
Survey.ComponentCollection.Instance.add({
  name: "test_composite",
  elementsJSON: [
    { type: "text", name: "q1", title: "Simple text question" },
    { type: "dropdown", name: "q2", choices: [1, 2, 3], title: "Simple dropdown question" },
    { type: "text", inputType: "number", name: "q3", title: "Simple number question" }
  ],
});

var json = {
  "pages": [
    {
      "name": "page1",
      "elements": [
        { type: "customtext", name: "q1", title: "Simple composite QuestionCustomModel" },
        { type: "test_composite", name: "q2", title: "QuestionCompositeModel shown as a panel" }
      ]
    }
  ]
};

var data = [
  {
    "q1": "entered text",
    "q2": {
      "q1": "testValue",
      "q2": 2,
      "q3": 4,
    }
  },
  {
    "q1": "anoter text",
    "q2": {
      "q1": "something",
      "q2": 2,
      "q3": 5,
    }
  },
  {
    "q1": "answer",
    "q2": {
      "q1": "something",
      "q2": 1,
      "q3": 1,
    }
  }
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
  // allowChangeVisualizerType: false
};

var survey = new Survey.SurveyModel(json);

var visPanel = new SurveyAnalytics.VisualizationPanel(
  survey.getAllQuestions(),
  data,
  options
);
visPanel.showToolbar = true;
visPanel.render(document.getElementById("summaryContainer"));
