import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanel } from "./visualizationPanel";
import { Question, QuestionPanelDynamicModel, IQuestion } from "survey-core";

export class VisualizationPanelDynamic extends VisualizerBase {
  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    this.data = [];
    data.forEach(
      dataItem =>
        !!dataItem[question.name] &&
        (this.data = this.data.concat(dataItem[question.name]))
    );
  }

  getQuestions(): IQuestion[] {
    const paneldynamic: QuestionPanelDynamicModel = <any>this.question;
    return paneldynamic.template.questions;
  }

  render(targetElement: HTMLElement) {
    var visPanel = new VisualizationPanel(
      this.getQuestions(),
      this.data,
      { allowDynamicLayout: false }
    );
    visPanel.render(targetElement);
  }
}

VisualizationManager.registerVisualizer(
  "paneldynamic",
  VisualizationPanelDynamic
);
