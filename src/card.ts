import { Question } from "survey-core";
import { ICalculationResult } from "./visualizerBase";
import { DocumentHelper } from "./utils";
import { NumberModel } from "./number";
import { VisualizationManager } from "./visualizationManager";

import "./card.scss";

export class CardVisualizerWidget {
  private _renderedTarget: HTMLDivElement = undefined;

  constructor(private _model: NumberModel, private _data: ICalculationResult) {
  }

  public render(target: HTMLDivElement): void {
    this._renderedTarget = target;
    let value = this._data.data[0][this._data.values.indexOf(this._model.displayValueName || "value")];
    const element = DocumentHelper.createElement("div", "sa-visualizer-card");
    const cardContainer = DocumentHelper.createElement("div", "sa-visualizer-card-content");
    const cardValueElement = DocumentHelper.createElement("div", "sa-visualizer-card-value");
    cardValueElement.innerText = "" + value;
    cardContainer.appendChild(cardValueElement);
    element.appendChild(cardContainer);
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

VisualizationManager.registerVisualizer("card", CardVisualizer, undefined, "card");
