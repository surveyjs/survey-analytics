const json = {
  "pages": [
    {
      "name": "promotion",
      "elements": [
        {
          "type": "rating",
          "name": "nps",
          "title": "How likely are you to recommend our product to a friend or colleague?",
          "isRequired": true,
          "rateMin": 0,
          "rateMax": 10,
          "minRateDescription": "Most unlikely",
          "maxRateDescription": "Most likely"
        },
        {
          "type": "radiogroup",
          "name": "did-recommend",
          "title": "Have you recommended our product to anyone?",
          "choices": [
            { "value": 1, "text": "Yes" },
            { "value": 0, "text": "No" }
          ]
        }
      ]
    },
    {
      "name": "customer-segregation",
      "elements": [
        {
          "type": "radiogroup",
          "name": "product-discovery",
          "title": "How did you first discover our product?",
          "choices": [
            { "value": 1, "text": "Search engine" },
            { "value": 2, "text": "GitHub" },
            { "value": 3, "text": "Friend or colleague" },
            { "value": 4, "text": "Reddit" },
            { "value": 5, "text": "Medium" },
            { "value": 6, "text": "Twitter" },
            { "value": 7, "text": "Facebook" }
          ]
        },
        {
          "type": "radiogroup",
          "name": "uses-product",
          "title": "Do you currently use our libraries?",
          "isRequired": true,
          "choices": [
            { "value": 1, "text": "Yes" },
            { "value": 0, "text": "No" }
          ]
        },
        {
          "type": "checkbox",
          "name": "used-libraries",
          "visibleIf": "{uses-product} = 1",
          "title": "Which libraries do you use?",
          "isRequired": true,
          "choices": [
            { "value": 1, "text": "Form Library" },
            { "value": 2, "text": "Survey Creator" },
            { "value": 3, "text": "Dashboard" },
            { "value": 4, "text": "PDF Generator" }
          ]
        }
      ]
    },
    {
      "name": "frameworks-and-devices",
      "elements": [
        {
          "type": "checkbox",
          "name": "js-frameworks",
          "title": "Which JavaScript frameworks do you use?",
          "choices": [
            { "value": 1, "text": "React" },
            { "value": 2, "text": "Angular" },
            { "value": 3, "text": "jQuery" },
            { "value": 4, "text": "Vue.js" },
            { "value": 5, "text": "Meteor" },
            { "value": 6, "text": "Ember" },
            { "value": 7, "text": "Backbone" },
            { "value": 8, "text": "Knockout" },
            { "value": 9, "text": "Aurelia" },
            { "value": 10, "text": "Polymer" },
            { "value": 11, "text": "Mithril" },
            { "value": 12, "text": "Svelte" },
            { "value": 13, "text": "Remix" },
            { "value": 14, "text": "Next.js" }
          ],
          "choicesOrder": "asc",
          "colCount": 3
        },
        {
          "type": "checkbox",
          "name": "backend-languages",
          "title": "Which backend programming languages do you use?",
          "choices": [
            { "value": 1, "text": "Java" },
            { "value": 2, "text": "Python" },
            { "value": 3, "text": "JavaScript / Node.js" },
            { "value": 4, "text": "Go" },
            { "value": 5, "text": "Django" },
            { "value": 6, "text": "C# / ASP.NET" },
            { "value": 7, "text": "Ruby" },
            { "value": 8, "text": "PHP" }
          ],
          "choicesOrder": "asc",
          "colCount": 3
        },
        {
          "type": "checkbox",
          "name": "devices-to-support",
          "title": "Which device types do you need to support?",
          "isRequired": true,
          "choices": [
            { "value": 1, "text": "Desktop" },
            { "value": 2, "text": "Tablet" },
            { "value": 3, "text": "Mobile" }
          ]
        }
      ]
    }
  ]
};
var survey = new Survey.SurveyModel(json);

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function generateData() {
    const data = [];
    for (let index = 0; index < 100; index++) {
        data.push({
            nps: randomIntFromInterval(0, 10),
            "did-recommend": randomIntFromInterval(0, 1),
            "product-discovery": randomIntFromInterval(1, 7),
            "uses-product": randomIntFromInterval(0, 1),
            "used-libraries": [ randomIntFromInterval(1, 2), randomIntFromInterval(3, 4) ],
            "js-frameworks": randomIntFromInterval(1, 14),
            "backend-languages": randomIntFromInterval(1, 8),
            "devices-to-support": [ 1, randomIntFromInterval(2, 3) ]
        });
    }
    return data;
}
const dataFromServer = generateData();

var dashboard = new SurveyAnalyticsApexcharts.Dashboard({
    questions: survey.getAllQuestions(),
    data: dataFromServer,
  }
);

dashboard.onStateChanged.add((_, state) => {
    window.localStorage.setItem("surveyJsDashboardState", JSON.stringify(state));
});

dashboard.registerToolbarItem("reload", () => {
    return SurveyAnalyticsApexcharts.DocumentHelper.createButton(
        () => { location.reload(); },
        "Reload the page"
    );
});

dashboard.registerToolbarItem("resetState", () => {
    return SurveyAnalyticsApexcharts.DocumentHelper.createButton(
        () => {
            window.localStorage.setItem("surveyJsDashboardState", "");
            location.reload();
        },
        "Reset the state"
    );
});

dashboard.render(document.getElementById("summaryContainer"));
