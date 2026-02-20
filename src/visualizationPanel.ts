import { Event, Question, SurveyModel, surveyLocalization } from "survey-core";
import { IsTouch } from "survey-core";
import { ICalculationResult, VisualizerBase } from "./visualizerBase";
import { SelectBase, IVisualizerWithSelection } from "./selectBase";
import { AlternativeVisualizersWrapper } from "./alternativeVizualizersWrapper";
import { DocumentHelper, createCommercialLicenseLink } from "./utils/index";
import { localization } from "./localizationManager";
import { IVisualizerPanelElement, IState, IPermission } from "./config";
import { FilterInfo } from "./filterInfo";
import { LayoutEngine } from "./layout-engine";
import { DataProvider } from "./dataProvider";
import { svgTemplate } from "./svgbundle";
import { VisualizationManager } from "./visualizationManager";
import { VisualizationPanelDynamic } from "./visualizationPanelDynamic";
import { DatePeriodEnum, DateRangeWidget, IDateRangeWidgetOptions } from "./utils/dateRangeWidget";
import { getDataName } from "./visualizerDescription";
import { IDateRange, toRange } from "./utils/calculationDateRanges";
import { DateRangeModel, IDateRangeChangedOptions } from "./utils/dateRangeModel";
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
  renderedElement?: HTMLElement;
}

/**
 * Obsolete. Use the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object and the [`Dashboard`](/dashboard/documentation/api-reference/dashboard) class instead.
 * @deprecated
 */
export interface IVisualizationPanelOptions {
  // An object named after a question that it configures.
  // questionName: {
  //   intervals: []
  // },

  /**
   * @deprecated Use the [`labelTruncateLength`](/dashboard/documentation/api-reference/idashboardoptions#labelTruncateLength) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  labelTruncateLength?: number;

  allowMakeQuestionsPrivate?: boolean;

  seriesValues?: string[];
  seriesLabels?: string[];
  useValuesAsLabels?: boolean;

  /**
   * @deprecated Use the [`survey`](/dashboard/documentation/api-reference/idashboardoptions#survey) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  survey?: SurveyModel;
  dataProvider?: DataProvider;
  /**
   * @deprecated Use the [`allowHideQuestions`](/dashboard/documentation/api-reference/idashboardoptions#allowHideQuestions) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  allowHideQuestions?: boolean;
  /**
   * @deprecated Use the [`allowDynamicLayout`](/dashboard/documentation/api-reference/idashboardoptions#allowDynamicLayout) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  allowDynamicLayout?: boolean;
  /**
   * @deprecated Use the [`allowDragDrop`](/dashboard/documentation/api-reference/idashboardoptions#allowDragDrop) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  allowDragDrop?: boolean;
  /**
   * @deprecated Use the [`layoutEngine`](/dashboard/documentation/api-reference/idashboardoptions#layoutEngine) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  layoutEngine?: LayoutEngine;
  /**
   * @deprecated Use the [`allowShowPercentages`](/dashboard/documentation/api-reference/idashboardoptions#allowShowPercentages) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  allowShowPercentages?: boolean;
  /**
   * @deprecated Use the [`showPercentages`](/dashboard/documentation/api-reference/idashboardoptions#showPercentages) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  showPercentages?: boolean;
  /**
   * @deprecated Use the [`showOnlyPercentages`](/dashboard/documentation/api-reference/idashboardoptions#showOnlyPercentages) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  showOnlyPercentages?: boolean;
  /**
   * @deprecated Use the [`percentagePrecision`](/dashboard/documentation/api-reference/idashboardoptions#percentagePrecision) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  percentagePrecision?: number;
  haveCommercialLicense?: boolean;
  /**
   * @deprecated Use the [`allowSortAnswers`](/dashboard/documentation/api-reference/idashboardoptions#allowSortAnswers) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  allowSortAnswers?: boolean;
  /**
   * @deprecated
   */
  allowChangeAnswersOrder?: boolean;
  /**
   * @deprecated Use the [`answersOrder`](/dashboard/documentation/api-reference/idashboardoptions#answersOrder) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  answersOrder?: "default" | "asc" | "desc";
  /**
   * @deprecated Use the [`allowHideEmptyAnswers`](/dashboard/documentation/api-reference/idashboardoptions#allowHideEmptyAnswers) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  allowHideEmptyAnswers?: boolean;
  /**
   * @deprecated Use the [`hideEmptyAnswers`](/dashboard/documentation/api-reference/idashboardoptions#hideEmptyAnswers) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  hideEmptyAnswers?: boolean;
  /**
   * @deprecated Use the [`allowTopNAnswers`](/dashboard/documentation/api-reference/idashboardoptions#allowTopNAnswers) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  allowTopNAnswers?: boolean;
  /**
   * @deprecated Use the [`allowShowMissingAnswers`](/dashboard/documentation/api-reference/idashboardoptions#allowShowMissingAnswers) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  allowShowMissingAnswers?: boolean;

  allowExperimentalFeatures?: boolean;
  defaultChartType?: string;
  /**
   * @deprecated Use the [`allowTransposeData`](/dashboard/documentation/api-reference/idashboardoptions#allowTransposeData) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  allowTransposeData?: boolean;
  /**
   * @deprecated Use the [`allowSelection`](/dashboard/documentation/api-reference/idashboardoptions#allowSelection) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  allowSelection?: boolean;

  renderContent?: Function;
  destroyContent?: Function;

  /**
   * @deprecated Use the [`stripHtmlFromTitles`](/dashboard/documentation/api-reference/idashboardoptions#stripHtmlFromTitles) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  stripHtmlFromTitles?: boolean;

  /**
   * @deprecated Use the [`allowChangeVisualizerType`](/dashboard/documentation/api-reference/idashboardoptions#allowChangeVisualizerType) property in the [`IDashboardOptions`](/dashboard/documentation/api-reference/idashboardoptions) configuration object.
   */
  allowChangeVisualizerType?: boolean;
  legendPosition?: "left" | "right" | "top" | "bottom";
}

