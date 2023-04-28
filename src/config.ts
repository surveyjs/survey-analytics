/**
 * An interface that describes a visualization item (chart, gauge, etc.).
 * 
 * To access `IVisualizerPanelElement` objects, you can use the following properties and methods of `VisualizationPanel`:
 * 
 * - [`getElements()`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#getElements)
 * - [`visibleElements`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#visibleElements)
 * - [`hiddenElements`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#hiddenElements)
 */
export interface IVisualizerPanelElement {
  /**
   * The name of a survey question visualized by this item.
   */
  name: string;
  /**
   * The title of a survey question visualized by this item. The visualization item displays the same title.
   */
  displayName: string;
  /**
   * Indicates whether the visualization item is currently visible.
   * 
   * If you want to disallow users to hide visualization items, set the [`allowHideQuestions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions) property to `false`.
   */
  isVisible: boolean;
  isPublic: boolean;
  chartType?: string;
  answersOrder?: string;
  hideEmptyAnswers?: boolean;
  topN?: number;
}

export interface IState {
  locale?: string;
  elements?: IVisualizerPanelElement[];
}

export interface IPermission {
  name: string;
  isPublic: boolean;
}
