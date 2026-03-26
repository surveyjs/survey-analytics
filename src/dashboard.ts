import { Question, SurveyModel, Event } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { IVisualizationPanelOptions, VisualizationPanel } from "./visualizationPanel";
import { DashboardItem, IDashboardItemOptions } from "./dashboard-item";
import { VisualizerFactory } from "./visualizerFactory";
import { IVisualizerPanelElement } from "./config";

/**
 * A configuration object passed to the [`Dashboard`](https://surveyjs.io/dashboard/documentation/api-reference/dashboard) constructor.
 *
 * [Get Started with SurveyJS Dashboard](https://surveyjs.io/dashboard/documentation/get-started (linkStyle))
 *
 * [View Demo](https://surveyjs.io/dashboard/examples/interactive-survey-data-dashboard/ (linkStyle))
 */
export interface IDashboardOptions extends IVisualizationPanelOptions {
  /**
   * An array of data field names and [dashboard item configuration objects](https://surveyjs.io/dashboard/documentation/idashboarditemoptions).
   *
   * Specify this property to define dashboard items explicitly or customize items generated from the [`questions`](#questions) array. The array order determines the item order in the Dashboard.
   */
  items?: Array<string | IDashboardItemOptions>;
  /**
   * An array of survey questions to visualize.
   *
   * When specified, the Dashboard generates items automatically according to question configuration. Use the [`items`](#items) array to customize the generated items.
   */
  questions?: Question[];
  /**
   * An array of survey response objects to visualize.
   *
   * In addition to `data`, specify at least one of the following:
   *
   * - [`questions`](#questions)\
   * Dashboard items are generated automatically based on question settings.
   * - [`items`](#items)\
   * Dashboard items are defined explicitly.
   * - Both `questions` and `items`\
   * Items are generated from `questions` and then customized using `items`.
   */
  data?: any[];
}

/**
 * Visualizes survey results and provides an interactive UI for data analysis.
 *
 * [Get Started with SurveyJS Dashboard](https://surveyjs.io/dashboard/documentation/get-started (linkStyle))
 *
 * [View Demo](https://surveyjs.io/dashboard/examples/interactive-survey-data-dashboard/ (linkStyle))
 */
export class Dashboard extends VisualizationPanel<DashboardItem> {
  constructor(private readonly _options: IDashboardOptions) {
    super(_options.questions ?? [], _options?.data ?? [], _options, _options.items ?? [] as any, true, "dashboard");
  }

  protected buildVisualizer(element: DashboardItem, questions: Array<Question>) {
    const visualizerOptions = Object.assign({}, this.options);
    const dataName = element.dataField;
    if(!!element.chartType) {
      visualizerOptions[dataName] = Object.assign({},
        visualizerOptions[dataName] || {},
        {
          chartType: element.chartType,
          availableTypes: element.availableTypes
        }
      );
    }
    if(visualizerOptions.dataProvider === undefined) {
      visualizerOptions.dataProvider = this.dataProvider;
    }
    let visualizer: VisualizerBase = VisualizerFactory.createVisualizer(element, this.data, visualizerOptions);
    if(!visualizer) {
      return;
    }
    this.setupVisualizer(visualizer, element.question);
    element.visualizerInstance = visualizer;
  }

  protected createElement(element: IVisualizerPanelElement, question?: Question): DashboardItem {
    return new DashboardItem(element as any || {}, question);
  }

  /**
   * Gets an array of [dashboard items](https://surveyjs.io/dashboard/documentation/api-reference/dashboarditem).
   *
   * Each item represents a single data visualization within the Dashboard.
   */
  public get items(): DashboardItem[] {
    return this._elements;
  }
  /**
   * Returns a dashboard item with the specified `name`.
   *
   * If the [`questions`](https://surveyjs.io/dashboard/documentation/api-reference/idashboardoptions#questions) array is specified when initializing the Dashboard, item names are generated automatically based on the associated question names.
   * @param name The item identifier.
   * @returns A [`DashboardItem`](https://surveyjs.io/dashboard/documentation/api-reference/dashboarditem) instance, or `undefined` if no matching item is found.
   */
  public getItem(name: string): DashboardItem | undefined {
    return this.getElement(name) as DashboardItem;
  }
  /**
   * Adds a new item to the Dashboard.
   * @param item A [`DashboardItem`](https://surveyjs.io/dashboard/documentation/api-reference/dashboarditem) instance, [`IDashboardItemOptions`](https://surveyjs.io/dashboard/documentation/api-reference/idashboarditemoptions) object, or survey question.
   * @returns The new `DashboardItem` instance.
   */

  /**
   * Adds an item to the Dashboard.
   * @param item A [`DashboardItem`](https://surveyjs.io/dashboard/documentation/api-reference/dashboarditem) instance, an [`IDashboardItemOptions`](https://surveyjs.io/dashboard/documentation/api-reference/idashboarditemoptions) object, or a survey question used to create a new item.
   * @returns The added `DashboardItem` instance.
   */
  public addItem(item: DashboardItem | IDashboardItemOptions | Question): DashboardItem {
    let dashboardItem: DashboardItem;
    if(item instanceof DashboardItem) {
      dashboardItem = item;
    } else if("visualizerType" in item) {
      dashboardItem = new DashboardItem(item as any, item.question);
    } else if(item instanceof Question) {
      dashboardItem = new DashboardItem({} as any, item);
    }
    if(!!dashboardItem) {
      this.addElement(dashboardItem);
    }
    return dashboardItem;
  }
  /**
   * Removes an item from the Dashboard.
   *
   * @param item A [`DashboardItem`](https://surveyjs.io/dashboard/documentation/api-reference/dashboarditem) instance or the name of the item to remove.
   */
  public removeItem(item: DashboardItem | string) {
    if(!!item) {
      this.removeElement(item);
    }
  }
}
