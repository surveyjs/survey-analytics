import { VisualizationManager, VisualizerBase } from "./visualizationManager";
import { VisualizationPanel } from "./visualizationPanel";
import { SurveyModel, Question, QuestionPanelDynamicModel } from "survey-core";

export class VisualizationPanelDynamic extends VisualizerBase {
  constructor(
    private targetNode: HTMLElement,
    protected survey: SurveyModel,
    public question: Question,
    protected data: Array<{ [index: string]: any }>,
    private options?: Object
  ) {
    super(targetNode, survey, question, data, options);
    this.data = [];
    data.forEach(dataItem => !!dataItem[question.name] && (this.data = this.data.concat(dataItem[question.name])));
  }

  render() {
    const survey = this.survey;
    const paneldynamic: QuestionPanelDynamicModel = <any>this.question;
    const questions = paneldynamic.panels[0].questions;

    var visPanel = new VisualizationPanel(
      document.getElementById("summaryContainer"),
      survey,
      questions,
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
