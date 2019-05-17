import { SurveyModel, QuestionSelectBase, ItemValue, QuestionMatrixModel } from "survey-core";
import Chart from "chart.js";
import { inherits } from 'util';

export class ChartJS {
  constructor(
    private targetNode: HTMLElement,
    protected survey: SurveyModel,
    public questionName: string,
    protected data: Array<{ [index: string]: any }>,
    private options?: Object
  ) { }

  private chart: Chart;

  protected chartTypes = ["bar", "horizontalBar", "line", "pie", "doughnut"];
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
    if (this.chartTypes.length > 0) {
      const select = document.createElement("select");
      this.chartTypes.forEach(chartType => {
        let option = document.createElement("option");
        option.value = chartType;
        option.text = chartType;
        option.selected = this.chartType === chartType;
        select.appendChild(option);
      });
      select.onchange = changeHandler;
      container.appendChild(select);
    }
  }

  private getChartJs(chartNode: HTMLCanvasElement, chartType: string): Chart {
    const ctx = <CanvasRenderingContext2D>chartNode.getContext("2d");
    const question: QuestionSelectBase = <any>(
      this.survey.getQuestionByName(this.questionName)
    );
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

  getRandomColor() {
    let color = [];
    for (let i = 0; i < 3; i++) {
      color[i] = Math.floor(Math.random() * 255);
    }
    return "rgba(" + color.join(", ") + ", 0.4)";
  }

  valuesSource(): any[] {
    const question: QuestionSelectBase = <any>(
      this.survey.getQuestionByName(this.questionName)
    );
    return question.choices;
  }

  getValues(): Array<any> {
    const values: Array<any> = this.valuesSource().map(choice => choice.value);
    return values;
  }

  getLabels(): Array<string> {
    const values: Array<any> = this.getValues();
    const labels: Array<string> = this.valuesSource().map(choice =>
      ItemValue.getTextOrHtmlByValue(this.valuesSource(), choice.value)
    );
    return labels;
  }

  getData(values: Array<any>): any[] {
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
            if (rowValue == val) {
              statistics[index]++;
            }
          });
        }
      }
    });
    return statistics;
  }

  getDatasets(values: Array<any>): any[] {
    const question: QuestionMatrixModel = <any>(
      this.survey.getQuestionByName(this.questionName)
    );
    return [
      {
        label: question.title,
        data: this.getData(values),
        backgroundColor: values.map(_ => this.getRandomColor())
      }
    ]
  }

}

export class MatrixChartJS extends ChartJS {

  constructor(
    targetNode: HTMLElement,
    survey: SurveyModel,
    questionName: string,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetNode, survey, questionName, data, options);
    this.chartTypes = [];
    this.chartType = "bar";
  }

  valuesSource(): any[] {
    const question: QuestionMatrixModel = <any>(
      this.survey.getQuestionByName(this.questionName)
    );
    return question.columns;
  }

  getLabels(): any[] {
    return undefined;
  }

  getOptions() {
    let options = super.getOptions();
    options.scales = undefined;
    // options.scales = {
    //   xAxes: [{ stacked: true }],
    //   yAxes: [{ stacked: true }]
    // }
    return options;
  }

  getData(values: Array<any>): any[] {
    return undefined;
  }

  getDatasets(values: Array<any>): any[] {
    const question: QuestionMatrixModel = <any>(
      this.survey.getQuestionByName(this.questionName)
    );
    const datasets: Array<any> = question.rows.map(row => {
      return {
        label: ItemValue.getTextOrHtmlByValue(question.rows, row.value),
        data: values.map(v => 0),
        backgroundColor: this.getRandomColor()
      }
    });

    this.data.forEach(rowData => {
      const questionValue: any = rowData[this.questionName];
      if (!!questionValue) {
        question.rows.forEach((row: any, dsIndex: number) => {
          values.forEach((val: any, index: number) => {
            if (questionValue[row.value] == val) {
              datasets[dsIndex].data[index]++;
            }
          });
        });
      }
    });
    return datasets;
  }

}