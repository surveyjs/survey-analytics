import { VisualizationManager } from "../visualizationManager";
import { SelectBasePlotly } from "./selectBase";

export class RankingPlotly extends SelectBasePlotly {
  getQuestionResults() {
    const name = this.question.name;
    return this.data.map((dataItem) => dataItem[name]);
  }

  getEmptyData() {
    const choices = this.getValues();
    let data = [];

    data.length = choices.length;
    data.fill(0);

    return data;
  }

  getData(): any[] {
    const results = this.getQuestionResults();
    const choices = this.getValues();

    let plotlyData = this.getEmptyData();

    results.forEach((result) => {
      this.applyResultToPlotlyData(result, plotlyData, choices);
    });

    return [plotlyData];
  }

  applyResultToPlotlyData(result, plotlyData, choices) {
    if (!result || !plotlyData || !choices) return;

    result.forEach((resultValue, resultValueIndex, result) => {
      let index = choices.indexOf(resultValue);
      plotlyData[index] =
        +plotlyData[index] + (result.length - resultValueIndex);
    });
  }
}

VisualizationManager.registerVisualizer("ranking", RankingPlotly);
