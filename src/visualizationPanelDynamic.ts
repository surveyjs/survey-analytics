import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanel } from "./visualizationPanel";
import { Question, QuestionPanelDynamicModel, IQuestion } from "survey-core";

export class VisualizationPanelDynamic extends VisualizerBase {
  protected _contentVisualizer: VisualizationPanel = undefined;
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
    options.dataProvider = this.dataProvider;
    options.dataPath = this.dataNames[0];
    this._contentVisualizer = new VisualizationPanel(this.getQuestions(), [], options, undefined, false);
    this._contentVisualizer.onAfterRender.add(this.onAfterRenderPanelCallback);
  }

  public get contentVisualizer(): VisualizationPanel {
    return this._contentVisualizer;
  }

  protected setLocale(newLocale: string) {
    super.setLocale(newLocale);
    this._contentVisualizer.locale = newLocale;
  }

  private onAfterRenderPanelCallback = () => {
    this.afterRender(this.contentContainer);
  };

  public resetFilter(): void {
    this.contentVisualizer.resetFilter();
  }

  getQuestions(): IQuestion[] {
    const paneldynamic: QuestionPanelDynamicModel = <any>this.question;
    return paneldynamic.template.questions;
  }

  destroyContent(container: HTMLElement) {
    this._contentVisualizer.clear();
    super.destroyContent(this.contentContainer);
  }

  renderContent(container: HTMLElement): void {
    this._contentVisualizer.render(container);
  }

  public destroy() {
    super.destroy();
    this._contentVisualizer.onAfterRender.remove(this.onAfterRenderPanelCallback);
  }
}

VisualizationManager.registerVisualizer(
  "paneldynamic",
  VisualizationPanelDynamic
);
