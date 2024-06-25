---
title: Export Survey Results to PDF or Excel | Open-Source JS Form Builder for Angular
description: Convert your survey data to manageable table format  for easy filtering and analysis. Save survey results as PDF or Excel files to visualize or share with others. View free demo for Angular with a step-by-step setup guide.
---

# Table View for Survey Results in an Angular Application

This step-by-step tutorial will help you set up a Table View for survey results using SurveyJS Dashboard in an Angular application. To add the Table View to your application, follow the steps below:

- [Install the `survey-analytics` npm Package](#install-the-survey-analytics-npm-package)
- [Configure Styles](#configure-styles)
- [Load Survey Results](#load-survey-results)
- [Render the Table](#render-the-table)
- [Enable Export to PDF and Excel](#enable-export-to-pdf-and-excel)

As a result, you will create the following view:

<iframe src="/proxy/github/code-examples/dashboard-table-view/knockout/index.html"
    style="width:100%; border:0; border-radius: 4px; overflow:hidden;"
></iframe>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/dashboard-table-view/angular (linkStyle))

If you are looking for a quick-start application that includes all SurveyJS components, refer to the following GitHub repository: <a href="https://github.com/surveyjs/surveyjs_angular_cli" target="_blank">SurveyJS + Angular CLI Quickstart Template</a>.

## Install the `survey-analytics` npm Package

SurveyJS Dashboard is distributed as a <a href="https://www.npmjs.com/package/survey-analytics" target="_blank">survey-analytics</a> npm package. Run the following command to install it:

```sh
npm install survey-analytics --save
```

The Table View for SurveyJS Dashboard depends on the <a href="https://tabulator.info/" target="_blank">Tabulator</a> library. The command above automatically installs it as a dependency.

## Configure Styles

Open the `angular.json` file and reference the Tabulator and Table View style sheets:

```js
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  // ...
  "projects": {
    "project-name": {
      "projectType": "application",
      // ...
      "architect": {
        "build": {
          // ...
          "options": {
            // ...
            "styles": [
              "src/styles.css",
              "node_modules/tabulator-tables/dist/css/tabulator.min.css",
              "node_modules/survey-analytics/survey.analytics.tabulator.min.css"
            ],
            // ...
          }
        }
      }
    }
  }
}
```

## Load Survey Results

When a respondent completes a survey, a JSON object with their answers is passed to the `SurveyModel`'s [`onComplete`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onComplete) event handler. You should send this object to your server and store it with a specific survey ID (see [Handle Survey Completion](/form-library/documentation/get-started-angular#handle-survey-completion)). A collection of such JSON objects is a data source for the Table View. This collection can be processed (sorted, filtered, paginated) on the server or on the client.

### Server-Side Data Processing

Server-side data processing enables the Table View to load survey results in small batches on demand and delegate sorting and filtering to the server. For this feature to work, the server must support these data operations. Refer to the following demo example on GitHub for information on how to configure the server and the client for this usage scenario:

[SurveyJS Dashboard: Table View - Server-Side Data Processing Demo Example](https://github.com/surveyjs/surveyjs-dashboard-table-view-nodejs-mongodb (linkStyle))

### Client-Side Data Processing

When data is processed on the client, the Table View loads the entire dataset at startup and applies sorting and filtering in a user's browser. This demands faster web connection and higher computing power but works smoother with small datasets.

To load survey results to the client, send the survey ID to your server and return an array of JSON objects with survey results:

```js
import { AfterViewInit, Component } from '@angular/core';

const SURVEY_ID = 1;

@Component({
  // ...
})
export class AppComponent implements AfterViewInit {
  // ...
  ngAfterViewInit(): void {
    loadSurveyResults("https://your-web-service.com/" + SURVEY_ID)
      .then((surveyResults) => {
        // ...
        // Configure and render the Table View here
        // Refer to the help topics below
        // ...
      });
  }
}

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

The Table View is rendered by the `Tabulator` component. Import this component and pass the survey model and results to its constructor to instantiate it. Assign the produced instance to a constant that will be used later to render the component:

```js
import { AfterViewInit, Component } from '@angular/core';
import { Model } from 'survey-core';
import { Tabulator } from 'survey-analytics/survey.analytics.tabulator';

const surveyJson = { /* ... */ };
function generateData() { /* ... */ }

@Component({
  // ...
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const survey = new Model(surveyJson);
    const surveyDataTable = new Tabulator(
      survey,
      generateData()
    );
  }
}
```

Switch to the component template and add a page element that will serve as the Table View container:

```html
<!-- app.component.html -->
<div id="surveyDataTable"></div>
```

To render the Table View in the page element, call the `render(containerId)` method on the Tabulator instance you created previously:

```js
// ...
@Component({
  // ...
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // ...
    surveyDataTable.render("surveyDataTable");
  }
}
```

<details>
    <summary>View Full Code</summary>

```html
<div id="surveyDataTable"></div>
```

```js
import { AfterViewInit, Component } from '@angular/core';
import { Model } from 'survey-core';
import { Tabulator } from 'survey-analytics/survey.analytics.tabulator';

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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const survey = new Model(surveyJson);
    const surveyDataTable = new Tabulator(
      survey,
      generateData()
    );
    surveyDataTable.render("surveyDataTable");
  }
}
```

</details>

## Enable Export to PDF and Excel

The Table View for SurveyJS Dashboard allows users to save survey results as CSV, PDF, and XLSX documents. Export to CSV is supported out of the box. For export to PDF and XLSX, you need to reference the <a href="https://github.com/parallax/jsPDF#readme" target="_blank">jsPDF</a>, <a href="https://github.com/JonatanPe/jsPDF-AutoTable#readme" target="_blank">jsPDF-AutoTable</a>, and <a href="https://sheetjs.com/" target="_blank">SheetJS</a> libraries. Open the `index.html` file in your project and add the following links to the `<head>` element:

```html
<!-- jsPDF for export to PDF -->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.0.10/jspdf.plugin.autotable.min.js"></script>

<!-- SheetJS for export to Excel -->
<script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
```

To view the application, run `ng serve` in a command line and open [http://localhost:4200/](http://localhost:4200/) in your browser. If you do everything correctly, you should see the following result:

![SurveyJS Dashboard: Export survey data to PDF, XLSX, and CSV](../images/export-to-pdf-xlsx-csv.png)

> With [server-side data processing](#server-side-data-processing), exported documents contain only currently loaded data records. To export full datasets, you need to generate the documents on the server.

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/dashboard-table-view/angular (linkStyle))

## See Also

[Dashboard Demo Examples](/dashboard/examples/ (linkStyle))