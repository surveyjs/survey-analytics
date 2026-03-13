import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { chartConfig, getChartTypes, getVisualizerTypes } from "./chartConfig";
import { VisualizationManager } from "./visualizationManager";
import { IVisualizerPanelRenderedElement, PanelElement } from "./visualizationPanel";
import { AlternativeVisualizersWrapper } from "./alternativeVizualizersWrapper";
import { VisualizerFactory } from "./visualizerFactory";

export interface IDashboardItem {
  dataField: string;
  name?: string;
  type?: string;
  availableTypes?: string[];
  title?: string;
  allowChangeType?: boolean;
  displayValueName?: string;
  // visualizer?: VisualizerBase;
  options?: { [index: string]: any };
}

export class DashboardItem extends PanelElement implements IDashboardItem, IVisualizerPanelRenderedElement {
  private _visualizerType: string;
  private _availableTypes: { [index: string]: string[] };
  private _availableTypesOverride?: string[];
  private _initialAvailableTypes?: string[];
  private _type: string;
  private _dataField: string;

  private static areTypesEqual(left?: string[], right?: string[]): boolean {
    return (left || []).join("|") === (right || []).join("|");
  }

  private captureVisualizerContext() {
    const currentVisualizer = this.visualizer;
    return {
      visualizer: currentVisualizer,
      state: currentVisualizer?.getState?.(),
      onUpdate: currentVisualizer?.onUpdate,
      options: currentVisualizer?.options,
      data: (currentVisualizer as any)?.data || [],
      renderTarget: (currentVisualizer as any)?.renderResult as HTMLElement,
    };
  }

  private recreateVisualizer(context: ReturnType<DashboardItem["captureVisualizerContext"]>): void {
    if(!context.visualizer) {
      return;
    }

    const newVisualizer = VisualizerFactory.createVisualizer(this, context.data, context.options);
    if(!newVisualizer) {
      return;
    }

    newVisualizer.onUpdate = context.onUpdate;
    this.visualizer = newVisualizer;
    if(context.state) {
      newVisualizer.setState(context.state);
    }
    if(!!this.renderedElement && !!context.renderTarget) {
      newVisualizer.render(context.renderTarget, false);
    }
  }

  /**
   * Configuration object used to initialize and re-create the dashboard item visualizer.
   */
  constructor(public readonly options: IDashboardItem, public question?: Question) {
    super(options?.name || question?.name || options?.dataField, question?.title || options?.title);
    this._initialAvailableTypes = options?.availableTypes?.slice();
    this.initialize();
  }

  allowChangeType?: boolean;

  private isQuestionWithType(): boolean {
    return !!this.question && typeof (this.question as any).getType === "function";
  }

  private getQuestionVisualizerType(questionType: string): string {
    return questionType === "text" ? (<any>this.question).inputType : questionType;
  }

  private getQuestionVisualizerTypes(questionType: string): string[] {
    const visualizerType = this.getQuestionVisualizerType(questionType);
    if(questionType === "text" && (<any>this.question).inputType) {
      return VisualizationManager.getVisualizerNamesByType((<any>this.question).inputType, questionType);
    }
    return VisualizationManager.getVisualizerNamesByType(visualizerType);
  }

  private setFallbackVisualizerType(visualizerType: string, requestedDashboardItemType?: string): void {
    if(!this._visualizerType && !!requestedDashboardItemType) {
      this._visualizerType = requestedDashboardItemType;
      if(this.visualizerTypes.indexOf(this._visualizerType) === -1) {
        this.visualizerTypes.push(this._visualizerType);
      }
    }
    if(!this._visualizerType) {
      this.visualizerTypes = VisualizationManager.getVisualizerNamesByType(visualizerType);
      this._visualizerType = this.visualizerTypes[0];
    }
  }

