import { Question } from "survey-core";
var Plotly = <any>require("plotly.js-dist");
import { VisualizationManager } from "../visualizationManager";
import { SelectBase } from "../selectBase";

export class SelectBasePlotly extends SelectBase {
  constructor(
    protected targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
  }

  private chart: Promise<Plotly.PlotlyHTMLElement>;
  protected chartTypes = ["bar", "pie", "scatter"];
  chartType = "bar";
  chartNode = <HTMLElement>document.createElement("div");

  destroy() {
    Plotly.purge(this.chartNode);
  }

  toolbarChangeHandler = (e: any) => {
    if (this.chartType !== e.target.value) {
      this.chartType = e.target.value;
      this.destroy();
      this.chart = this.getPlotlyChart(this.chartNode, this.chartType);
      this.invokeOnUpdate();
    }
  };

  createChart() {
    this.chart = this.getPlotlyChart(this.chartNode, this.chartType);
  }

  private getPlotlyChart(
    chartNode: HTMLElement,
    chartType: string
  ): Promise<Plotly.PlotlyHTMLElement> {
    const question = this.question;
    const datasets = this.getData();
    const labels = this.getLabels();
    const traces: any = [];
    const colors = this.getColors();

    const traceConfig: any = {
      type: chartType,
      y: labels,
      labels: labels,
      orientation: "h",
      mode: "markers",
      width: 0.5
    };

    if (datasets.length === 1) {
      traceConfig["marker"] = { color: colors };
    }

    datasets.forEach(dataset => {
      if (this.chartType === "pie") {
        traces.push(Object.assign({}, traceConfig, { values: dataset }));
      } else {
        traces.push(Object.assign({}, traceConfig, { x: dataset }));
      }
    });

    const height =
      chartType === "pie"
        ? 450
        : (labels.length + (labels.length + 1) * 0.5) * 20;

    const layout: any = {
      // title: question.name,
      font: {
        family: "Segoe UI, sans-serif",
        size: 14,
        weight: "normal",
        color: "#404040"
      },
      height: height,
      margin: {
        t: 0,
        b: 0,
        r: 10
      },
      colorway: colors,
      yaxis: {
        automargin: true,
        type: "category",
        ticklen: 5,
        tickcolor: "transparent"
      },
      xaxis: {
        automargin: true
      },
      plot_bgcolor: this.backgroundColor,
      paper_bgcolor: this.backgroundColor
    };

    const config = {
      displaylogo: false,
      responsive: true
    };

    return Plotly.newPlot(chartNode, traces, layout, config);
  }
}

VisualizationManager.registerVisualizer("checkbox", SelectBasePlotly);
VisualizationManager.registerVisualizer("radiogroup", SelectBasePlotly);
VisualizationManager.registerVisualizer("dropdown", SelectBasePlotly);
VisualizationManager.registerVisualizer("imagepicker", SelectBasePlotly);
