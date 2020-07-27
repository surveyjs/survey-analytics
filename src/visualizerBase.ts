import { Question } from "survey-core";

import "./visualizerBase.scss";
import { IDataInfo } from './dataProvider';

export class VisualizerBase implements IDataInfo {
  private _showHeader = true;
  protected renderResult: HTMLElement = undefined;
  protected toolbarContainer: HTMLElement = undefined;
  protected contentContainer: HTMLElement = undefined;
  protected footerContainer: HTMLElement = undefined;

  protected toolbarItemCreators: { [name: string]: (toolbar?: HTMLDivElement) => HTMLElement } = {};

  constructor(
    public question: Question,
    protected data: Array<{ [index: string]: any }>,
    protected options: { [index: string]: any } = {}
  ) {}

  get dataName(): string {
    return this.question.name;
  }
  
  getSeriesNames(): Array<string> {
    return [];
  }

  getSeriesTitles(): Array<string> {
    return this.getSeriesNames();
  }

  getValues(): Array<any> {
    throw new Error("Method not implemented.");
  }
  
  getLabels(): Array<string> {
    return this.getValues();
  }

  public registerToolbarItem(name: string, creator: (toolbar?: HTMLDivElement) => HTMLElement) {
    this.toolbarItemCreators[name] = creator;
  }

  public get name() {
    return "visualizer";
  }

  update(data: Array<{ [index: string]: any }>) {
    this.data = data;
  }

  onUpdate: () => void;

  invokeOnUpdate() {
    this.onUpdate && this.onUpdate();
  }

  destroy() {
    if(!!this.renderResult) {
      this.destroyToolbar(this.toolbarContainer);
      this.toolbarContainer = undefined;
      this.destroyContent(this.contentContainer);
      this.contentContainer = undefined;
      this.destroyFooter(this.footerContainer);
      this.footerContainer = undefined;
      this.renderResult.innerHTML = "";
      this.renderResult = undefined;
    }
  }

  protected createToolbarItems(toolbar: HTMLDivElement) {
    Object.keys(this.toolbarItemCreators || {}).forEach(toolbarItemName => {
      let toolbarItem = this.toolbarItemCreators[toolbarItemName](toolbar);
      if(!!toolbarItem) {
        toolbar.appendChild(toolbarItem);
      }
    });
  }

  protected destroyToolbar(container: HTMLElement) {
    container.innerHTML = "";
  }

  protected renderToolbar(container: HTMLElement) {
    if(this.showHeader) {
      const toolbar = document.createElement("div");
      toolbar.className = "sa-toolbar";
      this.createToolbarItems(toolbar);
      container.appendChild(toolbar);
    }
  }

  protected destroyContent(container: HTMLElement) {
    container.innerHTML = "";
  }

  protected renderContent(container: HTMLElement) {
    container.innerHTML = "This question type is not visualized yet";
  }

  protected destroyFooter(container: HTMLElement) {
    container.innerHTML = "";
  }

  protected renderFooter(container: HTMLElement) {
    container.innerHTML = "";
  }

  render(targetElement: HTMLElement) {
    this.renderResult = targetElement;

    this.toolbarContainer = document.createElement("div");
    this.toolbarContainer.className = "sa-visualizer__toolbar";
    targetElement.appendChild(this.toolbarContainer);
    this.renderToolbar(this.toolbarContainer);

    this.contentContainer = document.createElement("div");
    this.contentContainer.className = "sa-visualizer__content";
    targetElement.appendChild(this.contentContainer);
    this.renderContent(this.contentContainer);

    this.footerContainer = document.createElement("div");
    this.footerContainer.className = "sa-visualizer__footer";
    targetElement.appendChild(this.footerContainer);
    this.renderFooter(this.footerContainer);
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
    "#4e6198"
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
      if(!!this.toolbarContainer) {
        this.destroyToolbar(this.toolbarContainer);
        this.renderToolbar(this.toolbarContainer);
      }
    }
  }
}
