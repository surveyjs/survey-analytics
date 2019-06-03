import { VisualizationManager, VisualizerBase } from "./visualizationManager";
import { VisualizationPanel } from "./visualizationPanel";
import { Question, QuestionPanelDynamicModel } from "survey-core";

export class VisualizationPanelDynamic extends VisualizerBase {
  constructor(
    protected targetNode: HTMLElement,
    public question: Question,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object
  ) {
    super(targetNode, question, data, options);
    this.data = [];
    data.forEach(
      dataItem =>
        !!dataItem[question.name] &&
        (this.data = this.data.concat(dataItem[question.name]))
    );
  }

  getQuestions() {
    const paneldynamic: QuestionPanelDynamicModel = <any>this.question;
    return paneldynamic.panels[0].questions;
  }

  render() {
    var visPanel = new VisualizationPanel(
      document.getElementById("summaryContainer"),
      this.getQuestions(),
      this.data
    );
    visPanel.render();
  }

  destroy() {
    this.targetElement.innerHTML = "";
  }
}

VisualizationManager.registerVisualizer(
  "paneldynamic",
  VisualizationPanelDynamic
);
