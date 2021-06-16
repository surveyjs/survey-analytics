import { Question, QuestionCommentModel, settings } from "survey-core";
import { IDataInfo, DataProvider } from "./dataProvider";
import { VisualizerFactory } from "./visualizerFactory";
import { DocumentHelper } from "./utils";
import { localization } from "./localizationManager";
import { Event } from "survey-core";

import "./visualizerBase.scss";

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
  protected labelTruncateLength: number = 27;
  protected renderResult: HTMLElement = undefined;
  protected toolbarContainer: HTMLElement = undefined;
  protected contentContainer: HTMLElement = undefined;
  protected footerContainer: HTMLElement = undefined;
  protected _supportSelection: boolean = false;
  // public static otherCommentQuestionType = "comment"; // TODO: make it configureable - allow choose what kind of question/visualizer will be used for comments/others
  public static otherCommentCollapsed = true;

  /**
   * The event is fired right after a visualizer's content is rendered in DOM.
   **/
  public onAfterRender: Event<
    (sender: VisualizerBase, options: any) => any,
    any
  > = new Event<(sender: VisualizerBase, options: any) => any, any>();

  protected afterRender(contentContainer: HTMLElement) {
    this.onAfterRender.fire(this, { htmlElement: contentContainer });
  }

  protected toolbarItemCreators: {
    [name: string]: (toolbar?: HTMLDivElement) => HTMLElement;
  } = {};

  constructor(
    public question: Question,
    data: Array<{ [index: string]: any }>,
    public options: { [index: string]: any } = {},
    private _name?: string
  ) {
    this._dataProvider = options.dataProvider || new DataProvider(data);
    this._dataProvider.onDataChanged.add(() => this.onDataChanged());

    if (typeof options.labelTruncateLength !== "undefined") {
      this.labelTruncateLength = options.labelTruncateLengt;
    }
  }

  protected onDataChanged() {
    this.refresh();
  }

  /**
   * Name of the data field of data object from the data array.
   */
  get dataName(): string {
    return this.question.name;
  }

  /**
   * Indicates whether visualizer has footer. Usually it is true then a question has comment or choices question has other item.
   */
  get hasFooter() {
    return (
      !!this.question && (this.question.hasComment || this.question.hasOther)
    );
  }

  protected createVisualizer(question: Question) {
    let options = Object.assign({}, this.options);
    if (options.dataProvider === undefined) {
      options.dataProvider = this.dataProvider;
    }

    return VisualizerFactory.createVisualizer(question, this.data, options);
  }

  /**
   * Footer visualizer getter.
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
   * Indicates whether visualizer supports selection. Visualizers of questions with choices allow to select choice by clicking on the diagram bar and filter other data for the selected item.
   */
  public get supportSelection(): boolean {
    return (
      (this.options.allowSelection === undefined ||
        this.options.allowSelection) &&
      this._supportSelection
    );
  }

  /**
   * Series values getter. Some questions (used in matrices) should be grouped by matrix rows. This groups are called series.
   */
  getSeriesValues(): Array<string> {
    return this.options.seriesValues || [];
  }

  /**
   * Series labels getter. Some questions (used in matrices) should be grouped by matrix rows. This groups are called series.
   */
  getSeriesLabels(): Array<string> {
    return this.options.seriesLabels || this.getSeriesValues();
  }

  /**
   * Available values of question answers (available choices).
   */
  getValues(): Array<any> {
    throw new Error("Method not implemented.");
  }

  /**
   * Available labels of question answers (human readable representation of available choices).
   */
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
   * The name of the visaulizer.
   */
  public get name() {
    return this._name || "visualizer";
  }

  /**
   * The actual data of the visaulizer.
   */
  protected get data() {
    return this.dataProvider.filteredData;
  }

  /**
   * The data provider is used by the visaulizer.
   */
  protected get dataProvider(): DataProvider {
    return this._dataProvider;
  }

  /**
   * Updates visualizer data.
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
   * Destroys visualizer.
   */
  destroy() {
    if (!!this.renderResult) {
      this.destroyToolbar(this.toolbarContainer);
      this.toolbarContainer = undefined;
      this.destroyContent(this.contentContainer);
      this.contentContainer = undefined;
      this.destroyFooter(this.footerContainer);
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

  protected createToolbarItems(toolbar: HTMLDivElement) {
    Object.keys(this.toolbarItemCreators || {}).forEach((toolbarItemName) => {
      let toolbarItem = this.toolbarItemCreators[toolbarItemName](toolbar);
      if (!!toolbarItem) {
        toolbar.appendChild(toolbarItem);
      }
    });
  }

  /**
   * Destroys visualizer toolbar.
   */
  protected destroyToolbar(container: HTMLElement) {
    container.innerHTML = "";
  }

  /**
   * Renderss visualizer toolbar.
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
   * Renders visualizer content.
   * Usually overriden in descendants.
   */
  protected renderContent(container: HTMLElement) {
    if (!!this.options && typeof this.options.renderContent === "function") {
      this.options.renderContent(container, this);
    } else {
      container.innerHTML = localization.getString("noVisualizerForQuestion");
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
   * Renders visualizer footer.
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
   * Renders visualizer in the given container.
   */
  render(targetElement: HTMLElement) {
    this.renderResult = targetElement;

    this.toolbarContainer = DocumentHelper.createElement(
      "div",
      "sa-visualizer__toolbar"
    );
    targetElement.appendChild(this.toolbarContainer);
    this.renderToolbar(this.toolbarContainer);

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
   * Redraws visualizer and all inner content.
   */
  public refresh() {
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

  backgroundColor = "#f7f7f7";

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
   * Returns data to be used in the visualizer.
   */
  getData(): any {
    return this.dataProvider.getData(this);
  }
}
