import { IAnswersData, SelectBase } from "../selectBase";
import { Event } from "survey-core";

export class ApexChartsSetup {
  public static onChartCreating = new Event<(model: SelectBase, options: any) => void, any, any>();
  public static imageExportFormat = "png";

  public static setup(chartType: string, model: SelectBase, answersData: any) {
    const values = model.getValues();
    const labels = model.getLabels();
    const series = model.getSeriesValues();
    const seriesLabels = model.getSeriesLabels();
    const hasSeries = series.length > 1;

    let chartConfig: any = {
      chart: {
        type: this.getChartType(chartType),
        height: 350,
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800
        },
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          },
          export: {
            csv: {
              filename: model.question.name,
              columnDelimiter: ",",
              headerCategory: "category",
              headerDatetime: "datetime",
              headerValue: "value",
              dateFormatter(timestamp: any) {
                return new Date(timestamp).toDateString();
              }
            },
            png: {
              filename: model.question.name
            },
            svg: {
              filename: model.question.name
            }
          }
        },
      },
      series: this.getSeriesData(answersData, hasSeries),
      labels: labels,
      colors: this.getColors(),
      legend: {
        show: true,
        position: "bottom"
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: any, opts: any) {
          return val;
        }
      },
      plotOptions: {
        bar: {
          columnWidth: "100%",
          borderRadius: 4,
          distributed: true,
        },
        pie: {
          donut: {
            size: "65%"
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }]
    };

    return {
      ...chartConfig,
      hasSeries: hasSeries
    };
  }

  private static getChartType(chartType: string): string {
    switch (chartType) {
      case "bar":
        return "bar";
      case "vbar":
        return "bar";
      case "pie":
        return "pie";
      case "doughnut":
        return "donut";
      case "stackedbar":
        return "bar";
      default:
        return "bar";
    }
  }

  private static getSeriesData(answersData: IAnswersData, hasSeries: boolean) {
    if (hasSeries) {
      return answersData.seriesLabels.map((label, index) => ({
        name: label,
        data: answersData.datasets[index] || [],
        color: this.getColors()[index % this.getColors().length]
      }));
    } else {
      return [{
        name: "Results",
        data: answersData.datasets[0],
        color: this.getColors()[0]
      }];
    }
  }

  private static getColors(): string[] {
    return [
      "#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0",
      "#546E7A", "#26a69a", "#D10CE8", "#FF6B6B", "#4ECDC4"
    ];
  }
}