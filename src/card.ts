import { Question, Event } from "survey-core";
import { ICalculationResult, VisualizerBase } from "./visualizerBase";
import { DocumentHelper, toPrecision } from "./utils";
import { localization } from "./localizationManager";
import { NumberModel } from "./number";
import { VisualizationManager } from "./visualizationManager";

export class CardVisualizerWidget {
  private _renderedTarget: HTMLDivElement = undefined;

  constructor(private _model: NumberModel, private _data: ICalculationResult) {
  }

  private renderCard(title: string, value: number, secondaryValue?: number) {
    const scorePartElement = DocumentHelper.createElement("div", "sa-visualizer-nps__score-part");
    const titleElement = DocumentHelper.createElement("div", "sa-visualizer-nps__score-part-title");
    titleElement.innerText = localization.getString(title);
    scorePartElement.appendChild(titleElement);
    const valuesElement = DocumentHelper.createElement("div", "sa-visualizer-nps__score-part-values");
    scorePartElement.appendChild(valuesElement);
    const valueElement = DocumentHelper.createElement("div", "sa-visualizer-nps__score-part-value");
    valueElement.innerText = "" + value;
    valuesElement.appendChild(valueElement);
    if(secondaryValue) {
      const percentElement = DocumentHelper.createElement("div", "sa-visualizer-nps__score-part-percent");
      percentElement.innerText = "" + secondaryValue;
      valuesElement.appendChild(percentElement);
    }
    return scorePartElement;
  }
  public render(target: HTMLDivElement): void {
    this._renderedTarget = target;
    let value = this._data.data[0][this._data.values.indexOf(this._model.displayValueName || "value")];
    var element = DocumentHelper.createElement("div", "sa-visualizer-card");
    element.appendChild(this.renderCard(this._model.displayValueName || "value", value));
    target.appendChild(element);
  }

  public dispose(): void {
    if(!!this._renderedTarget) {
      this._renderedTarget.innerHTML = "";
      this._renderedTarget = undefined;
    }
  }
}

export class CardAdapter {
  private _cardVisualizer: any;

  constructor(private model: CardVisualizer) {}

  public async create(element: HTMLElement) {
    const data = await this.model.getCalculatedValues();
    this._cardVisualizer = new CardVisualizerWidget(this.model, data as any);
    this._cardVisualizer.render(element);
    return this._cardVisualizer;
  }

  public destroy(node: HTMLElement): void {
    if(this._cardVisualizer && typeof this._cardVisualizer.dispose === "function") {
      this._cardVisualizer.dispose();
    }
    this._cardVisualizer = undefined;
  }
}

export class CardVisualizer extends NumberModel {
  public precision = 2;
  private _cardAdapter: CardAdapter;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    type?: string
  ) {
    super(question, data, options, type || "card");
    this._cardAdapter = new CardAdapter(this);
    this._chartAdapter = undefined;
  }

  protected destroyContent(container: HTMLElement) {
    this._cardAdapter.destroy(container);
    super.destroyContent(container);
  }

  protected async renderContentAsync(container: HTMLElement) {
    const node: HTMLElement = DocumentHelper.createElement("div");
    container.appendChild(node);
    await this._cardAdapter.create(node);
    container.innerHTML = "";
    container.appendChild(node);
    return container;
  }

  destroy() {
    this._cardAdapter.destroy(this.contentContainer);
    super.destroy();
  }
}

VisualizationManager.registerVisualizer("card", CardVisualizer);
