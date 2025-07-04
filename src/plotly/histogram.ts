import { Question } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { HistogramModel } from "../histogram";
import { PlotlyChartAdapter } from "./selectBase";
import { DocumentHelper } from "../utils";

export class HistogramPlotly extends HistogramModel {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["vbar", "bar"];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name);
    this.chartTypes = HistogramPlotly.types;
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

  public getValueType(): "date" | "number" {
    return this.valueType;
  }
}

VisualizationManager.registerVisualizer("date", HistogramPlotly);
VisualizationManager.registerVisualizer("number", HistogramPlotly);
VisualizationManager.registerVisualizer("rating", HistogramPlotly);
