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

  public get name() {
    return "matrix";
  }

  getSeriesValues(): Array<string> {
    const question: QuestionMatrixModel = <any>this.question;
    return question.rows.map((row: ItemValue) => "" + row.value);
  }

  getSeriesLabels(): Array<string> {
    const question: QuestionMatrixModel = <any>this.question;
    return question.rows.map((row: ItemValue) =>
      ItemValue.getTextOrHtmlByValue(question.rows, row.value)
    );
  }

  valuesSource(): Array<ItemValue> {
    const question: QuestionMatrixModel = <any>this.question;
    return question.columns;
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
