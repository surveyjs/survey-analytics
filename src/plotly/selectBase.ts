import { Question } from "survey-core";
import { ItemValue } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { SelectBase } from "../selectBase";

export function canLoadPlotly() {
  return !!window.URL.createObjectURL;
}

var Plotly: any;
if (canLoadPlotly()) {
  Plotly = <any>require("plotly.js-dist");
}

export class SelectBasePlotly extends SelectBase {
  constructor(
    protected targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
    this.chartTypes = SelectBasePlotly.types;
    this.chartType = this.chartTypes[0];
  }

  private chart: Promise<Plotly.PlotlyHTMLElement>;
  private filterText: HTMLSpanElement = undefined;
  private filter: HTMLDivElement = undefined;
  public static types = ["bar", "pie", "doughnut", "scatter"];

  update(data: Array<{ [index: string]: any }>) {
    super.update(data);
    this.destroy();
    this.chart = this.getPlotlyChart(this.chartNode, this.chartType);
    this.invokeOnUpdate();
  }

  destroy() {
    Plotly.purge(this.chartNode);
  }

  createChart() {
    this.chart = this.getPlotlyChart(this.chartNode, this.chartType);
  }

  protected getSelectedItemByText(itemText: string) {
    return this.question.choices.filter(
      (choice: ItemValue) => choice.text === itemText
    )[0];
  }

  protected patchConfigParameters(
    chartNode: object,
    traces: Array<object>,
    layout: object,
    config: object
  ) {}

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
      y: labels.map(l => {
        if (l.length > 30) {
          return l.substring(0, 27) + "...";
        }
        return l;
      }),
      text: labels,
      orientation: "h",
      mode: "markers",
      width: 0.5,
      marker: {}
    };

    if (this.chartType === "pie" || this.chartType === "doughnut") {
      traceConfig["marker"].colors = colors;
    } else if (this.chartType === "bar") {
      traceConfig["marker"].color = colors;
    }

    if (this.chartType === "doughnut") {
      traceConfig.type = "pie";
      traceConfig.hole = 0.4;
    }

    if (datasets.length === 1) {
      traceConfig["marker"].symbol = "circle";
      traceConfig["marker"].size = 16;
    }

    datasets.forEach(dataset => {
      if (this.chartType === "pie" || this.chartType === "doughnut") {
        traces.push(
          Object.assign({}, traceConfig, {
            values: dataset,
            labels: labels
          })
        );
      } else {
        traces.push(Object.assign({}, traceConfig, { x: dataset }));
      }
    });

    const height =
      chartType === "pie" || this.chartType === "doughnut"
        ? labels.length < 10
          ? labels.length * 50 + 100
          : 550
        : (labels.length + (labels.length + 1) * 0.5) * 20;

    const layout: any = {
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

    this.patchConfigParameters(chartNode, traces, layout, config);

    const plot = Plotly.newPlot(chartNode, traces, layout, config);

    (<any>chartNode)["on"]("plotly_click", (data: any) => {
      if (data.points.length > 0 && this.onDataItemSelected) {
        const itemText = data.points[0].text;
        const item: ItemValue = this.getSelectedItemByText(itemText);
        this.setSelection(item);
      }
    });

    var getDragLayer = () =>
      <HTMLElement>chartNode.getElementsByClassName("nsewdrag")[0];
    (<any>chartNode)["on"]("plotly_hover", () => {
      const dragLayer = getDragLayer();
      dragLayer && (dragLayer.style.cursor = "pointer");
    });
    (<any>chartNode)["on"]("plotly_unhover", () => {
      const dragLayer = getDragLayer();
      dragLayer && (dragLayer.style.cursor = "");
    });

    return plot;
  }
}

VisualizationManager.registerVisualizer("checkbox", SelectBasePlotly);
VisualizationManager.registerVisualizer("radiogroup", SelectBasePlotly);
VisualizationManager.registerVisualizer("dropdown", SelectBasePlotly);
VisualizationManager.registerVisualizer("imagepicker", SelectBasePlotly);
