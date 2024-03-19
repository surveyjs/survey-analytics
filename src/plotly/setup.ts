import { Event } from "survey-core";
import { SelectBase } from "../selectBase";
import { VisualizerBase } from "../visualizerBase";

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

  static setups: { [type: string]: (model: SelectBase) => PlotlyOptions } = {
    bar: PlotlySetup.setupBar,
    vbar: PlotlySetup.setupVBar,
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
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = model.getAnswersData();

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
      layout.annotations = [];
      labels.forEach((label, index) => {
        traces[index].title = { position: "bottom center", text: label };
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

  static setupBar(model: SelectBase): PlotlyOptions {
    let lineHeight = 30;
    let topMargin = 30;
    let bottomMargin = 30;
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = model.getAnswersData();

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
      textposition: "none",
      width: 0.5,
      bargap: 0.5,
      marker: <any>{},
    };
    traceConfig.marker.color = colors;

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
        trace.textposition = "inside";
        trace.texttemplate = texttemplate;
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
        rangemode: "nonnegative",
        automargin: true,
        // dtick: 1
      },
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: false,
    };

    if (hasSeries) {
      layout.showlegend = true;
      if (model.chartType == "stackedbar") {
        layout.barmode = "stack";
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
          traces[index].width = 0.5;
        } else {
          traces[index].width =
            (model.showPercentages ? 0.7 : 0.5) / traces.length;
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

    return { traces, layout, hasSeries };
  }

  static setupVBar(model: SelectBase): PlotlyOptions {
    let topMargin = 30;
    let bottomMargin = 30;
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = model.getAnswersData();

    const traces: any = [];
    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";

    const layout: any = {
      font: {
        family: "Segoe UI, sans-serif",
        size: 14,
        weight: "normal",
        color: "#404040",
      },
      margin: {
        t: topMargin,
        b: bottomMargin,
        r: 10,
      },
      colorway: colors,
      hovermode: "closest",
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: false,
    };

    const traceConfig: any = {
      type: "bar",
      customdata: hasSeries ? seriesLabels : labels,
      hoverinfo: "x+y",
      mode: "markers",
      textposition: "none",
      width: 0.5,
      bargap: 0.5,
      marker: <any>{},
    };
    traceConfig.marker.color = colors;

    datasets.forEach((dataset: Array<number>, index: number) => {
      var trace = Object.assign({}, traceConfig, {
        x: labels,
        y: model.showPercentages ? texts[index].map(y => y / 100) : dataset,
        text: texts[index],
      });
      if (model.showPercentages) {
        let texttemplate = model.showOnlyPercentages ? "%{text}%" : "%{value} (%{text}%)";
        trace.textposition = "inside";
        trace.texttemplate = texttemplate;
        trace.width = 0.9;
        trace.bargap = 0.1;
      }
      traces.push(trace);
    });

    if (model.showPercentages && model.showOnlyPercentages) {
      layout.yaxis = {
        automargin: true,
        tickformat: ".0%",
        range: [0, 1],
        ticklen: model.showOnlyPercentages ? 25 : 5,
        tickcolor: "transparent",
      };
    }
    if((model as any).getValueType() != "date") {
      layout.xaxis = {
        type: "category",
      };
    }

    return { traces, layout, hasSeries };
  }

  static setupScatter(model: SelectBase): PlotlyOptions {
    let lineHeight = 30;
    let topMargin = 30;
    let bottomMargin = 30;
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = model.getAnswersData();
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