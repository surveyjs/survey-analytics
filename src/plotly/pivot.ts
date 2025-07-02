import { Question } from "survey-core";
import { PivotModel } from "../pivot";
import { PlotlyChartAdapter } from "./selectBase";
import { DocumentHelper } from "../utils";
import { VisualizationManager } from "../visualizationManager";

export class PivotPlotly extends PivotModel {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["vbar", "bar", "line", "stackedbar", "pie", "doughnut"]; // ["vbar", "bar"];

  constructor(
    questions: Array<Question>,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(questions, data, options, name);
    this.chartTypes = PivotPlotly.types;
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

  public getValueType(): "enum" | "date" | "number" {
    return this.valueType;
  }
}

VisualizationManager.registerPivotVisualizer(PivotPlotly);
