import { Event } from "survey-core";
import { IAnswersData, SelectBase } from "../selectBase";
import { VisualizerBase } from "../visualizerBase";
import { localization } from "../localizationManager";
import { ChartData, ChartOptions } from "chart.js";

export interface ChartJSOptions {
  type: string;
  data: ChartData;
  options: ChartOptions;
  hasSeries: boolean;
}

export class ChartJSSetup {
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
   * Fires before chart will be created. User can change data and options of the chart.
   * Options is an object with the following fields: data and options of the chart.
   */
  public static onChartCreating = new Event<
    (sender: VisualizerBase, options: any) => any,
    VisualizerBase,
    any
  >();

  static setups: { [type: string]: (model: SelectBase, answersData: IAnswersData) => ChartJSOptions } = {
    bar: ChartJSSetup.setupBar,
    vbar: ChartJSSetup.setupVBar,
    line: ChartJSSetup.setupVBar,
    stackedbar: ChartJSSetup.setupBar,
    doughnut: ChartJSSetup.setupPie,
    pie: ChartJSSetup.setupPie,
    scatter: ChartJSSetup.setupScatter,
  };

  static setup(charType: string, model: SelectBase, answersData: IAnswersData): ChartJSOptions {
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

  static setupPie(model: SelectBase, answersData: IAnswersData): ChartJSOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";
    const chartType = model.chartType === "doughnut" ? "doughnut" : "pie";

    let datasets_data: any[] = [];

    if (!hasSeries) {
      datasets_data.push({
        data: datasets[0],
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        label: "Data"
      });
    } else {
      datasets.forEach((dataset: Array<number>, index: number) => {
        datasets_data.push({
          data: dataset,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
          label: labels[index]
        });
      });
    }

    const data: ChartData = {
      labels: hasSeries ? seriesLabels : labels,
      datasets: datasets_data
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: hasSeries,
          position: "top" as const,
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || "";
              const value = context.parsed;
              const total: number = context.dataset.data.reduce<number>((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      elements: {
        arc: {
          borderWidth: 1
        }
      }
    };

    return { type: chartType, data, options, hasSeries };
  }

  static setupBar(model: SelectBase, answersData: IAnswersData): ChartJSOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";

    let datasets_data: any[] = [];

    if (!hasSeries) {
      datasets_data.push({
        data: datasets[0],
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        label: "Data"
      });
    } else {
      datasets.forEach((dataset: Array<number>, index: number) => {
        datasets_data.push({
          data: dataset,
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          borderWidth: 1,
          label: labels[index]
        });
      });
    }

    const data: ChartData = {
      labels: hasSeries ? seriesLabels : labels,
      datasets: datasets_data
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y" as const,
      plugins: {
        legend: {
          display: hasSeries,
          position: "top" as const,
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || "";
              const value = context.parsed.x;
              return `${label}: ${value}`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          stacked: model.chartType === "stackedbar",
        },
        y: {
          stacked: model.chartType === "stackedbar",
        }
      }
    };

    if(["ar", "fa"].indexOf(localization.currentLocale) !== -1) {
      options.scales.x.reverse = true;
    }

    return { type: model.chartType, data, options, hasSeries };
  }

  static setupVBar(model: SelectBase, answersData: IAnswersData): ChartJSOptions {
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

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";
    const chartType = model.chartType === "line" ? "line" : "bar";

    let datasets_data: any[] = [];

    if (!hasSeries) {
      datasets_data.push({
        data: model.showPercentages ? texts[0].map(y => y / 100) : datasets[0],
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        label: "Data"
      });
    } else {
      datasets.forEach((dataset: Array<number>, index: number) => {
        datasets_data.push({
          data: model.showPercentages ? texts[index].map(y => y / 100) : dataset,
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          borderWidth: 1,
          label: labels[index]
        });
      });
    }

    const data: ChartData = {
      labels: labels,
      datasets: datasets_data
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: hasSeries,
          position: "top" as const,
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || "";
              const value = context.parsed.y;
              return `${label}: ${value}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              if (model.showPercentages && model.showOnlyPercentages) {
                return (Number(value) * 100).toFixed(0) + "%";
              }
              return value;
            }
          }
        }
      }
    };

    if(!(model as any).getValueType || (model as any).getValueType() != "date") {
      options.scales.x = {
        type: "category" as const,
      };
    }

    return { type: chartType, data, options, hasSeries };
  }

  static setupScatter(model: SelectBase, answersData: IAnswersData): ChartJSOptions {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = answersData;

    const hasSeries = seriesLabels.length > 1 || model.question.getType() === "matrix";

    let datasets_data: any[] = [];

    if (!hasSeries) {
      datasets_data.push({
        data: datasets[0].map((value, index) => ({
          x: value,
          y: index
        })),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
        label: "Data",
        pointRadius: 6,
        pointHoverRadius: 8
      });
    } else {
      datasets.forEach((dataset: Array<number>, index: number) => {
        datasets_data.push({
          data: dataset.map((value, dataIndex) => ({
            x: value,
            y: dataIndex
          })),
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          borderWidth: 1,
          label: labels[index],
          pointRadius: 6,
          pointHoverRadius: 8
        });
      });
    }

    const data: ChartData = {
      labels: hasSeries ? seriesLabels : labels,
      datasets: datasets_data
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: hasSeries,
          position: "top" as const,
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || "";
              const value = context.parsed.x;
              return `${label}: ${value}`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          type: "linear" as const,
        },
        y: {
          type: "category" as const,
          labels: hasSeries ? seriesLabels : labels
        }
      }
    };

    return { type: "scatter", data, options, hasSeries };
  }
}