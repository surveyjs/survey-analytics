import { Question } from "survey-core";
var Plotly = <any>require("plotly.js-dist");
import { VisualizerBase } from "../visualizerBase";
import { VisualizationManager } from "../visualizationManager";
import { localization } from "../localizationManager";
import { ToolbarHelper } from "../utils/index";

export class GaugePlotly extends VisualizerBase {
  private _resultAverage: any;
  private _resultMin: any;
  private _resultMax: any;
  private chart: Promise<Plotly.PlotlyHTMLElement>;

  public static stepsCount = 5;
  public static generateTextsCallback: (
    question: Question,
    maxValue: number,
    minValue: number,
    stepsCount: number,
    texts: string[]
  ) => string[];

  public static types = ["gauge", "bullet"];
  protected chartTypes: Array<string>;
  chartType: String;
  chartNode = <HTMLElement>document.createElement("div");

  public static showAsPercentage = false;

  constructor(
    protected targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
    this.chartTypes = GaugePlotly.types;
    this.chartType = this.chartTypes[0];
  }

  update(data: Array<{ [index: string]: any }>) {
    if (data !== undefined) {
      this._resultAverage = undefined;
    }
    super.update(data);
    this.destroy();
    this.createChart();
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
        toolbar,
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
    Plotly.purge(this.chartNode);
    this._resultAverage = undefined;
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

    if (!!GaugePlotly.generateTextsCallback) {
      return GaugePlotly.generateTextsCallback(
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

  private toPercentage(value: number, maxValue: number) {
    return (value / maxValue) * 100;
  }

  private createChart() {
    const question = this.question;
    let maxValue;
    let minValue;

    if (question.getType() === "text") {
      maxValue = this.resultMax;
      minValue = this.resultMin;
    } else {
      const rateValues = question.visibleRateValues;
      maxValue = rateValues[rateValues.length - 1].value;
      minValue = rateValues[0].value;
    }

    const colors = this.generateColors(
      maxValue,
      minValue,
      GaugePlotly.stepsCount
    );

    var level = this.result;

    if (GaugePlotly.showAsPercentage) {
      level = this.toPercentage(level, maxValue);
      minValue = this.toPercentage(minValue, maxValue);
      maxValue = this.toPercentage(maxValue, maxValue);
    }

    var data: any = [
      {
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [minValue, maxValue] },
          shape: this.chartType,
          bgcolor: "white",
          bar: { color: colors[0] },
        },
        value: level,
        text: question.name,
        domain: { x: [0, 1], y: [0, 1] },
      },
    ];

    var height = 400;

    if (this.chartType === "bullet") {
      height = 250;
    }

    var layout = {
      width: 600,
      height: height,
      plot_bgcolor: this.backgroundColor,
      paper_bgcolor: this.backgroundColor,
    };

    const config = {
      displayModeBar: false,
      staticPlot: true,
    };

    this.chart = Plotly.newPlot(this.chartNode, data, layout, config);
  }

  protected renderContent(container: HTMLDivElement) {
    this.createChart();
    container.appendChild(this.chartNode);
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

VisualizationManager.registerVisualizer("number", GaugePlotly);
VisualizationManager.registerVisualizer("rating", GaugePlotly);
