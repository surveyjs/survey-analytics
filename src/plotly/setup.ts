import { Event, QuestionRatingModel } from "survey-core";
import { IAnswersData, SelectBase } from "../selectBase";
import { VisualizerBase } from "../visualizerBase";
import { localization } from "../localizationManager";
import { DataHelper } from "../utils";
import { NumberModel } from "../number";

export interface PlotlyOptions {
  traces: Array<any>;
  layout: any;
  hasSeries: boolean;
}

export class PlotlySetup {
  public static imageExportFormat = "png";

  static defaultFontFamily = "'Open Sans', 'Segoe UI', SegoeUI, Arial, sans-serif";

  static defaultModebarConfig = {
    bgcolor: "#FFF",
    activecolor: "rgba(25, 179, 148, 1)",
    color: "rgba(25, 179, 148, 0.5)"
  };

  static defaultTextInsideFont = {
    color: "#FFF", // var(--dsb-bar-chart-series-label-text-color-inside, #FFF);
    family: PlotlySetup.defaultFontFamily, // var(--ctr-font-family, "Open Sans");
    size: 12, // font-size: var(--ctr-font-small-size, 12px);
    textcase: "normal",
    weight: 600,
  };

  static defaultTooltipFont = {
    color: "rgba(0, 0, 0, 0.9)", // var(--ctr-tooltip-text-color, rgba(0, 0, 0, 0.91));
    family: PlotlySetup.defaultFontFamily, // var(--ctr-font-family, "Open Sans");
    size: 12, // font-size: var(--ctr-font-small-size, 12px);
    textcase: "normal",
    weight: 600,
  };

  static defaultTooltipConfig = {
    bgcolor: "#FFF", // background: var(--ctr-tooltip-background-color, #FFF);
    bordercolor: "rgba(0, 0, 0, 0.10)", // var(--ctr-tooltip-shadow-1-color, rgba(0, 0, 0, 0.10);
    font: { ...PlotlySetup.defaultTooltipFont },
  };

  static defaultPieTitleFont = {
    color: "rgba(0, 0, 0, 0.90)", //var(--dsb-legend-item-text-color, rgba(0, 0, 0, 0.90));
    family: PlotlySetup.defaultFontFamily, // var(--ctr-font-family, "Open Sans");
    size: 12, // font-size: var(--ctr-font-small-size, 12px);
    textcase: "normal",
    weight: 400,
  };

  static defaultLegendConfig = {
    bgcolor: "#FFF", // bgcolor: "var(--dsb-legend-background, #FFF)",
    bordercolor: "#DCDCDC", // bordercolor: "var(--dsb-legend-border-color, #DCDCDC)",
    borderwidth: 1,
    itemwidth: 20, // var(--dsb-legend-item-swatch-width, 20px);
    font: {
      color: "rgba(0, 0, 0, 0.90)", //var(--dsb-legend-item-text-color, rgba(0, 0, 0, 0.90));
      family: PlotlySetup.defaultFontFamily, // var(--ctr-font-family, "Open Sans");
      size: 12, // font-size: var(--ctr-font-small-size, 12px);
      textcase: "normal",
      weight: 400,
    }
  };

  static defaultAxisConfig = {
    zerolinecolor: "#DCDCDC", // var(--dsb-diagram-gridline-color, #DCDCDC),
    automargin: true,

    tickfont: {
      color: "rgba(0, 0, 0, 0.90)", //var(--dsb-diagram-axis-label-color, rgba(0, 0, 0, 0.90));
      family: PlotlySetup.defaultFontFamily, // var(--ctr-font-family, "Open Sans");
      size: 12, // font-size: var(--ctr-font-small-size, 12px);
      textcase: "normal",
      weight: 400,
    }
  }

  static defaultAxisXConfig = {
    ...PlotlySetup.defaultAxisConfig,
    ticklabelstandoff: 8, // var(--dsb-diagram-axis-horizontal-padding-top, 8px)
  };

  static defaultAxisXWithGridLineConfig = {
    ...PlotlySetup.defaultAxisXConfig,
    gridcolor: "#DCDCDC", // var(--dsb-diagram-gridline-color, #DCDCDC)
    griddash: "dot",
  };

  static defaultAxisYConfig = {
    ...PlotlySetup.defaultAxisConfig,
    ticklabelstandoff: 16, // var(--dsb-diagram-axis-vertical-padding-right, 16px)
  }

  static defaultAxisYWithGridLineConfig = {
    ...PlotlySetup.defaultAxisYConfig,
    gridcolor: "#DCDCDC", // var(--dsb-diagram-gridline-color, #DCDCDC)
    griddash: "dot",
  };

