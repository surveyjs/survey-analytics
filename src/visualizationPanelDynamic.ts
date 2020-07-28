import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanel } from "./visualizationPanel";
import { Question, QuestionPanelDynamicModel, IQuestion } from "survey-core";

export class VisualizationPanelDynamic extends VisualizerBase {
  private _panelVisualizer: VisualizationPanel = undefined;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    this._panelVisualizer = new VisualizationPanel(this.getQuestions(), [], {
      allowDynamicLayout: false,
    });
    this.updateData(data);
  }

  public get name() {
    return "panelDynamic";
  }

  updateData(data: Array<{ [index: string]: any }>) {
    this.data = [];
    data.forEach((dataItem) => {
      if (!!dataItem[this.question.name]) {
        this.data = this.data.concat(dataItem[this.question.name]);
      }
    });
    this._panelVisualizer.updateData(this.data);
  }

  getQuestions(): IQuestion[] {
    const paneldynamic: QuestionPanelDynamicModel = <any>this.question;
    return paneldynamic.template.questions;
  }

  destroyContent(container: HTMLElement) {
    this._panelVisualizer.destroy();
  }

  renderContent(container: HTMLElement) {
    this._panelVisualizer.render(container);
  }
}

VisualizationManager.registerVisualizer(
  "paneldynamic",
  VisualizationPanelDynamic
);
