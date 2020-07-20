import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { ToolbarHelper } from "./utils/index";

export class Number extends VisualizerBase {
  private _resultAverage: any;
  private _resultMin: any;
  private _resultMax: any;

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

  update(data: Array<{ [index: string]: any }>) {
    if (data !== undefined) {
      this._resultAverage = undefined;
    }
    super.update(data);
    this.destroyContent(this.contentContainer);
    this.renderContent(this.contentContainer);
    this.invokeOnUpdate();
  }

  private toolbarChangeHandler = (e: any) => {
    if (this.chartType !== e.target.value) {
      this.chartType = e.target.value;
      this.update(this.data);
    }
  };

  protected createToolbarItems(toolbar: HTMLDivElement) {
    if (this.chartTypes.length > 1) {
      const selectWrapper = ToolbarHelper.createSelector(
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

    if (!!Number.generateTextsCallback) {
      return Number.generateTextsCallback(
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

  protected toPercentage(value: number, maxValue: number) {
    return (value / maxValue) * 100;
  }

  get result() {
    if (this._resultAverage === undefined) {
      const questionValues: Array<any> = [];

      this.data.forEach((rowData) => {
        const questionValue: any = +rowData[this.question.name];
        if (!!questionValue) {
          questionValues.push(questionValue);
        }
      });

      this._resultAverage =
        (questionValues &&
          questionValues.reduce((a, b) => a + b, 0) / questionValues.length) ||
        0;
      this._resultAverage = Math.ceil(this._resultAverage * 100) / 100;
    }
    return this._resultAverage;
  }

  get resultMax() {
    if (this._resultMax === undefined) {
      this._resultMax = 0;

      this.data.forEach((rowData) => {
        const questionValue: any = +rowData[this.question.name];
        if (!!questionValue && this._resultMax < questionValue) {
          this._resultMax = questionValue;
        }
      });
    }
    return this._resultMax;
  }

  get resultMin() {
    if (this._resultMin === undefined) {
      this._resultMin = 0;

      this.data.forEach((rowData) => {
        const questionValue: any = +rowData[this.question.name];
        if (!!questionValue && this._resultMin > questionValue) {
          this._resultMin = questionValue;
        }
      });
    }
    return this._resultMin;
  }
}
