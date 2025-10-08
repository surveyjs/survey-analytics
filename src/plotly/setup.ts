import { Event, QuestionRatingModel } from "survey-core";
import { SelectBase } from "../selectBase";
import { IAnswersData, VisualizerBase } from "../visualizerBase";
import { localization } from "../localizationManager";
import { DataHelper } from "../utils";
import { NumberModel } from "../number";
import { DashboardTheme } from "../theme";
import { reverseAll } from "../utils/utils";

export interface PlotlyOptions {
  traces: Array<any>;
  layout: any;
  hasSeries: boolean;
}

export class PlotlySetup {
  public static imageExportFormat = "png";

  static defaultBarGap = DashboardTheme.barGap;

  static getRgbaColor(propertyValue: any): string {
    let str = propertyValue;
    if (!str) return null;
    const canvasElement = document.createElement("canvas") as HTMLCanvasElement;
    if (!canvasElement) return null;
    const ctx = canvasElement.getContext("2d");
    ctx.fillStyle = str;

    if (ctx.fillStyle == "#000000") {
      ctx.fillStyle = propertyValue;
    }
    const newStr = ctx.fillStyle as string;
    const match = newStr.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\/\s*([\d.]+)\)/);

    if (!match) {
      return newStr;
    }

    const r = parseFloat(match[1]);
    const g = parseFloat(match[2]);
    const b = parseFloat(match[3]);
    const alpha = parseFloat(match[4]);
    const result = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    return result;
  }

  static defaultModebarConfig(theme: DashboardTheme) {
    return {
      bgcolor: "transparent",
      activecolor: PlotlySetup.getRgbaColor(theme.modebarActiveColor),
      color: PlotlySetup.getRgbaColor(theme.modebarColor),
    };
  }

  static defaultTooltipConfig(theme: DashboardTheme) {
    const font = {
      ...theme.tooltipFont,
      size: parseFloat(theme.tooltipFont.size)
    };

    return {
      bgcolor: PlotlySetup.getRgbaColor(theme.tooltipBackground),
      font: font,
    };
  }

  static defaultLegendConfig(theme: DashboardTheme) {
    const legendSetting = theme.legendSetting;
    const legendLabelFont = {
      ...theme.legendLabelFont,
      size: parseFloat(theme.legendLabelFont.size)
    };

    return {
      bgcolor: legendSetting.background,
      bordercolor: legendSetting.borderColor,
      borderwidth: legendSetting.borderWidth,
      itemwidth: 20,
      font: legendLabelFont
    };
  }

  static defaultAxisConfig(theme: DashboardTheme) {
    const axisLabelFont = {
      ...theme.axisLabelFont,
      size: parseFloat(theme.axisLabelFont.size)
    };
    if(axisLabelFont.size === undefined || isNaN(axisLabelFont.size)) {
      delete axisLabelFont.size;
    }
    if(!theme.isAxisLabelFontLoaded()) {
      delete axisLabelFont.family;
    }

    return {
      zerolinecolor: PlotlySetup.getRgbaColor(theme.axisGridColor),
      automargin: true,
      tickfont: axisLabelFont
    };
  }

  static defaultInsideLabelFont(theme: DashboardTheme) {
    const insideLabelFont = {
      ...theme.insideLabelFont,
      size: parseFloat(theme.insideLabelFont.size)
    };

    return insideLabelFont;
  }

  static defaultAxisXConfig(theme: DashboardTheme) {
    return {
      ...PlotlySetup.defaultAxisConfig(theme),
      ticklabelstandoff: 8,
    };
  }

  static defaultAxisXWithGridLineConfig (theme: DashboardTheme) {
    return {
      ...PlotlySetup.defaultAxisXConfig(theme),
      gridcolor: PlotlySetup.getRgbaColor(theme.axisGridColor),
      griddash: "dot",
    };
  }

  static defaultAxisYConfig(theme: DashboardTheme) {
    return {
      ...PlotlySetup.defaultAxisConfig(theme),
      ticklabelstandoff: 16,
    };
  }

  static defaultAxisYWithGridLineConfig(theme: DashboardTheme) {
    return {
      ...PlotlySetup.defaultAxisYConfig(theme),
      gridcolor: PlotlySetup.getRgbaColor(theme.axisGridColor),
      griddash: "dot",
    };
  }

  static defaultGaugeConfig(theme) {
    return {
      bgcolor: PlotlySetup.getRgbaColor(theme.gaugeBackground),
      bordercolor: PlotlySetup.getRgbaColor(theme.gaugeBackground),
      bar: {
        color: PlotlySetup.getRgbaColor(theme.gaugeBarColor),
        thickness: 0.5,
      },
    };
  }

  static defaultValueGaugeFont(theme: DashboardTheme) {
    const font = {
      ...theme.gaugeValueFont,
      size: parseFloat(theme.gaugeValueFont.size)
    };

    return font;
  }

  static defaultGaugeTickFont(theme: DashboardTheme) {
    const font = {
      ...theme.gaugeTickFont,
      size: parseFloat(theme.gaugeTickFont.size)
    };

    return font;
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

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";
    const layoutColumns = 2;

    let traces: any = [];
    const traceConfig: any = {
      type: model.chartType,
      sort: false,
      labels: labels,
      customdata: labels,
      text: labels.map((label: string) => {
        return PlotlySetup.getTruncatedLabel(
          label,
          model.labelTruncateLength
        );
      }),
      hoverinfo: "value+text",
      textposition: "inside",
      texttemplate: "%{text}",
      insidetextfont: PlotlySetup.defaultInsideLabelFont(model.theme),
      hoverlabel: PlotlySetup.defaultTooltipConfig(model.theme),
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
      let pieTexts = traceConfig.text;
      if(model.showPercentages) {
        const percentages = model.getPercentages([dataset])[0];
        pieTexts = labels.map((l, li) => (model.showOnlyPercentages ? percentages[li] : PlotlySetup.getTruncatedLabel(l, model.labelTruncateLength) + "<br>" + percentages[li]) + "%");
      }
      if(isNotEmpty) {
        traces.push(
          Object.assign({}, traceConfig, {
            values: dataset,
            text: pieTexts,
            domain: {
              column: traces.length % layoutColumns,
              row: Math.floor(traces.length / layoutColumns),
            },
            title: {
              position: "bottom center",
              text: seriesLabels[index],
              font: PlotlySetup.defaultTooltipConfig(model.theme),
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
      modebar: { ...PlotlySetup.defaultModebarConfig(model.theme) },
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
      labelsTitle,
      valuesTitle
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";
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
      insidetextfont: PlotlySetup.defaultInsideLabelFont(model.theme),
      hoverlabel: PlotlySetup.defaultTooltipConfig(model.theme),
    };
    if (!hasSeries && !isHistogram) {
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
        ...PlotlySetup.defaultAxisXWithGridLineConfig(model.theme),
        rangemode: "nonnegative",
      },
      yaxis: {
        ...PlotlySetup.defaultAxisYConfig(model.theme),
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
      modebar: { ...PlotlySetup.defaultModebarConfig(model.theme) },
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
    };

    if (hasSeries) {
      layout.legend = PlotlySetup.defaultLegendConfig(model.theme);
      if (model.chartType !== "stackedbar") {
        layout.height = (labels.length * seriesLabels.length + 1) * lineHeight + topMargin + bottomMargin;
      }
    }
    if(labelsTitle) {
      layout.yaxis.title = { text: labelsTitle };
    }
    if(valuesTitle) {
      layout.xaxis.title = { text: valuesTitle };
    }

    if(["ar", "fa"].indexOf(localization.currentLocale) !== -1) {
      layout.xaxis.autorange = "reversed";
      layout.yaxis.side = "right";
      const legendSettings = Object.assign({}, PlotlySetup.defaultLegendConfig(model.theme), {
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
      labelsTitle,
      valuesTitle
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";
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
      insidetextfont: PlotlySetup.defaultInsideLabelFont(model.theme),
      hoverlabel: PlotlySetup.defaultTooltipConfig(model.theme),
    };

    if (!hasSeries && !isHistogram) {
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

    const maxTicks = 50;
    const tickStep = Math.ceil(labels.length / maxTicks);

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
        ...PlotlySetup.defaultAxisYWithGridLineConfig(model.theme),
        rangemode: "nonnegative",
        automargin: true,
      },
      xaxis: {
        ...PlotlySetup.defaultAxisXConfig(model.theme),
        automargin: true,
        type: "category",
        tickmode: "array",
        tickvals: labels,
        ticktext: labels.map((label: string, index: number) => {
          if(labels.length > maxTicks && index % tickStep !== 0) {
            return "";
          }
          return PlotlySetup.getTruncatedLabel(
            label,
            model.labelTruncateLength
          );
        }),
      },
      modebar: { ...PlotlySetup.defaultModebarConfig(model.theme) },
    };

    if(labelsTitle) {
      layout.xaxis.title = { text: labelsTitle };
    }
    if(valuesTitle) {
      layout.yaxis.title = { text: valuesTitle };
    }

    if (model.showPercentages && model.showOnlyPercentages) {
      layout.yaxis = {
        ...PlotlySetup.defaultAxisYWithGridLineConfig(model.theme),
        tickformat: ".0%",
        range: [0, 1],
        ticklen: model.showOnlyPercentages ? 25 : 5,
        tickcolor: "transparent",
      };
    }
    if(!(model as any).getValueType || (model as any).getValueType() != "date") {
      layout.xaxis = {
        ...PlotlySetup.defaultAxisXConfig(model.theme),
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
    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";
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
        r: 0,
        l: 0,
      },
      colorway: colors,
      hovermode: "closest",
      yaxis: {
        ...PlotlySetup.defaultAxisYConfig(model.theme),
        type: "category",
        ticklen: 5,
        tickcolor: "transparent",
      },
      xaxis: {
        ...PlotlySetup.defaultAxisXConfig(model.theme),
        rangemode: "nonnegative",
      },
      modebar: { ...PlotlySetup.defaultModebarConfig(model.theme) },
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      showlegend: false,
    };

    if (hasSeries) {
      layout.showlegend = true;
      layout.legend = PlotlySetup.defaultLegendConfig(model.theme);
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
    let value = answersData.datasets[0][answersData.values.indexOf(model.displayValueName || "value")];
    let minValue = answersData.datasets[0][answersData.values.indexOf("min")] || 0;
    let maxValue = answersData.datasets[0][answersData.values.indexOf("max")] || value * 1.25;

    if (model.dataType === "rating") {
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
      value = DataHelper.toPercentage(value, maxValue);
      minValue = DataHelper.toPercentage(minValue, maxValue);
      maxValue = DataHelper.toPercentage(maxValue, maxValue);
    }

    var traces: any = [
      {
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          ...PlotlySetup.defaultGaugeConfig(model.theme),
          axis: {
            range: [minValue, maxValue],
            tickfont: { ...PlotlySetup.defaultGaugeTickFont(model.theme) }
          },
          shape: model.chartType,
        },
        value: value,
        text: model.name,
        domain: { x: [0, 1], y: [0, 1] },
        number: {
          font: { ...PlotlySetup.defaultValueGaugeFont(model.theme) }
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
      modebar: { ...PlotlySetup.defaultModebarConfig(model.theme) },
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
    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";
    const traces: any = [];

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
      const traceName = hasSeries ? seriesLabels[index] : "";
      const trace = Object.assign({}, traceConfig, {
        r: dataset,
        theta: labels,
        name: traceName,
        text: texts[index],
        hoverinfo: "r+theta+name",
        customdata: labels,
        hovertemplate: "%{theta}: %{r}" +
                      "<extra></extra>",
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
      polar: {
        radialaxis: {
          ...PlotlySetup.defaultAxisConfig(model.theme),
          visible: true,
          range: [0, Math.max(...datasets.map(s => Math.max(...s))) * 1.1],
          gridcolor: model.theme.axisGridColor,
          linecolor: model.theme.axisBorderColor,
          tickcolor: model.theme.axisBorderColor,
          gridwidth: 1,
        },
        angularaxis: {
          ...PlotlySetup.defaultAxisConfig(model.theme),
          tickfont: model.theme.radarLabelFont,
          linecolor: model.theme.axisGridColor,
        }
      },
      showlegend: hasSeries,
      legend: hasSeries ? PlotlySetup.defaultLegendConfig(model.theme) : undefined,
      colorway: colors,
      plot_bgcolor: model.backgroundColor,
      paper_bgcolor: model.backgroundColor,
      margin: {
        l: 50,
        r: 50,
        t: 50,
        b: 50
      },
      modebar: { ...PlotlySetup.defaultModebarConfig(model.theme) },
      hovermode: "closest",
      hoverlabel: PlotlySetup.defaultTooltipConfig(model.theme),
    };

    return { traces, layout, hasSeries };
  }
}
