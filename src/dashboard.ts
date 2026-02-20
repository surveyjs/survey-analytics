import { Question, SurveyModel, Event } from "survey-core";
import { IVisualizerOptions, ToolbarItemType, VisualizerBase } from "./visualizerBase";
import { IVisualizationPanelOptions, VisualizationPanel } from "./visualizationPanel";
import { DataProvider, GetDataFn } from "./dataProvider";
import { createVisualizerDescription, IVisualizerDescription } from "./visualizerDescription";
import { LayoutEngine } from "./layout-engine";
import { IDashboardTheme } from "./theme";
import { IState } from "./config";
import { DatePeriodEnum, DateRangeTuple, IDateRangeChangedOptions } from "./utils/dateRangeModel";

/**
 * A configuration object passed to the [`Dashboard`](https://surveyjs.io/dashboard/documentation/api-reference/dashboard) constructor.
 *
 * [Get Started with SurveyJS Dashboard](https://surveyjs.io/dashboard/documentation/get-started (linkStyle))
 *
 * [View Demo](https://surveyjs.io/dashboard/examples/interactive-survey-data-dashboard/ (linkStyle))
 */
export interface IDashboardOptions {
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
   * An array of survey questions to visualize.
   *
   * When specified, the Dashboard generates items automatically according to question configuration. Use the `items` array to customize the generated items.
   */
  questions?: Question[];
  /**
   * An array of data field names and/or [dashboard item configuration objects](/dashboard/documentation/idashboarditemoptions).
   *
   * Specify this property to define dashboard items explicitly or customize items generated from the [`questions`](#questions) array. The array order determines the item order in the Dashboard.
   */
  visualizers?: Array<string | IVisualizerOptions>;

