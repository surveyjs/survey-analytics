import { Question } from "survey-core";
import { ItemValue } from "survey-core";
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
    this.chartTypes = SelectBasePlotly.types;
    this.chartType = this.chartTypes[0];
  }

  private chart: Promise<Plotly.PlotlyHTMLElement>;
  private selectedItem: ItemValue = undefined;
  private filterText: HTMLSpanElement = undefined;
  private filter: HTMLDivElement = undefined;
  public static types = ["bar", "pie", "scatter"];

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

  setSelection(item: ItemValue, clearSelection: boolean = false) {
    this.selectedItem = item;
    this.updateFilter();
    this.onDataItemSelected((item && item.value) || undefined, clearSelection);
  }

  updateFilter() {
    this.filter.style.display = !!this.selectedItem ? "inline-block" : "none";
    this.filterText.innerHTML = !!this.selectedItem
      ? "Filter: [" + this.selectedItem.text + "]"
      : "";
  }

  protected createToolbarItems(toolbar: HTMLDivElement) {
    super.createToolbarItems(toolbar);
    this.filter = document.createElement("div");
    this.filter.className = "sva-question__filter";

    this.filterText = document.createElement("span");
    this.filterText.className = "sva-question__filter-text";
    this.filter.appendChild(this.filterText);

    const filterClear = document.createElement("span");
    filterClear.className = "sva-question__filter-clear";
    filterClear.innerHTML = "Clear";
    filterClear.onclick = () => {
      this.setSelection(undefined);
    };
    this.filter.appendChild(filterClear);

    // const filterClearAll = document.createElement("span");
    // filterClearAll.className = "sva-question__filter-clear";
    // filterClearAll.innerHTML = "Clear All";
    // filterClearAll.onclick = () => {
    //   this.setSelection(undefined, true);
    // };
    // this.filter.appendChild(filterClearAll);

    toolbar.appendChild(this.filter);

    this.updateFilter();
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
      y: labels.map(l => {
        if (l.length > 30) {
          return l.substring(0, 27) + "...";
        }
        return l;
      }),
      text: labels,
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

    const plot = Plotly.newPlot(chartNode, traces, layout, config);

    (<any>chartNode)["on"]("plotly_click", (data: any) => {
      if (data.points.length > 0 && this.onDataItemSelected) {
        const itemText = data.points[0].text;
        const item: ItemValue = this.question.choices.filter(
          (choice: ItemValue) => choice.text === itemText
        )[0];
        this.setSelection(item, !data.event.ctrlKey);
      }
    });

    var dragLayer = <HTMLElement>(
      chartNode.getElementsByClassName("nsewdrag")[0]
    );
    (<any>chartNode)["on"]("plotly_hover", () => {
      dragLayer.style.cursor = "pointer";
    });
    (<any>chartNode)["on"]("plotly_unhover", () => {
      dragLayer.style.cursor = "";
    });

    return plot;
  }
}

VisualizationManager.registerVisualizer("checkbox", SelectBasePlotly);
VisualizationManager.registerVisualizer("radiogroup", SelectBasePlotly);
VisualizationManager.registerVisualizer("dropdown", SelectBasePlotly);
VisualizationManager.registerVisualizer("imagepicker", SelectBasePlotly);
