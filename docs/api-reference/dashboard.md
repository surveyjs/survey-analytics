---
title: Dashboard
product: Dashboard
api-type: class
description: Visualizes survey results and provides an interactive UI for data analysis.
source: https://surveyjs.io/dashboard/documentation/api-reference/dashboard
---

# `Dashboard`

Visualizes survey results and provides an interactive UI for data analysis.

[Get Started with SurveyJS Dashboard](https://surveyjs.io/dashboard/documentation/get-started (linkStyle))

[View Demo](https://surveyjs.io/dashboard/examples/interactive-survey-data-dashboard/ (linkStyle))

Available since: v3.0.0

## Inheritance

[`VisualizerBase`](https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase.md) &rarr; [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel.md) &rarr; `Dashboard`

## Properties

### `items`

**Type**: `{}`

Gets an array of [dashboard items](https://surveyjs.io/dashboard/documentation/api-reference/dashboarditem).

Each item represents a single data visualization within the Dashboard.

Available since: v3.0.0

## Methods

### `addItem()`

**Return value:** `DashboardItem` &ndash; The added `DashboardItem` instance.

Adds an item to the Dashboard.

Available since: v3.0.0

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `Question \| IDashboardItemOptions \| DashboardItem` | A [`DashboardItem`](https://surveyjs.io/dashboard/documentation/api-reference/dashboarditem) instance, an [`IDashboardItemOptions`](https://surveyjs.io/dashboard/documentation/api-reference/idashboarditemoptions) object, or a survey question used to create a new item. |

### `getItem()`

**Return value:** `DashboardItem` &ndash; A [`DashboardItem`](https://surveyjs.io/dashboard/documentation/api-reference/dashboarditem) instance, or `undefined` if no matching item is found.

Returns a dashboard item with the specified `name`.

If the [`questions`](https://surveyjs.io/dashboard/documentation/api-reference/idashboardoptions#questions) array is specified when initializing the Dashboard, item names are generated automatically based on the associated question names.

Available since: v3.0.0

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | The item identifier. |

### `removeItem()`

Removes an item from the Dashboard.

Available since: v3.0.0

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `string \| DashboardItem` | A [`DashboardItem`](https://surveyjs.io/dashboard/documentation/api-reference/dashboarditem) instance or the name of the item to remove. |

## Events

### `onDateRangeChanged`

Raised when the user changes the date range in the date panel. Handle this event to react to date filtering changes.

Parameters:

- `options.dateRange`: `number[]`\
The selected `[startDate, endDate]` range.
- `options.datePeriod`: `"last7days"` | `"last14days"` | `"last28days"` | `"last30days"` | `"lastWeekMon"` | `"lastWeekSun"` | `"lastMonth"` | `"lastQuarter"` | `"lastYear"` | `"ytd"` | `"mtd"` | `"wtdSun"` | `"wtdMon"` | `"qtd"`\
The selected predefined date period. `undefined` if the user selected a custom range.

Available since: v3.0.0
