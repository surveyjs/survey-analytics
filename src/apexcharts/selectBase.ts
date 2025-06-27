import { Question, ItemValue, Event } from "survey-core";
import { SelectBase } from "../selectBase";
import { VisualizationManager } from "../visualizationManager";
import { allowDomRendering, DataHelper, DocumentHelper } from "../utils";
import { localization } from "../localizationManager";
import ApexCharts from "apexcharts";
import { ApexChartsSetup } from "./setup";

export class ApexChartsAdapter {
  private _chart: ApexCharts = undefined;

  constructor(protected model: SelectBase) { }

  protected patchConfigParameters(
    chartNode: object,
    options: object
  ) { }

  public get chart() {
    return this._chart;
  }

  public async create(chartNode: HTMLElement): Promise<any> {
    const [chart, chartOptions] = await this.update(chartNode);

    // Handle chart clicks
    chart.addEventListener("click", (event: any, chartContext: any, config: any) => {
      if (config.dataPointIndex !== undefined && config.dataPointIndex !== null) {
        let itemText = "";
        if (!chartOptions.hasSeries) {
          itemText = config.w.config.labels[config.dataPointIndex];
          const item: ItemValue = this.model.getSelectedItemByText(itemText);
          this.model.setSelection(item);
        } else {
          itemText = config.w.config.labels[config.dataPointIndex];
          const propertyLabel = config.w.config.series[config.seriesIndex].name;
          const seriesValues = this.model.getSeriesValues();
          const seriesLabels = this.model.getSeriesLabels();
          const propertyValue = seriesValues[seriesLabels.indexOf(propertyLabel)];
          const selectedItem: ItemValue = this.model.getSelectedItemByText(itemText);
          const item = new ItemValue({ [propertyValue]: selectedItem.value }, propertyLabel + ": " + selectedItem.text);
          this.model.setSelection(item);
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

    this._chart = chart;
    return chart;
  }

  public async update(chartNode: HTMLElement): Promise<any> {
    const answersData = await this.model.getAnswersData();
    var chartOptions = ApexChartsSetup.setup(this.model.chartType, this.model, answersData);

    let config: any = {
      chart: {
        ...chartOptions.chart,
        locales: [{
          name: localization.currentLocale,
          options: {
            months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            shortMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
            shortDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
          }
        }],
        defaultLocale: localization.currentLocale
      },
      ...chartOptions
    };
    /*
    config = {
      series: answersData.datasets.map((data, index) => ({ data, name: answersData.seriesLabels[index] })),
      //[{
      //   name: this.model.question.title || this.model.question.name,
      //   data: answersData.datasets
      // }],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: answersData.labels,
        title: {
          text: this.model.question.title || this.model.question.name
        }
      },
      yaxis: {
        title: {
          text: "Frequency"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " responses";
          }
        }
      }
    };*/

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

export class SelectBaseApexCharts extends SelectBase {
  private _chartAdapter: ApexChartsAdapter;
  public static types = ["bar", "vbar", "pie", "doughnut", "line", "scatter", "stackedbar"];
  public static displayToolbar: any = undefined;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {},
    name?: string
  ) {
    super(question, data, options, name);
    this.chartTypes = [].concat(SelectBaseApexCharts.types);
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
    this._chartAdapter = new ApexChartsAdapter(this);
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

  public updateContent(): void {
    const chartNode: HTMLElement = <HTMLElement>this.contentContainer?.children[0];
    if(chartNode) {
      this._chartAdapter.update(chartNode);
    }
  }
}

VisualizationManager.registerVisualizer("checkbox", SelectBaseApexCharts);
VisualizationManager.registerVisualizer("radiogroup", SelectBaseApexCharts);
VisualizationManager.registerVisualizer("dropdown", SelectBaseApexCharts);
VisualizationManager.registerVisualizer("imagepicker", SelectBaseApexCharts);
VisualizationManager.registerVisualizer("tagbox", SelectBaseApexCharts);