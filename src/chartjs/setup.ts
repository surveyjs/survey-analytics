import { Event } from "survey-core";
import { dataListFormatter, SelectBase } from "../selectBase";
import { IAnswersData, VisualizerBase } from "../visualizerBase";
import { DataHelper } from "../utils";
import { NumberModel } from "../number";
import { DashboardTheme } from "../theme";
import { isAllZeros, reverseAll, formatLargeNumber } from "../utils/utils";
import { localization } from "../localizationManager";

import "./styles.scss";

export interface ChartJsOptions {
  type: string;
  data: {
    labels: string[],
    datasets: any[],
  };
  options: any;
  height?: number;
  hasSeries?: boolean;
  pieSeries?: Array<{
    data: number[],
    labels: string[],
    title: string,
    colors: string[],
  }>;
}

export class ChartJsSetup {
  public static imageExportFormat = "png";

  static defaultChartHeight = 450;
  static defaultBarGap = DashboardTheme.barGap;

  public static onImageSaving = new Event<
    (sender: VisualizerBase, options: any) => any,
    VisualizerBase,
    any
  >();

  public static onChartCreating = new Event<
    (sender: VisualizerBase, options: any) => any,
    VisualizerBase,
    any
  >();

  static parseFontSize(size: string): number {
    return parseInt(size, 10) || 14;
  }

  static defaultDataLabelsConfig(theme: DashboardTheme) {
    const font = theme.insideLabelFont;
    return {
      anchor: "center",
      align: "center",
      textAlign: "center",
      offset: 0,
      backgroundColor: null,
      color: font.color,
      textShadowColor: theme.axisLabelFont.color,
      font: {
        size: ChartJsSetup.parseFontSize(font.size),
        family: font.family,
        weight: font.weight,
      }
    };
  }

  static defaultTooltipConfig(theme: DashboardTheme) {
    const font = theme.tooltipFont;
    return {
      enabled: true,
      bodyFont: {
        size: ChartJsSetup.parseFontSize(font.size),
        family: font.family,
      },
      displayColors: false,
    };
  }

  static defaultLegendConfig(model: SelectBase) {
    const isMobile = window.innerWidth <= 600;
    const font = model.theme.legendLabelFont;
    const position = isMobile ? "bottom" : model.legendPosition;
    return {
      position: position as "left" | "right" | "top" | "bottom",
      align: "start" as const,
      labels: {
        color: font.color,
        font: {
          size: ChartJsSetup.parseFontSize(font.size),
          family: font.family,
          weight: font.weight,
        },
        usePointStyle: true,
        pointStyle: "rect",
        pointStyleWidth: 10,
        boxWidth: 20,
        padding: 12,
      },
    };
  }

  static defaultGridConfig(theme: DashboardTheme) {
    return {
      color: theme.axisGridColor,
      drawTicks: false,
      display: false,
    };
  }

  static defaultAxisTitleFont(theme: DashboardTheme) {
    const font = theme.axisTitleFont;
    return {
      color: font.color,
      font: {
        size: ChartJsSetup.parseFontSize(font.size),
        family: font.family,
        weight: font.weight,
      },
    };
  }

  static defaultAxisLabelFont(theme: DashboardTheme) {
    const font = theme.axisLabelFont;
    return {
      color: font.color,
      font: {
        size: ChartJsSetup.parseFontSize(font.size),
        family: font.family,
        weight: font.weight,
      },
      padding: 8,
    };
  }

  static defaultAxisConfig(theme: DashboardTheme) {
    return {
      title: {
        display: false,
        ...ChartJsSetup.defaultAxisTitleFont(theme),
      },
      min: 0,
      ticks: {
        ...ChartJsSetup.defaultAxisLabelFont(theme),
      },
      border: {
        display: false,
      },
      grid: {
        ...ChartJsSetup.defaultGridConfig(theme),
      },
    };
  }

  static createLabelAxisAfterFit(theme: DashboardTheme) {
    const fontSize = ChartJsSetup.parseFontSize(theme.axisLabelFont.size);
    return function(axis: any) {
      axis.width = axis.width + fontSize;
    };
  }

