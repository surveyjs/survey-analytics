---
title: Integrate SurveyJS Dashboard with ApexCharts
description: Learn how to integrate SurveyJS Dashboard with ApexCharts to create advanced, customizable data visualizations for your survey results.
---

# Integrate SurveyJS Dashboard with ApexCharts

<a href="https://apexcharts.com/" target="_blank">ApexCharts</a> is a third-party data visualization library that you can use as an alternative to the default Chart.js integration in SurveyJS Dashboard. While ApexCharts has a larger bundle size and can struggle with very large datasets, it offers rich built-in features and polished interactivity out of the box.

## Add Dependencies

### Angular

Install the <a href="https://www.npmjs.com/package/survey-analytics" target="_blank">`survey-analytics`</a> npm package:

```sh
npm install survey-analytics
```

Then, register the ApexCharts-specific styles in `angular.json`:

```js
// angular.json
"styles": [
  "src/styles.css",
  "node_modules/survey-analytics/survey.analytics.apexcharts.min.css"
]
```

### Vue

Install the <a href="https://www.npmjs.com/package/survey-analytics" target="_blank">`survey-analytics`</a> npm package:

```sh
npm install survey-analytics
```

Import the ApexCharts integration stylesheet:

```html
<script setup lang="ts">
import 'survey-analytics/survey.analytics.apexcharts.css'
</script>
```

### React

Install the <a href="https://www.npmjs.com/package/survey-analytics" target="_blank">`survey-analytics`</a> npm package:

```sh
npm install survey-analytics
```

Import the ApexCharts integration stylesheet in your component:

```js
import 'survey-analytics/survey.analytics.apexcharts.css';
```

### HTML/CSS/JavaScript

SurveyJS Dashboard depends on Survey Core, a platform-independent part of the [SurveyJS Form Library](https://surveyjs.io/form-library/documentation/overview). If your page also renders surveys, include the [full Form Library resources](/form-library/documentation/get-started-html-css-javascript#link-surveyjs-resources) as well.

Add the following resources in this order:

```html
<head>
    <!-- Survey Core -->
    <script src="https://unpkg.com/survey-core/survey.core.min.js"></script>

    <!-- Optional: Survey UI -->
    <!-- <link href="https://unpkg.com/survey-core/survey-core.min.css" rel="stylesheet"> -->
    <!-- <script src="https://unpkg.com/survey-js-ui/survey-js-ui.min.js"></script> -->

    <!-- ApexCharts -->
    <script src="https://unpkg.com/apexcharts/dist/apexcharts.js"></script>

    <!-- SurveyJS Dashboard (ApexCharts integration) -->
    <link href="https://unpkg.com/survey-analytics/survey.analytics.apexcharts.min.css" rel="stylesheet">
    <script src="https://unpkg.com/survey-analytics/survey.analytics.apexcharts.min.js"></script>
</head>
```

## Render the Dashboard

To display a dashboard, add a container element to your component or page and render a [`Dashboard`](/dashboard/documentation/api-reference/dashboard) instance into it.

<details>
    <summary>Angular</summary> 

Import `Dashboard` from the `"survey-analytics/apexcharts"` module and use the `AfterViewInit` hook:

```html
<div id="dashboard"></div>
```

```js
import { AfterViewInit, Component } from '@angular/core';
import { Model } from 'survey-core';
import { Dashboard } from 'survey-analytics/apexcharts';

const surveyJson = { /* Survey JSON schema */ };
const surveyResults = { /* Survey responses */};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  title = 'SurveyJS Dashboard for Angular';

  ngAfterViewInit(): void {
    const survey = new Model(surveyJson);

    const dashboard = new Dashboard({
      questions: survey.getAllQuestions(),
      data: surveyResults
    });

    dashboard.render("dashboard");
  }
}
```

</details>

<details>
    <summary>Vue.js</summary> 

Import `Dashboard` from the `"survey-analytics/apexcharts"` module and use the `onMounted` hook:

```html
<script setup lang="ts">
import 'survey-analytics/survey.analytics.apexcharts.css'
import { Model } from 'survey-core'
import { Dashboard } from 'survey-analytics/apexcharts'
import { onMounted } from 'vue'

const surveyJson = { /* Survey JSON schema */ };
const surveyResults = { /* Survey responses */};

onMounted(() => {
  const survey = new Model(surveyJson);

  const dashboard = new Dashboard({
    questions: survey.getAllQuestions(),
    data: surveyResults
  });

  dashboard.render("dashboard");
});
</script>

<template>
  <div id="dashboard" />
</template>
```

</details>

<details>
    <summary>React</summary> 

Import `Dashboard` from the `"survey-analytics/apexcharts"` module and use the `useEffect` hook, as shown below.

> SurveyJS components are client-side components. Explicitly mark the React component that renders a SurveyJS component as client code using the ['use client'](https://react.dev/reference/react/use-client) directive.

```js
// components/Dashboard.tsx
'use client'

import 'survey-analytics/survey.analytics.apexcharts.css';
import { useState, useEffect } from 'react';
import { Model } from 'survey-core';
import { Dashboard } from 'survey-analytics/apexcharts';

const surveyJson = { /* Survey JSON schema */ };
const surveyResults = { /* Survey responses */};

export default function DashboardComponent() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  useEffect(() => {
    // Initialize the survey model
    const survey = new Model(surveyJson);

    // Create the dashboard instance
    const dashboardInstance = new Dashboard({
      questions: survey.getAllQuestions(),
      data: surveyResults
    });

    setDashboard(dashboardInstance);

    // Render the dashboard
    dashboardInstance.render("dashboard");

    // Cleanup when component unmounts
    return () => {
      dashboardInstance.clear();
    };
  }, []);

  return <div id="dashboard" />;
}
```

The lack of SSR support may cause hydration errors if a SurveyJS component is pre-rendered on the server. To ensure against those errors, use dynamic imports with `ssr: false` for React components that render SurveyJS components. The following code shows how to do this in Next.js:

```js
// dashboard/page.tsx
import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  ssr: false,
});

export default function SurveyDashboard() {
  return (
    <Dashboard />
  );
}
```
</details>

<details>
    <summary>HTML/CSS/JavaScript</summary> 

Reference `Dashboard` from the `SurveyAnalyticsApexCharts` namespace and use the `DOMContentLoaded` event to render it:

```html
<div id="dashboard"></div>
```

```js
const surveyJson = { /* Survey JSON schema */ };
const surveyResults = { /* Survey responses */};

const survey = new Survey.Model(surveyJson);

const dashboard = new SurveyAnalyticsApexCharts.Dashboard({
  questions: survey.getAllQuestions(),
  data: surveyResults
});

document.addEventListener("DOMContentLoaded", function() {
    dashboard.render(document.getElementById("dashboard"));
});
```

</details>

## Next Steps

Once integrated, you can configure the dashboard in the same way as with the default Chart.js setup. Refer to platform-specific guides and examples for details:

- [Angular](/dashboard/documentation/get-started-angular)
- [Vue](/dashboard/documentation/get-started-vue)
- [React](/dashboard/documentation/get-started-react)
- [HTML/CSS/JavaScript](/dashboard/documentation/get-started-html-css-javascript)
- [Demo examples](/dashboard/examples/interactive-survey-data-dashboard/)