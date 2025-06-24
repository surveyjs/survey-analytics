import { Question, ItemValue, Event } from "survey-core";
import { SelectBase } from "../selectBase";
import { VisualizationManager } from "../visualizationManager";
import { allowDomRendering, DataHelper, DocumentHelper } from "../utils";
import { localization } from "../localizationManager";
import { Chart, ChartConfiguration, ChartData, ChartOptions } from "chart.js";
import { ChartJSSetup } from "./setup";

export class ChartJSAdapter {
  private _chart: Chart = undefined;

  constructor(protected model: SelectBase) { }

  protected patchConfigParameters(
    chartNode: object,
    data: ChartData,
    options: ChartOptions,
    config: any
  ) { }

  public get chart() {
    return this._chart;
  }

  public async create(chartNode: HTMLElement): Promise<any> {
    const [chart, chartOptions] = await this.update(chartNode);

    // Add click event handler
    chartNode.addEventListener("click", (event) => {
      const points = chart.getElementsAtEventForMode(event, "nearest", { intersect: true }, true);
      if (points.length > 0) {
        const firstPoint = points[0];
        const datasetIndex = firstPoint.datasetIndex;
        const index = firstPoint.index;

        let itemText = "";
        if (!chartOptions.hasSeries) {
          itemText = chart.data.labels[index];
          const item: ItemValue = this.model.getSelectedItemByText(itemText);
          this.model.setSelection(item);
        } else {
          itemText = chart.data.labels[index];
          const propertyLabel = chart.data.datasets[datasetIndex].label;
          const seriesValues = this.model.getSeriesValues();
          const seriesLabels = this.model.getSeriesLabels();
          const propertyValue = seriesValues[seriesLabels.indexOf(propertyLabel)];
          const selectedItem: ItemValue = this.model.getSelectedItemByText(itemText);
          const item = new ItemValue({ [propertyValue]: selectedItem.value }, propertyLabel + ": " + selectedItem.text);
          this.model.setSelection(item);
        }
      }
    });

    // Add hover effects
    chartNode.style.cursor = "pointer";
    chartNode.addEventListener("mouseenter", () => {
      chartNode.style.cursor = "pointer";
    });
    chartNode.addEventListener("mouseleave", () => {
      chartNode.style.cursor = "default";
    });

    this._chart = chart;
    return chart;
  }

  public async update(chartNode: HTMLElement): Promise<any> {
    const answersData = await this.model.getAnswersData();
    var chartOptions = ChartJSSetup.setup(this.model.chartType, this.model, answersData);

    let config: any = {
      responsive: true,
      maintainAspectRatio: false,
      // locale: localization.currentLocale,
      plugins: {
        legend: {
          display: chartOptions.hasSeries && this.model.chartType !== "stackedbar",
          position: "top" as const,
        },
        tooltip: {
          enabled: true,
          mode: "index" as const,
          intersect: false,
        },
        customCanvasBackgroundColor: {
          color: this.model.backgroundColor,
        }
      },
      interaction: {
        mode: "nearest" as const,
        axis: "x" as const,
        intersect: false,
      },
    };

    if (ChartJSSelectBase.displayModeBar !== undefined) {
      config.responsive = ChartJSSelectBase.displayModeBar;
    }

    this.patchConfigParameters(
      chartNode,
      chartOptions.data,
      chartOptions.options,
      config
    );

    let options = {
      data: chartOptions.data,
      options: { ...chartOptions.options, ...config },
    };
    ChartJSSetup.onChartCreating.fire(this.model, options);

    if (this._chart) {
      this._chart.destroy();
    }

    const chart = new Chart(chartNode as HTMLCanvasElement, {
      type: chartOptions.type as any,
      data: options.data,
      options: options.options,
    });

    return [chart, chartOptions];
  }

  public destroy(node: HTMLElement) {
    if (this._chart) {
      this._chart.destroy();
      this._chart = undefined;
    }
  }
}

export class ChartJSSelectBase extends SelectBase {
  private _chartAdapter: ChartJSAdapter;
  public static types = ["bar", "vbar", "pie", "doughnut"];
  public static displayModeBar: any = undefined;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {},
    name?: string
  ) {
    super(question, data, options, name);
    this.chartTypes = [].concat(ChartJSSelectBase.types);
    if (this.getSeriesValues().length > 0 && this.chartTypes.indexOf("stackedbar") === -1) {
      this.chartTypes.push("stackedbar");
    }
    if(options.allowExperimentalFeatures) {
      // this.chartTypes.splice(1, 0, "vbar");
    }
    this._chartType = this.chartTypes[0];
    if (this.chartTypes.indexOf(options.defaultChartType) !== -1) {
      this._chartType = options.defaultChartType;
    }
    this._chartAdapter = new ChartJSAdapter(this);
  }

  protected destroyContent(container: HTMLElement) {
    this._chartAdapter.destroy(<HTMLElement>container.children[0]);
    super.destroyContent(container);
  }

  protected async renderContentAsync(container: HTMLElement) {
    const chartNode: HTMLElement = DocumentHelper.createElement("canvas");
    container.innerHTML = "";
    container.appendChild(chartNode);
    await this._chartAdapter.create(chartNode);
    return container;
  }

  public updateContent(): void {
    const chartNode: HTMLElement = <HTMLElement>this.contentContainer?.children[0];
    if(chartNode) {
      this._chartAdapter.update(chartNode);
    }
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
}

VisualizationManager.registerVisualizer("checkbox", ChartJSSelectBase);
VisualizationManager.registerVisualizer("radiogroup", ChartJSSelectBase);
VisualizationManager.registerVisualizer("dropdown", ChartJSSelectBase);
VisualizationManager.registerVisualizer("imagepicker", ChartJSSelectBase);
VisualizationManager.registerVisualizer("tagbox", ChartJSSelectBase);