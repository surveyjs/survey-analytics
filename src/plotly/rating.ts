import { Question, QuestionRatingModel } from "survey-core";
import { NumberModel } from "../number";
import { VisualizationManager } from "../visualizationManager";
import { allowDomRendering, DataHelper, DocumentHelper } from "../utils/index";
import { localization } from "../localizationManager";
import { PlotlySetup } from "./setup";
import Plotly from "plotly.js-dist-min";

export class PlotlyGaugeAdapter {
  private _chart: Promise<Plotly.PlotlyHTMLElement> = undefined;

  constructor(private model: GaugePlotly) { }

  public get chart() {
    return this._chart;
  }

  public create(chartNode: HTMLElement) {
    const question = this.model.question;
    let [level, minValue, maxValue] = this.model.getCalculatedValues();

    if (question.getType() === "rating") {
      const rateValues = (<QuestionRatingModel>question).visibleRateValues;
      maxValue = rateValues[rateValues.length - 1].value;
      minValue = rateValues[0].value;
    }

    const colors = this.model.generateColors(
      maxValue,
      minValue,
      GaugePlotly.stepsCount
    );

    if (GaugePlotly.showAsPercentage) {
      level = DataHelper.toPercentage(level, maxValue);
      minValue = DataHelper.toPercentage(minValue, maxValue);
      maxValue = DataHelper.toPercentage(maxValue, maxValue);
    }

    var data: any = [
      {
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [minValue, maxValue] },
          shape: this.model.chartType,
          bgcolor: "white",
          bar: { color: colors[0] },
        },
        value: level,
        text: question.name,
        domain: { x: [0, 1], y: [0, 1] },
      },
    ];

    const chartMargin = this.model.chartType === "bullet" ? 60 : 30;
    var layout: any = {
      height: 250,
      margin: {
        l: chartMargin,
        r: chartMargin,
        b: chartMargin,
        t: chartMargin,
        pad: 5
      },
      plot_bgcolor: this.model.backgroundColor,
      paper_bgcolor: this.model.backgroundColor,
    };

    const config = {
      displayModeBar: true,
      locale: localization.currentLocale,
      responsive: true,
      displaylogo: false,
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
            PlotlySetup.onImageSaving.fire(this.model as any, options);
            (<any>Plotly).downloadImage(gd, options);
          },
        },
      ],

    };
    if (GaugePlotly.displayModeBar !== undefined) {
      config.displayModeBar = GaugePlotly.displayModeBar;
    }

    let options = {
      data: data,
      layout: layout,
      config: config,
    };
    PlotlySetup.onPlotCreating.fire(this.model, options);

    return (<any>Plotly).newPlot(
      chartNode,
      options.data,
      options.layout,
      options.config
    );
  }

  public destroy(node: HTMLElement) {
    (<any>Plotly).purge(node);
    this._chart = undefined;
  }
}

export class GaugePlotly extends NumberModel {
  private _chartAdapter: PlotlyGaugeAdapter;

  public static displayModeBar: any = undefined;
  public static types = ["gauge", "bullet"];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name);
    this.chartTypes = GaugePlotly.types;
    this.chartType = this.chartTypes[0];
    this._chartAdapter = new PlotlyGaugeAdapter(this);
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
}

VisualizationManager.registerVisualizer("number", GaugePlotly);
VisualizationManager.registerVisualizer("rating", GaugePlotly);
VisualizationManager.registerVisualizer("expression", GaugePlotly);
