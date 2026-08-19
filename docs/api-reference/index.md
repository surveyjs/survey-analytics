---
title: Classes and Interfaces
product: Dashboard
---

# SurveyJS Dashboard API Reference

## Classes

- [`VisualizerBase`](https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase.md) — A base object for all visualizers.
- [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel.md) — Obsolete.
- [`DashboardItem`](https://surveyjs.io/dashboard/documentation/api-reference/dashboarditem.md) — Visualizes an individual dashboard item.
- [`Dashboard`](https://surveyjs.io/dashboard/documentation/api-reference/dashboard.md) — Visualizes survey results and provides an interactive UI for data analysis.
- [`VisualizationManager`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationmanager.md) — An object with methods used to register and unregister visualizers for individual question types.
- [`LayoutEngine`](https://surveyjs.io/dashboard/documentation/api-reference/layoutengine.md) — A base class used to implement custom layout engines or integrate third-party layout engines with SurveyJS Dashboard.
- [`SidebarWidget`](https://surveyjs.io/dashboard/documentation/api-reference/sidebarwidget.md) — Widget that renders a toolbar button which opens a sidebar (sliding) panel.
- [`VisualizerFactory`](https://surveyjs.io/dashboard/documentation/api-reference/visualizerfactory.md) — An object that allows you to create individual visualizers without creating a visualization panel.

## Interfaces

- [`IVisualizationPanelOptions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions.md) — Obsolete.
- [`IDashboardItemOptions`](https://surveyjs.io/dashboard/documentation/api-reference/idashboarditemoptions.md) — Defines configuration options for a dashboard item.
- [`IDashboardOptions`](https://surveyjs.io/dashboard/documentation/api-reference/idashboardoptions.md) — A configuration object passed to the `Dashboard` constructor.
- [`IPivotVisualizerOptions`](https://surveyjs.io/dashboard/documentation/api-reference/ipivotvisualizeroptions.md) — Defines configuration options for a pivot chart visualizer.
- [`ISidebarOptions`](https://surveyjs.io/dashboard/documentation/api-reference/isidebaroptions.md) — Options for the sidebar widget (toolbar button + sliding panel).
- [`IPivotSeriesOptions`](https://surveyjs.io/dashboard/documentation/api-reference/ipivotseriesoptions.md) — Defines configuration options for a pivot chart series.
- [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement.md) — An interface that describes a visualization item (chart, gauge, etc.).
