import { Event } from "survey-core";
import { SelectBase } from "../selectBase";
import { IAnswersData, VisualizerBase } from "../visualizerBase";
import { DataHelper } from "../utils";
import { NumberModel } from "../number";
import { DashboardTheme } from "../theme";
import { reverseAll } from "../utils/utils";
import { localization } from "../localizationManager";

import "./styles.scss";
export interface ApexChartsOptions {
  series: Array<any>;
  chart: any;
  labels: Array<string>;
  colors: Array<string>;
  plotOptions: any;
  dataLabels?: any;
  legend?: any;
  tooltip?: any;
  hasSeries?: boolean;
  xaxis?: any;
  yaxis?: any;
  grid?: any;
  title?: any;
}

export class ApexChartsSetup {
  public static imageExportFormat = "png";

  static defaultBarGap = DashboardTheme.barGap;

  static defaultToolbarConfig = {
    show: true,
    tools: {
      download: true,
      selection: true,
      zoom: true,
      zoomin: true,
      zoomout: true,
      pan: true,
      reset: true
    }
  };

  static defaultDataLabelsConfig(theme: DashboardTheme) {
    const insideLabelFont = theme.insideLabelFont;
    return {
      enabled: true,
      style: {
        colors: [insideLabelFont.color],
        fontSize: insideLabelFont.size,
        fontFamily: insideLabelFont.family,
        fontWeight: insideLabelFont.weight,
      }
    };
  }

  static defaultTooltipConfig(theme: DashboardTheme) {
    const font = theme.tooltipFont;

    return {
      enabled: true,
      fillSeriesColor: false,
      style: {
        fontSize: font.size,
        fontFamily: font.family,
      },
      marker: {
        show: false,
      },
      x: {
        formatter: () => "",
      },
      y: {
        formatter: function(val: number) {
          return val.toString();
        },
        title: {
          formatter: () => "",
        },
      }
    };
  }

  static defaultLegendConfig(theme: DashboardTheme) {
    const font = theme.legendLabelFont;
    return {
      position: "right",
      horizontalAlign: "right",
      verticalAlign: "top",
      fontSize: font.size,
      fontFamily: font.family,
      fontWeight: font.weight,
      labels: {
        colors: font.color
      },
      markers: {
        size: 10,
        strokeWidth: 1,
      // customHTML: function() {
      //   return '<span class="sa-legend-item-marker"><i class="sa-legend-item-text"></i></span>';
      // }
      },
    };
  }
  static defaultAxisZerolineConfig(theme: DashboardTheme) {
    return {
      color: theme.axisGridColor,
    };
  }