  static defaultValueGaugeFont = {
    color: "rgba(0, 0, 0, 0.90)", // var(--dsb-guage-title-color, rgba(0, 0, 0, 0.90));
    family: PlotlySetup.defaultFontFamily, // var(--ctr-font-family, "Open Sans");
    size: 32, // font-size: var(--ctr-font-large-size, 32px);
    textcase: "normal",
    weight: 700,
  };

  static defaultGaugeTickFont = {
    color: "rgba(0, 0, 0, 0.90)", // var(--dsb-guage-linear-axis-label-color, rgba(0, 0, 0, 0.90));
    family: PlotlySetup.defaultFontFamily, // var(--ctr-font-family, "Open Sans");
    size: 12, // font-size: var(--ctr-font-small-size, 12px);
    textcase: "normal",
    weight: 400,
  }

  /**
   * Fires when end user clicks on the 'save as image' button.
   */
  public static onImageSaving = new Event<
    (sender: VisualizerBase, options: any) => any,
    VisualizerBase,
    any
  >();

  /**
   * Fires before plot will be created. User can change traces, layout and config of the plot.
   * Options is an object with the following fields: traces, layout and config of the plot.
   */
  public static onPlotCreating = new Event<
    (sender: VisualizerBase, options: any) => any,
    VisualizerBase,
    any
  >();

  static setups: { [type: string]: (model: VisualizerBase, answersData: IAnswersData) => PlotlyOptions } = {
    bar: PlotlySetup.setupBar,
    vbar: PlotlySetup.setupVBar,
    line: PlotlySetup.setupVBar,
    stackedbar: PlotlySetup.setupBar,
    doughnut: PlotlySetup.setupPie,
    pie: PlotlySetup.setupPie,
    scatter: PlotlySetup.setupScatter,
    gauge: PlotlySetup.setupGauge,
    bullet: PlotlySetup.setupGauge,
  };

  static setup(charType: string, model: VisualizerBase, answersData: IAnswersData): PlotlyOptions {
    return this.setups[charType](model, answersData);
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

  static setupPie(model: SelectBase, answersData: IAnswersData): PlotlyOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";
    const layoutColumns = 2;

    let traces: any = [];
    const traceConfig: any = {
      type: model.chartType,
      labels: labels,
      customdata: labels,
      text: labels.map((label: string) => {
        return PlotlySetup.getTruncatedLabel(
          label,
          model.labelTruncateLength
        );
      }),
      hoverinfo: "label+value+percent", // "x+y",
      textposition: "inside",
      insidetextfont: { ...PlotlySetup.defaultTextInsideFont },
      hoverlabel: {
        ...PlotlySetup.defaultTooltipConfig
      },
    };

    if (model.chartType === "doughnut") {
      traceConfig.type = "pie";
      traceConfig.hole = 0.4;
    }

    if (!hasSeries) {
      traceConfig.mode = "markers",
      traceConfig.marker = { color: colors };
      traceConfig.marker.symbol = "circle";
      traceConfig.marker.size = 16;
    }

    datasets.forEach((dataset: Array<number>, index: number) => {
      const isNotEmpty = dataset.some((value: number) => value != 0);
      if(isNotEmpty) {
        traces.push(
          Object.assign({}, traceConfig, {
            values: dataset,
            domain: {
              column: traces.length % layoutColumns,
              row: Math.floor(traces.length / layoutColumns),
            },
            title: { position: "bottom center", text: seriesLabels[index], font: { ...PlotlySetup.defaultPieTitleFont } }
          })
        );
      }
    });

    const radius = labels.length < 10 ? labels.length * 50 + 100 : 550;
    const height = (radius + 25) * Math.ceil(traces.length / layoutColumns);

    const layout: any = {
      height: height,
      margin: {
        l: 0,
        t: 25,
        b: 0,
        r: 10,
      },
      modebar: { ...PlotlySetup.defaultModebarConfig },
      colorway: colors,
      hovermode: "closest",
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: false,
    };

    if (hasSeries) {
      layout.annotations = [];
      layout.grid = { rows: Math.ceil(traces.length / layoutColumns), columns: layoutColumns };
    }
    return { traces, layout, hasSeries };
  }

