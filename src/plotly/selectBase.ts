import { Question } from "survey-core";
import { ItemValue } from "survey-core";
import { SelectBase } from "../selectBase";
import { VisualizationManager } from "../visualizationManager";
import { allowDomRendering, DataHelper, DocumentHelper } from "../utils";
import { localization } from "../localizationManager";

var Plotly: any = null;
if (allowDomRendering()) {
  Plotly = <any>require("plotly.js-dist");
}

export class PlotlyChartAdapter {
  private _chart: Promise<Plotly.PlotlyHTMLElement> = undefined;

  constructor(protected model: SelectBase) {}

  protected patchConfigParameters(
    chartNode: object,
    traces: Array<object>,
    layout: object,
    config: object
  ) {}

  public get chart() {
    return this._chart;
  }

  public create(chartNode: HTMLElement) {
    let datasets = this.model.getData();
    let seriesValues = this.model.getSeriesValues();
    let seriesLabels = this.model.getSeriesLabels();
    let labels = this.model.getLabels();
    let colors = this.model.getColors();
    const traces: any = [];
    const hasSeries = datasets.length > 1 && seriesValues.length > 1;

    if (
      this.model.orderByAnsweres == "asc" ||
      this.model.orderByAnsweres == "desc"
    ) {
      let dict = DataHelper.sortDictionary(
        DataHelper.zipArrays(labels, colors),
        datasets[0],
        this.model.orderByAnsweres == "desc"
      );
      let labelsAndColors = DataHelper.unzipArrays(dict.keys);
      labels = labelsAndColors.first;
      colors = labelsAndColors.second;
      datasets[0] = dict.values;
    }
    const traceConfig: any = {
      type: this.model.chartType,
      y: (hasSeries ? seriesLabels : labels).map((l) => {
        if (l.length > 30) {
          return l.substring(0, 27) + "...";
        }
        return l;
      }),
      text: hasSeries ? seriesLabels : labels,
      hoverinfo: "x+y",
      orientation: "h",
      mode: "markers",
      width: 0.5,
      marker: <any>{},
    };

    if (this.model.chartType === "pie" || this.model.chartType === "doughnut") {
      traceConfig.hoverinfo = "text+value+percent";
      traceConfig.marker.colors = colors;
      traceConfig.textposition = "inside";
    } else if (this.model.chartType === "bar") {
      traceConfig.marker.color = colors;
    }

    if (this.model.chartType === "doughnut") {
      traceConfig.type = "pie";
      traceConfig.hole = 0.4;
    }

    if (!hasSeries) {
      traceConfig.marker.symbol = "circle";
      traceConfig.marker.size = 16;
    }

    datasets.forEach((dataset: Array<number>) => {
      if (
        this.model.chartType === "pie" ||
        this.model.chartType === "doughnut"
      ) {
        traces.push(
          Object.assign({}, traceConfig, {
            values: dataset,
            labels: hasSeries ? seriesLabels : labels,
          })
        );
      } else {
        traces.push(Object.assign({}, traceConfig, { x: dataset }));
      }
    });

    const height =
      this.model.chartType === "pie" || this.model.chartType === "doughnut"
        ? labels.length < 10
          ? labels.length * 50 + 100
          : 550
        : (labels.length + (labels.length + 1) * 0.5) * 20;

    const layout: any = {
      font: {
        family: "Segoe UI, sans-serif",
        size: 14,
        weight: "normal",
        color: "#404040",
      },
      height: height,
      margin: {
        t: 0,
        b: 0,
        r: 10,
      },
      colorway: colors,
      hovermode: "closest",
      yaxis: {
        automargin: true,
        type: "category",
        ticklen: 5,
        tickcolor: "transparent",
      },
      xaxis: {
        rangemode: "nonnegative",
        automargin: true,
      },
      plot_bgcolor: this.model.backgroundColor,
      paper_bgcolor: this.model.backgroundColor,
      showlegend: false,
    };

    let config: any = {
      displaylogo: false,
      responsive: true,
      locale: localization.currentLocale,
    };
    if (SelectBasePlotly.displayModeBar !== undefined) {
      config.displayModeBar = SelectBasePlotly.displayModeBar;
    }

    if (hasSeries) {
      layout.showlegend = true;
      if (
        this.model.chartType === "pie" ||
        this.model.chartType === "doughnut"
      ) {
        layout.grid = { rows: 1, columns: traces.length };
      } else if (this.model.chartType === "stackedbar") {
        layout.height = undefined;
        layout.barmode = "stack";
      } else {
        layout.height = undefined;
      }
      labels.forEach((label, index) => {
        if (
          this.model.chartType === "pie" ||
          this.model.chartType === "doughnut"
        ) {
          traces[index].domain = { column: index };
        } else {
          traces[index].hoverinfo = "x+name";
          traces[index].marker.color = undefined;
          if (this.model.chartType === "stackedbar") {
            traces[index].type = "bar";
            traces[index].name = label;
            traces[index].width = 0.5 / traces.length;
          } else {
            traces[index].name = label;
            traces[index].width = 0.5 / traces.length;
          }
        }
      });
    }

    this.patchConfigParameters(chartNode, traces, layout, config);

    const plot = Plotly.newPlot(chartNode, traces, layout, config);

    (<any>chartNode)["on"]("plotly_click", (data: any) => {
      if (data.points.length > 0) {
        const itemText = hasSeries
          ? data.points[0].data.name
          : data.points[0].text;
        const item: ItemValue = this.model.getSelectedItemByText(itemText);
        this.model.setSelection(item);
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

    this._chart = plot;
    return plot;
  }

  public destroy(node: HTMLElement) {
    Plotly.purge(node);
    this._chart = undefined;
  }
}

export class SelectBasePlotly extends SelectBase {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["bar", "pie", "doughnut", "scatter"];
  public static displayModeBar: any = undefined;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    this.chartTypes = SelectBasePlotly.types;
    this.chartType = this.chartTypes[0];
    this._chartAdapter = new PlotlyChartAdapter(this);
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

  getData(): any[] {
    const statistics = super.getData();
    const series = this.getSeriesValues();
    const values = this.getValues();
    if (series.length > 1) {
      const preparedData: Array<Array<number>> = [];
      values.forEach((val, valueIndex) => {
        const seriesData = series.map(
          (seriesValue, seriesIndex) => statistics[seriesIndex][valueIndex]
        );
        preparedData.push(seriesData);
      });
      return preparedData;
    }
    return statistics;
  }
}

VisualizationManager.registerVisualizer("checkbox", SelectBasePlotly);
VisualizationManager.registerVisualizer("radiogroup", SelectBasePlotly);
VisualizationManager.registerVisualizer("dropdown", SelectBasePlotly);
VisualizationManager.registerVisualizer("imagepicker", SelectBasePlotly);
