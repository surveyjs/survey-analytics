import {
  Question,
  QuestionSelectBase,
  ItemValue,
  QuestionMatrixModel
} from "survey-core";
import c3 from "c3";

import { VisualizationManager, VisualizerBase } from "../visualizationManager";

export class SelectBaseC3 extends VisualizerBase {
  constructor(
    protected targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
  }

  private chart: c3.ChartAPI;
  protected chartTypes = ["bar"];
  chartType = "bar";

  destroy() {
    if (!this.chart) return;
    this.chart.destroy();
  }

  render() {
    var statistics = this.getData(this.getValues());
    this.chart = c3.generate({
      bindto: this.targetElement,
      data: {
        columns: this.getLabels().map((label, index) => {
          return [label, statistics[index]];
        }),
        type: this.chartType
      },
      color: {
        pattern: this.getLabels().map(_ => this.getRandomColor())
      },
      axis: {
        rotated: true
      }
    });
  }

  private createToolbar(
    container: HTMLDivElement,
    changeHandler: (e: any) => void
  ) {
    if (this.chartTypes.length > 0) {
      const select = document.createElement("select");
      this.chartTypes.forEach(chartType => {
        let option = document.createElement("option");
        option.value = chartType;
        option.text = chartType;
        option.selected = this.chartType === chartType;
        select.appendChild(option);
      });
      select.onchange = changeHandler;
      container.appendChild(select);
    }
  }

  valuesSource(): any[] {
    const question: QuestionSelectBase = <any>this.question;
    return question.choices;
  }

  getValues(): Array<any> {
    const values: Array<any> = this.valuesSource().map(choice => choice.value);
    return values;
  }

  getLabels(): Array<string> {
    const values: Array<any> = this.getValues();
    const labels: Array<string> = this.valuesSource().map(choice =>
      ItemValue.getTextOrHtmlByValue(this.valuesSource(), choice.value)
    );
    return labels;
  }

  getData(values: Array<any>): any[] {
    const statistics = values.map(v => 0);
    this.data.forEach(row => {
      const rowValue: any = row[this.question.name];
      if (!!rowValue) {
        if (Array.isArray(rowValue)) {
          values.forEach((val: any, index: number) => {
            if (rowValue.indexOf(val) !== -1) {
              statistics[index]++;
            }
          });
        } else {
          values.forEach((val: any, index: number) => {
            if (rowValue == val) {
              statistics[index]++;
            }
          });
        }
      }
    });
    return statistics;
  }
}

VisualizationManager.registerVisualizer("checkbox", SelectBaseC3);
VisualizationManager.registerVisualizer("radiogroup", SelectBaseC3);
VisualizationManager.registerVisualizer("dropdown", SelectBaseC3);
VisualizationManager.registerVisualizer("imagepicker", SelectBaseC3);
