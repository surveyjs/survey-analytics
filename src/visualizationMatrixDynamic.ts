import { VisualizationManager } from "./visualizationManager";
import { Question, QuestionMatrixDropdownModel } from "survey-core";
import { VisualizationPanelDynamic } from "./visualizationPanelDynamic";

export class VisualizationMatrixDynamic extends VisualizationPanelDynamic {
  constructor(
    targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
  }

  getQuestions() {
    const matrixdynamic: QuestionMatrixDropdownModel = <any>this.question;
    return matrixdynamic.columns.map(c => c.templateQuestion);
    // return matrixdynamic.visibleRows[0].cells.map(c => c.question);
  }
}

VisualizationManager.registerVisualizer(
  "matrixdynamic",
  VisualizationMatrixDynamic
);

VisualizationManager.registerVisualizer(
  "matrixdropdown",
  VisualizationMatrixDynamic
);
