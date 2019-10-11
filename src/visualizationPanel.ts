import { VisualizationManager } from "./visualizationManager";
import { VisualizerBase } from "./visualizerBase";
import { AlternativeVisualizersWrapper } from "./alternativeVizualizersWrapper";
import { Question, QuestionPanelDynamicModel, Event } from "survey-core";
import Masonry from "masonry-layout";
import "./visualizationPanel.scss";
import { SelectBase } from "./selectBase";
import { ToolbarHelper } from "./utils/index";
import { localization } from "./localizationManager";
import { IVisualizerPanelElement, ElementVisibility } from "./config";

const gridSizerClassName = "sva-grid__grid-sizer";
const questionElementClassName = "sva-question";

export class VisualizationPanel {
  private _showHeader = false;
  private panelContent: HTMLDivElement = undefined;
  protected filteredData: Array<{ [index: string]: any }>;
  protected filterValues: { [index: string]: any } = {};
  protected visualizers: Array<VisualizerBase> = [];

  constructor(
    protected targetElement: HTMLElement,
    protected questions: Array<any>,
    protected data: Array<{ [index: string]: any }>,
    protected options?: Object,
    private _elements: Array<IVisualizerPanelElement> = [],
    private isTrustedAccess = false
  ) {
    this.filteredData = data;
    if(_elements.length === 0) {
      this._elements = this.buildElements(questions);
    }
  }

  private getMasonry: () => Masonry;

  protected buildElements(questions: any[]): IVisualizerPanelElement[] {
    return (questions || []).map(question => {
      return {
        name: question.name,
        displayName: question.title,
        visibility: ElementVisibility.Visible,
        type: undefined
      }
    });
  }

  public isVisible(visibility: ElementVisibility) {
    return this.isTrustedAccess && visibility !== ElementVisibility.Invisible || !this.isTrustedAccess && visibility === ElementVisibility.Visible;
  }

  protected get visibleElements() {
    return this._elements.filter(el => this.isVisible(el.visibility));
  }

  protected get hiddenElements() {
    return this._elements.filter(el => !this.isVisible(el.visibility));
  }

  protected getElement(name: string) {
    return this._elements.filter(el => el.name === name)[0];
  }

  onVisibleElementsCnahged = new Event<(sender: VisualizationPanel, options: any) => any, any>();

  visibleElementsCnahged() {
    if(!this.onVisibleElementsCnahged.isEmpty) {
      this.onVisibleElementsCnahged.fire(this, {});
    }
    this.layout();
  }

  destroyVisualizer(visualizer: VisualizerBase) {
    if (visualizer instanceof SelectBase) {
      visualizer.setSelection(undefined);
      visualizer.onDataItemSelected = undefined;
    }
    visualizer.onUpdate = undefined;
    visualizer.destroy();
    this.visualizers.splice(this.visualizers.indexOf(visualizer), 1);
  }

  renderVisualizer(element: IVisualizerPanelElement) {
    var question = this.questions.filter(q => q.name === element.name)[0];
    const questionElement = document.createElement("div");
    const questionContent = document.createElement("div");
    const titleElement = document.createElement("h3");
    const vizualizerElement = document.createElement("div");

    titleElement.innerText = element.displayName;

    questionElement.className = questionElementClassName;
    questionContent.className = questionElementClassName + "__content";
    titleElement.className = questionElementClassName + "__title";

    questionContent.appendChild(titleElement);
    questionContent.appendChild(vizualizerElement);
    questionElement.appendChild(questionContent);

    const visualizer = this.createVizualizer(
      vizualizerElement,
      question,
      this.filteredData
    );

    visualizer.registerToolbarItem("removeQuestion", (toolbar: HTMLDivElement) => {
      return ToolbarHelper.createButton(toolbar, () => {
        setTimeout(() => {
          element.visibility = ElementVisibility.Invisible;
          this.destroyVisualizer(visualizer);
          this.getMasonry().remove([questionElement]);
          this.panelContent.removeChild(questionElement);
          this.visibleElementsCnahged();
        }, 0 );
      }, localization.getString("hideButton"));
    });

    if (visualizer instanceof SelectBase) {
      var filterInfo = {
        text: <HTMLElement>undefined,
        element: <HTMLDivElement>undefined,
        update: function(selection: any) {
          if(!!selection && !!selection.value) {
            this.element.style.display = "inline-block";
            this.text.innerHTML = "Filter: [" + selection.text + "]";
          } else {
            this.element.style.display = "none";
            this.text.innerHTML = "";
          }
        }
      }

      visualizer.registerToolbarItem("questionFilterInfo", (toolbar: HTMLDivElement) => {
        filterInfo.element = document.createElement("div");
        filterInfo.element.className = "sva-question__filter";
    
        filterInfo.text = document.createElement("span");
        filterInfo.text.className = "sva-question__filter-text";
        filterInfo.element.appendChild(filterInfo.text);
    
        const filterClear = document.createElement("span");
        filterClear.className = "sva-toolbar__button";
        filterClear.innerHTML = localization.getString("clearButton");
        filterClear.onclick = () => {
          visualizer.setSelection(undefined);
        };
        filterInfo.element.appendChild(filterClear);
        toolbar.appendChild(filterInfo.element);

        filterInfo.update(visualizer.selection);

        return filterInfo.element;
      });

      visualizer.onDataItemSelected = (
        selectedValue: any,
        selectedText: string
      ) => {
        filterInfo.update({ value: selectedValue, text: selectedText });
        this.applyFilter(question.name, selectedValue);
      };
    }

    visualizer.render();
    visualizer.onUpdate = () => this.layout();
    this.visualizers.push(visualizer);

    return questionElement;
  }

