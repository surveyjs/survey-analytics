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
    radar: PlotlySetup.setupRadar,
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
      hoverinfo: "label+value+percent",
      textposition: "inside",
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
            title: { position: "bottom center", text: seriesLabels[index] }
          })
        );
      }
    });

    const radius = labels.length < 10 ? labels.length * 50 + 100 : 550;
    const height = (radius + 25) * Math.ceil(traces.length / layoutColumns);

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
      textposition: "none",
    };
    if (!hasSeries) {
      traceConfig.width = 0.5;
      traceConfig.bargap = 0.5;
      traceConfig.mode = "markers",
      traceConfig.marker = { color: colors };
    }

    datasets.forEach((dataset: Array<number>, index: number) => {
      const traceName = hasSeries ? seriesLabels[index] : labels[index];
      const percentString = model.showPercentages ? "%" : "";
      const trace = Object.assign({}, traceConfig, {
        x: dataset,
        name: traceName,
        width: hasSeries && model.chartType !== "stackedbar" ? 0.5 / seriesLabels.length : 0.5,
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
        trace.textposition = "inside";
        trace.texttemplate = texttemplate;
        trace.width = hasSeries && model.chartType !== "stackedbar" ? 0.7 / seriesLabels.length : 0.9;
        trace.bargap = hasSeries && model.chartType !== "stackedbar" ? 0.3 / seriesLabels.length : 0.1;
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
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: hasSeries,
      barmode: hasSeries && model.chartType == "stackedbar" ? "stack" : "group",
      xaxis: {
        rangemode: "nonnegative",
        automargin: true,
      },
      yaxis: {
        automargin: true,
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
    };

    if (hasSeries && model.chartType !== "stackedbar") {
      layout.height =
          (labels.length * seriesLabels.length + 1) * lineHeight +
          topMargin +
          bottomMargin;
    }

    // labels.forEach((label, index) => {
    //   traces[index].marker.color = undefined;
    //   traces[index].name = label;

    //   if (model.chartType === "stackedbar") {
    //     traces[index].type = "bar";
    //     traces[index].width = 0.5;
    //   } else {
    //     traces[index].width =
    //       (model.showPercentages ? 0.7 : 0.5) / traces.length;
    //   }
    // });

    // traces.forEach((trace, traceIndex) => {
    //   const percentString = model.showPercentages ? "%" : "";
    //   traces[traceIndex].hovertext = [];
    //   yFullTexts.forEach((yFullText, yFullTextIndex) => {
    //     traces[traceIndex].hovertext.push(`${trace.y[yFullTextIndex]} : ${trace.name}, ${trace.text[yFullTextIndex]}${percentString}`);
    //   });
    // });

    if(["ar", "fa"].indexOf(localization.currentLocale) !== -1) {
      layout.xaxis.autorange = "reversed";
      layout.yaxis.side = "right";
      layout.legend = {
        x: 0,
        y: 1,
        xanchor: "left",
        yanchor: "top"
      };
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
      textposition: "none",
    };
    if (model.type === "histogram" || !hasSeries) {
      traceConfig.width = 0.5;
      traceConfig.bargap = 0.5;
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
        trace.textposition = "inside";
        trace.texttemplate = texttemplate;
        if (!hasSeries) {
          trace.width = 0.9;
          trace.bargap = 0.1;
        }
      }
      traces.push(trace);
    });

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
      showlegend: hasSeries,
      yaxis: {
        rangemode: "nonnegative",
        automargin: true,
      },
      xaxis: {
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
    };

    if (model.showPercentages && model.showOnlyPercentages) {
      layout.yaxis = {
        automargin: true,
        tickformat: ".0%",
        range: [0, 1],
        ticklen: model.showOnlyPercentages ? 25 : 5,
        tickcolor: "transparent",
      };
    }
    if(!(model as any).getValueType || (model as any).getValueType() != "date") {
      layout.xaxis = {
        automargin: true,
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
          axis: { range: [minValue, maxValue] },
          shape: model.chartType,
          bgcolor: "white",
          bar: { color: colors[0] },
        },
        value: level,
        text: model.name,
        domain: { x: [0, 1], y: [0, 1] },
      },
    ];

    const chartMargin = model.chartType === "bullet" ? 60 : 30;
    var layout: any = {
      height: 250,
      margin: {
        l: chartMargin,
        r: chartMargin,
        b: chartMargin,
        t: chartMargin,
        pad: 5
      },
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
    };

    return { traces, layout, hasSeries: false };
  }

  static setupRadar(model: SelectBase, answersData: IAnswersData): PlotlyOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;
    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";
    const traces: any = [];

    // Для radar chart нужны полярные координаты
    const traceConfig: any = {
      type: "scatterpolar",
      mode: "lines+markers",
      fill: "toself",
      line: {
        width: 2
      },
      marker: {
        size: 6
      }
    };

    datasets.forEach((dataset: Array<number>, index: number) => {
      const traceName = hasSeries ? seriesLabels[index] : labels[index];
      const trace = Object.assign({}, traceConfig, {
        r: dataset, // радиус (значения)
        theta: labels, // углы (метки)
        name: traceName,
        text: texts[index],
        hoverinfo: "r+theta+name",
        customdata: labels,
        line: {
          ...traceConfig.line,
          color: colors[index % colors.length]
        },
        marker: {
          ...traceConfig.marker,
          color: colors[index % colors.length]
        }
      });
      traces.push(trace);
    });

    const layout: any = {
      font: {
        family: "Segoe UI, sans-serif",
        size: 14,
        weight: "normal",
        color: "#404040",
      },
      polar: {
        radialaxis: {
          visible: true,
          range: [0, Math.max(...datasets.map(s => Math.max(...s))) * 1.1], // Автоматический диапазон с небольшим отступом
          tickfont: {
            size: 12
          }
        },
        angularaxis: {
          tickfont: {
            size: 12
          },
          ticktext: labels.map((label: string) => {
            return PlotlySetup.getTruncatedLabel(
              label,
              model.labelTruncateLength
            );
          }),
          tickvals: labels
        }
      },
      showlegend: hasSeries,
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      margin: {
        l: 50,
        r: 50,
        t: 50,
        b: 50
      }
    };

    return { traces, layout, hasSeries };
  }
}
