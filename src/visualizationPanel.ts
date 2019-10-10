import { VisualizationManager } from "./visualizationManager";
import { VisualizerBase } from "./visualizerBase";
import { AlternativeVisualizersWrapper } from "./alternativeVizualizersWrapper";
import { Question, QuestionPanelDynamicModel } from "survey-core";
import Masonry from "masonry-layout";
import "./visualizationPanel.scss";
import { SelectBase } from "./selectBase";
import { ToolbarHelper } from "./utils/index";
import { localization } from "./localizationManager";

export class VisualizationPanel {
  private _showHeader = false;
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

    const panelHeader = document.createElement("div");
    const panelContent = document.createElement("div");

    const gridSizer = document.createElement("div"); //Masonry gridSizer empty element, only used for element sizing

    panelContent.className = "sva-grid";
    gridSizer.className = gridSizerClassName;
    panelContent.appendChild(gridSizer);

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
      panelContent.appendChild(questionElement);

      const visualizer = this.createVizualizer(
        vizualizerElement,
        question,
        this.filteredData
      );

      visualizer.registerToolbarItem("removeQuestion", (toolbar: HTMLDivElement) => {
        return ToolbarHelper.createButton(toolbar, () => {
          setTimeout(() => {
            visualizer.destroy();
            this.visualizers.splice(this.visualizers.indexOf(visualizer), 1);
            this.getMasonry().remove([questionElement]);
            panelContent.removeChild(questionElement);
            this.layout();
          }, 0 );
        }, localization.getString("removeButton"));
      });
      visualizer.render();

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

    this.targetElement.appendChild(panelHeader);
    this.targetElement.appendChild(panelContent);

    msnry = new Masonry(panelContent, {
      columnWidth: "." + gridSizerClassName,
      itemSelector: "." + questionElementClassName
    });
  }

  destroy() {
    let masonry = !!this.getMasonry && this.getMasonry();
    if(!!masonry) {
      masonry.destroy();
      this.getMasonry = undefined;
    }
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
    if(hard && this.visualizers.length > 0) {
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

  createVizualizer(
    vizualizerElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>
  ): VisualizerBase {
    var creators = VisualizationManager.getVisualizers(question.getType());
    var visualizers = creators.map(creator => new creator(vizualizerElement, question, data));
    if(visualizers.length > 1) {
      let visualizer = new AlternativeVisualizersWrapper(visualizers, vizualizerElement, question, data);
      return visualizer;
    }
    return visualizers[0];
  }

  get showHeader() {
    return this._showHeader;
  }
  set showHeader(newValue: boolean) {
    if(newValue != this._showHeader) {
      this._showHeader = newValue;
      this.update(true);
    }
  }
}
