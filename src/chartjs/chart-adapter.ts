import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { ItemValue } from "survey-core";
import { SelectBase } from "../selectBase";
import { ChartJsOptions, ChartJsSetup } from "./setup";
import { IChartAdapter, VisualizerBase } from "../visualizerBase";

Chart.register(...registerables);
if(ChartDataLabels) {
  Chart.register(ChartDataLabels);
}

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

  private createGaugeValuePlugin(chartOptions: ChartJsOptions): any {
    const gaugePluginOptions = chartOptions?.options?.plugins?.saGaugeValue;
    if(chartOptions.type !== "doughnut" || !gaugePluginOptions?.text) {
      return undefined;
    }

    return {
      id: "saGaugeValue",
      afterDraw: (chart: any) => {
        const meta = chart.getDatasetMeta(0);
        const arc = meta?.data?.[0];
        const text = String(gaugePluginOptions.text);
        if(!arc || !text) {
          return;
        }

        const ctx = chart.ctx;
        const fontSize = parseInt(gaugePluginOptions.font?.size || "14", 10) || 14;
        const fontFamily = gaugePluginOptions.font?.family || "sans-serif";
        const fontWeight = gaugePluginOptions.font?.weight || "normal";
        const offsetY = Number(gaugePluginOptions.offsetY ?? 0);

        ctx.save();
        ctx.fillStyle = gaugePluginOptions.color || "#000";
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        // Draw text so its bottom aligns with the gauge arc baseline (diameter line).
        ctx.fillText(text, arc.x, arc.y + offsetY);
        ctx.restore();
      }
    };
  }

  private createAxisLabelTooltipPlugin(labels: string[], labelTruncateLength: number): any {
    const isEnabled = !!labelTruncateLength && labelTruncateLength !== -1;
    if(!isEnabled || !Array.isArray(labels) || labels.length === 0) {
      return undefined;
    }

    const threshold = 10;
    return {
      id: "saAxisLabelTooltip",
      afterEvent: (chart: any, args: any) => {
        const event = args?.event;
        const canvas = chart?.canvas as HTMLCanvasElement;
        if(!event || !canvas) {
          return;
        }

        const xScale = chart.scales?.x;
        const yScale = chart.scales?.y;
        const chartArea = chart.chartArea;
        const eventX = event.x;
        const eventY = event.y;
        let hoveredFullLabel = "";

        if(xScale?.type === "category" && chartArea && eventY >= chartArea.bottom) {
          for(let i = 0; i < labels.length; i++) {
            const tickX = xScale.getPixelForTick(i);
            if(Math.abs(eventX - tickX) <= threshold) {
              hoveredFullLabel = String(labels[i] ?? "");
              break;
            }
          }
        }

        if(!hoveredFullLabel && yScale?.type === "category" && chartArea && eventX <= chartArea.left) {
          for(let i = 0; i < labels.length; i++) {
            const tickY = yScale.getPixelForTick(i);
            if(Math.abs(eventY - tickY) <= threshold) {
              hoveredFullLabel = String(labels[i] ?? "");
              break;
            }
          }
        }

        if(hoveredFullLabel) {
          const truncated = ChartJsSetup.getTruncatedLabel(hoveredFullLabel, labelTruncateLength);
          canvas.title = truncated !== hoveredFullLabel ? hoveredFullLabel : "";
        } else if(canvas.title) {
          canvas.title = "";
        }
      }
    };
  }

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

    const axisLabelTooltipPlugin = this.createAxisLabelTooltipPlugin(
      (chartOptions.data?.labels || []).map((label: any) => String(label)),
      (this.model as any).labelTruncateLength
    );
    const gaugeValuePlugin = this.createGaugeValuePlugin(chartOptions);
    if(axisLabelTooltipPlugin) {
      config.plugins = [...(config.plugins || []), axisLabelTooltipPlugin];
    }
    if(gaugeValuePlugin) {
      config.plugins = [...(config.plugins || []), gaugeValuePlugin];
    }

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
