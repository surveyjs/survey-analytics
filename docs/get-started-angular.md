# Add SurveyJS Dashboard to an Angular Application

This step-by-step tutorial will help you get started with SurveyJS Dashboard in an Angular application. To add SurveyJS Dashboard to your application, follow the steps below:

- [Install the `survey-analytics` npm Package](#install-the-survey-analytics-npm-package)
- [Configure Styles](#configure-styles)
- [Load Survey Results](#load-survey-results)
- [Configure the Visualization Panel](#configure-the-visualization-panel)
- [Render the Visualization Panel](#render-the-visualization-panel)

As a result, you will create the following dashboard:

<iframe src="https://codesandbox.io/s/add-surveyjs-analytics-to-an-angular-application-forked-n2yt2m?file=/src/app/app.component.ts"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Add SurveyJS Dashboard to an Angular Application"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/get-started-analytics/angular (linkStyle))

## Install the `survey-analytics` npm Package

SurveyJS Dashboard is distributed as a <a href="https://www.npmjs.com/package/survey-analytics" target="_blank">survey-analytics</a> npm package. Run the following command to install it:

```cmd
npm install survey-analytics --save
```

SurveyJS Dashboard depends on the <a href="https://github.com/plotly/plotly.js#readme" target="_blank">Plotly.js</a> and <a href="https://github.com/timdream/wordcloud2.js#readme" target="_blank">Wordcloud</a> libraries. Wordcloud is used to visualize the Text, Multiple Text, and Comment question types. Plotly.js is used to visualize the rest of the question types. Use the following commands to install type definitions for these libraries:

```cmd
npm i @types/plotly.js-dist-min @types/wordcloud --save-dev
```

Due to the design of Plotly.js exports, you should also open the `tsconfig.json` file and set the `allowSyntheticDefaultImports` flag to `true`:

```json
{
  "compilerOptions": {
    // ...
    "allowSyntheticDefaultImports": true
  }
}
```

## Configure Styles

Open the `angular.json` file and reference the SurveyJS Dashboard style sheet:

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
              "node_modules/survey-analytics/survey.analytics.min.css"
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

You can access survey results as a JSON object within the `SurveyModel`'s `onComplete` event handler. Send the results to your server and store them with a specific survey ID. Refer to the [Handle Survey Completion](/Documentation/Library?id=get-started-angular#handle-survey-completion) help topic for more information.  

To load the survey results, send the survey ID to your server and return an array of JSON objects:

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
        // Configure and render the Visualization Panel here
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

For demonstration purposes, this tutorial uses predefined survey results. The following code shows a survey model and the structure of the survey results array:

```js
const surveyJson = {
  elements: [{
    name: "satisfaction-score",
    title: "How would you describe your experience with our product?",
    type: "radiogroup",
    choices: [
      { value: 5, text: "Very Satisfied" },
      { value: 4, text: "Satisfied" },
      { value: 3, text: "Neutral" },
      { value: 2, text: "Unsatisfied" },
      { value: 1, text: "Very Unsatisfied" }
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

const surveyResults = [{
  "satisfaction-score": 5,
  "nps-score": 10
}, {
  "satisfaction-score": 5,
  "nps-score": 9
}, {
  "satisfaction-score": 3,
  "nps-score": 6
}, {
  "satisfaction-score": 3,
  "nps-score": 6
}, {
  "satisfaction-score": 2,
  "nps-score": 3
}];
```

## Configure the Visualization Panel

Analytics charts are displayed in a Visualization Panel. Specify [its properties](/Documentation/Analytics?id=ivisualizationpaneloptions) in a configuration object. In this tutorial, the object enables the [`allowHideQuestions`](/Documentation/Analytics?id=ivisualizationpaneloptions#allowHideQuestions) property:

```js
const vizPanelOptions = {
  allowHideQuestions: false
}
```

Pass the configuration object, survey questions, and results to the `VisualizationPanel` constructor as shown in the code below to instantiate the Visualization Panel. Assign the produced instance to a constant that will be used later to render the component:

```js
import { AfterViewInit, Component } from '@angular/core';
import { Model } from 'survey-core';
import { VisualizationPanel } from 'survey-analytics';

const surveyJson = { /* ... */ };
const surveyResults = [ /* ... */ ];
const vizPanelOptions = { /* ... */ };

@Component({
  // ...
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const survey = new Model(surveyJson);
    const vizPanel = new VisualizationPanel(
      survey.getAllQuestions(),
      surveyResults,
      vizPanelOptions
    );
  }
}
```

<details>
    <summary>View Full Code</summary>

```js
import { AfterViewInit, Component } from '@angular/core';
import { Model } from 'survey-core';
import { VisualizationPanel } from 'survey-analytics';

const surveyJson = {
  elements: [{
    name: "satisfaction-score",
    title: "How would you describe your experience with our product?",
    type: "radiogroup",
    choices: [
      { value: 5, text: "Very Satisfied" },
      { value: 4, text: "Satisfied" },
      { value: 3, text: "Neutral" },
      { value: 2, text: "Unsatisfied" },
      { value: 1, text: "Very Unsatisfied" }
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

const surveyResults = [{
  "satisfaction-score": 5,
  "nps-score": 10
}, {
  "satisfaction-score": 5,
  "nps-score": 9
}, {
  "satisfaction-score": 3,
  "nps-score": 6
}, {
  "satisfaction-score": 3,
  "nps-score": 6
}, {
  "satisfaction-score": 2,
  "nps-score": 3
}];

const vizPanelOptions = {
  allowHideQuestions: false
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'SurveyJS Dashboard for Angular';

  ngAfterViewInit(): void {
    const survey = new Model(surveyJson);
    const vizPanel = new VisualizationPanel(
      survey.getAllQuestions(),
      surveyResults,
      vizPanelOptions
    );
  }
}
```

</details>

## Render the Visualization Panel

Switch to the component template. Add a page element that will serve as the Visualization Panel container:

```html
<div id="surveyVizPanel"></div>
```

To render the Visualization Panel in the page element, call the `render(containerId)` method on the Visualization Panel instance you created in the previous step:

```js
// ...

@Component({
  // ...
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // ...
    vizPanel.render("surveyVizPanel");
  }
}
```

To view the application, run `ng serve` in a command line and open [http://localhost:4200/](http://localhost:4200/) in your browser.

<details>
    <summary>View Full Code</summary>

```html
<div id="surveyVizPanel"></div>
```

```js
import { AfterViewInit, Component } from '@angular/core';
import { Model } from 'survey-core';
import { VisualizationPanel } from 'survey-analytics';

const surveyJson = {
  elements: [{
    name: "satisfaction-score",
    title: "How would you describe your experience with our product?",
    type: "radiogroup",
    choices: [
      { value: 5, text: "Very Satisfied" },
      { value: 4, text: "Satisfied" },
      { value: 3, text: "Neutral" },
      { value: 2, text: "Unsatisfied" },
      { value: 1, text: "Very Unsatisfied" }
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

const surveyResults = [{
  "satisfaction-score": 5,
  "nps-score": 10
}, {
  "satisfaction-score": 5,
  "nps-score": 9
}, {
  "satisfaction-score": 3,
  "nps-score": 6
}, {
  "satisfaction-score": 3,
  "nps-score": 6
}, {
  "satisfaction-score": 2,
  "nps-score": 3
}];

const vizPanelOptions = {
  allowHideQuestions: false
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'SurveyJS Dashboard for Angular';

  ngAfterViewInit(): void {
    const survey = new Model(surveyJson);
    const vizPanel = new VisualizationPanel(
      survey.getAllQuestions(),
      surveyResults,
      vizPanelOptions
    );
    vizPanel.render("surveyVizPanel");
  }
}
```
</details>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/get-started-analytics/angular (linkStyle))

## Further Reading

- [Analytics Demo Examples](/Examples/Analytics)