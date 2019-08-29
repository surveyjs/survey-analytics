import { Question } from "survey-core";
var Plotly = <any>require("plotly.js-dist");
import { VisualizerBase } from "../visualizerBase";
import { VisualizationManager } from "../visualizationManager";

export class GaugePlotly extends VisualizerBase {
  private _result: any;
  private chart: Promise<Plotly.PlotlyHTMLElement>;

  public static stepsCount = 5;
  public static generateTextsCallback: (
    question: Question,
    maxValue: number,
    minValue: number,
    stepsCount: number,
    texts: string[]
  ) => string[];

  protected chartTypes = ["gauge", "bullet"];
  chartType = "gauge";
  chartNode = <HTMLElement>document.createElement("div");

  constructor(
    protected targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
  }

  update(data: Array<{ [index: string]: any }>) {
    super.update(data);
    this.destroy();
    this.createChart();
    this.invokeOnUpdate();
  }

  private toolbarChangeHandler = (e: any) => {
    if (this.chartType !== e.target.value) {
      this.chartType = e.target.value;
      this.update(this.data);
    }
  };

  private createToolbar(
    container: HTMLDivElement,
    changeHandler: (e: any) => void
  ) {
    if (this.chartTypes.length > 0) {
      const toolbar = document.createElement("div");
      toolbar.className = "sva-question__toolbar";

      const selectWrapper = document.createElement("div");
      selectWrapper.className = "sva-question__select-wrapper";
      const select = document.createElement("select");
      select.className = "sva-question__select";
      this.chartTypes.forEach(chartType => {
        let option = document.createElement("option");
        option.value = chartType;
        option.text = chartType;
        option.selected = this.chartType === chartType;
        select.appendChild(option);
      });
      select.onchange = changeHandler;
      selectWrapper.appendChild(select);
      toolbar.appendChild(selectWrapper);

      container.appendChild(toolbar);
    }
  }

  destroy() {
    Plotly.purge(this.chartNode);
    this._result = undefined;
  }

  generateText(maxValue: number, minValue: number, stepsCount: number) {
    let texts: any = [];

    if (stepsCount === 5) {
      texts = [
        "very high (" + maxValue + ")",
        "high",
        "medium",
        "low",
        "very low (" + minValue + ")"
      ];
    } else {
      texts.push(maxValue);
      for (let i = 0; i < stepsCount - 2; i++) {
        texts.push("");
      }
      texts.push(minValue);
    }

    if (!!GaugePlotly.generateTextsCallback) {
      return GaugePlotly.generateTextsCallback(
        this.question,
        maxValue,
        minValue,
        stepsCount,
        texts
      );
    }

    return texts;
  }

  generateValues(maxValue: number, stepsCount: number) {
    const values = [];

    for (let i = 0; i < stepsCount; i++) {
      values.push(maxValue / stepsCount);
    }

    values.push(maxValue);

    return values;
  }

  generateColors(maxValue: number, minValue: number, stepsCount: number) {
    const palette = this.getColors();
    const colors = [];

    for (let i = 0; i < stepsCount; i++) {
      colors.push(palette[i]);
    }

    colors.push("rgba(255, 255, 255, 0)");

    return colors;
  }

  private createToolbarContainer() {
    const chartNodeContainer = document.createElement("div");
    const toolbarNodeContainer = document.createElement("div");

    chartNodeContainer.appendChild(toolbarNodeContainer);
    chartNodeContainer.appendChild(this.chartNode);
    this.targetElement.appendChild(chartNodeContainer);

    this.createToolbar(toolbarNodeContainer, this.toolbarChangeHandler);
  }

  private createChart() {
    const question = this.question;
    const arrowColor = "#4e6198";

    const maxValue = question.rateMax;
    const minValue = question.rateMin;
    const values = this.generateValues(maxValue, GaugePlotly.stepsCount);
    const text = this.generateText(maxValue, minValue, GaugePlotly.stepsCount);
    const colors = this.generateColors(
      maxValue,
      minValue,
      GaugePlotly.stepsCount
    );

    // Enter a speed between 0 and 180
    var level = this.result;

    var data: any = [
      {
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          shape: this.chartType,
          bgcolor: "white",
          bar: { color: colors[0] }
        },
        value: level,
        text: question.name,
        domain: { x: [0, 1], y: [0, 1] }
      }
    ];

    var layout = {
      width: 600,
      height: 400,
      plot_bgcolor: this.backgroundColor,
      paper_bgcolor: this.backgroundColor
    };

    // this.chartNode.style.maxHeight = "400px"; // fixed chart height
    // this.chartNode.style.overflow = "hidden";

    const config = {
      displayModeBar: false,
      staticPlot: true
    };

    this.chart = Plotly.newPlot(this.chartNode, data, layout, config);
  }

  render() {
    this.createToolbarContainer();
    this.createChart();
  }

  get result() {
    if (this._result === undefined) {
      const questionValues: Array<any> = [];

      this.data.forEach(rowData => {
        const questionValue: any = +rowData[this.question.name];
        if (!!questionValue) {
          questionValues.push(questionValue);
        }
      });

      this._result =
        questionValues.reduce((a, b) => {
          return a + b;
        }) / questionValues.length;
      this._result = Math.ceil(this._result * 100) / 100;
    }
    return this._result;
  }
}

VisualizationManager.registerVisualizer("rating", GaugePlotly);
