import { Question } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { HistogramModel } from "../histogram";
import { PlotlyChartAdapter } from "./selectBase";
import { DocumentHelper } from "../utils";

export class HistogramPlotly extends HistogramModel {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["vbar", "bar", "scatter"];

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

  protected renderContent(container: HTMLElement) {
    const chartNode: HTMLElement = <HTMLElement>(
      DocumentHelper.createElement("div")
    );
    container.appendChild(chartNode);
    this._chartAdapter.create(chartNode).then(() => {
      this.afterRender(this.contentContainer);
    });
  }

  public getCalculatedValues(): any[] {
    const statistics = super.getCalculatedValues();
    const series = this.getSeriesValues();
    const values = this.getValues();
    if (series.length > 1) {
      const preparedData: Array<Array<number>> = [];
      values.forEach((val, valueIndex) => {
        const seriesData = series.map(
          (seriesValue, seriesIndex) => statistics[seriesIndex][valueIndex]
        );
        preparedData.push(seriesData);
      });
      return preparedData;
    }
    return statistics;
  }

  public getValueType(): "date" | "number" {
    return this.valueType;
  }
}

VisualizationManager.registerVisualizer("date", HistogramPlotly);
VisualizationManager.registerVisualizer("number", HistogramPlotly);
VisualizationManager.registerVisualizer("rating", HistogramPlotly);
