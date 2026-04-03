import { Event, Question, SurveyModel, surveyLocalization } from "survey-core";
import { IsTouch } from "survey-core";
import { ICalculationResult, VisualizerBase } from "./visualizerBase";
import { SelectBase, IVisualizerWithSelection, ISelectBaseVisualizerOptions } from "./selectBase";
import { AlternativeVisualizersWrapper } from "./alternativeVizualizersWrapper";
import { createCommercialLicenseLink } from "./utils/index";
import { localization } from "./localizationManager";
import { IVisualizerPanelElement, IState, IPermission } from "./config";
import { FilterInfo } from "./filterInfo";
import { LayoutEngine } from "./layout-engine";
import { DataProvider } from "./dataProvider";
import { svgTemplate } from "./svgbundle";
import { VisualizationManager } from "./visualizationManager";
import { ElementVisibilityAction } from "./utils/elementVisibilityAction";
import { IDropdownItemOption } from "./utils/dropdownBase";
import { DocumentHelper } from "./utils/documentHelper";
import { createActionDropdown } from "./utils/dropdownActionWidget";
import { createDropdown } from "./utils/dropdownWidget";

import "./visualizationPanel.scss";

const questionElementClassName = "sa-question";
const questionLayoutedElementClassName = "sa-question-layouted";

if(!!document) {
  const templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.appendChild(templateHolder);
}

export interface IVisualizerPanelRenderedElement
  extends IVisualizerPanelElement {
  visualizerInstance?: VisualizerBase;
  renderedElement?: HTMLElement;
}

export class PanelElement implements IVisualizerPanelRenderedElement {
  protected getStateProperties(): string[] {
    return ["displayName", "isVisible", "isPublic"];
  }
  setState(elementState: any) {
    for(let key of this.getStateProperties()) {
      if(elementState[key] !== undefined) {
        this[key] = elementState[key];
      }
    }
    if(this.visualizerInstance) {
      this.visualizerInstance.setState(elementState);
    }
  }
  getState() {
    const state: any = {
      name: this.name,
      ...this.visualizerInstance?.getState()
    };
    for(let key of this.getStateProperties()) {
      if(this[key] !== undefined) {
        state[key] = this[key];
      }
    }
    return state;
  }
  constructor(name: string, displayName?: string) {
    this.name = name;
    this.displayName = displayName;
    this.isVisible = true;
    this.isPublic = true;
  }
  /**
   * A unique identifier for the dashboard item.
   *
   * If the [`questions`](https://surveyjs.io/dashboard/documentation/api-reference/idashboardoptions#questions) array is specified when initializing the Dashboard, item names are generated automatically based on the associated question names.
   */
  name: string;
  displayName: string;
  isVisible: boolean;
  isPublic: boolean;
  visualizerInstance?: VisualizerBase;
  renderedElement?: HTMLElement;
  question?: Question;
  questions?: Question[];
}

/**
 * Obsolete. Use the [`IDashboardOptions`](https://surveyjs.io/dashboard/documentation/api-reference/idashboardoptions) configuration object and the [`Dashboard`](https://surveyjs.io/dashboard/documentation/api-reference/dashboard) class instead.
 */
export interface IVisualizationPanelOptions extends ISelectBaseVisualizerOptions {
  // An object named after a question that it configures.
  // questionName: {
  //   intervals: []
  // },

  /**
   * Maximum label length before truncation starts. Set to `-1` to disable truncation.
   *
   * Default value: `27`
   */
  labelTruncateLength?: number;
  allowMakeQuestionsPrivate?: boolean;
  seriesValues?: string[];
  seriesLabels?: string[];
  useValuesAsLabels?: boolean;
  /**
   * A survey instance used to apply survey localization settings to the Dashboard UI.
   *
   * [View Demo](https://surveyjs.io/dashboard/examples/localize-survey-data-dashboard-ui/ (linkStyle))
   */
  survey?: SurveyModel;
  dataProvider?: DataProvider;
  /**
   * Enables users to hide individual dashboard items. Adds a **Hide** button to each item.
   *
   * Default value: `true`
   */
  allowHideQuestions?: boolean;
  /**
   * Enables automatic layout based on available screen space and allows users to reorder items via drag and drop.
   *
   * If disabled, items are rendered sequentially (one below another), and drag-and-drop reordering is disabled. To disable only drag-and-drop while keeping dynamic layout, set [`allowDragDrop`](#allowDragDrop) to `false`.
   *
   * Default value: `true`
   *
   * [How to Disable the Layout Engine](https://github.com/surveyjs/surveyjs-howtos-and-troubleshooting/blob/50a2f6f755193afb4733435e2942f80c98731e84/categories/data-visualization/custom-layout.md (linkStyle))
   * @see layoutEngine
   */
  allowDynamicLayout?: boolean;
  /**
   * Enables drag-and-drop reordering of dashboard items. Applies only if [`allowDynamicLayout`](#allowDynamicLayout) is `true`.
   *
   * Default value: `true`
   * @see layoutEngine
   */
  allowDragDrop?: boolean;
  /**
   * A layout engine implementation used to arrange dashboard items. Use this property to integrate a third-party layout engine.
   * @see allowDynamicLayout
   */
  layoutEngine?: LayoutEngine;
  haveCommercialLicense?: boolean;
  allowExperimentalFeatures?: boolean;
  defaultChartType?: string;
  /**
   * Enables cross-filtering between dashboard items. When enabled, selecting a data point filters other dashboard items accordingly.
   *
   * Default value: `true`
   */
  allowSelection?: boolean;

