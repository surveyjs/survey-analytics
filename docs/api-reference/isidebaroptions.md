---
title: ISidebarOptions
product: Dashboard
api-type: interface
description: Options for the sidebar widget (toolbar button + sliding panel).
source: https://surveyjs.io/dashboard/documentation/api-reference/isidebaroptions
---

# `ISidebarOptions`

Options for the sidebar widget (toolbar button + sliding panel).

Available since: v3.0.0

## Properties

### `buttonIcon`

**Type**: `string`

SVG icon name for the toolbar button (e.g. "settings_24x24").

Available since: v3.0.0

### `buttonTitle`

**Type**: `string`

Accessible title for the toolbar button.

Available since: v3.0.0

### `itemCreators`

**Type**: `SideBarItemCreators`

Array of sidebar item entries (creator + optional groupIndex). Items with different groupIndex are separated by a divider.
For backward compatibility, a plain array of creator functions is also accepted (all items are treated as one group).

Available since: v3.0.0

### `panelClassName`

**Type**: `string`

Optional CSS class for the panel root.

Available since: v3.0.0

### `title`

**Type**: `string`

Panel title shown in the header

Available since: v3.0.0