/**
 * Obsolete. Use the [`Dashboard`](/dashboard/documentation/api-reference/dashboard) class instead.
 * @deprecated
 */
export class VisualizationPanel extends VisualizerBase {
  public static LayoutEngine: new (allowed: boolean, itemSelector: string, dragEnabled?: boolean) => LayoutEngine;
  public visualizers: Array<VisualizerBase> = [];
  private renderedQuestionsCount: number = 0;
  private static counter = 0;
  private resetFilterButton: HTMLElement;
  private _dateRangeWidget: DateRangeWidget;
  private _dateRangeModel: DateRangeModel;

  private static getVisualizerName() {
    VisualizationPanel.counter++;
    return "visualizer" + VisualizationPanel.counter;
  }

  private updateResetFilterButtonDisabled() {
    if(this.resetFilterButton) {
      const buttonDisabledClass = "sa-toolbar__button--disabled";
      if(this.dataProvider.getFilters().length == 0) {
        this.resetFilterButton.classList.add(buttonDisabledClass);
      } else {
        this.resetFilterButton.classList.remove(buttonDisabledClass);
      }
    }
  }

  constructor(
    protected questions: Array<any>,
    data: Array<{ [index: string]: any }>,
    options: IVisualizationPanelOptions = {},
    private _elements: Array<IVisualizerPanelRenderedElement> = undefined,
    private isRoot = true
  ) {
    super(null, data, options, "panel");
    this.loadingData = false;
    this.showToolbar = isRoot;
    if(this.options.survey) {
      localization.currentLocale = this.options.survey.locale;
    }

    if(_elements === undefined) {
      this._elements = this.buildElements(questions);
    }

    this.buildVisualizers(questions);

    if(this.isRoot && this.options.dateFieldName) {
      this.createDateRangeWidget();
    }

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
        const allQuestions = this._elements.map((element) => {
          return {
            value: element.name,
            text: element.displayName || element.name,
            title: element.displayName || element.name,
            icon: "check-24x24"
          };
        });
        const selectWrapper = DocumentHelper.createActionDropdown({
          options: allQuestions,
          isSelected: (option: any) => this.hiddenElements.length === 0 || this.hiddenElements.filter(el => el.name === option.value).length === 0,
          handler: (e: any) => {
            if(!!e) {
              const element = this.getElement(e);
              if(!!element && element.isVisible) {
                this.hideElement(e);
              } else {
                this.showElement(e);
              }
              return false;
            }
          },
          title: localization.getString("allQuestions")
        });
        return selectWrapper;
      }
      return undefined;
    }, "dropdown");

    this._supportSelection = true;
    if(this.supportSelection !== false) {
      this.registerToolbarItem("resetFilter", () => {
        this.resetFilterButton = DocumentHelper.createButton(() => {
          this.resetFilter();
        }, localization.getString("resetFilter"));
        this.updateResetFilterButtonDisabled();
        return this.resetFilterButton;
      }, "button", 900);
    }

    if(!this.options.disableLocaleSwitch && this.locales.length > 1) {
      const localeChoices = this.locales.map((element) => {
        return {
          value: element,
          text: localization.getLocaleName(element)
        };
      });
      // localeChoices.unshift({
      //   value: "",
      //   text: localization.getString("changeLocale"),
      // });
      this.registerToolbarItem("changeLocale", () => {
        return DocumentHelper.createDropdown({
          options: localeChoices,
          isSelected: (option: any) => !!option.value && (this.locale || surveyLocalization.defaultLocale) === option.value,
          handler: (e: any) => {
            var newLocale = e;
            this.locale = newLocale;
          }
        });
      }, "dropdown");
    }

    // if(this.isRoot && !this.theme?.isAxisLabelFontLoaded()) {
    //   document.fonts.ready.then((fontFaceSet: FontFaceSet) => {
    //     setTimeout(() => {
    //       if (this.theme?.isAxisLabelFontLoaded()) {
    //         this.refresh();
    //       }
    //     }, 100);
    //   });
    // }
  }

  public resetFilter(): void {
    this.dataProvider?.resetFilter();
    this.visualizers.forEach((visualizer) => {
      if(visualizer instanceof SelectBase || visualizer instanceof AlternativeVisualizersWrapper) {
        visualizer.setSelection(undefined);
      }
      if(visualizer instanceof VisualizationPanelDynamic) {
        visualizer.resetFilter();
      }
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
    this.renderedQuestionsCount++;
    if(this.renderedQuestionsCount == this.visibleElements.length) {
      this.renderedQuestionsCount = 0;
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

  /**
   * An event that is raised when a user selects a different visualizer type from the Type drop-down menu.
   *
   * Parameters:
   *
   * - `sender`: `AlternativeVisualizersWrapper`\
   * An object that controls altenative visualizers.
   *
   * - `options.visualizer`: `VisualizerBase`\
   * An applied visualizer.
   **/
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
    if(this._dateRangeWidget) {
      this.dataProvider.getCount().then(count => this._dateRangeWidget.updateAnswersCount(count));
    }
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
    const visualizer = this.getVisualizer(elementName);
    if(!!visualizer && !!visualizer.getChartAdapter()) {
      visualizer.getChartAdapter().destroy(element.renderedElement);
    }
    this.visibleElementsChanged(element, "REMOVED");
  }

  /**
   * Hides all panel elements. Users can select the elements they want to show from a drop-down menu.
   * @see showAllElements
   * @see allowHideQuestions
   */
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

  /**
   * Shows all panel elements if they are hidden to a drop-down menu.
   * @see hideAllElements
   * @see allowHideQuestions
   */
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

  private buildVisualizers(questions: Array<Question>) {
    questions.forEach((question) => {
      let visualizerOptions = Object.assign({}, this.options);
      if(visualizerOptions.dataProvider === undefined) {
        visualizerOptions.dataProvider = this.dataProvider;
      }
      let visualizer: VisualizerBase;
      if(Array.isArray(question)) {
        visualizer = new (VisualizationManager.getPivotVisualizerConstructor() as any)(question, [], visualizerOptions, false);
      } else {
        visualizer = this.createVisualizer(question, visualizerOptions, []);
      }
      if(!visualizer) {
        return;
      }

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
        let filterInfo = new FilterInfo(visualizerWithSelection);

        visualizer.registerToolbarItem("questionFilterInfo", () => {
          filterInfo.update(visualizerWithSelection.selection);
          return filterInfo.htmlElement;
        }, "filter", 900);

        visualizerWithSelection.onDataItemSelected = (
          selectedValue: any,
          selectedText: string
        ) => {
          filterInfo.update({ value: selectedValue, text: selectedText });
          const dataName = getDataName(question);
          this.setFilter(dataName, selectedValue);
        };
      }

      visualizer.onUpdate = () => this.layout();
      visualizer.onAfterRender.add(this.onAfterRenderQuestionCallback);
      visualizer.onStateChanged.add(this.onStateChangedCallback);

      if(visualizer instanceof AlternativeVisualizersWrapper) {
        visualizer.onVisualizerChanged.add(this.onAlternativeVisualizerChangedCallback);
      }

      this.visualizers.push(visualizer);
    });
  }

  private destroyVisualizers() {
    this.visualizers.forEach((visualizer) => {
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
    });
    this.visualizers = [];
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

  protected buildElements(questions: any[]): IVisualizerPanelElement[] {
    return (questions || []).map((question) => {
      question = Array.isArray(question) ? question[0] : question;
      question = question.question || question;
      if(!question.name) {
        question.name = VisualizationPanel.getVisualizerName();
      }
      return {
        name: question.name,
        displayName: this.getTitle(question),
        isVisible: true,
        isPublic: true,
      };
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
        result.push({
          name: element.name,
          displayName: element.displayName,
          isVisible: element.isVisible,
          isPublic: element.isPublic,
        });
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
    return this.visualizers.filter((v) => v.name === questionName)[0];
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

  public onDateRangeChanged = new Event<(sender: VisualizationPanel, options: IDateRangeChangedOptions) => any, VisualizationPanel, any>();
  public createDateRangeWidget(): void {
    const config = <IDateRangeWidgetOptions>{
      datePeriod: this.options.datePeriod,
      availableDatePeriods: this.options.availableDatePeriods,
      dateRange: this.options.dateRange,
      showAnswerCount: this.options.showAnswerCount,

      onDateRangeChanged: (dateRange: IDateRange, datePeriod: DatePeriodEnum) => {
        const options = <IDateRangeChangedOptions>{ datePeriod, dateRange };
        this.onDateRangeChanged.fire(this, options);
        this.dataProvider.setSystemFilter(this.options.dateFieldName, options.dateRange);
      }
    };
    this._dateRangeModel = new DateRangeModel(config);
    this.dataProvider.setSystemFilter(this.options.dateFieldName, this._dateRangeModel.currentDateRange);
    if(this.options.showDatePanel !== false) {
      this._dateRangeWidget = new DateRangeWidget(this._dateRangeModel, config);
      this.dataProvider.getCount().then(count => this._dateRangeWidget.updateAnswersCount(count));
    }
  }

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

  protected renderPanelElement(
    element: IVisualizerPanelRenderedElement,
    container: HTMLElement
  ) {
    const visualizer = this.getVisualizer(element.name);
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
    // questionContent.style.backgroundColor = this.backgroundColor;

    questionContent.appendChild(headerElement);
    questionContent.appendChild(vizualizerElement);
    questionElement.appendChild(questionContent);

    visualizer.render(vizualizerElement, false);

    element.renderedElement = questionElement;
    return questionElement;
  }

  protected renderBanner(container: HTMLElement): void {
    if(!this.haveCommercialLicense && this.isRoot) {
      const banner = createCommercialLicenseLink();
      container.appendChild(banner);
    }
    super.renderBanner(container);
  }

  protected renderToolbar(container: HTMLElement) {
    container.className += " sa-panel__header";
    super.renderToolbar(container);

    if(this.isRoot && this._dateRangeWidget) {
      const divider = DocumentHelper.createElement("div", "sa-horizontal-divider");
      const line = DocumentHelper.createElement("div", "sa-line");
      divider.appendChild(line);
      container.appendChild(divider);

      const dateRangeWidgetElement = this._dateRangeWidget.render();
      container.appendChild(dateRangeWidgetElement);
    }
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
      elements: [].concat(this._elements.map(element => {
        const visualizer = this.getVisualizer(element.name);
        const elementState = { ...element, ...visualizer?.getState() };
        if(elementState.renderedElement !== undefined) {
          delete elementState.renderedElement;
        }
        return elementState;
      })),
    };
  }

  /**
   * The state of `VisualizationPanel`. Includes information about the visualized elements and current locale.
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
          const visualizer = this.getVisualizer(elementState.name);
          if(visualizer !== undefined) {
            visualizer.setState(elementState);
          }
          newElements.push({
            name: elementState.name,
            displayName: elementState.displayName,
            isVisible: elementState.isVisible,
            isPublic: elementState.isPublic,
          });
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
    return <any>this._elements.map((element) => {
      return {
        name: element.name,
        isPublic: element.isPublic,
      };
    });
  }
  public set permissions(permissions: IPermission[]) {
    const updatedElements = this._elements.map((element) => {
      permissions.forEach((permission) => {
        if(permission.name === element.name)
          element.isPublic = permission.isPublic;
      });

      return { ...element };
    });
    this._elements = [].concat(updatedElements);
    this.refresh();
    this.onPermissionsChangedCallback &&
      this.onPermissionsChangedCallback(this);
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
    this._dateRangeWidget?.destroy();
  }
}
