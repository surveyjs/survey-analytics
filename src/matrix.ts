import { ItemValue, QuestionMatrixModel, Question } from "survey-core";
import { IAnswersData, SelectBase } from "./selectBase";

export class Matrix extends SelectBase {
  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "matrix");
    this.getAnswersData();
  }

  protected get matrixQuestion(): QuestionMatrixModel {
    return <QuestionMatrixModel>this.question;
  }

  protected isSupportMissingAnswers(): boolean {
    return false;
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

  private getHasAnswersInAllSeriesArray(
    datasets: Array<Array<any>>
  ): Array<boolean> {
    let result: Array<boolean> = Array<boolean>();
    for (let i = 0; i < datasets[0].length; i++) {
      for (let j = 0; j < datasets.length; j++) {
        if (datasets[j][i] != 0) {
          result[i] = true;
        }
      }
    }
    return result;
  }

  private getHasAnswersInSeries(dataset: Array<any>) {
    for (let i = 0; i < dataset.length; i++) {
      if (dataset[i] != 0) {
        return true;
      }
    }
    return false;
  }

  protected hideEmptyAnswersInData(answersData: IAnswersData): IAnswersData {
    const result: IAnswersData = {
      datasets: <Array<Array<any>>>[],
      labels: <Array<string>>[],
      colors: <Array<string>>[],
      texts: <Array<Array<any>>>[],
      seriesLabels: <Array<string>>[],
    };

    const hasAnswersInAllSeriesArr = this.getHasAnswersInAllSeriesArray(
      answersData.datasets
    );
    for (let i = 0; i < answersData.datasets.length; i++) {
      const hasAnswersInSeries = this.getHasAnswersInSeries(
        answersData.datasets[i]
      );
      if (hasAnswersInSeries) {
        result.labels.push(answersData.labels[i]);
        result.colors.push(answersData.colors[i]);
      } else {
        continue;
      }
      const datasets = [];
      const texts = [];
      for (let j = 0; j < answersData.datasets[0].length; j++) {
        if (hasAnswersInAllSeriesArr[j]) {
          datasets.push(answersData.datasets[i][j]);
          texts.push(answersData.texts[i][j]);
        }
      }
      result.datasets.push(datasets);
      result.texts.push(texts);
    }
    for (let i = 0; i < answersData.datasets[0].length; i++) {
      if (hasAnswersInAllSeriesArr[i]) {
        result.seriesLabels.push(answersData.seriesLabels[i]);
      }
    }
    return result;
  }

  public getCalculatedValues(): any[] {
    const statistics = super.getCalculatedValues();
    const series = this.getSeriesValues();
    const values = this.getValues();
    const preparedData: Array<Array<number>> = [];
    values.forEach((val, valueIndex) => {
      const seriesData = series.map(
        (seriesName, seriesIndex) => statistics[seriesIndex][valueIndex]
      );
      preparedData.push(seriesData);
    });
    return preparedData;
  }
}