  render() {
    let msnry: any = undefined;
    this.getMasonry = () => msnry;

    this.panelContent = document.createElement("div");

    const gridSizer = document.createElement("div"); //Masonry gridSizer empty element, only used for element sizing

    this.panelContent.className = "sva-grid";
    gridSizer.className = gridSizerClassName;
    this.panelContent.appendChild(gridSizer);

    this.visibleElements.forEach(element => {
      let questionElement = this.renderVisualizer(element);
      this.panelContent.appendChild(questionElement);
    });

    if(this.showHeader) {
      const panelHeader = document.createElement("div");
      panelHeader.className = "sva-panel__header";
      const toolobar = document.createElement("div");
      toolobar.className = "sva-toolbar";
      this.createToolbarItems(toolobar);
      panelHeader.appendChild(toolobar);
      this.targetElement.appendChild(panelHeader);
    }
    this.targetElement.appendChild(this.panelContent);

    msnry = new Masonry(this.panelContent, {
      columnWidth: "." + gridSizerClassName,
      itemSelector: "." + questionElementClassName
    });
  }

  protected createToolbarItems(toolbar: HTMLDivElement) {
    const resetFilterButton = ToolbarHelper.createButton(toolbar, () => {
      this.visualizers.forEach(visualizer => {
        if (visualizer instanceof SelectBase) {
          visualizer.setSelection(undefined);
        }
      });
    }, localization.getString("resetFilter"));
    toolbar.appendChild(resetFilterButton);

    let addElementSelector: HTMLElement = undefined;
    const addElementSelectorUpdater = (panel: VisualizationPanel, _: any) => {
      const hiddenElements = this.hiddenElements;
      if (hiddenElements.length > 0) {
        const selectWrapper = ToolbarHelper.createSelector(toolbar,
          [<any>{name: undefined, displayName: localization.getString("addElement")}].concat(hiddenElements).map(element => {
            return {
              value: element.name,
              text: element.displayName
            };
          }),
          (option: any) => false,
          (e: any) => {
            var element = this.getElement(e.target.value);
            element.visibility = ElementVisibility.Visible;            
            const questionElement = this.renderVisualizer(element);
            this.panelContent.appendChild(questionElement);
            this.getMasonry().addItems([questionElement]);
            this.visibleElementsCnahged();
          }
        );
        addElementSelector && toolbar.replaceChild(selectWrapper, addElementSelector) || toolbar.appendChild(selectWrapper);
        addElementSelector = selectWrapper;
      } else {
        addElementSelector && toolbar.removeChild(addElementSelector);
        addElementSelector = undefined;
      }
    }
    addElementSelectorUpdater(this, {});
    this.onVisibleElementsCnahged.add(addElementSelectorUpdater);
  }

  destroy() {
    let masonry = !!this.getMasonry && this.getMasonry();
    if(!!masonry) {
      masonry.destroy();
      this.getMasonry = undefined;
    }
    this.targetElement.innerHTML = "";
    this.panelContent = undefined;
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
    selectedValue: any
  ) {
    var filterChanged = true;
    if (selectedValue !== undefined) {
      filterChanged = this.filterValues[questionName] !== selectedValue;
      this.filterValues[questionName] = selectedValue;
    } else {
      filterChanged = this.filterValues[questionName] !== undefined;
      delete this.filterValues[questionName];
    }
    if(filterChanged) {
      this.filteredData = this.data.filter(item => {
        return !Object.keys(this.filterValues).some(
          key => item[key] !== this.filterValues[key]
        );
      });
      this.update();
    }
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
