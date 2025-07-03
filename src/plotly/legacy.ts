import { BooleanModel } from "../boolean";
import { SelectBase } from "../selectBase";
import { HistogramModel } from "../histogram";
import { Matrix } from "../matrix";
import { MatrixDropdownGrouped } from "../matrixDropdownGrouped";
import { PivotModel } from "../pivot";
import { NumberModel } from "../number";

export class SelectBasePlotly extends SelectBase {
  public static types = ["bar", "vbar", "pie", "doughnut"];
  public static displayModeBar: any = undefined;
}

export class BooleanPlotly extends BooleanModel {
  public static types = ["pie", "bar", "doughnut"];
}

export class HistogramPlotly extends HistogramModel {
  public static types = ["vbar", "bar"];
}

export class MatrixPlotly extends Matrix {
  public static types = ["bar", "stackedbar", "pie", "doughnut"];
}

export class MatrixDropdownGroupedPlotly extends MatrixDropdownGrouped {
  public static types = ["stackedbar", "bar", "pie", "doughnut"];
}

export class PivotPlotly extends PivotModel {
  public static types = ["vbar", "bar", "line", "stackedbar", "pie", "doughnut"]; // ["vbar", "bar"];
}

export class GaugePlotly extends NumberModel {
  public static displayModeBar: any = undefined;
  public static types = ["gauge", "bullet"];
}
