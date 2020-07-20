import { ItemValue, QuestionMatrixModel, Question } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { Matrix } from "../matrix";
import { PlotlyChartAdapter } from './selectBase';

export class PlotlyMatrixChartAdapter extends PlotlyChartAdapter {
  constructor(model: MatrixPlotly) {
    super(model);
  }

  protected patchConfigParameters(
    chartNode: HTMLDivElement,
    traces: Array<any>,
    layout: any,
    config: any
  ) {
    const question: QuestionMatrixModel = <any>this.model.question;
    //var valueTitles = question.columns.map(column => column.text);
    layout.showlegend = true;
    if (this.model.chartType === "pie" || this.model.chartType === "doughnut") {
      layout.grid = { rows: 1, columns: traces.length };
    } else if (this.model.chartType === "stackedbar") {
      layout.height = undefined;
      layout.barmode = "stack";
    } else {
      layout.height = undefined;
    }
    question.columns.forEach((column, index) => {
      if (this.model.chartType === "pie" || this.model.chartType === "doughnut") {
        traces[index].domain = { column: index };
      } else {
        traces[index].hoverinfo = "x+name";
        traces[index].marker.color = undefined;
        if (this.model.chartType === "stackedbar") {
          traces[index].type = "bar";
          traces[index].name = column.text;
          traces[index].width = 0.5 / traces.length;
        } else {
          traces[index].name = column.text;
          traces[index].width = 0.5 / traces.length;
        }
      }
    });
  }

}

export class MatrixPlotly extends Matrix {
  private _chartAdapter: PlotlyMatrixChartAdapter;
  public static types = ["bar", "stackedbar", "pie", "doughnut"];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    this.chartTypes = MatrixPlotly.types;
    this.chartType = this.chartTypes[0];
    this._chartAdapter = new PlotlyMatrixChartAdapter(this);
  }

  protected destroyContent(container: HTMLElement) {
    this._chartAdapter.destroy(<HTMLElement>container.children[0]);
    super.destroyContent(container);
  }

  protected renderContent(container: HTMLElement) {
    const chartNode: HTMLElement = <HTMLElement>document.createElement("div");
    container.appendChild(chartNode);
    this._chartAdapter.create(chartNode);
  }

}

VisualizationManager.registerVisualizer("matrix", MatrixPlotly);
