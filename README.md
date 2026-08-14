# SurveyJS Dashboard


<video src="https://github.com/surveyjs/survey-analytics/assets/22315929/2ebc84e1-dc43-4873-8c72-a1b4125e8749"></video>


[![Build Status](https://dev.azure.com/SurveyJS/V2%20Libraries/_apis/build/status%2Fanalytics%2FAnalytics%20Main?repoName=surveyjs%2Fsurvey-analytics&branchName=master)](https://dev.azure.com/SurveyJS/V2%20Libraries/_build/latest?definitionId=161&repoName=surveyjs%2Fsurvey-analytics&branchName=master)
<a href="https://github.com/microsoft/playwright">
<img alt="Tested with Playwright" src="https://img.shields.io/badge/tested%20with-Playwright-2fa4cf.svg">
</a>
<a href="https://github.com/surveyjs/survey-analytics/issues">
<img alt="Open Issues" title="Open Issues" src="https://img.shields.io/github/issues/surveyjs/survey-analytics.svg">
</a>
<a href="https://github.com/surveyjs/survey-analytics/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+">
<img alt="Closed issues" title="Closed issues" src="https://img.shields.io/github/issues-closed/surveyjs/survey-analytics.svg">
</a>

`survey-analytics` is the reporting layer of the [SurveyJS](https://surveyjs.io/) ecosystem. Give it a form JSON schema and an array of collected responses, and it reads the schema to work out each question's type, then renders the answers as interactive charts, data tables, word clouds, and aggregated statistics. It is framework-independent — the dashboard mounts into any DOM element, so it works in React, Angular, Vue, and plain HTML/CSS/JavaScript applications alike.

[![SurveyJS Dashboard](https://github.com/user-attachments/assets/2b302f6f-5a23-4e88-97cb-00e3ae2faa6c)](https://surveyjs.io/dashboard/examples/)

## Install

```sh
npm install survey-analytics
```

`survey-core` is a peer dependency — install it alongside if it isn't in your project yet:

```sh
npm install survey-core survey-analytics
```

Or load the library from a CDN, together with `survey-core` and the charting engine:

```html
<link href="https://unpkg.com/survey-analytics/survey.analytics.min.css" type="text/css" rel="stylesheet">
<script src="https://unpkg.com/chart.js/dist/chart.umd.js"></script>
<script src="https://unpkg.com/survey-core/survey.core.min.js"></script>
<script src="https://unpkg.com/survey-analytics/survey.analytics.min.js"></script>
```

## Usage

A dashboard is declared with a single options object: pass the survey questions, the response data, and — optionally — the items you want to display and how each of them should look.

```js
import { Model } from "survey-core";
import { Dashboard } from "survey-analytics";
import "survey-analytics/survey.analytics.css";

const survey = new Model(surveyJson);
const data = [ /* an array of response objects */ ];

const dashboard = new Dashboard({
  questions: survey.getAllQuestions(),
  data
});

dashboard.render(document.getElementById("dashboardContainer"));
```

Everything a dashboard shows can be described declaratively. Items may be plain question names or objects that pin the chart type and other per-item settings; the array order is the display order:

```js
const dashboard = new Dashboard({
  questions: survey.getAllQuestions(),
  data,
  dateFieldName: "timestamp",        // enables the built-in date range panel
  datePeriod: "last30days",
  legendPosition: "top",
  items: [
    { name: "overall_satisfaction", type: "gauge" },
    { name: "role_clarity", type: "bar", answersOrder: "desc" },
    "work_life_balance",             // a plain question name uses the default visualizer
    { name: "environment_ratings", type: "stackedbar", legendPosition: "bottom" },
    { type: "pivot", questions: survey.getAllQuestions() }
  ]
});
```

Adjustments a user makes at runtime — chart type, sorting, item visibility, layout — are captured in a state object, so a dashboard can be restored exactly as it was left:

```js
dashboard.onStateChanged.add((_, state) => {
  localStorage.setItem("dashboardState", JSON.stringify(state));
});

dashboard.state = JSON.parse(localStorage.getItem("dashboardState"));
```

## Charting engines

The library ships three interchangeable chart back-ends. **[Chart.js](https://www.chartjs.org/) is the default** — it is what the main `survey-analytics` entry point renders with, and it produces a noticeably smaller bundle than the alternatives. To use a different engine, import the matching entry point and style sheet instead; the API is identical.

| Engine | Import path | Style sheet | UMD global |
| --- | --- | --- | --- |
| Chart.js (default) | `survey-analytics` | `survey-analytics/survey.analytics.css` | `SurveyAnalytics` |
| Plotly.js | `survey-analytics/survey.analytics.plotly` | `survey-analytics/survey.analytics.plotly.css` | `SurveyAnalyticsPlotly` |
| ApexCharts | `survey-analytics/survey.analytics.apexcharts` | `survey-analytics/survey.analytics.apexcharts.css` | `SurveyAnalyticsApexcharts` |

Two further entry points cover the non-chart parts of the library:

| Entry point | Purpose |
| --- | --- |
| `survey-analytics/survey.analytics.tabulator` | Data table view built on [Tabulator](https://tabulator.info/), with filtering, sorting, and CSV/XLSX export |
| `survey-analytics/survey.analytics.mongo` | Server-side aggregation: builds MongoDB pipelines so large data sets are summarized in the database instead of the browser |

Import exactly one charting engine per application — each engine registers itself as the active chart adapter, so importing a second one overrides the first.

Every style sheet has a `.min.css` build and a `fontless` variant (for example, `survey.analytics.fontless.css`) that omits the bundled font declarations when the host application supplies its own typography.

## Features

**Visualizations**

- Bar and column charts, stacked bar charts, line and scatter charts
- Pie and doughnut charts
- Gauge and bullet charts for numeric and rating questions
- Histograms for numeric and date questions
- Radar chart for ranking questions
- Pivot chart with configurable category axis, multiple series, `sum`/`count` aggregation, and a secondary Y axis
- Word cloud and response tables for free-text answers
- NPS breakdown, response counters, and statistics tables — including a dedicated table for Boolean (Yes/No) questions
- Matrix, matrix dropdown, matrix dynamic, panel dynamic, and composite/custom question types

**Interaction and analysis**

- Cross-filtering: selecting a value in one chart filters every other item in the dashboard, so users can drill down across several criteria at once
- Built-in date filtering with a custom range picker and 14 presets (`last7days`, `last30days`, `lastQuarter`, `lastYear`, `mtd`, `ytd`, and more), plus a live count of matching responses
- Per-item chart type switching, answer ordering, "missing answers" display, and data transposition
- Dynamic layout with drag-and-drop reordering and resizing
- Choose which questions appear on the dashboard, from configuration or from the toolbar

**Configuration and integration**

- Declarative setup: an entire dashboard is described by one options object instead of a sequence of API calls
- State persistence via `getState()` / `state` and the `onStateChanged` event
- Localization independent of `survey-core`, covering the dashboard's own UI strings
- Accessibility: dashboard items are exposed as labelled groups, interactive controls carry ARIA roles and states, and the suite is verified with automated `axe-core` tests against WCAG 2.1 AA and Section 508 rules

## Get Started

- [Angular](https://surveyjs.io/dashboard/documentation/get-started-angular)
- [Vue](https://surveyjs.io/dashboard/documentation/get-started-vue)
- [React](https://surveyjs.io/dashboard/documentation/get-started-react)
- [HTML/CSS/JavaScript](https://surveyjs.io/dashboard/documentation/get-started-html-css-javascript)

## Documentation

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/dashboard/documentation/overview)
- [Live Examples](https://surveyjs.io/dashboard/examples/)
- [What's New](https://surveyjs.io/WhatsNew)

For AI coding agents: [https://surveyjs.io/llms.txt](https://surveyjs.io/llms.txt) indexes the documentation. Any documentation page is also available as raw Markdown — append `.md` to its URL, for example [https://surveyjs.io/dashboard/documentation/overview.md](https://surveyjs.io/dashboard/documentation/overview.md).

## SurveyJS ecosystem

| Product | Purpose | License |
| --- | --- | --- |
| [Form Library](https://surveyjs.io/form-library) | Render dynamic forms from JSON | MIT |
| [Survey Creator](https://surveyjs.io/survey-creator) | Drag-and-drop form builder UI | Commercial |
| [Dashboard](https://surveyjs.io/dashboard) | Visualize and analyze collected results (this package) | Commercial |
| [PDF Generator](https://surveyjs.io/pdf-generator) | Render forms and responses as PDF | Commercial |
| [AI Form Response Extractor](https://surveyjs.io/documentation/combine-paper-and-online-survey-form-data) | Extract responses from paper forms, PDFs, and images into a SurveyJS schema (`ai-form-response-extractor`) | MIT |

## Build SurveyJS Dashboard from Sources

This repository resolves `survey-core` from a local build of the [survey-library](https://github.com/surveyjs/survey-library) repository, so clone both under the same parent folder.

1. **Clone the repo**

    ```sh
    git clone https://github.com/surveyjs/survey-analytics.git
    cd survey-analytics
    ```

1. **Build `survey-core` first**

    `package.json` points `survey-core` at `../survey-library/packages/survey-core/build`, so the form library's core package must be built before you install dependencies here. Follow [Build from sources](https://github.com/surveyjs/survey-library/blob/master/packages/survey-core/README.md#build-from-sources) in the `survey-core` README.

1. **Install dependencies**

    ```sh
    npm install
    ```

1. **Build the library**

    ```sh
    npm run build
    ```

    You can find the built scripts and style sheets in the `build` folder. Use `npm run watch:dev` while developing.

1. **Run test examples**

    ```sh
    npm start
    ```

    This command runs a local HTTP server at http://localhost:8080/. The demos live in `examples/chart.js`, `examples/apexcharts`, and `examples` (Plotly).

1. **Run unit tests**

    Unit tests use [Vitest](https://vitest.dev/) in a jsdom environment.

    ```sh
    npm test                              # whole suite
    npm run test:dev                      # watch mode
    npx vitest run -t "test name"         # tests matching a substring
    ```

1. **Run end-to-end and accessibility tests**

    E2E, visual-regression, and accessibility tests are [Playwright](https://playwright.dev) suites. Do not start an HTTP server yourself — the Playwright config starts its own.

    ```sh
    npm run e2e:ci                        # all charting engines
    npm run e2e:ci:chartjs                # a single engine
    npm run e2e:ci -- --grep "TestName"   # a single test
    npm run accessibility-tests:ci        # accessibility
    ```

## Licensing

SurveyJS Dashboard is **not available for free commercial usage**. If you want to integrate it into your application, you must purchase a [commercial license(s)](https://surveyjs.io/licensing) for software developer(s) who will be working with the SurveyJS product's APIs and implementing their integration.
