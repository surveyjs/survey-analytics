---
title: Export Survey Results to PDF or Excel | Open-Source JS Form Builder for Knockout and jQuery
description: Convert your survey data to manageable table format  for easy filtering and analysis. Save survey results as PDF or Excel files to visualize or share with others. View free demo for Knockout and jQuery with a step-by-step setup guide.
---

# Table View for Survey Results in a Knockout or jQuery Application

This step-by-step tutorial will help you set up a table view for survey results using SurveyJS Dashboard in a Knockout or jQuery application. To add the table view to your application, follow the steps below:

- [Link Resources](#link-resources)
- [Load Survey Results](#load-survey-results)
- [Render the Table](#render-the-table)

As a result, you will create the following view:

<iframe src="/proxy/github/code-examples/dashboard-table-view/knockout/index.html"
    style="width:100%; border:0; border-radius: 4px; overflow:hidden;"
></iframe>

SurveyJS Dashboard is powered by Knockout and does not have an individual implementation for jQuery. However, you can integrate the version for Knockout into your jQuery application by following the same instructions.

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/dashboard-table-view/knockout (linkStyle))

## Link Resources

SurveyJS Dashboard depends on other JavaScript libraries. Reference them on your page in the following order:

1. Knockout

1. Survey Core       
A platform-independent part of the SurveyJS Form Library that works with the survey model. SurveyJS Dashboard requires only this part, but if you also display the survey on the page, reference [the rest of the SurveyJS Form Library resources](/Documentation/Library?id=get-started-knockout#link-surveyjs-resources) as well.

1. *(Optional)* <a href="https://github.com/parallax/jsPDF#readme" target="_blank">jsPDF</a>, <a href="https://github.com/JonatanPe/jsPDF-AutoTable#readme" target="_blank">jsPDF-AutoTable</a>, and <a href="https://sheetjs.com/" target="_blank">SheetJS</a>       
Third-party libraries that enable users to export survey results to a PDF or XLSX document. Export to CSV is supported out of the box.

1. <a href="https://tabulator.info/" target="_blank">Tabulator</a>      
A third-party library that renders interactive tables.

1. SurveyJS Dashboard plugin for Tabulator      
A library that integrates Survey Core with Tabulator.

The following code shows how to reference these libraries:

```html
<head>
    <!-- ... -->
    <script type="text/javascript" src="https://unpkg.com/knockout/build/output/knockout-latest.js"></script>

    <!-- SurveyJS Form Library resources -->
    <script type="text/javascript" src="https://unpkg.com/survey-core/survey.core.min.js"></script>
    <!-- Uncomment the following lines if you also display the survey on the page -->
    <!-- <link href="https://unpkg.com/survey-core/defaultV2.min.css" type="text/css" rel="stylesheet"> -->
    <!-- <script type="text/javascript" src="https://unpkg.com/survey-knockout-ui/survey-knockout-ui.min.js"></script> -->

    <!-- jsPDF for export to PDF -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.0.10/jspdf.plugin.autotable.min.js"></script>
    
    <!-- SheetJS for export to Excel -->
    <script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>

    <!-- Tabulator -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tabulator/4.7.2/css/tabulator.min.css" rel="stylesheet">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/tabulator/4.7.2/js/tabulator.min.js"></script>

    <!-- SurveyJS plugin for Tabulator -->
    <link href="https://unpkg.com/survey-analytics/survey.analytics.tabulator.min.css" rel="stylesheet">
    <script src="https://unpkg.com/survey-analytics/survey.analytics.tabulator.min.js"></script>

    <script type="text/javascript" src="index.js"></script>
</head>
```

## Load Survey Results

You can access survey results as a JSON object within the `SurveyModel`'s `onComplete` event handler. Send the results to your server and store them with a specific survey ID. Refer to the [Handle Survey Completion](/Documentation/Library?id=get-started-knockout#handle-survey-completion) help topic for more information.  

To load the survey results, send the survey ID to your server and return an array of JSON objects:

```js
const SURVEY_ID = 1;

loadSurveyResults("https://your-web-service.com/" + SURVEY_ID)
    .then((surveyResults) => {
        // ...
        // Configure and render the table view here
        // Refer to the help topics below
        // ...
    });

function loadSurveyResults (url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.onload = () => {
            const response = request.response ? JSON.parse(request.response) : [];
            resolve(response);
        }
        request.onerror = () => {
            reject(request.statusText);
        }
        request.send();
    });
}
```

For demonstration purposes, this tutorial uses auto-generated survey results. The following code shows a survey model and a function that generates the survey results array:

```js
const surveyJson = {
    elements: [{
        name: "satisfaction-score",
        title: "How would you describe your experience with our product?",
        type: "radiogroup",
        choices: [
            { value: 5, text: "Fully satisfying" },
            { value: 4, text: "Generally satisfying" },
            { value: 3, text: "Neutral" },
            { value: 2, text: "Rather unsatisfying" },
            { value: 1, text: "Not satisfying at all" }
        ],
        isRequired: true
    }, {
        name: "nps-score",
        title: "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
        type: "rating",
        rateMin: 0,
        rateMax: 10,
    }],
    showQuestionNumbers: "off",
    completedHtml: "Thank you for your feedback!",
};

function randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function generateData() {
    const data = [];
    for (let index = 0; index < 100; index++) {
        const satisfactionScore = randomIntFromInterval(1, 5);
        const npsScore = satisfactionScore > 3 ? randomIntFromInterval(7, 10) : randomIntFromInterval(1, 6);
        data.push({
            "satisfaction-score": satisfactionScore,
            "nps-score": npsScore
        });
    }
    return data;
}
```

## Render the Table

The table view is rendered by the `Tabulator` component. Pass the survey model and results to its constructor to instantiate it. Assign the produced instance to a constant that will be used later to render the component:

```js
const surveyJson = { /* ... */ };
function generateData() { /* ... */ }

const survey = new Survey.Model(surveyJson);

const surveyDataTable = new SurveyAnalyticsTabulator.Tabulator(
    survey,
    generateData()
);
```

The table view should be rendered in a page element. Add this element to the page markup:

```html
<body>
    <div id="surveyDataTable"></div>
</body>
```

To render the table view in the page element, call the `render(containerId)` method on the Tabulator instance you created previously:

```js
document.addEventListener("DOMContentLoaded", function() {
    surveyDataTable.render("surveyDataTable");
});
```

<details>
    <summary>View Full Code</summary>

```html
<!DOCTYPE html>
<html>
<head>
    <title>Table View: SurveyJS Dashboard for Knockout</title>
    <meta charset="utf-8">
    <script type="text/javascript" src="https://unpkg.com/knockout/build/output/knockout-latest.js"></script>

    <script type="text/javascript" src="https://unpkg.com/survey-core/survey.core.min.js"></script>

    <!-- jsPDF for export to PDF -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.0.10/jspdf.plugin.autotable.min.js"></script>
    
    <!-- SheetJS for export to Excel -->
    <script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>

    <!-- Tabulator -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tabulator/4.7.2/css/tabulator.min.css" rel="stylesheet">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/tabulator/4.7.2/js/tabulator.min.js"></script>

    <!-- SurveyJS plugin for Tabulator -->
    <link href="https://unpkg.com/survey-analytics/survey.analytics.tabulator.min.css" rel="stylesheet">
    <script src="https://unpkg.com/survey-analytics/survey.analytics.tabulator.min.js"></script>

    <script type="text/javascript" src="index.js"></script>
</head>
<body>
    <div id="surveyDataTable"></div>
</body>
</html>
```

```js
const surveyJson = {
    elements: [{
        name: "satisfaction-score",
        title: "How would you describe your experience with our product?",
        type: "radiogroup",
        choices: [
            { value: 5, text: "Fully satisfying" },
            { value: 4, text: "Generally satisfying" },
            { value: 3, text: "Neutral" },
            { value: 2, text: "Rather unsatisfying" },
            { value: 1, text: "Not satisfying at all" }
        ],
        isRequired: true
    }, {
        name: "nps-score",
        title: "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
        type: "rating",
        rateMin: 0,
        rateMax: 10,
    }],
    showQuestionNumbers: "off",
    completedHtml: "Thank you for your feedback!",
};

const survey = new Survey.Model(surveyJson);

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function generateData() {
    const data = [];
    for (let index = 0; index < 100; index++) {
        const satisfactionScore = randomIntFromInterval(1, 5);
        const npsScore = satisfactionScore > 3 ? randomIntFromInterval(7, 10) : randomIntFromInterval(1, 6);
        data.push({
            "satisfaction-score": satisfactionScore,
            "nps-score": npsScore
        });
    }
    return data;
}

const surveyDataTable = new SurveyAnalyticsTabulator.Tabulator(
    survey,
    generateData()
);

document.addEventListener("DOMContentLoaded", function() {
    surveyDataTable.render("surveyDataTable");
});
```

</details>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/dashboard-table-view/angular (linkStyle))

## See Also

[Dashboard Demo Examples](/dashboard/examples/ (linkStyle))