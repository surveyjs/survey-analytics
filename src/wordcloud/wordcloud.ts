import { Question, Event } from "survey-core";
import { VisualizerBase } from "../visualizerBase";
import { VisualizationManager } from "../visualizationManager";
import { textHelper } from "./stopwords/index";
import { DocumentHelper } from "../utils";
import { localization } from "../localizationManager";
import { WordCloudWidget, defaultOptions } from "./widget";

export class WordCloudAdapter {
  private _wordcloud: any;

  public static drawOutOfBound = false;
  public static shrinkToFit = true;
  public static abortThreshold: any = undefined;
  public static weightFactor = 20;

  public static onWordcloudCreating = new Event<
      (sender: WordCloud, options: any) => any,
      WordCloud,
      any
    >();

  constructor(private model: WordCloud) {}

  public get wordcloud(): any {
    return this._wordcloud;
  }

  public async create(element: HTMLElement): Promise<any> {
    const data = await this.model.getCalculatedValues();

    if (data.length === 0) {
      const emptyTextNode = <HTMLElement>DocumentHelper.createElement("p", "", {
        innerText: localization.getString("noResults"),
      });
      element.appendChild(emptyTextNode);
      return;
    }

    const config = JSON.parse(JSON.stringify(defaultOptions));
    const options = {
      config
    };
    WordCloudAdapter.onWordcloudCreating.fire(this.model, options);
    this._wordcloud = new WordCloudWidget(config);
    this._wordcloud.colors = VisualizerBase.getColors();
    this._wordcloud.words = data;
    this._wordcloud.render(element);
    return this._wordcloud;
  }

  public destroy(node: HTMLElement): void {
    if(this._wordcloud && typeof this._wordcloud.dispose === "function") {
      this._wordcloud.dispose();
    }
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

  public convertFromExternalData(externalCalculatedData: any): any[] {
    const innerCalculatedData = [];
    Object.keys(externalCalculatedData || []).forEach(word => {
      innerCalculatedData.push([word, externalCalculatedData[word]]);
    });
    return innerCalculatedData;
  }

  protected getCalculatedValuesCore(): Array<any> {
    let result: { [key: string]: number } = {};

    let stopWords: string[] = [];
    const locale = localization.currentLocale;
    if (locale) {
      stopWords = textHelper.getStopWords(locale);
    } else {
      stopWords = textHelper.getStopWords();
    }
    const clearWordRegexp = new RegExp("[.,\/#!$%\^\*;:{}=\-_`~()]", "g");

    const stopTheWord = (word: string) => {
      if (stopWords.indexOf(word) !== -1) {
        return "";
      }
      return word;
    };

    const processString = (row: string) => {
      row = "" + row;
      // if (row.length > 15) row = row.substring(0, 14) + "...";

      if (!!row) {
        row.split(" ").forEach((word) => {
          let clearedWord = (word || "").toLowerCase().replace(clearWordRegexp, "");
          clearedWord = stopTheWord(clearedWord);
          if (!!clearedWord) {
            if (!result[clearedWord]) {
              result[clearedWord] = 1;
            } else {
              result[clearedWord]++;
            }
          }
        });
      }
    };

    this.surveyData.forEach((row) => {
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

  protected async renderContentAsync(container: HTMLElement) {
    const chartNode: HTMLElement = DocumentHelper.createElement("div");
    container.appendChild(chartNode);
    await this._wordcloudAdapter.create(chartNode);
    container.innerHTML = "";
    container.appendChild(chartNode);
    return container;
  }

  destroy() {
    this._wordcloudAdapter.destroy(this.contentContainer);
    super.destroy();
  }
}

VisualizationManager.registerVisualizer("text", WordCloud);
VisualizationManager.registerVisualizer("comment", WordCloud);
VisualizationManager.registerVisualizer("multipletext", WordCloud);
