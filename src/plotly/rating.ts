import { Question, QuestionRatingModel } from "survey-core";
import { NumberModel } from "../number";
import { VisualizationManager } from "../visualizationManager";
import { allowDomRendering, DataHelper, DocumentHelper } from "../utils/index";

import { PlotlyChartAdapter } from "./selectBase";

export class GaugePlotly extends NumberModel {
  private _chartAdapter: PlotlyChartAdapter;

  public static displayModeBar: any = undefined;
  public static types = ["gauge", "bullet"];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name);
    this.chartTypes = GaugePlotly.types;
    this.chartType = this.chartTypes[0];
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

VisualizationManager.registerVisualizer("number", GaugePlotly);
VisualizationManager.registerVisualizer("rating", GaugePlotly);
VisualizationManager.registerVisualizer("expression", GaugePlotly);
