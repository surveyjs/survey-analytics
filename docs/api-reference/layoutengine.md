---
title: LayoutEngine
product: Dashboard
api-type: class
description: A base class used to implement custom layout engines or integrate third-party layout engines with SurveyJS Dashboard.
source: https://surveyjs.io/dashboard/documentation/api-reference/layoutengine
---

# `LayoutEngine`

A base class used to implement custom layout engines or integrate third-party layout engines with SurveyJS Dashboard.

Available since: v3.0.0

## Methods

### `start()`

Enables the dynamic layout in a given HTML element.

This method should arrange visualization items based on the available screen space and allow users to reorder them via drag and drop.

Available since: v3.0.0

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `container` | `HTMLElement` |  |

### `stop()`

Disables the dynamic layout.

Available since: v3.0.0

### `update()`

Updates the dynamic layout.

Available since: v3.0.0
