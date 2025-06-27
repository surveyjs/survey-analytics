import { IAnswersData, SelectBase } from "../selectBase";
import { Event } from "survey-core";
import { VisualizerBase } from "../visualizerBase";
import { localization } from "../localizationManager";

export interface ApexChartsOptions {
  series: Array<any>;
  chart: any;
  labels: Array<string>;
  colors: Array<string>;
  plotOptions: any;
  dataLabels: any;
  legend: any;
  responsive: Array<any>;
  tooltip: any;
  hasSeries: boolean;
  xaxis?: any;
  yaxis?: any;
}

export class ApexChartsSetup {
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
   * Fires before chart will be created. User can change series, chart, labels and other options of the chart.
   * Options is an object with the following fields: series, chart, labels, colors, plotOptions, dataLabels, legend, responsive, tooltip.
   */
  public static onChartCreating = new Event<
    (sender: VisualizerBase, options: any) => any,
    VisualizerBase,
    any
  >();

  static setups: { [type: string]: (model: SelectBase, answersData: IAnswersData) => ApexChartsOptions } = {
    bar: ApexChartsSetup.setupBar,
    vbar: ApexChartsSetup.setupVBar,
    line: ApexChartsSetup.setupLine,
    stackedbar: ApexChartsSetup.setupStackedBar,
    doughnut: ApexChartsSetup.setupPie,
    pie: ApexChartsSetup.setupPie,
    scatter: ApexChartsSetup.setupScatter,
  };

  static setup(charType: string, model: SelectBase, answersData: IAnswersData): ApexChartsOptions {
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

    if (hasSeries) {
      // For matrix questions or multiple series
      series = datasets.map((dataset: Array<number>, index: number) => {
        dataset.map((dataset: number, valueIndex: number) => (
          { series: dataset, labels: labels, title: seriesLabels[valueIndex] }
        ));
      });
    } else {
      // For simple questions
      series = datasets[0];
    }

    // Chart settings
    const chart: any = {
      type: model.chartType === "doughnut" ? "donut" : "pie",
      height: hasSeries ? series.length * 200 + 100 : 400,
      fontFamily: "Segoe UI, sans-serif",
      toolbar: {
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
      },
      background: model.backgroundColor
    };

    // Legend settings
    const legend: any = {
      show: !hasSeries,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px",
      fontFamily: "Segoe UI, sans-serif",
      fontWeight: "normal",
      labels: {
        colors: "#404040"
      }
    };

    // Data label settings
    const dataLabels: any = {
      enabled: true,
      formatter: function(val: number, opts: any) {
        const total = opts.w.globals.seriesTotals[opts.seriesIndex];
        const percentage = ((val / total) * 100).toFixed(1);
        return model.showPercentages ? `${percentage}%` : `${val}`;
      },
      style: {
        fontSize: "14px",
        fontFamily: "Segoe UI, sans-serif",
        fontWeight: "normal",
        colors: ["#ffffff"]
      }
    };

    // Chart options settings
    const plotOptions: any = {
      pie: {
        donut: {
          size: model.chartType === "doughnut" ? "40%" : "0%",
          labels: {
            show: model.chartType === "doughnut",
            name: {
              show: true,
              fontSize: "14px",
              fontFamily: "Segoe UI, sans-serif",
              fontWeight: "normal",
              color: "#404040"
            },
            value: {
              show: true,
              fontSize: "14px",
              fontFamily: "Segoe UI, sans-serif",
              fontWeight: "normal",
              color: "#404040",
              formatter: function(val: number) {
                return model.showPercentages ? `${val}%` : val;
              }
            },
            total: {
              show: model.chartType === "doughnut",
              label: "Total",
              fontSize: "16px",
              fontFamily: "Segoe UI, sans-serif",
              fontWeight: "bold",
              color: "#404040"
            }
          }
        },
        customScale: 1,
        offsetX: 0,
        offsetY: 0,
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10
        }
      }
    };

    // Tooltip settings
    const tooltip: any = {
      enabled: true,
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "Segoe UI, sans-serif"
      },
      y: {
        formatter: function(value: number, { series, seriesIndex, dataPointIndex, w }: any) {
          const total = w.globals.seriesTotals[seriesIndex];
          const percentage = ((value / total) * 100).toFixed(1);
          const label = hasSeries ? seriesLabels[dataPointIndex] : labels[dataPointIndex];
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    };

    // Responsiveness settings
    const responsive: Array<any> = [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ];

    // RTL language handling
    if (["ar", "fa"].indexOf(localization.currentLocale) !== -1) {
      chart.direction = "rtl";
      legend.position = "bottom";
    }

    return {
      series,
      chart,
      labels: hasSeries ? seriesLabels : labels,
      colors,
      plotOptions,
      dataLabels,
      legend,
      responsive,
      tooltip,
      hasSeries
    };
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
      height: 400,
      fontFamily: "Segoe UI, sans-serif",
      toolbar: {
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
      },
      background: model.backgroundColor
    };

