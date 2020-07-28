import { ItemValue, QuestionMatrixModel, Question } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { Matrix } from "../matrix";
import { PlotlyChartAdapter } from "./selectBase";

export class MatrixPlotly extends Matrix {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["bar", "stackedbar", "pie", "doughnut"];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    this.chartTypes = MatrixPlotly.types;
    this.chartType = this.chartTypes[0];
    this._chartAdapter = new PlotlyChartAdapter(this);
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
