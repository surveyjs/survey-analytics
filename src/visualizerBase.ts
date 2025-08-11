import { Question, QuestionCommentModel, Event, settings } from "survey-core";
import { DataProvider, GetDataFn } from "./dataProvider";
import { VisualizerFactory } from "./visualizerFactory";
import { VisualizationManager } from "./visualizationManager";
import { DocumentHelper, createLoadingIndicator } from "./utils";
import { localization } from "./localizationManager";
import { defaultStatisticsCalculator } from "./statisticCalculators";
import { DashboardTheme, IDashboardTheme } from "./theme";

import "./visualizerBase.scss";

export interface IChartAdapter {
  getChartTypes(): string[];
  create(chartNode: HTMLElement): Promise<any>;
  update(chartNode: HTMLElement): Promise<any> ;
  destroy(node: HTMLElement): void;
}

export interface IDataInfo {
  name: string; // TODO - remove from this interface
  dataNames: Array<string>;
  getValues(): Array<any>;
  getLabels(): Array<string>;
  getSeriesValues(): Array<string>;
  getSeriesLabels(): Array<string>;
}

type ToolbarItemType = "button" | "dropdown" | "filter"| "license";

type ToolbarItemCreators = {
  [name: string]: {
    creator: (toolbar?: HTMLDivElement) => HTMLElement,
    type: ToolbarItemType,
    index: number,
    groupIndex: number,
  },
};

export class PostponeHelper {
  public static postponeFunction: (fn: () => void, timeout?: number) => any;
  public static postpone(fn: () => void, timeout?: number): any {
    if(PostponeHelper.postponeFunction) {
      return PostponeHelper.postponeFunction(fn, timeout);
    } else {
      return setTimeout(fn, timeout);
    }
  }
}

/**
 * A base object for all visualizers. Use it to implement a custom visualizer.
 *
 * Constructor parameters:
 *
 * - `question`: [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question)\
 * A survey question to visualize.
 * - `data`: `Array<any>`\
 * Survey results.
 * - `options`\
 * An object with the following properties:
 *    - `dataProvider`: `DataProvider`\
 *    A data provider for this visualizer.
 *    - `renderContent`: `(contentContainer: HTMLElement, visualizer: VisualizerBase) => void`\
 *    A function that renders the visualizer's HTML markup. Append the markup to `contentContainer`.
 *    - `survey`: [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model)\
 *    Pass a `SurveyModel` instance if you want to use locales from the survey JSON schema.
 *    - `seriesValues`: `Array<string>`\
 *    Series values used to group data.
 *    - `seriesLabels`: `Array<string>`\
 *    Series labels to display. If this property is not set, `seriesValues` are used as labels.
 * - `type`: `string`\
 * *(Optional)* The visualizer's type.
 *
 * [View Demo](https://surveyjs.io/dashboard/examples/how-to-plot-survey-data-in-custom-bar-chart/ (linkStyle))
 */
export class VisualizerBase implements IDataInfo {
  public static suppressVisualizerStubRendering: boolean = false;
  public static chartAdapterType: any = undefined;

  private _appliedTheme: DashboardTheme;
  private _theme = new DashboardTheme();
  private _showToolbar = true;
  private _footerVisualizer: VisualizerBase = undefined;
  private _dataProvider: DataProvider = undefined;
  private _getDataCore: (dataInfo: IDataInfo) => number[][] = undefined
  public labelTruncateLength: number = 27;
  protected renderResult: HTMLElement = undefined;
  protected toolbarContainer: HTMLElement = undefined;
  protected headerContainer: HTMLElement = undefined;
  protected contentContainer: HTMLElement = undefined;
  protected footerContainer: HTMLElement = undefined;
  protected _supportSelection: boolean = false;
  protected _chartAdapter: IChartAdapter = undefined;
  // public static otherCommentQuestionType = "comment"; // TODO: make it configureable - allow choose what kind of question/visualizer will be used for comments/others
  public static otherCommentCollapsed = true;

  /**
   * An event that is raised after the visualizer's content is rendered.
   *
   * Parameters:
   *
   * - `sender`: `VisualizerBase`\
   * A `VisualizerBase` instance that raised the event.
   *
   * - `options.htmlElement`: `HTMLElement`\
   * A page element with the visualizer's content.
   * @see render
   * @see refresh
   **/
  public onAfterRender: Event<
    (sender: VisualizerBase, options: any) => any,
    VisualizerBase,
    any
  > = new Event<(sender: VisualizerBase, options: any) => any, VisualizerBase, any>();

