import { Question } from "survey-core";
import { VisualizationManager, VisualizerBase } from "../visualizationManager";

import c3 from "c3";

export class GaugeC3 extends VisualizerBase {
  private _result: any;
  private chart: c3.ChartAPI;

  constructor(
    protected targetNode: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetNode, question, data, options);
  }

  destroy() {
    this.chart.destroy();
  }

  render() {
    this.chart = c3.generate({
      bindto: this.targetNode,
      data: {
        columns: [[this.question.title, this.result]],
        type: "gauge"
      },
      gauge: {
        min: this.question.rateMin,
        max: this.question.rateMax,
        label: {
          format: function(value, ratio) {
            return value;
          }
        }
      },
      color: {
        pattern: [this.getRandomColor()]
      }
    });
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
}

// VisualizationManager.registerVisualizer("rating", GaugeC3);
