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

  toolbarChangeHandler(e: any) {
    if (this.chartType !== e.target.value) {
      this.chartType = e.target.value;
      this.chart.destroy();
      this.chart = this.getChartC3(this.chartNode, this.chartType);
    }
  }

  createChart() {
    this.chart = this.getChartC3(this.chartNode, this.chartType);
  }

  private getChartC3(chartNode: HTMLElement, chartType: string): c3.ChartAPI {
    var data = this.getData(this.getValues());
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
        pattern: this.getLabels().map(_ => this.getRandomColor())
      },
      axis: {
        x: {
          type: "category"
        },
        y: {
          tick: {
            values: statistics
          }
        },
        rotated: true
      },
      legend: {
        show: false
      }
    });
  }

  getData(values: Array<any>): any[] {
    const statistics = values.map(v => 0);
    this.data.forEach(row => {
      const rowValue: any = row[this.question.name];
      if (!!rowValue) {
        if (Array.isArray(rowValue)) {
          values.forEach((val: any, index: number) => {
            if (rowValue.indexOf(val) !== -1) {
              statistics[index]++;
            }
          });
        } else {
          values.forEach((val: any, index: number) => {
            if (rowValue == val) {
              statistics[index]++;
            }
          });
        }
      }
    });
    return [statistics];
  }
}

VisualizationManager.registerVisualizer("checkbox", SelectBaseC3);
VisualizationManager.registerVisualizer("radiogroup", SelectBaseC3);
VisualizationManager.registerVisualizer("dropdown", SelectBaseC3);
VisualizationManager.registerVisualizer("imagepicker", SelectBaseC3);
