---
title: Cross-Filtering in SurveyJS Dashboard | Interactive Chart Filtering Guide
description: Learn how to implement cross-filtering in SurveyJS dashboards. Enable chart-based filtering, control selection behavior for individual dashboard elements, and apply filters programmatically.
---

# Cross-Filtering in SurveyJS Dashboard

Cross-filtering is an interactive feature that lets users click a chart element (for example, a bar or pie slice) to filter all dashboard items and drill down into the corresponding subset of responses.

[View Demo](/dashboard/examples/student-feedback-survey-analysis/ (linkStyle))

## Supported Visualization Types

Cross-filtering is available for the following chart types:

- [Bar Chart](/dashboard/documentation/chart-types#bar-chart)
- [Pie Chart](/dashboard/documentation/chart-types#pie-chart)
- [Doughnut Chart](/dashboard/documentation/chart-types#doughnut-chart)
- [Histogram](/dashboard/documentation/chart-types#histogram)

## Enable or Disable Cross-Filtering

Cross-filtering is enabled by default. To disable it for the entire dashboard, set the [`allowSelection`](/dashboard/documentation/api-reference/idashboardoptions#allowSelection) property to `false` when creating a `Dashboard` instance:

```js
import { Dashboard } from "survey-analytics";

const dashboard = new Dashboard({
  questions: [ /* Survey questions to visualize */ ],
  data: [ /* Survey responses to aggregate */ ],
  items: [ /* Dashboard item configurations */ ],
  allowSelection: false // Disables cross-filtering globally
});
```

To override this behavior for a specific dashboard item, configure the `allowSelection` property in its [`visualizer`](/dashboard/documentation/api-reference/idashboarditemoptions#visualizer) object. Item-level settings take precedence over the global setting.

```js
import { Dashboard } from "survey-analytics";

const dashboard = new Dashboard({
  questions: [ /* ... */ ],
  data: [ /* ... */ ],
  allowSelection: false, // Disable cross-filtering globally
  items: [
    {
      name: "question1",
      visualizer: {
        allowSelection: true // Re-enable cross-filtering for this item
      }
    },
    // ...
  ]
});
```

## Apply Data Filtering Programmatically

To apply a cross-filter in code, call the [`setFilter`](/dashboard/documentation/api-reference/dashboard#setFilter) method on the `Dashboard` instance. Pass the dashboard item name and the target value:

```js
import { Dashboard } from "survey-analytics";

const dashboard = new Dashboard({
  /* Dashboard configuration */
});

dashboard.setFilter("question1", "item1");
```

For a question inside a nesting panel or page (see [Surveys with Nested Data](/dashboard/documentation/overview#surveys-with-nested-data)), pass the question's name, not its data path: `dashboard.setFilter("street", "Main St")` keeps the responses whose `address.street` value is `"Main St"`.

If you aggregate data on the server, assign a function to the `data` property instead of an array. The function receives the active filters in its `filter` parameter, an array of `{ field, type, value }` objects. For a question inside a nesting panel or page, `field` is the question's data path joined with dots, for example `"address.street"`. The function also receives the `visualizer` whose data it loads: `visualizer.question.getDataPath()` returns the keys of the question's value in a response, for example `["address", "street"]`. These paths apply to questions outside Dynamic Panel, Dynamic Matrix, and Multi-Select Matrix questions. A filter set inside such a question has that question's field (for example, `"items"`) and an object value in the shape of its record.

```js
import { Dashboard } from "survey-analytics";

const dashboard = new Dashboard({
  questions: survey.getAllQuestions(),
  data: ({ visualizer, filter }) => {
    // "address.street" for a question inside a nesting panel, the value name for other questions
    const questionId = visualizer.question.getDataPath().join(".");
    return fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, filter })
    }).then(response => response.json());
  }
});
```

> MongoDB and similar databases read a dotted field name as a path. A question, panel, or page whose key in a response contains a dot (its `valueName`, or its name when it has no `valueName`, for example `"a.b"`) stores its value under one literal key, which such a path does not reach, and the joined field does not distinguish the key `"a.b"` from the path `a` → `b`. If you aggregate responses in a database, do not use dots in these keys.

## Other Interactive UI Features

- [Date Range Filtering](/dashboard/documentation/date-range-filtering)
- [Sorting](/dashboard/documentation/sorting)
- [Visualization Type Selection](/dashboard/documentation/visualization-type-selection)
- [Legend-Based Series Toggling](/dashboard/documentation/legend-based-series-toggling)
- [Dynamic Layout Management](/dashboard/documentation/dynamic-layout-management)