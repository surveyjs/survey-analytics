import { Question } from "survey-core";
import c3 from "c3";
import { VisualizationManager } from "../visualizationManager";
import { SelectBase } from "../selectBase";

export class SelectBaseC3 extends SelectBase {
  constructor(
    protected targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
  }

  private chart: c3.ChartAPI;
  protected chartTypes = ["bar", "line", "pie", "donut"];
  chartType = "bar";
  chartNode = <HTMLElement>document.createElement("div");

  destroy() {
    if (!this.chart) return;
    this.chart.destroy();
  }

  toolbarChangeHandler = (e: any) => {
    if (this.chartType !== e.target.value) {
      this.chartType = e.target.value;
      this.chart.destroy();
      this.chart = this.getChartC3(this.chartNode, this.chartType);
    }
  };

  createChart() {
    this.chart = this.getChartC3(this.chartNode, this.chartType);
  }

  private getChartC3(chartNode: HTMLElement, chartType: string): c3.ChartAPI {
    var data = this.getData();
    var statistics = data[0];
    var columns = [["x"].concat(this.getLabels())];

    data.forEach((dataset, index) => {
      columns.push(["" + index].concat(dataset));
    });

    return c3.generate({
      bindto: chartNode,
      data: {
        x: "x",
        columns: columns,
        type: this.chartType
      },
      color: {
        pattern: [
          "86e1fb",
          "3999fb",
          "ff6771",
          "1eb496",
          "ffc152",
          "aba1ff",
          "7d8da5",
          "4ec46c",
          "cf37a6",
          "4e6198"
        ]
      },
      bar: {
        width: {
          ratio: 0.5 // this makes bar width 50% of length between ticks
        }
      },
      axis: {
        x: {
          type: "category"
        },
        y: {
          tick: {
            values: statistics
          }
        }
      },
      tooltip: {
        show: true
      },
      legend: {
        show: false
      }
    });
  }
}

// VisualizationManager.registerVisualizer("checkbox", SelectBaseC3);
// VisualizationManager.registerVisualizer("radiogroup", SelectBaseC3);
// VisualizationManager.registerVisualizer("dropdown", SelectBaseC3);
// VisualizationManager.registerVisualizer("imagepicker", SelectBaseC3);
