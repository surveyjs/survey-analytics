import { Chart, registerables } from "chart.js";
import { ItemValue } from "survey-core";
import { SelectBase } from "../selectBase";
import { localization } from "../localizationManager";
import { ChartJsOptions, ChartJsSetup } from "./setup";
import { IChartAdapter, VisualizerBase } from "../visualizerBase";

Chart.register(...registerables);

export const chartTypes = {
  "boolean": ["pie", "doughnut", "bar"],
  "number": ["gauge", "bullet"],
  "average": ["gauge", "bullet"],
  "selectBase": ["bar", "vbar", "pie", "doughnut"],
  "histogram": ["vhistogram", "histogram"],
  "matrix": ["bar", "stackedbar", "pie", "doughnut"],
  "matrixDropdownGrouped": ["stackedbar", "bar", "pie", "doughnut"],
  "pivot": ["vbar", "bar", "line", "stackedbar", "pie", "doughnut"],
  "ranking": ["bar", "vbar", "pie", "doughnut", "radar"],
};

export class ChartJsAdapter implements IChartAdapter {
  private _chart: Chart | undefined;
  private _pieCharts: Chart[];

  static getChartTypesByVisualizerType(vType: string): Array<string> {
    return (chartTypes[vType] || []).slice();
  }

  private createCanvas(container: HTMLElement): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    return canvas;
  }

  private updatePieCharts(chartJsOptions: ChartJsOptions, chartNode: HTMLElement): void {
    if(this._pieCharts) {
      this._pieCharts.forEach((chart, i) => {
        const seriesData = chartJsOptions.pieSeries[i];
        if(seriesData) {
          chart.data.labels = seriesData.labels;
          chart.data.datasets[0].data = seriesData.data;
          chart.data.datasets[0].backgroundColor = seriesData.colors;
          (chart.options.plugins.title as any).text = seriesData.title;
          chart.update();
        }
      });
    } else {
      chartNode.classList.add("sa-pie-charts");
      this._pieCharts = chartJsOptions.pieSeries.map((s, i) => {
        const chartDiv = document.createElement("div");
        chartDiv.id = "sa-chart" + i;
        chartDiv.classList.add("sa-pie-chart");
        if(chartJsOptions.height) {
          chartDiv.style.height = chartJsOptions.height + "px";
        }
        chartNode.appendChild(chartDiv);

        const canvas = this.createCanvas(chartDiv);

        const config: any = {
          type: chartJsOptions.type,
          data: {
            labels: s.labels,
            datasets: [{
              data: s.data,
              backgroundColor: s.colors,
              borderWidth: 0,
            }],
          },
          options: {
            ...chartJsOptions.options,
            plugins: {
              ...chartJsOptions.options.plugins,
              title: {
                display: true,
                text: s.title,
              },
            },
          },
        };

        return new Chart(canvas, config);
      });
    }
  }

  constructor(protected model: SelectBase | VisualizerBase) { }

  protected patchConfigParameters(
    chartNode: object,
    config: object
  ) { }

  public get chart() {
    return this._chart;
  }

  getChartTypes(): string[] {
    const visualizerType = this.model.type;
    const chartCtypes = chartTypes[visualizerType];
    return (chartCtypes || []).slice();
  }

  public async create(chartNode: HTMLElement): Promise<any> {
    const chartOptions = await this.update(chartNode);
    const currentCharts = this._pieCharts || [this._chart];

    return currentCharts;
  }

  public async update(chartNode: HTMLElement): Promise<ChartJsOptions> {
    const _chartType = (this.model as any).chartType;
    const answersData = await this.model.getAnswersData();
    var chartOptions = ChartJsSetup.setup(_chartType, this.model, answersData as any);

    const config: any = {
      type: chartOptions.type,
      data: chartOptions.data,
      options: {
        ...chartOptions.options,
      },
    };

    if(this.model instanceof SelectBase && this.model.supportSelection) {
      const _model = this.model as SelectBase;
      config.options.onClick = (event: any, elements: any[]) => {
        if(elements.length > 0) {
          const element = elements[0];
          const datasetIndex = element.datasetIndex;
          const dataIndex = element.index;

          if(!chartOptions.hasSeries) {
            const itemText = chartOptions.data.labels[dataIndex];
            const item: ItemValue = _model.getSelectedItemByText(itemText);
            _model.setSelection(item);
          } else {
            const chart = this._chart || (this._pieCharts && this._pieCharts[0]);
            if(chart) {
              const itemText = chart.data.datasets[datasetIndex]?.label || "";
              const propertyLabel = chartOptions.data.labels[dataIndex];
              const seriesValues = _model.getSeriesValues();
              const seriesLabels = _model.getSeriesLabels();
              const propertyValue = seriesValues[seriesLabels.indexOf(propertyLabel)];
              const selectedItem: ItemValue = _model.getSelectedItemByText(itemText);
              const item = new ItemValue({ [propertyValue]: selectedItem.value }, propertyLabel + ": " + selectedItem.text);
              _model.setSelection(item);
            }
          }
        }
      };

      config.options.onHover = (event: any, elements: any[]) => {
        const target = event?.native?.target as HTMLElement;
        if(target) {
          target.style.cursor = elements.length > 0 ? "pointer" : "";
        }
      };
    }

    this.patchConfigParameters(chartNode, config);

    ChartJsSetup.onChartCreating.fire(this.model, config);

    if(chartOptions.height) {
      chartNode.style.height = chartOptions.height + "px";
    }

    if((_chartType === "pie" || _chartType === "doughnut") && chartOptions.pieSeries && chartOptions.pieSeries.length > 0) {
      chartNode.style.height = "auto";
      this.updatePieCharts(chartOptions, chartNode);
    } else {
      if(this._chart && this._chart.canvas && this._chart.canvas.getRootNode() === document) {
        this._chart.data = config.data;
        this._chart.options = config.options;
        this._chart.update();
      } else {
        const canvas = this.createCanvas(chartNode);
        this._chart = new Chart(canvas, config);
      }
    }

    return chartOptions;
  }

  public destroy(node: HTMLElement): void {
    if(this._chart) {
      this._chart.destroy();
      this._chart = undefined;
    }
    if(this._pieCharts) {
      this._pieCharts.forEach(ch => ch.destroy());
      this._pieCharts = undefined;
    }
  }
}

VisualizerBase.chartAdapterType = ChartJsAdapter;
