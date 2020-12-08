import { Question, ItemValue, Event } from "survey-core";
import { SelectBase } from "../selectBase";
import { VisualizationManager } from "../visualizationManager";
import { allowDomRendering, DataHelper, DocumentHelper } from "../utils";
import { localization } from "../localizationManager";
import Plotly from "plotly.js";

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
    var plotlyOptions = PlotlySetup.setup(this.model.chartType, this.model);

    let config: any = {
      displaylogo: false,
      responsive: true,
      locale: localization.currentLocale,
      modeBarButtonsToRemove: ["toImage"],
      modeBarButtonsToAdd: [
        {
          name: "toImageSjs",
          title: localization.getString("saveDiagramAsPNG"),
          icon: (<any>Plotly).Icons.camera,
          click: (gd: any) => {
            let options = {
              format: PlotlySetup.imageExportFormat,
              // width: 800,
              // height: 600,
              filename: this.model.question.name,
            };
            PlotlySetup.onImageSaving.fire(this.model, options);
            (<any>Plotly).downloadImage(gd, options);
          },
        },
      ],
    };
    if (SelectBasePlotly.displayModeBar !== undefined) {
      config.displayModeBar = SelectBasePlotly.displayModeBar;
    }

    this.patchConfigParameters(
      chartNode,
      plotlyOptions.traces,
      plotlyOptions.layout,
      config
    );

    let options = {
      traces: plotlyOptions.traces,
      layout: plotlyOptions.layout,
      config: config,
    };
    PlotlySetup.onPlotCreating.fire(this.model, options);

    const plot = (<any>Plotly).newPlot(
      chartNode,
      plotlyOptions.traces,
      plotlyOptions.layout,
      config
    );

    (<any>chartNode)["on"]("plotly_click", (data: any) => {
      if (data.points.length > 0) {
        const itemText = plotlyOptions.hasSeries
          ? data.points[0].data.name
          : Array.isArray(data.points[0].customdata)
          ? data.points[0].customdata[0]
          : data.points[0].customdata;
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
    (<any>Plotly).purge(node);
    this._chart = undefined;
  }
}

export interface PlotlyOptions {
  traces: Array<any>;
  layout: any;
  hasSeries: boolean;
}

export class PlotlySetup {
  public static imageExportFormat = "png";
  /**
   * Fires when end user clicks on the 'save as image' button.
   */
  public static onImageSaving = new Event<
    (sender: SelectBasePlotly, options: any) => any,
    any
  >();

  /**
   * Fires before plot will be created. User can change traces, layout and config of the plot.
   * Options is an object with the following fields: traces, layout and config of the plot.
   */
  public static onPlotCreating = new Event<
    (sender: SelectBasePlotly, options: any) => any,
    any
  >();

  static setups: { [type: string]: (model: SelectBase) => PlotlyOptions } = {
    bar: PlotlySetup.setupBar,
    stackedbar: PlotlySetup.setupBar,
    doughnut: PlotlySetup.setupPie,
    pie: PlotlySetup.setupPie,
    scatter: PlotlySetup.setupScatter,
  };

  static setup(charType: string, model: SelectBase): PlotlyOptions {
    return this.setups[charType](model);
  }

  static getTruncatedLabel = (label: string, labelTruncateLength: number) => {
    const truncateSymbols = "...";
    const truncateSymbolsLength = truncateSymbols.length;

    if (!labelTruncateLength) return label;
    if (labelTruncateLength === -1) return label;
    if (label.length <= labelTruncateLength + truncateSymbolsLength)
      return label;

    return label.substring(0, labelTruncateLength) + truncateSymbols;
  };

  static setupPie(model: SelectBase): PlotlyOptions {
    let seriesValues = model.getSeriesValues();
    let seriesLabels = model.getSeriesLabels();
    let { datasets, labels, colors, texts } = model.getAnswersData();

    const traces: any = [];
    const hasSeries = datasets.length > 1 && seriesValues.length > 1;

    const traceConfig: any = {
      type: model.chartType,
      y: hasSeries ? seriesLabels : labels,
      text: (hasSeries ? seriesLabels : labels).map((label: string) => {
        return PlotlySetup.getTruncatedLabel(
          label,
          model.options.labelTruncateLength
        );
      }),
      hoverinfo: "x+y",
      mode: "markers",
      marker: <any>{},
    };

    traceConfig.hoverinfo = "label+value+percent";
    traceConfig.marker.colors = colors;
    traceConfig.textposition = "inside";

    if (model.chartType === "doughnut") {
      traceConfig.type = "pie";
      traceConfig.hole = 0.4;
    }

    if (!hasSeries) {
      traceConfig.marker.symbol = "circle";
      traceConfig.marker.size = 16;
    }

    datasets.forEach((dataset: Array<number>, index: number) => {
      traces.push(
        Object.assign({}, traceConfig, {
          values: dataset,
          labels: hasSeries ? seriesLabels : labels,
          customdata: hasSeries ? seriesLabels : labels,
        })
      );
    });
    const radius = labels.length < 10 ? labels.length * 50 + 100 : 550;
    const height = radius * Math.round(traces.length / 2) + 25;
    const layout: any = {
      font: {
        family: "Segoe UI, sans-serif",
        size: 14,
        weight: "normal",
        color: "#404040",
      },
      height: height,
      margin: {
        l: 0,
        t: 25,
        b: 0,
        r: 10,
      },
      colorway: colors,
      hovermode: "closest",
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: false,
    };

    if (hasSeries) {
      layout.grid = {
        rows: Math.round(traces.length / 2),
        columns: 2,
      };
      layout.annotations = [];
      labels.forEach((label, index) => {
        traces[index].domain = {
          column: index % 2,
          row: Math.floor(index / 2),
        };
        traces[index].title = { position: "bottom center", text: label };
      });
    }
    return { traces, layout, hasSeries };
  }

  static setupBar(model: SelectBase): PlotlyOptions {
    let lineHeight = 30;
    let topMargin = 30;
    let bottomMargin = 30;
    let seriesValues = model.getSeriesValues();
    let seriesLabels = model.getSeriesLabels();
    let { datasets, labels, colors, texts } = model.getAnswersData();

    const traces: any = [];
    const hasSeries = datasets.length > 1 && seriesValues.length > 1;

    const traceConfig: any = {
      type: model.chartType,
      y: (hasSeries ? seriesLabels : labels).map((label: string) => {
        return PlotlySetup.getTruncatedLabel(
          label,
          model.options.labelTruncateLength
        );
      }),
      customdata: hasSeries ? seriesLabels : labels,
      hoverinfo: "x+y",
      orientation: "h",
      mode: "markers",
      width: 0.5,
      bargap: 0.5,
      marker: <any>{},
    };
    traceConfig.marker.color = colors;

    datasets.forEach((dataset: Array<number>, index: number) => {
      var trace = Object.assign({}, traceConfig, {
        x: dataset,
        text: texts[index],
      });
      if (model.showPercentages) {
        trace.textposition = "inside";
        trace.texttemplate = "%{value} (%{text}%)";
        trace.width = 0.9;
        trace.bargap = 0.1;
      }
      traces.push(trace);
    });

    const height = (labels.length + 1) * lineHeight + topMargin + bottomMargin;

    const layout: any = {
      font: {
        family: "Segoe UI, sans-serif",
        size: 14,
        weight: "normal",
        color: "#404040",
      },
      height: height,
      margin: {
        t: topMargin,
        b: bottomMargin,
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
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: false,
    };

    if (hasSeries) {
      layout.showlegend = true;
      layout.height = (labels.length + 1) * lineHeight * seriesLabels.length + topMargin + bottomMargin;
      if (model.chartType == "stackedbar") {
        layout.barmode = "stack";
      }

      labels.forEach((label, index) => {
        traces[index].hoverinfo = "x+name";
        traces[index].marker.color = undefined;
        traces[index].name = label;

        if (model.chartType === "stackedbar") {
          traces[index].type = "bar";
        }

        traces[index].width =
          (model.showPercentages ? 0.7 : 0.5) / traces.length;
      });
    }
    return { traces, layout, hasSeries };
  }

  static setupScatter(model: SelectBase): PlotlyOptions {
    let seriesValues = model.getSeriesValues();
    let seriesLabels = model.getSeriesLabels();
    let { datasets, labels, colors, texts } = model.getAnswersData();
    const hasSeries = datasets.length > 1 && seriesValues.length > 1;
    const traces: any = [];

    const traceConfig: any = {
      type: "scatter",
      y: (hasSeries ? seriesLabels : labels).map((label: string) => {
        return PlotlySetup.getTruncatedLabel(
          label,
          model.options.labelTruncateLength
        );
      }),
      customdata: hasSeries ? seriesLabels : labels,
      text: hasSeries ? seriesLabels : labels,
      hoverinfo: "x+y",
      orientation: "h",
      mode: "markers",
      width: 0.5,
      marker: <any>{},
    };

    if (!hasSeries) {
      traceConfig.marker.symbol = "circle";
      traceConfig.marker.size = 16;
    }

    datasets.forEach((dataset: Array<number>) => {
      {
        var trace = Object.assign({}, traceConfig, {
          x: dataset,
        });
        traces.push(trace);
      }
    });

    const height = (labels.length + (labels.length + 1) * 0.5) * 20 + 25;

    const layout: any = {
      font: {
        family: "Segoe UI, sans-serif",
        size: 14,
        weight: "normal",
        color: "#404040",
      },
      height: height,
      margin: {
        t: 25,
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
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: false,
    };

    if (hasSeries) {
      layout.showlegend = true;
      layout.height = undefined;

      labels.forEach((label, index) => {
        traces[index].hoverinfo = "x+name";
        traces[index].marker.color = undefined;
        traces[index].name = label;
      });
    }
    return { traces, layout, hasSeries };
  }
}

export class SelectBasePlotly extends SelectBase {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["bar", "pie", "doughnut", "scatter"];
  public static displayModeBar: any = undefined;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name);
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
    this._chartAdapter.create(chartNode).then(() => {
      this.afterRender(this.contentContainer);
    });
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
