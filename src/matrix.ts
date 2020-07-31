import { ItemValue, QuestionMatrixModel, Question } from "survey-core";
import { SelectBase } from "./selectBase";

export class Matrix extends SelectBase {
  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
  }

  protected get matrixQuestion(): QuestionMatrixModel {
    return <QuestionMatrixModel>this.question;
  }

  public get name() {
    return "matrix";
  }

  getSeriesValues(): Array<string> {
    return this.matrixQuestion.rows.map((row: ItemValue) => "" + row.value);
  }

  getSeriesLabels(): Array<string> {
    return this.matrixQuestion.rows.map((row: ItemValue) =>
      ItemValue.getTextOrHtmlByValue(this.matrixQuestion.rows, row.value)
    );
  }

  public getSelectedItemByText(itemText: string) {
    return this.matrixQuestion.columns.filter(
      (column: ItemValue) => column.text === itemText
    )[0];
  }

  valuesSource(): Array<ItemValue> {
    return this.matrixQuestion.columns;
  }

  getData(): any[] {
    const statistics = super.getData();
    const series = this.getSeriesValues();
    const values = this.getValues();
    if (series.length > 1) {
      const preparedData: Array<Array<number>> = [];
      values.forEach((val, valueIndex) => {
        const seriesData = series.map(
          (seriesName, seriesIndex) => statistics[seriesIndex][valueIndex]
        );
        preparedData.push(seriesData);
      });
      return preparedData;
    }
    return statistics;
  }
}