  /**
   * A survey instance used to apply survey localization settings to the Dashboard UI.
   *
   * [View Demo](https://surveyjs.io/dashboard/examples/localize-survey-data-dashboard-ui/ (linkStyle))
   */
  survey?: SurveyModel;
  dataProvider?: DataProvider;
  /**
   * Enables users to hide individual dashboard items. Adds a **Hide** button to each item.
   *
   * Default value: `true`
   */
  allowHideQuestions?: boolean;
  /**
   * Enables automatic layout based on available screen space and allows users to reorder items via drag and drop.
   *
   * If disabled, items are rendered sequentially (one below another), and drag-and-drop reordering is disabled. To disable only drag-and-drop while keeping dynamic layout, set [`allowDragDrop`](#allowDragDrop) to `false`.
   *
   * Default value: `true`
   *
   * [How to Disable the Layout Engine](https://github.com/surveyjs/surveyjs-howtos-and-troubleshooting/blob/50a2f6f755193afb4733435e2942f80c98731e84/categories/data-visualization/custom-layout.md (linkStyle))
   * @see layoutEngine
   */
  allowDynamicLayout?: boolean;
  /**
   * Enables drag-and-drop reordering of dashboard items. Applies only if [`allowDynamicLayout`](#allowDynamicLayout) is `true`.
   *
   * Default value: `true`
   * @see layoutEngine
   */
  allowDragDrop?: boolean;
  /**
   * A layout engine implementation used to arrange dashboard items. Use this property to integrate a third-party layout engine.
   * @see allowDynamicLayout
   */
  layoutEngine?: LayoutEngine;
  /**
   * Removes HTML markup from survey element titles before rendering.
   *
   * Since survey titles may contain user-defined HTML, keeping this property enabled helps prevent potential injection of malicious code.
   *
   * Default value: `true`
   */
  stripHtmlFromTitles?: boolean;
  /**
   * Default chart legend position.
   *
   * You can override this setting per dashboard item using the [`items`](#visualizers) array.
   */
  legendPosition?: "left" | "right" | "top" | "bottom";
  /**
   * Specifies whether to display the toolbar.
   *
   * Default value: `true`
   */
  showToolbar?: boolean;
  /**
   * The name of a data field that contains date values used by the date panel.
   */
  dateFieldName?: string;
  /**
   * The predefined date period selected in the date panel. Applies only if [`dateFieldName`](#dateFieldName) is specified.
   *
   * Supported values:
   *
   * - `"last7days"`
   * - `"last14days"`
   * - `"last28days"`
   * - `"last30days"`
   * - `"lastWeekMon"`
   * - `"lastWeekSun"`
   * - `"lastMonth"`
   * - `"lastQuarter"`
   * - `"lastYear"`
   * - `"ytd"`
   * - `"mtd"`
   * - `"wtdSun"`
   * - `"wtdMon"`
   * - `"qtd"`
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
  showAnswerCount?: boolean;
  /**
   * Specifies whether to display the date panel. Applies if [`dateFieldName`](#dateFieldName) is specified.
   *
   * Default value: `true`
   */
  showDatePanel?: boolean;
  /**
   * Maximum label length before truncation starts. Set to `-1` to disable truncation.
   *
   * Default value: `27`
   */
  labelTruncateLength?: number;
  /**
   * Allows users to toggle between absolute values and percentages in bar charts. Adds a **Show Percentages** button to each bar chart.
   *
   * Default value: `false`
   * @see showPercentages
   * @see showOnlyPercentages
   * @see percentagePrecision
   */
  allowShowPercentages?: boolean;
  /**
   * Displays percentages alongside absolute values in bar charts.
   *
   * Default value: `false`
   *
   * Users can modify this setting in the UI if [`allowShowPercentages`](#allowShowPercentages) is enabled.
   * @see showOnlyPercentages
   * @see percentagePrecision
   */
  showPercentages?: boolean;
  /**
   * Displays only percentages (without absolute values) in bar charts. Applies only if [`allowShowPercentages`](#allowShowPercentages) or [`showPercentages`](#showPercentages) is enabled.
   *
   * Default value: `false`
   * @see allowShowPercentages
   * @see showPercentages
   * @see percentagePrecision
   */
  showOnlyPercentages?: boolean;
  /**
   * Number of decimal places used when displaying percentages.
   *
   * Default value: `2`
   * @see allowShowPercentages
   * @see showPercentages
   * @see showOnlyPercentages
   */
  percentagePrecision?: number;
  /**
   * Enables sorting answers by response count in [bar charts](https://surveyjs.io/dashboard/documentation/chart-types#bar-chart), [histograms](https://surveyjs.io/dashboard/documentation/chart-types#histogram), and [statistics tables](https://surveyjs.io/dashboard/documentation/chart-types#statistics-table). Adds a **Sorting** dropdown to each supported visualizer.
   *
   * Default value: `true`
   * @see answersOrder
   */
  allowSortAnswers?: boolean;
  /**
   * Specifies the answer sorting order in [bar charts](https://surveyjs.io/dashboard/documentation/chart-types#bar-chart), [histograms](https://surveyjs.io/dashboard/documentation/chart-types#histogram), and [statistics tables](https://surveyjs.io/dashboard/documentation/chart-types#statistics-table)
   *
   * Accepted values:
   *
   * - `"default"` (default) &ndash; Preserve original order.
   * - `"asc"` &ndash; Sort by ascending response count.
   * - `"desc"` &ndash; Sort by descending response count.
   *
   * Users can modify this setting in the UI if [`allowSortAnswers`](#allowSortAnswers) is enabled.
   */
  answersOrder?: "default" | "asc" | "desc";
  /**
   * Enables hiding answers with zero responses in [bar charts](https://surveyjs.io/dashboard/documentation/chart-types#bar-chart), [histograms](https://surveyjs.io/dashboard/documentation/chart-types#histogram), and [statistics tables](https://surveyjs.io/dashboard/documentation/chart-types#statistics-table). Adds a **Hide Empty Answers** button to each supported visualizer.
   *
   * Default value: `false`
   */
  allowHideEmptyAnswers?: boolean;
  /**
   * Hides answers with zero responses in [bar charts](https://surveyjs.io/dashboard/documentation/chart-types#bar-chart), [histograms](https://surveyjs.io/dashboard/documentation/chart-types#histogram), and [statistics tables](https://surveyjs.io/dashboard/documentation/chart-types#statistics-table).
   *
   * Default value: `false`
   *
   * Users can modify this setting in the UI if [`allowHideEmptyAnswers`](#allowHideEmptyAnswers) is enabled.
   */
  hideEmptyAnswers?: boolean;
  /**
   * Enables selection of top 5, 10, or 20 answers by response count. Adds a **Top N Answers** dropdown to each chart.
   *
   * Default value: `false`
   */
  allowTopNAnswers?: boolean;
  /**
   * Enables displaying the number of respondents who skipped a question. Adds a **Show Missing Answers** button to each chart.
   *
   * Default value: `false`
   */
  allowShowMissingAnswers?: boolean;
  /**
   * Enables transposing data for matrix question visualizations.
   *
   * Adds a **Transpose** button to supported charts.
   *
   * - **Per Values** &ndash; Matrix rows become chart arguments, columns become series.
   * - **Per Columns** &ndash; Matrix rows become series, columns become arguments.
   *
   * Default value: `false`
   */
  allowTransposeData?: boolean;
  /**
   * Enables cross-filtering between visualizers. When enabled, selecting a data point filters other visualizers accordingly.
   *
   * Default value: `true`
   */
  allowSelection?: boolean;
  /**
   * Enables switching between different visualizer types.
   *
   * Default value: `true`
   */
  allowChangeVisualizerType?: boolean;
}

