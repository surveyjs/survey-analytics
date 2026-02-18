import {
  QuestionMatrixDropdownModel,
  MatrixDropdownColumn,
  ItemValue,
  QuestionSelectBase,
  Question,
} from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanel } from "./visualizationPanel";

function isChoicesArraysEqual(
  choices1: Array<ItemValue>,
  choices2: Array<ItemValue>
): boolean {
  if(choices1 === undefined || choices2 === undefined) return false;
  if(choices1.length !== choices2.length) return false;
  for(let i = 0; i < choices1.length; i++) {
    if(
      choices1[i].value !== choices2[i].value ||
      choices1[i].text !== choices2[i].text
    ) {
      return false;
    }
  }
  return true;
}

export class VisualizationMatrixDropdown extends VisualizerBase {
  protected _contentVisualizer: VisualizerBase = undefined;
  private readonly _childOptions;

  constructor(
    question: QuestionMatrixDropdownModel,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {},
    name?: string
  ) {
    super(question, data, options, name || "matrixDropdown");
    this.loadingData = false;
    this._childOptions = Object.assign({}, options);
    this._childOptions.disableLocaleSwitch = true;
    this._childOptions.allowDynamicLayout = false;
    this._childOptions.transposeData = true;
    this._childOptions.dataProvider = this.dataProvider;
    this._childOptions.dataPath = this.dataNames[0];
    this._childOptions.seriesValues = question.rows.map((row: ItemValue) => row.value);
    this._childOptions.seriesLabels = question.rows.map((row: ItemValue) => row.text);

    this.dataProvider.fixDropdownData(this.dataNames);
    if(this.canGroupColumns) {
      var creators = VisualizationManager.getVisualizersByType("matrixdropdown-grouped");
      this._contentVisualizer = new creators[0](this.question, [], this._childOptions);
    } else {
      const innerQuestions = this.getQuestions();
      this._contentVisualizer = new VisualizationPanel(innerQuestions, [], this._childOptions, undefined, false);
    }
    this._contentVisualizer.onAfterRender.add(this.onPanelAfterRenderCallback);
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
    this._contentVisualizer.locale = newLocale;
  }

  public get contentVisualizer() {
    return this._contentVisualizer;
  }

  private onPanelAfterRenderCallback = () => {
    this.afterRender(this.contentContainer);
  };

  updateData(data: Array<{ [index: string]: any }>) {
    super.updateData(data);
    this.dataProvider.fixDropdownData(this.dataNames);
  }

  getQuestions(): Array<Question> {
    const matrixdropdown: QuestionMatrixDropdownModel = <any>this.question;
    return matrixdropdown.columns.map(
      (column: MatrixDropdownColumn) => {
        const cellQuestion: any = column.templateQuestion;
        if(Array.isArray(cellQuestion.choices) && cellQuestion.choices.length === 0) {
          cellQuestion.choices = matrixdropdown.choices;
        }
        return cellQuestion;
      }
    );
  }

  destroyContent(container: HTMLElement) {
    this._contentVisualizer.clear();
    super.destroyContent(this.contentContainer);
  }

  renderContent(container: HTMLElement): void {
    this._contentVisualizer.render(container);
  }

  destroy() {
    super.destroy();
    this._contentVisualizer.onAfterRender.remove(this.onPanelAfterRenderCallback);
  }
}

VisualizationManager.registerVisualizer(
  "matrixdropdown",
  VisualizationMatrixDropdown
);
