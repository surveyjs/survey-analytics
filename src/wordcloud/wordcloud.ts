import { Question, Event } from "survey-core";
import { VisualizerBase } from "../visualizerBase";
import { VisualizationManager } from "../visualizationManager";
import { textHelper } from "./stopwords/index";
import WordCloudLib from "wordcloud";
import { DocumentHelper } from "../utils";
import { localization } from "../localizationManager";

export class WordCloudAdapter {
  private _wordcloud: any;

  public static drawOutOfBound = false;
  public static shrinkToFit = true;
  public static abortThreshold: any = undefined;
  public static weightFactor = 20;

  public static onWordcloudCreating = new Event<
      (sender: WordCloud, options: any) => any,
      any
    >();

  constructor(private model: WordCloud) {}

  public get wordcloud() {
    return this._wordcloud;
  }

  public create(node: HTMLElement) {
    const data = this.model.getData();
    const colors = this.model.getColors();
    const canvasNode = <HTMLCanvasElement>(
      DocumentHelper.createElement("canvas", "")
    );
    const emptyTextNode = <HTMLElement>DocumentHelper.createElement("p", "", {
      innerText: localization.getString("noResults"),
    });

    if (data.length === 0) {
      node.appendChild(emptyTextNode);
      return;
    }

    node.appendChild(canvasNode);

    const config = {
      list: data,
      weightFactor: WordCloudAdapter.weightFactor,
      abortThreshold: WordCloudAdapter.abortThreshold,
      drawOutOfBound: WordCloudAdapter.drawOutOfBound,
      shrinkToFit: WordCloudAdapter.shrinkToFit,
      fontFamily: "Segoe UI Bold, sans-serif",
      color: (word: string, weight: number) => {
        return this.model.getRandomColor();
      },
      rotateRatio: 0.5,
      rotationSteps: 2,
      backgroundColor: this.model.backgroundColor,
      click: function (item: any) {
        // eslint-disable-next-line no-console
        console.log(item[0] + ": " + item[1]);
      },
    };

    const options = {
      canvas: canvasNode,
      config
    };
    WordCloudAdapter.onWordcloudCreating.fire(this.model, options);
    this._wordcloud = WordCloudLib(options.canvas, options.config);
    return this._wordcloud;
  }

  public destroy(node: HTMLElement) {
    this._wordcloud = undefined;
  }
}

export class WordCloud extends VisualizerBase {
  private _wordcloudAdapter: WordCloudAdapter;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "wordcloud");
    this._wordcloudAdapter = new WordCloudAdapter(this);
  }

  getData() {
    let result: { [key: string]: number } = {};

    let stopWords: string[] = [];
    const locale = localization.currentLocale;
    if (locale) {
      stopWords = textHelper.getStopWords(locale);
    } else {
      stopWords = textHelper.getStopWords();
    }

    let stopTheWord = (word: string) => {
      if (stopWords.indexOf(word) !== -1) {
        return "";
      }
      return word;
    };

    let processString = (row: string) => {
      row = "" + row;

      if (row.length > 15) row = row.substring(0, 14) + "...";

      if (!!row) {
        row.split(" ").forEach((word) => {
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

    this.data.forEach((row) => {
      const rowValue: any = row[this.question.name];
      if (!!rowValue) {
        if (Array.isArray(rowValue)) {
          rowValue.forEach(processString);
        } else {
          if (typeof rowValue === "object") {
            Object.keys(rowValue).forEach((key) =>
              processString(rowValue[key])
            );
          } else {
            processString(rowValue);
          }
        }
      }
    });

    return Object.keys(result).map((key) => {
      return [key, result[key]];
    });
  }

  protected destroyContent(container: HTMLElement) {
    this._wordcloudAdapter.destroy(container);
    super.destroyContent(container);
  }

  protected renderContent(container: HTMLElement) {
    this._wordcloudAdapter.create(container);
    this.afterRender(this.contentContainer);
  }

  destroy() {
    this._wordcloudAdapter.destroy(this.contentContainer);
    super.destroy();
  }
}

VisualizationManager.registerVisualizer("text", WordCloud);
VisualizationManager.registerVisualizer("comment", WordCloud);
VisualizationManager.registerVisualizer("multipletext", WordCloud);
