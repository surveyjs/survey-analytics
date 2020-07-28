import { Question } from "survey-core";
import { NumberModel } from "../number";
import { VisualizationManager } from "../visualizationManager";
import { allowDomRendering, DataHelper, DocumentHelper } from "../utils/index";
import { localization } from "../localizationManager";

var Plotly: any = null;
if (allowDomRendering()) {
  Plotly = <any>require("plotly.js-dist");
}

export class PlotlyGaugeAdapter {
  private _chart: Promise<Plotly.PlotlyHTMLElement> = undefined;

  constructor(private model: GaugePlotly) {}

  public get chart() {
    return this._chart;
  }

  public create(chartNode: HTMLElement) {
    const question = this.model.question;
    let [level, minValue, maxValue] = this.model.getData();

    if (question.getType() === "rating") {
      const rateValues = question.visibleRateValues;
      maxValue = rateValues[rateValues.length - 1].value;
      minValue = rateValues[0].value;
    }

    const colors = this.model.generateColors(
      maxValue,
      minValue,
      GaugePlotly.stepsCount
    );

    if (GaugePlotly.showAsPercentage) {
      level = DataHelper.toPercentage(level, maxValue);
      minValue = DataHelper.toPercentage(minValue, maxValue);
      maxValue = DataHelper.toPercentage(maxValue, maxValue);
    }

    var data: any = [
      {
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [minValue, maxValue] },
          shape: this.model.chartType,
          bgcolor: "white",
          bar: { color: colors[0] },
        },
        value: level,
        text: question.name,
        domain: { x: [0, 1], y: [0, 1] },
      },
    ];

    var height = 400;

    if (this.model.chartType === "bullet") {
      height = 250;
    }

    var layout = {
      width: 600,
      height: height,
      plot_bgcolor: this.model.backgroundColor,
      paper_bgcolor: this.model.backgroundColor,
    };

    const config = {
      displayModeBar: false,
      staticPlot: true,
      locale: localization.currentLocale,
    };

    return Plotly.newPlot(chartNode, data, layout, config);
  }

  public destroy(node: HTMLElement) {
    Plotly.purge(node);
    this._chart = undefined;
  }
}

export class GaugePlotly extends NumberModel {
  private _chartAdapter: PlotlyGaugeAdapter;

  public static types = ["gauge", "bullet"];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    this.chartTypes = GaugePlotly.types;
    this.chartType = this.chartTypes[0];
    this._chartAdapter = new PlotlyGaugeAdapter(this);
  }

  protected destroyContent(container: HTMLElement) {
    this._chartAdapter.destroy(<HTMLElement>container.children[0]);
    super.destroyContent(container);
  }

  protected renderContent(container: HTMLElement) {
    const chartNode: HTMLElement = DocumentHelper.createElement("div");
    container.appendChild(chartNode);
    this._chartAdapter.create(chartNode);
  }
}

VisualizationManager.registerVisualizer("number", GaugePlotly);
VisualizationManager.registerVisualizer("rating", GaugePlotly);
