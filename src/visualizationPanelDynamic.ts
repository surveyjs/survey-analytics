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
    this.loadingData = false;
    var options = Object.assign({}, options);
    options.allowHideQuestions = false;
    options.allowDynamicLayout = false;
    options.dataProvider = undefined;
    options.dataPath = this.dataNames[0];
    this._panelVisualizer = new VisualizationPanel(this.getQuestions(), [], options, undefined, false);
    this._panelVisualizer.onAfterRender.add(this.onAfterRenderPanelCallback);
    this.updateData(data);
  }

  public get contentVisualizer(): VisualizationPanel {
    return this._panelVisualizer;
  }

  protected setLocale(newLocale: string) {
    super.setLocale(newLocale);
    this._panelVisualizer.locale = newLocale;
  }

  private onAfterRenderPanelCallback = () => {
    this.afterRender(this.contentContainer);
  };

  updateData(data: Array<{ [index: string]: any }>) {
    super.updateData(data);
    this._panelVisualizer.updateData(data);
  }

  protected onDataChanged() {
    this._panelVisualizer.updateData(this.dataProvider.filteredData);
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

  renderContent(container: HTMLElement): void {
    this._panelVisualizer.render(container, false);
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
