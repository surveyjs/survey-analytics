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
  protected chartTypes = ["bar", "line", "pie", "donut"];
  chartType = "bar";

  destroy() {
    if (!this.chart) return;
    this.chart.destroy();
  }

  private getChartC3(chartNode: HTMLElement, chartType: string): c3.ChartAPI {
    var data = this.getData(this.getValues());
    var statistics = data[0];
    var columns = [["x"].concat(this.getLabels())];

    data.forEach((dataset, index) => {
      columns.push(["" + index].concat(dataset));
    });

    return c3.generate({
      bindto: chartNode,
      data: {
        x: "x",
        columns: columns,
        type: this.chartType
      },
      color: {
        pattern: this.getLabels().map(_ => this.getRandomColor())
      },
      axis: {
        x: {
          type: "category"
        },
        y: {
          tick: {
            values: statistics
          }
        },
        rotated: true
      },
      legend: {
        show: false
      }
    });
  }

  render() {
    const chartNodeContainer = document.createElement("div");
    const toolbarNodeContainer = document.createElement("div");
    const chartNode = <HTMLElement>document.createElement("div");

    chartNodeContainer.appendChild(toolbarNodeContainer);
    chartNodeContainer.appendChild(chartNode);
    this.targetElement.appendChild(chartNodeContainer);

    this.createToolbar(toolbarNodeContainer, (e: any) => {
      if (this.chartType !== e.target.value) {
        this.chartType = e.target.value;
        this.chart.destroy();
        this.chart = this.getChartC3(chartNode, this.chartType);
      }
    });

    this.chart = this.getChartC3(chartNode, this.chartType);
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
    return [statistics];
  }
}

VisualizationManager.registerVisualizer("checkbox", SelectBaseC3);
VisualizationManager.registerVisualizer("radiogroup", SelectBaseC3);
VisualizationManager.registerVisualizer("dropdown", SelectBaseC3);
VisualizationManager.registerVisualizer("imagepicker", SelectBaseC3);
