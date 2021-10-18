import { Question } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { HistogramModel } from "../histogram";
import { PlotlyChartAdapter } from "./selectBase";
import { DocumentHelper } from "../utils";

export class HistogramPlotly extends HistogramModel {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["bar", "scatter"];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name);
    this.chartTypes = HistogramPlotly.types;
    this.chartType = this.chartTypes[0];
    this._chartAdapter = new PlotlyChartAdapter(this);
  }

  protected destroyContent(container: HTMLElement) {
    this._chartAdapter.destroy(<HTMLElement>container.children[0]);
    super.destroyContent(container);
  }

  protected renderContent(container: HTMLElement) {
    const chartNode: HTMLElement = <HTMLElement>(
      DocumentHelper.createElement("div")
    );
    container.appendChild(chartNode);
    this._chartAdapter.create(chartNode).then(() => {
      this.afterRender(this.contentContainer);
    });
  }
}

VisualizationManager.registerVisualizer("date", HistogramPlotly);
VisualizationManager.registerVisualizer("number", HistogramPlotly);
VisualizationManager.registerVisualizer("rating", HistogramPlotly);
