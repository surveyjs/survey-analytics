import { Question } from "survey-core";
import { PivotModel } from "../pivot";
import { PlotlyChartAdapter } from "./selectBase";
import { DocumentHelper } from "../utils";

export class PivotPlotly extends PivotModel {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["vbar", "bar"];

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

  protected getCalculatedValuesCore(): Array<any> {
    const statistics = super.getCalculatedValuesCore();
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

  public getValueType(): "enum" | "date" | "number" {
    return this.valueType;
  }
}
