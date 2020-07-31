import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanel } from "./visualizationPanel";
import { Question, QuestionPanelDynamicModel, IQuestion } from "survey-core";

export class VisualizationPanelDynamic extends VisualizerBase {
  protected _panelVisualizer: VisualizationPanel = undefined;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {}
  ) {
    super(question, data, options);
    var options = Object.assign({}, options);
    options.allowDynamicLayout = false;
    options.dataProvider = undefined;
    this._panelVisualizer = new VisualizationPanel(
      this.getQuestions(),
      [],
      options
    );
    this.updateData(data);
  }

  public get name() {
    return "panelDynamic";
  }

  updateData(data: Array<{ [index: string]: any }>) {
    super.updateData(data);
    let panelData: Array<any> = [];
    this.data.forEach((dataItem) => {
      if (dataItem[this.question.name] !== undefined) {
        panelData = panelData.concat(dataItem[this.question.name]);
      }
    });
    this._panelVisualizer.updateData(panelData);
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
