import { Question, ItemValue, Event } from "survey-core";
import { SelectBase } from "../selectBase";
import { localization } from "../localizationManager";
import Plotly from "plotly.js-dist-min";
import { PlotlySetup } from "./setup";
import { VisualizerBase, IChartAdapter } from "../visualizerBase";
import { BooleanModel } from "../boolean";
import { SelectBasePlotly } from "./legacy";

export const chartTypes = {
  "boolean": ["pie", "doughnut", "bar"],
  "number": ["gauge", "bullet"],
  "average": ["gauge", "bullet"],
  "selectBase": ["bar", "vbar", "pie", "doughnut"],
  "histogram": ["vbar", "bar"],
  "matrix": ["bar", "stackedbar", "pie", "doughnut"],
  "matrixDropdownGrouped": ["stackedbar", "bar", "pie", "doughnut"],
  "pivot": ["vbar", "bar", "line", "stackedbar", "pie", "doughnut"], // ["vbar", "bar"]
  "ranking": ["bar", "vbar", "pie", "doughnut", "radar"],
};

export class PlotlyChartAdapter implements IChartAdapter {
  private _chart: Promise<Plotly.PlotlyHTMLElement> = undefined;

  static getChartTypesByVisualizerType(vType: string): Array<string> {
    return (chartTypes[vType] || []).slice();
  }

  constructor(protected model: SelectBase | VisualizerBase) { }

  protected patchConfigParameters(
    chartNode: object,
    traces: Array<object>,
    layout: object,
    config: any
  ) {
    if(this.model.dataType === "boolean") {
      const colors = VisualizerBase.getColors();
      const boolColors = [
        BooleanModel.trueColor || colors[0],
        BooleanModel.falseColor || colors[1],
      ];
      if((this.model as SelectBase).showMissingAnswers) {
        boolColors.push(colors[2]);
      }

      const chartType = (this.model as any).chartType;
      if(chartType === "pie" || chartType === "doughnut") {
        traces.forEach((trace: any) => {
          if(!trace) return;
          if(!trace.marker) trace.marker = {};
          trace.marker.colors = boolColors;
        });
      } else if(chartType === "bar") {
        traces.forEach((trace: any) => {
          if(!trace) return;
          if(!trace.marker) trace.marker = {};
          trace.marker.color = boolColors;
        });
      }
    }
    if(this.model.type === "average") {
      config.displayModeBar = true;
    }
  }

  public get chart() {
    return this._chart;
  }

  getChartTypes(): string[] {
    const visualizerType = this.model.type;
    const chartCtypes = chartTypes[visualizerType];
    return (chartCtypes || []).slice();
  }

  public async create(chartNode: HTMLElement): Promise<any> {
    const [plot, plotlyOptions] = await this.update(chartNode);
    this._chart = plot;
    return plot;
  }

  public async update(chartNode: HTMLElement): Promise<any> {
    chartNode.className = "sa-visualizer--plotly";
    const answersData = await this.model.getAnswersData();
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
    if(SelectBasePlotly.displayModeBar !== undefined) {
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
      data: answersData,
      config: config,
    };
    PlotlySetup.onPlotCreating.fire(this.model, options);

    const plot = (<any>Plotly).react(
      chartNode,
      options.traces,
      options.layout,
      options.config
    );

    const plotlyChart = <any>chartNode;

    if(this.model instanceof SelectBase && this.model.supportSelection) {
      const _model = this.model as SelectBase;
      plotlyChart.removeAllListeners("plotly_click");
      plotlyChart.on("plotly_click", (data: any) => {
        if(data.points.length > 0) {
          let itemText = "";
          if(!plotlyOptions.hasSeries) {
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

    var setCursorOnDragLayer = (cursor: string) => {
      const dragLayer = <HTMLElement>chartNode.getElementsByClassName("nsewdrag")[0];
      dragLayer && (dragLayer.style.cursor = cursor);
    };
    !!plotlyChart.removeAllListeners && plotlyChart.removeAllListeners("plotly_hover");
    plotlyChart.on("plotly_hover", () => setCursorOnDragLayer("pointer"));
    !!plotlyChart.removeAllListeners && plotlyChart.removeAllListeners("plotly_unhover");
    plotlyChart.on("plotly_unhover", () => setCursorOnDragLayer(""));

    return [plot, plotlyOptions];
  }

  public destroy(node: HTMLElement) {
    if(!!node) {
      (<any>Plotly).purge(node);
    }
    this._chart = undefined;
  }
}

VisualizerBase.chartAdapterType = PlotlyChartAdapter;
