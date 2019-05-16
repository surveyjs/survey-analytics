import { SurveyModel, QuestionSelectBase, ItemValue } from "survey-core";
import Chart from "chart.js";

export class ChartJS {
  constructor(
    private targetNode: HTMLElement,
    private survey: SurveyModel,
    private questionName: string,
    private data: Array<{ [index: string]: any }>,
    private options?: Object
  ) {}

  render() {
    const chartNodeContainer = document.createElement("div");
    const chartNode = <HTMLCanvasElement>document.createElement("canvas");

    chartNode.id = "myChart";

    chartNodeContainer.appendChild(chartNode);
    this.targetNode.appendChild(chartNodeContainer);

    const ctx = <CanvasRenderingContext2D>chartNode.getContext("2d");
    const question: QuestionSelectBase = <any>(
      this.survey.getQuestionByName(this.questionName)
    );
    const values = this.getValues();
    const myChart = new Chart(ctx, {
      type: "doughnut",
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
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
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
