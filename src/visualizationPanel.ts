import { Event, Question, SurveyModel, surveyLocalization } from "survey-core";
import * as SurveyCore from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { SelectBase, IVisualizerWithSelection } from "./selectBase";
import { AlternativeVisualizersWrapper } from "./alternativeVizualizersWrapper";
import { DocumentHelper, createCommercialLicenseLink } from "./utils/index";
import { localization } from "./localizationManager";
import { IVisualizerPanelElement, IState, IPermission } from "./config";
import { FilterInfo } from "./filterInfo";
import { LayoutEngine, MuuriLayoutEngine } from "./layoutEngine";
import { DataProvider } from "./dataProvider";

var styles = require("./visualizationPanel.scss");

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
 * Visualization Panel configuration. Pass it as the third argument to the [`VisualizationPanel`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel) constructor:
 *
 * ```js
 * import { VisualizationPanel } from "survey-analytics";
 *
 * const vizPanel = new VisualizationPanel(
 *   surveyQuestions,
 *   surveyResults,
 *   vizPanelOptions
 * );
 * ```
 */
export interface IVisualizationPanelOptions {
  // An object named after a question that it configures.
  // questionName: {
  //   intervals: []
  // },

  /**
   * The number of label characters after which truncation starts.
   *
   * Set this property to -1 to disable truncation.
   *
   * Default value: 27
   */
  labelTruncateLength?: number;

  allowMakeQuestionsPrivate?: boolean;

  seriesValues?: string[];
  seriesLabels?: string[];
  useValuesAsLabels?: boolean;

  /**
   * Pass a survey instance to use survey locales in the Visualization Panel.
   */
  survey?: SurveyModel;
  /**
   * A common data provider for all visualizers.
   */
  dataProvider?: DataProvider;
  /**
   * Allows users to change the visibility of individual charts.
   *
   * This property adds a Hide button to each chart.
   *
   * Default value: `true`
   */
  allowHideQuestions?: boolean;
  /**
   * Specifies whether to arrange charts based on the available screen space and allow users to reorder them via drag and drop.
   *
   * If this property is disabled, charts are displayed one under another, and users cannot drag and drop them. If you want to disable only drag and drop, set the [`allowDragDrop`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowDynamicLayout) property to `false`.
   *
   * Default value: `true`
   *
   * [View Demo](https://surveyjs.io/dashboard/examples/custom-layout/ (linkStyle))
   * @see layoutEngine
   */
  allowDynamicLayout?: boolean;
  /**
   * Specifies whether users can drag and drop charts. Applies only if [`allowDynamicLayout`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions#allowDynamicLayout) is `true`.
   *
   * Default value: `true`
   * @see layoutEngine
   */
  allowDragDrop?: boolean;
  /**
   * A layout engine used to arrange charts on the Visualization Panel.
   *
   * You can use this property to integrate a third-party layout engine with SurveyJS Dashboard.
   *
   * @see allowDynamicLayout
   */
  layoutEngine?: LayoutEngine;
  /**
   * Allows users to switch between absolute and percentage values in bar charts.
   *
   * This property adds a Show Percentages button to each bar chart.
   *
   * Default value: `false`
   *
   * @see showPercentages
   * @see showOnlyPercentages
   * @see percentagePrecision
   */
  allowShowPercentages?: boolean;
  /**
   * Specifies whether bar charts display percentages in addition to absolute values.
   *
   * Users can change this property value if you enable the `allowShowPercentages` property.
   *
   * Default value: `false`
   *
   * @see allowShowPercentages
   * @see showOnlyPercentages
   * @see percentagePrecision
   */
  showPercentages?: boolean;
  /**
   * Specifies whether bar charts display only percentages, without absolute values.
   *
   * Applies only if the `allowShowPercentages` or `showPercentages` property is enabled.
   *
   * Default value: `false`
   *
   * @see allowShowPercentages
   * @see showPercentages
   * @see percentagePrecision
   */
  showOnlyPercentages?: boolean;
  /**
   * Specifies percentage precision.
   *
   * Default value: 0
   *
   * @see allowShowPercentages
   * @see showPercentages
   * @see showOnlyPercentages
   */
  percentagePrecision?: number;
  haveCommercialLicense?: boolean;
  /**
   * Allows users to sort answers by answer count. Applies only to bar and scatter charts.
   *
   * This property adds a Sorting dropdown to each bar and scatter chart.
   *
   * Default value: `true`
   *
   * @see answersOrder
   */
  allowChangeAnswersOrder?: boolean;
  /**
   * Specifies how to sort answers in bar and scatter charts.
   *
   * Accepted values:
   *
   * - `"default"` (default) - Do not sort answers.
   * - `"asc"` - Sort answers by ascending answer count.
   * - `"desc"` - Sort answers by descending answer count.
   *
   * Users can change this property value if you enable the `allowChangeAnswersOrder` property.
   *
   * @see allowChangeAnswersOrder
   */
  answersOrder?: "default" | "asc" | "desc";
  /**
   * Allows users to hide answers with zero count in bar and scatter charts.
   *
   * This property adds a Hide Empty Answers button to each bar and scatter chart.
   *
   * Default value: `false`
   */
  allowHideEmptyAnswers?: boolean;
  /**
   * Hides answers with zero count in bar and scatter charts.
   *
   * Users can change this property value if you enable the `allowHideEmptyAnswers` property.
   *
   * Default value: `false`
   *
   * @see allowHideEmptyAnswers
   */
  hideEmptyAnswers?: boolean;
  /**
   * Allows users to select whether to show top 5, 10, or 20 answers by answer count.
   *
   * This property adds a Top N Answers dropdown to each chart.
   *
   * Default value: `false`
   */
  allowTopNAnswers?: boolean;
  /**
   * Allows users to show the number of respondents who did not answer a particular question.
   *
   * This property adds a Show Missing Answers button to each chart.
   *
   * Default value: `false`
   */
  allowShowMissingAnswers?: boolean;

