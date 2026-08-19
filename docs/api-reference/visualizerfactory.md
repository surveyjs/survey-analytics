---
title: VisualizerFactory
product: Dashboard
api-type: class
description: An object that allows you to create individual visualizers without creating a visualization panel.
source: https://surveyjs.io/dashboard/documentation/api-reference/visualizerfactory
---

# `VisualizerFactory`

An object that allows you to create individual visualizers without creating a [visualization panel](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel).

## Methods

### `createVisualizer()`

**Return value:** `VisualizerBase`

Creates a visualizer for a single question.

```js
import { VisualizerFactory } from "survey-analytics";

const visualizer = new VisualizerFactory.createVisualizer(
  question,
  data,
  options
);

visualizer.render("containerId")
```

If a question has more than one [registered](https://surveyjs.io/dashboard/documentation/api-reference/visualizationmanager#registerVisualizer) visualizer, users can switch between them using a drop-down menu.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `descriptor` | `any` | A question or type descriptor to create a visualizer. |
| `data` | `Array<{ [index: string]: any; }>` | A data array with survey results to be visualized. |
| `options` | `{ [index: string]: any; }` | An object with any custom properties you need within the visualizer. |