  static setupBar(model: SelectBase, answersData: IAnswersData): PlotlyOptions {
    let lineHeight = 30;
    let topMargin = 30;
    let bottomMargin = 30;
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";

    const traces: any = [];
    const traceConfig: any = {
      type: model.chartType === "line" ? "line" : "bar",
      y: labels,
      customdata: labels,
      hoverinfo: "text",
      orientation: "h",
      textposition: "inside",
      textangle: 0,
      insidetextanchor: "middle",
      insidetextfont: { ...PlotlySetup.defaultTextInsideFont },
      hoverlabel: {
        ...PlotlySetup.defaultTooltipConfig
      },
    };
    if (!hasSeries) {
      traceConfig.mode = "markers",
      traceConfig.marker = { color: colors };
    }

    datasets.forEach((dataset: Array<number>, index: number) => {
      const traceName = hasSeries ? seriesLabels[index] : labels[index];
      const percentString = model.showPercentages ? "%" : "";
      const trace = Object.assign({}, traceConfig, {
        x: dataset,
        name: traceName,
        text: texts[index],
        hovertext: labels.map((label: string, labelIndex: number) => {
          if(model.showOnlyPercentages) {
            return `${texts[index][labelIndex]}${percentString}`;
          } else {
            return hasSeries ? `${traceName} : ${label}, ${texts[index][labelIndex]}${percentString}` : `${texts[index][labelIndex]}${percentString}, ${label}`;
          }
        }),
      });
      if (model.showPercentages) {
        let texttemplate = model.showOnlyPercentages ? "%{text}%" : "%{value} (%{text}%)";
        trace.texttemplate = texttemplate;
      }
      traces.push(trace);
    });

    const height = (labels.length + 1) * lineHeight + topMargin + bottomMargin;

    const layout: any = {
      bargap: 0.05,
      height: height,
      margin: {
        t: topMargin,
        b: bottomMargin,
        r: 10,
      },
      colorway: colors,
      hovermode: "closest",
      showlegend: hasSeries,
      barmode: hasSeries && model.chartType == "stackedbar" ? "stack" : "group",
      xaxis: {
        ...PlotlySetup.defaultAxisXWithGridLineConfig,
        rangemode: "nonnegative",
        automargin: true,
      },
      yaxis: {
        ...PlotlySetup.defaultAxisYConfig,
        type: "category",
        orientation: "h",
        tickmode: "array",
        tickvals: labels,
        ticktext: labels.map((label: string) => {
          return PlotlySetup.getTruncatedLabel(
            label,
            model.labelTruncateLength
          ) + "  ";
        }),
      },
      modebar: { ...PlotlySetup.defaultModebarConfig },
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
    };

    if (hasSeries) {
      layout.legend = { ...PlotlySetup.defaultLegendConfig };
      if (model.chartType !== "stackedbar") {
        layout.height = (labels.length * seriesLabels.length + 1) * lineHeight + topMargin + bottomMargin;
      }
    }

    if(["ar", "fa"].indexOf(localization.currentLocale) !== -1) {
      layout.xaxis.autorange = "reversed";
      layout.yaxis.side = "right";
      const legendSettings = Object.assign({}, PlotlySetup.defaultLegendConfig, {
        x: 0,
        y: 1,
        xanchor: "left",
        yanchor: "top"
      });
      layout.legend = legendSettings;
    }

    return { traces, layout, hasSeries };
  }

  static setupVBar(model: SelectBase, answersData: IAnswersData): PlotlyOptions {
    let topMargin = 30;
    let bottomMargin = 30;
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";

    if (model.type !== "histogram" && model.type !== "pivot") {
      labels = [].concat(labels).reverse();
      seriesLabels = [].concat(seriesLabels).reverse();
      colors = [].concat(colors.slice(0, hasSeries ? seriesLabels.length : labels.length)).reverse();
      const ts = [];
      texts.forEach(text => {
        ts.push([].concat(text).reverse());
      });
      texts = ts;
      const ds = [];
      datasets.forEach(dataset => {
        ds.push([].concat(dataset).reverse());
      });
      datasets = ds;
    }

    const traces: any = [];
    const traceConfig: any = {
      type: model.chartType === "line" ? "line" : "bar",
      x: labels,
      customdata: hasSeries ? seriesLabels : labels,
      hoverinfo: hasSeries ? undefined : "x+y",
      orientation: "v",
      insidetextanchor: "middle",
      insidetextfont: { ...PlotlySetup.defaultTextInsideFont },
      hoverlabel: {
        ...PlotlySetup.defaultTooltipConfig
      },
    };

    if (!hasSeries) {
      traceConfig.mode = "markers",
      traceConfig.marker = { color: colors };
    }

    datasets.forEach((dataset: Array<number>, index: number) => {
      var trace = Object.assign({}, traceConfig, {
        y: dataset,
        name: hasSeries ? seriesLabels[index] : labels[index],
        text: texts[index],
      });
      if (model.showPercentages) {
        let texttemplate = model.showOnlyPercentages ? "%{text}%" : "%{value} (%{text}%)";
        trace.texttemplate = texttemplate;
      }
      traces.push(trace);
    });

    const layout: any = {
      margin: {
        t: topMargin,
        b: bottomMargin,
        r: 10,
      },
      colorway: colors,
      hovermode: "closest",
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: hasSeries,
      bargap: 0.01,
      yaxis: {
        ...PlotlySetup.defaultAxisXConfig,
        rangemode: "nonnegative",
        automargin: true,
      },
      xaxis: {
        ...PlotlySetup.defaultAxisYWithGridLineConfig,
        automargin: true,
        type: "category",
        tickmode: "array",
        tickvals: labels,
        ticktext: labels.map((label: string) => {
          return PlotlySetup.getTruncatedLabel(
            label,
            model.labelTruncateLength
          ) + "  ";
        }),
      },
      modebar: { ...PlotlySetup.defaultModebarConfig },
    };

    if (model.showPercentages && model.showOnlyPercentages) {
      layout.yaxis = {
        ...PlotlySetup.defaultAxisYConfig,
        tickformat: ".0%",
        range: [0, 1],
        ticklen: model.showOnlyPercentages ? 25 : 5,
        tickcolor: "transparent",
      };
    }
    if(!(model as any).getValueType || (model as any).getValueType() != "date") {
      layout.xaxis = {
        ...PlotlySetup.defaultAxisXConfig,
        type: "category",
      };
    }

    return { traces, layout, hasSeries };
  }