  allowExperimentalFeatures?: boolean;
  /**
   * Default chart type.
   *
   * Accepted values depend on the question type as follows:
   *
   * - Boolean: `"bar"` | `"pie"` | `"doughnut"`
   * - Date, Number: `"bar"` | `"scatter"`
   * - Matrix: `"bar"` | `"pie"` | `"doughnut"` | `"stackedbar"`
   * - Rating: `"bar"` | `"scatter"` | `"gauge"` | `"bullet"`
   * - Radiogroup, Checkbox, Dropdown, Image Picker: `"bar"` | `"pie"` | `"doughnut"` | `"scatter"`
   *
   * To set a type for an individual chart, access this chart in the `visualizers` array and set its `chartType` property to one of the values described above:
   *
   * ```js
   * const vizPanel = new SurveyAnalytics.VisualizationPanel( ... );
   * vizPanel.visualizers[0].chartType = "stackedbar";
   * ```
   *
   */
  defaultChartType?: string;
  /**
   * Allows users to transpose a visualized matrix question.
   *
   * This property adds a Transpose button to charts that visualize matrixes. When users select Per Values, matrix rows go to chart arguments and matrix columns form chart series. When users select Per Columns, matrix rows form chart series and matrix columns go to chart arguments.
   *
   * Default value: `false`
   */
  allowTransposeData?: boolean;
  /**
   * Allows users to cross-filter charts. The filter applies when users select a series point.
   *
   * Default value: `true`
   */
  allowSelection?: boolean;

  renderContent?: Function;
  destroyContent?: Function;

  /**
   * Removes HTML tags from survey element titles.
   *
   * Survey element titles can contain HTML markup and are specified by users. An attacker can inject malicious code into the titles. To guard against it, keep this property set to `true`.
   *
   * Default value: `true`
   */
  stripHtmlFromTitles?: boolean;
}

/**
 * An object that visualizes survey results and allows users to analyze them.
 *
 * Constructor parameters:
 *
 * - `questions`: Array\<[`Question`](https://surveyjs.io/form-library/documentation/api-reference/question)\>\
 * Survey questions to visualize. Call `SurveyModel`'s [`getAllQuestions()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#getQuestionByName) method to access all survey questions and pass its result as the `questions` parameter.
 * - `data`: `Array<any>`\
 * Survey results.
 * - `vizPanelOptions`: [`IVisualizationPanelOptions`](https://surveyjs.io/dashboard/documentation/api-reference/ivisualizationpaneloptions)\
 * Visualization Panel configuration.
 *
 * [View Demo](https://surveyjs.io/dashboard/examples/interactive-survey-data-dashboard/ (linkStyle))
 */
