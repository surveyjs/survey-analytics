import ApexCharts from "apexcharts";
import { ItemValue } from "survey-core";
import { SelectBase } from "../selectBase";
import { localization } from "../localizationManager";
import { ApexChartsSetup } from "./setup";
import { VisualizerBase } from "../visualizerBase";

export const chartTypes = {
  "boolean": ["pie", "bar", "doughnut"],
  "number": ["gauge", "bullet"],
  "selectBase": ["bar", "vbar", "pie", "doughnut"],
  "histogram": ["vbar", "bar"],
  "matrix": ["bar", "stackedbar", "pie", "doughnut"],
  "matrixDropdownGrouped": ["stackedbar", "bar", "pie", "doughnut"],
  "pivot": ["vbar", "bar", "line", "stackedbar", "pie", "doughnut"], // ["vbar", "bar"];
};

export class ApexChartsAdapter {
  private _chart: ApexCharts = undefined;

  constructor(protected model: SelectBase | VisualizerBase) { }

  protected patchConfigParameters(
    chartNode: object,
    options: object
  ) { }

  public get chart() {
    return this._chart;
  }

  getChartTypes(): string[] {
    const visualizerType = this.model.type;
    const chartCtypes = chartTypes[visualizerType];
    return chartCtypes || [];
  }

  public async create(chartNode: HTMLElement): Promise<any> {
    const [chart, chartOptions] = await this.update(chartNode);

    if(this.model instanceof SelectBase) {
    // Handle chart clicks
      const _model = this.model as SelectBase;
      chart.addEventListener("click", (event: any, chartContext: any, config: any) => {
        if (config.dataPointIndex !== undefined && config.dataPointIndex !== null) {
          let itemText = "";
          if (!chartOptions.hasSeries) {
            itemText = config.config.labels[config.dataPointIndex];
            const item: ItemValue = _model.getSelectedItemByText(itemText);
            _model.setSelection(item);
          } else {
            itemText = config.config.labels[config.dataPointIndex];
            const propertyLabel = config.config.series[config.seriesIndex].name;
            const seriesValues = _model.getSeriesValues();
            const seriesLabels = _model.getSeriesLabels();
            const propertyValue = seriesValues[seriesLabels.indexOf(propertyLabel)];
            const selectedItem: ItemValue = _model.getSelectedItemByText(itemText);
            const item = new ItemValue({ [propertyValue]: selectedItem.value }, propertyLabel + ": " + selectedItem.text);
            _model.setSelection(item);
          }
        }
      });

      // Change cursor on hover
      chart.addEventListener("mouseenter", () => {
        chartNode.style.cursor = "pointer";
      });
      chart.addEventListener("mouseleave", () => {
        chartNode.style.cursor = "";
      });
    }

    this._chart = chart;
    return chart;
  }

  public async update(chartNode: HTMLElement): Promise<any> {
    const answersData = (this.model instanceof SelectBase) ? await this.model.getAnswersData() : await this.model.getCalculatedValues();
    var chartOptions = ApexChartsSetup.setup((this.model as any).chartType, this.model, answersData as any);

    let config: any = {
      chart: {
        ...chartOptions.chart,
        locales: [{
          name: localization.currentLocale,
        }],
        defaultLocale: localization.currentLocale
      },
      ...chartOptions
    };

    this.patchConfigParameters(chartNode, config);

    let options = {
      ...config
    };
    ApexChartsSetup.onChartCreating.fire(this.model, options);

    if (this._chart) {
      this._chart.updateOptions(options);
    } else {
      this._chart = new ApexCharts(chartNode, options);
      await this._chart.render();
    }

    return [this._chart, chartOptions];
  }

  public destroy(node: HTMLElement) {
    if (this._chart) {
      this._chart.destroy();
      this._chart = undefined;
    }
  }
}

VisualizerBase.chartAdapterType = ApexChartsAdapter;