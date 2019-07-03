var surveyId = "8eab6e45-f15e-4d43-bb47-8613c122e68e";
var accessKey = "dc736a6f384d48f9b71a1dd94d9d5c24";

// var survey = new Survey.SurveyModel({
//   pages: [
//     {
//       name: "page1",
//       elements: [
//         {
//           type: "rating",
//           name: "satisfaction",
//           title: "How satisfied are you with the Product?",
//           minRateDescription: "Not Satisfied",
//           maxRateDescription: "Completely satisfied"
//         },
//         {
//           type: "matrixdynamic",
//           name: "teachersRate",
//           title: "Please rate your teachers",
//           addRowText: "Add Subject",
//           horizontalScroll: true,
//           columnMinWidth: "130px",
//           columnColCount: 1,
//           cellType: "radiogroup",
//           choices: [
//             {
//               value: 1,
//               text: "Yes"
//             },
//             {
//               value: 0,
//               text: "Sometimes"
//             },
//             {
//               value: -1,
//               text: "No"
//             }
//           ],
//           columns: [
//             {
//               name: "subject",
//               cellType: "dropdown",
//               title: "Select a subject",
//               isRequired: true,
//               minWidth: "300px",
//               choices: [
//                 "English: American Literature",
//                 "English: British and World Literature",
//                 "Math: Consumer Math",
//                 "Math: Practical Math",
//                 "Math: Developmental Algebra",
//                 "Math: Continuing Algebra",
//                 "Math: Pre-Algebra",
//                 "Math: Algebra",
//                 "Math: Geometry",
//                 "Math: Integrated Mathematics",
//                 "Science: Physical Science",
//                 "Science: Earth Science",
//                 "Science: Biology",
//                 "Science: Chemistry",
//                 "History: World History",
//                 "History: Modern World Studies",
//                 "History: U.S. History",
//                 "History: Modern U.S. History",
//                 "Social Sciences: U.S. Government and Politics",
//                 "Social Sciences: U.S. and Global Economics",
//                 "World Languages: Spanish",
//                 "World Languages: French",
//                 "World Languages: German",
//                 "World Languages: Latin",
//                 "World Languages: Chinese",
//                 "World Languages: Japanese"
//               ]
//             },
//             {
//               name: "explains",
//               title: "Clearly explains the objectives"
//             },
//             {
//               name: "interesting",
//               title: "Makes class interesting"
//             },
//             {
//               name: "effective",
//               title: "Uses class time effectively"
//             },
//             {
//               name: "knowledge",
//               title: "Knows the subject matter"
//             },
//             {
//               name: "recognition",
//               title: "Recognizes and acknowledges effort"
//             },
//             {
//               name: "inform",
//               title: "Keeps me informed of my progress"
//             },
//             {
//               name: "opinion",
//               title: "Encourages and accepts different opinions"
//             },
//             {
//               name: "respect",
//               title: "Has the respect of the student"
//             },
//             {
//               name: "cooperation",
//               title: "Encourages cooperation and participation"
//             },
//             {
//               name: "parents",
//               title: "Communicates with my parents"
//             },
//             {
//               name: "selfthinking",
//               title: "Encourages me to think for myself"
//             },
//             {
//               name: "frusturation",
//               cellType: "comment",
//               title: "Is there anything about this class that frustrates you?",
//               minWidth: "250px"
//             },
//             {
//               name: "likeTheBest",
//               cellType: "comment",
//               title: "What do you like best about this class and/or teacher?",
//               minWidth: "250px"
//             },
//             {
//               name: "improvements",
//               cellType: "comment",
//               title:
//                 "What do you wish this teacher would do differently that would improve this class?",
//               minWidth: "250px"
//             }
//           ],
//           rowCount: 2
//         },
//         {
//           type: "paneldynamic",
//           name: "relatives",
//           title: "Please enter all blood relatives you know",
//           renderMode: "progressTop",
//           templateTitle: "Information about: {panel.relativeType}",
//           templateElements: [
//             {
//               name: "relativeType",
//               type: "dropdown",
//               title: "Relative",
//               choices: [
//                 "father",
//                 "mother",
//                 "brother",
//                 "sister",
//                 "son",
//                 "dauhter"
//               ],
//               isRequired: true
//             },
//             {
//               name: "isalive",
//               type: "radiogroup",
//               title: "Alive?",
//               startWithNewLine: false,
//               isRequired: true,
//               colCount: 0,
//               choices: ["Yes", "No"]
//             },
//             {
//               name: "liveage",
//               type: "dropdown",
//               title: "Age",
//               isRequired: true,
//               startWithNewLine: false,
//               visibleIf: "{panel.isalive} = 'Yes'",
//               choicesMin: 1,
//               choicesMax: 115
//             },
//             {
//               name: "deceasedage",
//               type: "dropdown",
//               title: "Deceased Age",
//               isRequired: true,
//               startWithNewLine: false,
//               visibleIf: "{panel.isalive} = 'No'",
//               choices: [
//                 {
//                   value: -1,
//                   text: "Unknown"
//                 }
//               ],
//               choicesMin: 1,
//               choicesMax: 115
//             },
//             {
//               name: "causeofdeathknown",
//               type: "radiogroup",
//               title: "Cause of Death Known?",
//               isRequired: true,
//               colCount: 0,
//               startWithNewLine: false,
//               visibleIf: "{panel.isalive} = 'No'",
//               choices: ["Yes", "No"]
//             },
//             {
//               name: "causeofdeath",
//               type: "text",
//               title: "Cause of Death",
//               isRequired: true,
//               startWithNewLine: false,
//               visibleIf:
//                 "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'"
//             },
//             {
//               type: "panel",
//               name: "moreInfo",
//               state: "expanded",
//               title: "Detail Information about: {panel.relativeType}",
//               elements: [
//                 {
//                   type: "matrixdynamic",
//                   name: "relativeillness",
//                   title: "Describe the illness or condition.",
//                   rowCount: 0,
//                   columns: [
//                     {
//                       name: "illness",
//                       cellType: "dropdown",
//                       title: "Illness/Condition",
//                       choices: [
//                         "Cancer",
//                         "Heart Disease",
//                         "Diabetes",
//                         "Stroke/TIA",
//                         "High Blood Pressure",
//                         "High Cholesterol or Triglycerides",
//                         "Liver Disease",
//                         "Alcohol or Drug Abuse",
//                         "Anxiety, Depression or Psychiatric Illness",
//                         "Tuberculosis",
//                         "Anesthesia Complications",
//                         "Genetic Disorder",
//                         "Other – describe"
//                       ],
//                       isRequired: true
//                     },
//                     {
//                       name: "description",
//                       cellType: "text",
//                       title: "Describe",
//                       isRequired: true
//                     }
//                   ]
//                 }
//               ]
//             }
//           ],
//           panelCount: 2,
//           panelAddText: "Add a blood relative",
//           panelRemoveText: "Remove the relative"
//         },
//         {
//           type: "matrix",
//           name: "Quality",
//           title:
//             "Please indicate if you agree or disagree with the following statements",
//           columns: [
//             {
//               value: 1,
//               text: "Strongly Disagree"
//             },
//             {
//               value: 2,
//               text: "Disagree"
//             },
//             {
//               value: 3,
//               text: "Neutral"
//             },
//             {
//               value: 4,
//               text: "Agree"
//             },
//             {
//               value: 5,
//               text: "Strongly Agree"
//             }
//           ],
//           rows: [
//             {
//               value: "affordable",
//               text: "Product is affordable"
//             },
//             {
//               value: "does what it claims",
//               text: "Product does what it claims"
//             },
//             {
//               value: "better then others",
//               text: "Product is better than other products on the market"
//             },
//             {
//               value: "easy to use",
//               text: "Product is easy to use"
//             }
//           ]
//         },
//         {
//           type: "rating",
//           name: "recommend friends",
//           visible: false,
//           visibleIf: "{satisfaction} > 3",
//           title:
//             "How likely are you to recommend the Product to a friend or co-worker?",
//           minRateDescription: "Will not recommend",
//           maxRateDescription: "I will recommend"
//         },
//         {
//           type: "comment",
//           name: "suggestions",
//           title: "What would make you more satisfied with the Product?"
//         }
//       ]
//     },
//     {
//       name: "page2",
//       elements: [
//         {
//           type: "radiogroup",
//           name: "price to competitors",
//           title: "Compared to our competitors, do you feel the Product is",
//           choices: [
//             "Less expensive",
//             "Priced about the same",
//             "More expensive",
//             "Not sure"
//           ]
//         },
//         {
//           type: "radiogroup",
//           name: "price",
//           title: "Do you feel our current price is merited by our product?",
//           choices: [
//             {
//               value: "correct",
//               text: "Yes, the price is about right"
//             },
//             {
//               value: "low",
//               text: "No, the price is too low for your product"
//             },
//             {
//               value: "high",
//               text: "No, the price is too high for your product"
//             }
//           ]
//         },
//         {
//           type: "multipletext",
//           name: "pricelimit",
//           title: "What is the... ",
//           items: [
//             {
//               name: "mostamount",
//               title: "Most amount you would every pay for a product like ours"
//             },
//             {
//               name: "leastamount",
//               title: "The least amount you would feel comfortable paying"
//             }
//           ]
//         }
//       ]
//     },
//     {
//       name: "page3",
//       elements: [
//         {
//           type: "text",
//           name: "email",
//           title:
//             "Thank you for taking our survey. Your survey is almost complete, please enter your email address in the box below if you wish to participate in our drawing, then press the 'Submit' button."
//         }
//       ]
//     }
//   ]
// });

