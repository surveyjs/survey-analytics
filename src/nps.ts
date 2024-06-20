import { Question, Event } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { DocumentHelper } from "./utils";
import { localization } from "./localizationManager";

import "./nps.scss";

export class NpsVizualizerWidget {
  private _renderedTarget: HTMLDivElement = undefined;

  constructor(private _model: NpsVizualizer, private _data: { detractors: number, passive: number, promoters: number, total: number }) {
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
    npsElement.appendChild(this.renderScorePart("npsScore", ((this._data.promoters - this._data.detractors) / this._data.total) * 100));
    npsElement.appendChild(this.renderScorePart("npsPromoters", this._data.promoters, this._data.promoters / this._data.total * 100));
    npsElement.appendChild(this.renderScorePart("npsPassives", this._data.total - this._data.promoters - this._data.detractors, (this._data.total - this._data.promoters - this._data.detractors) / this._data.total * 100));
    npsElement.appendChild(this.renderScorePart("npsDetractors", this._data.detractors, this._data.detractors / this._data.total * 100));
    target.appendChild(npsElement);
  }
  public dispose(): void {
    if(!!this._renderedTarget) {
      this._renderedTarget.innerHTML = "";
      this._renderedTarget = undefined;
    }
  }
}

export class NpsAdapter {
  private _npsVizualizer: any;

  constructor(private model: NpsVizualizer) {}

  public get npsVizualizer(): any {
    return this._npsVizualizer;
  }

  public create(element: HTMLElement): any {
    const data = this.model.getCalculatedValues();
    this._npsVizualizer = new NpsVizualizerWidget(this.model, data);
    this._npsVizualizer.render(element);
    return this._npsVizualizer;
  }

  public destroy(node: HTMLElement): void {
    if(this._npsVizualizer && typeof this._npsVizualizer.dispose === "function") {
      this._npsVizualizer.dispose();
    }
    this._npsVizualizer = undefined;
  }
}
export class NpsVizualizer extends VisualizerBase {
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

  public getCalculatedValues(): any {
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
        if(scoreValue <= 6) {
          result.detractors++;
        } else if(scoreValue >= 9) {
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

  protected renderContent(container: HTMLElement) {
    this._npsAdapter.create(container);
    this.afterRender(this.contentContainer);
  }

  destroy() {
    this._npsAdapter.destroy(this.contentContainer);
    super.destroy();
  }
}

// VisualizationManager.registerVisualizer("rating", NpsVizualizer);
