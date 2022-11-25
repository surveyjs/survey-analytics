# Add SurveyJS Dashboard to a React Application

This step-by-step tutorial will help you get started with SurveyJS Dashboard in a React application. To add SurveyJS Dashboard to your application, follow the steps below:

- [Install the `survey-analytics` npm Package](#install-the-survey-analytics-npm-package)
- [Configure Styles](#configure-styles)
- [Load Survey Results](#load-survey-results)
- [Configure the Visualization Panel](#configure-the-visualization-panel)
- [Render the Visualization Panel](#render-the-visualization-panel)

As a result, you will create the following dashboard:

<iframe src="https://codesandbox.io/embed/purple-darkness-i3tozi?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.js&theme=dark"
    style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
    title="Add SurveyJS Dashboard to a React Application"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/get-started-analytics/react (linkStyle))

## Install the `survey-analytics` npm Package

SurveyJS Dashboard is distributed as a <a href="https://www.npmjs.com/package/survey-analytics" target="_blank">survey-analytics</a> npm package. Run the following command to install it:

```cmd
npm install survey-analytics --save
```

SurveyJS Dashboard depends on the <a href="https://github.com/plotly/plotly.js#readme" target="_blank">Plotly.js</a> and <a href="https://github.com/timdream/wordcloud2.js#readme" target="_blank">Wordcloud</a> libraries. Wordcloud is used to visualize the Text, Multiple Text, and Comment question types. Plotly.js is used to visualize the rest of the question types. The command above installs both these libraries as dependencies.

## Configure Styles

Import the SurveyJS Dashboard style sheet as shown below:

```js
import 'survey-analytics/survey.analytics.min.css';
```

## Load Survey Results

You can access survey results as a JSON object within the `SurveyModel`'s `onComplete` event handler. Send the results to your server and store them with a specific survey ID. Refer to the [Handle Survey Completion](/Documentation/Library?id=get-started-react#handle-survey-completion) help topic for more information.  

To load the survey results, send the survey ID to your server and return an array of JSON objects:

```js
// ...
import { useState } from 'react';

const SURVEY_ID = 1;

export default function App() {
  const [vizPanel, setVizPanel] = useState(null);

  if (!vizPanel && !!survey) {
    loadSurveyResults("https://your-web-service.com/" + SURVEY_ID)
      .then((surveyResults) => {
        // ...
        // Configure the Visualization Panel here
        // Refer to the help topics below
        // ...
      });
  }

  return ();
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
// ...
import { useState } from 'react';
import { Model } from 'survey-core';
import { VisualizationPanel } from 'survey-analytics';

const surveyJson = { /* ... */ };
const surveyResults = [ /* ... */ ];
const vizPanelOptions = { /* ... */ };

export default function App() {
  const [survey, setSurvey] = useState(null);
  const [vizPanel, setVizPanel] = useState(null);
  if (!survey) {
    const survey = new Model(surveyJson);
    setSurvey(survey);
  }

  if (!vizPanel && !!survey) {
    const vizPanel = new VisualizationPanel(
      survey.getAllQuestions(),
      surveyResults,
      vizPanelOptions
    );
    setVizPanel(vizPanel);
  }

  return ();
}
```

<details>
    <summary>View Full Code</summary>

```js
import { useState } from 'react';
import 'survey-analytics/survey.analytics.min.css';
import { Model } from 'survey-core';
import { VisualizationPanel } from 'survey-analytics';

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

export default function App() {
  const [survey, setSurvey] = useState(null);
  const [vizPanel, setVizPanel] = useState(null);
  if (!survey) {
    const survey = new Model(surveyJson);
    setSurvey(survey);
  }

  if (!vizPanel && !!survey) {
    const vizPanel = new VisualizationPanel(
      survey.getAllQuestions(),
      surveyResults,
      vizPanelOptions
    );
    vizPanel.showHeader = false;
    setVizPanel(vizPanel);
  }

  return ();
}
</script>
```

</details>

## Render the Visualization Panel

A Visualization Panel should be rendered in a page element. Add this element to the component markup:

```js
export default function App() {
  // ...
  return (
    <div id="surveyVizPanel" />
  );
}
```

To render the Visualization Panel in the page element, call the `render(containerId)` method on the Visualization Panel instance you created in the previous step:

```js
import { ..., useEffect } from 'react';

export default function App() {
  // ...

  useEffect(() => {
    vizPanel.render("surveyVizPanel");
    return () => {
      document.getElementById("surveyVizPanel").innerHTML = "";
    }
  }, [vizPanel]);

  // ...
}
```

To view the application, run `npm run start` in a command line and open [http://localhost:3000/](http://localhost:3000/) in your browser.

<details>
    <summary>View Full Code</summary>

```js
import { useState, useEffect } from 'react';
import 'survey-analytics/survey.analytics.min.css';
import { Model } from 'survey-core';
import { VisualizationPanel } from 'survey-analytics';

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

export default function App() {
  const [survey, setSurvey] = useState(null);
  const [vizPanel, setVizPanel] = useState(null);
  if (!survey) {
    const survey = new Model(surveyJson);
    setSurvey(survey);
  }

  if (!vizPanel && !!survey) {
    const vizPanel = new VisualizationPanel(
      survey.getAllQuestions(),
      surveyResults,
      vizPanelOptions
    );
    vizPanel.showHeader = false;
    setVizPanel(vizPanel);
  }

  useEffect(() => {
    vizPanel.render("surveyVizPanel");
    return () => {
      document.getElementById("surveyVizPanel").innerHTML = "";
    }
  }, [vizPanel]);

  return (
    <div id="surveyVizPanel" />
  );
}
```
</details>

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/get-started-analytics/react (linkStyle))

## Further Reading

- [Analytics Demo Examples](/Examples/Analytics)