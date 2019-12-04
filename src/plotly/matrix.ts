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
    this.chartTypes = MatrixPlotly.types;
    this.chartType = this.chartTypes[0];
  }

  public static types = ["bar", "stackedbar", "pie", "doughnut"];

  protected patchConfigParameters(
    chartNode: HTMLDivElement,
    traces: Array<any>,
    layout: any,
    config: any
  ) {
    const question: QuestionMatrixModel = <any>this.question;
    //var valueTitles = question.columns.map(column => column.text);
    if (this.chartType === "pie" || this.chartType === "doughnut") {
      layout.grid = {rows: 1, columns: traces.length};
    } else if(this.chartType === "stackedbar") {
      layout.height = undefined;
      layout.barmode = 'stack';
    } else {
      layout.height = undefined;
    }
    question.columns.forEach((column, index) => {
      if (this.chartType === "pie" || this.chartType === "doughnut") {
        traces[index].domain = { column: index };
      } if(this.chartType === "stackedbar") {
        traces[index].type = "bar";
        traces[index].name = column.text;
        traces[index].width = 0.5 / traces.length;
      } else {
        traces[index].name = column.text;
        traces[index].width = 0.5 / traces.length;
      }
    });
  }

  valuesSource(): any[] {
    const question: QuestionMatrixModel = <any>this.question;
    return question.columns;
  }

  getLabels(): any[] {
    const question: QuestionMatrixModel = <any>this.question;
    return question.rows.map((row: any) =>
      ItemValue.getTextOrHtmlByValue(question.rows, row.value)
    );
  }

  getData(): any[] {
    const question: QuestionMatrixModel = <any>this.question;
    const datasets: Array<any> = this.valuesSource().map(choice => {
      return question.rows.map((v: any) => 0);
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
