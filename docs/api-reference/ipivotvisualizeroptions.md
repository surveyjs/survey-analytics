---
title: IPivotVisualizerOptions
product: Dashboard
api-type: interface
description: Defines configuration options for a pivot chart visualizer.
source: https://surveyjs.io/dashboard/documentation/api-reference/ipivotvisualizeroptions
---

# `IPivotVisualizerOptions`

Defines configuration options for a pivot chart visualizer.

[View Demo](/dashboard/examples/household-income-analysis-pivot-chart/ (linkStyle))

Available since: v3.0.0

## Properties

### `categoryField`

**Type**: `string`

The data field whose values define categories on the X axis.

Available since: v3.0.0

### `maxSeriesCount`

**Type**: `number`

The maximum number of series per axis.

Default value: `undefined` (no limit)

Available since: v3.0.0

### `questions`

**Type**: `{}`

An array of survey questions available for use in the pivot chart.

To populate this array, instantiate a [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model), call its [`getAllQuestions()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#getAllQuestions) method, optionally filter the result, and assign it to this property.

[View Demo](/dashboard/examples/household-income-analysis-pivot-chart/ (linkStyle))

Available since: v3.0.0

### `series`

**Type**: `{}`

[Series definitions](/dashboard/documentation/api-reference/IPivotSeriesOptions) for the pivot chart.

Available since: v3.0.0

### `useSecondaryYAxis`

**Type**: `boolean`

Specifies whether to display a secondary Y axis.

Default value: `false`

If you enable this option, use the [`series[].yAxis`](/dashboard/documentation/api-reference/IPivotSeriesOptions#yAxis) property to assign individual series to the secondary axis.

Available since: v3.0.0
