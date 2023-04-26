import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanel } from "./visualizationPanel";
import { Question, QuestionPanelDynamicModel, IQuestion } from "survey-core";

export class VisualizationPanelDynamic extends VisualizerBase {
  protected _panelVisualizer: VisualizationPanel = undefined;
  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {},
    name?: string
  ) {
    super(question, data, options, name || "panelDynamic");
    var options = Object.assign({}, options);
    options.allowDynamicLayout = false;
    options.dataProvider = undefined;
    this._panelVisualizer = new VisualizationPanel(
      this.getQuestions(),
      [],
      options
    );
    this._panelVisualizer.onAfterRender.add(this.onAfterRenderPanelCallback);
    this.updateData(data);
  }

  protected setLocale(newLocale: string) {
    super.setLocale(newLocale);
    this._panelVisualizer.locale = newLocale;
  }

  private onAfterRenderPanelCallback = () => {
    this.afterRender(this.contentContainer);
  };

  public get type() {
    return "panelDynamic";
  }

  private updatePanelVisualizerData() {
    let panelData: Array<any> = [];
    this.data.forEach((dataItem) => {
      if (dataItem[this.question.name] !== undefined) {
        panelData = panelData.concat(dataItem[this.question.name]);
      }
    });
    this._panelVisualizer.updateData(panelData);
  }

  updateData(data: Array<{ [index: string]: any }>) {
    super.updateData(data);
    this.updatePanelVisualizerData();
  }

  protected onDataChanged() {
    this.updatePanelVisualizerData();
    super.onDataChanged();
  }

  getQuestions(): IQuestion[] {
    const paneldynamic: QuestionPanelDynamicModel = <any>this.question;
    return paneldynamic.template.questions;
  }

  destroyContent(container: HTMLElement) {
    this._panelVisualizer.clear();
    super.destroyContent(this.contentContainer);
  }

  renderContent(container: HTMLElement) {
    this._panelVisualizer.render(container);
  }

  public destroy() {
    super.destroy();
    this._panelVisualizer.onAfterRender.remove(this.onAfterRenderPanelCallback);
  }
}

VisualizationManager.registerVisualizer(
  "paneldynamic",
  VisualizationPanelDynamic
);
