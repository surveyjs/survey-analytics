var surveyId = "8eab6e45-f15e-4d43-bb47-8613c122e68e";
var accessKey = "dc736a6f384d48f9b71a1dd94d9d5c24";

var survey = new Survey.SurveyModel({
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "paneldynamic",
          name: "relatives",
          title: "Please enter all blood relatives you know",
          renderMode: "progressTop",
          templateTitle: "Information about: {panel.relativeType}",
          templateElements: [
            {
              name: "relativeType",
              type: "dropdown",
              title: "Relative",
              choices: [
                "father",
                "mother",
                "brother",
                "sister",
                "son",
                "dauhter"
              ],
              isRequired: true
            },
            {
              name: "isalive",
              type: "radiogroup",
              title: "Alive?",
              startWithNewLine: false,
              isRequired: true,
              colCount: 0,
              choices: ["Yes", "No"]
            },
            {
              name: "liveage",
              type: "dropdown",
              title: "Age",
              isRequired: true,
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'Yes'",
              choicesMin: 1,
              choicesMax: 115
            },
            {
              name: "deceasedage",
              type: "dropdown",
              title: "Deceased Age",
              isRequired: true,
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'No'",
              choices: [
                {
                  value: -1,
                  text: "Unknown"
                }
              ],
              choicesMin: 1,
              choicesMax: 115
            },
            {
              name: "causeofdeathknown",
              type: "radiogroup",
              title: "Cause of Death Known?",
              isRequired: true,
              colCount: 0,
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'No'",
              choices: ["Yes", "No"]
            },
            {
              name: "causeofdeath",
              type: "text",
              title: "Cause of Death",
              isRequired: true,
              startWithNewLine: false,
              visibleIf:
                "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'"
            },
            {
              type: "panel",
              name: "moreInfo",
              state: "expanded",
              title: "Detail Information about: {panel.relativeType}",
              elements: [
                {
                  type: "matrixdynamic",
                  name: "relativeillness",
                  title: "Describe the illness or condition.",
                  rowCount: 0,
                  columns: [
                    {
                      name: "illness",
                      cellType: "dropdown",
                      title: "Illness/Condition",
                      choices: [
                        "Cancer",
                        "Heart Disease",
                        "Diabetes",
                        "Stroke/TIA",
                        "High Blood Pressure",
                        "High Cholesterol or Triglycerides",
                        "Liver Disease",
                        "Alcohol or Drug Abuse",
                        "Anxiety, Depression or Psychiatric Illness",
                        "Tuberculosis",
                        "Anesthesia Complications",
                        "Genetic Disorder",
                        "Other – describe"
                      ],
                      isRequired: true
                    },
                    {
                      name: "description",
                      cellType: "text",
                      title: "Describe",
                      isRequired: true
                    }
                  ]
                }
              ]
            }
          ],
          panelCount: 2,
          panelAddText: "Add a blood relative",
          panelRemoveText: "Remove the relative"
        },
        {
          type: "matrix",
          name: "Quality",
          title:
            "Please indicate if you agree or disagree with the following statements",
          columns: [
            {
              value: 1,
              text: "Strongly Disagree"
            },
            {
              value: 2,
              text: "Disagree"
            },
            {
              value: 3,
              text: "Neutral"
            },
            {
              value: 4,
              text: "Agree"
            },
            {
              value: 5,
              text: "Strongly Agree"
            }
          ],
          rows: [
            {
              value: "affordable",
              text: "Product is affordable"
            },
            {
              value: "does what it claims",
              text: "Product does what it claims"
            },
            {
              value: "better then others",
              text: "Product is better than other products on the market"
            },
            {
              value: "easy to use",
              text: "Product is easy to use"
            }
          ]
        },
        {
          type: "rating",
          name: "satisfaction",
          title: "How satisfied are you with the Product?",
          minRateDescription: "Not Satisfied",
          maxRateDescription: "Completely satisfied"
        },
        {
          type: "rating",
          name: "recommend friends",
          visible: false,
          visibleIf: "{satisfaction} > 3",
          title:
            "How likely are you to recommend the Product to a friend or co-worker?",
          minRateDescription: "Will not recommend",
          maxRateDescription: "I will recommend"
        },
        {
          type: "comment",
          name: "suggestions",
          title: "What would make you more satisfied with the Product?"
        }
      ]
    },
    {
      name: "page2",
      elements: [
        {
          type: "radiogroup",
          name: "price to competitors",
          title: "Compared to our competitors, do you feel the Product is",
          choices: [
            "Less expensive",
            "Priced about the same",
            "More expensive",
            "Not sure"
          ]
        },
        {
          type: "radiogroup",
          name: "price",
          title: "Do you feel our current price is merited by our product?",
          choices: [
            {
              value: "correct",
              text: "Yes, the price is about right"
            },
            {
              value: "low",
              text: "No, the price is too low for your product"
            },
            {
              value: "high",
              text: "No, the price is too high for your product"
            }
          ]
        },
        {
          type: "multipletext",
          name: "pricelimit",
          title: "What is the... ",
          items: [
            {
              name: "mostamount",
              title: "Most amount you would every pay for a product like ours"
            },
            {
              name: "leastamount",
              title: "The least amount you would feel comfortable paying"
            }
          ]
        }
      ]
    },
    {
      name: "page3",
      elements: [
        {
          type: "text",
          name: "email",
          title:
            "Thank you for taking our survey. Your survey is almost complete, please enter your email address in the box below if you wish to participate in our drawing, then press the 'Submit' button."
        }
      ]
    }
  ]
});
var questionName = "satisfaction";

