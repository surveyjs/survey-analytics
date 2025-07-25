import { Event } from "survey-core";
import { IAnswersData, SelectBase } from "../selectBase";
import { VisualizerBase } from "../visualizerBase";
import { DataHelper } from "../utils";
import { NumberModel } from "../number";
import { DashboardTheme } from "../theme";
import { getTruncatedLabel, reverseAll } from "../utils/utils";
import { localization } from "../localizationManager";

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
      selection: false,
      zoom: false,
      zoomin: false,
      zoomout: false,
      pan: false,
      reset: false
    }
  };

  static defaultDataLabelsConfig = {
    enabled: true,
    style: {
      colors: [DashboardTheme.textInsideFontColor],
      fontSize: DashboardTheme.textInsideFontSize.toString() + "px",
      fontFamily: DashboardTheme.fontFamily,
      fontWeight: DashboardTheme.textInsideFontWeight,
    }
  };

  static defaultTooltipConfig = {
    enabled: true,
    style: {
      fontSize: DashboardTheme.tooltipFontSize.toString() + "px",
      fontFamily: DashboardTheme.fontFamily,
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

  static defaultLegendConfig = {
    position: "right",
    horizontalAlign: "right",
    verticalAlign: "top",
    fontSize: DashboardTheme.legendFontSize.toString() + "px",
    fontFamily: DashboardTheme.fontFamily,
    fontWeight: DashboardTheme.legendFontWeight,
    labels: {
      colors: DashboardTheme.legendFontColor
    },
    markers: {
      size: 10,
      strokeWidth: 1,
      // customHTML: function() {
      //   return '<span class="sa-legend-item-marker"><i class="sa-legend-item-text"></i></span>';
      // }
    },
  };
  static defaultAxisZerolineConfig = {
    color: DashboardTheme.axisZerolinecolor,
  }

  static defaultGridConfig = {
    borderColor: DashboardTheme.axisXGridcolor,
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

  static defaultAxisLabelFont = {
    colors: DashboardTheme.axisTickFontColor,
    fontSize: DashboardTheme.axisTickFontSize.toString() + "px",
    fontFamily: DashboardTheme.fontFamily,
    fontWeight: DashboardTheme.axisTickFontWeight,
  };

  static defaultAxisXLabelConfig = {
    labels: {
      style: {
        ...ApexChartsSetup.defaultAxisLabelFont
      },
    }
  };

  static defaultAxisYLabelConfig = {
    labels: {
      style: {
        ...ApexChartsSetup.defaultAxisLabelFont
      },
    },
  };

  static defaultGaugeValueFont = {
    fontFamily: DashboardTheme.fontFamily,
    color: DashboardTheme.gaugeValueFontColor,
    fontSize: DashboardTheme.gaugeValueFontSize.toString() + "px",
    fontWeight: DashboardTheme.gaugeValueFontWeight,
  }

  static defaultGaugeTickFont = {
    family: DashboardTheme.fontFamily,
    color: DashboardTheme.gaugeTickFontColor,
    size: DashboardTheme.gaugeTickFontSize + "px",
    weight: DashboardTheme.gaugeTickFontWeight,
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

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";

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
      ...ApexChartsSetup.defaultDataLabelsConfig,
      formatter: function(val: number, opts: any) {
        const name = opts.w.globals.labels[opts.seriesIndex];
        return [name, val.toFixed(1) + "%"];
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
    const tooltip: any = {
      ...ApexChartsSetup.defaultTooltipConfig,
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
          ...ApexChartsSetup.defaultAxisLabelFont,
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

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";
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
      ...ApexChartsSetup.defaultAxisXLabelConfig,
      categories: labels,
      axisBorder: {
        show: false,
      },
    };

    const yaxis: any = {
      ...ApexChartsSetup.defaultAxisYLabelConfig,
      axisBorder: {
        ...ApexChartsSetup.defaultAxisZerolineConfig
      },
    };

    const grid = {
      ...ApexChartsSetup.defaultGridConfig,
      xaxis: {
        lines: {
          show: true
        }
      },
    };

    // Legend settings
    const legend: any = {
      ...ApexChartsSetup.defaultLegendConfig,
      show: hasSeries,
    };

    // Data label settings
    const dataLabels: any = {
      ...ApexChartsSetup.defaultDataLabelsConfig,
      formatter: function(val, opts) {
        return ApexChartsSetup.dataListFormatter(model, texts[opts.seriesIndex][opts.dataPointIndex], val);
      },
    };

    // Chart options settings
    const plotOptions: any = {
      bar: {
        horizontal: true,
        distributed: !isHistogram && !hasSeries,
        barHeight: isHistogram ? "100%": (1 - DashboardTheme.barGap) * 100 + "%",
      }
    };

    // Tooltip settings
    const tooltip: any = {
      ...ApexChartsSetup.defaultTooltipConfig,
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

  static setupVBar(model: SelectBase, answersData: IAnswersData): ApexChartsOptions {
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
      ...ApexChartsSetup.defaultAxisXLabelConfig,
      categories: labels,
      axisBorder: { ...ApexChartsSetup.defaultAxisZerolineConfig },
    };

    const yaxis: any = {
      ...ApexChartsSetup.defaultAxisYLabelConfig
    };

    const grid = {
      ...ApexChartsSetup.defaultGridConfig,
      yaxis: {
        lines: {
          show: true
        }
      }
    };

    // Legend settings
    const legend: any = {
      ...ApexChartsSetup.defaultLegendConfig,
      show: hasSeries,
    };

    // Data label settings
    const dataLabels: any = {
      ...ApexChartsSetup.defaultDataLabelsConfig,
      formatter: function(val, opts) {
        return ApexChartsSetup.dataListFormatter(model, texts[opts.seriesIndex][opts.dataPointIndex], val);
      }
    };

    // Chart options settings
    const plotOptions: any = {
      bar: {
        horizontal: false,
        distributed: !isHistogram && !hasSeries,
        columnWidth: isHistogram ? "100%": (1 - DashboardTheme.barGap) * 100 + "%",
      }
    };

    // Tooltip settings
    const tooltip: any = {
      ...ApexChartsSetup.defaultTooltipConfig,
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

  static setupLine(model: SelectBase, answersData: IAnswersData): ApexChartsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";

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
      axisBorder: { ...ApexChartsSetup.defaultAxisZerolineConfig },
      categories: labels,
      labels: {
        style: {
          ...ApexChartsSetup.defaultAxisLabelFont
        }
      }
    };

    const yaxis: any = {
      ...ApexChartsSetup.defaultAxisYLabelConfig
    };

    // Legend settings
    const legend: any = {
      ...ApexChartsSetup.defaultLegendConfig,
      show: hasSeries,
    };

    // Data label settings
    const dataLabels: any = {
      ...ApexChartsSetup.defaultDataLabelsConfig,
      style: {
        colors: ["#404040"]
      }
    };

    // Chart options settings
    const plotOptions: any = {
      line: {
        curve: "smooth"
      }
    };

    // Tooltip settings
    const tooltip: any = {
      ...ApexChartsSetup.defaultTooltipConfig,
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

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";

    if (model.type !== "pivot") {
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
      ...ApexChartsSetup.defaultAxisYLabelConfig,
      axisBorder: {
        ...ApexChartsSetup.defaultAxisZerolineConfig,
      },
    };

    const yaxis: any = {
      ...ApexChartsSetup.defaultAxisXLabelConfig,
      categories: labels,
      axisBorder: {
        show: false,
      },
    };

    const grid = {
      ...ApexChartsSetup.defaultGridConfig,
      yaxis: {
        lines: {
          show: true
        }
      },
    };

    // Legend settings
    const legend: any = {
      ...ApexChartsSetup.defaultLegendConfig,
      show: hasSeries,
    };

    // Data label settings
    const dataLabels: any = {
      ...ApexChartsSetup.defaultDataLabelsConfig,
    };

    // Chart options settings
    const plotOptions: any = {
      bar: {
        horizontal: true,
        barHeight: (1 - DashboardTheme.barGap) * 100 + "%",
      }
    };

    // Tooltip settings
    const tooltip: any = {
      ...ApexChartsSetup.defaultTooltipConfig,
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

  static setupScatter(model: SelectBase, answersData: IAnswersData): ApexChartsOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";

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
      axisBorder: { ...ApexChartsSetup.defaultAxisZerolineConfig },
      labels: {
        style: {
          ...ApexChartsSetup.defaultAxisLabelFont
        }
      }
    };

    const yaxis: any = {
      ...ApexChartsSetup.defaultAxisYLabelConfig
    };

    const grid = {
      ...ApexChartsSetup.defaultGridConfig,
      xaxis: {
        lines: {
          show: true
        }
      },
    };

    // Legend settings
    const legend: any = {
      ...ApexChartsSetup.defaultLegendConfig,
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
      ...ApexChartsSetup.defaultTooltipConfig,
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
    let [level, minValue, maxValue] = answersData as any;

    if (model.question.getType() === "rating") {
      const rateValues = model.question.visibleRateValues;
      maxValue = rateValues[rateValues.length - 1].value;
      minValue = rateValues[0].value;
    }

    if (NumberModel.showAsPercentage) {
      level = DataHelper.toPercentage(level, maxValue);
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
          background: DashboardTheme.gaugeBgcolor,
          strokeWidth: "97%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            ...ApexChartsSetup.defaultGaugeValueFont,
            show: true,
            offsetY: -10,
            formatter: function (val) {
              return level.toString();
            }
          }
        }
      }
    };

    const percent = ((level - minValue) / (maxValue - minValue)) * 100;

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
    const colors = [DashboardTheme.gaugeBarColor];

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
    let [level, minValue, maxValue] = answersData as any;

    if (model.question.getType() === "rating") {
      const rateValues = model.question.visibleRateValues;
      maxValue = rateValues[rateValues.length - 1].value;
      minValue = rateValues[0].value;
    }

    if (NumberModel.showAsPercentage) {
      level = DataHelper.toPercentage(level, maxValue);
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
      style: {
        ...ApexChartsSetup.defaultGaugeTickFont,
      },
      axisBorder: {
        color: DashboardTheme.gaugeBordercolor,
      },
    };

    const yaxis = {
      axisBorder: {
        color: DashboardTheme.gaugeBordercolor,
      },
      labels: {
        offsetY: 10,
        style: {
          ...ApexChartsSetup.defaultGaugeValueFont,
        }
      }
    };

    // Tooltip settings
    const tooltip: any = {
      ...ApexChartsSetup.defaultTooltipConfig,
    };

    const series = [{
      data: [{
        x: "",
        y: level,
        goals: [{
          value: maxValue,
          strokeWidth: 1,
          strokeColor: DashboardTheme.gaugeBordercolor,
        }]
      }]
    }];
    const labels = [level];
    const colors = [DashboardTheme.gaugeBarColor];

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
}