  protected afterRender(contentContainer: HTMLElement) {
    this.onAfterRender.fire(this, { htmlElement: contentContainer });
  }

  /**
   * An event that is raised after a new locale is set.
   *
   * Parameters:
   *
   * - `sender`: `VisualizerBase`\
   * A `VisualizerBase` instance that raised the event.
   *
   * - `options.locale`: `string`\
   * The indentifier of a new locale (for example, "en").
   * @see locale
   */
  public onLocaleChanged = new Event<
    (sender: VisualizerBase, options: { locale: string }) => any,
    VisualizerBase,
    any
  >();

  // public onStateChanged = new Event<
  //   (sender: VisualizationPanel, state: IState) => any,
  //   VisualizationPanel,
  //   any
  // >();
  /**
   * An event that is raised when the visualizer's state has changed.
   *
   * The state includes selected chart types, chart layout, sorting, filtering, and other customizations that a user has made while using the dashboard. Handle the `onStateChanged` event to save these customizations, for example, in `localStorage` and restore them when the user reloads the page.
   *
   * Parameters:
   *
   * - `sender`: `VisualizerBase`\
   * A `VisualizerBase` instance that raised the event.
   *
   * - `state`: `any`\
   * A new state of the visualizer. Includes information about the visualized elements and current locale.
   *
   * [View Demo](https://surveyjs.io/dashboard/examples/save-dashboard-state-to-local-storage/ (linkStyle))
   * @see getState
   * @see setState
   */
  public onStateChanged: Event<
    (sender: VisualizerBase, options: any) => any,
    VisualizerBase,
    any
  > = new Event<(sender: VisualizerBase, options: any) => any, VisualizerBase, any>();

  protected stateChanged(name: string, value: any): void {
    if(this._settingState) {
      return;
    }
    this.onStateChanged.fire(this, this.getState());
  }

  protected toolbarItemCreators: ToolbarItemCreators = {};

  public onGetToolbarItemCreators: () => ToolbarItemCreators;

  protected getToolbarItemCreators(): ToolbarItemCreators {
    return Object.assign({}, this.toolbarItemCreators, this.onGetToolbarItemCreators && this.onGetToolbarItemCreators() || {});
  }

  constructor(
    public question: Question,
    data: Array<{ [index: string]: any }> | GetDataFn,
    public options: { [index: string]: any } = {},
    private _type?: string
  ) {
    this._getDataCore = this.questionOptions?.getDataCore;
    this._dataProvider = options.dataProvider || new DataProvider(data);
    this._dataProvider.onDataChanged.add(() => this.onDataChanged());
    this.loadingData = !!this._dataProvider.dataFn;

    if (typeof options.labelTruncateLength !== "undefined") {
      this.labelTruncateLength = options.labelTruncateLength;
    }
  }

  protected get questionOptions() {
    return this.options[this.question?.name];
  }

  protected onDataChanged(): void {
    this._calculationsCache = undefined;
    this.loadingData = !!this._dataProvider.dataFn;
    this.refresh();
  }

  /**
   * Returns the identifier of a visualized question.
   */
  get name(): string {
    return this.question.valueName || this.question.name;
  }

  get dataNames(): Array<string> {
    return [this.name];
  }

  /**
   * Indicates whether the visualizer displays a header. This property is `true` when a visualized question has a correct answer.
   * @see hasFooter
   */
  get hasHeader(): boolean {
    if (!this.options || !this.options.showCorrectAnswers) {
      return false;
    }
    return !!this.question && !!this.question.correctAnswer;
  }

  /**
   * Indicates whether the visualizer displays a footer. This property is `true` when a visualized question has a comment.
   * @see hasHeader
   */
  get hasFooter(): boolean {
    return (
      !!this.question && (this.question.hasComment || this.question.hasOther)
    );
  }

  protected createVisualizer<T = VisualizerBase>(question: Question, options?: { [index: string]: any }, data?: any[]): T {
    let visualizerOptions = Object.assign({}, options || this.options);
    if (visualizerOptions.dataProvider === undefined) {
      visualizerOptions.dataProvider = this.dataProvider;
    }
    return VisualizerFactory.createVisualizer(question, data || this.data, visualizerOptions) as T;
  }

