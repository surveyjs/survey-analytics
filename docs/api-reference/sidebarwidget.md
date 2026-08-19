---
title: SidebarWidget
product: Dashboard
api-type: class
description: Widget that renders a toolbar button which opens a sidebar (sliding) panel.
source: https://surveyjs.io/dashboard/documentation/api-reference/sidebarwidget
---

# `SidebarWidget`

Widget that renders a toolbar button which opens a sidebar (sliding) panel.
The panel is rendered on the side (e.g. right), shows a title with close button, and renders content from toolbarItemCreators.

Available since: v3.0.0

## Methods

### `render()`

**Return value:** `HTMLDivElement` &ndash; The button element to be placed in the toolbar.

Renders the toolbar button. When clicked, opens the sidebar panel.

Available since: v3.0.0

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `_toolbar` | `HTMLDivElement` | - Optional toolbar container (for API compatibility with toolbar item creators). |
