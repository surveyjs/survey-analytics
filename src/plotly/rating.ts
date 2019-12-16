import { Question } from "survey-core";
var Plotly = <any>require("plotly.js-dist");
import { VisualizerBase } from "../visualizerBase";
import { VisualizationManager } from "../visualizationManager";
import { localization } from "../localizationManager";
import { ToolbarHelper } from "../utils/index";

export class GaugePlotly extends VisualizerBase {
  private _result: any;
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
      this._result = undefined;
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
        this.chartTypes.map(chartType => {
          return {
            value: chartType,
            text: localization.getString("chartType_" + chartType)
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
    this._result = undefined;
  }

  generateText(maxValue: number, minValue: number, stepsCount: number) {
    let texts: any = [];

    if (stepsCount === 5) {
      texts = [
        "very high (" + maxValue + ")",
        "high",
        "medium",
        "low",
        "very low (" + minValue + ")"
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

  private createChart() {
    const question = this.question;

    const rateValues = question.visibleRateValues;
    const maxValue = rateValues[rateValues.length - 1].value;
    const minValue = rateValues[0].value;

    const colors = this.generateColors(
      maxValue,
      minValue,
      GaugePlotly.stepsCount
    );

    var level = this.result;

    var data: any = [
      {
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [minValue, maxValue] },
          shape: this.chartType,
          bgcolor: "white",
          bar: { color: colors[0] }
        },
        value: level,
        text: question.name,
        domain: { x: [0, 1], y: [0, 1] }
      }
    ];

    var height = 400;

    if (this.chartType === "bullet") {
      height = 250;
    }

    var layout = {
      width: 600,
      height: height,
      plot_bgcolor: this.backgroundColor,
      paper_bgcolor: this.backgroundColor
    };

    const config = {
      displayModeBar: false,
      staticPlot: true
    };

    this.chart = Plotly.newPlot(this.chartNode, data, layout, config);
  }

  protected renderContent(container: HTMLDivElement) {
    this.createChart();
    container.appendChild(this.chartNode);
  }

  get result() {
    if (this._result === undefined) {
      const questionValues: Array<any> = [];

      this.data.forEach(rowData => {
        const questionValue: any = +rowData[this.question.name];
        if (!!questionValue) {
          questionValues.push(questionValue);
        }
      });

      this._result =
        (questionValues &&
          questionValues.reduce((a, b) => a + b, 0) / questionValues.length) ||
        0;
      this._result = Math.ceil(this._result * 100) / 100;
    }
    return this._result;
  }
}

VisualizationManager.registerVisualizer("rating", GaugePlotly);
