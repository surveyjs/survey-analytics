import { VisualizationManager } from "../visualizationManager";
import { BooleanModel } from "../boolean";
import { SelectBase } from "../selectBase";
import { Question } from "survey-core";
import { HistogramModel } from "../histogram";
import { Matrix } from "../matrix";
import { MatrixDropdownGrouped } from "../matrixDropdownGrouped";
import { PivotModel } from "../pivot";
import { NumberModel } from "../number";

export class SelectBasePlotly extends SelectBase {
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
  }
}

VisualizationManager.registerVisualizer("checkbox", SelectBasePlotly);
VisualizationManager.registerVisualizer("radiogroup", SelectBasePlotly);
VisualizationManager.registerVisualizer("dropdown", SelectBasePlotly);
VisualizationManager.registerVisualizer("imagepicker", SelectBasePlotly);
VisualizationManager.registerVisualizer("tagbox", SelectBasePlotly);

export class BooleanPlotly extends BooleanModel {
  public static types = ["pie", "bar", "doughnut"];
}

VisualizationManager.registerVisualizer("boolean", BooleanPlotly);

export class HistogramPlotly extends HistogramModel {
  public static types = ["vbar", "bar"];
}

VisualizationManager.registerVisualizer("date", HistogramPlotly);
VisualizationManager.registerVisualizer("number", HistogramPlotly);
VisualizationManager.registerVisualizer("rating", HistogramPlotly);

export class MatrixPlotly extends Matrix {
  public static types = ["bar", "stackedbar", "pie", "doughnut"];
}

VisualizationManager.registerVisualizer("matrix", MatrixPlotly);

export class MatrixDropdownGroupedPlotly extends MatrixDropdownGrouped {
  public static types = ["stackedbar", "bar", "pie", "doughnut"];
}

VisualizationManager.registerVisualizer("matrixdropdown-grouped", MatrixDropdownGroupedPlotly);

export class PivotPlotly extends PivotModel {
  public static types = ["vbar", "bar", "line", "stackedbar", "pie", "doughnut"]; // ["vbar", "bar"];
}

VisualizationManager.registerPivotVisualizer(PivotPlotly);

export class GaugePlotly extends NumberModel {
  public static displayModeBar: any = undefined;
  public static types = ["gauge", "bullet"];
}

VisualizationManager.registerVisualizer("number", GaugePlotly);
VisualizationManager.registerVisualizer("rating", GaugePlotly);
VisualizationManager.registerVisualizer("expression", GaugePlotly);
