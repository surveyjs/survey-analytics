import ApexCharts from "apexcharts";
import { ItemValue } from "survey-core";
import { SelectBase } from "../selectBase";
import { localization } from "../localizationManager";
import { ApexChartsOptions, ApexChartsSetup } from "./setup";
import { VisualizerBase } from "../visualizerBase";

export const chartTypes = {
  "boolean": ["pie", "doughnut", "bar"],
  "number": ["gauge", "bullet"],
  "selectBase": ["bar", "vbar", "pie", "doughnut"],
  "histogram": ["vbar", "bar"],
  "matrix": ["bar", "stackedbar", "pie", "doughnut"],
  "matrixDropdownGrouped": ["stackedbar", "bar", "pie", "doughnut"],
  "pivot": ["vbar", "bar", "line", "stackedbar", "pie", "doughnut"], // ["vbar", "bar"];
  "ranking": ["bar", "vbar", "pie", "doughnut", "radar"],
};

export class ApexChartsAdapter {
  private _chart: ApexCharts = undefined;
  private _pieCharts: ApexCharts[] = undefined;

  private updatePieCharts(options: any, chartOptions: ApexChartsOptions, chartNode: HTMLElement): void {
    if (this._pieCharts) {
      this._pieCharts.forEach((chart) => chart.updateOptions(options));
    } else {
      chartNode.style.cssText = "display: grid; grid-template-columns: repeat(2, 1fr);";
      this._pieCharts = chartOptions.series.map((s, i) => {
        const chartDiv = document.createElement("div");
        chartDiv.id = "sa-chart" + i;
        chartNode.appendChild(chartDiv);

        const _options = Object.assign({}, options, {
          series: s.series,
        });
        _options.title.text = s.title;

        const chart = new ApexCharts(chartDiv, _options);
        return chart;
      });
      this._pieCharts.forEach((chart) => chart.render());
    }
  }

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
    const chartOptions = await this.update(chartNode);
    const currentCharts = this._pieCharts || [this._chart];

    if(this.model instanceof SelectBase) {
    // Handle chart clicks
      const _model = this.model as SelectBase;
    }

    return currentCharts;
  }

  public async update(chartNode: HTMLElement): Promise<ApexChartsOptions> {
    const _chartType = (this.model as any).chartType;
    const answersData = (this.model instanceof SelectBase) ? await this.model.getAnswersData() : await this.model.getCalculatedValues();
    var chartOptions = ApexChartsSetup.setup(_chartType, this.model, answersData as any);

    if (this.model instanceof SelectBase) {
      const _model = this.model as SelectBase;
      chartOptions.chart.events = {
        dataPointMouseEnter: function () { chartNode.style.cursor = "pointer"; },
        dataPointMouseLeave: function () { chartNode.style.cursor = ""; },
        dataPointSelection: function(event, chartContext, opts) {
          if (opts.dataPointIndex !== undefined && opts.seriesIndex !== undefined) {
            let itemText = "";
            if (!chartOptions.hasSeries) {
              itemText = config.labels[opts.dataPointIndex];
              const item: ItemValue = _model.getSelectedItemByText(itemText);
              _model.setSelection(item);
            } else {
              itemText = config.series[opts.seriesIndex].name;
              const propertyLabel = config.labels[opts.dataPointIndex];

              const seriesValues = _model.getSeriesValues();
              const seriesLabels = _model.getSeriesLabels();
              const propertyValue = seriesValues[seriesLabels.indexOf(propertyLabel)];
              const selectedItem: ItemValue = _model.getSelectedItemByText(itemText);
              const item = new ItemValue({ [propertyValue]: selectedItem.value }, propertyLabel + ": " + selectedItem.text);
              _model.setSelection(item);
            }
          }

          // The last parameter opts contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
          /*if (data.points.length > 0) {
              let itemText = "";
              if (!chartOptions.hasSeries) {
                itemText = Array.isArray(data.points[0].customdata)
                  ? data.points[0].customdata[0]
                  : data.points[0].customdata;
                const item: ItemValue = _model.getSelectedItemByText(itemText);
                _model.setSelection(item);
              } else {
                itemText = data.points[0].data.name;
                const propertyLabel = data.points[0].label;
                // const seriesValues = this.model.getSeriesValues();
                // const seriesLabels = this.model.getSeriesLabels();
                // const propertyValue = seriesValues[seriesLabels.indexOf(propertyLabel)];
                // const selectedItem: ItemValue = _model.getSelectedItemByText(itemText);
                // const item = new ItemValue({ [propertyValue]: selectedItem.value }, propertyLabel + ": " + selectedItem.text);
                // _model.setSelection(item);
              }
            }*/
        }
      };
    }

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

    if((_chartType=== "pie" || _chartType === "doughnut") && chartOptions.series.length > 1 && typeof chartOptions.series[0] !== "number") {
      this.updatePieCharts(options, chartOptions, chartNode);
    } else {
      if (this._chart) {
        await this._chart.updateOptions({ series: options.series });
      } else {
        this._chart = new ApexCharts(chartNode, options);
        await this._chart.render();
      }
    }

    return chartOptions;
  }

  public destroy(node: HTMLElement): void {
    if (this._chart) {
      this._chart.destroy();
      this._chart = undefined;
    }
    if (this._pieCharts) {
      this._pieCharts.forEach(ch => ch.destroy());
      this._pieCharts = undefined;
    }
  }
}

VisualizerBase.chartAdapterType = ApexChartsAdapter;