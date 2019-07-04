import { VisualizationManager } from "./visualizationManager";
import { Question, QuestionPanelDynamicModel } from "survey-core";
import Masonry from "masonry-layout";
import "./index.scss";

export class VisualizationPanel {
  constructor(
    protected targetElement: HTMLElement,
    protected questions: Array<Question>,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object
  ) {}

  render() {
    this.questions.forEach(question => {
      let questionElement = document.createElement("div");
      let questionContent = document.createElement("div");
      let titleElement = document.createElement("h3");
      let vizualizerElement = document.createElement("div");

      titleElement.innerText = (<any>question)["title"];

      questionElement.className = "sva-question";
      questionContent.className = "sva-question__content";
      titleElement.className = "sva-question__title";

      questionContent.appendChild(titleElement);
      questionContent.appendChild(vizualizerElement);
      questionElement.appendChild(questionContent);
      this.targetElement.appendChild(questionElement);

      this.renderQuestionVisualication(vizualizerElement, question, this.data);
    });

    var msnry = new Masonry(this.targetElement, {
      itemSelector: ".sva-question"
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
