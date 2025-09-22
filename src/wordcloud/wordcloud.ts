import { Question, Event } from "survey-core";
import { ICalculationResult, VisualizerBase } from "../visualizerBase";
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
    const answersData = await this.model.getAnswersData();

    if (answersData.datasets.length === 0 || answersData.datasets[0].length === 0) {
      var emptyTextNode = DocumentHelper.createElement("p", "", {
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
    this._wordcloud.words = answersData.values.map((w, i) => [w, answersData.datasets[0][i]]);
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
  private _values = [];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    type?: string
  ) {
    super(question, data, options, type || "wordcloud");
    this._wordcloudAdapter = new WordCloudAdapter(this);
  }

  public convertFromExternalData(externalCalculatedData: any): ICalculationResult {
    this._values = Object.keys(externalCalculatedData || {});

    return {
      data: [this._values.map(w => externalCalculatedData[w])],
      values: this._values
    };
  }

  public getValues(): Array<any> {
    return this._values;
  }

  protected getCalculatedValuesCore(): ICalculationResult {
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

    this._values = Object.keys(result);
    return {
      data: [this._values.map(w => result[w])],
      values: this._values
    };
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
