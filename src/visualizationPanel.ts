import { VisualizationManager } from "./visualizationManager";
import { SurveyModel, Question, QuestionPanelDynamicModel } from "survey-core";

export class VisualizationPanel {
  constructor(
    protected targetElement: HTMLElement,
    protected survey: SurveyModel,
    protected questions: Array<Question>,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object
  ) {}

  render() {
    const survey = this.survey;
    const questions = this.questions;

    questions.forEach(question => {
      let questionContainerElement = document.createElement("div");
      let titleElement = document.createElement("h3");
      let vizualizerElement = document.createElement("div");

      titleElement.innerText = (<any>question)["title"];

      questionContainerElement.appendChild(titleElement);
      questionContainerElement.appendChild(vizualizerElement);
      this.targetElement.appendChild(questionContainerElement);

      this.renderQuestionVisualication(
        vizualizerElement,
        question,
        survey,
        this.data
      );
    });
  }

  destroy() {
    this.targetElement.innerHTML = "";
  }

  renderQuestionVisualication(
    vizualizerElement: HTMLElement,
    question: Question,
    survey: SurveyModel,
    data: Array<{ [index: string]: any }>
  ): void {
    var visualizers = VisualizationManager.getVisualizers(question.getType());
    var visualizer = new visualizers[0](
      vizualizerElement,
      survey,
      question,
      data
    );
    visualizer.render();
  }
}