  static setupScatter(model: SelectBase, answersData: IAnswersData): PlotlyOptions {
    let lineHeight = 30;
    let topMargin = 30;
    let bottomMargin = 30;
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;
    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";
    const traces: any = [];

    const traceConfig: any = {
      type: "scatter",
      y: (hasSeries ? seriesLabels : labels).map((label: string) => {
        return PlotlySetup.getTruncatedLabel(
          label,
          model.labelTruncateLength
        );
      }),
      customdata: hasSeries ? seriesLabels : labels,
      text: hasSeries ? seriesLabels : labels,
      hoverinfo: "x+y",
      orientation: "h",
      mode: "markers",
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

    const height = (labels.length + 1) * lineHeight + topMargin + bottomMargin;

    const layout: any = {
      height: height,
      margin: {
        t: topMargin,
        b: bottomMargin,
        r: 10,
      },
      colorway: colors,
      hovermode: "closest",
      yaxis: {
        ...PlotlySetup.defaultAxisYConfig,
        type: "category",
        ticklen: 5,
        tickcolor: "transparent",
      },
      xaxis: {
        ...PlotlySetup.defaultAxisXConfig,
        rangemode: "nonnegative",
      },
      modebar: { ...PlotlySetup.defaultModebarConfig },
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: false,
    };

    if (hasSeries) {
      layout.showlegend = true;
      layout.legend = { ...PlotlySetup.defaultLegendConfig };
      layout.height = undefined;

      labels.forEach((label, index) => {
        traces[index].hoverinfo = "x+name";
        traces[index].marker.color = undefined;
        traces[index].name = label;
      });
    }
    return { traces, layout, hasSeries };
  }

  static setupGauge(model: NumberModel, answersData: IAnswersData): PlotlyOptions {
    let [level, minValue, maxValue] = answersData as any;

    if (model.question.getType() === "rating") {
      const rateValues = model.question.visibleRateValues;
      maxValue = rateValues[rateValues.length - 1].value;
      minValue = rateValues[0].value;
    }

    const colors = model.generateColors(
      maxValue,
      minValue,
      NumberModel.stepsCount
    );

    if (NumberModel.showAsPercentage) {
      level = DataHelper.toPercentage(level, maxValue);
      minValue = DataHelper.toPercentage(minValue, maxValue);
      maxValue = DataHelper.toPercentage(maxValue, maxValue);
    }

    var traces: any = [
      {
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {
            range: [minValue, maxValue],
            tickfont: { ...PlotlySetup.defaultGaugeTickFont }
          },
          shape: model.chartType,
          bgcolor: "#F5F5F5", // background: var(--dsb-guage-linear-color-inactive, #F5F5F5);
          bar: {
            color: ["#19B394"], // background: var(--dsb-guage-linear-color, #19B394);
            thickness: 0.5,
          },
        },
        value: level,
        text: model.name,
        domain: { x: [0, 1], y: [0, 1] },
        number: {
          font: { ...PlotlySetup.defaultValueGaugeFont }
        },
      },
    ];

    const chartMargin = model.chartType === "bullet" ? 60 : 30;
    var layout: any = {
      height: model.chartType === "bullet" ? 150 : 250,
      margin: {
        l: chartMargin,
        r: chartMargin,
        b: chartMargin,
        t: chartMargin,
        pad: 5
      },
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      modebar: { ...PlotlySetup.defaultModebarConfig },
    };

    return { traces, layout, hasSeries: false };
  }
}