import { Event } from "survey-core";
import { SelectBase } from "../selectBase";
import { IAnswersData, VisualizerBase } from "../visualizerBase";
import { DataHelper } from "../utils";
import { NumberModel } from "../number";
import { DashboardTheme } from "../theme";
import { isAllZeros, reverseAll } from "../utils/utils";
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
      display: true,
      color: font.color,
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
    const font = model.theme.legendLabelFont;
    return {
      position: model.legendPosition as "left" | "right" | "top" | "bottom",
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

  static dataListFormatter(model: SelectBase, text: string, value: string): string {
    if(model.showPercentages) {
      if(model.showOnlyPercentages) {
        return text + "%";
      } else {
        return value + " (" + text + "%)";
      }
    }
    return value;
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
      cutout: isDoughnut ? "40%" : 0,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          ...tooltipConfig,
          callbacks: {
            label: function(context) {
              const label = context.label || "";
              const value = context.parsed;
              const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(model.percentagePrecision) : "0";
              return label + ": " + value + " (" + percentage + "%)";
            },
          },
        },
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
          categoryPercentage: 0.8,
        });
      });
    } else {
      chartDatasets.push({
        label: "Values",
        data: datasets[0],
        backgroundColor: isHistogram ? colors[0] : colors,
        borderWidth: 0,
        barPercentage: isHistogram ? 1.0 : (1 - ChartJsSetup.defaultBarGap),
        categoryPercentage: 0.8,
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
    };

    const yAxisConfig = {
      ...ChartJsSetup.defaultAxisConfig(model.theme),
    };

    const options: any = {
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: hasSeries,
        },
        tooltip: {
          ...ChartJsSetup.defaultTooltipConfig(model.theme),
          callbacks: {
            label: function(context) {
              return ChartJsSetup.dataListFormatter(model, texts[context.datasetIndex][context.dataIndex], context.parsed.x.toString());
            },
          },
        },
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
          categoryPercentage: 0.8,
        });
      });
    } else {
      chartDatasets.push({
        label: "Values",
        data: datasets[0],
        backgroundColor: isHistogram ? colors[0] : colors,
        borderWidth: 0,
        barPercentage: isHistogram ? 1.0 : (1 - ChartJsSetup.defaultBarGap),
        categoryPercentage: 0.8,
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
        };
      });
    } else {
      yScales.y = {
        ...ChartJsSetup.defaultAxisConfig(model.theme),
        grid: {
          ...ChartJsSetup.defaultGridConfig(model.theme),
          display: true,
        },
      };
    }

    const xAxisConfig = {
      ...ChartJsSetup.defaultAxisConfig(model.theme),
    };

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: hasSeries,
        },
        tooltip: {
          ...ChartJsSetup.defaultTooltipConfig(model.theme),
          callbacks: {
            label: function(context) {
              return ChartJsSetup.dataListFormatter(model, texts[context.datasetIndex][context.dataIndex], context.parsed.y.toString());
            },
          },
        },
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
        };
      });
    } else {
      yScales.y = {
        ...ChartJsSetup.defaultAxisConfig(model.theme),
      };
    }

    const xAxisConfig = {
      ...ChartJsSetup.defaultAxisConfig(model.theme),
    };

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: hasSeries,
        },
        tooltip: {
          ...ChartJsSetup.defaultTooltipConfig(model.theme),
        },
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
          categoryPercentage: 0.8,
        });
      });
    } else {
      chartDatasets.push({
        label: "Values",
        data: datasets[0],
        backgroundColor: colors,
        borderWidth: 0,
        barPercentage: 1 - ChartJsSetup.defaultBarGap,
        categoryPercentage: 0.8,
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
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: hasSeries,
        },
        tooltip: {
          ...ChartJsSetup.defaultTooltipConfig(model.theme),
        },
      },
      scales: {
        x: {
          ...ChartJsSetup.defaultAxisConfig(model.theme),
          stacked: true,
          grid: {
            ...ChartJsSetup.defaultGridConfig(model.theme),
            display: true,
          },
        },
        y: {
          ...ChartJsSetup.defaultAxisConfig(model.theme),
          stacked: true,
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
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: hasSeries,
        },
        tooltip: {
          ...ChartJsSetup.defaultTooltipConfig(model.theme),
        },
      },
      scales: {
        x: {
          ...ChartJsSetup.defaultAxisConfig(model.theme),
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

    const percent = ((value - minValue) / (maxValue - minValue)) * 100;
    const remainder = 100 - percent;

    const gaugeValueFont = ChartJsSetup.defaultGaugeValueFont(model.theme);

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      circumference: 180,
      rotation: 270,
      cutout: "70%",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    };

    const chartDatasets = [{
      data: [percent, remainder],
      backgroundColor: [model.theme.gaugeBarColor, model.theme.gaugeBackground],
      borderWidth: 0,
    }];

    return {
      type: "doughnut",
      data: { labels: [model.name], datasets: chartDatasets },
      options,
      height: ChartJsSetup.defaultChartHeight,
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
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
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

    const chartDatasets = datasets.map((dataset: Array<number>, index: number) => {
      const seriesName = hasSeries ? seriesLabels[index] : "";
      return {
        label: seriesName,
        data: dataset,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + "33",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: colors[index % colors.length],
      };
    });

    const radarLabelFont = model.theme.radarLabelFont;

    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          ...ChartJsSetup.defaultLegendConfig(model),
          display: hasSeries,
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
            label: function(context) {
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