  /**
   * Allows you to access the footer visualizer. Returns `undefined` if the footer is absent.
   * @see hasFooter
   */
  get footerVisualizer(): VisualizerBase {
    if (!this.hasFooter) {
      return undefined;
    }
    if (!this._footerVisualizer) {
      const question = new QuestionCommentModel(
        this.question.name + (settings || {}).commentPrefix
      );
      question.title = this.processText(this.question.title);

      let visualizerOptions = Object.assign({}, this.options);
      visualizerOptions.renderContent = undefined;
      this._footerVisualizer = this.createVisualizer(question, visualizerOptions);
      if(!!this._footerVisualizer) {
        this._footerVisualizer.onUpdate = () => this.invokeOnUpdate();
      }
    }
    return this._footerVisualizer;
  }

  /**
   * Indicates whether users can select series points to cross-filter charts. To allow or disallow selection, set the [`allowSelection`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowSelection) property of the `IVisualizationPanelOptions` object in the [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel) constructor.
   */
  public get supportSelection(): boolean {
    return (
      (this.options.allowSelection === undefined ||
        this.options.allowSelection) &&
      this._supportSelection
    );
  }

  public getSeriesValues(): Array<string> {
    return this.options.seriesValues || [];
  }

  public getSeriesLabels(): Array<string> {
    return this.options.seriesLabels || this.getSeriesValues();
  }

  public getValues(): Array<any> {
    throw new Error("Method not implemented.");
  }

  public getLabels(): Array<string> {
    return this.getValues();
  }

  /**
   * Registers a function used to create a toolbar item for this visualizer.
   *
   * The following code shows how to add a custom button and drop-down menu to the toolbar:
   *
   * ```js
   * import { VisualizationPanel, DocumentHelper } from "survey-analytics";
   *
   * const vizPanel = new VisualizationPanel( ... );
   *
   * // Add a custom button to the toolbar
   * vizPanel.visualizers[0].registerToolbarItem("my-toolbar-button", () => {
   *   return DocumentHelper.createButton(
   *     // A button click event handler
   *     () => {
   *       alert("Custom toolbar button is clicked");
   *     },
   *     // Button caption
   *     "Button"
   *   );
   * });
   *
   * // Add a custom drop-down menu to the toolbar
   * vizPanel.visualizers[0].registerToolbarItem("my-toolbar-dropdown", () => {
   *   return DocumentHelper.createSelector(
   *     // Menu items
   *     [
   *       { value: 1, text: "One" },
   *       { value: 2, text: "Two" },
   *       { value: 3, text: "Three" }
   *     ],
   *     // A function that specifies initial selection
   *     (option) => false,
   *     // An event handler that is executed when selection is changed
   *     (e) => {
   *       alert(e.target.value);
   *     }
   *   );
   * });
   * ```
   * @param name A custom name for the toolbar item.
   * @param creator A function that accepts the toolbar and should return an `HTMLElement` with the toolbar item.
   * @see unregisterToolbarItem
   */
  public registerToolbarItem(
    name: string,
    creator: (toolbar?: HTMLDivElement) => HTMLElement,
    type: ToolbarItemType,
    index: number = 100,
    groupIndex: number = 0
  ): void {
    this.toolbarItemCreators[name] = { creator, type, index, groupIndex };
  }

  /**
   *
   * Unregisters a function used to create a toolbar item. Allows you to remove a toolbar item.
   * @param name A toolbar item name.
   * @returns A function previously used to [register](#registerToolbarItem) the removed toolbar item.
   * @see registerToolbarItem
   */
  public unregisterToolbarItem(
    name: string
  ): (toolbar?: HTMLDivElement) => HTMLElement {
    if(this.toolbarItemCreators[name] !== undefined) {
      const creator = this.toolbarItemCreators[name].creator;
      delete this.toolbarItemCreators[name];
      return creator;
    }
    return undefined;
  }

  /**
   * Returns the visualizer's type.
   */
  public get type() {
    return this._type || "visualizer";
  }

  /**
   * @deprecated Use [`surveyData`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#surveyData) instead.
   */
  protected get data() {
    return this.dataProvider.filteredData;
  }

