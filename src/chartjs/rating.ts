import { SurveyModel, Question } from "survey-core";
import "chartjs-chart-radial-gauge";

import { VisualizationManager } from "../visualizationManager";
import { ChartJS } from "./selectBase";

export class RadialGaugeChartJS extends ChartJS {
  constructor(
    targetNode: HTMLElement,
    survey: SurveyModel,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetNode, survey, question, data, options);
    this.chartType = "radialGauge";
  }

  getLabels(): any[] {
    return [this.question.name];
  }

  getOptions() {
    let options = super.getOptions();
    options.scales = undefined;
    return options;
  }

  getData(values: Array<any>): any[] {
    return undefined;
  }

  getValues(): Array<any> {
    return null;
  }

  getDatasets(values: Array<any>): any[] {
    const datasets: Array<any> = [];

    this.data.forEach(rowData => {
      const questionValue: any = rowData[this.question.name];
      if (!!questionValue) {
        datasets.push(questionValue);
      }
    });

    const result =
      datasets.reduce((a, b) => {
        return a + b;
      }) / datasets.length;

    return [
      {
        data: [result]
      }
    ];
  }
}

VisualizationManager.registerVisualizer("rating", RadialGaugeChartJS);