  static defaultGridConfig(theme: DashboardTheme) {
    return {
      borderColor: theme.axisGridColor,
      strokeDashArray: 4,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        }
      },
      yaxis: {
        lines: {
          show: false,
        }
      }
    };
  }

  static defaultAxisLabelFont(theme: DashboardTheme) {
    const font = theme.axisLabelFont;
    return {
      colors: font.color,
      fontSize: font.size,
      fontFamily: font.family,
      fontWeight: font.weight,
    };
  }

  static defaultAxisLabelConfig(theme: DashboardTheme) {
    return {
      labels: {
        style: {
          ...ApexChartsSetup.defaultAxisLabelFont(theme)
        },
      }
    };
  }

  static defaultGaugeValueFont(theme: DashboardTheme) {
    const font = theme.gaugeValueFont;
    return {
      colors: font.color,
      fontSize: font.size,
      fontFamily: font.family,
      fontWeight: font.weight,
    };
  }

  static defaultGaugeTickFont(theme: DashboardTheme) {
    const font = theme.gaugeTickFont;
    return {
      colors: font.color,
      fontSize: font.size,
      fontFamily: font.family,
      fontWeight: font.weight,
    };
  }

  static defaultStrokeConfig = {
    width: 2,
    curve: "smooth"
  };

  static defaultFillConfig = {
    type: "solid",
    opacity: 0.8
  };

  /**
   * Fires when end user clicks on the 'save as image' button.
   */
  public static onImageSaving = new Event<
    (sender: VisualizerBase, options: any) => any,
    VisualizerBase,
    any
  >();

  /**
   * Fires before chart will be created. User can change series, chart options and config of the chart.
   * Options is an object with the following fields: series, chart, xaxis, yaxis, labels, colors, plotOptions, dataLabels, legend, tooltip, grid and hasSeries.
   */
  public static onChartCreating = new Event<
    (sender: VisualizerBase, options: any) => any,
    VisualizerBase,
    any
  >();

  static dataListFormatter(model: SelectBase, text: string, value: string): string {
    if (model.showPercentages) {
      if (model.showOnlyPercentages) {
        return text + "%";
      } else {
        return value + " (" + text + "%)";
      }
    }
    return value;
  }

  static setups: { [type: string]: (model: VisualizerBase, answersData: IAnswersData) => ApexChartsOptions } = {
    bar: ApexChartsSetup.setupBar,
    vbar: ApexChartsSetup.setupVBar,
    line: ApexChartsSetup.setupLine,
    stackedbar: ApexChartsSetup.setupStackedBar,
    doughnut: ApexChartsSetup.setupPie,
    pie: ApexChartsSetup.setupPie,
    scatter: ApexChartsSetup.setupScatter,
    gauge: ApexChartsSetup.setupGauge,
    bullet: ApexChartsSetup.setupBullet,
    radar: ApexChartsSetup.setupRadar,
  };

  static setup(charType: string, model: VisualizerBase, answersData: IAnswersData): ApexChartsOptions {
    return this.setups[charType](model, answersData);
  }

  static setupPie(model: SelectBase, answersData: IAnswersData): ApexChartsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";

    // Prepare data series
    let series: Array<any> = [];
    let chartCount = 1;

    if (hasSeries) {
      // For matrix questions or multiple series
      datasets.forEach((dataset: Array<number>, index: number) => {
        const isNotEmpty = dataset.some((value: number) => value != 0);
        if(isNotEmpty) {
          chartCount += 1;
          series.push({
            series: dataset,
            labels: labels,
            title: seriesLabels[index]
          });
        }
      });
    } else {
      // For simple questions
      series = datasets[0];
    }

    const diameter = labels.length < 10 ? labels.length * 50 + 100 : 550;

    // Chart settings
    const chart: any = {
      type: model.chartType === "doughnut" ? "donut" : "pie",
      height: diameter,
      toolbar: { ...ApexChartsSetup.defaultToolbarConfig },
      background: model.backgroundColor
    };

    // Data label settings
    const dataLabels: any = {
      ...ApexChartsSetup.defaultDataLabelsConfig(model.theme),
      formatter: function(val: number, opts: any) {
        const name = opts.w.globals.labels[opts.seriesIndex];
        const text = name.length > 15 ? name.substring(0, 15) + "..." : name;
        return [text, val.toFixed(model.percentagePrecision) + "%"];
      },
    };

    // Chart options settings
    const plotOptions: any = {
      pie: {
        donut: {
          size: model.chartType === "doughnut" ? "40%" : "0%",
        },
        customScale: 1,
        offsetX: 0,
        offsetY: 0,
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        dataLabels: {
          offset: model.chartType === "doughnut" ? -10 : -25,
        }
      }
    };

    // Tooltip settings
    const tooltip: any = ApexChartsSetup.defaultTooltipConfig(model.theme);
    tooltip.y.title.formatter = (seriesName, opts: any) => {
      const val = opts.w.globals.seriesPercent[opts.seriesIndex][0];
      return [seriesName, val.toFixed(model.percentagePrecision) + "%"];
    };

    const legend= {
      show: false,
    };

    const options: ApexChartsOptions = {
      series,
      chart,
      labels: hasSeries ? seriesLabels : labels,
      colors,
      plotOptions,
      dataLabels,
      legend,
      tooltip,
      hasSeries
    };

    if (hasSeries) {
      options.title = {
        align: "center",
        style: {
          ...ApexChartsSetup.defaultAxisLabelFont(model.theme),
        },
      };
    }

    return options;
  }

  static setupBar(model: SelectBase, answersData: IAnswersData): ApexChartsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";
    const isHistogram = model.type === "histogram";

    // Prepare data series
    let series: Array<any> = [];

    if (hasSeries) {
      // For matrix questions or multiple series
      datasets.forEach((dataset: Array<number>, index: number) => {
        series.push({
          name: seriesLabels[index],
          data: dataset
        });
      });
    } else {
      // For simple questions
      series.push({
        name: "Values",
        data: datasets[0]
      });
    }

    let lineHeight = 30;
    let margin = 35;
    let height = (labels.length) * lineHeight + 2 * margin;
    if(hasSeries) {
      height = (labels.length * seriesLabels.length) * lineHeight + 2 * margin;
    }

    // Chart settings
    const chart: any = {
      type: "bar",
      height: height,
      toolbar: { ...ApexChartsSetup.defaultToolbarConfig },
      background: model.backgroundColor
    };

    // Axis settings
    const xaxis: any = {
      ...ApexChartsSetup.defaultAxisLabelConfig(model.theme),
      categories: labels,
      axisBorder: {
        show: false,
      },
    };

    const yaxis: any = {
      ...ApexChartsSetup.defaultAxisLabelConfig(model.theme),
      axisBorder: {
        ...ApexChartsSetup.defaultAxisZerolineConfig(model.theme)
      },
    };

    const grid = {
      ...ApexChartsSetup.defaultGridConfig(model.theme),
      xaxis: {
        lines: {
          show: true
        }
      },
    };

    // Legend settings
    const legend: any = {
      ...ApexChartsSetup.defaultLegendConfig(model.theme),
      show: hasSeries,
    };

    // Data label settings
    const dataLabels: any = {
      ...ApexChartsSetup.defaultDataLabelsConfig(model.theme),
      formatter: function(val, opts) {
        return ApexChartsSetup.dataListFormatter(model, texts[opts.seriesIndex][opts.dataPointIndex], val);
      },
    };

    // Chart options settings
    const plotOptions: any = {
      bar: {
        horizontal: true,
        distributed: !isHistogram && !hasSeries,
        barHeight: isHistogram ? "100%": (1 - ApexChartsSetup.defaultBarGap) * 100 + "%",
      }
    };

    // Tooltip settings
    const tooltip: any = ApexChartsSetup.defaultTooltipConfig(model.theme);

    // RTL language handling
    if (["ar", "fa"].indexOf(localization.currentLocale) !== -1) {
      chart.direction = "rtl";
    }

    return {
      series,
      chart,
      labels,
      colors,
      plotOptions,
      dataLabels,
      legend,
      tooltip,
      hasSeries,
      grid,
      xaxis,
      yaxis
    };
  }

  static setupVBar(model: SelectBase, answersData: IAnswersData): ApexChartsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";
    const isHistogram = model.type === "histogram";

    if (!isHistogram && model.type !== "pivot") {
      ({ labels, seriesLabels, colors, texts, datasets } = reverseAll(labels, seriesLabels, colors, hasSeries, texts, datasets));
    }

    // Prepare data series
    let series: Array<any> = [];

    if (hasSeries) {
      // For matrix questions or multiple series
      datasets.forEach((dataset: Array<number>, index: number) => {
        series.push({
          name: seriesLabels[index],
          data: dataset
        });
      });
    } else {
      // For simple questions
      series.push({
        name: "Values",
        data: datasets[0]
      });
    }

    // Chart settings
    const chart: any = {
      type: "bar",
      toolbar: { ...ApexChartsSetup.defaultToolbarConfig },
      background: model.backgroundColor
    };

    // Axis settings
    const xaxis: any = {
      ...ApexChartsSetup.defaultAxisLabelConfig(model.theme),
      categories: labels,
      axisBorder: { ...ApexChartsSetup.defaultAxisZerolineConfig(model.theme) },
    };

    const yaxis: any = {
      ...ApexChartsSetup.defaultAxisLabelConfig(model.theme)
    };

    const grid = {
      ...ApexChartsSetup.defaultGridConfig(model.theme),
      yaxis: {
        lines: {
          show: true
        }
      }
    };

    // Legend settings
    const legend: any = {
      ...ApexChartsSetup.defaultLegendConfig(model.theme),
      show: hasSeries,
    };

    // Data label settings
    const dataLabels: any = {
      ...ApexChartsSetup.defaultDataLabelsConfig(model.theme),
      formatter: function(val, opts) {
        return ApexChartsSetup.dataListFormatter(model, texts[opts.seriesIndex][opts.dataPointIndex], val);
      }
    };

    // Chart options settings
    const plotOptions: any = {
      bar: {
        horizontal: false,
        distributed: !isHistogram && !hasSeries,
        columnWidth: isHistogram ? "100%": (1 - ApexChartsSetup.defaultBarGap) * 100 + "%",
      }
    };

    // Tooltip settings
    const tooltip: any = ApexChartsSetup.defaultTooltipConfig(model.theme);

    // RTL language handling
    if (["ar", "fa"].indexOf(localization.currentLocale) !== -1) {
      chart.direction = "rtl";
    }

    return {
      series,
      chart,
      labels,
      colors,
      plotOptions,
      dataLabels,
      legend,
      tooltip,
      hasSeries,
      grid,
      xaxis,
      yaxis
    };
  }

  static setupLine(model: SelectBase, answersData: IAnswersData): ApexChartsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";

    // Prepare data series
    let series: Array<any> = [];

    if (hasSeries) {
      // For matrix questions or multiple series
      datasets.forEach((dataset: Array<number>, index: number) => {
        series.push({
          name: seriesLabels[index],
          data: dataset
        });
      });
    } else {
      // For simple questions
      series.push({
        name: "Values",
        data: datasets[0]
      });
    }

    // Chart settings
    const chart: any = {
      type: "line",
      toolbar: { ...ApexChartsSetup.defaultToolbarConfig },
      background: model.backgroundColor
    };

    // Axis settings
    const xaxis: any = {
      axisBorder: { ...ApexChartsSetup.defaultAxisZerolineConfig(model.theme) },
      categories: labels,
      labels: {
        style: {
          ...ApexChartsSetup.defaultAxisLabelFont(model.theme)
        }
      }
    };

    const yaxis: any = {
      ...ApexChartsSetup.defaultAxisLabelConfig(model.theme)
    };

    // Legend settings
    const legend: any = {
      ...ApexChartsSetup.defaultLegendConfig(model.theme),
      show: hasSeries,
    };

    // Data label settings
    const dataLabels: any = {
      ...ApexChartsSetup.defaultDataLabelsConfig(model.theme),
    };

    // Chart options settings
    const plotOptions: any = {
      line: {
        curve: "smooth"
      }
    };

    // Tooltip settings
    const tooltip: any = ApexChartsSetup.defaultTooltipConfig(model.theme);

    // RTL language handling
    if (["ar", "fa"].indexOf(localization.currentLocale) !== -1) {
      chart.direction = "rtl";
    }

    return {
      series,
      chart,
      labels,
      colors,
      plotOptions,
      dataLabels,
      legend,
      tooltip,
      hasSeries,
      xaxis,
      yaxis
    };
  }

  static setupStackedBar(model: SelectBase, answersData: IAnswersData): ApexChartsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";

    // Prepare data series
    let series: Array<any> = [];

    if (hasSeries) {
      // For matrix questions or multiple series
      datasets.forEach((dataset: Array<number>, index: number) => {
        series.push({
          name: seriesLabels[index],
          data: dataset
        });
      });
    } else {
      // For simple questions
      series.push({
        name: "Values",
        data: datasets[0]
      });
    }

    let lineHeight = 30;
    let margin = 35;
    let height = labels.length * lineHeight + 2 * margin;

    // Chart settings
    const chart: any = {
      type: "bar",
      stacked: true,
      height: height,
      toolbar: { ...ApexChartsSetup.defaultToolbarConfig },
      background: model.backgroundColor
    };

    // Axis settings
    const xaxis: any = {
      ...ApexChartsSetup.defaultAxisLabelConfig(model.theme),
      categories: labels,
      axisBorder: { ...ApexChartsSetup.defaultAxisZerolineConfig(model.theme) },
    };

    const yaxis: any = {
      ...ApexChartsSetup.defaultAxisLabelConfig(model.theme)
    };

    const grid = {
      ...ApexChartsSetup.defaultGridConfig(model.theme),
      xaxis: {
        lines: {
          show: true
        }
      },
    };

    // Legend settings
    const legend: any = {
      ...ApexChartsSetup.defaultLegendConfig(model.theme),
      show: hasSeries,
    };

    // Data label settings
    const dataLabels: any = {
      ...ApexChartsSetup.defaultDataLabelsConfig(model.theme),
    };

    // Chart options settings
    const plotOptions: any = {
      bar: {
        horizontal: true,
        barHeight: (1 - ApexChartsSetup.defaultBarGap) * 100 + "%",
      }
    };

    // Tooltip settings
    const tooltip: any = ApexChartsSetup.defaultTooltipConfig(model.theme);

    // RTL language handling
    if (["ar", "fa"].indexOf(localization.currentLocale) !== -1) {
      chart.direction = "rtl";
    }

    return {
      series,
      chart,
      labels,
      colors,
      plotOptions,
      dataLabels,
      legend,
      tooltip,
      hasSeries,
      grid,
      xaxis,
      yaxis
    };
  }

  static setupScatter(model: SelectBase, answersData: IAnswersData): ApexChartsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";

    // Prepare data series
    let series: Array<any> = [];

    if (hasSeries) {
      // For matrix questions or multiple series
      datasets.forEach((dataset: Array<number>, index: number) => {
        const scatterData = dataset.map((value: number, valueIndex: number) => ({
          x: valueIndex,
          y: value
        }));
        series.push({
          name: seriesLabels[index],
          data: scatterData
        });
      });
    } else {
      // For simple questions
      const scatterData = datasets[0].map((value: number, index: number) => ({
        x: index,
        y: value
      }));
      series.push({
        name: "Values",
        data: scatterData
      });
    }

    // Chart settings
    const chart: any = {
      type: "scatter",
      toolbar: { ...ApexChartsSetup.defaultToolbarConfig },
      background: model.backgroundColor
    };

    // Axis settings
    const xaxis: any = {
      type: "numeric",
      axisBorder: { ...ApexChartsSetup.defaultAxisZerolineConfig(model.theme) },
      labels: {
        style: {
          ...ApexChartsSetup.defaultAxisLabelFont(model.theme)
        }
      }
    };

    const yaxis: any = {
      ...ApexChartsSetup.defaultAxisLabelConfig(model.theme)
    };

    const grid = {
      ...ApexChartsSetup.defaultGridConfig(model.theme),
      xaxis: {
        lines: {
          show: true
        }
      },
    };

    // Legend settings
    const legend: any = {
      ...ApexChartsSetup.defaultLegendConfig(model.theme),
      show: hasSeries,
    };

    // Data label settings
    const dataLabels: any = {
      enabled: false
    };

    // Chart options settings
    const plotOptions: any = {
      scatter: {
        size: 6
      }
    };

    // Tooltip settings
    const tooltip: any = {
      ...ApexChartsSetup.defaultTooltipConfig(model.theme),
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const value = series[seriesIndex][dataPointIndex];
        const label = hasSeries ? seriesLabels[dataPointIndex] : labels[dataPointIndex];
        return `<div class="apexcharts-tooltip-box">
          <span>${label}: ${value.y}</span>
        </div>`;
      }
    };

    // RTL language handling
    if (["ar", "fa"].indexOf(localization.currentLocale) !== -1) {
      chart.direction = "rtl";
    }

    return {
      series,
      chart,
      labels,
      colors,
      plotOptions,
      dataLabels,
      legend,
      tooltip,
      hasSeries,
      grid,
      xaxis,
      yaxis
    };
  }

  static setupGauge(model: NumberModel, answersData: IAnswersData): ApexChartsOptions {
    let value = answersData.datasets[0][answersData.values.indexOf(model.displayValueName || "value")];
    let minValue = answersData.datasets[0][answersData.values.indexOf("min")] || 0;
    let maxValue = answersData.datasets[0][answersData.values.indexOf("max")] || value * 1.25;

    if (model.dataType === "rating") {
      const rateValues = model.question.visibleRateValues;
      maxValue = rateValues[rateValues.length - 1].value;
      minValue = rateValues[0].value;
    }

    if (NumberModel.showAsPercentage) {
      value = DataHelper.toPercentage(value, maxValue);
      minValue = DataHelper.toPercentage(minValue, maxValue);
      maxValue = DataHelper.toPercentage(maxValue, maxValue);
    }

    const chart= {
      type: "radialBar",
      height: 450,
      background: model.backgroundColor,
      toolbar: {
        show: false
      }
    };

    const plotOptions = {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: model.theme.gaugeBackground,
          strokeWidth: "97%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            ...ApexChartsSetup.defaultGaugeValueFont(model.theme),
            show: true,
            offsetY: -10,
            formatter: function (val) {
              return value.toString();
            }
          }
        }
      }
    };

    const percent = ((value - minValue) / (maxValue - minValue)) * 100;

    const yaxis = {
      min: minValue,
      max: maxValue,
      labels: {
        formatter: (val) => {
          const realValue = minValue + (val / 100) * (maxValue - minValue);
          return realValue.toFixed(1);
        }
      }
    };
    const series = [percent];
    const labels = [model.name];
    const colors = [model.theme.gaugeBarColor];

    return {
      series,
      chart,
      labels,
      colors,
      plotOptions,
      yaxis,
      // dataLabels,
    };
  }

  static setupBullet(model: NumberModel, answersData: IAnswersData): ApexChartsOptions {
    let value = answersData.datasets[0][answersData.values.indexOf(model.displayValueName || "value")];
    let minValue = answersData.datasets[0][answersData.values.indexOf("min")] || 0;
    let maxValue = answersData.datasets[0][answersData.values.indexOf("max")] || value * 1.25;

    if (model.dataType === "rating") {
      const rateValues = model.question.visibleRateValues;
      maxValue = rateValues[rateValues.length - 1].value;
      minValue = rateValues[0].value;
    }

    if (NumberModel.showAsPercentage) {
      value = DataHelper.toPercentage(value, maxValue);
      minValue = DataHelper.toPercentage(minValue, maxValue);
      maxValue = DataHelper.toPercentage(maxValue, maxValue);
    }

    const chart = {
      type: "bar",
      height: 100,
      background: model.backgroundColor,
      toolbar: {
        show: false
      }
    };
    const plotOptions = {
      bar: {
        horizontal: true,
      }
    };
    const dataLabels = {
      enabled: false
    };

    const xaxis = {
      min: minValue,
      max: maxValue,
      stepSize: 5,
      style: ApexChartsSetup.defaultGaugeTickFont(model.theme),
      axisBorder: {
        color: model.theme.gaugeBackground,
      },
    };

    const yaxis = {
      axisBorder: {
        color: model.theme.gaugeBackground,
      },
      labels: {
        offsetY: 10,
        style: ApexChartsSetup.defaultGaugeValueFont(model.theme)
      }
    };

    // Tooltip settings
    const tooltip: any = ApexChartsSetup.defaultTooltipConfig(model.theme);

    const series = [{
      data: [{
        x: "",
        y: value,
        goals: [{
          value: maxValue,
          strokeWidth: 1,
          strokeColor: model.theme.gaugeBackground,
        }]
      }]
    }];
    const labels = [value];
    const colors = [model.theme.gaugeBarColor];

    return {
      series,
      chart,
      labels,
      colors,
      plotOptions,
      xaxis,
      yaxis,
      dataLabels,
      tooltip,
    };
  }

  static setupRadar(model: SelectBase, answersData: IAnswersData): ApexChartsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;
    const hasSeries = seriesLabels.length > 1 || model.dataType === "matrix";

    const series = datasets.map((dataset: Array<number>, index: number) => {
      const seriesName = hasSeries ? seriesLabels[index] : "";
      return {
        name: seriesName,
        data: dataset
      };
    });

    const chart = {
      type: "radar",
      background: model.backgroundColor,
      toolbar: { ...ApexChartsSetup.defaultToolbarConfig },
    };

    const plotOptions = {
      radar: {
        polygons: {
          strokeColors: model.theme.axisGridColor,
        }
      }
    };

    const radarLabelFont = model.theme.radarLabelFont;
    const xaxis = {
      labels: {
        style: {
          colors: radarLabelFont.color,
          fontSize: radarLabelFont.size,
          fontFamily: radarLabelFont.family,
          fontWeight: radarLabelFont.weight,
        },
      },
      categories: labels,
    };
    xaxis.labels.style.colors = Array(labels.length).fill(model.theme.axisLabelFont.color) as any;

    const yaxis= {
      show: true,
      labels: {
        show: true,
        style: {
          ...ApexChartsSetup.defaultAxisLabelFont(model.theme),
        }
      },
      tickAmount: 5
    };

    const legend = {
      ...ApexChartsSetup.defaultLegendConfig(model.theme),
      show: hasSeries,
      markers: {
        width: 12,
        height: 12,
        radius: 6
      }
    };
    const tooltip = {
      enabled: true,
      style: {
        ...ApexChartsSetup.defaultTooltipConfig(model.theme),
      },
      y: {
        formatter: function(val: number, opts: any) {
          const seriesName = opts.w.globals.seriesNames[opts.seriesIndex];
          const label = opts.w.globals.labels[opts.dataPointIndex];
          return !!seriesName ? `${seriesName}: ${val} (${label})` : `${label}: ${val}`;
        }
      }
    };

    return {
      series,
      chart,
      labels,
      colors,
      plotOptions,
      xaxis,
      yaxis,
      tooltip,
      legend,
    };
  }
}