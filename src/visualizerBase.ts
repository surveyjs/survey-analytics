import { Question } from "survey-core";

export class VisualizerBase {
  constructor(
    protected targetElement: HTMLElement,
    public question: Question,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object
  ) {}

  destroy() {}

  render() {
    this.targetElement.innerHTML = "This question type is not visualized yet";
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

  getColors() {
    const colors = [
      "4e6198",
      "cf37a6",
      "4ec46c",
      "7d8da5",
      "aba1ff",
      "ffc152",
      "1eb496",
      "ff6771",
      "3999fb",
      "86e1fb"
    ];

    let manyColors: any = [];

    for (let index = 0; index < 10; index++) {
      manyColors = manyColors.concat(colors);
    }

    return manyColors;
  }
}
