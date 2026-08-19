---
title: IDashboardOptions
product: Dashboard
api-type: interface
description: A configuration object passed to the `Dashboard` constructor.
source: https://surveyjs.io/dashboard/documentation/api-reference/idashboardoptions
---

# `IDashboardOptions`

A configuration object passed to the [`Dashboard`](https://surveyjs.io/dashboard/documentation/api-reference/dashboard) constructor.

[Get Started with SurveyJS Dashboard](https://surveyjs.io/dashboard/documentation/get-started (linkStyle))

[View Demo](https://surveyjs.io/dashboard/examples/interactive-survey-data-dashboard/ (linkStyle))

Available since: v3.0.0

## Inheritance

[`ISelectBaseVisualizerOptions`](https://surveyjs.io/dashboard/documentation/api-reference/iselectbasevisualizeroptions.md) &rarr; [`IVisualizationPanelOptions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions.md) &rarr; `IDashboardOptions`

## Properties

### `availableDatePeriods`

**Type**: `{}`

An array of date periods available for selection in the date panel.

Refer to [`datePeriod`](#datePeriod) for supported values.

Available since: v3.0.0

### `data`

**Type**: `{}`

An array of survey response objects to visualize.

In addition to `data`, specify at least one of the following:

- [`questions`](#questions)\
Dashboard items are generated automatically based on question settings.
- [`items`](#items)\
Dashboard items are defined explicitly.
- Both `questions` and `items`\
Items are generated from `questions` and then customized using `items`.

Available since: v3.0.0

### `dateFieldName`

**Type**: `string`

The name of a data field that contains date values used by the date panel.

Available since: v3.0.0

### `datePeriod`

**Type**: `"last7days" | "last14days" | "last28days" | "last30days" | "lastWeekMon" | "lastWeekSun" | "lastMonth" | "lastQuarter" | "lastYear" | "ytd" | "mtd" | "wtdSun" | "wtdMon" | "qtd"`

The predefined date period selected in the date panel. Applies only if [`dateFieldName`](#dateFieldName) is specified.

Supported values:

- `"last7days"` &ndash; Last 7 days
- `"last14days"` &ndash; Last 14 days
- `"last28days"` &ndash; Last 28 days
- `"last30days"` &ndash; Last 30 days
- `"lastWeekSun"` &ndash; Last week (starts Sunday)
- `"lastWeekMon"` &ndash; Last week (starts Monday)
- `"lastMonth"` &ndash; Last month
- `"lastQuarter"` &ndash; Last quarter
- `"lastYear"` &ndash; Last year
- `"ytd"` &ndash; This year to date
- `"mtd"` &ndash; This month to date
- `"wtdSun"` &ndash; This week to date (starts Sunday)
- `"wtdMon"` &ndash; This week to date (starts Monday)
- `"qtd"` &ndash; This quarter to date

Available since: v3.0.0

**Related APIs:** [`availableDatePeriods`](#availableDatePeriods), [`showDatePanel`](#showDatePanel)

### `dateRange`

**Type**: `DateRangeTuple`

A `[startDate, endDate]` tuple that defines a custom date range. Applies only if [`dateFieldName`](#dateFieldName) is specified.

If both [`datePeriod`](#datePeriod) and `dateRange` are specified, `dateRange` takes precedence.

Available since: v3.0.0

### `items`

**Type**: `Array<string | IDashboardItemOptions>`

An array of data field names and [dashboard item configuration objects](https://surveyjs.io/dashboard/documentation/idashboarditemoptions).

Specify this property to define dashboard items explicitly or customize items generated from the [`questions`](#questions) array. The array order determines the item order in the Dashboard.

Available since: v3.0.0

### `questions`

**Type**: `{}`

An array of survey questions to visualize.

To populate this array, instantiate a [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model), call its [`getAllQuestions()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#getAllQuestions) method, optionally filter the result, and assign it to this property.

When `questions` are specified, the Dashboard generates items automatically according to question configuration. Use the [`items`](#items) array to customize the generated items.

Available since: v3.0.0

### `showDatePanel`

**Type**: `boolean`

Specifies whether to display the total number of answers in the date panel. Applies only if [`dateFieldName`](#dateFieldName) is specified.

Default value: `true`

Available since: v3.0.0