  /**
   * Returns an array of survey results used to calculate values for visualization. If a user applies a filter, the array is also filtered.
   *
   * To get an array of calculated and visualized values, call the [`getCalculatedValues()`](https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase#getCalculatedValues) method.
   */
  protected get surveyData() {
    return this.dataProvider.filteredData;
  }

  protected get dataProvider(): DataProvider {
    return this._dataProvider;
  }

  /**
   * Updates visualized data.
   * @param data A data array with survey results to be visualized.
   */
  updateData(data: Array<{ [index: string]: any }>) {
    if (!this.options.dataProvider) {
      this.dataProvider.data = data;
    }
    if (this.hasFooter) {
      this.footerVisualizer.updateData(data);
    }
  }

  onUpdate: () => void;

  invokeOnUpdate() {
    this.onUpdate && this.onUpdate();
  }

  /**
   * Deletes the visualizer and all its elements from the DOM.
   * @see clear
   */
  destroy() {
    if (!!this.renderResult) {
      this.clear();
      this.toolbarContainer = undefined;
      this.headerContainer = undefined;
      this.contentContainer = undefined;
      this.footerContainer = undefined;
      this.renderResult.innerHTML = "";
      this.renderResult = undefined;
    }
    if (!!this._footerVisualizer) {
      this._footerVisualizer.destroy();
      this._footerVisualizer.onUpdate = undefined;
      this._footerVisualizer = undefined;
    }
  }

  /**
   * Empties the toolbar, header, footer, and content containers.
   *
   * If you want to empty and delete the visualizer and all its elements from the DOM, call the [`destroy()`](https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase#destroy) method instead.
   */
  public clear() {
    if (!!this.toolbarContainer) {
      this.destroyToolbar(this.toolbarContainer);
    }
    if (!!this.headerContainer) {
      this.destroyHeader(this.headerContainer);
    }
    if (!!this.contentContainer) {
      this.destroyContent(this.contentContainer);
    }
    if (!!this.footerContainer) {
      this.destroyFooter(this.footerContainer);
    }
  }

  public getSortedToolbarItemCreators(): Array<any> {
    const toolbarItemCreators = this.getToolbarItemCreators();

    const groupedItems: { [type: string]: Array<{ name: string, creator: (toolbar?: HTMLDivElement) => HTMLElement, type: ToolbarItemType, index: number, groupIndex: number }> } = {};

    Object.keys(toolbarItemCreators).forEach((toolbarItemName) => {
      const item = toolbarItemCreators[toolbarItemName];
      const type = item.type;

      if (!groupedItems[type]) {
        groupedItems[type] = [];
      }

      groupedItems[type].push({
        name: toolbarItemName,
        ...item
      });
    });

    Object.keys(groupedItems).forEach((type) => {
      groupedItems[type].sort((a, b) => {
        const indexA = a.index || 0;
        const indexB = b.index || 0;
        return indexA - indexB;
      });
    });

    const sortedItems: Array<{ name: string, creator: (toolbar?: HTMLDivElement) => HTMLElement, type: ToolbarItemType, index: number, groupIndex: number }> = [];

    const sortedGroups = Object.keys(groupedItems).sort((typeA, typeB) => {
      const groupA = groupedItems[typeA][0]?.groupIndex || 0;
      const groupB = groupedItems[typeB][0]?.groupIndex || 0;
      return groupA - groupB;
    });

    sortedGroups.forEach((type) => {
      sortedItems.push(...groupedItems[type]);
    });

    return sortedItems;
  }

  protected createToolbarItems(toolbar: HTMLDivElement) {
    const toolbarItemCreators = this.getSortedToolbarItemCreators();

    toolbarItemCreators.forEach((item) => {
      let toolbarItem = item.creator(toolbar);
      if (!!toolbarItem) {
        toolbar.appendChild(toolbarItem);
      }
    });
  }

  protected getCorrectAnswerText(): string {
    return !!this.question ? this.question.correctAnswer : "";
  }

  protected destroyToolbar(container: HTMLElement) {
    container.innerHTML = "";
  }

  protected renderToolbar(container: HTMLElement) {
    if (this.showToolbar) {
      const toolbar = <HTMLDivElement>(
        DocumentHelper.createElement("div", "sa-toolbar")
      );
      this.createToolbarItems(toolbar);
      container.appendChild(toolbar);
    }
  }

