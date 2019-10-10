import { Question } from "survey-core";

export class VisualizerBase {

  public toolbarItemCreators: { [name: string]: (toolbar: HTMLDivElement) => HTMLElement } = {};

  constructor(
    protected targetElement: HTMLElement,
    public question: Question,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object
  ) {}

  public registerToolbarItem(name: string, creator: (toolbar: HTMLDivElement) => HTMLElement) {
    this.toolbarItemCreators[name] = creator;
  }

  public get name() {
    return "visualizer";
  }

  update(data: Array<{ [index: string]: any }>) {
    this.data = data;
  }

  onUpdate: () => void;

  destroy() {
    this.targetElement.innerHTML = "";
  }

  protected renderContent(container: HTMLDivElement) {
    container.innerHTML = "This question type is not visualized yet";
  }

  render(targetElement?: HTMLElement) {
    this.targetElement = targetElement || this.targetElement;

    const toolbarNodeContainer = document.createElement("div");
    const contentContainer = document.createElement("div");
    contentContainer.className = "sa-visualizer__content";

    this.createToolbar(toolbarNodeContainer);
    this.renderContent(contentContainer);

    this.targetElement.appendChild(toolbarNodeContainer);
    this.targetElement.appendChild(contentContainer);
  }

  protected createToolbarItems(toolbar: HTMLDivElement) {
    Object.keys(this.toolbarItemCreators || {}).forEach(toolbarItemName => this.toolbarItemCreators[toolbarItemName](toolbar));
  }

  protected createToolbar(container: HTMLDivElement) {
    const toolbar = document.createElement("div");
    toolbar.className = "sva-toolbar";
    this.createToolbarItems(toolbar);
    container.appendChild(toolbar);
  }

  invokeOnUpdate() {
    this.onUpdate && this.onUpdate();
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
