import { Question } from "survey-core";
import { SelectBase } from "../selectBase";
import { DocumentHelper } from "../utils";
import { VisualizationManager } from "../visualizationManager";
import { PlotlyChartAdapter } from "./selectBase";

export class PlotlyPollChartAdapter extends PlotlyChartAdapter {
  constructor(model: PollPlotly) {
    super(model);
  }

  protected patchConfigParameters(
    chartNode: object,
    traces: Array<object>,
    layout: any,
    config: object
  ) {

    // layout.showlegend = false;

    // layout.xaxis.zeroline = false;
    // layout.xaxis.showline = false;
    // layout.xaxis.showticklabels = true;
    // layout.xaxis.showgrid = false;

    // layout.yaxis.zeroline = false;
    // layout.yaxis.showline = false;
    // layout.yaxis.showticklabels = true;
    // layout.yaxis.showgrid = false;

    layout.xaxis.visible = false;
    layout.yaxis.visible = false;
    layout.grid = { rows: 1, columns: 1, pattern: "independent" };

    traces.forEach((trace: any) => {
      trace.text = ["some test some"];
      trace.textposition = "top left";
    });

    // layout.annotations = [];
    // const annotation = {
    //   visible: true,
    //   clicktoshow: false,
    //   opacity: 1,
    //   bgcolor: "rgba(0, 0, 0, 0)",
    //   bordercolor: "rgba(0, 0, 0, 0)",
    //   borderpad: 1,
    //   borderwidth: 1,
    //   showarrow: false,
    //   text: "qwe dfgdfghdfgd fg",
    //   textangle: 0,
    //   align: "left",
    //   captureevents: false,
    //   xref: "x",
    //   x: 0,
    //   xanchor: "left",
    //   xshift: 0,
    //   yref: "y",
    //   y: 1.5,
    //   yanchor: top,
    //   yshift: 0
    // };
    // layout.annotations.push(annotation);
    // layout.annotations.push(annotation);
    // layout.annotations.push(annotation);
    // layout.annotations.push(annotation);
  }
}

export class PollPlotly extends SelectBase {
  private _chartAdapter: PlotlyPollChartAdapter;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: any,
    name?: string
  ) {
    super(question, data, options, "poll");
    this.chartTypes = ["bar"];
    this.chartType = "bar";
    this._chartAdapter = new PlotlyPollChartAdapter(this);
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

VisualizationManager.registerVisualizer("checkbox", PollPlotly);
VisualizationManager.registerVisualizer("radiogroup", PollPlotly);
VisualizationManager.registerVisualizer("dropdown", PollPlotly);
VisualizationManager.registerVisualizer("imagepicker", PollPlotly);