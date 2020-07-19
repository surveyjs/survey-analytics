import { Question } from "survey-core";
import { Number } from "../number";
import { VisualizationManager } from "../visualizationManager";
import { allowDomRendering } from "../utils/index";

var Plotly: any = null;
if (allowDomRendering()) {
  Plotly = <any>require("plotly.js-dist");
}

export class GaugePlotly extends Number {
  private chart: Promise<Plotly.PlotlyHTMLElement>;

  public static types = ["gauge", "bullet"];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    this.chartTypes = GaugePlotly.types;
    this.chartType = this.chartTypes[0];
  }

  private createChart(chartNode: HTMLElement) {
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

    return Plotly.newPlot(chartNode, data, layout, config);
  }

  protected destroyContent(container: HTMLElement) {
    Plotly.purge(container.children[0]);
    super.destroyContent(container);
  }

  protected renderContent(container: HTMLElement) {
    const chartNode: HTMLElement = <HTMLElement>document.createElement("div");
    container.appendChild(chartNode);
    this.chart = this.createChart(chartNode);
  }
}

VisualizationManager.registerVisualizer("number", GaugePlotly);
VisualizationManager.registerVisualizer("rating", GaugePlotly);
