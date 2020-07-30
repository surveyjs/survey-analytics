import { Event, Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { SelectBase } from "./selectBase";
import { DocumentHelper } from "./utils/index";
import { localization } from "./localizationManager";
import { IVisualizerPanelElement, ElementVisibility, IState } from "./config";
import { VisualizerFactory } from "./visualizerFactory";
const Muuri = require("muuri");
import "./visualizationPanel.scss";

const questionElementClassName = "sa-question";
const questionLayoutedElementClassName = "sa-question-layouted";

export interface IVisualizerPanelRenderedElement
  extends IVisualizerPanelElement {
  renderedElement?: HTMLElement;
}

/**
 * VisualizationPanel is responsible for displaying an array of survey questions
 *
 * constructor parameters:
 * questions - an array of survey questions to visualize
 * data - an array of answers in format of survey result
 *
 * options:
 * allowDynamicLayout - set it to false to disable items drag/drop reordering and dynamic layouting
 * allowHideQuestions - set it to false to deny user to hide/show individual questions
 * seriesValues - an array of series values in data to group data by series
 * seriesLabels - labels for series to display, if not passed the seriesValues are used as labels
 * survey - pass survey instance to use localses from the survey JSON
 *
 * elements - list of visual element descriptions
 */
export class VisualizationPanel extends VisualizerBase {
  protected filteredData: Array<{ [index: string]: any }>;
  protected filterValues: { [index: string]: any } = {};
  protected visualizers: Array<VisualizerBase> = [];

  constructor(
    protected questions: Array<any>,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {},
    private _elements: Array<IVisualizerPanelRenderedElement> = undefined,
    private isTrustedAccess = false
  ) {
    super(null, data, options);

    this.showHeader = false;
    if (this.options.survey) {
      localization.currentLocale = this.options.survey.locale;
    }
    this.filteredData = data;

    if (_elements === undefined) {
      this._elements = this.buildElements(questions);
    }

    this.buildVisualizers(questions);

    this.registerToolbarItem("resetFilter", () => {
      return DocumentHelper.createButton(() => {
        this.visualizers.forEach((visualizer) => {
          if (visualizer instanceof SelectBase) {
            visualizer.setSelection(undefined);
          }
        });
      }, localization.getString("resetFilter"));
    });
    this.registerToolbarItem("addElement", (toolbar: HTMLDivElement) => {
      if (this.allowHideQuestions) {
        let addElementSelector: HTMLElement = undefined;
        const addElementSelectorUpdater = (
          panel: VisualizationPanel,
          options: any
        ) => {
          const hiddenElements = this.hiddenElements;
          if (hiddenElements.length > 0) {
            const selectWrapper = DocumentHelper.createSelector(
              [
                <any>{
                  name: undefined,
                  displayName: localization.getString("addElement"),
                },
              ]
                .concat(hiddenElements)
                .map((element) => {
                  return {
                    value: element.name,
                    text: element.displayName,
                  };
                }),
              (option: any) => false,
              (e: any) => {
                this.addElementToLayout(e.target.value);
              }
            );
            (addElementSelector &&
              toolbar.replaceChild(selectWrapper, addElementSelector)) ||
              toolbar.appendChild(selectWrapper);
            addElementSelector = selectWrapper;
          } else {
            addElementSelector && toolbar.removeChild(addElementSelector);
            addElementSelector = undefined;
          }
        };
        addElementSelectorUpdater(this, {});
        this.onVisibleElementsChanged.add(addElementSelectorUpdater);
      }
      return undefined;
    });
    if (this.locales.length > 1) {
      this.registerToolbarItem("changeLocale", () => {
        return DocumentHelper.createSelector(
          [localization.getString("changeLocale")]
            .concat(this.locales)
            .map((element) => {
              return {
                value: element,
                text: element,
              };
            }),
          (option: any) => false,
          (e: any) => {
            var newLocale = e.target.value;
            this.locale = newLocale;
          }
        );
      });
    }
  }

  private addElementToLayout(elementName: string) {
    const element = this.getElement(elementName);
    element.visibility = ElementVisibility.Visible;
    const questionElement = this.renderPanelElement(element);
    this.contentContainer.appendChild(questionElement);
    if (!!this.layoutEngine) {
      this.layoutEngine.add([questionElement]);
    }
    this.visibleElementsChanged(element, "ADDED");
  }

  private removeElementFromLayout(elementName: string) {
    const element = this.getElement(elementName);
    element.visibility = ElementVisibility.Invisible;
    if (!!element.renderedElement) {
      if (!!this.layoutEngine) {
        this.layoutEngine.remove([element.renderedElement]);
      }
      this.contentContainer.removeChild(element.renderedElement);
      element.renderedElement = undefined;
    }
    this.visibleElementsChanged(element, "REMOVED");
  }

  private buildVisualizers(questions: Array<Question>) {
    questions.forEach((question) => {
      const visualizer = VisualizerFactory.createVizualizer(
        question,
        this.filteredData,
        this.options
      );

      if (this.allowHideQuestions) {
        visualizer.registerToolbarItem("removeQuestion", () => {
          return DocumentHelper.createButton(() => {
            setTimeout(() => this.removeElementFromLayout(question.name), 0);
          }, localization.getString("hideButton"));
        });
      }

      if (visualizer instanceof SelectBase) {
        var filterInfo = {
          text: <HTMLElement>undefined,
          htmlElement: <HTMLDivElement>undefined,
          update: function (selection: any) {
            if (!!selection && !!selection.value) {
              this.htmlElement.style.display = "inline-block";
              this.text.innerHTML = "Filter: [" + selection.text + "]";
            } else {
              this.htmlElement.style.display = "none";
              this.text.innerHTML = "";
            }
          },
        };

        visualizer.registerToolbarItem("questionFilterInfo", () => {
          filterInfo.htmlElement = <HTMLDivElement>(
            DocumentHelper.createElement("div", "sa-question__filter")
          );
          filterInfo.text = DocumentHelper.createElement(
            "span",
            "sa-question__filter-text"
          );
          filterInfo.htmlElement.appendChild(filterInfo.text);

          const filterClear = DocumentHelper.createButton(() => {
            visualizer.setSelection(undefined);
          }, localization.getString("clearButton"));
          filterInfo.htmlElement.appendChild(filterClear);

          filterInfo.update(visualizer.selection);

          return filterInfo.htmlElement;
        });

        visualizer.onDataItemSelected = (
          selectedValue: any,
          selectedText: string
        ) => {
          filterInfo.update({ value: selectedValue, text: selectedText });
          this.setFilter(question.name, selectedValue);
        };
      }

      visualizer.onUpdate = () => this.layout();
      this.visualizers.push(visualizer);
    });
  }

  private destroyVisualizers() {
    this.visualizers.forEach((visualizer) => {
      visualizer.onUpdate = undefined;
      if (visualizer instanceof SelectBase) {
        visualizer.onDataItemSelected = undefined;
      }
      visualizer.destroy();
    });
    this.visualizers = [];
  }

  /**
   * Returns current locale of the visualization panel.
   * If locales more than one, the language selection dropdown will be added in the toolbar
   * In order to use survey locales the survey instance object should be passed as 'survey' option for visualizer
   */
  public get locale() {
    var survey = this.options.survey;
    if (!!survey) {
      return survey.locale;
    }
    return localization.currentLocale;
  }

  /**
   * Sets locale for visualization panel.
   */
  public set locale(newLocale: string) {
    this.setLocale(newLocale);
    this.refresh();
    this.onStateChanged.fire(this, this.state);
  }

  private setLocale(newLocale: string) {
    var survey = this.options.survey;
    if (!!survey) {
      survey.locale = newLocale;
      (this.questions || []).forEach((question) => {
        const element = this.getElement(question.name);
        if (!!element) {
          element.displayName = question.title;
        }
      });
    }
    localization.currentLocale = newLocale;
  }

  /**
   * Returns name of the visualizer - 'panel' for the VisualizationPanel.
   */
  public get name() {
    return "panel";
  }

  /**
   * Returns whether the VisualizationPanel allows dynamic layouting - rearrange items via drap/drop.
   */
  public get allowDynamicLayout() {
    return (
      this.options.allowDynamicLayout === undefined ||
      this.options.allowDynamicLayout === true
    );
  }

  /**
   * Returns whether the VisualizationPanel allows to hide/show individual inner visualizers.
   */
  public get allowHideQuestions() {
    return (
      this.options.allowHideQuestions === undefined ||
      this.options.allowHideQuestions === true
    );
  }

  private getLayoutEngine: () => any;
  /**
   * Returns the layout engine instance if any.
   */
  public get layoutEngine() {
    return !!this.getLayoutEngine && this.getLayoutEngine();
  }

  protected buildElements(questions: any[]): IVisualizerPanelElement[] {
    return (questions || []).map((question) => {
      return {
        name: question.name,
        displayName: question.title,
        visibility: ElementVisibility.Visible,
        type: undefined,
      };
    });
  }

  /**
   * Returns panel elements descriptions array.
   * Inner visualizers are rendered in the order of this array and with titles from the displayName property
   */
  public getElements(): IVisualizerPanelElement[] {
    return (this._elements || []).map((element) => {
      return {
        name: element.name,
        displayName: element.displayName,
        visibility: element.visibility,
        type: element.type,
      };
    });
  }

  /**
   * Checks whether certain element is visible.
   */
  public isVisible(visibility: ElementVisibility) {
    return (
      (this.isTrustedAccess && visibility !== ElementVisibility.Invisible) ||
      (!this.isTrustedAccess && visibility === ElementVisibility.Visible)
    );
  }

  protected get visibleElements() {
    return this._elements.filter((el) => this.isVisible(el.visibility));
  }

  protected get hiddenElements() {
    return this._elements.filter((el) => !this.isVisible(el.visibility));
  }

  protected get locales() {
    if (this.options.survey) return this.options.survey.getUsedLocales();
    return [];
  }

  /**
   * Returns panel element description by the question name.
   */
  public getElement(name: string) {
    return this._elements.filter((el) => el.name === name)[0];
  }

  /**
   * Returns panel element visualizer by the question name.
   */
  getVisualizer(dataName: string) {
    return this.visualizers.filter((v) => v.dataName === dataName)[0];
  }

  /**
   * Fires when element visibility has been changed.
   * options:
   * elements - panel elements array
   * changed - changed element
   * reason - reason (string) why event fired: "ADDED", "MOVED" or "REMOVED"
   */
  public onVisibleElementsChanged = new Event<
    (sender: VisualizationPanel, options: any) => any,
    any
  >();

  protected visibleElementsChanged(
    element: IVisualizerPanelElement,
    reason: string
  ) {
    if (!this.onVisibleElementsChanged.isEmpty) {
      this.onVisibleElementsChanged.fire(this, {
        elements: this._elements,
        changed: element,
        reason: reason,
      });
    }
    this.onStateChanged.fire(this, this.state);
    this.layout();
  }

  /**
   * Fires when vizualization panel state changed.
   * sender - this panel
   * state - new state of the panel
   */
  public onStateChanged = new Event<
    (sender: VisualizationPanel, options: any) => any,
    any
  >();

  /**
   * Renders given panel element.
   */
  protected renderPanelElement(element: IVisualizerPanelRenderedElement) {
    const visualizer = this.getVisualizer(element.name);

    const questionElement = DocumentHelper.createElement("div");
    const questionContent = DocumentHelper.createElement("div");
    const titleElement = DocumentHelper.createElement("h3");
    const vizualizerElement = DocumentHelper.createElement("div");

    titleElement.innerText = element.displayName;

    questionElement.className = this.allowDynamicLayout
      ? questionElementClassName + " " + questionLayoutedElementClassName
      : questionElementClassName;
    titleElement.className = questionElementClassName + "__title";
    questionContent.className = questionElementClassName + "__content";

    questionContent.appendChild(titleElement);
    questionContent.appendChild(vizualizerElement);
    questionElement.appendChild(questionContent);

    visualizer.render(vizualizerElement);

    element.renderedElement = questionElement;
    return questionElement;
  }

  protected renderToolbar(container: HTMLElement) {
    container.className += " sa-panel__header";
    super.renderToolbar(container);
  }

  /**
   * Renders all questions into given HTML container element.
   * container - HTML element to render the panel
   */
  public renderContent(container: HTMLElement) {
    let layoutEngine: any = undefined;
    this.getLayoutEngine = () => layoutEngine;

    container.className += " sa-panel__content sa-grid";

    this.visibleElements.forEach((element) => {
      let questionElement = this.renderPanelElement(element);
      container.appendChild(questionElement);
    });

    if (this.allowDynamicLayout) {
      layoutEngine = new Muuri(container, {
        items: "." + questionLayoutedElementClassName,
        dragEnabled: true,
      });
      layoutEngine.on("move", (data: any) =>
        this.moveElement(data.fromIndex, data.toIndex)
      );
    }
    !!window && window.dispatchEvent(new UIEvent("resize"));
  }

  protected moveElement(fromIndex: number, toIndex: number) {
    var elements = this._elements.splice(fromIndex, 1);
    this._elements.splice(toIndex, 0, elements[0]);
    this.visibleElementsChanged(elements[0], "MOVED");
  }

  /**
   * Destroys visualizer and all inner content.
   */
  protected destroyContent(container: HTMLElement) {
    let layoutEngine = this.layoutEngine;
    if (!!layoutEngine) {
      layoutEngine.off("move");
      layoutEngine.destroy();
      this.getLayoutEngine = undefined;
    }
    super.destroyContent(container);
  }

  /**
   * Updates visualizer data.
   */
  updateData(data: Array<{ [index: string]: any }>) {
    super.updateData(data);
    this.applyFilter();
  }

  /**
   * Redraws visualizer and all inner content.
   */
  public refresh() {
    if (!!this.toolbarContainer) {
      this.destroyToolbar(this.toolbarContainer);
      this.renderToolbar(this.toolbarContainer);
    }
    super.refresh();
  }

  /**
   * Updates layout of visualizer inner content.
   */
  public layout() {
    const layoutEngine = this.layoutEngine;
    if (!!layoutEngine) {
      layoutEngine.refreshItems();
      layoutEngine.layout();
    }
  }

  /**
   * Sets filter by question name and value.
   */
  public setFilter(questionName: string, selectedValue: any) {
    var filterChanged = true;
    if (selectedValue !== undefined) {
      filterChanged = this.filterValues[questionName] !== selectedValue;
      this.filterValues[questionName] = selectedValue;
    } else {
      filterChanged = this.filterValues[questionName] !== undefined;
      delete this.filterValues[questionName];
    }
    if (filterChanged) {
      this.applyFilter();
    }
  }

  /**
   * Applies filter to the data and update visualizers.
   */
  public applyFilter() {
    this.filteredData = this.data.filter((item) => {
      return !Object.keys(this.filterValues).some(
        (key) => item[key] !== this.filterValues[key]
      );
    });
    this.visualizers.forEach((visualizer) =>
      visualizer.updateData(this.filteredData)
    );
  }

  /**
   * Gets vizualization panel state.
   */
  public get state(): IState {
    return {
      locale: this.locale,
      elements: [].concat(this._elements),
    };
  }
  /**
   * Sets vizualization panel state.
   */
  public set state(newState: IState) {
    this._elements = [].concat(newState.elements || []);
    this.setLocale(newState.locale);
    this.refresh();
  }

  destroy() {
    super.destroy();
    this.destroyVisualizers();
  }
}
