import { SurveyModel, QuestionSelectBase, ItemValue } from "survey-core";
import Chart from "chart.js";

export class ChartJS {
  constructor(
    private targetNode: HTMLElement,
    private survey: SurveyModel,
    public questionName: string,
    private data: Array<{ [index: string]: any }>,
    private options?: Object
  ) {}

  private chart: Chart;

  chartType = "horizontalBar";

  destroy() {
    if (!!this.chart) {
      this.chart.destroy();
      this.chart = undefined;
      this.targetNode.innerHTML = "";
    }
  }

  render() {
    const chartNodeContainer = document.createElement("div");
    const toolbarNodeContainer = document.createElement("div");
    const chartNode = <HTMLCanvasElement>document.createElement("canvas");

    chartNodeContainer.appendChild(toolbarNodeContainer);
    chartNodeContainer.appendChild(chartNode);
    this.targetNode.appendChild(chartNodeContainer);

    this.chart = this.getChartJs(chartNode, this.chartType);

    this.createToolbar(toolbarNodeContainer, (e: any) => {
      if (this.chartType !== e.target.value) {
        this.chartType = e.target.value;
        this.chart.destroy();
        this.chart = this.getChartJs(chartNode, this.chartType);
      }
    });
  }

  private createToolbar(
    container: HTMLDivElement,
    changeHandler: (e: any) => void
  ) {
    const chartTypes = ["bar", "horizontalBar", "line", "pie", "doughnut"];
    const select = document.createElement("select");
    chartTypes.forEach(chartType => {
      let option = document.createElement("option");
      option.value = chartType;
      option.text = chartType;
      option.selected = this.chartType === chartType;
      select.appendChild(option);
    });
    select.onchange = changeHandler;
    container.appendChild(select);
  }

  private getChartJs(chartNode: HTMLCanvasElement, chartType: string): Chart {
    const ctx = <CanvasRenderingContext2D>chartNode.getContext("2d");
    const question: QuestionSelectBase = <any>(
      this.survey.getQuestionByName(this.questionName)
    );
    const values = this.getValues();

    let options = {
      responsive: true,
      maintainAspectRatio: false,
      scales:
        ["pie", "doughnut"].indexOf(chartType) !== -1
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

    return new Chart(ctx, {
      type: chartType,
      data: {
        labels: this.getLabels(values),
        datasets: [
          {
            label: question.title,
            data: this.getData(values),
            backgroundColor: values.map(_ => this.getRandomColor())
          }
        ]
      },
      options: options
    });
  }

  getRandomColor() {
    let color = [];
    for (let i = 0; i < 3; i++) {
      color[i] = Math.floor(Math.random() * 255);
    }
    return "rgba(" + color.join(", ") + ", 0.4)";
  }

  getValues(): Array<any> {
    const question: QuestionSelectBase = <any>(
      this.survey.getQuestionByName(this.questionName)
    );
    const values: Array<any> = question.choices.map(choice => choice.value);
    return values;
  }

  getLabels(values: Array<any>): Array<string> {
    const question: QuestionSelectBase = <any>(
      this.survey.getQuestionByName(this.questionName)
    );
    const labels: Array<string> = question.choices.map(choice =>
      ItemValue.getTextOrHtmlByValue(question.choices, choice.value)
    );
    return labels;
  }

  getData(values: Array<any>): number[] {
    const statistics = values.map(v => 0);
    this.data.forEach(row => {
      const rowValue: any = row[this.questionName];
      if (!!rowValue) {
        if (Array.isArray(rowValue)) {
          values.forEach((val: any, index: number) => {
            if (rowValue.indexOf(val) !== -1) {
              statistics[index]++;
            }
          });
        } else {
          values.forEach((val: any, index: number) => {
            if (rowValue === val) {
              statistics[index]++;
            }
          });
        }
      }
    });
    return statistics;
  }
}
