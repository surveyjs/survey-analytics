import { Question, QuestionMatrixDropdownModel } from "survey-core";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanelDynamic } from "./visualizationPanelDynamic";

export class VisualizationMatrixDynamic extends VisualizationPanelDynamic {
  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
  }

  public get type() {
    return "matrixDynamic";
  }

  getQuestions() {
    const matrixdynamic: QuestionMatrixDropdownModel = <any>this.question;
    const visibleRows = matrixdynamic.visibleRows;

    if (visibleRows.length === 0) return [];

    return visibleRows[0].cells.map(c => c.question);
  }
}

VisualizationManager.registerVisualizer(
  "matrixdynamic",
  VisualizationMatrixDynamic
);
