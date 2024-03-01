import { IVisualizerWithSelection } from "./selectBase";
import { DocumentHelper } from "./utils";
import { localization } from "./localizationManager";

export class FilterInfo {
  private _htmlElement: HTMLDivElement = undefined;
  private text: HTMLElement = undefined;

  constructor(visualizer: IVisualizerWithSelection) {
    this._htmlElement = <HTMLDivElement>(
      DocumentHelper.createElement("div", "sa-question__filter")
    );
    this.text = DocumentHelper.createElement(
      "span",
      "sa-question__filter-text"
    );
    this._htmlElement.appendChild(this.text);
    const filterClear = DocumentHelper.createButton(() => {
      visualizer.setSelection(undefined);
    }, localization.getString("clearButton"));
    this._htmlElement.appendChild(filterClear);
  }

  public get htmlElement() {
    return this._htmlElement;
  }

  public update(selection: { value: any, text: string }) {
    if (selection !== undefined && selection.value !== undefined) {
      this._htmlElement.style.display = "inline-flex";
      this.text.innerText = localization.getString("filter") + ": [" + selection.text + "]";
    } else {
      this._htmlElement.style.display = "none";
      this.text.innerText = "";
    }
  }
}