export class VisualizationPanel extends VisualizerBase {
  public static haveCommercialLicense: boolean = false;
  public visualizers: Array<VisualizerBase> = [];
  private haveCommercialLicense: boolean = false;
  private renderedQuestionsCount: number = 0;
  constructor(
    protected questions: Array<any>,
    data: Array<{ [index: string]: any }>,
    options: IVisualizationPanelOptions = {},
    private _elements: Array<IVisualizerPanelRenderedElement> = undefined
  ) {
    super(null, data, options, "panel");

    const f = (<any>SurveyCore).hasLicense;
    this.haveCommercialLicense = (!!f && f(4)) ||
      VisualizationPanel.haveCommercialLicense ||
      (typeof options.haveCommercialLicense !== "undefined"
        ? options.haveCommercialLicense
        : false);

    this._layoutEngine =
      options.layoutEngine ||
      new MuuriLayoutEngine(
        this.allowDynamicLayout,
        "." + questionLayoutedElementClassName,
        this.allowDragDrop
      );
    this._layoutEngine.onMoveCallback = (order: Array<string>) =>
      this.reorderVisibleElements(order);

    this.showToolbar = true;
    if (this.options.survey) {
      localization.currentLocale = this.options.survey.locale;
    }

    if (_elements === undefined) {
      this._elements = this.buildElements(questions);
    }

    this.buildVisualizers(questions);

    if (!this.haveCommercialLicense) {
      this.registerToolbarItem("commercialLicense", () => {
        return createCommercialLicenseLink();
      });
    }

    this.registerToolbarItem("resetFilter", () => {
      return DocumentHelper.createButton(() => {
        this.visualizers.forEach((visualizer) => {
          if (visualizer instanceof SelectBase || visualizer instanceof AlternativeVisualizersWrapper) {
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
    if (!this.options.disableLocaleSwitch && this.locales.length > 1) {
      const localeChoices = this.locales.map((element) => {
        return {
          value: element,
          text: localization.localeNames[element] || localization.getString(element) || element
        };
      });
      // localeChoices.unshift({
      //   value: "",
      //   text: localization.getString("changeLocale"),
      // });
      this.registerToolbarItem("changeLocale", () => {
        return DocumentHelper.createSelector(localeChoices,
          (option: any) => !!option.value && (this.locale || surveyLocalization.defaultLocale) === option.value,
          (e: any) => {
            var newLocale = e.target.value;
            this.locale = newLocale;
          }
        );
      });
    }
  }
  reorderVisibleElements(order: string[]): void {
    const newElements = [];
    order.forEach(name => {
      newElements.push(this._elements.filter(el => el.name === name)[0]);
    });
    this._elements = newElements;
    this.visibleElementsChanged(undefined, "REORDERED");
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
    this.layoutEngine.add([questionElement], options);
  }

  public showElement(elementName: string) {
    const element = this.getElement(elementName);
    const elementIndex = this._elements.indexOf(element);
    this.showElementCore(element, elementIndex);
    this.visibleElementsChanged(element, "ADDED");
  }

  protected hideElementCore(element: IVisualizerPanelRenderedElement) {
    element.isVisible = false;
    if (!!element.renderedElement) {
      this.layoutEngine.remove([element.renderedElement]);
      this.contentContainer.removeChild(element.renderedElement);
      element.renderedElement = undefined;
    }
  }

  public hideElement(elementName: string) {
    const element = this.getElement(elementName);
    this.hideElementCore(element);
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
      const visualizer = this.createVisualizer(question);
      if(!visualizer) {
        return;
      }

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
      visualizer.onStateChanged.add(this.onStateChangedCallback);

      if (visualizer instanceof AlternativeVisualizersWrapper) {
        visualizer.onVisualizerChanged.add(this.onAlternativeVisualizerChangedCallback);
      }

      this.visualizers.push(visualizer);
    });
  }

  private destroyVisualizers() {
    this.visualizers.forEach((visualizer) => {
      visualizer.onUpdate = undefined;
      if (visualizer instanceof SelectBase) {
        visualizer.onDataItemSelected = undefined;
      }
      if (visualizer instanceof AlternativeVisualizersWrapper) {
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
      const element = this.getElement(question.name);
      if (!!element) {
        element.displayName = this.processText(question.title);
      }
    });
    this.visualizers.forEach(v => {
      v.options.seriesLabels = this.options.seriesLabels;
      v.locale = newLocale;
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
    if(SurveyCore.IsTouch) {
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

  private _layoutEngine: LayoutEngine;
  /**
   * Returns a [`LayoutEngine`](https://surveyjs.io/dashboard/documentation/api-reference/layoutengine) instance used to arrange visualization items on `VisualizationPanel`.
   */
  public get layoutEngine() {
    return this._layoutEngine;
  }

  protected buildElements(questions: any[]): IVisualizerPanelElement[] {
    return (questions || []).map((question) => {
      return {
        name: question.name,
        displayName: this.processText(question.title),
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
    if (this.options.survey) return this.options.survey.getUsedLocales();
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
    return this.visualizers.filter((v) => v.question.name === questionName)[0];
  }

  /**
   * Obsolete. Use [`onElementShown`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#onElementShown), [`onElementHidden`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#onElementHidden), or [`onElementMoved`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel#onElementMoved) instead.
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
    if (reason === "SHOWN" && !this.onElementShown.isEmpty) {
      this.onElementShown.fire(this, {
        elements: this._elements,
        element: element
      });
    }
    if (reason === "REMOVED" && !this.onElementHidden.isEmpty) {
      this.onElementHidden.fire(this, {
        elements: this._elements,
        element: element
      });
    }
    if (reason === "MOVED" && !this.onElementMoved.isEmpty) {
      this.onElementMoved.fire(this, {
        elements: this._elements,
        element: element
      });
    }

    if (!this.onVisibleElementsChanged.isEmpty) {
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

    !!container && container.appendChild(questionElement);

    const questionContent = DocumentHelper.createElement("div");
    const titleElement = DocumentHelper.createElement("h3");
    const vizualizerElement = DocumentHelper.createElement("div");

    titleElement.innerText = element.displayName;

    questionElement.className = this.allowDynamicLayout
      ? questionElementClassName + " " + questionLayoutedElementClassName
      : questionElementClassName;
    titleElement.className = questionElementClassName + "__title";
    if (this.allowDynamicLayout && this.allowDragDrop) {
      titleElement.className =
        titleElement.className +
        " " +
        questionElementClassName +
        "__title--draggable";
    }
    questionContent.className = questionElementClassName + "__content";
    questionContent.style.backgroundColor = this.backgroundColor;

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

  public renderContent(container: HTMLElement) {
    container.className += " sa-panel__content sa-grid";

    this.visibleElements.forEach((element) => {
      let questionElement = this.renderPanelElement(element, container);
    });

    this.layoutEngine.start(container);
    // !!window && window.dispatchEvent(new UIEvent("resize"));
  }

  protected destroyContent(container: HTMLElement) {
    this.layoutEngine.stop();
    super.destroyContent(container);
  }

  /**
   * Redraws the `VisualizationPanel` and all its content.
   */
  public refresh() {
    if (!!this.toolbarContainer) {
      this.destroyToolbar(this.toolbarContainer);
      this.renderToolbar(this.toolbarContainer);
    }
    super.refresh();
  }

  public layout() {
    this.layoutEngine.update();
  }

  /**
   * Filters visualized data based on a specified question name and value. This method is called when a user clicks a chart point.
   * @param questionName A question [name](https://surveyjs.io/form-library/documentation/api-reference/question#name).
   * @param selectedValue
   * @see IVisualizationPanelOptions.allowSelection
   */
  public setFilter(questionName: string, selectedValue: any) {
    this.dataProvider.setFilter(questionName, selectedValue);
  }

  public getState(): IState {
    return {
      locale: this.locale,
      elements: [].concat(this._elements.map(element => {
        const visualizer = this.getVisualizer(element.name);
        const elementState = { ...element, ...visualizer?.getState() };
        if (elementState.renderedElement !== undefined) {
          delete elementState.renderedElement;
        }
        return elementState;
      })),
    };
  }

  /**
   * The state of `VisualizationPanel`. Includes information about the visualized elements and current locale.
   * @see onStateChanged
   */
  public get state(): IState {
    return this.getState();
  }
  public set state(newState: IState) {
    if (!newState) return;
    this._settingState = true;
    try {

      if (Array.isArray(newState.elements)) {
        const questionNames = this.questions.map(q => q.name);
        this._elements = [].concat(newState.elements.filter(e => (questionNames.indexOf(e.name) !== -1)));
      }

      if (typeof newState.locale !== "undefined") this.setLocale(newState.locale);

      this._elements.forEach(elementState => {
        const visualizer = this.getVisualizer(elementState.name);
        if (visualizer !== undefined) {
          visualizer.setState(elementState);
        }
      });

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
