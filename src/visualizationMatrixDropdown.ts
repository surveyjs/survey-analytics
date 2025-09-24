import {
  QuestionMatrixDropdownModel,
  MatrixDropdownColumn,
  ItemValue,
  Helpers,
  QuestionSelectBase,
} from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanel } from "./visualizationPanel";
import { DataProvider } from "./dataProvider";

function isChoicesArraysEqual(
  choices1: Array<ItemValue>,
  choices2: Array<ItemValue>
): boolean {
  if (choices1.length !== choices2.length) return false;
  for (let i = 0; i < choices1.length; i++) {
    if (
      choices1[i].value !== choices2[i].value ||
      choices1[i].text !== choices2[i].text
    ) {
      return false;
    }
  }
  return true;
}

export class VisualizationMatrixDropdown extends VisualizerBase {
  protected _matrixDropdownVisualizer: VisualizerBase = undefined;
  private readonly _childOptions;

  constructor(
    question: QuestionMatrixDropdownModel,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {},
    type?: string
  ) {
    super(question, data, options, type || "matrixDropdown");
    this.loadingData = false;
    this._childOptions = Object.assign({}, options);
    this._childOptions.disableLocaleSwitch = true;
    this._childOptions.dataProvider = undefined;
    this._childOptions.allowDynamicLayout = false;
    this._childOptions.transposeData = true;
    this._childOptions.seriesValues = question.rows.map((row: ItemValue) => row.value);
    this._childOptions.seriesLabels = question.rows.map((row: ItemValue) => row.text);

    if (this.canGroupColumns) {
      var creators = VisualizationManager.getVisualizersByType("matrixdropdown-grouped");
      this._matrixDropdownVisualizer = new creators[0](this.question, [], this._childOptions);
    } else {
      const innerQuestions = this.getQuestions();
      this._matrixDropdownVisualizer = new VisualizationPanel(innerQuestions, [], this._childOptions, undefined, false);
    }
    this._matrixDropdownVisualizer.onAfterRender.add(this.onPanelAfterRenderCallback);
    this.updateData(data);
  }

  public get canGroupColumns(): boolean {
    const innerQuestions = this.getQuestions();
    const canGroupColumns = this._childOptions.seriesValues.length == 1 && innerQuestions.every(innerQuestion =>
      innerQuestion.getType() !== "boolean" && isChoicesArraysEqual(innerQuestion.choices, (<QuestionSelectBase>this.question).choices));
    return canGroupColumns;
  }

  protected setLocale(newLocale: string) {
    super.setLocale(newLocale);
    this._childOptions.seriesLabels = this.question.rows.map((row: ItemValue) => row.text);
    this._matrixDropdownVisualizer.locale = newLocale;
  }

  public get matrixDropdownVisualizer() {
    return this._matrixDropdownVisualizer;
  }

  private onPanelAfterRenderCallback = () => {
    this.afterRender(this.contentContainer);
  };

  private updateDropdownVisualizerData() {
    let panelData: Array<any> = [];
    this.data.forEach((dataItem) => {
      let rawDataItem = dataItem[this.question.name];
      if (!!rawDataItem) {
        Object.keys(rawDataItem).forEach((key) => {
          var nestedDataItem = Object.assign({}, rawDataItem[key]);
          nestedDataItem[DataProvider.seriesMarkerKey] = key;
          panelData.push(nestedDataItem);
        });
      }
    });
    this._matrixDropdownVisualizer.updateData(panelData);
  }

  updateData(data: Array<{ [index: string]: any }>) {
    super.updateData(data);
    this.updateDropdownVisualizerData();
  }

  protected onDataChanged() {
    this.updateDropdownVisualizerData();
    super.onDataChanged();
  }

  getQuestions() {
    const matrixdropdown: QuestionMatrixDropdownModel = <any>this.question;
    return matrixdropdown.columns.map(
      (column: MatrixDropdownColumn) => {
        const cellQuestion: any = column.templateQuestion;
        if (Array.isArray(cellQuestion.choices) && cellQuestion.choices.length === 0) {
          cellQuestion.choices = matrixdropdown.choices;
        }
        return cellQuestion;
      }
    );
  }

  destroyContent(container: HTMLElement) {
    this._matrixDropdownVisualizer.clear();
    super.destroyContent(this.contentContainer);
  }

  renderContent(container: HTMLElement): void {
    this._matrixDropdownVisualizer.render(container, false);
  }

  destroy() {
    super.destroy();
    this._matrixDropdownVisualizer.onAfterRender.remove(this.onPanelAfterRenderCallback);
  }
}

VisualizationManager.registerVisualizer(
  "matrixdropdown",
  VisualizationMatrixDropdown
);
