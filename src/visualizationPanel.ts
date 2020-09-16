import { Event, Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { SelectBase, IVisualizerWithSelection } from "./selectBase";
import { DocumentHelper, createCommercialLicenseLink } from "./utils/index";
import { localization } from "./localizationManager";
import { IVisualizerPanelElement, IState, IPermission } from "./config";
import { FilterInfo } from "./filterInfo";
import { LayoutEngine, MuuriLayoutEngine } from "./layoutEngine";

import "./visualizationPanel.scss";

const questionElementClassName = "sa-question";
const questionLayoutedElementClassName = "sa-question-layouted";

if (!!document) {
  const svgTemplate = require("html-loader?interpolate!val-loader!./svgbundle.html");
  const templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.appendChild(templateHolder);
}

export interface IVisualizerPanelRenderedElement
  extends IVisualizerPanelElement {
  renderedElement?: HTMLElement;
}

/**
 * VisualizationPanel is responsible for visualizing an array of survey questions
 *
 * constructor parameters:
 * questions - an array of survey questions to visualize,
 * data - an array of answers in format of survey result,
 * options - object with the following options,
 * elements - list of visual element descriptions
 *
 * options:
 * allowDynamicLayout - set it to false to disable items drag/drop reordering and dynamic layouting,
 * labelTruncateLength - the length of the label where the truncation starts. Set to -1 to disable truncate. Default is 27.
 * allowHideQuestions - set it to false to deny user to hide/show individual questions,
 * allowMakeQuestionsPrivate - set it to true to allow make elements private/public also see persmissions property,
 * seriesValues - an array of series values in data to group data by series,
 * seriesLabels - labels for series to display, if not passed the seriesValues are used as labels,
 * survey - pass survey instance to use localses from the survey JSON,
 * dataProvider - dataProvider for this visualizer,
 * layoutEngine - layout engine to be used for layouting inner visualizers
 *
 */
export class VisualizationPanel extends VisualizerBase {
  protected visualizers: Array<VisualizerBase> = [];
  private haveCommercialLicense: boolean = false;
  private renderedQuestionsCount: number = 0;
  constructor(
    protected questions: Array<any>,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {},
    private _elements: Array<IVisualizerPanelRenderedElement> = undefined
  ) {
    super(null, data, options, "panel");

    this._layoutEngine =
      options.layoutEngine ||
      new MuuriLayoutEngine(
        this.allowDynamicLayout,
        "." + questionLayoutedElementClassName
      );
    this._layoutEngine.onMoveCallback = (fromIndex: number, toIndex: number) =>
      this.moveVisibleElement(fromIndex, toIndex);

    this.showHeader = true;
    if (this.options.survey) {
      localization.currentLocale = this.options.survey.locale;
    }

    if (_elements === undefined) {
      this._elements = this.buildElements(questions);
    }

    this.haveCommercialLicense =
      typeof options.haveCommercialLicense !== "undefined"
        ? options.haveCommercialLicense
        : false;

    this.buildVisualizers(questions);
    if (!this.haveCommercialLicense) {
      this.registerToolbarItem("commercialLicense", () => {
        return createCommercialLicenseLink();
      });
    }

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
                this.showElement(e.target.value);
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

  private onAfterRenderQuestionCallback = (
    sender: VisualizerBase,
    options: any
  ) => {
    this.renderedQuestionsCount++;
    if (this.renderedQuestionsCount == this.questions.length) {
      this.renderedQuestionsCount = 0;
      this.afterRender(this.contentContainer);
    }
  };

  protected showElement(elementName: string) {
    const element = this.getElement(elementName);
    const elementIndex = this._elements.indexOf(element);
    element.isVisible = true;
    const questionElement = this.renderPanelElement(
      element,
      this.contentContainer
    );
    this.layoutEngine.add([questionElement], { index: elementIndex });
    this.visibleElementsChanged(element, "ADDED");
  }

  protected hideElement(elementName: string) {
    const element = this.getElement(elementName);
    element.isVisible = false;
    if (!!element.renderedElement) {
      this.layoutEngine.remove([element.renderedElement]);
      this.contentContainer.removeChild(element.renderedElement);
      element.renderedElement = undefined;
    }
    this.visibleElementsChanged(element, "REMOVED");
  }

  protected makeElementPrivate(element: IVisualizerPanelElement) {
    element.isPublic = false;
    this.onStateChanged.fire(this, this.state);
    this.onPermissionsChangedCallback &&
      this.onPermissionsChangedCallback(this);
  }

  protected makeElementPublic(element: IVisualizerPanelElement) {
    element.isPublic = true;
    this.onStateChanged.fire(this, this.state);
    this.onPermissionsChangedCallback &&
      this.onPermissionsChangedCallback(this);
  }

  protected moveVisibleElement(
    fromVisibleIndex: number,
    toVisibleIndex: number
  ) {
    let fromIndex, toIndex;

    let fromVisibleIndexElement = this.visibleElements[fromVisibleIndex];
    let toVisibleIndexElement = this.visibleElements[toVisibleIndex];

    fromIndex = this._elements.indexOf(fromVisibleIndexElement);
    toIndex = this._elements.indexOf(toVisibleIndexElement);

    this.moveElement(fromIndex, toIndex);
  }

  protected moveElement(fromIndex: number, toIndex: number) {
    var elements = this._elements.splice(fromIndex, 1);
    this._elements.splice(toIndex, 0, elements[0]);
    this.visibleElementsChanged(elements[0], "MOVED");
  }

  private buildVisualizers(questions: Array<Question>) {
    questions.forEach((question) => {
      const visualizer = this.createVisualizer(question);

      if (this.allowHideQuestions) {
        visualizer.registerToolbarItem("removeQuestion", () => {
          return DocumentHelper.createButton(() => {
            setTimeout(() => this.hideElement(question.name), 0);
          }, localization.getString("hideButton"));
        });
      }

      if (this.allowMakeQuestionsPrivate) {
        visualizer.registerToolbarItem("makePrivatePublic", () => {
          const element = this.getElement(question.name);

          const state = element.isPublic ? "first" : "second";

          const pathMakePrivateSvg = "makeprivate";
          const pathMakePublicSvg = "makepublic";
          const makePrivateTitle = localization.getString("makePrivateButton");
          const makePublicTitle = localization.getString("makePublicButton");
          const doPrivate = (e: any) => {
            setTimeout(() => this.makeElementPrivate(element), 0);
          };
          const doPublic = (e: any) => {
            setTimeout(() => this.makeElementPublic(element), 0);
          };

          return DocumentHelper.createSvgToggleButton(
            pathMakePublicSvg,
            pathMakePrivateSvg,
            makePrivateTitle,
            makePublicTitle,
            doPublic,
            doPrivate,
            state
          );
        });
      }

      if (visualizer.supportSelection) {
        const visualizerWithSelection = <IVisualizerWithSelection>(
          (<any>visualizer)
        );
        let filterInfo = new FilterInfo(visualizerWithSelection);

        visualizer.registerToolbarItem("questionFilterInfo", () => {
          filterInfo.update(visualizerWithSelection.selection);
          return filterInfo.htmlElement;
        });

        visualizerWithSelection.onDataItemSelected = (
          selectedValue: any,
          selectedText: string
        ) => {
          filterInfo.update({ value: selectedValue, text: selectedText });
          this.setFilter(question.name, selectedValue);
        };
      }

      visualizer.onUpdate = () => this.layout();
      visualizer.onAfterRender.add(this.onAfterRenderQuestionCallback);
      this.visualizers.push(visualizer);
    });
  }

  private destroyVisualizers() {
    this.visualizers.forEach((visualizer) => {
      visualizer.onUpdate = undefined;
      if (visualizer instanceof SelectBase) {
        visualizer.onDataItemSelected = undefined;
      }
      visualizer.onAfterRender.remove(this.onAfterRenderQuestionCallback);
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
   * Returns whether the VisualizationPanel allows dynamic layouting - rearrange items via drap/drop. Set via options.
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

  /**
   * Returns whether the VisualizationPanel allows to make private/public individual inner visualizers for work with permissions.
   */
  public get allowMakeQuestionsPrivate() {
    return this.options.allowMakeQuestionsPrivate === true;
  }

  private _layoutEngine: LayoutEngine;
  /**
   * Returns the layout engine instance if any.
   */
  public get layoutEngine() {
    return this._layoutEngine;
  }

  protected buildElements(questions: any[]): IVisualizerPanelElement[] {
    return (questions || []).map((question) => {
      return {
        name: question.name,
        displayName: question.title,
        isVisible: true,
        isPublic: true,
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
        isVisible: element.isVisible,
        isPublic: element.isPublic,
        type: element.type,
      };
    });
  }

  /**
   * Returns panel's visible elements.
   */
  public get visibleElements() {
    return this._elements.filter((el: IVisualizerPanelElement) => el.isVisible);
  }

  /**
   * Returns panel's hidden elements.
   */
  public get hiddenElements() {
    return this._elements.filter(
      (el: IVisualizerPanelElement) => !el.isVisible
    );
  }

  /**
   * Returns panel's public elements.
   */
  public get publicElements() {
    return this._elements.filter((el: IVisualizerPanelElement) => el.isPublic);
  }

  /**
   * Returns panel's private elements.
   */
  public get privateElements() {
    return this._elements.filter((el: IVisualizerPanelElement) => !el.isPublic);
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
    (sender: VisualizationPanel, state: IState) => any,
    any
  >();

  /**
   * Fires when permissions changed
   */
  public onPermissionsChangedCallback: any;

  /**
   * Renders given panel element.
   */
  protected renderPanelElement(
    element: IVisualizerPanelRenderedElement,
    container: HTMLElement
  ) {
    const visualizer = this.getVisualizer(element.name);

    const questionElement = DocumentHelper.createElement("div");

    container.appendChild(questionElement);

    const questionContent = DocumentHelper.createElement("div");
    const titleElement = DocumentHelper.createElement("h3");
    const vizualizerElement = DocumentHelper.createElement("div");

    titleElement.innerText = element.displayName;

    questionElement.className = this.allowDynamicLayout
      ? questionElementClassName + " " + questionLayoutedElementClassName
      : questionElementClassName;
    titleElement.className = questionElementClassName + "__title";
    if (this.allowDynamicLayout) {
      titleElement.className =
        titleElement.className +
        " " +
        questionElementClassName +
        "__title--draggable";
    }
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
    container.className += " sa-panel__content sa-grid";

    this.visibleElements.forEach((element) => {
      let questionElement = this.renderPanelElement(element, container);
    });

    this.layoutEngine.start(container);
    // !!window && window.dispatchEvent(new UIEvent("resize"));
  }

  /**
   * Destroys visualizer and all inner content.
   */
  protected destroyContent(container: HTMLElement) {
    this.layoutEngine.stop();
    super.destroyContent(container);
  }

  /**
   * Method for clearing all rendered elements from outside.
   */
  public clear() {
    if (!!this.toolbarContainer) {
      this.destroyToolbar(this.toolbarContainer);
    }
    if (!!this.contentContainer) {
      this.destroyContent(this.contentContainer);
    }
    if (!!this.footerContainer) {
      this.destroyFooter(this.footerContainer);
    }
  }

  /**
   * Redraws visualizer toobar and all inner content.
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
    this.layoutEngine.update();
  }

  /**
   * Sets filter by question name and value.
   */
  public setFilter(questionName: string, selectedValue: any) {
    this.dataProvider.setFilter(questionName, selectedValue);
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
    if (!newState) return;

    if (typeof newState.elements !== "undefined")
      this._elements = [].concat(newState.elements);

    if (typeof newState.locale !== "undefined") this.setLocale(newState.locale);

    this.refresh();
  }

  /**
   * Gets vizualization panel permissions.
   */
  public get permissions(): IPermission[] {
    return <any>this._elements.map((element) => {
      return {
        name: element.name,
        isPublic: element.isPublic,
      };
    });
  }
  /**
   * Sets vizualization panel permissions.
   */
  public set permissions(permissions: IPermission[]) {
    const updatedElements = this._elements.map((element) => {
      permissions.forEach((permission) => {
        if (permission.name === element.name)
          element.isPublic = permission.isPublic;
      });

      return { ...element };
    });
    this._elements = [].concat(updatedElements);
    this.refresh();
    this.onPermissionsChangedCallback &&
      this.onPermissionsChangedCallback(this);
  }

  destroy() {
    super.destroy();
    this.destroyVisualizers();
  }
}
