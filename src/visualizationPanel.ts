import { VisualizationManager } from "./visualizationManager";
import { SurveyModel, IQuestion, QuestionPanelDynamicModel } from "survey-core";

export class VisualizationPanel {
  constructor(
    protected targetElement: HTMLElement,
    protected survey: SurveyModel,
    protected questions: Array<IQuestion>,
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

      //   if (question.getType() === "paneldynamic") {
      //     var visPanel = new VisualizationPanel(
      //       document.getElementById("summaryContainer"),
      //       survey,
      //       (<any>question)["panels"][0].questions,
      //       this.data
      //     );
      //     visPanel.render();
      //   }

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
    question: IQuestion,
    survey: SurveyModel,
    data: Array<{ [index: string]: any }>
  ): void {
    var visualizers = VisualizationManager.getVisualizers(question.getType());
    var visualizer = new visualizers[0](
      vizualizerElement,
      survey,
      question.name,
      data
    );
    visualizer.render();
  }
}