var json = {
  pages: [
    {
      name: "page_info",
      elements: [
        {
          type: "radiogroup",
          name: "organization_type",
          title:
            "Which of the following best describes you or your organization?",
          hasOther: true,
          choices: [
            {
              value: "ISV",
              text: "ISV (building commercial/shrink wrapped software)"
            },
            {
              value: "Consulting",
              text:
                "Software consulting firm (provide development services to other organizations)"
            },
            {
              value: "Custom",
              text: "Custom software development (as a freelancer/contractor)"
            },
            { value: "In-house", text: "In-house software development" },
            {
              value: "Hobbyist",
              text: "Hobbyist (develop apps for personal use)"
            }
          ],
          colCount: 2
        },
        {
          type: "radiogroup",
          name: "developer_count",
          visibleIf: "{organization_type} != 'Hobbyist'",
          title: "How many software developers are in your organization?",
          choices: ["1", "2", "3-5", "6-10", "> 10"]
        },
        {
          type: "radiogroup",
          name: "VerticalMarket",
          visibleIf: "{organization_type} != 'Hobbyist'",
          title: "What vertical market does your product serve?",
          hasOther: true,
          choices: [
            "Automotive",
            "Banking",
            "Consumer",
            "Education",
            "Engineering",
            "Energy",
            "Fast-moving consumer goods",
            "Financial",
            "FinTech",
            "Food and beverage",
            "Government (federal, state, local)",
            "Healthcare",
            "Insurance",
            "Legal",
            "Manufacturing",
            "Media",
            "Online",
            "Raw materials",
            "Real estate",
            "Religion",
            "Retail",
            "Jewelry",
            "Technology",
            "Telecommunications",
            "Transportation (Travel)",
            "Electronics",
            "Not-for-profit"
          ],
          colCount: 4
        },
        {
          type: "radiogroup",
          name: "product_discovering",
          title: "How did you first discover the product? ",
          hasOther: true,
          choices: [
            "Search engine",
            "GitHub",
            "Friend or colleague",
            "Redit",
            "Medium",
            "Twitter",
            "Facebook"
          ],
          otherText: "Other",
          colCount: 3
        }
      ]
    },
    {
      name: "page_libraries_usage",
      elements: [
        {
          type: "checkbox",
          name: "javascript_frameworks",
          title: "What JavaScript framework do you use?",
          hasOther: true,
          choices: [
            "React",
            "Angular",
            "jQuery",
            "Vue",
            "Meteor",
            "Ember",
            "Backbone",
            "Knockout",
            "Aurelia",
            "Polymer",
            "Mithril"
          ],
          choicesOrder: "asc",
          otherText: "Other (Please name it)",
          colCount: 3
        },
        {
          type: "checkbox",
          name: "backend_language",
          title: "What Web Backend programming language do you use?",
          hasOther: true,
          choices: [
            "Java",
            "Python",
            "Node.js",
            "Go",
            "Django",
            "Asp.net",
            "Ruby"
          ],
          choicesOrder: "asc",
          otherText: "Other (Please name it)",
          colCount: 3
        }
      ]
    },
    {
      name: "page_product_usage",
      elements: [
        {
          type: "radiogroup",
          name: "useproduct",
          title: "Do you currently use our libraries? ",
          isRequired: true,
          choices: ["Yes", "No"]
        },
        {
          type: "checkbox",
          name: "uselibraries",
          visibleIf: '{useproduct} = "Yes"',
          title: "What libraries do you use?",
          isRequired: true,
          choices: ["Survey Library (Runner)", "Survey Creator (Designer)"]
        },
        {
          type: "checkbox",
          name: "product_new",
          title:
            "We are going to release new libraries shortly. Please check a product(s), if you are interesting to use them",
          choices: [
            "Export to PDF (survey and its result)",
            "Analytics (Create Analytics based on JSON results)"
          ]
        },
        {
          type: "checkbox",
          name: "supported_devices",
          title: "What device types do you need to support?",
          isRequired: true,
          choices: ["Desktop", { value: "Tablete", text: "Tablet" }, "Mobile"]
        },
        {
          type: "radiogroup",
          name: "native_mobile_support",
          visibleIf: '{supported_devices} contains "Mobile"',
          title: "How is important for you a native mobile support?",
          isRequired: true,
          choices: [
            { value: "1", text: "I am happy with adaptive html rendering" },
            {
              value: "2",
              text: "Something important, but adaptive html rendering is fine"
            },
            { value: "3", text: "Very important" },
            { value: "4", text: "Can not use the library without it" }
          ]
        },
        {
          type: "radiogroup",
          name: "native_framework",
          visibleIf: "{native_mobile_support} >= 3",
          title:
            "Please name the framework that you are using or going to use in your native mobile developlment",
          hasOther: true,
          choices: [
            "react native",
            "nativescript",
            "ionic",
            "xamarin",
            "native iOS and Android apps"
          ],
          otherText: "Other (Please name it)",
          colCount: 2
        }
      ]
    },
    {
      name: "page_alternative",
      elements: [
        {
          type: "radiogroup",
          name: "product_alternative",
          title:
            "What would you use as an alternative if SurveyJS does not exist?",
          isRequired: true,
          hasOther: true,
          choices: ["Use popular Survey cloud platforms", "Develop ourselves"],
          otherText: "Other (please name)"
        },
        {
          type: "text",
          name: "survey_cloud_platform",
          visibleIf:
            '{product_alternative} = "Use popular Survey cloud platforms"',
          title: "What Survey cloud platform would be your choice?"
        },
        {
          type: "radiogroup",
          name: "product_recommend",
          title: "Have you recommended the product to anyone?",
          choices: ["Yes", "No"]
        }
      ]
    },
    {
      name: "page_recommend",
      elements: [
        {
          type: "rating",
          name: "nps_score",
          title:
            "How likely are you to recommend SurveyJS to a friend or colleague?",
          isRequired: true,
          rateMin: 0,
          rateMax: 10,
          minRateDescription: "Most unlikely",
          maxRateDescription: "Most likely"
        },
        {
          type: "comment",
          name: "favorite_functionality",
          title: "What's your favorite functionality / add-on?"
        },
        {
          type: "comment",
          name: "product_improvement",
          title: "How could our products be improved to better meet your needs?"
        }
      ]
    }
  ],
  surveyPostId: "c989aefb-9d47-4477-b9af-54a770dc4803",
  cookieName: "87b306f1-e41c-47c3-99de-1d2cd46c8253"
};

