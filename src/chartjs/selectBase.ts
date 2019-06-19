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

  toolbarChangeHandler = (e: any) => {
    if (this.chartType !== e.target.value) {
      this.chartType = e.target.value;
      this.chart.destroy();
      this.chart = this.getChartJs(this.chartNode, this.chartType);
    }
  };

  createChart() {
    this.chart = this.getChartJs(this.chartNode, this.chartType);
  }

  private getChartJs(chartNode: HTMLElement, chartType: string): Chart {
    const ctx = (<any>chartNode).getContext("2d");

    return new Chart(ctx, {
      type: chartType,
      data: {
        labels: this.getLabels(),
        datasets: this.getDatasets()
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

  getDatasets(): any[] {
    const question: QuestionMatrixModel = <any>this.question;
    return [
      {
        label: question.title,
        data: this.getData()[0],
        backgroundColor: this.getValues().map(_ => this.getRandomColor())
      }
    ];
  }
}

// VisualizationManager.registerVisualizer("checkbox", SelectBaseChartJS);
// VisualizationManager.registerVisualizer("radiogroup", SelectBaseChartJS);
// VisualizationManager.registerVisualizer("dropdown", SelectBaseChartJS);
// VisualizationManager.registerVisualizer("imagepicker", SelectBaseChartJS);
