---
title: IVisualizationPanelOptions
product: Dashboard
api-type: interface
description: Visualization Panel configuration.
source: https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions
---

# `IVisualizationPanelOptions`

Visualization Panel configuration. Pass it as the third argument to the [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel) constructor:

```js
import { VisualizationPanel } from "survey-analytics";

const vizPanel = new VisualizationPanel(
  surveyQuestions,
  surveyResults,
  vizPanelOptions
);
```

[View Demo](https://surveyjs.io/dashboard/examples/interactive-survey-data-dashboard/ (linkStyle))

## Properties

### `allowChangeVisualizerType`

**Type**: `boolean`

Allows users to switch between different visualizer types.

Default value: `true`

Available since: v2.3.8

### `allowDragDrop`

**Type**: `boolean`

Specifies whether users can drag and drop charts. Applies only if [`allowDynamicLayout`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowDynamicLayout) is `true`.

Default value: `true`

**Related APIs:** [`layoutEngine`](#layoutEngine)

### `allowDynamicLayout`

**Type**: `boolean`

Specifies whether to arrange charts based on the available screen space and allow users to reorder them via drag and drop.

If this property is disabled, charts are displayed one under another, and users cannot drag and drop them. If you want to disable only drag and drop, set the [`allowDragDrop`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowDynamicLayout) property to `false`.

Default value: `true`

[How to Disable the Layout Engine](https://github.com/surveyjs/surveyjs-howtos-and-troubleshooting/blob/50a2f6f755193afb4733435e2942f80c98731e84/categories/data-visualization/custom-layout.md (linkStyle))

**Related APIs:** [`layoutEngine`](#layoutEngine)

### `allowHideEmptyAnswers`

**Type**: `boolean`

Allows users to hide answers with zero count in [bar charts](https://surveyjs.io/dashboard/documentation/chart-types#bar-chart), [histograms](https://surveyjs.io/dashboard/documentation/chart-types#histogram), and [statistics tables](https://surveyjs.io/dashboard/documentation/chart-types#statistics-table).

This property adds a Hide Empty Answers button to each supported visualizer.

Default value: `false`

### `allowHideQuestions`

**Type**: `boolean`

Allows users to change the visibility of individual charts.

This property adds a Hide button to each chart.

Default value: `true`

### `allowSelection`

**Type**: `boolean`

Allows users to cross-filter charts. The filter applies when users select a series point.

Default value: `true`

### `allowShowMissingAnswers`

**Type**: `boolean`

Allows users to show the number of respondents who did not answer a particular question.

This property adds a Show Missing Answers button to each chart.

Default value: `false`

### `allowShowPercentages`

**Type**: `boolean`

Allows users to switch between absolute and percentage values in bar charts.

This property adds a Show Percentages button to each bar chart.

Default value: `false`

**Related APIs:** [`showPercentages`](#showPercentages), [`showOnlyPercentages`](#showOnlyPercentages), [`percentagePrecision`](#percentagePrecision)

### `allowSortAnswers`

**Type**: `boolean`

Allows users to sort answers by answer count. Applies only to [bar charts](https://surveyjs.io/dashboard/documentation/chart-types#bar-chart), [histograms](https://surveyjs.io/dashboard/documentation/chart-types#histogram), and [statistics tables](https://surveyjs.io/dashboard/documentation/chart-types#statistics-table).

This property adds a Sorting dropdown to each supported visualizer.

Default value: `true`

**Related APIs:** [`answersOrder`](#answersOrder)

### `allowTopNAnswers`

**Type**: `boolean`

Allows users to select whether to show top 5, 10, or 20 answers by answer count.

This property adds a Top N Answers dropdown to each chart.

Default value: `false`

### `allowTransposeData`

**Type**: `boolean`

Allows users to transpose a visualized matrix question.

This property adds a Transpose button to charts that visualize matrixes. When users select Per Values, matrix rows go to chart arguments and matrix columns form chart series. When users select Per Columns, matrix rows form chart series and matrix columns go to chart arguments.

Default value: `false`

### `answersOrder`

**Type**: `"default" | "asc" | "desc"`

Specifies how to sort answers in [bar charts](https://surveyjs.io/dashboard/documentation/chart-types#bar-chart), [histograms](https://surveyjs.io/dashboard/documentation/chart-types#histogram), and [statistics tables](https://surveyjs.io/dashboard/documentation/chart-types#statistics-table).

Accepted values:

- `"default"` (default) - Do not sort answers.
- `"asc"` - Sort answers by ascending answer count.
- `"desc"` - Sort answers by descending answer count.

Users can change this property value if you enable the `allowSortAnswers` property.

**Related APIs:** [`allowSortAnswers`](#allowSortAnswers)

### `dataProvider`

**Type**: `DataProvider`

A common data provider for all visualizers.

### `defaultChartType`

**Type**: `string`

Default chart type.

Accepted values depend on the question type as follows:

- Boolean: `"bar"` | `"vbar"` | `"pie"` | `"doughnut"`
- Date, Number: `"bar"` | `"vbar"`
- Matrix: `"bar"` | `"vbar"` | `"pie"` | `"doughnut"` | `"stackedbar"`
- Rating: `"bar"` | `"vbar"` | `"gauge"` | `"bullet"`
- Radiogroup, Checkbox, Dropdown, Image Picker: `"bar"` | `"vbar"` | `"pie"` | `"doughnut"`
- Ranking: `"bar"` | `"vbar"` | `"pie"` | `"doughnut" | `"radar"`

To set a type for an individual chart, access this chart in the `visualizers` array or using the [`getVisualizer(questionName)`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#getVisualizer) method and set its `chartType` property to one of the values described above:

```js
const vizPanel = new SurveyAnalytics.VisualizationPanel( ... );
vizPanel.visualizers[0].chartType = "stackedbar";
// --- or ---
vizPanel.getVisualizer("my-question").chartType = "stackedbar";
```

### `hideEmptyAnswers`

**Type**: `boolean`

Hides answers with zero count in [bar charts](https://surveyjs.io/dashboard/documentation/chart-types#bar-chart), [histograms](https://surveyjs.io/dashboard/documentation/chart-types#histogram), and [statistics tables](https://surveyjs.io/dashboard/documentation/chart-types#statistics-table).

Users can change this property value if you enable the `allowHideEmptyAnswers` property.

Default value: `false`

**Related APIs:** [`allowHideEmptyAnswers`](#allowHideEmptyAnswers)

### `labelTruncateLength`

**Type**: `number`

The number of label characters after which truncation starts.

Set this property to -1 to disable truncation.

Default value: 27

### `layoutEngine`

**Type**: `LayoutEngine`

A layout engine used to arrange charts on the Visualization Panel.

You can use this property to integrate a third-party layout engine with SurveyJS Dashboard.

**Related APIs:** [`allowDynamicLayout`](#allowDynamicLayout)

### `percentagePrecision`

**Type**: `number`

Specifies percentage precision.

Default value: 2

**Related APIs:** [`allowShowPercentages`](#allowShowPercentages), [`showPercentages`](#showPercentages), [`showOnlyPercentages`](#showOnlyPercentages)

### `showOnlyPercentages`

**Type**: `boolean`

Specifies whether bar charts display only percentages, without absolute values.

Applies only if the `allowShowPercentages` or `showPercentages` property is enabled.

Default value: `false`

**Related APIs:** [`allowShowPercentages`](#allowShowPercentages), [`showPercentages`](#showPercentages), [`percentagePrecision`](#percentagePrecision)

### `showPercentages`

**Type**: `boolean`

Specifies whether bar charts display percentages in addition to absolute values.

Users can change this property value if you enable the `allowShowPercentages` property.

Default value: `false`

**Related APIs:** [`allowShowPercentages`](#allowShowPercentages), [`showOnlyPercentages`](#showOnlyPercentages), [`percentagePrecision`](#percentagePrecision)

### `stripHtmlFromTitles`

**Type**: `boolean`

Removes HTML tags from survey element titles.

Survey element titles can contain HTML markup and are specified by users. An attacker can inject malicious code into the titles. To guard against it, keep this property set to `true`.

Default value: `true`

### `survey`

**Type**: `SurveyModel`

Pass a survey instance to use survey locales in the Visualization Panel.

[View Demo](https://surveyjs.io/dashboard/examples/localize-survey-data-dashboard-ui/ (linkStyle))
