import { Question, QuestionSelectBase, QuestionMatrixModel } from "survey-core";
import Chart from "chart.js";
import { VisualizationManager } from "../visualizationManager";
import { SelectBase } from "../selectBase";

export class SelectBaseChartJS extends SelectBase {
  constructor(
    targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
  }

  private chart: Chart;

  protected chartTypes = ["bar", "horizontalBar", "line", "pie", "doughnut"];
  chartType = "horizontalBar";
  chartNode = <HTMLCanvasElement>document.createElement("canvas");

  destroy() {
    if (!!this.chart) {
      this.chart.destroy();
      this.chart = undefined;
      this.targetElement.innerHTML = "";
    }
  }

  toolbarChangeHandler(e: any) {
    if (this.chartType !== e.target.value) {
      this.chartType = e.target.value;
      this.chart.destroy();
      this.chart = this.getChartJs(this.chartNode, this.chartType);
    }
  }

  createChart() {
    this.chart = this.getChartJs(this.chartNode, this.chartType);
  }

  private getChartJs(chartNode: HTMLElement, chartType: string): Chart {
    const ctx = (<any>chartNode).getContext("2d");
    const question: QuestionSelectBase = <any>this.question;
    const values = this.getValues();

    return new Chart(ctx, {
      type: chartType,
      data: {
        labels: this.getLabels(),
        datasets: this.getDatasets(values)
      },
      options: this.getOptions()
    });
  }

  getOptions(): Chart.ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales:
        ["pie", "doughnut"].indexOf(this.chartType) !== -1
          ? undefined
          : {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
    };
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

  getDatasets(values: Array<any>): any[] {
    const question: QuestionMatrixModel = <any>this.question;
    return [
      {
        label: question.title,
        data: this.getData(values)[0],
        backgroundColor: values.map(_ => this.getRandomColor())
      }
    ];
  }
}

// VisualizationManager.registerVisualizer("checkbox", SelectBaseChartJS);
// VisualizationManager.registerVisualizer("radiogroup", SelectBaseChartJS);
// VisualizationManager.registerVisualizer("dropdown", SelectBaseChartJS);
// VisualizationManager.registerVisualizer("imagepicker", SelectBaseChartJS);
