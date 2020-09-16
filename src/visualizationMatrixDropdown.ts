import {
  QuestionMatrixDropdownModel,
  MatrixDropdownColumn,
  ItemValue,
} from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanel } from "./visualizationPanel";
import { DataProvider } from "./dataProvider";

export class VisualizationMatrixDropdown extends VisualizerBase {
  protected _panelVisualizer: VisualizationPanel = undefined;

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

    this._panelVisualizer = new VisualizationPanel(
      this.getQuestions(),
      [],
      options
    );
    this._panelVisualizer.onAfterRender.add(this.onPanelAfterRenderCallback);
    this.updateData(data);
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
    this._panelVisualizer.updateData(panelData);
  }

  getQuestions() {
    const matrixdropdown: QuestionMatrixDropdownModel = <any>this.question;
    return matrixdropdown.columns.map(
      (column: MatrixDropdownColumn) => column.templateQuestion
    );
  }

  destroyContent(container: HTMLElement) {
    this._panelVisualizer.clear();
    super.destroyContent(this.contentContainer);
  }

  renderContent(container: HTMLElement) {
    this._panelVisualizer.render(container);
  }

  destroy() {
    super.destroy();
    this._panelVisualizer.onAfterRender.remove(this.onPanelAfterRenderCallback);
  }
}

VisualizationManager.registerVisualizer(
  "matrixdropdown",
  VisualizationMatrixDropdown
);
