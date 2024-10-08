import { ItemValue, QuestionMatrixModel, Question } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { Matrix } from "../matrix";
import { PlotlyChartAdapter } from "./selectBase";
import { DocumentHelper } from "../utils";

export class MatrixPlotly extends Matrix {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["bar", "stackedbar", "pie", "doughnut"];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name);
    this.chartTypes = MatrixPlotly.types;
    this._chartType = this.chartTypes[0];
    this._chartAdapter = new PlotlyChartAdapter(this);
  }

  protected destroyContent(container: HTMLElement) {
    this._chartAdapter.destroy(<HTMLElement>container.children[0]);
    super.destroyContent(container);
  }

  protected async renderContentAsync(container: HTMLElement) {
    const chartNode: HTMLElement = DocumentHelper.createElement("div");
    container.innerHTML = "";
    container.appendChild(chartNode);
    await this._chartAdapter.create(chartNode);
    return container;
  }
}

VisualizationManager.registerVisualizer("matrix", MatrixPlotly);
