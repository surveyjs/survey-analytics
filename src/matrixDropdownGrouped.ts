import { ItemValue, QuestionMatrixDropdownModel, Question, MatrixDropdownColumn, MatrixDropdownRowModelBase } from "survey-core";
import { IAnswersData, SelectBase } from "./selectBase";
import { defaultStatisticsCalculator } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";

export class MatrixDropdownGrouped extends SelectBase {
  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "matrixDropdownGrouped");
    // this.getAnswersData();
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

  protected getCalculatedValuesCore(): Array<any> {
    const values = this.getValues();
    const series = this.getSeriesValues();
    const rows = this.matrixQuestion.rows.map(row => row.value);

    const statistics = defaultStatisticsCalculator(this.surveyData, {
      name: this.name,
      dataNames: series,
      getValues: () => values,
      getLabels: () => values,
      getSeriesValues: () => rows,
      getSeriesLabels: () => rows,
    });

    const preparedData: Array<Array<number>> = [];
    values.forEach((val, valueIndex) => {
      const seriesData = series.map(
        (seriesName, seriesIndex) => statistics[seriesIndex][0][valueIndex]
      );
      preparedData.push(seriesData);
    });
    return preparedData;
  }
}

VisualizationManager.registerVisualizer("matrixdropdown-grouped", MatrixDropdownGrouped);