  private initializeFromQuestion(configuredAvailableTypes: string[] | undefined, requestedDashboardItemType: string): void {
    const questionType = this.question.getType();
    const visualizerType = this.getQuestionVisualizerType(questionType);
    this.visualizerTypes = this.getQuestionVisualizerTypes(questionType);

    this._availableTypes = {};
    this.visualizerTypes.forEach(vt => {
      let chartTypes = VisualizerBase.chartAdapterType ? VisualizerBase.chartAdapterType.getChartTypesByVisualizerType(vt) : [];
      if(!!configuredAvailableTypes && configuredAvailableTypes.length > 0) {
        chartTypes = chartTypes.filter(chType => configuredAvailableTypes.indexOf(chType) !== -1 || chType === this.options.type);
      }
      if(chartTypes.length === 0) {
        return;
      }
      this._availableTypes[vt] = chartTypes.slice();
      if(!this._visualizerType && chartTypes.indexOf(requestedDashboardItemType) !== -1) {
        this._visualizerType = vt;
        this.chartType = requestedDashboardItemType;
      }
    });

    this.visualizerTypes = this.visualizerTypes.filter(vt => !!this._availableTypes[vt] && this._availableTypes[vt].length > 0);
    this.setFallbackVisualizerType(visualizerType, requestedDashboardItemType);
  }

  private initializeFromDescriptor(configuredAvailableTypes: string[] | undefined, requestedDashboardItemType: string): void {
    const config = chartConfig[requestedDashboardItemType];
    this._visualizerType = config?.visualizerType || requestedDashboardItemType;
    this.chartType = config?.chartType;
    this.visualizerTypes = getVisualizerTypes(configuredAvailableTypes);
    this._availableTypes = getChartTypes(configuredAvailableTypes);
  }

  private findVisualizerAndChartType(type: string): { visualizerType?: string, chartType?: string } {
    for(const vt in this._availableTypes || {}) {
      if((this._availableTypes[vt] || []).indexOf(type) !== -1) {
        return { visualizerType: vt, chartType: type };
      }
    }
    return {};
  }

  /**
   * Returns the current active visualizer.
   * If the visualizer is an instance of AlternativeVisualizersWrapper, it returns the wrapped visualizer.
   * @returns The current active visualizer.
   */
  public getVisualizer(): any {
    let currentVisualizer = this.visualizer;
    if(currentVisualizer instanceof AlternativeVisualizersWrapper) {
      currentVisualizer = currentVisualizer.getVisualizer();
    }
    return currentVisualizer;
  }

  private applyChartTypeToActiveVisualizer(chartType: string): void {
    const currentVisualizer = this.getVisualizer();
    if(currentVisualizer && typeof currentVisualizer["setChartType"] === "function") {
      currentVisualizer["setChartType"](chartType);
    }
  }

  private synchronizeTypeWithAvailableTypes(requestedDashboardItemType: string): void {
    this._type = requestedDashboardItemType || this.availableTypes[0];
    if(this.availableTypes.length > 0 && this.availableTypes.indexOf(this._type) === -1 && this._type !== this._visualizerType) {
      this._type = this.availableTypes[0];
    }

    const currentVisualizerTypes = (this._availableTypes || {})[this._visualizerType] || [];
    const shouldAlignVisualizerByType = (!this._visualizerType || currentVisualizerTypes.indexOf(this._type) === -1)
      && this._type !== this._visualizerType;
    if(shouldAlignVisualizerByType) {
      const match = this.findVisualizerAndChartType(this._type);
      if(!!match.visualizerType) {
        this._visualizerType = match.visualizerType;
        this.chartType = match.chartType;
      }
    }
  }

  private ensureSyntheticQuestion(): void {
    if(!this.question) {
      this.question = {
        name: this.name,
        valueName: this.dataField,
        title: this.options.title,
        displayValueName: this.options.displayValueName,
        waitForQuestionIsReady: () => {
          return new Promise<void>((resolve) => resolve());
        }
      } as any;
    }
  }

