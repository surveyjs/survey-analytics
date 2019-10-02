import { VisualizationManager } from "./visualizationManager";
import { VisualizerBase } from "./visualizerBase";
import { Question, QuestionPanelDynamicModel } from "survey-core";
import Masonry from "masonry-layout";
import "./visualizationPanel.scss";
import { SelectBase } from "./selectBase";

export class VisualizationPanel {
  protected filteredData: Array<{ [index: string]: any }>;
  protected filterValues: { [index: string]: any };
  protected visualizers: Array<VisualizerBase> = [];

  constructor(
    protected targetElement: HTMLElement,
    protected questions: Array<any>,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object
  ) {
    this.filteredData = data;
  }

  private getMasonry: () => Masonry;

  render() {
    const gridSizerClassName = "sva-grid__grid-sizer";
    const questionElementClassName = "sva-question";
    let msnry: any = undefined;
    this.getMasonry = () => msnry;

    const gridSizer = document.createElement("div"); //Masonry gridSizer empty element, only used for element sizing

    this.targetElement.className = "sva-grid";
    gridSizer.className = gridSizerClassName;
    this.targetElement.appendChild(gridSizer);

    this.questions.forEach(question => {
      const questionElement = document.createElement("div");
      const questionContent = document.createElement("div");
      const titleElement = document.createElement("h3");
      const vizualizerElement = document.createElement("div");

      titleElement.innerText = (<any>question)["title"];

      questionElement.className = questionElementClassName;
      questionContent.className = questionElementClassName + "__content";
      titleElement.className = questionElementClassName + "__title";

      questionContent.appendChild(titleElement);
      questionContent.appendChild(vizualizerElement);
      questionElement.appendChild(questionContent);
      this.targetElement.appendChild(questionElement);

      const visualizer = this.renderQuestion(
        vizualizerElement,
        question,
        this.filteredData
      );

      visualizer.onUpdate = () => {
        this.layout();
      };
      if (visualizer instanceof SelectBase) {
        visualizer.onDataItemSelected = (
          selectedValue: any,
          clearSelection: boolean
        ) => {
          this.applyFilter(question.name, selectedValue, clearSelection);
          this.update();
        };
      }
      this.visualizers.push(visualizer);
    });

    msnry = new Masonry(this.targetElement, {
      columnWidth: "." + gridSizerClassName,
      itemSelector: "." + questionElementClassName
    });
  }

  destroy() {
    this.targetElement.innerHTML = "";
    this.visualizers.forEach(visualizer => {
      visualizer.onUpdate = undefined;
      if (visualizer instanceof SelectBase) {
        visualizer.onDataItemSelected = undefined;
      }
      visualizer.destroy();
    });
    this.visualizers = [];
  }

  update(hard: boolean = false) {
    if(hard) {
      this.destroy();
      this.render();
    } else {
      this.visualizers.forEach(visualizer =>
        setTimeout(() => visualizer.update(this.filteredData), 10)
      );
    }
  }

  layout() {
    if (this.getMasonry && this.getMasonry()) {
      this.getMasonry().layout();
    }
  }

  applyFilter(
    questionName: string,
    selectedValue: any,
    clearSelection: boolean = true
  ) {
    if (clearSelection) {
      this.filterValues = <any>{};
    }
    if (selectedValue !== undefined) {
      this.filterValues[questionName] = selectedValue;
    } else {
      delete this.filterValues[questionName];
    }
    this.filteredData = this.data.filter(item => {
      return !Object.keys(this.filterValues).some(
        key => item[key] !== this.filterValues[key]
      );
    });
  }

  renderQuestion(
    vizualizerElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>
  ) {
    var visualizers = VisualizationManager.getVisualizers(question.getType());
    var visualizer = new visualizers[0](vizualizerElement, question, data);
    visualizer.render();
    return visualizer;
  }
}
