import { Question, QuestionCommentModel, settings } from "survey-core";
import { IDataInfo, DataProvider } from "./dataProvider";
import { VisualizerFactory } from "./visualizerFactory";
import { DocumentHelper } from "./utils";
import { localization } from "./localizationManager";
import { Event } from "survey-core";

var styles = require("./visualizerBase.scss");

/**
 * VisualizerBase is a base object for all visuzlizers. It responsible for the rendering and destroying visualizer.
 *
 * constructor parameters:
 * question - a survey question to visualize,
 * data - an array of answers in format of survey result,
 * options - object with the following options,
 * name - visualizer name
 *
 * options:
 * seriesValues - an array of series values in data to group data by series,
 * seriesLabels - labels for series to display, if not passed the seriesValues are used as labels,
 * survey - pass survey instance to use localses from the survey JSON,
 * dataProvider - dataProvider for this visualizer,
 *
 */
export class VisualizerBase implements IDataInfo {
  private _showHeader = true;
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
   * @see renderContent
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
   * - `options.locale`: `String`\
   * The indentifier of a new locale (for example, "en").
   * @see locale
   */
  public onLocaleChanged = new Event<
    (sender: VisualizerBase, options: { locale: string }) => any,
    VisualizerBase,
    any
  >();

  protected toolbarItemCreators: { [name: string]: (toolbar?: HTMLDivElement) => HTMLElement } = {};

  constructor(
    public question: Question,
    data: Array<{ [index: string]: any }>,
    public options: { [index: string]: any } = {},
    private _name?: string
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

  get dataName(): string | Array<string> {
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
      this._footerVisualizer.onUpdate = () => this.invokeOnUpdate();
    }
    return this._footerVisualizer;
  }

  /**
   * Indicates whether users can select series points to cross-filter charts. To allow or disallow selection, set the `allowSelection` property of the `options` object in the constructor.
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
   * Registers creator of visualizer toolbar item.
   */
  public registerToolbarItem(
    name: string,
    creator: (toolbar?: HTMLDivElement) => HTMLElement
  ) {
    this.toolbarItemCreators[name] = creator;
  }

  /**
   * Returns the visualizer's name.
   */
  public get name() {
    return this._name || "visualizer";
  }

  /**
   * Returns an array of survey results used to calculate values for visualization. If a user applies a filter, the array is also filtered.
   * 
   * To get an array of calculated and visualized values, call the `getData()` method.
   * @see getData
   */
  protected get data() {
    return this.dataProvider.filteredData;
  }

  /**
   * Allows you to access a data provider used by the visualizer.
   */
  protected get dataProvider(): DataProvider {
    return this._dataProvider;
  }

  /**
   * Updates the visualized data.
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
   * Removes the visualizer and all its elements from the DOM.
   */
  destroy() {
    if (!!this.renderResult) {
      this.clear();
      this.toolbarContainer = undefined;
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
   * Empties the toolbar, footer, and content containers.
   * 
   * TODO: Why not header?
   */
  public clear() {
    if (!!this.toolbarContainer) {
      this.destroyToolbar(this.toolbarContainer);
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

  /**
   * Destroys visualizer toolbar.
   */
  protected destroyToolbar(container: HTMLElement) {
    container.innerHTML = "";
  }

  /**
   * Renders the toolbar in a specified container.
   * @param container An `HTMLElement` in which you want to render the toolbar.
   */
  protected renderToolbar(container: HTMLElement) {
    if (this.showHeader) {
      const toolbar = <HTMLDivElement>(
        DocumentHelper.createElement("div", "sa-toolbar")
      );
      this.createToolbarItems(toolbar);
      container.appendChild(toolbar);
    }
  }

  /**
   * Destroys visualizer header.
   * Usually overriden in descendants.
   */
  protected destroyHeader(container: HTMLElement) {
    if (!!this.options && typeof this.options.destroyHeader === "function") {
      this.options.destroyHeader(container, this);
    } else {
      container.innerHTML = "";
    }
  }

  /**
   * Destroys visualizer content.
   * Usually overriden in descendants.
   */
  protected destroyContent(container: HTMLElement) {
    if (!!this.options && typeof this.options.destroyContent === "function") {
      this.options.destroyContent(container, this);
    } else {
      container.innerHTML = "";
    }
  }

  /**
   * Renders the header in a specified container.
   * @param container An `HTMLElement` in which you want to render the header.
   * @see hasHeader
   */
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

  /**
   * Renders the visualizer's content in a specified container.
   * @param container An `HTMLElement` in which you want to render the content.
   */
  protected renderContent(container: HTMLElement) {
    if (!!this.options && typeof this.options.renderContent === "function") {
      this.options.renderContent(container, this);
    } else {
      container.innerText = localization.getString("noVisualizerForQuestion");
    }
    this.afterRender(container);
  }

  /**
   * Destroys visualizer footer.
   */
  protected destroyFooter(container: HTMLElement) {
    container.innerHTML = "";
  }

  /**
   * Renders the footer in a specified container.
   * @param container An `HTMLElement` in which you want to render the footer.
   * @see hasFooter
   */
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

  get showHeader() {
    return this._showHeader;
  }
  set showHeader(newValue: boolean) {
    if (newValue != this._showHeader) {
      this._showHeader = newValue;
      if (!!this.toolbarContainer) {
        this.destroyToolbar(this.toolbarContainer);
        this.renderToolbar(this.toolbarContainer);
      }
    }
  }

  /**
   * Returns an array of calculated and visualized values. If a user applies a filter, the array is also filtered.
   * 
   * To get an array of source survey results, use the `data` property.
   * @see data
   */
  getData(): any {
    return this.dataProvider.getData(this);
  }

  public getState(): any {
    return {};
  }
  public setState(state: any): void {
  }

  /**
   * Get or sets the current locale.
   * 
   * If you want to inherit the locale from the visualized survey, assign a `SurveyModel` instance to the `survey` property of the `options` object in the constructor.
   * 
   * If the survey is [translated to more than one language](https://surveyjs.io/form-library/examples/survey-localization/), the toolbar displays a language selection drop-down menu.
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