  private getConfiguredAvailableTypes(): string[] | undefined {
    return this._availableTypesOverride === undefined ? this._initialAvailableTypes : this._availableTypesOverride;
  }

  private initialize(requestedType?: string) {
    const configuredAvailableTypes = this.getConfiguredAvailableTypes();
    const requestedDashboardItemType = requestedType || this.options.type || (configuredAvailableTypes || [])[0];

    this._visualizerType = undefined;
    this.chartType = undefined;
    if(this.isQuestionWithType()) {
      this.initializeFromQuestion(configuredAvailableTypes, requestedDashboardItemType);
    } else {
      this.initializeFromDescriptor(configuredAvailableTypes, requestedDashboardItemType);
    }

    this.synchronizeTypeWithAvailableTypes(requestedDashboardItemType);
    this._dataField = this.options.dataField;
    this.title = this.options.title;
    this.ensureSyntheticQuestion();
  }

  private getDataField() {
    return this.question?.valueName || this.question?.name || this.questionName || this.name;
  }

  protected getStateProperties(): string[] {
    return ["type"].concat(super.getStateProperties());
  }

  /**
   * The `changeType` method is called to update the visualizer and chart type accordingly.
   *
   * The `changeType` method checks the available types for the current visualizer and updates the
   * visualizer and chart type if the new type is valid. This ensures that the dashboard item always
   * has a valid type that is compatible with the available visualizers.
   */
  private changeType(newType: string) {
    const match = this.findVisualizerAndChartType(newType);
    if(match.visualizerType && match.chartType) {
      this.visualizerType = match.visualizerType;
      this.applyChartTypeToActiveVisualizer(match.chartType);
    }
    this._type = newType;
  }

  get visualizerType(): string {
    return this._visualizerType;
  }
  set visualizerType(value: string) {
    if(this._visualizerType !== value) {
      this._visualizerType = value;
      if(this.visualizer instanceof AlternativeVisualizersWrapper) {
        this.visualizer.setVisualizer(value);
        const currentVisualizer = this.visualizer.getVisualizer();
        if(!!currentVisualizer) {
          this._type = (currentVisualizer as any).chartType;
        }
      }
    }
  }
  visualizerTypes?: string[];
  chartType?: string;
  questionName?: string;
  displayValueName?: string;

  /**
   * Gets the list of chart types available for this dashboard item.
   *
   * The list is aggregated across all compatible visualizer types.
   */
  get availableTypes(): string[] {
    const at = [];
    for(const key in this._availableTypes || {}) {
      at.push(...(this._availableTypes[key] || []));
    }
    return at;
  }
  set availableTypes(value: string[]) {
    const normalizedValue = Array.isArray(value) ? value.slice() : undefined;
    const currentValue = this.getConfiguredAvailableTypes();
    if(DashboardItem.areTypesEqual(currentValue, normalizedValue)) {
      return;
    }

    const currentType = this._type;
    const context = this.captureVisualizerContext();

    this._availableTypesOverride = normalizedValue;

    if(context.visualizer) {
      context.visualizer.destroy();
      this.visualizer = undefined;
    }

    // Keep all availability/type synchronization rules in one place.
    this.initialize(currentType);
    this.recreateVisualizer(context);
  }
  /**
   * Gets or sets the current dashboard item type.
   *
   * Setting this property updates the active visualizer and chart type when the specified value is supported.
   */
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    if(this._type !== value) {
      this.changeType(value);
    }
  }
  /**
   * Gets or sets the data field name used by this dashboard item.
   */
  get dataField(): string | undefined {
    return this._dataField || this.getDataField();
  }
  set dataField(value: string | undefined) {
    this._dataField = value;
  }
  /**
   * Gets or sets the dashboard item title displayed in the panel.
   */
  get title(): string {
    return this.displayName;
  }
  set title(value: string) {
    this.displayName = value;
  }
}
