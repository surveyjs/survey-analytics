import { Question, QuestionBooleanModel } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { BooleanModel } from "../boolean";
import { PlotlyChartAdapter } from './selectBase';

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
      BooleanPlotly.falseColor || colors[1]
    ];

    if (this.model.chartType === "pie" || this.model.chartType === "doughnut") {
      traces.forEach((trace: any) => {
        trace.marker.colors = boolColors;
      });
    } else if (this.model.chartType === "bar") {
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
    options?: Object
  ) {
    super(question, data, options);
    this.chartTypes = BooleanPlotly.types;
    this.chartType = this.chartTypes[0];
    this._chartAdapter = new PlotlyBoolChartAdapter(this);
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

VisualizationManager.registerVisualizer("boolean", BooleanPlotly);
