import { Question } from "survey-core";

export class VisualizerBase {
  constructor(
    protected targetElement: HTMLElement,
    public question: Question,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object
  ) {}

  onUpdate: () => void;

  destroy() {}

  render() {
    this.targetElement.innerHTML = "This question type is not visualized yet";
  }

  invokeOnUpdate() {
    this.onUpdate && this.onUpdate();
  }

  getRandomColor() {
    let color = [];
    for (let i = 0; i < 3; i++) {
      color[i] = Math.floor(Math.random() * 255);
    }
    return "rgba(" + color.join(", ") + ", 0.4)";

    const colors = this.getColors();

    return "#" + colors[Math.floor(Math.random() * colors.length)];
  }

  backgroundColor = "#f7f7f7";

  static customColors: string[] = [];
  private static colors = [
    "86e1fb",
    "3999fb",
    "ff6771",
    "1eb496",
    "ffc152",
    "aba1ff",
    "7d8da5",
    "4ec46c",
    "cf37a6",
    "4e6198"
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