  static defaultGaugeValueFont(theme: DashboardTheme) {
    const font = theme.gaugeValueFont;
    return {
      color: font.color,
      font: {
        size: ChartJsSetup.parseFontSize(font.size),
        family: font.family,
        weight: font.weight,
      },
    };
  }

  static defaultGaugeTickFont(theme: DashboardTheme) {
    const font = theme.gaugeTickFont;
    return {
      color: font.color,
      font: {
        size: ChartJsSetup.parseFontSize(font.size),
        family: font.family,
        weight: font.weight,
      },
    };
  }

  static defaultNoDataConfig(theme: DashboardTheme) {
    const font = theme.noDataFont;
    return {
      text: localization.getString("noData"),
      color: font.color,
      font: {
        size: ChartJsSetup.parseFontSize(font.size),
        family: font.family,
      },
    };
  }

  static setups: { [type: string]: (model: VisualizerBase, answersData: IAnswersData) => ChartJsOptions } = {
    bar: ChartJsSetup.setupBar,
    vbar: ChartJsSetup.setupVBar,
    line: ChartJsSetup.setupLine,
    stackedbar: ChartJsSetup.setupStackedBar,
    doughnut: ChartJsSetup.setupPie,
    pie: ChartJsSetup.setupPie,
    scatter: ChartJsSetup.setupScatter,
    gauge: ChartJsSetup.setupGauge,
    bullet: ChartJsSetup.setupBullet,
    radar: ChartJsSetup.setupRadar,
    histogram: ChartJsSetup.setupBar,
    vhistogram: ChartJsSetup.setupVBar,
    stackedhistogram: ChartJsSetup.setupStackedBar,
  };

  static setup(chartType: string, model: VisualizerBase, answersData: IAnswersData): ChartJsOptions {
    return this.setups[chartType](model, answersData);
  }

  static getTruncatedLabel = (label: string, labelTruncateLength: number = 20) => {
    const truncateSymbols = "...";
    const truncateSymbolsLength = truncateSymbols.length;

    if(!labelTruncateLength) return label;
    if(labelTruncateLength === -1) return label;
    if(label.length <= labelTruncateLength + truncateSymbolsLength)
      return label;

    return label.substring(0, labelTruncateLength) + truncateSymbols;
  };

  static setupPie(model: SelectBase, answersData: IAnswersData): ChartJsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";
    const isDoughnut = model.chartType === "doughnut";
    const chartType = isDoughnut ? "doughnut" : "pie";

    let pieSeries: ChartJsOptions["pieSeries"] = undefined;
    let chartDatasets: any[] = [];
    let chartLabels: string[] = [];

    if(hasSeries) {
      pieSeries = [];
      datasets.forEach((dataset: Array<number>, index: number) => {
        if(!isAllZeros(dataset)) {
          pieSeries.push({
            data: dataset,
            labels: labels,
            title: seriesLabels[index],
            colors: colors,
          });
        }
      });
      chartLabels = labels;
    } else {
      if(!isAllZeros(datasets[0])) {
        chartDatasets = [{
          data: datasets[0],
          backgroundColor: colors,
          borderWidth: 0,
        }];
      }
      chartLabels = labels;
    }

    const diameter = labels.length < 10 ? labels.length * 50 + 100 : 550;

