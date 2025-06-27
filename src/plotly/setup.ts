import { Event } from "survey-core";
import { IAnswersData, SelectBase } from "../selectBase";
import { VisualizerBase } from "../visualizerBase";
import { localization } from "../localizationManager";

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

  /**
   * Fires when end user clicks on the 'save as image' button.
   */
  public static onImageSaving = new Event<
    (sender: SelectBase, options: any) => any,
    SelectBase,
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

  static setups: { [type: string]: (model: SelectBase, answersData: IAnswersData) => PlotlyOptions } = {
    bar: PlotlySetup.setupBar,
    vbar: PlotlySetup.setupVBar,
    line: PlotlySetup.setupVBar,
    stackedbar: PlotlySetup.setupBar,
    doughnut: PlotlySetup.setupPie,
    pie: PlotlySetup.setupPie,
    scatter: PlotlySetup.setupScatter,
  };

  static setup(charType: string, model: SelectBase, answersData: IAnswersData): PlotlyOptions {
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

    let traces: any = [];
    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";

    const traceConfig: any = {
      type: model.chartType,
      y: hasSeries ? seriesLabels : labels,
      text: (hasSeries ? seriesLabels : labels).map((label: string) => {
        return PlotlySetup.getTruncatedLabel(
          label,
          model.labelTruncateLength
        );
      }),
      hoverinfo: "label+value+percent", // "x+y",
      mode: "markers",
      marker: {
        color: colors
      },
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
      labels.forEach((label, index) => {
        traces[index].title = {
          position: "bottom center",
          text: label,
          font: { ...PlotlySetup.defaultPieTitleFont }
        };
      });
      traces = traces.filter(t => !(t.values.length === 1 && t.values[0] === 0));
      traces.forEach((label, index) => {
        traces[index].domain = {
          column: index % 2,
          row: Math.floor(index / 2),
        };
      });
      layout.grid = {
        rows: Math.round(traces.length / 2),
        columns: 2,
      };
      layout.height = radius * Math.round(traces.length / 2) + 25;
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

    const traces: any = [];
    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";
    const yFullTexts = hasSeries ? seriesLabels : labels;

    const traceConfig: any = {
      type: model.chartType,
      y: yFullTexts,
      text: yFullTexts,
      customdata: hasSeries ? seriesLabels : labels,
      hoverinfo: "text",
      orientation: "h",
      mode: "markers",
      textposition: "inside",
      insidetextanchor: "middle",
      insidetextfont: { ...PlotlySetup.defaultTextInsideFont },
      hoverlabel: {
        ...PlotlySetup.defaultTooltipConfig
      },
      marker: {
        color: colors
      },
    };

    datasets.forEach((dataset: Array<number>, index: number) => {
      var trace = Object.assign({}, traceConfig, {
        x: dataset,
        text: texts[index],
        hovertext: yFullTexts.map((label: string, labelIndex: number) => {
          return `${texts[index][labelIndex]}, ${label}`;
        }),
      });
      if (model.showPercentages) {
        let texttemplate = model.showOnlyPercentages ? "%{text}%" : "%{value} (%{text}%)";
        trace.texttemplate = texttemplate;
        trace.bargap = 0.1;
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
      yaxis: {
        ...PlotlySetup.defaultAxisYConfig,
        type: "category",
        orientation: "h",
        tickmode: "array",
        tickvals: yFullTexts,
        ticktext: yFullTexts.map((label: string) => {
          return PlotlySetup.getTruncatedLabel(
            label,
            model.labelTruncateLength
          ) + "  ";
        }),
      },
      xaxis: {
        ...PlotlySetup.defaultAxisXWithGridLineConfig,
        rangemode: "nonnegative",
        // dtick: 1
      },
      modebar: { ...PlotlySetup.defaultModebarConfig },
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: false,
    };

    if (hasSeries) {
      layout.showlegend = true;
      layout.legend = { ...PlotlySetup.defaultLegendConfig };
      if (model.chartType == "stackedbar") {
        layout.barmode = "stack";
        layout.height =
          (seriesLabels.length + 1) * lineHeight +
          topMargin +
          bottomMargin;
      } else {
        layout.height =
          (labels.length + 1) * lineHeight * seriesLabels.length +
          topMargin +
          bottomMargin;
      }

      labels.forEach((label, index) => {
        traces[index].marker.color = undefined;
        traces[index].name = label;

        if (model.chartType === "stackedbar") {
          traces[index].type = "bar";
        }
      });

      traces.forEach((trace, traceIndex) => {
        const percentString = model.showPercentages ? "%" : "";
        traces[traceIndex].hovertext = [];
        yFullTexts.forEach((yFullText, yFullTextIndex) => {
          traces[traceIndex].hovertext.push(`${trace.y[yFullTextIndex]} : ${trace.name}, ${trace.text[yFullTextIndex]}${percentString}`);
        });
      });
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

    if(model.type !== "histogram") {
      labels = [].concat(labels).reverse();
      colors = [].concat(colors.slice(0, labels.length)).reverse();
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
    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";

    const layout: any = {
      bargap: 0.01,
      margin: {
        t: topMargin,
        b: bottomMargin,
        r: 10,
      },
      xaxis: {
        ...PlotlySetup.defaultAxisXConfig,
      },
      yaxis: {
        ...PlotlySetup.defaultAxisYWithGridLineConfig,
      },
      modebar: { ...PlotlySetup.defaultModebarConfig },
      colorway: colors,
      hovermode: "closest",
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: false,
    };

    const traceConfig: any = {
      type: model.chartType === "line" ? "line" : "bar",
      customdata: hasSeries ? seriesLabels : labels,
      hoverinfo: "x+y",
      mode: model.chartType === "line" ? "lines+markers" : "markers",
      textposition: "inside",
      insidetextanchor: "middle",
      insidetextfont: { ...PlotlySetup.defaultTextInsideFont },
      marker: {
        color: colors
      },
      hoverlabel: {
        ...PlotlySetup.defaultTooltipConfig
      },
    };

    datasets.forEach((dataset: Array<number>, index: number) => {
      var trace = Object.assign({}, traceConfig, {
        x: labels,
        y: model.showPercentages ? texts[index].map(y => y / 100) : dataset,
        text: texts[index],
      });
      if (model.showPercentages) {
        let texttemplate = model.showOnlyPercentages ? "%{text}%" : "%{value} (%{text}%)";
        trace.texttemplate = texttemplate;
      }
      traces.push(trace);
    });

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
}