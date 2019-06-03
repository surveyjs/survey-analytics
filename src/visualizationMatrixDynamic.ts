import { VisualizationManager } from "./visualizationManager";
import { Question, QuestionMatrixDropdownModel } from "survey-core";
import { VisualizationPanelDynamic } from "./visualizationPanelDynamic";

export class VisualizationMatrixDynamic extends VisualizationPanelDynamic {
  constructor(
    protected targetNode: HTMLElement,
    public question: Question,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object
  ) {
    super(targetNode, question, data, options);
  }

  getQuestions() {
    const matrixdynamic: QuestionMatrixDropdownModel = <any>this.question;
    return matrixdynamic.columns.map(c => c.templateQuestion);
  }
}

VisualizationManager.registerVisualizer(
  "matrixdynamic",
  VisualizationMatrixDynamic
);
