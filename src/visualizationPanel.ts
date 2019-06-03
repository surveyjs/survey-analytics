import { VisualizationManager } from "./visualizationManager";
import { Question, QuestionPanelDynamicModel } from "survey-core";

export class VisualizationPanel {
  constructor(
    protected targetElement: HTMLElement,
    protected questions: Array<Question>,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object
  ) {}

  render() {
    this.questions.forEach(question => {
      let questionContainerElement = document.createElement("div");
      let titleElement = document.createElement("h3");
      let vizualizerElement = document.createElement("div");

      titleElement.innerText = (<any>question)["title"];

      questionContainerElement.appendChild(titleElement);
      questionContainerElement.appendChild(vizualizerElement);
      this.targetElement.appendChild(questionContainerElement);

      this.renderQuestionVisualication(vizualizerElement, question, this.data);
    });
  }

  destroy() {
    this.targetElement.innerHTML = "";
  }

  renderQuestionVisualication(
    vizualizerElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>
  ): void {
    var visualizers = VisualizationManager.getVisualizers(question.getType());
    var visualizer = new visualizers[0](vizualizerElement, question, data);
    visualizer.render();
  }
}