  renderContent?: Function;
  destroyContent?: Function;
  /**
   * Removes HTML markup from survey element titles before rendering.
   *
   * Since survey titles may contain user-defined HTML, keeping this property enabled helps prevent potential injection of malicious code.
   *
   * Default value: `true`
   */
  stripHtmlFromTitles?: boolean;
  /**
   * Enables switching between different visualizer types.
   *
   * Default value: `true`
   */
  allowChangeVisualizerType?: boolean;
  /**
   * Specifies whether to display the toolbar.
   *
   * Default value: `true`
   */
  showToolbar?: boolean;
}

/**
 * Obsolete. Use the [`Dashboard`](/dashboard/documentation/api-reference/dashboard) class instead.
 * @deprecated
 */
export class VisualizationPanel<P extends PanelElement = PanelElement> extends VisualizerBase {
  public static LayoutEngine: new (allowed: boolean, itemSelector: string, dragEnabled?: boolean) => LayoutEngine;
  private _renderedQuestionsCount: number = 0;
  private _resetFilterButton: HTMLElement;
  protected _elements: Array<P> = undefined;

  private updateResetFilterButtonDisabled() {
    if(this._resetFilterButton) {
      const buttonDisabledClass = "sa-toolbar__button--disabled";
      if(this.dataProvider.getFilters().length == 0) {
        this._resetFilterButton.classList.add(buttonDisabledClass);
      } else {
        this._resetFilterButton.classList.remove(buttonDisabledClass);
      }
    }
  }

  constructor(
    protected questions: Array<any>,
    data: Array<{ [index: string]: any }>,
    options: IVisualizationPanelOptions = {},
    elements: Array<IVisualizerPanelElement> = undefined,
    private _isRoot = true,
    type?: string
  ) {
    super(null, data, options, type || "panel");
    this.loadingData = false;
    this.showToolbar = options.showToolbar !== undefined ? options.showToolbar : _isRoot;
    if(this.options.survey) {
      localization.currentLocale = this.options.survey.locale;
    }

    this._elements = this.buildElements(questions, elements);
    this._elements.forEach((element) => {
      this.buildVisualizer(element, questions);
    });

    this._layoutEngine =
        options.layoutEngine ||
        VisualizationPanel.LayoutEngine && new VisualizationPanel.LayoutEngine(
          this.allowDynamicLayout && this.haveSeveralChildren,
          "." + questionLayoutedElementClassName,
          this.allowDragDrop
        );
    if(!!this._layoutEngine) {
      this._layoutEngine.onMoveCallback = (order: Array<string>) => this.reorderVisibleElements(order);
    }

    this.registerToolbarItem("addElement", (toolbar: HTMLDivElement) => {
      if(this.allowHideQuestions) {
        const visibilityAction = new ElementVisibilityAction(this);
        const selectWrapper = createActionDropdown({
          options: () => visibilityAction.getOptions(),
          isSelected: (option: IDropdownItemOption) => visibilityAction.isSelected(option),
          updateOption: (option: IDropdownItemOption) => visibilityAction.updateOption(option),
          handler: (value: string) => visibilityAction.handleSelect(value),
          title: localization.getString("allQuestions")
        });
        return selectWrapper;
      }
      return undefined;
    }, "dropdown");

    this._supportSelection = true;
    if(this.supportSelection !== false) {
      this.registerToolbarItem("resetFilter", () => {
        this._resetFilterButton = DocumentHelper.createButton(() => {
          this.resetFilter();
        }, localization.getString("resetFilter"));
        this.updateResetFilterButtonDisabled();
        return this._resetFilterButton;
      }, "button", 900);
    }

    if(!this.options.disableLocaleSwitch && this.locales.length > 1) {
      const localeChoices = this.locales.map((element) => {
        return {
          value: element,
          text: localization.getLocaleName(element)
        };
      });
      this.registerToolbarItem("changeLocale", () => {
        return createDropdown({
          options: localeChoices,
          isSelected: (option: any) => !!option.value && (this.locale || surveyLocalization.defaultLocale) === option.value,
          handler: (e: any) => {
            var newLocale = e;
            this.locale = newLocale;
          }
        });
      }, "dropdown");
    }
  }

