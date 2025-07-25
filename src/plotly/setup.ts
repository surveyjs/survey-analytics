import { Event, QuestionRatingModel } from "survey-core";
import { IAnswersData, SelectBase } from "../selectBase";
import { VisualizerBase } from "../visualizerBase";
import { localization } from "../localizationManager";
import { DataHelper } from "../utils";
import { NumberModel } from "../number";
import { DashboardTheme } from "../theme";
import { getTruncatedLabel, reverseAll } from "../utils/utils";

export interface PlotlyOptions {
  traces: Array<any>;
  layout: any;
  hasSeries: boolean;
}

export class PlotlySetup {
  public static imageExportFormat = "png";

  static defaultBarGap = DashboardTheme.barGap;

  static defaultModebarConfig = {
    bgcolor: DashboardTheme.modebarBgcolor,
    activecolor: DashboardTheme.modebarActivecolor,
    color: DashboardTheme.modebarColor
  };

  static defaultTextInsideFont = {
    color: DashboardTheme.textInsideFontColor,
    family: DashboardTheme.fontFamily,
    size: DashboardTheme.textInsideFontSize,
    weight: DashboardTheme.textInsideFontWeight,
  };

  static defaultTooltipFont = {
    color: DashboardTheme.tooltipFontColor,
    family: DashboardTheme.fontFamily,
    size: DashboardTheme.tooltipFontSize,
    weight: DashboardTheme.tooltipFontWeight,
  };

  static defaultTooltipConfig = {
    bgcolor: DashboardTheme.tooltipBgcolor,
    bordercolor: DashboardTheme.tooltipBordercolor,
    font: { ...PlotlySetup.defaultTooltipFont },
  };

  static defaultPieTitleFont = {
    color: DashboardTheme.pieTitleFontColor,
    family: DashboardTheme.fontFamily,
    size: DashboardTheme.pieTitleFontSize,
    weight: DashboardTheme.pieTitleFontWeight,
  };

  static defaultLegendConfig = {
    bgcolor: DashboardTheme.legendBgcolor,
    bordercolor: DashboardTheme.legendBordercolor,
    borderwidth: DashboardTheme.legendBorderwidth,
    itemwidth: DashboardTheme.legendItemwidth,
    font: {
      color: DashboardTheme.legendFontColor,
      family: DashboardTheme.fontFamily,
      size: DashboardTheme.legendFontSize,
      weight: DashboardTheme.legendFontWeight,
    }
  };

  static defaultAxisConfig = {
    zerolinecolor: DashboardTheme.axisZerolinecolor,
    automargin: true,
    tickfont: {
      color: DashboardTheme.axisTickFontColor,
      family: DashboardTheme.fontFamily,
      size: DashboardTheme.axisTickFontSize,
      weight: DashboardTheme.axisTickFontWeight,
    }
  }

  static defaultAxisXConfig = {
    ...PlotlySetup.defaultAxisConfig,
    ticklabelstandoff: DashboardTheme.axisXTicklabelstandoff,
  };

  static defaultAxisXWithGridLineConfig = {
    ...PlotlySetup.defaultAxisXConfig,
    gridcolor: DashboardTheme.axisXGridcolor,
    griddash: "dot",
  };

  static defaultAxisYConfig = {
    ...PlotlySetup.defaultAxisConfig,
    ticklabelstandoff: DashboardTheme.axisYTicklabelstandoff,
  }

  static defaultAxisYWithGridLineConfig = {
    ...PlotlySetup.defaultAxisYConfig,
    gridcolor: DashboardTheme.axisYGridcolor,
    griddash: "dot",
  };

  static defaultGaugeConfig = {
    bgcolor: DashboardTheme.gaugeBgcolor,
    bordercolor: DashboardTheme.gaugeBordercolor,
    bar: {
      color: DashboardTheme.gaugeBarColor,
      thickness: 0.5,
    },
  }

  static defaultValueGaugeFont = {
    color: DashboardTheme.gaugeValueFontColor,
    family: DashboardTheme.fontFamily,
    size: DashboardTheme.gaugeValueFontSize,
    weight: DashboardTheme.gaugeValueFontWeight,
  };

  static defaultGaugeTickFont = {
    color: DashboardTheme.gaugeTickFontColor,
    family: DashboardTheme.fontFamily,
    size: DashboardTheme.gaugeTickFontSize,
    weight: DashboardTheme.gaugeTickFontWeight,
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
    radar: PlotlySetup.setupRadar,
  };

  static setup(charType: string, model: VisualizerBase, answersData: IAnswersData): PlotlyOptions {
    return this.setups[charType](model, answersData);
  }

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
        return getTruncatedLabel(
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
      traceConfig.mode = "markers";
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
            title: {
              position: "bottom center",
              text: seriesLabels[index],
              font: { ...PlotlySetup.defaultPieTitleFont },
            }
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
        r: 0,
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
    const isHistogram = model.type === "histogram";

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
      traceConfig.mode = "markers";
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
      bargap: isHistogram ? 0 : PlotlySetup.defaultBarGap,
      height: height,
      margin: {
        t: topMargin,
        b: bottomMargin,
        r: 0,
        l: 0,
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
          return getTruncatedLabel(
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
    const isHistogram = model.type === "histogram";

    if (!isHistogram && model.type !== "pivot") {
      ({ labels, seriesLabels, colors, texts, datasets } = reverseAll(labels, seriesLabels, colors, hasSeries, texts, datasets));
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
      traceConfig.mode = "markers";
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
        r: 0,
        l: 0,
      },
      colorway: colors,
      hovermode: "closest",
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: hasSeries,
      bargap: isHistogram ? 0 : PlotlySetup.defaultBarGap,
      yaxis: {
        ...PlotlySetup.defaultAxisYWithGridLineConfig,
        rangemode: "nonnegative",
        automargin: true,
      },
      xaxis: {
        ...PlotlySetup.defaultAxisXConfig,
        automargin: true,
        type: "category",
        tickmode: "array",
        tickvals: labels,
        ticktext: labels.map((label: string) => {
          return getTruncatedLabel(
            label,
            model.labelTruncateLength
          ) + "  ";
        }),
      },
      modebar: { ...PlotlySetup.defaultModebarConfig },
    };

    if (model.showPercentages && model.showOnlyPercentages) {
      layout.yaxis = {
        ...PlotlySetup.defaultAxisYWithGridLineConfig,
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
        return getTruncatedLabel(
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
        r: 0,
        l: 0,
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
          ...PlotlySetup.defaultGaugeConfig,
          axis: {
            range: [minValue, maxValue],
            tickfont: { ...PlotlySetup.defaultGaugeTickFont }
          },
          shape: model.chartType,
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