var xhr = new XMLHttpRequest();
xhr.open(
  "GET",
  "http://surveyjs.io/api/MySurveys/getSurveyResults/" +
    surveyId +
    "?accessKey=" +
    accessKey
);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.onload = function() {
  var result = xhr.response ? JSON.parse(xhr.response) : [];

  var data = result.Data;

  data = [
    {
      relatives: [
        {
          relativeType: "father",
          isalive: "Yes",
          liveage: 17,
          relativeillness: [
            { illness: "High Blood Pressure", description: "22" }
          ]
        },
        {
          relativeType: "mother",
          relativeillness: [
            { illness: "Anesthesia Complications", description: "44" }
          ],
          isalive: "Yes",
          liveage: 5
        },
        {
          relativeType: "mother",
          isalive: "No",
          relativeillness: [{ illness: "Cancer", description: "213" }],
          deceasedage: 16,
          causeofdeathknown: "No"
        }
      ]
    }
  ];

  var visPanel = new SurveyAnalytics.VisualizationPanel(
    document.getElementById("summaryContainer"),
    survey,
    survey.getAllQuestions(),
    data
  );
  visPanel.render();

  // var normalizedData = data.map(function(item) {
  //   survey.getAllQuestions().forEach(function(q) {
  //     if (!item[q.name]) {
  //       item[q.name] = "";
  //     }
  //   });
  //   return item;
  // });

  // var model = {
  //   questions: survey.getAllQuestions(),
  //   survey: survey,
  //   data: normalizedData
  // };

  // ko.applyBindings(model);
};
xhr.send();

// ko.components.register("question-visualizer", {
//   viewModel: {
//     createViewModel: function(params, componentInfo) {
//       var itemElelemt = componentInfo.element.children[0];
//       var visualizers = SurveyAnalytics.VisualizationManager.getVisualizers(
//         params.question.getType()
//       );
//       var visualizer = new visualizers[0](
//         itemElelemt,
//         params.survey,
//         params.question.name,
//         params.data
//       );
//       visualizer.render();
//       return {};
//     }
//   },
//   template: "<div style='height: 120px; width: 50%;'></div>"
// });
