import { VisualizationManager, VisualizerBase } from "./visualizationManager";
import { VisualizationPanel } from "./VisualizationPanel";
import { SurveyModel, IQuestion, QuestionPanelDynamicModel } from "survey-core";

export class VisualizationPanelDynamic extends VisualizerBase {
  constructor(
    private targetNode: HTMLElement,
    protected survey: SurveyModel,
    public questionName: string,
    protected data: Array<{ [index: string]: any }>,
    private options?: Object
  ) {
    super(targetNode, survey, questionName, data, options);
  }

  render() {
    const survey = this.survey;
    const paneldynamic = this.survey.getQuestionByName(this.questionName);
    const questions = (<any>paneldynamic).panels[0].questions;

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