  protected destroyHeader(container: HTMLElement) {
    if (!!this.options && typeof this.options.destroyHeader === "function") {
      this.options.destroyHeader(container, this);
    } else {
      container.innerHTML = "";
    }
  }

  protected destroyContent(container: HTMLElement) {
    if (!!this.options && typeof this.options.destroyContent === "function") {
      this.options.destroyContent(container, this);
    } else if (this._chartAdapter) {
      this._chartAdapter.destroy(<HTMLElement>container.children[0]);
    }
    container.innerHTML = "";
  }

  protected renderHeader(container: HTMLElement) {
    if (!!this.options && typeof this.options.renderHeader === "function") {
      this.options.renderHeader(container, this);
    } else {
      const correctAnswerElement = DocumentHelper.createElement(
        "div",
        "sa-visualizer__correct-answer"
      );
      correctAnswerElement.innerText = localization.getString("correctAnswer") + this.getCorrectAnswerText();
      container.appendChild(correctAnswerElement);
    }
  }

  protected async renderContentAsync(container: HTMLElement): Promise<HTMLElement> {
    if(this._chartAdapter) {
      const chartNode: HTMLElement = DocumentHelper.createElement("div");
      container.innerHTML = "";
      container.appendChild(chartNode);
      await this._chartAdapter.create(chartNode);
    } else {
      container.innerText = localization.getString("noVisualizerForQuestion");
    }
    return container;
  }

  protected ensureQuestionIsReady(): Promise<void> {
    return new Promise<void>((resolve) => {
      if(this.question) {
        this.question.waitForQuestionIsReady().then(() => resolve());
      } else {
        resolve();
      }
    });
  }

  protected renderContent(container: HTMLElement): void {
    if (!!this.options && typeof this.options.renderContent === "function") {
      const rendered = this.options.renderContent(container, this);
      if(rendered !== false) {
        this.afterRender(container);
      }
    } else {
      if(this.loadingData) {
        this.renderLoadingIndicator(this.contentContainer);
      }
      this.ensureQuestionIsReady().then(() => this.renderContentAsync(container).then(el => this.afterRender(el)));
    }
  }

  protected destroyFooter(container: HTMLElement) {
    container.innerHTML = "";
  }

  protected renderFooter(container: HTMLElement) {
    container.innerHTML = "";
    if (this.hasFooter) {
      const footerTitleElement = DocumentHelper.createElement(
        "h4",
        "sa-visualizer__footer-title",
        { innerText: localization.getString("otherCommentTitle") }
      );
      container.appendChild(footerTitleElement);

      const footerContentElement = DocumentHelper.createElement(
        "div",
        "sa-visualizer__footer-content"
      );
      footerContentElement.style.display = VisualizerBase.otherCommentCollapsed
        ? "none"
        : "block";

      const visibilityButton = DocumentHelper.createButton(() => {
        if (footerContentElement.style.display === "none") {
          footerContentElement.style.display = "block";
          (visibilityButton as any).setText(localization.getString("hideButton"));
        } else {
          footerContentElement.style.display = "none";
          (visibilityButton as any).setText(localization.getString(VisualizerBase.otherCommentCollapsed ? "showButton" : "hideButton"));
        }
        this.footerVisualizer.invokeOnUpdate();
      }, localization.getString("showButton") /*, "sa-toolbar__button--right"*/);
      container.appendChild(visibilityButton);

      container.appendChild(footerContentElement);

      this.footerVisualizer.render(footerContentElement, false);
    }
  }

  /**
   * Renders the visualizer in a specified container.
   * @param targetElement An `HTMLElement` or an `id` of a page element in which you want to render the visualizer.
   */
  render(targetElement: HTMLElement | string, isRoot = true) {
    if (typeof targetElement === "string") {
      targetElement = document.getElementById(targetElement);
    }
    this.renderResult = targetElement;
    if(isRoot && !this._appliedTheme) {
      this._appliedTheme = this.theme;
      this.onThemeChanged();
    }
    if(this._appliedTheme) {
      this._appliedTheme.applyThemeToElement(this.renderResult);
    }

    this.toolbarContainer = DocumentHelper.createElement(
      "div",
      "sa-visualizer__toolbar"
    );
    targetElement.appendChild(this.toolbarContainer);
    this.renderToolbar(this.toolbarContainer);

    if (this.hasHeader) {
      this.headerContainer = DocumentHelper.createElement(
        "div",
        "sa-visualizer__header"
      );
      targetElement.appendChild(this.headerContainer);
      this.renderHeader(this.headerContainer);
    }

    this.contentContainer = DocumentHelper.createElement(
      "div",
      "sa-visualizer__content"
    );
    targetElement.appendChild(this.contentContainer);
    this.renderContent(this.contentContainer);

    this.footerContainer = DocumentHelper.createElement(
      "div",
      "sa-visualizer__footer"
    );
    targetElement.appendChild(this.footerContainer);
    this.renderFooter(this.footerContainer);
  }

