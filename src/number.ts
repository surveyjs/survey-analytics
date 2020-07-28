import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils/index";

export class NumberModel extends VisualizerBase {
  private _resultAverage: number;
  private _resultMin: number;
  private _resultMax: number;

  public static stepsCount = 5;
  public static generateTextsCallback: (
    question: Question,
    maxValue: number,
    minValue: number,
    stepsCount: number,
    texts: string[]
  ) => string[];

  protected chartTypes: Array<string>;
  chartType: String;

  public static showAsPercentage = false;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
  }

  public get name() {
    return "number";
  }

  updateData(data: Array<{ [index: string]: any }>) {
    this._resultAverage = undefined;
    this._resultMin = undefined;
    this._resultMax = undefined;
    super.updateData(data);
    this.refresh();
  }

  private toolbarChangeHandler = (e: any) => {
    if (this.chartType !== e.target.value) {
      this.chartType = e.target.value;
      this.updateData(this.data);
    }
  };

  protected createToolbarItems(toolbar: HTMLDivElement) {
    if (this.chartTypes.length > 1) {
      const selectWrapper = DocumentHelper.createSelector(
        this.chartTypes.map((chartType) => {
          return {
            value: chartType,
            text: localization.getString("chartType_" + chartType),
          };
        }),
        (option: any) => this.chartType === option.value,
        this.toolbarChangeHandler
      );
      toolbar.appendChild(selectWrapper);
    }
    super.createToolbarItems(toolbar);
  }

  destroy() {
    this.destroyContent(this.contentContainer);
    this._resultAverage = undefined;
    super.destroy();
  }

  generateText(maxValue: number, minValue: number, stepsCount: number) {
    let texts: any = [];

    if (stepsCount === 5) {
      texts = [
        "very high (" + maxValue + ")",
        "high",
        "medium",
        "low",
        "very low (" + minValue + ")",
      ];
    } else {
      texts.push(maxValue);
      for (let i = 0; i < stepsCount - 2; i++) {
        texts.push("");
      }
      texts.push(minValue);
    }

    if (!!NumberModel.generateTextsCallback) {
      return NumberModel.generateTextsCallback(
        this.question,
        maxValue,
        minValue,
        stepsCount,
        texts
      );
    }

    return texts;
  }

  generateValues(maxValue: number, stepsCount: number) {
    const values = [];

    for (let i = 0; i < stepsCount; i++) {
      values.push(maxValue / stepsCount);
    }

    values.push(maxValue);

    return values;
  }

  generateColors(maxValue: number, minValue: number, stepsCount: number) {
    const palette = this.getColors();
    const colors = [];

    for (let i = 0; i < stepsCount; i++) {
      colors.push(palette[i]);
    }

    colors.push("rgba(255, 255, 255, 0)");

    return colors;
  }

  getData() {
    if (
      this._resultAverage === undefined ||
      this._resultMin === undefined ||
      this._resultMax === undefined
    ) {
      const questionValues: Array<any> = [];
      this._resultMin = Number.MAX_VALUE;
      this._resultMax = -Number.MAX_VALUE;

      this.data.forEach((rowData) => {
        const questionValue: number = +rowData[this.question.name];
        if (questionValue !== undefined) {
          questionValues.push(questionValue);
          if (this._resultMin > questionValue) {
            this._resultMin = questionValue;
          }
          if (this._resultMax < questionValue) {
            this._resultMax = questionValue;
          }
        }
      });

      this._resultAverage =
        questionValues.reduce((a, b) => a + b, 0) / questionValues.length;
      this._resultAverage = Math.ceil(this._resultAverage * 100) / 100;
    }
    return [this._resultAverage, this._resultMin, this._resultMax];
  }
}
