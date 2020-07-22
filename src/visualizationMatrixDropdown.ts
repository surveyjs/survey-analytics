import { Question, QuestionMatrixDropdownModel, MatrixDropdownColumn } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanel } from "./visualizationPanel";

export class VisualizationMatrixDropdown extends VisualizerBase {
  private _panelVisualizer: VisualizationPanel = undefined;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    this._panelVisualizer = new VisualizationPanel(
      this.getQuestions(),
      [],
      { allowDynamicLayout: false }
    );
    this.update(data);
  }

  update(data: Array<{ [index: string]: any }>) {
    this.data = [];
    data.forEach(dataItem => {
        let rawDataItem = dataItem[this.question.name];
        if(!!rawDataItem) {
          Object.keys(rawDataItem).forEach(key => {
            this.data.push(rawDataItem[key]);
          });
        }
    });
    this._panelVisualizer.update(this.data);
  }

  getQuestions() {
    const matrixdropdown: QuestionMatrixDropdownModel = <any>this.question;
    return matrixdropdown.columns.map((column: MatrixDropdownColumn) => column.templateQuestion)
  }

  destroyContent(container: HTMLElement) {
    this._panelVisualizer.destroy();
  }

  renderContent(container: HTMLElement) {
    this._panelVisualizer.render(container);
  }
}

VisualizationManager.registerVisualizer(
  "matrixdropdown",
  VisualizationMatrixDropdown
);
