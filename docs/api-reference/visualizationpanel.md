---
title: VisualizationPanel
product: Dashboard
api-type: class
description: Obsolete.
source: https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel
---

# `VisualizationPanel`

Obsolete. Use the [`Dashboard`](/dashboard/documentation/api-reference/dashboard) class instead.

## Inheritance

[`VisualizerBase`](https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase.md) &rarr; `VisualizationPanel`

## Properties

### `allowDragDrop`

**Type**: `boolean`

Returns the [`allowDragDrop`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowDragDrop) property value passed to the constructor.

### `allowDynamicLayout`

**Type**: `boolean`

Returns the [`allowDynamicLayout`](https://surveyjs.io/dashboard/documentation/api-reference/idashboardoptions#allowDynamicLayout) property value passed to the constructor.

### `allowHideQuestions`

**Type**: `boolean`

Returns the [`allowHideQuestions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions) property value passed to the constructor.

### `hiddenElements`

**Type**: `any`

Returns an array of [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement) objects with information about currently hidden visualization items.

If you want to disallow users to hide visualization items, set the [`allowHideQuestions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions) property to `false`.

**Related APIs:** [`visibleElements`](#visibleElements), [`getElements`](#getElements)

### `layoutEngine`

**Type**: `LayoutEngine`

Returns a [`LayoutEngine`](https://surveyjs.io/dashboard/documentation/api-reference/layoutengine) instance that arranges visualization items within the dashboard.

### `state`

**Type**: `IState`

Gets or sets the Dashboard state.

The state includes configuration of dashboard items and the current locale.

[View Demo](https://surveyjs.io/dashboard/examples/save-dashboard-state-to-local-storage/ (linkStyle))

**Related APIs:** [`onStateChanged`](#onStateChanged)

### `visibleElements`

**Type**: `any`

Returns an array of [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement) objects with information about currently visible visualization items.

If you want to disallow users to hide visualization items, set the [`allowHideQuestions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions) property to `false`.

**Related APIs:** [`hiddenElements`](#hiddenElements), [`getElements`](#getElements)

## Methods

### `getElement()`

**Return value:** `any`

Returns a visualization item with a specified question name.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `questionName` | `string` |  |

### `getElements()`

**Return value:** `Array<IVisualizerPanelElement>`

Returns an array of [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement) objects with information about visualization items.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `questionNames` | `Array<string>` | Question [names](https://surveyjs.io/form-library/documentation/api-reference/question#name). Do not specify this parameter to get an array of all visualization items. |

**Related APIs:** [`visibleElements`](#visibleElements), [`hiddenElements`](#hiddenElements)

### `getVisualizer()`

**Return value:** `any`

Returns a [visualizer](https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase) that visualizes a specified survey question.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `questionName` | `string` | A question [name](https://surveyjs.io/form-library/documentation/api-reference/question#name). |

### `refresh()`

Redraws the dashboard and all its content.

### `setFilter()`

Filters visualized data based on a specified question name and value. This method is called when a user clicks a chart point.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `questionName` | `string` | A question [name](https://surveyjs.io/form-library/documentation/api-reference/question#name). |
| `selectedValue` | `any` | A filter value. |

## Events

### `onElementHidden`

An event that is raised when users [hide a visualization item](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions).

Parameters:

- `sender`: [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel)\
A `VisualizationPanel` that raised the event.

- `options.elements`: Array\<[`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\>\
Information about all visualization items rendered by this `VisualizationPanel`.

- `options.element`: [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\
A visualization item that has been hidden.

### `onElementMoved`

An event that is raised when users [move a visualization item](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowDynamicLayout).

Parameters:

- `sender`: [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel)\
A `VisualizationPanel` that raised the event.

- `options.elements`: Array\<[`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\>\
Information about all visualization items rendered by this `VisualizationPanel`.

- `options.element`: [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\
A visualization item that has been moved.

### `onElementShown`

An event that is raised when users [show a visualization item](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions).

Parameters:

- `sender`: [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel)\
A `VisualizationPanel` that raised the event.

- `options.elements`: Array\<[`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\>\
Information about all visualization items rendered by this `VisualizationPanel`.

- `options.element`: [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\
A visualization item that has been shown.
