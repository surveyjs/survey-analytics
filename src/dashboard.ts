import { Event, Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { IVisualizationPanelOptions, VisualizationPanel } from "./visualizationPanel";
import { DashboardItem, IDashboardItemOptions } from "./dashboard-item";
import { VisualizerFactory } from "./visualizerFactory";
import { IVisualizerPanelElement } from "./config";
import { DatePeriodEnum, DateRangeWidget, IDateRangeWidgetOptions } from "./utils/dateRangeWidget";
import { IDateRange } from "./utils/calculationDateRanges";
import { DateRangeModel, DateRangeTuple, IDateRangeChangedOptions } from "./utils/dateRangeModel";
import { DocumentHelper } from "./utils/documentHelper";

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
   * To populate this array, instantiate a [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model), call its [`getAllQuestions()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#getAllQuestions) method, optionally filter the result, and assign it to this property.
   *
   * When `questions` are specified, the Dashboard generates items automatically according to question configuration. Use the [`items`](#items) array to customize the generated items.
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
  /**
   * The name of a data field that contains date values used by the date panel.
   */
  dateFieldName?: string;
  /**
   * The predefined date period selected in the date panel. Applies only if [`dateFieldName`](#dateFieldName) is specified.
   *
   * Supported values:
   *
   * - `"last7days"` &ndash; Last 7 days
   * - `"last14days"` &ndash; Last 14 days
   * - `"last28days"` &ndash; Last 28 days
   * - `"last30days"` &ndash; Last 30 days
   * - `"lastWeekSun"` &ndash; Last week (starts Sunday)
   * - `"lastWeekMon"` &ndash; Last week (starts Monday)
   * - `"lastMonth"` &ndash; Last month
   * - `"lastQuarter"` &ndash; Last quarter
   * - `"lastYear"` &ndash; Last year
   * - `"ytd"` &ndash; This year to date
   * - `"mtd"` &ndash; This month to date
   * - `"wtdSun"` &ndash; This week to date (starts Sunday)
   * - `"wtdMon"` &ndash; This week to date (starts Monday)
   * - `"qtd"` &ndash; This quarter to date
   * @see availableDatePeriods
   * @see showDatePanel
   */
  datePeriod?: DatePeriodEnum;
  /**
   * An array of date periods available for selection in the date panel.
   *
   * Refer to [`datePeriod`](#datePeriod) for supported values.
   */
  availableDatePeriods?: DatePeriodEnum[];
  /**
   * A `[startDate, endDate]` tuple that defines a custom date range. Applies only if [`dateFieldName`](#dateFieldName) is specified.
   *
   * If both [`datePeriod`](#datePeriod) and `dateRange` are specified, `dateRange` takes precedence.
   */
  dateRange?: DateRangeTuple;
  /**
   * Specifies whether to display the total number of answers in the date panel. Applies only if [`dateFieldName`](#dateFieldName) is specified.
   *
   * Default value: `true`
   */
  showDatePanel?: boolean;
  showAnswerCount?: boolean;
}

/**
 * Visualizes survey results and provides an interactive UI for data analysis.
 *
 * [Get Started with SurveyJS Dashboard](https://surveyjs.io/dashboard/documentation/get-started (linkStyle))
 *
 * [View Demo](https://surveyjs.io/dashboard/examples/interactive-survey-data-dashboard/ (linkStyle))
 */
export class Dashboard extends VisualizationPanel<DashboardItem> {
  private _dateRangeWidget: DateRangeWidget;
  private _dateRangeModel: DateRangeModel;

  constructor(private readonly _options: IDashboardOptions) {
    super(_options.questions ?? [], _options?.data ?? [], _options, _options.items ?? [] as any, true, "dashboard");
    if(this._options.dateFieldName) {
      this.createDateRangeWidget();
    }
  }

  /**
   * Raised when the user changes the date range in the date panel. Handle this event to react to date filtering changes.
   *
   * Parameters:
   *
   * - `options.dateRange`: `number[]`\
   * The selected `[startDate, endDate]` range.
   * - `options.datePeriod`: `"last7days"` | `"last14days"` | `"last28days"` | `"last30days"` | `"lastWeekMon"` | `"lastWeekSun"` | `"lastMonth"` | `"lastQuarter"` | `"lastYear"` | `"ytd"` | `"mtd"` | `"wtdSun"` | `"wtdMon"` | `"qtd"`\
   * The selected predefined date period. `undefined` if the user selected a custom range.
   */
  public onDateRangeChanged = new Event<(sender: Dashboard, options: IDateRangeChangedOptions) => any, Dashboard, any>();
  public createDateRangeWidget(): void {
    const config = <IDateRangeWidgetOptions>{
      datePeriod: this._options.datePeriod,
      availableDatePeriods: this._options.availableDatePeriods,
      dateRange: this._options.dateRange,
      showAnswerCount: this._options.showAnswerCount,

      onDateRangeChanged: (dateRange: IDateRange, datePeriod: DatePeriodEnum) => {
        const options = <IDateRangeChangedOptions>{ datePeriod, dateRange };
        this.onDateRangeChanged.fire(this, options);
        this.dataProvider.setSystemFilter(this._options.dateFieldName, options.dateRange);
      }
    };
    this._dateRangeModel = new DateRangeModel(config);
    this.dataProvider.setSystemFilter(this._options.dateFieldName, this._dateRangeModel.currentDateRange);
    if(this._options.showDatePanel !== false) {
      this._dateRangeWidget = new DateRangeWidget(this._dateRangeModel, config);
      this.dataProvider.getCount().then(count => this._dateRangeWidget.updateAnswersCount(count));
    }
  }

  protected onDataChanged(): void {
    super.onDataChanged();
    if(this._dateRangeWidget) {
      this.dataProvider.getCount().then(count => this._dateRangeWidget.updateAnswersCount(count));
    }
  }

  protected renderToolbar(container: HTMLElement) {
    super.renderToolbar(container);

    if(this.showToolbar && this._dateRangeWidget) {
      const divider = DocumentHelper.createElement("div", "sa-horizontal-divider");
      const line = DocumentHelper.createElement("div", "sa-line");
      divider.appendChild(line);
      container.appendChild(divider);

      const dateRangeWidgetElement = this._dateRangeWidget.render();
      container.appendChild(dateRangeWidgetElement);
    }
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
    } else {
      dashboardItem = new DashboardItem(item as IDashboardItemOptions);
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

  public destroy() {
    super.destroy();
    this._dateRangeWidget?.destroy();
  }
}
