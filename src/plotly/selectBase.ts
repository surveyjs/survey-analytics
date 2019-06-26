import { Question } from "survey-core";
import Plotly from "plotly.js";
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
  protected chartTypes = ["bar", "scatter"];
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
    const data = this.getData();
    const labels = this.getLabels();

    const colors = this.getColors();

    const trace1: any = [
      {
        type: chartType,
        y: labels,
        x: data[0],
        orientation: "h",
        mode: "markers",
        marker: {
          color: colors
        }
      }
    ];

    const layout: any = {
      title: question.name,
      colorway: colors,
      yaxis: {
        automargin: true
      },
      xaxis: {
        automargin: true
      }
    };

    const config = {
      displaylogo: false
    };

    return Plotly.newPlot(chartNode, trace1, layout, config);
  }
}

VisualizationManager.registerVisualizer("checkbox", SelectBasePlotly);
VisualizationManager.registerVisualizer("radiogroup", SelectBasePlotly);
VisualizationManager.registerVisualizer("dropdown", SelectBasePlotly);
VisualizationManager.registerVisualizer("imagepicker", SelectBasePlotly);
