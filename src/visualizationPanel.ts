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
    const gridSizerClassName = "sva-grid__grid-sizer";
    const questionElementClassName = "sva-question";

    const gridSizer = document.createElement("div"); //Masonry gridSizer empty element, only used for element sizing

    this.targetElement.className = "sva-grid";
    gridSizer.className = gridSizerClassName;
    this.targetElement.appendChild(gridSizer);

    this.questions.forEach(question => {
      const questionElement = document.createElement("div");
      const questionContent = document.createElement("div");
      const titleElement = document.createElement("h3");
      const vizualizerElement = document.createElement("div");

      titleElement.innerText = (<any>question)["title"];

      questionElement.className = questionElementClassName;
      questionContent.className = questionElementClassName + "__content";
      titleElement.className = questionElementClassName + "__title";

      questionContent.appendChild(titleElement);
      questionContent.appendChild(vizualizerElement);
      questionElement.appendChild(questionContent);
      this.targetElement.appendChild(questionElement);

      this.renderQuestionVisualication(vizualizerElement, question, this.data);
    });

    var msnry = new Masonry(this.targetElement, {
      columnWidth: "." + gridSizerClassName,
      itemSelector: "." + questionElementClassName
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
