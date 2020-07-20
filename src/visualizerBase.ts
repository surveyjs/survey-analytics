import { Question } from "survey-core";

import "./visualizerBase.scss";

export class VisualizerBase {
  protected renderResult: HTMLElement = undefined;
  protected toolbarContainer: HTMLElement = undefined;
  protected contentContainer: HTMLElement = undefined;
  protected footerContainer: HTMLElement = undefined;

  protected toolbarItemCreators: { [name: string]: () => HTMLElement } = {};

  constructor(
    public question: Question,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object
  ) {}

  public registerToolbarItem(name: string, creator: () => HTMLElement) {
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
      this.renderResult.innerHTML = "";
      this.renderResult = undefined;
      this.toolbarContainer = undefined;
      this.contentContainer = undefined;
      this.footerContainer = undefined;
    }
  }

  protected createToolbarItems(toolbar: HTMLDivElement) {
    Object.keys(this.toolbarItemCreators || {}).forEach(toolbarItemName => {
      let toolbarItem = this.toolbarItemCreators[toolbarItemName]();
      if(!!toolbarItem) {
        toolbar.appendChild(toolbarItem);
      }
    });
  }

  protected renderToolbar(container: HTMLElement) {
    const toolbar = document.createElement("div");
    toolbar.className = "sva-toolbar";
    this.createToolbarItems(toolbar);
    container.appendChild(toolbar);
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
    this.contentContainer = document.createElement("div");
    this.contentContainer.className = "sa-visualizer__content";
    this.footerContainer = document.createElement("div");
    this.footerContainer.className = "sa-visualizer__footer";

    this.renderToolbar(this.toolbarContainer);
    this.renderContent(this.contentContainer);
    this.renderFooter(this.footerContainer);

    targetElement.appendChild(this.toolbarContainer);
    targetElement.appendChild(this.contentContainer);
    targetElement.appendChild(this.footerContainer);
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
}
