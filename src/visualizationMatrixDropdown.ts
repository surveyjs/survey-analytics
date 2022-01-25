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

export class VisualizationMatrixDropdown extends VisualizerBase {
  protected _matrixDropdownVisualizer: VisualizerBase = undefined;

  constructor(
    question: QuestionMatrixDropdownModel,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {},
    name?: string
  ) {
    super(question, data, options, name || "matrixDropdown");
    var options = Object.assign({}, options);
    options.dataProvider = undefined;
    options.allowDynamicLayout = false;
    options.seriesValues = question.rows.map((row: ItemValue) => row.value);
    options.seriesLabels = question.rows.map((row: ItemValue) => row.text);

    const innerQuestions = this.getQuestions();
    const canGroupColumns = options.seriesValues.length == 1 && innerQuestions.every(innerQuestion => Helpers.isArraysEqual(innerQuestion.choices, (<QuestionSelectBase>this.question).choices));
    if (canGroupColumns) {
      var creators = VisualizationManager.getVisualizersByType("matrixdropdown-grouped");
      this._matrixDropdownVisualizer = new creators[0](this.question, [], options);
    } else {
      this._matrixDropdownVisualizer = new VisualizationPanel(innerQuestions, [], options);
    }
    this._matrixDropdownVisualizer.onAfterRender.add(this.onPanelAfterRenderCallback);
    this.updateData(data);
  }

  public get matrixDropdownVisualizer() {
    return this._matrixDropdownVisualizer;
  }

  private onPanelAfterRenderCallback = () => {
    this.afterRender(this.contentContainer);
  };

  updateData(data: Array<{ [index: string]: any }>) {
    super.updateData(data);
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

  renderContent(container: HTMLElement) {
    this._matrixDropdownVisualizer.render(container);
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