  public get visualizers(): Array<VisualizerBase> {
    return this._elements.map(el => el.visualizerInstance).filter(v => !!v);
  }

  public resetFilter(): void {
    this.dataProvider?.resetFilter();
    this.visualizers.forEach((visualizer) => {
      if(visualizer instanceof SelectBase || visualizer instanceof AlternativeVisualizersWrapper) {
        visualizer.setSelection(undefined);
      }
      visualizer.resetContentFilter();
    });
    this.updateResetFilterButtonDisabled();
  }

  reorderVisibleElements(order: string[]): void {
    const newElements = [];
    order.forEach(name => {
      newElements.push(this._elements.filter(el => el.name === name)[0]);
    });
    this._elements.forEach(el => {
      if(order.indexOf(el.name) == -1) {
        newElements.push(el);
      }
    });
    this._elements = newElements;
    this.visibleElementsChanged(undefined, "REORDERED");
  }

  private onAfterRenderQuestionCallback = (
    sender: VisualizerBase,
    options: any
  ) => {
    this._renderedQuestionsCount++;
    if(this._renderedQuestionsCount == this.visibleElements.length) {
      this._renderedQuestionsCount = 0;
      this.layoutEngine?.update();
      this.afterRender(this.contentContainer);
    }
  };

  private onStateChangedCallback = (
    sender: VisualizerBase,
    options: any
  ) => {
    this.stateChanged(sender.question?.name, options);
  };

  public onAlternativeVisualizerChanged: Event<
    (sender: AlternativeVisualizersWrapper, options: any) => any,
    AlternativeVisualizersWrapper,
    any
  > = new Event<(sender: AlternativeVisualizersWrapper, options: any) => any, AlternativeVisualizersWrapper, any>();

  private onAlternativeVisualizerChangedCallback = (
    sender: AlternativeVisualizersWrapper,
    options: { visualizer: VisualizerBase }
  ) => {
    this.onAlternativeVisualizerChanged.fire(sender, options);
  };

