var surveyId = "8eab6e45-f15e-4d43-bb47-8613c122e68e";
var accessKey = "dc736a6f384d48f9b71a1dd94d9d5c24";

var survey = new Survey.SurveyModel({
  pages: [
    {
      name: "page1",
      elements: [
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

  var options = {
    buttons: ["copy", "csv", "print"]
  };

  var surveyAnalyticsDataTables = new SurveyAnalytics.DataTables(
    document.getElementById("dataTablesContainer"),
    survey,
    result.Data,
    options
  );

  surveyAnalyticsDataTables.render();
};
xhr.send();
