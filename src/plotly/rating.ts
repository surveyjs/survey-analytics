import { Question, QuestionRatingModel } from "survey-core";
import { NumberModel } from "../number";
import { VisualizationManager } from "../visualizationManager";
import { allowDomRendering, DataHelper, DocumentHelper } from "../utils/index";
import { localization } from "../localizationManager";
import { PlotlySetup } from "./setup";
import Plotly from "plotly.js-dist-min";

export class PlotlyGaugeAdapter {
  private _chart: Promise<Plotly.PlotlyHTMLElement> = undefined;
  public width = "100%";

  constructor(private model: GaugePlotly) {}

  public get chart() {
    return this._chart;
  }

  public create(chartNode: HTMLElement) {
    const question = this.model.question;
    let [level, minValue, maxValue] = this.model.getData();

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

    var height = 400;

    if (this.model.chartType === "bullet") {
      height = 250;
    }

    var layout = {
      width: this.width,
      height: height,
      plot_bgcolor: this.model.backgroundColor,
      paper_bgcolor: this.model.backgroundColor,
    };

    const config = {
      displayModeBar: false,
      staticPlot: true,
      locale: localization.currentLocale,
    };

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
  private _gaugeContentNode = null;

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

  protected afterRender(contentContainer: HTMLElement): void {
    super.afterRender(contentContainer);

    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        let el = entry.target;
        if(entry.contentBoxSize) {
          // Firefox implements `contentBoxSize` as a single content rect, rather than an array
          const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
          if (this._chartAdapter.width !== "" + (contentBoxSize.inlineSize / 2)) {
            this._chartAdapter.width = "" + (contentBoxSize.inlineSize / 2);
            this.reRenderContent();
          }
        } else {
          if (this._chartAdapter.width !== "" + (entry.contentRect.width / 2)) {
            this._chartAdapter.width = "" + (entry.contentRect.width / 2);
            this.reRenderContent();
          }
        }
      }
    });

    this.resizeObserver.observe(contentContainer);
  }

  // TODO probably we need to call resizeObserver.unobserve() in destroy method
  private resizeObserver = null;

  protected renderContent(container: HTMLElement) {
    this._gaugeContentNode = container;
    const chartNode: HTMLElement = DocumentHelper.createElement("div");
    container.appendChild(chartNode);
    this._chartAdapter.create(chartNode).then(() => {
      this.afterRender(this.contentContainer);
    });
  }

  protected reRenderContent() {
    this.renderContent(this._gaugeContentNode);
  }
}

VisualizationManager.registerVisualizer("number", GaugePlotly);
VisualizationManager.registerVisualizer("rating", GaugePlotly);
VisualizationManager.registerVisualizer("expression", GaugePlotly);
