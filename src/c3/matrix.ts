import { ItemValue, QuestionMatrixModel, Question } from "survey-core";

import { VisualizationManager } from "../visualizationManager";
import { SelectBaseC3 } from "./selectBase";

export class MatrixС3 extends SelectBaseC3 {
  constructor(
    targetNode: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetNode, question, data, options);
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

  getData(values: Array<any>): any[] {
    const question: QuestionMatrixModel = <any>this.question;
    const datasets: Array<any> = this.valuesSource().map(choice => {
      return question.rows.map(v => 0);
    });

    this.data.forEach(rowData => {
      const questionValue: any = rowData[this.question.name];
      if (!!questionValue) {
        question.rows.forEach((row: any, index: number) => {
          values.forEach((val: any, dsIndex: number) => {
            if (questionValue[row.value] == val) {
              datasets[dsIndex][index]++;
            }
          });
        });
      }
    });
    return datasets;
  }
}

VisualizationManager.registerVisualizer("matrix", MatrixС3);
