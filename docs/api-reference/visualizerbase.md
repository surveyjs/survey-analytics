---
title: VisualizerBase
product: Dashboard
api-type: class
description: A base object for all visualizers.
source: https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase
---

# `VisualizerBase`

A base object for all visualizers. Use it to implement a custom visualizer.

Constructor parameters:

- `question`: [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question)\
A survey question to visualize.
- `data`: `Array<any>`\
Survey results.
- `options`\
An object with the following properties:
   - `dataProvider`: `DataProvider`\
   A data provider for this visualizer.
   - `renderContent`: `(contentContainer: HTMLElement, visualizer: VisualizerBase) => void`\
   A function that renders the visualizer's HTML markup. Append the markup to `contentContainer`.
   - `survey`: [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model)\
   Pass a `SurveyModel` instance if you want to use locales from the survey JSON schema.
   - `seriesValues`: `Array<string>`\
   Series values used to group data.
   - `seriesLabels`: `Array<string>`\
   Series labels to display. If this property is not set, `seriesValues` are used as labels.
- `type`: `string`\
*(Optional)* The visualizer's type.

[View Demo](https://surveyjs.io/dashboard/examples/how-to-plot-survey-data-in-custom-bar-chart/ (linkStyle))

## Properties

### `footerVisualizer`

**Type**: `VisualizerBase`

Allows you to access the footer visualizer. Returns `undefined` if the footer is absent.

**Related APIs:** [`hasFooter`](#hasFooter)

### `hasFooter`

**Type**: `boolean`

Indicates whether the visualizer displays a footer. This property is `true` when a visualized question has a comment.

**Related APIs:** [`hasHeader`](#hasHeader)

### `hasHeader`

**Type**: `boolean`

Indicates whether the visualizer displays a header. This property is `true` when a visualized question has a correct answer.

**Related APIs:** [`hasFooter`](#hasFooter)

### `locale`

**Type**: `string`

Gets or sets the current locale.

If you want to inherit the locale from a visualized survey, assign a [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model) instance to the [`survey`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#survey) property of the `IVisualizationPanelOptions` object in the [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel) constructor.

If the survey is [translated into more than one language](https://surveyjs.io/form-library/examples/survey-localization/), the toolbar displays a language selection drop-down menu.

[View Demo](https://surveyjs.io/dashboard/examples/localize-survey-data-dashboard-ui/ (linkStyle))

**Related APIs:** [`onLocaleChanged`](#onLocaleChanged)

### `name`

**Type**: `string`

Returns the identifier of a visualized question.

### `showToolbar`

**Type**: `boolean`

Gets or sets the visibility of the visualizer's toolbar.

Default value: `true`

### `supportSelection`

**Type**: `boolean`

Indicates whether users can select series points to cross-filter charts. To allow or disallow selection, set the [`allowSelection`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowSelection) property of the `IVisualizationPanelOptions` object in the [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel) constructor.

### `title`

**Type**: `string`

Returns the visualizer's title.

Available since: v2.3.8

### `type`

**Type**: `string`

Returns the visualizer's type.

## Methods

### `clear()`

Empties the toolbar, header, footer, and content containers.

If you want to empty and delete the visualizer and all its elements from the DOM, call the [`destroy()`](https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase#destroy) method instead.

### `destroy()`

Deletes the visualizer and all its elements from the DOM.

**Related APIs:** [`clear`](#clear)

### `getCalculatedValues()`

**Return value:** `Promise<Array<Object>><Array>`

Returns an array of calculated and visualized values. If a user applies a filter, the array is also filtered.

To get an array of source survey results, use the [`surveyData`](https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase#surveyData) property.

### `getState()`

**Return value:** `any`

Returns an object with properties that describe a current visualizer state. The properties are different for each individual visualizer.

> This method is overriden in classes descendant from `VisualizerBase`.

**Related APIs:** [`setState`](#setState), [`resetState`](#resetState), [`onStateChanged`](#onStateChanged)

### `refresh()`

Re-renders the visualizer and its content.

### `registerToolbarItem()`

Registers a function used to create a toolbar item for this visualizer.

The following code shows how to add a custom button and drop-down menu to the toolbar:

```js
import { VisualizationPanel, DocumentHelper } from "survey-analytics";

const vizPanel = new VisualizationPanel( ... );

// Add a custom button to the toolbar
vizPanel.visualizers[0].registerToolbarItem("my-toolbar-button", () => {
  return DocumentHelper.createButton(
    // A button click event handler
    () => {
      alert("Custom toolbar button is clicked");
    },
    // Button caption
    "Button"
  );
});

// Add a custom drop-down menu to the toolbar
vizPanel.visualizers[0].registerToolbarItem("my-toolbar-dropdown", () => {
  return DocumentHelper.createSelector(
    // Menu items
    [
      { value: 1, text: "One" },
      { value: 2, text: "Two" },
      { value: 3, text: "Three" }
    ],
    // A function that specifies initial selection
    (option) => false,
    // An event handler that is executed when selection is changed
    (e) => {
      alert(e.target.value);
    }
  );
});
```

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A custom name for the toolbar item. |
| `creator` | `(toolbar?: HTMLDivElement) => HTMLElement` | A function that accepts the toolbar and should return an `HTMLElement` with the toolbar item. |
| `order` | `number` |  |

**Related APIs:** [`unregisterToolbarItem`](#unregisterToolbarItem)

### `render()`

Renders the visualizer in a specified container.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `targetElement` | `any` | An `HTMLElement` or an `id` of a page element in which you want to render the visualizer. |

### `resetState()`

Resets the visualizer's state.

> This method is overriden in classes descendant from `VisualizerBase`.

Available since: v2.3.5

**Related APIs:** [`getState`](#getState), [`setState`](#setState), [`onStateChanged`](#onStateChanged)

### `setState()`

Sets the visualizer's state.

[View Demo](https://surveyjs.io/dashboard/examples/save-dashboard-state-to-local-storage/ (linkStyle))

> This method is overriden in classes descendant from `VisualizerBase`.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `state` | `any` |  |

**Related APIs:** [`getState`](#getState), [`resetState`](#resetState), [`onStateChanged`](#onStateChanged)

### `unregisterToolbarItem()`

**Return value:** `(toolbar?: HTMLDivElement) => HTMLElement` &ndash; A function previously used to [register](#registerToolbarItem) the removed toolbar item.

Unregisters a function used to create a toolbar item. Allows you to remove a toolbar item.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A toolbar item name. |

**Related APIs:** [`registerToolbarItem`](#registerToolbarItem)

### `updateData()`

Updates visualized data.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `data` | `any` | A data array with survey results to be visualized. |

## Events

### `onAfterRender`

An event that is raised after the visualizer's content is rendered.

Parameters:

- `sender`: `VisualizerBase`\
A `VisualizerBase` instance that raised the event.

- `options.htmlElement`: `HTMLElement`\
A page element with the visualizer's content.

**Related APIs:** [`render`](#render), [`refresh`](#refresh)

### `onLocaleChanged`

An event that is raised after a new locale is set.

Parameters:

- `sender`: `VisualizerBase`\
A `VisualizerBase` instance that raised the event.

- `options.locale`: `string`\
The indentifier of a new locale (for example, "en").

**Related APIs:** [`locale`](#locale)

### `onStateChanged`

An event that is raised when the visualizer's state has changed.

The state includes selected chart types, chart layout, sorting, filtering, and other customizations that a user has made while using the dashboard. Handle the `onStateChanged` event to save these customizations, for example, in `localStorage` and restore them when the user reloads the page.

Parameters:

- `sender`: `VisualizerBase`\
A `VisualizerBase` instance that raised the event.

- `state`: `any`\
A new state of the visualizer. Includes information about the visualized elements and current locale.

[View Demo](https://surveyjs.io/dashboard/examples/save-dashboard-state-to-local-storage/ (linkStyle))

**Related APIs:** [`getState`](#getState), [`setState`](#setState)
