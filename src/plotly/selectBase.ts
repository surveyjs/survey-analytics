import { Question, ItemValue, Event } from "survey-core";
import { SelectBase } from "../selectBase";
import { VisualizationManager } from "../visualizationManager";
import { allowDomRendering, DataHelper, DocumentHelper } from "../utils";
import { localization } from "../localizationManager";
import Plotly from "plotly.js-dist-min";
import { PlotlySetup } from "./setup";

export class PlotlyChartAdapter {
  private _chart: Promise<Plotly.PlotlyHTMLElement> = undefined;

  constructor(protected model: SelectBase) { }

  protected patchConfigParameters(
    chartNode: object,
    traces: Array<object>,
    layout: object,
    config: object
  ) { }

  public get chart() {
    return this._chart;
  }

  public create(chartNode: HTMLElement) {
    var plotlyOptions = PlotlySetup.setup(this.model.chartType, this.model);

    let config: any = {
      displaylogo: false,
      responsive: true,
      locale: localization.currentLocale,
      modeBarButtonsToRemove: ["toImage"],
      modeBarButtonsToAdd: [
        {
          name: "toImageSjs",
          title: localization.getString("saveDiagramAsPNG"),
          icon: (<any>Plotly).Icons.camera,
          click: (gd: any) => {
            let options = {
              format: PlotlySetup.imageExportFormat,
              // width: 800,
              // height: 600,
              filename: this.model.question.name,
            };
            PlotlySetup.onImageSaving.fire(this.model, options);
            (<any>Plotly).downloadImage(gd, options);
          },
        },
      ],
    };
    if (SelectBasePlotly.displayModeBar !== undefined) {
      config.displayModeBar = SelectBasePlotly.displayModeBar;
    }

    this.patchConfigParameters(
      chartNode,
      plotlyOptions.traces,
      plotlyOptions.layout,
      config
    );

    let options = {
      traces: plotlyOptions.traces,
      layout: plotlyOptions.layout,
      config: config,
    };
    PlotlySetup.onPlotCreating.fire(this.model, options);

    const plot = (<any>Plotly).newPlot(
      chartNode,
      options.traces,
      options.layout,
      options.config
    );

    (<any>chartNode)["on"]("plotly_click", (data: any) => {
      if (data.points.length > 0) {
        let itemText = "";
        if (!plotlyOptions.hasSeries) {
          itemText = Array.isArray(data.points[0].customdata)
            ? data.points[0].customdata[0]
            : data.points[0].customdata;
          const item: ItemValue = this.model.getSelectedItemByText(itemText);
          this.model.setSelection(item);
        } else {
          itemText = data.points[0].data.name;
          const propertyLabel = data.points[0].label;
          const seriesValues = this.model.getSeriesValues();
          const seriesLabels = this.model.getSeriesLabels();
          const propertyValue = seriesValues[seriesLabels.indexOf(propertyLabel)];
          const selectedItem: ItemValue = this.model.getSelectedItemByText(itemText);
          const item = new ItemValue({ [propertyValue]: selectedItem.value }, propertyLabel + ": " + selectedItem.text);
          this.model.setSelection(item);
        }

        // const itemText = plotlyOptions.hasSeries
        //   ? data.points[0].data.name
        //   : Array.isArray(data.points[0].customdata)
        //     ? data.points[0].customdata[0]
        //     : data.points[0].customdata;
        // const item: ItemValue = this.model.getSelectedItemByText(itemText);
        // this.model.setSelection(item);
      }
    });

    var getDragLayer = () =>
      <HTMLElement>chartNode.getElementsByClassName("nsewdrag")[0];
    (<any>chartNode)["on"]("plotly_hover", () => {
      const dragLayer = getDragLayer();
      dragLayer && (dragLayer.style.cursor = "pointer");
    });
    (<any>chartNode)["on"]("plotly_unhover", () => {
      const dragLayer = getDragLayer();
      dragLayer && (dragLayer.style.cursor = "");
    });

    this._chart = plot;
    return plot;
  }

  public destroy(node: HTMLElement) {
    (<any>Plotly).purge(node);
    this._chart = undefined;
  }
}

export class SelectBasePlotly extends SelectBase {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["bar", "pie", "doughnut", "scatter"];
  public static displayModeBar: any = undefined;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {},
    name?: string
  ) {
    super(question, data, options, name);
    this.chartTypes = [].concat(SelectBasePlotly.types);
    if (this.getSeriesValues().length > 0 && this.chartTypes.indexOf("stackedbar") === -1) {
      this.chartTypes.push("stackedbar");
    }
    if(options.allowExperimentalFeatures) {
      this.chartTypes.splice(1, 0, "vbar");
    }
    this._chartType = this.chartTypes[0];
    if (this.chartTypes.indexOf(options.defaultChartType) !== -1) {
      this._chartType = options.defaultChartType;
    }
    this._chartAdapter = new PlotlyChartAdapter(this);
  }

  protected destroyContent(container: HTMLElement) {
    this._chartAdapter.destroy(<HTMLElement>container.children[0]);
    super.destroyContent(container);
  }

  protected renderContent(container: HTMLElement) {
    const chartNode: HTMLElement = DocumentHelper.createElement("div");
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
}

VisualizationManager.registerVisualizer("checkbox", SelectBasePlotly);
VisualizationManager.registerVisualizer("radiogroup", SelectBasePlotly);
VisualizationManager.registerVisualizer("dropdown", SelectBasePlotly);
VisualizationManager.registerVisualizer("imagepicker", SelectBasePlotly);
VisualizationManager.registerVisualizer("tagbox", SelectBasePlotly);
