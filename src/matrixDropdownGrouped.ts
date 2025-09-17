import { ItemValue, QuestionMatrixDropdownModel, Question, MatrixDropdownColumn, MatrixDropdownRowModelBase } from "survey-core";
import { SelectBase } from "./selectBase";
import { defaultStatisticsCalculator } from "./statisticCalculators";
import { VisualizationManager } from "./visualizationManager";
import { ICalculationResult } from "./visualizerBase";

export class MatrixDropdownGrouped extends SelectBase {
  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "matrixDropdownGrouped");
  }

  protected get matrixQuestion(): QuestionMatrixDropdownModel {
    return <QuestionMatrixDropdownModel>this.question;
  }

  get dataNames(): Array<string> {
    return this.matrixQuestion.columns.map(column => column.name);
  }

  getSeriesValues(): Array<string> {
    return this.matrixQuestion.columns.map((column: MatrixDropdownColumn) => column.name);
  }

  getSeriesLabels(): Array<string> {
    return this.matrixQuestion.columns.map((column: MatrixDropdownColumn) => column.title);
  }

  // public getSelectedItemByText(itemText: string) {
  //   return this.matrixQuestion.columns.filter(
  //     (column: ItemValue) => column.text === itemText
  //   )[0];
  // }

  valuesSource(): Array<ItemValue> {
    return this.matrixQuestion.choices;
  }

  protected isSupportMissingAnswers(): boolean {
    return false;
  }

  protected getCalculatedValuesCore(): ICalculationResult {
    const values = this.getValues();
    const series = this.getSeriesValues();
    const rows = this.matrixQuestion.rows.map(row => row.value);

    return defaultStatisticsCalculator(this.surveyData, {
      name: this.name,
      dataNames: series,
      getValues: () => values,
      getLabels: () => values,
      getSeriesValues: () => rows,
      getSeriesLabels: () => rows,
    });
  }
}

VisualizationManager.registerVisualizer("matrixdropdown-grouped", MatrixDropdownGrouped);