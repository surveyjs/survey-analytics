import { Question } from "survey-core";

import "./visualizerBase.scss";

export class VisualizerBase {
  protected destroyRenderResult: () => void;

  public toolbarItemCreators: { [name: string]: () => HTMLElement } = {};

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
    this.destroyRenderResult && this.destroyRenderResult();
  }

  protected renderToolbar(container: HTMLDivElement) {
    const toolbar = document.createElement("div");
    toolbar.className = "sva-toolbar";
    this.createToolbarItems(toolbar);
    container.appendChild(toolbar);
  }

  protected renderContent(container: HTMLDivElement) {
    container.innerHTML = "This question type is not visualized yet";
  }

  protected renderFooter(container: HTMLDivElement) {
    container.innerHTML = "";
  }

  render(targetElement: HTMLElement) {
    this.destroyRenderResult = () => targetElement.innerHTML = "";

    const toolbar = document.createElement("div");
    toolbar.className = "sa-visualizer__toolbar";
    const content = document.createElement("div");
    content.className = "sa-visualizer__content";
    const footer = document.createElement("div");
    footer.className = "sa-visualizer__footer";

    this.renderToolbar(toolbar);
    this.renderContent(content);
    this.renderFooter(footer);

    targetElement.appendChild(toolbar);
    targetElement.appendChild(content);
    targetElement.appendChild(footer);
  }

  protected createToolbarItems(toolbar: HTMLDivElement) {
    Object.keys(this.toolbarItemCreators || {}).forEach(toolbarItemName => {
      let toolbarItem = this.toolbarItemCreators[toolbarItemName]();
      if(!!toolbarItem) {
        toolbar.appendChild(toolbarItem);
      }
    });
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
