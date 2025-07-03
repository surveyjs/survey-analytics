import { Question, ItemValue, Event } from "survey-core";
import { SelectBase } from "../selectBase";
import { VisualizationManager } from "../visualizationManager";
import { allowDomRendering, DataHelper, DocumentHelper } from "../utils";
import { localization } from "../localizationManager";
import Plotly from "plotly.js-dist-min";
import { PlotlySetup } from "./setup";
import { VisualizerBase } from "../visualizerBase";
import { BooleanModel } from "../boolean";

export class PlotlyChartAdapter {
  private _chart: Promise<Plotly.PlotlyHTMLElement> = undefined;

  constructor(protected model: SelectBase | VisualizerBase) { }

  protected patchConfigParameters(
    chartNode: object,
    traces: Array<object>,
    layout: object,
    config: object
  ) {
    if(this.model.question.getType() === "boolean") {
      const colors = this.model.getColors();
      const boolColors = [
        BooleanModel.trueColor || colors[0],
        BooleanModel.falseColor || colors[1],
      ];
      if((this.model as SelectBase).showMissingAnswers) {
        boolColors.push(colors[2]);
      }

      const chartType = (this.model as any).chartType;
      if (chartType === "pie" || chartType === "doughnut") {
        traces.forEach((trace: any) => {
          trace.marker.colors = boolColors;
        });
      } else if (chartType === "bar") {
        traces.forEach((trace: any) => {
          trace.marker.color = boolColors;
        });
      }
    }
  }

  public get chart() {
    return this._chart;
  }

  public async create(chartNode: HTMLElement): Promise<any> {
    const [plot, plotlyOptions] = await this.update(chartNode);

    if(this.model instanceof SelectBase) {
      const _model = this.model as SelectBase;
      (<any>chartNode)["on"]("plotly_click", (data: any) => {
        if (data.points.length > 0) {
          let itemText = "";
          if (!plotlyOptions.hasSeries) {
            itemText = Array.isArray(data.points[0].customdata)
              ? data.points[0].customdata[0]
              : data.points[0].customdata;
            const item: ItemValue = _model.getSelectedItemByText(itemText);
            _model.setSelection(item);
          } else {
            itemText = data.points[0].data.name;
            const propertyLabel = data.points[0].label;
            const seriesValues = this.model.getSeriesValues();
            const seriesLabels = this.model.getSeriesLabels();
            const propertyValue = seriesValues[seriesLabels.indexOf(propertyLabel)];
            const selectedItem: ItemValue = _model.getSelectedItemByText(itemText);
            const item = new ItemValue({ [propertyValue]: selectedItem.value }, propertyLabel + ": " + selectedItem.text);
            _model.setSelection(item);
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
    }

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

    // setTimeout(() => Plotly.Plots.resize(chartNode), 10);
    this._chart = plot;
    return plot;
  }

  public async update(chartNode: HTMLElement): Promise<any> {
    const answersData = (this.model instanceof SelectBase) ? await this.model.getAnswersData() : await this.model.getCalculatedValues();
    var plotlyOptions = PlotlySetup.setup((this.model as any).chartType, this.model, answersData as any);

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

    const plot = (<any>Plotly).react(
      chartNode,
      options.traces,
      options.layout,
      options.config
    );

    return [plot, plotlyOptions];
  }

  public destroy(node: HTMLElement) {
    if(!!node) {
      (<any>Plotly).purge(node);
    }
    this._chart = undefined;
  }
}

export class SelectBasePlotly extends SelectBase {
  private _chartAdapter: PlotlyChartAdapter;
  public static types = ["bar", "vbar", "pie", "doughnut"];
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
      // this.chartTypes.splice(1, 0, "vbar");
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

VisualizationManager.registerVisualizer("checkbox", SelectBasePlotly);
VisualizationManager.registerVisualizer("radiogroup", SelectBasePlotly);
VisualizationManager.registerVisualizer("dropdown", SelectBasePlotly);
VisualizationManager.registerVisualizer("imagepicker", SelectBasePlotly);
VisualizationManager.registerVisualizer("tagbox", SelectBasePlotly);