  public updateToolbar(): void {
    if (!!this.toolbarContainer) {
      PostponeHelper.postpone(() => {
        this.destroyToolbar(this.toolbarContainer);
        this.renderToolbar(this.toolbarContainer);
      });
    }
  }

  protected isSupportSoftUpdateContent(): boolean {
    return false;
  }

  protected softUpdateContent(): void {
  }

  protected hardUpdateContent(): void {
    this.destroyContent(this.contentContainer);
    this.renderContent(this.contentContainer);
  }

  public updateContent(): void {
    if(!this.isSupportSoftUpdateContent()) {
      this.hardUpdateContent();
    } else {
      this.softUpdateContent();
    }
  }

  /**
   * Re-renders the visualizer and its content.
   */
  public refresh(): void {
    if (!!this.headerContainer) {
      PostponeHelper.postpone(() => {
        this.destroyHeader(this.headerContainer);
        this.renderHeader(this.headerContainer);
        this.invokeOnUpdate();
      });
    }
    if (!!this.contentContainer) {
      PostponeHelper.postpone(() => {
        this.updateContent();
        this.invokeOnUpdate();
      });
    }
    if (!!this.footerContainer) {
      PostponeHelper.postpone(() => {
        this.destroyFooter(this.footerContainer);
        this.renderFooter(this.footerContainer);
        this.invokeOnUpdate();
      });
    }
  }

  protected processText(text: string): string {
    if (this.options.stripHtmlFromTitles !== false) {
      let originalText = text || "";
      let processedText = originalText.replace(/(<([^>]+)>)/gi, "");
      return processedText;
    }
    return text;
  }

