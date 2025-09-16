import { Question, QuestionCompositeModel, QuestionMatrixDropdownModel } from "survey-core";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanelDynamic } from "./visualizationPanelDynamic";

export class VisualizationComposite extends VisualizationPanelDynamic {
  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
  }

  public get type() {
    return "composite";
  }

  getQuestions() {
    const matrixdynamic: QuestionCompositeModel = <any>this.question;
    const innerQuestions = [];
    matrixdynamic.contentPanel.addQuestionsToList(innerQuestions);
    return innerQuestions;
  }
}

VisualizationManager.registerVisualizer(
  "composite",
  VisualizationComposite
);