    // Axis settings
    const xaxis: any = {
      categories: labels,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Segoe UI, sans-serif",
          colors: "#404040"
        },
        rotate: -45,
        rotateAlways: false,
        maxHeight: 60
      }
    };

    const yaxis: any = {
      title: {
        text: "Count",
        style: {
          fontSize: "14px",
          fontFamily: "Segoe UI, sans-serif",
          color: "#404040"
        }
      },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Segoe UI, sans-serif",
          colors: "#404040"
        }
      }
    };

    // Legend settings
    const legend: any = {
      show: hasSeries,
      position: "top",
      horizontalAlign: "right",
      fontSize: "14px",
      fontFamily: "Segoe UI, sans-serif",
      fontWeight: "normal",
      labels: {
        colors: "#404040"
      }
    };

    // Data label settings
    const dataLabels: any = {
      style: {
        fontSize: "12px",
        fontFamily: "Segoe UI, sans-serif",
        fontWeight: "normal",
        colors: ["#404040"]
      }
    };

    // Chart options settings
    const plotOptions: any = {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: {
          position: "center"
        }
      }
    };

    // Tooltip settings
    const tooltip: any = {
      enabled: true,
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "Segoe UI, sans-serif"
      },
      y: {
        formatter: function(value: number, { series, seriesIndex, dataPointIndex }: any) {
          const label = hasSeries ? seriesLabels[dataPointIndex] : labels[dataPointIndex];
          return `${label}: ${value}`;
        }
      }
    };

    // Responsiveness settings
    const responsive: Array<any> = [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          },
          xaxis: {
            labels: {
              rotate: -90
            }
          }
        }
      }
    ];

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
      responsive,
      tooltip,
      hasSeries,
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
      height: 400,
      fontFamily: "Segoe UI, sans-serif",
      toolbar: {
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
      },
      background: model.backgroundColor
    };

    // Axis settings
    const xaxis: any = {
      categories: labels,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Segoe UI, sans-serif",
          colors: "#404040"
        },
        rotate: -45,
        rotateAlways: false,
        maxHeight: 60
      }
    };

    const yaxis: any = {
      title: {
        text: "Count",
        style: {
          fontSize: "14px",
          fontFamily: "Segoe UI, sans-serif",
          color: "#404040"
        }
      },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Segoe UI, sans-serif",
          colors: "#404040"
        }
      }
    };

    // Legend settings
    const legend: any = {
      show: hasSeries,
      position: "top",
      horizontalAlign: "right",
      fontSize: "14px",
      fontFamily: "Segoe UI, sans-serif",
      fontWeight: "normal",
      labels: {
        colors: "#404040"
      }
    };

    // Data label settings
    const dataLabels: any = {
      style: {
        fontSize: "12px",
        fontFamily: "Segoe UI, sans-serif",
        fontWeight: "normal",
        colors: ["#404040"]
      }
    };

    // Chart options settings
    const plotOptions: any = {
      bar: {
        horizontal: false,
        borderRadius: 4,
        dataLabels: {
          position: "top"
        }
      }
    };

    // Tooltip settings
    const tooltip: any = {
      enabled: true,
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "Segoe UI, sans-serif"
      },
      y: {
        formatter: function(value: number, { series, seriesIndex, dataPointIndex }: any) {
          const label = hasSeries ? seriesLabels[dataPointIndex] : labels[dataPointIndex];
          return `${label}: ${value}`;
        }
      }
    };

    // Responsiveness settings
    const responsive: Array<any> = [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          },
          xaxis: {
            labels: {
              rotate: -90
            }
          }
        }
      }
    ];

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
      responsive,
      tooltip,
      hasSeries,
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
      height: 400,
      fontFamily: "Segoe UI, sans-serif",
      toolbar: {
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
      },
      background: model.backgroundColor
    };

    // Axis settings
    const xaxis: any = {
      categories: labels,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Segoe UI, sans-serif",
          colors: "#404040"
        }
      }
    };

    const yaxis: any = {
      title: {
        text: "Count",
        style: {
          fontSize: "14px",
          fontFamily: "Segoe UI, sans-serif",
          color: "#404040"
        }
      },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Segoe UI, sans-serif",
          colors: "#404040"
        }
      }
    };

    // Legend settings
    const legend: any = {
      show: hasSeries,
      position: "top",
      horizontalAlign: "right",
      fontSize: "14px",
      fontFamily: "Segoe UI, sans-serif",
      fontWeight: "normal",
      labels: {
        colors: "#404040"
      }
    };

    // Data label settings
    const dataLabels: any = {
      style: {
        fontSize: "12px",
        fontFamily: "Segoe UI, sans-serif",
        fontWeight: "normal",
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
      enabled: true,
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "Segoe UI, sans-serif"
      },
      y: {
        formatter: function(value: number, { series, seriesIndex, dataPointIndex }: any) {
          const label = hasSeries ? seriesLabels[dataPointIndex] : labels[dataPointIndex];
          return `${label}: ${value}`;
        }
      }
    };

    // Responsiveness settings
    const responsive: Array<any> = [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          }
        }
      }
    ];

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
      responsive,
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
      height: 400,
      stacked: true,
      fontFamily: "Segoe UI, sans-serif",
      toolbar: {
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
      },
      background: model.backgroundColor
    };

    // Axis settings
    const xaxis: any = {
      categories: labels,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Segoe UI, sans-serif",
          colors: "#404040"
        },
        rotate: -45,
        rotateAlways: false,
        maxHeight: 60
      }
    };

    const yaxis: any = {
      title: {
        text: "Count",
        style: {
          fontSize: "14px",
          fontFamily: "Segoe UI, sans-serif",
          color: "#404040"
        }
      },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Segoe UI, sans-serif",
          colors: "#404040"
        }
      }
    };

    // Legend settings
    const legend: any = {
      show: hasSeries,
      position: "top",
      horizontalAlign: "right",
      fontSize: "14px",
      fontFamily: "Segoe UI, sans-serif",
      fontWeight: "normal",
      labels: {
        colors: "#404040"
      }
    };

    // Data label settings
    const dataLabels: any = {
      style: {
        fontSize: "12px",
        fontFamily: "Segoe UI, sans-serif",
        fontWeight: "normal",
        colors: ["#404040"]
      }
    };

    // Chart options settings
    const plotOptions: any = {
      bar: {
        horizontal: false,
        borderRadius: 4,
        dataLabels: {
          position: "center"
        }
      }
    };

    // Tooltip settings
    const tooltip: any = {
      enabled: true,
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "Segoe UI, sans-serif"
      },
      y: {
        formatter: function(value: number, { series, seriesIndex, dataPointIndex }: any) {
          const label = hasSeries ? seriesLabels[dataPointIndex] : labels[dataPointIndex];
          return `${label}: ${value}`;
        }
      }
    };

    // Responsiveness settings
    const responsive: Array<any> = [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          },
          xaxis: {
            labels: {
              rotate: -90
            }
          }
        }
      }
    ];

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
      responsive,
      tooltip,
      hasSeries,
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
      height: 400,
      fontFamily: "Segoe UI, sans-serif",
      toolbar: {
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
      },
      background: model.backgroundColor
    };

    // Axis settings
    const xaxis: any = {
      type: "numeric",
      title: {
        text: "Index",
        style: {
          fontSize: "14px",
          fontFamily: "Segoe UI, sans-serif",
          color: "#404040"
        }
      },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Segoe UI, sans-serif",
          colors: "#404040"
        }
      }
    };

    const yaxis: any = {
      title: {
        text: "Value",
        style: {
          fontSize: "14px",
          fontFamily: "Segoe UI, sans-serif",
          color: "#404040"
        }
      },
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Segoe UI, sans-serif",
          colors: "#404040"
        }
      }
    };

    // Legend settings
    const legend: any = {
      show: hasSeries,
      position: "top",
      horizontalAlign: "right",
      fontSize: "14px",
      fontFamily: "Segoe UI, sans-serif",
      fontWeight: "normal",
      labels: {
        colors: "#404040"
      }
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
      enabled: true,
      theme: "light",
      style: {
        fontSize: "14px",
        fontFamily: "Segoe UI, sans-serif"
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const value = series[seriesIndex][dataPointIndex];
        const label = hasSeries ? seriesLabels[dataPointIndex] : labels[dataPointIndex];
        return `<div class="apexcharts-tooltip-box">
          <span>${label}: ${value.y}</span>
        </div>`;
      }
    };

    // Responsiveness settings
    const responsive: Array<any> = [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          }
        }
      }
    ];

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
      responsive,
      tooltip,
      hasSeries,
      xaxis,
      yaxis
    };
  }
}