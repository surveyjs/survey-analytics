import { Question, QuestionBooleanModel } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { BooleanModel } from "../boolean";
import { PlotlyChartAdapter } from "./selectBase";
import { DocumentHelper } from "../utils";
import { SelectBase } from "../selectBase";

export class PlotlyBoolChartAdapter extends PlotlyChartAdapter {
  constructor(model: BooleanPlotly) {
    super(model);
  }

  protected patchConfigParameters(
    chartNode: object,
    traces: Array<object>,
    layout: object,
    config: object
  ) {
    const colors = this.model.getColors();
    const boolColors = [
      BooleanPlotly.trueColor || colors[0],
      BooleanPlotly.falseColor || colors[1],
    ];
    if((this.model as SelectBase).showMissingAnswers) {
      boolColors.push(colors[2]);
    }

    const chartType = (this.model as any).chartType;
    if (chartType === "pie" || chartType === "doughnut") {
      traces.forEach((trace: any) => {
        trace.marker.colors = boolColors;
      });
    } else if (chartType === "bar") {
      traces.forEach((trace: any) => {
        trace.marker.color = boolColors;
      });
    }
  }
}

export class BooleanPlotly extends BooleanModel {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["pie", "bar", "doughnut"];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name);
    this.chartTypes = BooleanPlotly.types;
    this._chartType = this.chartTypes[0];
    this._chartAdapter = new PlotlyBoolChartAdapter(this);
  }

  protected destroyContent(container: HTMLElement) {
    this._chartAdapter.destroy(<HTMLElement>container.children[0]);
    super.destroyContent(container);
  }

  protected async renderContentAsync(container: HTMLElement) {
    const chartNode: HTMLElement = DocumentHelper.createElement("div");
    await this._chartAdapter.create(chartNode);
    container.innerHTML = "";
    container.appendChild(chartNode);
    return container;
  }
}

VisualizationManager.registerVisualizer("boolean", BooleanPlotly);
