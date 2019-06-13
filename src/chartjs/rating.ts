import { Question } from "survey-core";

import { VisualizationManager } from "../visualizationManager";
import { ChartJS } from "./selectBase";

export class RadialGaugeChartJS extends ChartJS {
  private _result;

  constructor(
    targetNode: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetNode, question, data, options);
    this.chartTypes = ["doughnut", "pie"];
    this.chartType = "doughnut";
  }

  get result() {
    if (this._result === undefined) {
      const questionValues: Array<any> = [];

      this.data.forEach(rowData => {
        const questionValue: any = rowData[this.question.name];
        if (!!questionValue) {
          questionValues.push(questionValue);
        }
      });

      this._result =
        questionValues.reduce((a, b) => {
          return a + b;
        }) / questionValues.length;
      this._result = Math.ceil(this._result * 100) / 100;
    }
    return this._result;
  }

  getLabels(): any[] {
    return [];
  }

  getOptions() {
    let options = {
      responsive: true,
      maintainAspectRatio: false,
      rotation: 1 * Math.PI,
      circumference: 1 * Math.PI
    };
    return options;
  }

  getData(values: Array<any>): any[] {
    return undefined;
  }

  getValues(): Array<any> {
    return null;
  }

  getDatasets(values: Array<any>): any[] {
    return [
      {
        data: [
          this.result - this.question.rateMin,
          this.question.rateMax - this.question.rateMin - this.result
        ],
        backgroundColor: [this.getRandomColor(), this.getRandomColor()]
      }
      // {
      //   data: [
      //     this.question.rateMin,
      //     this.question.rateMax - this.question.rateMin
      //   ],
      //   backgroundColor: ["rgba(255, 0, 0, 0.4)", "rgba(0, 255, 0, 0.4)"]
      // }
    ];
  }
}

VisualizationManager.registerVisualizer("rating", RadialGaugeChartJS);
