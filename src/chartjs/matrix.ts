import {
  SurveyModel,
  ItemValue,
  QuestionMatrixModel,
  Question
} from "survey-core";

import { VisualizationManager } from "../visualizationManager";
import { ChartJS } from "./selectBase";

export class MatrixChartJS extends ChartJS {
  constructor(
    targetNode: HTMLElement,
    survey: SurveyModel,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetNode, survey, question, data, options);
    this.chartType = "bar";
  }

  valuesSource(): any[] {
    const question: QuestionMatrixModel = <any>this.question;
    return question.columns;
  }

  getLabels(): any[] {
    const question: QuestionMatrixModel = <any>this.question;
    return question.rows.map(row =>
      ItemValue.getTextOrHtmlByValue(question.rows, row.value)
    );
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
    const question: QuestionMatrixModel = <any>this.question;
    const datasets: Array<any> = this.valuesSource().map(choice => {
      return {
        label: ItemValue.getTextOrHtmlByValue(
          this.valuesSource(),
          choice.value
        ),
        data: question.rows.map(v => 0),
        backgroundColor: this.getRandomColor()
      };
    });

    this.data.forEach(rowData => {
      const questionValue: any = rowData[this.question.name];
      if (!!questionValue) {
        question.rows.forEach((row: any, index: number) => {
          values.forEach((val: any, dsIndex: number) => {
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

VisualizationManager.registerVisualizer("matrix", MatrixChartJS);