    const tooltipConfig = ChartJsSetup.defaultTooltipConfig(model.theme);

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10
      },
      cutout: isDoughnut ? "40%" : 0,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          ...tooltipConfig,
          callbacks: {
            label: function(context: any) {
              const label = context.label || "";
              const value = context.parsed;
              const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(model.percentagePrecision) : "0";
              return label + ": " + value + " (" + percentage + "%)";
            },
          },
        },
        datalabels: {
          ...ChartJsSetup.defaultDataLabelsConfig(model.theme),
          display: function(context: any) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
          formatter: function(value: number, context: any) {
            const label = context.chart.data.labels[context.dataIndex] || "";
            const text = label.length > 15 ? label.substring(0, 15) + "..." : label;
            const dataset: number[] = context.dataset.data;
            const total = dataset.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(model.percentagePrecision) : "0";
            return [text, percentage + "%"];
          }
        }
      },
    };

    if(hasSeries) {
      return {
        type: chartType,
        data: { labels: chartLabels, datasets: chartDatasets },
        options,
        height: diameter,
        hasSeries,
        pieSeries,
      };
    }

    return {
      type: chartType,
      data: { labels: chartLabels, datasets: chartDatasets },
      options,
      height: diameter,
      hasSeries,
    };
  }

  static setupBar(model: SelectBase, answersData: IAnswersData): ChartJsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";
    const isHistogram = model.type === "histogram";

    if(!isHistogram) {
      const reversedAnswersData = reverseAll(labels, seriesLabels, colors, hasSeries, texts, datasets);
      labels = reversedAnswersData.labels;
      datasets = reversedAnswersData.datasets;
    }

    let chartDatasets: any[] = [];

    if(hasSeries) {
      datasets.forEach((dataset: Array<number>, index: number) => {
        chartDatasets.push({
          label: seriesLabels[index],
          data: dataset,
          backgroundColor: colors[index % colors.length],
          borderWidth: 0,
          barPercentage: isHistogram ? 1.0 : (1 - ChartJsSetup.defaultBarGap),
          categoryPercentage: isHistogram ? 1.0 : (1 - ChartJsSetup.defaultBarGap),
        });
      });
    } else {
      chartDatasets.push({
        label: "Values",
        data: datasets[0],
        backgroundColor: isHistogram ? colors[0] : colors,
        borderWidth: 0,
        barPercentage: isHistogram ? 1.0 : (1 - ChartJsSetup.defaultBarGap),
        categoryPercentage: isHistogram ? 1.0 : (1 - ChartJsSetup.defaultBarGap),
      });
    }

    let lineHeight = 30;
    let margin = 35;
    let height = (labels.length) * lineHeight + 2 * margin;
    if(hasSeries && (model.legendPosition === "top" || model.legendPosition === "bottom")) {
      height += (labels.length * seriesLabels.length) * lineHeight;
    } else if(hasSeries) {
      height = (labels.length * seriesLabels.length) * lineHeight + 2 * margin;
    }

    const xAxisConfig = {
      ...ChartJsSetup.defaultAxisConfig(model.theme),
      grid: {
        ...ChartJsSetup.defaultGridConfig(model.theme),
        display: true,
      },
      ticks: {
        ...ChartJsSetup.defaultAxisConfig(model.theme).ticks,
        callback: function(value: number | string) {
          return formatLargeNumber(Number(value));
        },
      },
    };

    const yAxisConfig = {
      ...ChartJsSetup.defaultAxisConfig(model.theme),
      afterFit: ChartJsSetup.createLabelAxisAfterFit(model.theme),
      ticks: {
        ...ChartJsSetup.defaultAxisConfig(model.theme).ticks,
        callback: function(value: string | number, index: number) {
          const label = labels[index];
          return ChartJsSetup.getTruncatedLabel(String(label ?? value));
        },
      },
    };

    const options: any = {
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10
      },
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: seriesLabels.length > 1,
        },
        tooltip: {
          ...ChartJsSetup.defaultTooltipConfig(model.theme),
          callbacks: {
            label: function(context: any) {
              return dataListFormatter(model, texts[context.datasetIndex][context.dataIndex], context.parsed.x.toString());
            },
          },
        },
        datalabels: {
          ...ChartJsSetup.defaultDataLabelsConfig(model.theme),
          formatter: function(val: number, context: any) {
            return dataListFormatter(model, texts[context.datasetIndex][context.dataIndex], formatLargeNumber(val));
          }
        }
      },
      scales: {
        x: xAxisConfig,
        y: yAxisConfig,
      },
    };

    return {
      type: "bar",
      data: { labels, datasets: chartDatasets },
      options,
      height,
      hasSeries,
    };
  }

  static setupVBar(model: SelectBase, answersData: IAnswersData): ChartJsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";
    const isHistogram = model.type === "histogram";

    if(!isHistogram && model.type !== "pivot") {
      ({ labels, seriesLabels, colors, texts, datasets } = reverseAll(labels, seriesLabels, colors, hasSeries, texts, datasets));
    }

    let chartDatasets: any[] = [];

    if(hasSeries) {
      datasets.forEach((dataset: Array<number>, index: number) => {
        chartDatasets.push({
          label: seriesLabels[index],
          data: dataset,
          backgroundColor: colors[index % colors.length],
          borderWidth: 0,
          barPercentage: isHistogram ? 1.0 : (1 - ChartJsSetup.defaultBarGap),
          categoryPercentage: isHistogram ? 1.0 : (1 - ChartJsSetup.defaultBarGap),
        });
      });
    } else {
      chartDatasets.push({
        label: "Values",
        data: datasets[0],
        backgroundColor: isHistogram ? colors[0] : colors,
        borderWidth: 0,
        barPercentage: isHistogram ? 1.0 : (1 - ChartJsSetup.defaultBarGap),
        categoryPercentage: isHistogram ? 1.0 : (1 - ChartJsSetup.defaultBarGap),
      });
    }

    const yAxisInfos = model.getYAxisInfo();
    const yScales: any = {};
    if(yAxisInfos.length > 1) {
      yAxisInfos.forEach((info: any, i: number) => {
        const id = i === 0 ? "y" : "y" + i;
        yScales[id] = {
          ...ChartJsSetup.defaultAxisConfig(model.theme),
          ...info,
          position: i === 0 ? "left" : "right",
          title: {
            display: !!info.title,
            text: info.title?.text || "",
            ...ChartJsSetup.defaultAxisTitleFont(model.theme),
          },
          grid: {
            ...ChartJsSetup.defaultGridConfig(model.theme),
            display: true,
          },
          ticks: {
            ...ChartJsSetup.defaultAxisConfig(model.theme).ticks,
            callback: function(value: number | string) {
              return formatLargeNumber(Number(value));
            },
          },
        };
      });
    } else {
      yScales.y = {
        ...ChartJsSetup.defaultAxisConfig(model.theme),
        grid: {
          ...ChartJsSetup.defaultGridConfig(model.theme),
          display: true,
        },
        ticks: {
          ...ChartJsSetup.defaultAxisConfig(model.theme).ticks,
          callback: function(value: number | string) {
            return formatLargeNumber(Number(value));
          },
        },
      };
    }

    const xAxisConfig = {
      ...ChartJsSetup.defaultAxisConfig(model.theme),
      ticks: {
        ...ChartJsSetup.defaultAxisConfig(model.theme).ticks,
        callback: function(value: string | number, index: number) {
          const label = labels[index];
          return ChartJsSetup.getTruncatedLabel(String(label ?? value), model.labelTruncateLength);
        },
      },
    };

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10
      },
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: seriesLabels.length > 1,
        },
        tooltip: {
          ...ChartJsSetup.defaultTooltipConfig(model.theme),
          callbacks: {
            label: function(context: any) {
              return dataListFormatter(model, texts[context.datasetIndex][context.dataIndex], context.parsed.y.toString());
            },
          },
        },
        datalabels: {
          ...ChartJsSetup.defaultDataLabelsConfig(model.theme),
          formatter: function(val: number, context: any) {
            return dataListFormatter(model, texts[context.datasetIndex][context.dataIndex], formatLargeNumber(val));
          }
        }
      },
      scales: {
        x: xAxisConfig,
        ...yScales,
      },
    };

    return {
      type: "bar",
      data: { labels, datasets: chartDatasets },
      options,
      height: ChartJsSetup.defaultChartHeight,
      hasSeries,
    };
  }

  static setupLine(model: SelectBase, answersData: IAnswersData): ChartJsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";

    let chartDatasets: any[] = [];

    if(hasSeries) {
      datasets.forEach((dataset: Array<number>, index: number) => {
        chartDatasets.push({
          label: seriesLabels[index],
          data: dataset,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length],
          fill: false,
          tension: 0.4,
          pointRadius: 3,
          borderWidth: 2,
        });
      });
    } else {
      chartDatasets.push({
        label: "Values",
        data: datasets[0],
        borderColor: colors[0],
        backgroundColor: colors[0],
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
      });
    }

    const yAxisInfos = model.getYAxisInfo();
    const yScales: any = {};
    if(yAxisInfos.length > 1) {
      yAxisInfos.forEach((info: any, i: number) => {
        const id = i === 0 ? "y" : "y" + i;
        yScales[id] = {
          ...ChartJsSetup.defaultAxisConfig(model.theme),
          ...info,
          position: i === 0 ? "left" : "right",
          title: {
            display: !!info.title,
            text: info.title?.text || "",
            ...ChartJsSetup.defaultAxisTitleFont(model.theme),
          },
          ticks: {
            ...ChartJsSetup.defaultAxisConfig(model.theme).ticks,
            callback: function(value: number | string) {
              return formatLargeNumber(Number(value));
            },
          },
        };
      });
    } else {
      yScales.y = {
        ...ChartJsSetup.defaultAxisConfig(model.theme),
        ticks: {
          ...ChartJsSetup.defaultAxisConfig(model.theme).ticks,
          callback: function(value: number | string) {
            return formatLargeNumber(Number(value));
          },
        },
      };
    }

    const xAxisConfig = {
      ...ChartJsSetup.defaultAxisConfig(model.theme),
      ticks: {
        ...ChartJsSetup.defaultAxisConfig(model.theme).ticks,
        callback: function(value: string | number, index: number) {
          const label = labels[index];
          return ChartJsSetup.getTruncatedLabel(String(label ?? value), model.labelTruncateLength);
        },
      },
    };

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10
      },
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: seriesLabels.length > 1,
        },
        tooltip: {
          ...ChartJsSetup.defaultTooltipConfig(model.theme),
        },
        datalabels: { display: false },
      },
      scales: {
        x: xAxisConfig,
        ...yScales,
      },
    };

    return {
      type: "line",
      data: { labels, datasets: chartDatasets },
      options,
      height: ChartJsSetup.defaultChartHeight,
      hasSeries,
    };
  }

  static setupStackedBar(model: SelectBase, answersData: IAnswersData): ChartJsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";

    const reversedAnswersData = reverseAll(labels, seriesLabels, colors, hasSeries, texts, datasets);
    labels = reversedAnswersData.labels;
    datasets = reversedAnswersData.datasets;

    let chartDatasets: any[] = [];

    if(hasSeries) {
      datasets.forEach((dataset: Array<number>, index: number) => {
        chartDatasets.push({
          label: seriesLabels[index],
          data: dataset,
          backgroundColor: colors[index % colors.length],
          borderWidth: 0,
          barPercentage: 1 - ChartJsSetup.defaultBarGap,
          categoryPercentage: (1 - ChartJsSetup.defaultBarGap),
        });
      });
    } else {
      chartDatasets.push({
        label: "Values",
        data: datasets[0],
        backgroundColor: colors,
        borderWidth: 0,
        barPercentage: 1 - ChartJsSetup.defaultBarGap,
        categoryPercentage: (1 - ChartJsSetup.defaultBarGap),
      });
    }

    let lineHeight = 30;
    let margin = 35;
    let height = labels.length * lineHeight + 2 * margin;
    if(hasSeries && (model.legendPosition === "top" || model.legendPosition === "bottom")) {
      height += labels.length * lineHeight;
    }

    const options: any = {
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10
      },
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: seriesLabels.length > 1,
        },
        tooltip: {
          ...ChartJsSetup.defaultTooltipConfig(model.theme),
        },
        datalabels: {
          ...ChartJsSetup.defaultDataLabelsConfig(model.theme),
          display: function(context: any) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
        }
      },
      scales: {
        x: {
          ...ChartJsSetup.defaultAxisConfig(model.theme),
          stacked: true,
          grid: {
            ...ChartJsSetup.defaultGridConfig(model.theme),
            display: true,
          },
          ticks: {
            ...ChartJsSetup.defaultAxisConfig(model.theme).ticks,
            callback: function(value: number | string) {
              return formatLargeNumber(Number(value));
            },
          },
        },
        y: {
          ...ChartJsSetup.defaultAxisConfig(model.theme),
          stacked: true,
          afterFit: ChartJsSetup.createLabelAxisAfterFit(model.theme),
          ticks: {
            ...ChartJsSetup.defaultAxisConfig(model.theme).ticks,
            callback: function(value: string | number, index: number) {
              const label = labels[index];
              return ChartJsSetup.getTruncatedLabel(String(label ?? value));
            },
          },
        },
      },
    };

    return {
      type: "bar",
      data: { labels, datasets: chartDatasets },
      options,
      height,
      hasSeries,
    };
  }

  static setupScatter(model: SelectBase, answersData: IAnswersData): ChartJsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";

    let chartDatasets: any[] = [];

    if(hasSeries) {
      datasets.forEach((dataset: Array<number>, index: number) => {
        const scatterData = dataset.map((value: number, valueIndex: number) => ({
          x: valueIndex,
          y: value
        }));
        chartDatasets.push({
          label: seriesLabels[index],
          data: scatterData,
          backgroundColor: colors[index % colors.length],
          pointRadius: 6,
        });
      });
    } else {
      const scatterData = datasets[0].map((value: number, index: number) => ({
        x: index,
        y: value
      }));
      chartDatasets.push({
        label: "Values",
        data: scatterData,
        backgroundColor: colors[0],
        pointRadius: 6,
      });
    }

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10
      },
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: seriesLabels.length > 1,
        },
        tooltip: {
          ...ChartJsSetup.defaultTooltipConfig(model.theme),
        },
        datalabels: { display: false },
      },
      scales: {
        x: {
          ...ChartJsSetup.defaultAxisConfig(model.theme),
          ticks: {
            ...ChartJsSetup.defaultAxisConfig(model.theme).ticks,
            callback: function(value: string | number) {
              const index = Number(value);
              const label = Number.isInteger(index) ? labels[index] : value;
              return ChartJsSetup.getTruncatedLabel(String(label ?? value), model.labelTruncateLength);
            },
          },
        },
        y: {
          ...ChartJsSetup.defaultAxisConfig(model.theme),
        },
      },
    };

    return {
      type: "scatter",
      data: { labels, datasets: chartDatasets },
      options,
      height: ChartJsSetup.defaultChartHeight,
      hasSeries,
    };
  }

  static setupGauge(model: NumberModel, answersData: IAnswersData): ChartJsOptions {
    const rawValue = answersData.datasets[0][answersData.values.indexOf(model.displayValueName || "value")];
    const hasNoData = rawValue === undefined || rawValue === null || Number.isNaN(Number(rawValue));
    let value = hasNoData ? 0 : Number(rawValue);
    let minValue = Number(answersData.datasets[0][answersData.values.indexOf("min")]);
    if(!Number.isFinite(minValue)) {
      minValue = 0;
    }
    let maxValue = Number(answersData.datasets[0][answersData.values.indexOf("max")]);
    if(!Number.isFinite(maxValue)) {
      maxValue = value * 1.25;
    }

    if(model.dataType === "rating") {
      const rateValues = model.question.visibleRateValues;
      maxValue = rateValues[rateValues.length - 1].value;
      minValue = rateValues[0].value;
    }

    if(NumberModel.showAsPercentage) {
      value = DataHelper.toPercentage(value, maxValue);
      minValue = DataHelper.toPercentage(minValue, maxValue);
      maxValue = DataHelper.toPercentage(maxValue, maxValue);
    }

    const valueRange = maxValue - minValue;
    const percent = valueRange > 0 ? ((value - minValue) / valueRange) * 100 : 0;
    const remainder = 100 - percent;

    const gaugeValueFont = ChartJsSetup.defaultGaugeValueFont(model.theme);
    const gaugeValue = value.toString();
    const gaugeTitle = hasNoData ? localization.getString("noData") : model.name;

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      circumference: 180,
      rotation: 270,
      cutout: "70%",
      layout: {
        padding: {
          top: 8,
          bottom: 0,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        saGaugeValue: {
          text: gaugeValue,
          offsetY: 0,
          ...gaugeValueFont,
        },
        datalabels: { display: false },
      },
    };

    const chartDatasets = [{
      data: [percent, remainder],
      backgroundColor: [model.theme.gaugeBarColor, model.theme.gaugeBackground],
      borderWidth: 0,
    }];

    return {
      type: "doughnut",
      data: { labels: [gaugeTitle], datasets: chartDatasets },
      options,
      height: ChartJsSetup.defaultChartHeight / 2,
    };
  }

  static setupBullet(model: NumberModel, answersData: IAnswersData): ChartJsOptions {
    let value = answersData.datasets[0][answersData.values.indexOf(model.displayValueName || "value")];
    let minValue = answersData.datasets[0][answersData.values.indexOf("min")] || 0;
    let maxValue = answersData.datasets[0][answersData.values.indexOf("max")] || value * 1.25;

    if(model.dataType === "rating") {
      const rateValues = model.question.visibleRateValues;
      maxValue = rateValues[rateValues.length - 1].value;
      minValue = rateValues[0].value;
    }

    if(NumberModel.showAsPercentage) {
      value = DataHelper.toPercentage(value, maxValue);
      minValue = DataHelper.toPercentage(minValue, maxValue);
      maxValue = DataHelper.toPercentage(maxValue, maxValue);
    }

    const gaugeTickFont = ChartJsSetup.defaultGaugeTickFont(model.theme);
    const gaugeValueFont = ChartJsSetup.defaultGaugeValueFont(model.theme);

    const chartDatasets = [
      {
        label: "",
        data: [value],
        backgroundColor: model.theme.gaugeBarColor,
        borderWidth: 0,
        barPercentage: 0.5,
        categoryPercentage: 1.0,
      },
      {
        label: "",
        data: [maxValue],
        backgroundColor: model.theme.gaugeBackground,
        borderWidth: 0,
        barPercentage: 0.9,
        categoryPercentage: 1.0,
      },
    ];

    const options: any = {
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        datalabels: { display: false },
      },
      scales: {
        x: {
          min: minValue,
          max: maxValue,
          ticks: {
            ...gaugeTickFont,
          },
          border: {
            color: model.theme.gaugeBackground,
          },
          grid: { display: false },
        },
        y: {
          stacked: true,
          ticks: {
            ...gaugeValueFont,
          },
          border: {
            color: model.theme.gaugeBackground,
          },
          grid: { display: false },
        },
      },
    };

    return {
      type: "bar",
      data: { labels: [value.toString()], datasets: chartDatasets },
      options,
      height: 100,
    };
  }

  static setupRadar(model: SelectBase, answersData: IAnswersData): ChartJsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;
    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";
    const tintedColors = model.theme.chartTintedColors;

    const chartDatasets = datasets.map((dataset: Array<number>, index: number) => {
      const seriesName = hasSeries ? seriesLabels[index] : "";
      return {
        label: seriesName,
        data: dataset,
        borderColor: colors[index % colors.length],
        backgroundColor: tintedColors.length
          ? tintedColors[index % tintedColors.length]
          : colors[index % colors.length],
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: colors[index % colors.length],
      };
    });

    const radarLabelFont = model.theme.radarLabelFont;

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10
      },
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: seriesLabels.length > 1,
          labels: {
            ...ChartJsSetup.defaultLegendConfig(model).labels,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          enabled: true,
          ...ChartJsSetup.defaultTooltipConfig(model.theme),
          callbacks: {
            label: function(context: any) {
              const seriesName = context.dataset.label;
              const label = context.label;
              const val = context.parsed.r;
              return seriesName ? `${seriesName}: ${val} (${label})` : `${label}: ${val}`;
            },
          },
        },
      },
      scales: {
        r: {
          angleLines: {
            color: model.theme.axisGridColor,
          },
          grid: {
            color: model.theme.axisGridColor,
          },
          pointLabels: {
            color: radarLabelFont.color,
            font: {
              size: ChartJsSetup.parseFontSize(radarLabelFont.size),
              family: radarLabelFont.family,
              weight: radarLabelFont.weight,
            },
            callback: (label: string) => {
              return ChartJsSetup.getTruncatedLabel(String(label), model.labelTruncateLength);
            },
          },
          ticks: {
            ...ChartJsSetup.defaultAxisLabelFont(model.theme),
            backdropColor: "transparent",
            count: 5,
          },
        },
      },
    };

    return {
      type: "radar",
      data: { labels, datasets: chartDatasets },
      options,
      height: ChartJsSetup.defaultChartHeight,
      hasSeries,
    };
  }
}
