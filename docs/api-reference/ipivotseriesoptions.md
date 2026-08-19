---
title: IPivotSeriesOptions
product: Dashboard
api-type: interface
description: Defines configuration options for a pivot chart series.
source: https://surveyjs.io/dashboard/documentation/api-reference/ipivotseriesoptions
---

# `IPivotSeriesOptions`

Defines configuration options for a pivot chart series.

Assign an array of `IPivotSeriesOptions` objects to the [`visualizer.series`](/dashboard/documentation/api-reference/IPivotVisualizerOptions#series) property to define chart series.

[View Demo](/dashboard/examples/household-income-analysis-pivot-chart/ (linkStyle))

Available since: v3.0.0

## Properties

### `aggregation`

**Type**: `"count" | "sum"`

The aggregation function applied to [`valueField`](#valueField).

Supported values:

- `"count"` (default)
- `"sum"`

Available since: v3.0.0

### `seriesField`

**Type**: `string`

The data field whose values define individual series and appear in the legend.

Available since: v3.0.0

### `valueField`

**Type**: `string`

The data field whose values are aggregated and plotted on the Y axis. If not specified, the [`seriesField`](#seriesField) is used.

Available since: v3.0.0

### `yAxis`

**Type**: `"primary" | "secondary"`

The Y axis to which this series is bound. Applies only when [`useSecondaryYAxis`](/dashboard/documentation/api-reference/IPivotVisualizerOptions#useSecondaryYAxis) is `true`.

Supported values:

- `"primary"`
- `"secondary"`

Available since: v3.0.0
