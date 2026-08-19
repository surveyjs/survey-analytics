---
title: IDashboardItemOptions
product: Dashboard
api-type: interface
description: Defines configuration options for a dashboard item.
source: https://surveyjs.io/dashboard/documentation/api-reference/idashboarditemoptions
---

# `IDashboardItemOptions`

Defines configuration options for a dashboard item.

Pass an array of `IDashboardItemOptions` objects to the [`items`](https://surveyjs.io/dashboard/documentation/api-reference/dashboard#items) array when initializing the Dashboard.

[View Demo](https://surveyjs.io/dashboard/examples/customer-satisfaction-survey-analysis/ (linkStyle))

Available since: v3.0.0

## Properties

### `allowChangeType`

**Type**: `boolean`

Specifies whether users can change the item [`type`](#type).

Default value: `true`

Available since: v3.0.0

**Related APIs:** [`availableTypes`](#availableTypes)

### `availableTypes`

**Type**: `{}`

A list of item types available for user selection.

Refer to [`type`](#type) for supported values.

Available since: v3.0.0

**Related APIs:** [`allowChangeType`](#allowChangeType)

### `dataField`

**Type**: `string`

The data field the item is bound to. If not specified, the [`name`](#name) value is used.

Available since: v3.0.0

### `name`

**Type**: `string`

A unique identifier for the item.

Available since: v3.0.0

### `title`

**Type**: `string`

The item title.

Available since: v3.0.0

### `type`

**Type**: `string`

The item type (visualization type).

Supported values:

- [`"bar"`](https://surveyjs.io/dashboard/documentation/chart-types#bar-chart)
- [`"vbar"`](https://surveyjs.io/dashboard/documentation/chart-types#bar-chart)
- [`"pie"`](https://surveyjs.io/dashboard/documentation/chart-types#pie-chart)
- [`"doughnut"`](https://surveyjs.io/dashboard/documentation/chart-types#doughnut-chart)
- [`"histogram"`](https://surveyjs.io/dashboard/documentation/chart-types#histogram)
- [`"vhistogram"`](https://surveyjs.io/dashboard/documentation/chart-types#histogram)
- [`"gauge"`](https://surveyjs.io/dashboard/documentation/chart-types#gauge-chart)
- [`"bullet"`](https://surveyjs.io/dashboard/documentation/chart-types#bullet-chart)
- [`"radar"`](https://surveyjs.io/dashboard/documentation/chart-types#radar-chart-spider-chart)
- [`"stackedbar"`](https://surveyjs.io/dashboard/documentation/chart-types#stacked-bar-chart)
- [`"wordcloud"`](https://surveyjs.io/dashboard/documentation/chart-types#word-cloud)
- [`"text"`](https://surveyjs.io/dashboard/documentation/chart-types#text-table)
- [`"choices"`](https://surveyjs.io/dashboard/documentation/chart-types#statistics-table)
- [`"nps"`](https://surveyjs.io/dashboard/documentation/chart-types#nps-visualizer)
- [`"responsecount"`](https://surveyjs.io/dashboard/documentation/chart-types#response-count)
- [`"pivot"`](https://surveyjs.io/dashboard/documentation/chart-types#pivot-chart)

To prevent end users from changing the item type at runtime, set [`allowChangeType`](#allowChangeType) to `false`.

Available since: v3.0.0

### `visible`

**Type**: `boolean`

Specifies whether this item is visible.

Default value: `true`

Available since: v3.0.0

### `visualizer`

**Type**: `{ [index: string]: any; }`

A configuration object with visualizer settings that control how this item's data is rendered.

Available since: v3.0.0
