import { Question, ItemValue, Event } from "survey-core";
import { SelectBase } from "../selectBase";
import { VisualizationManager } from "../visualizationManager";
import { localization } from "../localizationManager";
import Plotly from "plotly.js-dist-min";
import { PlotlySetup } from "./setup";
import { VisualizerBase, IChartAdapter } from "../visualizerBase";
import { BooleanModel } from "../boolean";
import { BooleanPlotly, GaugePlotly, HistogramPlotly, MatrixDropdownGroupedPlotly, MatrixPlotly, PivotPlotly, SelectBasePlotly } from "./legacy";

export const plotlyChartTypes = {
  "boolean": BooleanPlotly.types,
  "number": GaugePlotly.types,
  "selectBase": SelectBasePlotly.types,
  "histogram": HistogramPlotly.types,
  "matrix": MatrixPlotly.types,
  "matrixDropdownGrouped": MatrixDropdownGroupedPlotly.types,
  "pivot": PivotPlotly.types,
  "ranking": [].concat(SelectBasePlotly.types).concat(["radar"]),
};

export class PlotlyChartAdapter implements IChartAdapter {
  private _chart: Promise<Plotly.PlotlyHTMLElement> = undefined;

  constructor(protected model: SelectBase | VisualizerBase) { }

  protected patchConfigParameters(
    chartNode: object,
    traces: Array<object>,
    layout: object,
    config: any
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
    if(this.model.type === "number") {
      config.displayModeBar = true;
    }
  }

  public get chart() {
    return this._chart;
  }

  getChartTypes(): string[] {
    const visualizerType = this.model.type;
    const chartCtypes = plotlyChartTypes[visualizerType];
    return chartCtypes || [];
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
