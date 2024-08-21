import { Question, Event } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { DocumentHelper, toPrecision } from "./utils";
import { localization } from "./localizationManager";

import "./nps.scss";

export class NpsVisualizerWidget {
  private _renderedTarget: HTMLDivElement = undefined;

  constructor(private _model: NpsVisualizer, private _data: { detractors: number, passive: number, promoters: number, total: number }) {
  }

  private renderScorePart(partId: string, value: number, percent?: number) {
    const scorePartElement = DocumentHelper.createElement("div", "sa-visualizer-nps__score-part");
    const titleElement = DocumentHelper.createElement("div", "sa-visualizer-nps__score-part-title");
    titleElement.innerText = localization.getString(partId);
    scorePartElement.appendChild(titleElement);
    const valuesElement = DocumentHelper.createElement("div", "sa-visualizer-nps__score-part-values");
    scorePartElement.appendChild(valuesElement);
    const valueElement = DocumentHelper.createElement("div", "sa-visualizer-nps__score-part-value");
    valueElement.innerText = "" + value;
    valuesElement.appendChild(valueElement);
    if(percent) {
      const percentElement = DocumentHelper.createElement("div", "sa-visualizer-nps__score-part-percent");
      percentElement.innerText = "" + percent + "%";
      valuesElement.appendChild(percentElement);
    }
    return scorePartElement;
  }
  public render(target: HTMLDivElement): void {
    this._renderedTarget = target;
    var npsElement = DocumentHelper.createElement("div", "sa-visualizer-nps");
    npsElement.appendChild(this.renderScorePart("npsScore", this.npsScore));
    npsElement.appendChild(this.renderScorePart("npsPromoters", this._data.promoters, this.promotersPercent));
    npsElement.appendChild(this.renderScorePart("npsPassives", this._data.total - this._data.promoters - this._data.detractors, this.passivePercent));
    npsElement.appendChild(this.renderScorePart("npsDetractors", this._data.detractors, this.detractorsPercent));
    target.appendChild(npsElement);
  }
  public get npsScore(): number {
    return toPrecision(((this._data.promoters - this._data.detractors) / this._data.total) * 100, this._model.precision);
  }
  public get promotersPercent(): number {
    return toPrecision(this._data.promoters / this._data.total * 100, this._model.precision);
  }
  public get passivePercent(): number {
    return toPrecision((this._data.total - this._data.promoters - this._data.detractors) / this._data.total * 100, this._model.precision);
  }
  public get detractorsPercent(): number {
    return toPrecision(this._data.detractors / this._data.total * 100, this._model.precision);
  }
  public dispose(): void {
    if(!!this._renderedTarget) {
      this._renderedTarget.innerHTML = "";
      this._renderedTarget = undefined;
    }
  }
}

export class NpsAdapter {
  private _npsVisualizer: any;

  constructor(private model: NpsVisualizer) {}

  public get npsVisualizer(): any {
    return this._npsVisualizer;
  }

  public async create(element: HTMLElement) {
    const data = await this.model.getCalculatedValues();
    this._npsVisualizer = new NpsVisualizerWidget(this.model, data as any);
    this._npsVisualizer.render(element);
    return this._npsVisualizer;
  }

  public destroy(node: HTMLElement): void {
    if(this._npsVisualizer && typeof this._npsVisualizer.dispose === "function") {
      this._npsVisualizer.dispose();
    }
    this._npsVisualizer = undefined;
  }
}
export class NpsVisualizer extends VisualizerBase {
  public static DetractorScore = 6;
  public static PromoterScore = 9;
  public precision = 2;
  private _npsAdapter: NpsAdapter;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "nps");
    this._npsAdapter = new NpsAdapter(this);
  }

  protected getCalculatedValuesCore(): any {
    let result = {
      detractors: 0,
      passive: 0,
      promoters: 0,
      total: 0,
    };

    this.data.forEach((row) => {
      const rowValue: any = row[this.question.name];
      const scoreValue = parseInt(rowValue);
      if (!Number.isNaN(scoreValue)) {
        if(scoreValue <= NpsVisualizer.DetractorScore) {
          result.detractors++;
        } else if(scoreValue >= NpsVisualizer.PromoterScore) {
          result.promoters++;
        } else {
          result.passive++;
        }
        result.total++;
      }
    });

    return result;
  }

  protected destroyContent(container: HTMLElement) {
    this._npsAdapter.destroy(container);
    super.destroyContent(container);
  }

  protected async renderContentAsync(container: HTMLElement) {
    const npsNode: HTMLElement = DocumentHelper.createElement("div");
    container.appendChild(npsNode);
    await this._npsAdapter.create(npsNode);
    container.innerHTML = "";
    container.appendChild(npsNode);
    return container;
  }

  destroy() {
    this._npsAdapter.destroy(this.contentContainer);
    super.destroy();
  }
}

// VisualizationManager.registerVisualizer("rating", NpsVisualizer);
