---
title: IVisualizationPanelOptions
product: Dashboard
api-type: interface
description: Obsolete.
source: https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions
---

# `IVisualizationPanelOptions`

Obsolete. Use the [`IDashboardOptions`](https://surveyjs.io/dashboard/documentation/api-reference/idashboardoptions) configuration object and the [`Dashboard`](https://surveyjs.io/dashboard/documentation/api-reference/dashboard) class instead.

## Inheritance

[`ISelectBaseVisualizerOptions`](https://surveyjs.io/dashboard/documentation/api-reference/iselectbasevisualizeroptions.md) &rarr; `IVisualizationPanelOptions`

## Properties

### `allowChangeVisualizerType`

**Type**: `boolean`

Enables switching between different visualizer types.

Default value: `true`

Available since: v2.3.8

### `allowDragDrop`

**Type**: `boolean`

Enables drag-and-drop reordering of dashboard items. Applies only if [`allowDynamicLayout`](#allowDynamicLayout) is `true`.

Default value: `true`

**Related APIs:** [`layoutEngine`](#layoutEngine)

### `allowDynamicLayout`

**Type**: `boolean`

Enables automatic layout based on available screen space and allows users to reorder items via drag and drop.

If disabled, items are rendered sequentially (one below another), and drag-and-drop reordering is disabled. To disable only drag-and-drop while keeping dynamic layout, set [`allowDragDrop`](#allowDragDrop) to `false`.

Default value: `true`

[How to Disable the Layout Engine](https://github.com/surveyjs/surveyjs-howtos-and-troubleshooting/blob/50a2f6f755193afb4733435e2942f80c98731e84/categories/data-visualization/custom-layout.md (linkStyle))

**Related APIs:** [`layoutEngine`](#layoutEngine)

### `allowHideQuestions`

**Type**: `boolean`

Enables users to hide individual dashboard items. Adds a **Hide** button to each item.

Default value: `true`

### `allowSelection`

**Type**: `boolean`

Enables cross-filtering between dashboard items. When enabled, selecting a data point filters other dashboard items accordingly.

Default value: `true`

### `labelTruncateLength`

**Type**: `number`

Maximum label length before truncation starts. Set to `-1` to disable truncation.

Default value: `27`

### `layoutEngine`

**Type**: `LayoutEngine`

A layout engine implementation used to arrange dashboard items. Use this property to integrate a third-party layout engine.

**Related APIs:** [`allowDynamicLayout`](#allowDynamicLayout)

### `showToolbar`

**Type**: `boolean`

Specifies whether to display the toolbar.

Default value: `true`

Available since: v3.0.0

### `stripHtmlFromTitles`

**Type**: `boolean`

Removes HTML markup from survey element titles before rendering.

Since survey titles may contain user-defined HTML, keeping this property enabled helps prevent potential injection of malicious code.

Default value: `true`

### `survey`

**Type**: `SurveyModel`

A survey instance used to apply survey localization settings to the Dashboard UI.

[View Demo](https://surveyjs.io/dashboard/examples/localize-survey-data-dashboard-ui/ (linkStyle))
