import { Question } from "survey-core";
var Plotly = <any>require("plotly.js-dist");
import { VisualizerBase } from "../visualizerBase";
import { VisualizationManager } from "../visualizationManager";

import c3 from "c3";

export class GaugePlotly extends VisualizerBase {
  private _result: any;
  private chart: Promise<Plotly.PlotlyHTMLElement>;

  constructor(
    protected chartNode: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(chartNode, question, data, options);
  }

  destroy() {
    Plotly.purge(this.chartNode);
  }

  generateText(maxValue: number, minValue: number, stepsCount: number) {
    const text: any = [];
    //"21-25", "16-20", "11-15", "6-10", "0-5"

    // text.push(maxValue);
    // for (let i = 0; i < stepsCount - 2; i++) {
    //   text.push("");
    // }
    // text.push(minValue);

    return [
      "very hight (" + maxValue + ")",
      "hight",
      "medium",
      "low",
      "very low (" + minValue + ")"
    ];
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

  render() {
    const question = this.question;
    const arrowColor = "#4e6198";

    const maxValue = question.rateMax;
    const minValue = question.rateMin;
    const stepsCount = 5;
    const values = this.generateValues(maxValue, stepsCount);
    const text = this.generateText(maxValue, minValue, stepsCount);
    const colors = this.generateColors(maxValue, minValue, stepsCount);

    // Enter a speed between 0 and 180
    var level = this.result;

    // Trig to calc meter point
    var degrees = maxValue - level,
      radius = 0.5;
    var radians = (degrees * Math.PI) / maxValue;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = "M -.0 -0.025 L .0 0.025 L ",
      pathX = String(x),
      space = " ",
      pathY = String(y),
      pathEnd = " Z";
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data: any = [
      {
        type: "scatter",
        x: [0],
        y: [0],
        marker: {
          size: 28,
          color: arrowColor
        },
        name: question.name,
        text: level,
        showlegend: false,
        hoverinfo: "text+name"
      },
      {
        values: values,
        rotation: 90,
        text: text,
        textinfo: "text",
        textposition: "inside",
        // textfont: {
        //   size: 20
        // },
        marker: {
          colors: colors
        },
        hoverinfo: "skip",
        hole: 0.5,
        type: "pie",
        showlegend: false
      }
    ];

    var layout: any = {
      shapes: [
        {
          type: "path",
          path: path,
          fillcolor: arrowColor,
          line: {
            color: arrowColor
          }
        }
      ],
      title: level,
      height: 600,
      width: 600,
      xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      plot_bgcolor: this.backgroundColor,
      paper_bgcolor: this.backgroundColor
    };

    this.chartNode.style.maxHeight = "400px"; // fixed chart height
    this.chartNode.style.overflow = "hidden";

    const config = {
      displayModeBar: false,
      staticPlot: true
    };

    this.chart = Plotly.newPlot(this.chartNode, data, layout, config);
  }

  get result() {
    if (this._result === undefined) {
      const questionValues: Array<any> = [];

      this.data.forEach(rowData => {
        const questionValue: any = rowData[this.question.name];
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
