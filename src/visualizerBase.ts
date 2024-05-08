import { Question, QuestionCommentModel, settings } from "survey-core";
import { IDataInfo, DataProvider } from "./dataProvider";
import { VisualizerFactory } from "./visualizerFactory";
import { DocumentHelper } from "./utils";
import { localization } from "./localizationManager";
import { Event } from "survey-core";

var styles = require("./visualizerBase.scss");

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

  private _showToolbar = true;
  private _footerVisualizer: VisualizerBase = undefined;
  private _dataProvider: DataProvider = undefined;
  public labelTruncateLength: number = 27;
  protected renderResult: HTMLElement = undefined;
  protected toolbarContainer: HTMLElement = undefined;
  protected headerContainer: HTMLElement = undefined;
  protected contentContainer: HTMLElement = undefined;
  protected footerContainer: HTMLElement = undefined;
  protected _supportSelection: boolean = false;
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
   * [View Demo](/dashboard/examples/save-dashboard-state-to-local-storage/ (linkStyle))
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

  protected toolbarItemCreators: { [name: string]: (toolbar?: HTMLDivElement) => HTMLElement } = {};

  constructor(
    public question: Question,
    data: Array<{ [index: string]: any }>,
    public options: { [index: string]: any } = {},
    private _type?: string
  ) {
    this._dataProvider = options.dataProvider || new DataProvider(data);
    this._dataProvider.onDataChanged.add(() => this.onDataChanged());

    if (typeof options.labelTruncateLength !== "undefined") {
      this.labelTruncateLength = options.labelTruncateLength;
    }
  }

  protected get questionOptions() {
    return this.options[this.question.name];
  }

  protected onDataChanged() {
    this.refresh();
  }

  /**
   * Returns the identifier of a visualized question.
   */
  get name(): string | Array<string> {
    return this.question.valueName || this.question.name;
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

  protected createVisualizer<T = VisualizerBase>(question: Question): T {
    let options = Object.assign({}, this.options);
    if (options.dataProvider === undefined) {
      options.dataProvider = this.dataProvider;
    }
    return VisualizerFactory.createVisualizer(question, this.data, options) as T;
  }

  /**
   * Allows you to access the footer visualizer. Returns `undefined` if the footer is absent.
   * @see hasFooter
   */
  get footerVisualizer() {
    if (!this.hasFooter) {
      return undefined;
    }
    if (!this._footerVisualizer) {
      const question = new QuestionCommentModel(
        this.question.name + (settings || {}).commentPrefix
      );
      question.title = this.processText(this.question.title);

      this._footerVisualizer = this.createVisualizer(question);
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

  getSeriesValues(): Array<string> {
    return this.options.seriesValues || [];
  }

  getSeriesLabels(): Array<string> {
    return this.options.seriesLabels || this.getSeriesValues();
  }

  getValues(): Array<any> {
    throw new Error("Method not implemented.");
  }

  getLabels(): Array<string> {
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
    creator: (toolbar?: HTMLDivElement) => HTMLElement
  ): void {
    this.toolbarItemCreators[name] = creator;
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
      const creator = this.toolbarItemCreators[name];
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
   * Obsolete. Use [`surveyData`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#surveyData) instead.
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

  protected createToolbarItems(toolbar: HTMLDivElement) {
    Object.keys(this.toolbarItemCreators || {}).forEach((toolbarItemName) => {
      let toolbarItem = this.toolbarItemCreators[toolbarItemName](toolbar);
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
    } else {
      container.innerHTML = "";
    }
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

  protected renderContent(container: HTMLElement) {
    if (!!this.options && typeof this.options.renderContent === "function") {
      this.options.renderContent(container, this);
    } else {
      container.innerText = localization.getString("noVisualizerForQuestion");
    }
    this.afterRender(container);
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
          visibilityButton.innerText = localization.getString("hideButton");
        } else {
          footerContentElement.style.display = "none";
          visibilityButton.innerText = localization.getString(
            VisualizerBase.otherCommentCollapsed ? "showButton" : "hideButton"
          );
        }
        this.footerVisualizer.invokeOnUpdate();
      }, localization.getString("showButton") /*, "sa-toolbar__button--right"*/);
      container.appendChild(visibilityButton);

      container.appendChild(footerContentElement);

      this.footerVisualizer.render(footerContentElement);
    }
  }

  /**
   * Renders the visualizer in a specified container.
   * @param targetElement An `HTMLElement` or an `id` of a page element in which you want to render the visualizer.
   */
  render(targetElement: HTMLElement | string) {
    if (typeof targetElement === "string") {
      targetElement = document.getElementById(targetElement);
    }
    this.renderResult = targetElement;

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

  /**
   * Re-renders the visualizer and its content.
   */
  public refresh() {
    if (!!this.headerContainer) {
      setTimeout(() => {
        this.destroyHeader(this.headerContainer);
        this.renderHeader(this.headerContainer);
        this.invokeOnUpdate();
      });
    }
    if (!!this.contentContainer) {
      setTimeout(() => {
        this.destroyContent(this.contentContainer);
        this.renderContent(this.contentContainer);
        this.invokeOnUpdate();
      });
    }
    if (!!this.footerContainer) {
      setTimeout(() => {
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
    const colors = this.getColors();
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private _backgroundColor = "#f7f7f7";

  get backgroundColor() { return this.getBackgroundColorCore(); }
  set backgroundColor(value) { this.setBackgroundColorCore(value); }

  protected getBackgroundColorCore() {
    return this._backgroundColor;
  }
  protected setBackgroundColorCore(color: string) {
    this._backgroundColor = color;
    if (this.footerVisualizer) this.footerVisualizer.backgroundColor = color;
  }

  static customColors: string[] = [];
  private static colors = [
    "#86e1fb",
    "#3999fb",
    "#ff6771",
    "#1eb496",
    "#ffc152",
    "#aba1ff",
    "#7d8da5",
    "#4ec46c",
    "#cf37a6",
    "#4e6198",
  ];

  getColors(count = 10) {
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
   * Obsolete. Use [`getCalculatedValues()`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#getCalculatedValues) instead.
   */
  getData(): any {
    return this.getCalculatedValues();
  }

  /**
   * Returns an array of calculated and visualized values. If a user applies a filter, the array is also filtered.
   *
   * To get an array of source survey results, use the [`surveyData`](https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase#surveyData) property.
   */
  getCalculatedValues(): any {
    return this.dataProvider.getData(this);
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
   * @see onLocaleChanged
   */
  public get locale() {
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

  protected setLocale(newLocale: string) {
    localization.currentLocale = newLocale;
    var survey = this.options.survey;
    if (!!survey && survey.locale !== newLocale) {
      survey.locale = newLocale;
    }
  }

}
