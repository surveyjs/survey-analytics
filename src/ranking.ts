import { VisualizationManager } from "./visualizationManager";
import { SelectBase } from "./selectBase";
import { QuestionRankingModel } from "survey-core";
import { ICalculationResult } from "./visualizerBase";

export class RankingModel extends SelectBase {

  constructor(
    question: QuestionRankingModel,
    data: Array<{ [index: string]: any }>,
    options?: any,
    type?: string
  ) {
    super(question, data, options, type || "ranking");
  }

  getQuestionResults() {
    const name = this.question.name;
    return this.data.map((dataItem) => dataItem[name]);
  }

  getEmptyData() {
    const choices = this.getValues();
    let data: any = [];

    data.length = choices.length;
    data.fill(0);

    return data;
  }

  protected getCalculatedValuesCore(): ICalculationResult {
    const results = this.getQuestionResults();
    const values = this.getValues();

    let calculatedData = this.getEmptyData();
    results.forEach((result) => {
      this.applyResultToPlotlyData(result, calculatedData, values);
    });

    return {
      data: [calculatedData],
      values
    };
  }

  applyResultToPlotlyData(result: any[], plotlyData: any, choices: any) {
    if(!result || !plotlyData || !choices) return;

    result.forEach((resultValue: any, resultValueIndex: number, result: any[]) => {
      let index = choices.indexOf(resultValue);
      plotlyData[index] =
        +plotlyData[index] + (result.length - resultValueIndex);
    });
  }
}

VisualizationManager.registerVisualizer("ranking", RankingModel);