var survey = new Survey.SurveyModel(json);

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

  // var data = result.Data;

  // result.Data.push({
  //   relatives: [
  //     {
  //       relativeType: "father",
  //       isalive: "Yes",
  //       liveage: 17,
  //       relativeillness: [{ illness: "High Blood Pressure", description: "22" }]
  //     },
  //     {
  //       relativeType: "mother",
  //       relativeillness: [
  //         { illness: "Anesthesia Complications", description: "44" }
  //       ],
  //       isalive: "Yes",
  //       liveage: 5
  //     },
  //     {
  //       relativeType: "mother",
  //       isalive: "No",
  //       relativeillness: [{ illness: "Cancer", description: "213" }],
  //       deceasedage: 16,
  //       causeofdeathknown: "Yes",
  //       causeofdeath: "Cancer"
  //     }
  //   ]
  // });

  // result.Data.push({
  //   teachersRate: [
  //     {
  //       subject: "Math: Continuing Algebra",
  //       explains: 0,
  //       interesting: -1,
  //       effective: 1,
  //       knowledge: -1,
  //       recognition: 0,
  //       parents: -1,
  //       selfthinking: -1,
  //       frusturation: "love",
  //       likeTheBest: "wombat",
  //       improvements: "peace"
  //     },
  //     {
  //       subject: "Math: Continuing Algebra",
  //       explains: 0,
  //       interesting: -1,
  //       effective: 1,
  //       knowledge: -1,
  //       recognition: 0,
  //       parents: -1,
  //       selfthinking: -1,
  //       frusturation: "love",
  //       likeTheBest: "wombat",
  //       improvements: "peace"
  //     },
  //     {
  //       subject: "Math: Continuing Algebra",
  //       explains: 0,
  //       interesting: -1,
  //       effective: 1,
  //       knowledge: -1,
  //       recognition: 0,
  //       parents: -1,
  //       selfthinking: -1,
  //       frusturation: "love",
  //       likeTheBest: "wombat",
  //       improvements: "peace"
  //     },
  //     {
  //       subject: "Math: Continuing Algebra",
  //       explains: 0,
  //       interesting: -1,
  //       effective: 1,
  //       knowledge: -1,
  //       recognition: 0,
  //       parents: -1,
  //       selfthinking: -1,
  //       frusturation: "love",
  //       likeTheBest: "wombat",
  //       improvements: "peace"
  //     },
  //     {
  //       subject: "Math: Continuing Algebra",
  //       explains: 0,
  //       interesting: -1,
  //       effective: 1,
  //       knowledge: -1,
  //       recognition: 0,
  //       parents: -1,
  //       selfthinking: -1,
  //       frusturation: "love",
  //       likeTheBest: "wombat",
  //       improvements: "peace"
  //     },
  //     {
  //       subject: "Math: Continuing Algebra",
  //       explains: 0,
  //       interesting: -1,
  //       effective: 1,
  //       knowledge: -1,
  //       recognition: 0,
  //       parents: -1,
  //       selfthinking: -1,
  //       frusturation: "love",
  //       likeTheBest: "wombat",
  //       improvements: "peace"
  //     },
  //     {
  //       subject: "Math: Continuing Algebra",
  //       explains: 0,
  //       interesting: -1,
  //       effective: 1,
  //       knowledge: -1,
  //       recognition: 0,
  //       parents: -1,
  //       selfthinking: -1,
  //       frusturation: "love",
  //       likeTheBest: "wombat",
  //       improvements: "peace"
  //     },
  //     {
  //       subject: "History: Modern U.S. History",
  //       explains: 0,
  //       interesting: 0,
  //       effective: 0,
  //       knowledge: -1,
  //       recognition: 0,
  //       inform: 0,
  //       opinion: 1,
  //       respect: -1,
  //       cooperation: 1,
  //       parents: 0,
  //       selfthinking: -1,
  //       frusturation: "war",
  //       likeTheBest: "peace",
  //       improvements: "love"
  //     },
  //     {
  //       subject: "History: Modern U.S. History",
  //       explains: 0,
  //       interesting: 0,
  //       effective: 0,
  //       knowledge: -1,
  //       recognition: 0,
  //       inform: 0,
  //       opinion: 1,
  //       respect: -1,
  //       cooperation: 1,
  //       parents: 0,
  //       selfthinking: -1,
  //       frusturation: "war",
  //       likeTheBest: "peace",
  //       improvements: "love"
  //     },
  //     {
  //       subject: "World Languages: Chinese",
  //       explains: 1,
  //       interesting: 0,
  //       effective: -1,
  //       knowledge: 0,
  //       recognition: 1,
  //       inform: 1,
  //       opinion: 0,
  //       respect: 1,
  //       cooperation: -1,
  //       parents: 0,
  //       selfthinking: 1,
  //       frusturation: "two",
  //       likeTheBest: "war",
  //       improvements: "one"
  //     }
  //   ]
  // });

  var data = [
    {
      organization_type: "In-house",
      developer_count: "6-10",
      VerticalMarket: "Consumer",
      product_discovering: "GitHub",
      javascript_frameworks: ["Angular", "jQuery", "React", "other"],
      backend_language: ["Asp.net", "other"],
      useproduct: "Yes",
      uselibraries: ["Survey Library (Runner)", "Survey Creator (Designer)"],
      product_new: [
        "Export to PDF (survey and its result)",
        "Analytics (Create Analytics based on JSON results)"
      ],
      supported_devices: ["Mobile"],
      native_mobile_support: "3",
      native_framework: "react native",
      product_alternative: "Develop ourselves",
      product_recommend: "Yes",
      nps_score: 9,
      favorite_functionality:
        "The ease of creating survey in the survey builder and rendering the html in the web browser",
      product_improvement:
        "Native support for the the mobile platform will be great.",
      "javascript_frameworks-Comment": "React Native",
      "backend_language-Comment": "PHP",
      HappendAt: "2019-06-27T14:08:48.0500949",
      survey_cloud_platform: ""
    },
    {
      organization_type: "other",
      developer_count: "3-5",
      VerticalMarket: "Online",
      product_discovering: "GitHub",
      javascript_frameworks: ["Vue"],
      backend_language: ["Ruby", "Node.js"],
      useproduct: "No",
      product_new: [
        "Analytics (Create Analytics based on JSON results)",
        "Export to PDF (survey and its result)"
      ],
      supported_devices: ["Desktop", "Tablete", "Mobile"],
      native_mobile_support: "2",
      product_alternative: "Develop ourselves",
      product_recommend: "Yes",
      nps_score: 8,
      favorite_functionality: "I like the flexibility of surveyJS",
      product_improvement:
        "The product is super functional, but the UX is challenging. If one of your goals is to attract an audience to use your Survey Builder on your site, then I would revisit the usability of your UI. I was able to use it successfully, so don't take this input as negative. There was some trial and error for me in learning your UI and the survey logic the way it is presented today. I think you could make it way better and take on SurveyMonkey.",
      "organization_type-Comment": "Start up",
      HappendAt: "2019-07-02T19:17:31.0318927",
      uselibraries: "",
      native_framework: "",
      survey_cloud_platform: ""
    },
    {
      organization_type: "Custom",
      developer_count: "3-5",
      VerticalMarket: "Education",
      product_discovering: "Search engine",
      javascript_frameworks: ["jQuery", "Vue"],
      backend_language: ["other"],
      useproduct: "Yes",
      uselibraries: ["Survey Library (Runner)"],
      product_new: ["Analytics (Create Analytics based on JSON results)"],
      supported_devices: ["Desktop", "Mobile"],
      native_mobile_support: "2",
      product_alternative: "Develop ourselves",
      product_recommend: "Yes",
      nps_score: 6,
      "backend_language-Comment": "php",
      HappendAt: "2019-07-02T02:56:21.2724686",
      native_framework: "",
      survey_cloud_platform: "",
      favorite_functionality: "",
      product_improvement: ""
    },
    {
      organization_type: "ISV",
      developer_count: "3-5",
      VerticalMarket: "Food and beverage",
      product_discovering: "GitHub",
      javascript_frameworks: ["jQuery"],
      backend_language: ["Django"],
      useproduct: "No",
      supported_devices: ["Tablete"],
      product_alternative: "Develop ourselves",
      product_recommend: "Yes",
      nps_score: 10,
      favorite_functionality: "dgefd",
      product_improvement: "dfgdfg",
      HappendAt: "2019-06-26T11:21:53.8059531",
      uselibraries: "",
      product_new: "",
      native_mobile_support: "",
      native_framework: "",
      survey_cloud_platform: ""
    },
    {
      organization_type: "ISV",
      developer_count: "1",
      VerticalMarket: "Automotive",
      product_discovering: "Search engine",
      useproduct: "Yes",
      uselibraries: ["Survey Library (Runner)"],
      product_new: ["Analytics (Create Analytics based on JSON results)"],
      supported_devices: ["Desktop", "Tablete"],
      product_alternative: "Develop ourselves",
      product_recommend: "No",
      nps_score: 3,
      HappendAt: "2019-06-28T12:12:53.1392624",
      javascript_frameworks: "",
      backend_language: "",
      native_mobile_support: "",
      native_framework: "",
      survey_cloud_platform: "",
      favorite_functionality: "",
      product_improvement: ""
    },
    {
      organization_type: "Consulting",
      developer_count: "> 10",
      VerticalMarket: "Telecommunications",
      product_discovering: "GitHub",
      javascript_frameworks: ["Angular"],
      backend_language: ["Java", "other"],
      useproduct: "Yes",
      uselibraries: ["Survey Library (Runner)"],
      product_new: ["Analytics (Create Analytics based on JSON results)"],
      supported_devices: ["Desktop"],
      product_alternative: "Develop ourselves",
      product_recommend: "Yes",
      nps_score: 8,
      "backend_language-Comment": "PHP",
      HappendAt: "2019-07-01T06:05:57.1320385",
      native_mobile_support: "",
      native_framework: "",
      survey_cloud_platform: "",
      favorite_functionality: "",
      product_improvement: ""
    },
    {
      organization_type: "In-house",
      developer_count: "2",
      VerticalMarket: "Healthcare",
      product_discovering: "Search engine",
      javascript_frameworks: ["jQuery"],
      backend_language: ["other"],
      useproduct: "Yes",
      uselibraries: ["Survey Library (Runner)", "Survey Creator (Designer)"],
      product_new: [
        "Export to PDF (survey and its result)",
        "Analytics (Create Analytics based on JSON results)"
      ],
      supported_devices: ["Desktop", "Tablete", "Mobile"],
      native_mobile_support: "2",
      product_alternative: "Develop ourselves",
      product_recommend: "Yes",
      nps_score: 8,
      product_improvement:
        'Fix RTL bugs.\nSave "not answered questions" in a matrix survey\'s json.',
      "backend_language-Comment": "PHP",
      HappendAt: "2019-06-28T05:25:45.8020618",
      native_framework: "",
      survey_cloud_platform: "",
      favorite_functionality: ""
    },
    {
      organization_type: "Consulting",
      developer_count: "> 10",
      VerticalMarket: "Banking",
      product_discovering: "Search engine",
      javascript_frameworks: ["Angular"],
      backend_language: ["Java"],
      useproduct: "Yes",
      uselibraries: ["Survey Library (Runner)"],
      product_new: ["Export to PDF (survey and its result)"],
      supported_devices: ["Mobile", "Tablete", "Desktop"],
      native_mobile_support: "1",
      product_alternative: "Develop ourselves",
      product_recommend: "No",
      nps_score: 8,
      HappendAt: "2019-06-26T12:14:18.5777108",
      native_framework: "",
      survey_cloud_platform: "",
      favorite_functionality: "",
      product_improvement: ""
    },
    {
      organization_type: "Custom",
      developer_count: "3-5",
      VerticalMarket: "Financial",
      product_discovering: "Search engine",
      javascript_frameworks: ["jQuery"],
      backend_language: ["other"],
      useproduct: "No",
      product_new: [
        "Export to PDF (survey and its result)",
        "Analytics (Create Analytics based on JSON results)"
      ],
      supported_devices: ["Desktop", "Tablete", "Mobile"],
      native_mobile_support: "2",
      product_alternative: "Develop ourselves",
      product_recommend: "Yes",
      nps_score: 10,
      "backend_language-Comment": "PHP",
      HappendAt: "2019-07-01T17:17:09.4407724",
      uselibraries: "",
      native_framework: "",
      survey_cloud_platform: "",
      favorite_functionality: "",
      product_improvement: ""
    },
    {
      organization_type: "In-house",
      developer_count: "1",
      VerticalMarket: "Education",
      product_discovering: "GitHub",
      javascript_frameworks: ["jQuery"],
      backend_language: ["Ruby"],
      useproduct: "Yes",
      uselibraries: ["Survey Library (Runner)"],
      product_new: ["Export to PDF (survey and its result)"],
      supported_devices: ["Desktop", "Tablete", "Mobile"],
      native_mobile_support: "2",
      product_alternative: "Develop ourselves",
      product_recommend: "Yes",
      nps_score: 6,
      product_improvement:
        "The lack of accessibility is a huge disadvantage. That's one reason why I cannot use it in all my projects.",
      HappendAt: "2019-07-03T09:14:39.8798894",
      native_framework: "",
      survey_cloud_platform: "",
      favorite_functionality: ""
    },
    {
      organization_type: "Consulting",
      developer_count: "3-5",
      VerticalMarket: "Government (federal, state, local)",
      product_discovering: "Search engine",
      javascript_frameworks: ["Vue", "jQuery", "other"],
      backend_language: ["Python", "Node.js"],
      useproduct: "Yes",
      uselibraries: ["Survey Library (Runner)"],
      product_new: [
        "Analytics (Create Analytics based on JSON results)",
        "Export to PDF (survey and its result)"
      ],
      supported_devices: ["Desktop"],
      product_alternative: "Develop ourselves",
      product_recommend: "Yes",
      nps_score: 8,
      "javascript_frameworks-Comment": "AngularJS",
      HappendAt: "2019-07-01T19:00:39.5885133",
      native_mobile_support: "",
      native_framework: "",
      survey_cloud_platform: "",
      favorite_functionality: "",
      product_improvement: ""
    },
    {
      organization_type: "In-house",
      developer_count: "3-5",
      VerticalMarket: "Retail",
      product_discovering: "GitHub",
      javascript_frameworks: ["jQuery", "Angular"],
      backend_language: ["Asp.net"],
      useproduct: "Yes",
      uselibraries: ["Survey Library (Runner)", "Survey Creator (Designer)"],
      product_new: [
        "Export to PDF (survey and its result)",
        "Analytics (Create Analytics based on JSON results)"
      ],
      supported_devices: ["Mobile"],
      native_mobile_support: "3",
      native_framework: "react native",
      product_alternative: "Develop ourselves",
      product_recommend: "Yes",
      nps_score: 8,
      favorite_functionality: "Audio Recording,nicely handle logical checks",
      HappendAt: "2019-06-27T13:28:37.9863595",
      survey_cloud_platform: "",
      product_improvement: ""
    }
  ];

  var normalizedData = data.map(function(item) {
    survey.getAllQuestions().forEach(function(q) {
      if (!item[q.name]) {
        item[q.name] = "";
      }
    });
    return item;
  });

  var visPanel = new SurveyAnalytics.VisualizationPanel(
    document.getElementById("summaryContainer"),
    survey.getAllQuestions(),
    normalizedData
  );
  visPanel.render();
};
xhr.send();
