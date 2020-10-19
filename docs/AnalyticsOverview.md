# Analytics Library for SurveyJS

SurveyJS Analytics library allows to render survey results <br/> as charts or tables

## Features

* Count answers and render results as charts for the select type questions
* Count answers and render results as gauge for range type question
* Three different types of charts: bar, pie and line
* Wordcloud for text questions representation
* Interactive filtering for the select type questions
* Flexible layout and customizable colors

## Screenshots

![SurveyJS Analytics example page 1](https://github.com/surveyjs/surveyjs/blob/master/docs/images/survey-analytics-page-1.png?raw=true)
![SurveyJS Analytics example page 2](https://github.com/surveyjs/surveyjs/blob/master/docs/images/survey-analytics-page-2.png?raw=true)

## Usage (modern ES, modules)
```javascript
import * as SurveyAnalytics from "survey-analytics";
```

## Usage (ES5, scripts)

Add these scripts to your web page

```html

    <link rel="stylesheet" type="text/css" href="../packages/survey.analytics.css" />

    <script src="https://cdn.rawgit.com/inexorabletash/polyfill/master/typedarray.js"></script>

    <script src="https://polyfill.io/v3/polyfill.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.5.0/knockout-min.js"></script>

    <link rel="stylesheet" type="text/css" href="https://unpkg.com/c3@0.7.1/c3.css" />

    <script src="https://unpkg.com/d3@5.9.2/dist/d3.min.js"></script>
    <script src="https://unpkg.com/c3@0.7.1/c3.js"></script>

    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

    <script src="https://unpkg.com/wordcloud@1.1.0/src/wordcloud2.js"></script>

    <script src="../node_modules/survey-core/survey.core.js"></script>
    <script src="../packages/survey.analytics.js"></script>

```

```javascript
var surveyId = "your survey Id";
var accessKey = "your access key";

var survey = new Survey.SurveyModel({ surveyId: surveyId });

var xhr = new XMLHttpRequest();
xhr.open(
  "GET",
  "http://surveyjs.io/api/MySurveys/getSurveyResults/" +
    surveyId +
    "?accessKey=" +
    accessKey
);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.onload = function () {
  var result = xhr.response ? JSON.parse(xhr.response) : [];

  var visPanel = new SurveyAnalytics.VisualizationPanel(
    survey.getAllQuestions(),
    data
  );
  visPanel.showHeader = true;
  visPanel.render(document.getElementById("summaryContainer"));
};
xhr.send();
```

Please check the following setting in your "tsconfig.json" file (this setting is need for used charting library):

```JSON
    "module": "es2015",
```

## Examples

* [NPS survey results summary](https://surveyjs.io/Examples/Library/?id=analytics-nps)
* [NPS survey results summary (new)](https://surveyjs.io/Examples/Analytics/?id=analytics-nps)

## Constraints

* Wisualization for custom widgets is not implemented

## License

[Commercial](https://surveyjs.io/Home/Licenses#Analytics)
