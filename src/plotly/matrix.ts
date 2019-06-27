import { ItemValue, QuestionMatrixModel, Question } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { SelectBasePlotly } from "./selectBase";

export class MatrixPlotly extends SelectBasePlotly {
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

  getData(): any[] {
    const question: QuestionMatrixModel = <any>this.question;
    const datasets: Array<any> = this.valuesSource().map(choice => {
      return question.rows.map(v => 0);
    });

    this.data.forEach(rowData => {
      const questionValue: any = rowData[this.question.name];
      if (!!questionValue) {
        question.rows.forEach((row: any, index: number) => {
          this.getValues().forEach((val: any, dsIndex: number) => {
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

VisualizationManager.registerVisualizer("matrix", MatrixPlotly);