export function getVisualizerDescriptions(visualizers: Array<string | IVisualizerOptions>, questions: Question[] = []): Array<Question | IVisualizerDescription> {
  if(!visualizers || visualizers.length === 0) {
    return questions;
  }

  const items: Array<Question | IVisualizerDescription> = [];
  for(const v of visualizers) {
    if(typeof v === "string") {
      const q = questions.find((q) => q.name === v || q.valueName === v);
      if(q) {
        items.push(q);
      } else {
        // If no matching question is found, create a simple visualizer description
        // or throw an error?
      }
    } else if(!!v && typeof v === "object") {
      const question = questions.filter(q => q.name === v.dataField)[0];
      const vd = createVisualizerDescription(v, question);
      items.push(vd);
    }
  }

  return items;
}

/**
 * Visualizes survey results and provides an interactive UI for data analysis.
 *
 * [View Demo](https://surveyjs.io/dashboard/examples/interactive-survey-data-dashboard/ (linkStyle))
 */
export class Dashboard extends VisualizerBase {
  private readonly _options: IVisualizationPanelOptions;
  private _panel: VisualizationPanel;
  private _data: any[];
  private _questions: Question[];
  private _visualizers: any;

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

  constructor(options: IDashboardOptions) {
    super(null, options?.data ?? [], {}, "dashboard");

    this._data = options.data ?? [];
    this._questions = options.questions ?? [];
    this._visualizers = options.visualizers ?? [];

    this._options = {
      ...options
    };
    delete (this._options as any).data;
    delete (this._options as any).questions;
    delete (this._options as any).visualizers;

    const visualizerDescriptions = getVisualizerDescriptions(
      this._visualizers,
      this._questions,
    );

    this._panel = new VisualizationPanel(visualizerDescriptions, this._data, this._options);
    this._panel.onStateChanged.add((sender, options) => {
      this.onStateChanged.fire(this, options);
    });
    this._panel.onDateRangeChanged.add((sender, options) => {
      this.onDateRangeChanged.fire(this, options);
    });
    this._panel.showToolbar = options.showToolbar ?? true;
  }

  public registerToolbarItem(
    name: string,
    creator: (toolbar?: HTMLDivElement) => HTMLElement,
    type: ToolbarItemType,
    index: number = 100,
    groupIndex: number = 0
  ): void {
    this._panel.registerToolbarItem(name, creator, type, index, groupIndex);
  }

  /**
   * Gets or sets the Dashboard state.
   *
   * The state includes configuration of dashboard items and the current locale.
   *
   * [View Demo](https://surveyjs.io/dashboard/examples/save-dashboard-state-to-local-storage/ (linkStyle))
   * @see onStateChanged
   */
  public get state(): IState {
    return this.panel.getState();
  }
  public set state(newState: IState) {
    this.panel.state = newState;
  }

  public get locale(): string {
    return this.panel.locale;
  }
  public set locale(newLocale: string) {
    this.panel.locale = newLocale;
  }

  get panel(): VisualizationPanel {
    return this._panel;
  }

  public render(targetElement: HTMLElement | string, isRoot = true) {
    this._panel.render(targetElement, true);
  }

  updateData(data: Array<{ [index: string]: any }> | GetDataFn): void {
    this._panel.updateData(data);
  }

  /**
   * Applies a theme to the Dashboard.
   * @param theme An `IDashboardTheme` object that defines visual settings.
   */
  public applyTheme(theme: IDashboardTheme): void {
    this._panel.applyTheme(theme);
  }

  destroy(): void {
    this._panel.destroy();
    super.destroy();
  }
}
