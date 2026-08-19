---
title: VisualizationManager
product: Dashboard
api-type: class
description: An object with methods used to register and unregister visualizers for individual question types.
source: https://surveyjs.io/dashboard/documentation/api-reference/visualizationmanager
---

# `VisualizationManager`

An object with methods used to register and unregister visualizers for individual question types.

[How to Implement a Custom Data Visualizer](https://github.com/surveyjs/surveyjs-howtos-and-troubleshooting/blob/main/categories/data-visualization/custom-survey-data-visualizer.md (linkStyle))

## Methods

### `getAltVisualizerSelector()`

**Return value:** `any`

Returns a constructor for an alternative visualizer selector.

**Related APIs:** [`registerAltVisualizerSelector`](#registerAltVisualizerSelector)

### `getVisualizersByType()`

**Return value:** `Array<VisualizerConstructor>`

Returns all visualizer constructors for a specified question type.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `visualizerType` | `string` | A question [type](https://surveyjs.io/form-library/documentation/api-reference/question#getType). |
| `fallbackVisualizerType` | `string` |  |

### `registerAltVisualizerSelector()`

Registers an alternative visualizer selector.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `constructor` | `any` | A function that returns a constructor for an alternative visualizer selector. |

### `registerVisualizer()`

Registers a visualizer for a specified question type.

[How to Implement a Custom Data Visualizer](https://github.com/surveyjs/surveyjs-howtos-and-troubleshooting/blob/main/categories/data-visualization/custom-survey-data-visualizer.md (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `questionType` | `string` | A question [type](https://surveyjs.io/form-library/documentation/api-reference/question#getType). |
| `constructor` | `VisualizerConstructor` | A function that returns a visualizer constructor to register. |
| `index` | `any` | A zero-based index that specifies the visualizer's position in the visualizer list for the specified question type. Pass `0` to insert the visualizer at the beginning of the list and use it by default. If `index` is not specified, the visualizer is added to the end of the list. |
| `visualizerType` | `string` |  |

### `unregisterVisualizer()`

Unregisters a visualizer for a specified question type.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `questionType` | `string` | A question [type](https://surveyjs.io/form-library/documentation/api-reference/question#getType). |
| `constructor` | `VisualizerConstructor` | A function that returns a visualizer constructor to unregister. |
