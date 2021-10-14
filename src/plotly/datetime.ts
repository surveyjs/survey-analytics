import { Question } from "survey-core";
import { DateTimeModel } from "../datetime";
import { DocumentHelper } from "../utils";
import { VisualizationManager } from "../visualizationManager";
import { localization } from "../localizationManager";
import { PlotlySetup } from "./selectBase";
import Plotly from "plotly.js";

export class PlotlyDateTimeAdapter {
  private _chart: Promise<Plotly.PlotlyHTMLElement> = undefined;

  constructor(private model: DateTimePlotly) { }

  public get chart() {
    return this._chart;
  }

  public create(chartNode: HTMLElement) {
    let [x, y] = this.model.getData();

    var data = [
      {
        x,
        y,
        type: this.model.chartType
      }
    ];

    var layout = {
      colorway: this.model.getColors()
    };

    const config = {
      locale: localization.currentLocale,
    };

    let options = {
      data: data,
      layout: layout,
      config: config,
    };
    PlotlySetup.onPlotCreating.fire(this.model, options);

    return (<any>Plotly).newPlot(
      chartNode,
      options.data,
      options.layout,
      options.config
    );
  }

  public destroy(node: HTMLElement) {
    (<any>Plotly).purge(node);
    this._chart = undefined;
  }
}

export class DateTimePlotly extends DateTimeModel {
  private _chartAdapter: PlotlyDateTimeAdapter;

  public static types = ["scatter", "bar"];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name);
    this.chartTypes = DateTimePlotly.types;
    this.chartType = this.chartTypes[0];
    this._chartAdapter = new PlotlyDateTimeAdapter(this);

    this.registerToolbarItem("changeChartType", () => {
      if (this.chartTypes.length > 1) {
        return DocumentHelper.createSelector(
          this.chartTypes.map((chartType) => {
            return {
              value: chartType,
              text: localization.getString("chartType_" + chartType),
            };
          }),
          (option: any) => this.chartType === option.value,
          (e: any) => {
            this.setChartType(e.target.value);
          }
        );
      }
      return null;
    });
  }

  protected onChartTypeChanged() { }

  protected setChartType(chartType: string) {
    if (
      this.chartTypes.indexOf(chartType) !== -1 &&
      this.chartType !== chartType
    ) {
      this.chartType = chartType;
      this.onChartTypeChanged();
      if (!!this.contentContainer) {
        this.destroyContent(this.contentContainer);
        this.renderContent(this.contentContainer);
      }
      this.invokeOnUpdate();
    }
  }

  protected renderContent(container: HTMLElement) {
    const chartNode: HTMLElement = DocumentHelper.createElement("div");
    container.appendChild(chartNode);
    this._chartAdapter.create(chartNode).then(() => {
      this.afterRender(this.contentContainer);
    });
  }
}

VisualizationManager.registerVisualizer("date", DateTimePlotly);
