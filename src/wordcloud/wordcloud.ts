import { Question } from "survey-core";
import { VisualizerBase } from "../visualizerBase";
import { VisualizationManager } from "../visualizationManager";
import { textHelper } from "./stopwords/index";
import WordCloudLib from "wordcloud";

export class WordCloud extends VisualizerBase {
  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
  }

  public get name() {
    return "wordcloud";
  }

  private cloud: any;

  getData() {
    let result: { [key: string]: number } = {};

    let stopWords = textHelper.getStopWords();
    let stopTheWord = (word: string) => {
      if (stopWords.indexOf(word) !== -1) {
        return "";
      }
      return word;
    };

    let processString = (row: string) => {
      row = "" + row;
      if (!!row) {
        row.split(" ").forEach(word => {
          word = stopTheWord(word.toLowerCase() || "");
          if (!!word) {
            if (!result[word]) {
              result[word] = 1;
            } else {
              result[word]++;
            }
          }
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

  protected renderContent(container: HTMLElement) {
    const data = this.getData();
    const colors = this.getColors();
    const canvasNode = <HTMLCanvasElement>document.createElement("canvas");
    const emptyTextNode = <HTMLElement>document.createElement("p");
    emptyTextNode.innerHTML = "There are no results yet";

    if (data.length === 0) {
      container.appendChild(emptyTextNode);
      return;
    }

    container.appendChild(canvasNode);

    const config = {
      list: data,
      weightFactor: 20,
      fontFamily: "Segoe UI Bold, sans-serif",
      color: (word: string, weight: number) => {
        return this.getRandomColor();
      },
      rotateRatio: 0.5,
      rotationSteps: 2,
      backgroundColor: this.backgroundColor,
      click: function(item: any) {
        console.log(item[0] + ": " + item[1]);
      }
    };

    this.cloud = WordCloudLib(canvasNode, config);
  }

  destroy() {
    super.destroy();
    if (!!this.cloud) {
      this.cloud = undefined;
    }
  }
}

VisualizationManager.registerVisualizer("text", WordCloud);
VisualizationManager.registerVisualizer("comment", WordCloud);
VisualizationManager.registerVisualizer("multipletext", WordCloud);
