import { Question } from "survey-core";
import WordCloudLib from "wordcloud";
import { VisualizerBase } from "../visualizerBase";
import { VisualizationManager } from "../visualizationManager";

export class WordCloud extends VisualizerBase {
  constructor(
    targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
  }

  private cloud: any;

  getData() {
    let result: { [key: string]: number } = {};

    let processString = (row: string) => {
      if (!!row) {
        row.split(" ").forEach(word => {
          if (!result[word]) {
            result[word] = 1;
          }
          result[word]++;
        });
      }
    };

    this.data.forEach(row => {
      const rowValue: any = row[this.question.name];
      if (!!rowValue) {
        if (Array.isArray(rowValue)) {
          rowValue.forEach(processString);
        } else {
          if (typeof rowValue === "object") {
            Object.keys(rowValue).forEach(key => processString(rowValue[key]));
          } else {
            processString(rowValue);
          }
        }
      }
    });

    return Object.keys(result).map(key => {
      return [key, result[key]];
    });
  }

  render() {
    const colors = this.getColors();
    const canvasNode = <HTMLCanvasElement>document.createElement("canvas");

    this.targetElement.appendChild(canvasNode);

    this.cloud = WordCloudLib(canvasNode, {
      list: this.getData(),
      weightFactor: 20,
      fontFamily: "Segoe UI Bold, sans-serif",
      color: (word: string, weight: number) => {
        return this.getRandomColor();
      },
      rotateRatio: 0.5,
      backgroundColor: "white",
      click: function(item) {
        console.log(item[0] + ": " + item[1]);
      }
    });
  }

  destroy() {
    if (!!this.cloud) {
      this.cloud = undefined;
      this.targetElement.innerHTML = "";
    }
  }
}

VisualizationManager.registerVisualizer("text", WordCloud);
VisualizationManager.registerVisualizer("comment", WordCloud);
VisualizationManager.registerVisualizer("multipletext", WordCloud);
