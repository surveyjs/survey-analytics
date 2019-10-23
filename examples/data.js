var json = {
    pages: [
      {
        name: "page_info",
        elements: [
          {
            "type": "boolean",
            "name": "bool",
            "title": "Please answer the question",
            "label": "Are you 21 or older?",
            //"valueTrue": "true",
            //"valueFalse": "false",
            "labelTrue": "Label True",
            "labelFalse": "Label False"
          },
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
  
var data = [
{
    bool: true,
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
    bool: true,
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
    bool: false,
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
      