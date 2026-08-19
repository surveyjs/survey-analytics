---
title: IVisualizerPanelElement
product: Dashboard
api-type: interface
description: An interface that describes a visualization item (chart, gauge, etc.).
source: https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement
---

# `IVisualizerPanelElement`

An interface that describes a visualization item (chart, gauge, etc.).

To access `IVisualizerPanelElement` objects, you can use the following properties and methods of `VisualizationPanel`:

- [`getElements()`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#getElements)
- [`visibleElements`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#visibleElements)
- [`hiddenElements`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#hiddenElements)

## Properties

### `displayName`

**Type**: `string`

The title of a survey question visualized by this item. The visualization item displays the same title.

### `isVisible`

**Type**: `boolean`

Indicates whether the visualization item is currently visible.

If you want to disallow users to hide visualization items, set the [`allowHideQuestions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions) property to `false`.

### `name`

**Type**: `string`

The name of a survey question visualized by this item.