  private createHideButtonElement(element: IVisualizerPanelRenderedElement) {
    const hideElement = document.createElement("div");
    hideElement.className = "sa-question__hide-action";
    hideElement.title = localization.getString("hideButton");
    hideElement.setAttribute("role", "button");
    hideElement.setAttribute("tabindex", "0");
    hideElement.appendChild(DocumentHelper.createSvgElement("close-16x16"));
    hideElement.addEventListener("click", (e) => {
      setTimeout(() => this.hideElement(element.name), 0);
    });
    hideElement.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.hideElement(element.name);
      }
    });
    return hideElement;
  }
  private createDragAreaElement(element: IVisualizerPanelRenderedElement) {
    const dragAreaElement = DocumentHelper.createElement("div");
    dragAreaElement.className = "sa-question__drag-area";
    if(this.allowDynamicLayout && this.allowDragDrop) {
      dragAreaElement.classList.add("sa-question__header--draggable");

      const svgElement = document.createElement("div");
      svgElement.className = "sa-question__drag-area-icon";
      svgElement.appendChild(DocumentHelper.createSvgElement("draghorizontal-24x16"));
      dragAreaElement.appendChild(svgElement);
    }

    return dragAreaElement;
  }

  private createHeaderElement(element: IVisualizerPanelRenderedElement) {
    const headerElement = DocumentHelper.createElement("div");
    headerElement.className = "sa-question__header";

    const hideElement = this.allowHideQuestions ? this.createHideButtonElement(element) : undefined;
    if(this.haveSeveralChildren && this.allowDynamicLayout && this.allowDragDrop) {
      const dragAreaElement = this.createDragAreaElement(element);
      headerElement.appendChild(dragAreaElement);
      headerElement.classList.add("sa-question__header--allow-drag");
      if(hideElement) {
        dragAreaElement.appendChild(hideElement);
      }
    } else if(this.haveSeveralChildren && hideElement) {
      headerElement.appendChild(hideElement);
    }

    if(element.displayName) {
      const titleElement = DocumentHelper.createElement("h3");
      titleElement.innerText = element.displayName;
      titleElement.id = "el_" + element.name;
      titleElement.className = questionElementClassName + "__title";
      if(this.allowDynamicLayout && this.allowDragDrop) {
        titleElement.classList.add(questionElementClassName + "__title--draggable");
      }
      headerElement.appendChild(titleElement);
    }
    return headerElement;
  }

  protected onDataChanged(): void {
    // Do nothing.
  }

  protected showElementCore(element: IVisualizerPanelRenderedElement, elementIndex = -1): void {
    element.isVisible = true;
    const questionElement = this.renderPanelElement(
      element,
      this.contentContainer
    );
    let options = undefined;
    if(elementIndex >= 0) {
      options = { index: elementIndex };
    }
    this.layoutEngine?.add([questionElement], options);
  }

  public showElement(elementName: string) {
    const element = this.getElement(elementName);
    const elementIndex = this._elements.indexOf(element);
    this.showElementCore(element, elementIndex);
    this.visibleElementsChanged(element, "ADDED");
  }

  protected hideElementCore(element: IVisualizerPanelRenderedElement) {
    element.isVisible = false;
    if(!!element.renderedElement) {
      this.layoutEngine?.remove([element.renderedElement]);
      this.contentContainer.removeChild(element.renderedElement);
      element.renderedElement = undefined;
    }
  }

  public hideElement(elementName: string) {
    const element = this.getElement(elementName);
    this.hideElementCore(element);
    const visualizer = element.visualizerInstance;
    if(!!visualizer && !!visualizer.getChartAdapter()) {
      visualizer.getChartAdapter().destroy(element.renderedElement);
    }
    this.visibleElementsChanged(element, "REMOVED");
  }

  public hideAllElements(): void {
    const affectedElements = [];
    this._elements.forEach(element => {
      if(element.isVisible) {
        this.hideElementCore(element);
        affectedElements.push(element);
      }
    });
    this.visibleElementsChanged(undefined, "REMOVEDALL");
  }

  public showAllElements() {
    const affectedElements = [];
    this._elements.forEach(element => {
      if(!element.isVisible) {
        this.showElementCore(element);
        affectedElements.push(element);
      }
    });
    this.visibleElementsChanged(undefined, "ADDEDDALL");
  }

  public addElement(element: IVisualizerPanelElement | P, index?: number): void {
    let panelElement: P;
    if(element instanceof PanelElement) {
      panelElement = element as P;
    } else {
      const question = (this.questions || []).find((q: any) => q.name === (element as IVisualizerPanelElement).name);
      panelElement = this.createElement(element as IVisualizerPanelElement, question);
      panelElement.setState(element);
    }

    if(!panelElement.visualizerInstance) {
      this.buildVisualizer(panelElement, this.questions);
    }

    const insertIndex = (index !== undefined && index >= 0 && index < this._elements.length)
      ? index
      : this._elements.length;

    this._elements.splice(insertIndex, 0, panelElement);

    if(panelElement.isVisible && !!this.contentContainer) {
      this.showElementCore(panelElement, insertIndex);
    }

    this.visibleElementsChanged(panelElement, "ADDED");
  }

  public removeElement(element: P | string): void {
    const panelElement = typeof element === "string" ? this.getElement(element) : element;
    if(!panelElement) return;

    if(!!panelElement.renderedElement) {
      this.layoutEngine?.remove([panelElement.renderedElement]);
      if(!!this.contentContainer) {
        this.contentContainer.removeChild(panelElement.renderedElement);
      }
    }

    this.destroyElementVisualizer(panelElement);

    const elementIndex = this._elements.indexOf(panelElement);
    if(elementIndex >= 0) {
      this._elements.splice(elementIndex, 1);
      this.visibleElementsChanged(panelElement, "REMOVED");
    }
  }

  protected makeElementPrivate(element: IVisualizerPanelElement) {
    element.isPublic = false;
    this.stateChanged("isPublic", false);
    this.onPermissionsChangedCallback &&
      this.onPermissionsChangedCallback(this);
  }

  protected makeElementPublic(element: IVisualizerPanelElement) {
    element.isPublic = true;
    this.stateChanged("isPublic", true);
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

  protected setBackgroundColorCore(color: string) {
    super.setBackgroundColorCore(color);
    this.visualizers.forEach(visualizer => visualizer.backgroundColor = color);
  }

  protected setupVisualizer(visualizer: VisualizerBase, question: Question) {
    if(this.allowMakeQuestionsPrivate) {
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
      }, "button");
    }

    if(visualizer.supportSelection) {
      const visualizerWithSelection = <IVisualizerWithSelection>(
          (<any>visualizer)
        );
      visualizerWithSelection.onDataItemSelected = (
        selectedValue: any,
        selectedText: string
      ) => {
        // visualizer.dataNames[0] ?
        const dataName = question.valueName || question.name
          || question.question?.valueName || question.question?.name
          || question.dataField || question.questionName;
        this.setFilter(dataName, selectedValue);
      };
    }

    visualizer.onUpdate = () => this.layout();
    visualizer.onAfterRender.add(this.onAfterRenderQuestionCallback);
    visualizer.onStateChanged.add(this.onStateChangedCallback);

    if(visualizer instanceof AlternativeVisualizersWrapper) {
      visualizer.onVisualizerChanged.add(this.onAlternativeVisualizerChangedCallback);
    }
  }

  protected buildVisualizer(element: P, questions: Array<Question>) {
    const visualizerOptions = Object.assign({}, this.options);
    if(visualizerOptions.dataProvider === undefined) {
      visualizerOptions.dataProvider = this.dataProvider;
    }
    let question = element.question || questions.filter((q: any) => q.name === element.name || q.question && q.question.name === element.name)[0];
    let visualizer: VisualizerBase;
    if(element.questions && element.questions.length > 0) {
      visualizer = new (VisualizationManager.getPivotVisualizerConstructor() as any)(element.questions, [], visualizerOptions, false);
      this.setupVisualizer(visualizer, element.questions[0]);
    } else if(!!question) {
      visualizer = this.createVisualizer(question, visualizerOptions, []);
      this.setupVisualizer(visualizer, question);
    }
    if(!visualizer) {
      return;
    }
    element.visualizerInstance = visualizer;
  }

  private destroyElementVisualizer(element: P) {
    const visualizer = element.visualizerInstance;
    if(!visualizer) {
      return;
    }
    visualizer.onUpdate = undefined;
    if(visualizer instanceof SelectBase) {
      visualizer.onDataItemSelected = undefined;
    }
    if(visualizer instanceof AlternativeVisualizersWrapper) {
      visualizer.onVisualizerChanged.remove(this.onAlternativeVisualizerChangedCallback);
    }
    visualizer.onStateChanged.remove(this.onStateChangedCallback);
    visualizer.onAfterRender.remove(this.onAfterRenderQuestionCallback);
    visualizer.destroy();
    element.visualizerInstance = undefined;
    element.renderedElement = undefined;
  }

  private destroyVisualizers() {
    this._elements.forEach((element) => {
      this.destroyElementVisualizer(element);
    });
  }

  protected setLocale(newLocale: string) {
    super.setLocale(newLocale);
    (this.questions || []).forEach((question) => {
      question = Array.isArray(question) ? question[0] : question;
      const element = this.getElement(question.name);
      if(!!element) {
        element.displayName = this.getTitle(question);
      }
    });
    this.visualizers.forEach(v => {
      v.options.seriesLabels = this.options.seriesLabels;
      v["setLocale"](newLocale);
      v.clear();
    });
    this.stateChanged("locale", newLocale);
  }

  /**
   * Returns the [`allowDynamicLayout`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowDynamicLayout) property value of the [`IVisualizationPanelOptions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions) object.
   */
  public get allowDynamicLayout() {
    return (
      this.options.allowDynamicLayout === undefined ||
      this.options.allowDynamicLayout === true
    );
  }

  /**
   * Returns the [`allowDragDrop`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowDragDrop) property value of the [`IVisualizationPanelOptions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions) object.
   */
  public get allowDragDrop() {
    if(IsTouch) {
      return false;
    }
    return (
      this.options.allowDragDrop === undefined ||
      this.options.allowDragDrop === true
    );
  }

  /**
   * Returns the [`allowHideQuestions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions) property value of the [`IVisualizationPanelOptions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions) object.
   */
  public get allowHideQuestions() {
    return (
      this.options.allowHideQuestions === undefined ||
      this.options.allowHideQuestions === true
    );
  }

  public get allowMakeQuestionsPrivate() {
    return this.options.allowMakeQuestionsPrivate === true;
  }

  get haveSeveralChildren(): boolean {
    return this._elements?.length > 1;
  }

  private _layoutEngine: LayoutEngine;
  /**
   * Returns a [`LayoutEngine`](https://surveyjs.io/dashboard/documentation/api-reference/layoutengine) instance used to arrange visualization items on `VisualizationPanel`.
   */
  public get layoutEngine() {
    return this._layoutEngine;
  }

  protected createElement(element: IVisualizerPanelElement, question?: Question): P {
    if(!!element) {
      return new PanelElement(element.name, element.displayName || element.title) as P;
    }
    return new PanelElement(question.name, this.getTitle(question)) as P;
  }

  protected buildElements(questions: Question[], elements: Array<IVisualizerPanelElement | string> = []): P[] {
    if(elements.length > 0) {
      return elements.map((element) => {
        let el = null;
        if(typeof element === "string") {
          const q = (questions || []).find((q) => q.name === element || q.valueName === element);
          if(q) {
            el = this.createElement(undefined, q);
          } else {
            // If no matching question is found, create a simple visualizer description
            // or throw an error?
            // This code was added to support responsecount visualizer
            const descriptor = { name: element, dataField: element, type: element } as any;
            el = this.createElement(descriptor, undefined);
            el.setState(descriptor);
          }
        } else {
          const descriptor = Object.assign({}, element) as any;
          let question = (questions || []).filter(q => q.name === (descriptor.dataField || descriptor.name))[0];
          if(typeof descriptor.question === "string") {
            question = (questions || []).filter((q) => q.name === descriptor.question || q.valueName === descriptor.question)[0];
          }
          el = this.createElement(descriptor, question);
          el.setState(element);
        }
        return el;
      });
    }

    return (questions || []).map((question) => {
      let questionAsElementDeclaration = Array.isArray(question) ? question[0] : question;
      questionAsElementDeclaration = questionAsElementDeclaration.question || questionAsElementDeclaration;
      const pe = this.createElement(undefined, questionAsElementDeclaration);
      if(Array.isArray(question)) {
        pe.questions = question;
      } else {
        pe.question = question;
      }
      return pe;
    });
  }

  /**
   * Returns an array of [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement) objects with information about visualization items.
   * @param questionNames Question [names](https://surveyjs.io/form-library/documentation/api-reference/question#name). Do not specify this parameter to get an array of all visualization items.
   * @see visibleElements
   * @see hiddenElements
   */
  public getElements(questionNames?: Array<string>): IVisualizerPanelElement[] {
    const result = [];
    (this._elements || []).forEach((element) => {
      if(!questionNames || questionNames.indexOf(element.name) !== -1) {
        result.push(element.getState());
      }
    });
    return result;
  }

  /**
   * Returns an array of [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement) objects with information about currently visible visualization items.
   *
   * If you want to disallow users to hide visualization items, set the [`allowHideQuestions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions) property to `false`.
   * @see hiddenElements
   * @see getElements
   */
  public get visibleElements() {
    return this._elements.filter((el: IVisualizerPanelElement) => el.isVisible);
  }

  /**
   * Returns an array of [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement) objects with information about currently hidden visualization items.
   *
   * If you want to disallow users to hide visualization items, set the [`allowHideQuestions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions) property to `false`.
   * @see visibleElements
   * @see getElements
   */
  public get hiddenElements() {
    return this._elements.filter(
      (el: IVisualizerPanelElement) => !el.isVisible
    );
  }

  public get publicElements() {
    return this._elements.filter((el: IVisualizerPanelElement) => el.isPublic);
  }

  public get privateElements() {
    return this._elements.filter((el: IVisualizerPanelElement) => !el.isPublic);
  }

  protected get locales() {
    if(this.options.survey) return this.options.survey.getUsedLocales();
    return [];
  }

  /**
   * Returns a visualization item with a specified question name.
   * @param name A question [name](https://surveyjs.io/form-library/documentation/api-reference/question#name).
   */
  public getElement(questionName: string) {
    return this._elements.filter((el) => el.name === questionName)[0];
  }

  /**
   * Returns a [visualizer](https://surveyjs.io/dashboard/documentation/api-reference/visualizerbase) that visualizes a specified survey question.
   * @param questionName A question [name](https://surveyjs.io/form-library/documentation/api-reference/question#name).
   */
  public getVisualizer(questionName: string) {
    return this.getElement(questionName)?.visualizerInstance;
  }

  /**
   * @deprecated Use [`onElementShown`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#onElementShown), [`onElementHidden`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#onElementHidden), or [`onElementMoved`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#onElementMoved) instead.
   */
  public onVisibleElementsChanged = new Event<
    (sender: VisualizationPanel, options: any) => any, VisualizationPanel,
    any
  >();

  /**
   * An event that is raised when users [show a visualization item](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions).
   *
   * Parameters:
   *
   * - `sender`: [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel)\
   * A `VisualizationPanel` that raised the event.
   *
   * - `options.elements`: Array\<[`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\>\
   * Information about all visualization items rendered by this `VisualizationPanel`.
   *
   * - `options.element`: [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\
   * A visualization item that has been shown.
   */
  public onElementShown = new Event<
    (sender: VisualizationPanel, options: any) => any, VisualizationPanel,
    any
  >();

  /**
   * An event that is raised when users [hide a visualization item](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowHideQuestions).
   *
   * Parameters:
   *
   * - `sender`: [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel)\
   * A `VisualizationPanel` that raised the event.
   *
   * - `options.elements`: Array\<[`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\>\
   * Information about all visualization items rendered by this `VisualizationPanel`.
   *
   * - `options.element`: [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\
   * A visualization item that has been hidden.
   */
  public onElementHidden = new Event<
    (sender: VisualizationPanel, options: any) => any, VisualizationPanel,
    any
  >();

  /**
   * An event that is raised when users [move a visualization item](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowDynamicLayout).
   *
   * Parameters:
   *
   * - `sender`: [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel)\
   * A `VisualizationPanel` that raised the event.
   *
   * - `options.elements`: Array\<[`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\>\
   * Information about all visualization items rendered by this `VisualizationPanel`.
   *
   * - `options.element`: [`IVisualizerPanelElement`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizerpanelelement)\
   * A visualization item that has been moved.
   */
  public onElementMoved = new Event<
    (sender: VisualizationPanel, options: any) => any, VisualizationPanel,
    any
  >();

  protected visibleElementsChanged(
    element: IVisualizerPanelElement,
    reason: string
  ): void {
    if(reason === "SHOWN" && !this.onElementShown.isEmpty) {
      this.onElementShown.fire(this, {
        elements: this._elements,
        element: element
      });
    }
    if(reason === "REMOVED" && !this.onElementHidden.isEmpty) {
      this.onElementHidden.fire(this, {
        elements: this._elements,
        element: element
      });
    }
    if(reason === "MOVED" && !this.onElementMoved.isEmpty) {
      this.onElementMoved.fire(this, {
        elements: this._elements,
        element: element
      });
    }

    if(!this.onVisibleElementsChanged.isEmpty) {
      this.onVisibleElementsChanged.fire(this, {
        elements: this._elements,
        changed: element,
        reason: reason,
      });
    }
    this.stateChanged("visibleElements", reason);
    this.layout();
  }

  public onPermissionsChangedCallback: any;

  protected renderPanelElement(element: IVisualizerPanelRenderedElement, container: HTMLElement) {
    const visualizer = element.visualizerInstance;
    if(!visualizer) {
      return;
    }

    const questionElement = DocumentHelper.createElement("div");
    questionElement.dataset.question = element.name;
    questionElement.role = "group";
    questionElement.setAttribute("aria-labelledby", "el_" + element.name);

    !!container && container.appendChild(questionElement);

    const questionContent = DocumentHelper.createElement("div");
    const vizualizerElement = DocumentHelper.createElement("div");
    const headerElement = this.createHeaderElement(element);

    questionElement.className = questionElementClassName;
    if(this.allowDynamicLayout && this.haveSeveralChildren) {
      questionElement.classList.add(questionLayoutedElementClassName);
    }
    questionContent.className = questionElementClassName + "__content";

    questionContent.appendChild(headerElement);
    questionContent.appendChild(vizualizerElement);
    questionElement.appendChild(questionContent);

    visualizer.render(vizualizerElement, false);

    element.renderedElement = questionElement;
    return questionElement;
  }

  protected renderBanner(container: HTMLElement): void {
    if(!this.haveCommercialLicense && this._isRoot) {
      const banner = createCommercialLicenseLink();
      container.appendChild(banner);
    }
    super.renderBanner(container);
  }

  protected renderToolbar(container: HTMLElement) {
    container.className += " sa-panel__header";
    super.renderToolbar(container);
  }

  public renderContent(container: HTMLElement): void {
    container.className += " sa-panel__content sa-grid";

    this.visibleElements.forEach((element) => {
      let questionElement = this.renderPanelElement(element, container);
    });

    this.layoutEngine?.start(container);
    // !!window && window.dispatchEvent(new UIEvent("resize"));
  }

  protected destroyContent(container: HTMLElement) {
    this.layoutEngine?.stop();
    super.destroyContent(container);
  }

  /**
   * Redraws the `VisualizationPanel` and all its content.
   */
  public refresh() {
    if(!!this.toolbarContainer) {
      this.destroyToolbar(this.toolbarContainer);
      this.renderToolbar(this.toolbarContainer);
    }
    super.refresh();
  }

  public layout() {
    this.layoutEngine?.update();
  }

  /**
   * Filters visualized data based on a specified question name and value. This method is called when a user clicks a chart point.
   * @param questionName A question [name](https://surveyjs.io/form-library/documentation/api-reference/question#name).
   * @param selectedValue
   * @see IVisualizationPanelOptions.allowSelection
   */
  public setFilter(questionName: string, selectedValue: any) {
    if(!this.dataPath) {
      this.dataProvider.setFilter(questionName, selectedValue);
    } else {
      if(selectedValue !== undefined && selectedValue !== null) {
        if(typeof selectedValue === "object" && Object.keys(selectedValue)[0]) {
          const seriesValue = Object.keys(selectedValue)[0];
          this.dataProvider.setFilter(this.dataPath, { [questionName]: selectedValue[seriesValue], [DataProvider.seriesMarkerKey]: seriesValue });
        } else {
          this.dataProvider.setFilter(this.dataPath, { [questionName]: selectedValue });
        }
      } else {
        this.dataProvider.setFilter(this.dataPath, undefined);
      }
    }
    this.updateResetFilterButtonDisabled();
  }

  public getState(): IState {
    return {
      locale: this.locale,
      elements: [].concat(this._elements.map(element => element.getState())),
    };
  }

  /**
   * Gets or sets the Dashboard state.
   *
   * The state includes configuration of dashboard items and the current locale.
   *
   * [View Demo](https://surveyjs.io/dashboard/examples/save-dashboard-state-to-local-storage/ (linkStyle))
   * @see onStateChanged
   */
  public get state(): IState {
    return this.getState();
  }
  public set state(newState: IState) {
    if(!newState) return;
    this._settingState = true;
    try {
      if(Array.isArray(newState.elements)) {
        const questionNames = this.questions.map(q => Array.isArray(q) ? q[0].name : q.name);
        const loadedElements = [].concat(newState.elements.filter(e => (questionNames.indexOf(e.name) !== -1)));

        const newElements = [];
        loadedElements.forEach(elementState => {
          const oldElement = this.getElement(elementState.name);
          if(oldElement !== undefined) {
            oldElement.setState(elementState);
            newElements.push(oldElement);
          } else {
            let newElement = this.createElement(elementState, (this.questions || []).filter(q => q.name === elementState.name)[0]);
            newElement.setState(elementState);
            newElements.push(newElement);
          }
        });
        this._elements = newElements;
      }

      if(typeof newState.locale !== "undefined") {
        this.setLocale(newState.locale);
      }
    } finally {
      this._settingState = false;
    }
    this.refresh();
  }
  public resetState(): void {
    this._settingState = true;
    super.resetState();
    try {
      this.visualizers.forEach(visualizer => visualizer.resetState());
      this.locale = surveyLocalization.defaultLocale;
    } finally {
      this._settingState = false;
    }
    this.refresh();
  }

  public get permissions(): IPermission[] {
    return this._elements.map((element) => ({
      name: element.name,
      isPublic: element.isPublic,
    }));
  }
  public set permissions(permissions: IPermission[]) {
    if(permissions) {
      permissions.forEach((permission) => {
        const element = this.getElement(permission.name);
        !!element && (element.isPublic = permission.isPublic);
      });
      this.refresh();
      !!this.onPermissionsChangedCallback && this.onPermissionsChangedCallback(this);
    }
  }

  protected getCalculatedValuesCore(): ICalculationResult {
    return {
      data: [],
      values: []
    };
  }

  protected onThemeChanged(): void {
    super.onThemeChanged();
    this.visualizers.forEach(v => {
      v.theme = this.theme;
    });
  }

  destroy() {
    super.destroy();
    this.destroyVisualizers();
  }
}
