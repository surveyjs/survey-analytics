import { QuestionMatrixDropdownModel } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { MatrixDropdownGrouped } from "../matrixDropdownGrouped";
import { PlotlyChartAdapter } from "./selectBase";
import { DocumentHelper } from "../utils";

export class MatrixDropdownGroupedPlotly extends MatrixDropdownGrouped {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["stackedbar", "bar", "pie", "doughnut"];

  constructor(
    question: QuestionMatrixDropdownModel,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name);
    this.chartTypes = MatrixDropdownGroupedPlotly.types;
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

VisualizationManager.registerVisualizer("matrixdropdown-grouped", MatrixDropdownGroupedPlotly);