  getRandomColor() {
    const colors = VisualizerBase.getColors();
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private _backgroundColor;

  get backgroundColor() { return this.getBackgroundColorCore(); }
  set backgroundColor(value) { this.setBackgroundColorCore(value); }

  protected getBackgroundColorCore() {
    return this._backgroundColor || this._theme.backgroundColor;
  }
  protected setBackgroundColorCore(color: string) {
    this._backgroundColor = color;
    if (this.footerVisualizer) this.footerVisualizer.backgroundColor = color;
  }

  protected onThemeChanged(): void {
    if (this.footerVisualizer) {
      this.footerVisualizer.theme = this.theme;
    }
  }

  get theme() : DashboardTheme {
    return this._theme;
  }
  set theme(theme: DashboardTheme) {
    this._theme = theme;
    this._appliedTheme = undefined;
    this.onThemeChanged();
  }

  public applyTheme(theme: IDashboardTheme): void {
    this.theme.setTheme(theme);
    this._appliedTheme = this.theme;
    if(this.renderResult) {
      this._appliedTheme.applyThemeToElement(this.renderResult);
    }
    this.onThemeChanged();
  }

  static customColors: string[] = [];
  private static colors = [
    "#e50a3e",
    "#19b394",
    "#437fd9",
    "#ff9814",
    "#4faf24",
    "#a62cec",
    "#6e5bd1",
    "#af496b"
    // "#86e1fb",
    // "#3999fb",
    // "#ff6771",
    // "#1eb496",
    // "#ffc152",
    // "#aba1ff",
    // "#7d8da5",
    // "#4ec46c",
    // "#cf37a6",
    // "#4e6198",
  ];

  static getColors(count = 10) {
    const colors =
      Array.isArray(VisualizerBase.customColors) &&
        VisualizerBase.customColors.length > 0
        ? VisualizerBase.customColors
        : VisualizerBase.colors;

    let manyColors: any = [];

    for (let index = 0; index < count; index++) {
      manyColors = manyColors.concat(colors);
    }

    return manyColors;
  }

  /**
   * Gets or sets the visibility of the visualizer's toolbar.
   *
   * Default value: `true`
   */
  get showToolbar() {
    return this._showToolbar;
  }
  set showToolbar(newValue: boolean) {
    if (newValue != this._showToolbar) {
      this._showToolbar = newValue;
      if (!!this.toolbarContainer) {
        this.destroyToolbar(this.toolbarContainer);
        this.renderToolbar(this.toolbarContainer);
      }
    }
  }

  /**
   * @deprecated Use [`getCalculatedValues()`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#getCalculatedValues) instead.
   */
  getData(): any {
    return this.getCalculatedValuesCore();
  }

  private _calculationsCache: Array<any> = undefined;

  protected getCalculatedValuesCore(): Array<any> {
    if (!!this._getDataCore) {
      return this._getDataCore(this);
    }

    return defaultStatisticsCalculator(this.surveyData, this);
  }

  protected loadingData: boolean = false;

  public renderLoadingIndicator(contentContainer: HTMLElement): void {
    contentContainer.appendChild(createLoadingIndicator());
  }

  public convertFromExternalData(externalCalculatedData: any): any[] {
    return externalCalculatedData;
  }

  /**
   * Returns an array of calculated and visualized values. If a user applies a filter, the array is also filtered.
   *
   * To get an array of source survey results, use the [`surveyData`](https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase#surveyData) property.
   */
  public getCalculatedValues(): Promise<Array<Object>> {
    return new Promise<Array<Object>>((resolve, reject) => {
      if(this._calculationsCache !== undefined) {
        resolve(this._calculationsCache);
      }
      if(!!this.dataProvider.dataFn) {
        this.loadingData = true;
        const dataLoadingPromise = this.dataProvider.dataFn({
          visualizer: this,
          filter: this.dataProvider.getFilters(),
          callback: (loadedData: { data: Array<Object>, error?: any }) => {
            this.loadingData = false;
            if(!loadedData.error && Array.isArray(loadedData.data)) {
              this._calculationsCache = this.convertFromExternalData(loadedData.data);
              resolve(this._calculationsCache);
            } else {
              reject();
            }
          }
        });
        if(dataLoadingPromise) {
          dataLoadingPromise
            .then(calculatedData => {
              this.loadingData = false;
              this._calculationsCache = this.convertFromExternalData(calculatedData);
              resolve(this._calculationsCache);
            })
            .catch(() => {
              this.loadingData = false;
              reject();
            });
        }
      } else {
        this._calculationsCache = this.getCalculatedValuesCore();
        resolve(this._calculationsCache);
      }
    });
  }

  protected _settingState = false;

  /**
   * Returns an object with properties that describe a current visualizer state. The properties are different for each individual visualizer.
   *
   * > This method is overriden in classes descendant from `VisualizerBase`.
   * @see setState
   * @see onStateChanged
   */
  public getState(): any {
    return {};
  }
  /**
   * Sets the visualizer's state.
   *
   * [View Demo](https://surveyjs.io/dashboard/examples/save-dashboard-state-to-local-storage/ (linkStyle))
   *
   * > This method is overriden in classes descendant from `VisualizerBase`.
   * @see getState
   * @see onStateChanged
   */
  public setState(state: any): void {
  }

  /**
   * Gets or sets the current locale.
   *
   * If you want to inherit the locale from a visualized survey, assign a [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model) instance to the [`survey`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#survey) property of the `IVisualizationPanelOptions` object in the [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel) constructor.
   *
   * If the survey is [translated into more than one language](https://surveyjs.io/form-library/examples/survey-localization/), the toolbar displays a language selection drop-down menu.
   *
   * [View Demo](https://surveyjs.io/dashboard/examples/localize-survey-data-dashboard-ui/ (linkStyle))
   * @see onLocaleChanged
   */
  public get locale(): string {
    var survey = this.options.survey;
    if (!!survey) {
      return survey.locale;
    }
    return localization.currentLocale;
  }

  public set locale(newLocale: string) {
    this.setLocale(newLocale);
    this.onLocaleChanged.fire(this, { locale: newLocale });
    this.refresh();
  }

  protected setLocale(newLocale: string): void {
    localization.currentLocale = newLocale;
    var survey = this.options.survey;
    if (!!survey && survey.locale !== newLocale) {
      survey.locale = newLocale;
    }
  }

}

VisualizationManager.defaultVisualizer = VisualizerBase;