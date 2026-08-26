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

Returns the footer visualizer instance or `undefined` if the footer is not applicable.

**Related APIs:** [`hasFooter`](#hasFooter)

### `hasFooter`

**Type**: `boolean`

Indicates whether the visualizer renders a footer. Returns `true` if the question supports comments or an "Other" option.

**Related APIs:** [`hasHeader`](#hasHeader)

### `hasHeader`

**Type**: `boolean`

Indicates whether the visualizer renders a header. Returns `true` if the question defines a [`correctAnswer`](https://surveyjs.io/form-library/documentation/api-reference/question#correctAnswer).

**Related APIs:** [`hasFooter`](#hasFooter)

### `locale`

**Type**: `string`

Gets or sets the current locale.

If you want to inherit the locale from a visualized survey, assign a [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model) instance to the [`survey`](https://surveyjs.io/dashboard/documentation/api-reference/idashboardoptions#survey) option passed to the Dashboard.

If the survey is [translated into more than one language](https://surveyjs.io/form-library/examples/survey-localization/), the dashboard toolbar displays a language selection drop-down menu.

[View Demo](https://surveyjs.io/dashboard/examples/localize-survey-data-dashboard-ui/ (linkStyle))

**Related APIs:** [`onLocaleChanged`](#onLocaleChanged)

### `name`

**Type**: `string`

Returns the identifier of a visualized question.

### `showToolbar`

**Type**: `boolean`

Gets or sets whether the toolbar is visible.

Default value: `true`

### `supportSelection`

**Type**: `boolean`

Indicates whether users can select chart elements to apply cross-filtering. Controlled by the [`allowSelection`](https://surveyjs.io/dashboard/documentation/api-reference/idashboardoptions#allowSelection) option passed to the Dashboard.

### `title`

**Type**: `string`

Returns the visualizer's title.

Available since: v2.3.8

### `type`

**Type**: `string`

Returns the visualizer's type identifier.

## Methods

### `applyTheme()`

Applies a theme to the Dashboard.

Available since: v3.0.0

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `theme` | `ITheme` | An [`ITheme`](https://surveyjs.io/form-library/documentation/api-reference/itheme) object with theme settings. |
| `baseTheme` | `ITheme` | An optional [`ITheme`](https://surveyjs.io/form-library/documentation/api-reference/itheme) object used as the base theme. When specified, it is deep-merged with `theme`, and the merged result is applied. |

### `clear()`

Clears the toolbar, header, content, and footer containers and removes the license banner and visualizer wrapper from the root.

Does not remove the visualizer root element from the DOM. Use [`destroy()`](#destroy) to fully dispose of the visualizer.

### `destroy()`

Deletes the visualizer and removes its DOM elements.

**Related APIs:** [`clear`](#clear)

### `getCalculatedValues()`

**Return value:** `Promise<ICalculationResult<number>><ICalculationResult>`

Returns calculated values used for visualization. If a user applies a filter, the array is also filtered.

To access an array of source survey results, use the [`surveyData`](#surveyData) property.

### `getState()`

**Return value:** `any`

Returns an object with properties that describe the current visualizer state. The properties are different for each individual visualizer.

> This method is overriden in classes descendant from `VisualizerBase`.

**Related APIs:** [`setState`](#setState), [`resetState`](#resetState), [`onStateChanged`](#onStateChanged)

### `refresh()`

Redraws the visualizer and its content.

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
| `type` | `"button" \| "dropdown" \| "filter" \| "license"` |  |
| `index` | `number` |  |
| `groupIndex` | `number` |  |

**Related APIs:** [`unregisterToolbarItem`](#unregisterToolbarItem)

### `render()`

Renders the visualizer inside a specified container.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `targetElement` | `any` | An `HTMLElement` or the `id` of a DOM element. |
| `isRoot` | `boolean` |  |

### `resetState()`

Resets the visualizer state.

> This method is overriden in classes descendant from `VisualizerBase`.

Available since: v2.3.5

**Related APIs:** [`getState`](#getState), [`setState`](#setState), [`onStateChanged`](#onStateChanged)

### `setState()`

Sets the visualizer state.

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

Updates the visualized data.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `data` | `any` | An array of survey result objects or a data-loading function. |

## Events

### `onAfterRender`

Raised after the visualizer content is rendered.

Parameters:

- `sender`: `VisualizerBase`\
The current `VisualizerBase` instance.
- `options.htmlElement`: `HTMLElement`\
An `HTMLElement` that contains the rendered content.

**Related APIs:** [`render`](#render), [`refresh`](#refresh)

### `onLocaleChanged`

Raised after the locale changes.

Parameters:

- `sender`: `VisualizerBase`\
The current `VisualizerBase` instance.
- `options.locale`: `string`\
The indentifier of a new locale (for example, `"en"`).

**Related APIs:** [`locale`](#locale)

### `onStateChanged`

Raised when the visualizer [state](#state) changes.

The state contains user-defined settings such as selected chart type, layout, sorting, filtering, and other runtime customizations. Handle this event to persist these customizations (for example, in `localStorage`) and restore them later.

Parameters:

- `sender`: `VisualizerBase`\
The current `VisualizerBase` instance.
- `state`: `any`\
The new state of the visualizer.

[View Demo](https://surveyjs.io/dashboard/examples/save-dashboard-state-to-local-storage/ (linkStyle))
