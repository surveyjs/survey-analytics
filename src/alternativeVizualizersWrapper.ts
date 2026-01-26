import { Question, ItemValue, Event } from "survey-core";
import { ICalculationResult, IChartAdapter, VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DocumentHelper, IDropdownItemOption } from "./utils/index";
import { VisualizationManager } from "./visualizationManager";
import { IVisualizerWithSelection } from "./selectBase";
import { chartConfig, getVisualizerNameByType } from "./chartConfig";

export class AlternativeVisualizersWrapper
  extends VisualizerBase
  implements IVisualizerWithSelection {

  private visualizerSelector: HTMLDivElement;

  private updateVisualizerSelector() {
    if(!!this.visualizerSelector) {
      (this.visualizerSelector as any).setValue(this.visualizer["chartType"] || this.visualizer.type);
    }
  }

  private getVisualizerSwitchItems(): Array<IDropdownItemOption> {
    const result: Array<IDropdownItemOption> = [];

    this.visualizers.forEach((visualizer) => {
      if(!!visualizer["chartTypes"] && visualizer["chartTypes"].length > 0) {
        visualizer["chartTypes"].forEach(chType => {
          result.push({
            value: chType,
            visualizerType: visualizer.type,
            text: localization.getString("visualizer_" + visualizer.type) + " - " + localization.getString("chartType_" + chType),
          });
        });
      } else {
        result.push({
          value: visualizer.type,
          visualizerType: visualizer.type,
          text: localization.getString("visualizer_" + visualizer.type),
        });
      }
    });

    return result;
  }

  private _setVisualizer(options: { value: string, visualizerType?: string }, quiet = false): void {
    let visualizerCandidate = this.visualizers.filter((v) => v.type === options.value)[0];
    let chartType: string;
    let visualizerType = options.visualizerType;

    if(!visualizerCandidate) {
      let vCandidates = this.visualizers.filter(v => v["chartTypes"] && v["chartTypes"].indexOf(options.value) !== -1);
      if(vCandidates.length === 1) {
        visualizerCandidate = vCandidates[0];
        chartType = options.value;
      } else if(vCandidates.length > 1) {
        vCandidates = vCandidates.filter(v => v.type === visualizerType);
        visualizerCandidate = vCandidates[0];
        chartType = options.value;
      } else if(!!chartConfig[options.value]) {
        chartType = chartConfig[options.value].chartType;
        visualizerType = chartConfig[options.value].visualizerType;
        visualizerCandidate = this.visualizers.filter((v) => v.type === visualizerType)[0];
      }
    }
    if(!!visualizerCandidate && visualizerCandidate !== this.visualizer) {
      let isFooterCollapsed;
      if(!!this.visualizer) {
        isFooterCollapsed = this.visualizer.isFooterCollapsed;
        this.visualizer.onStateChanged.remove(this.onVisualizerStateChangedCallback);
        this.visualizer.onAfterRender.remove(this.onAfterVisualizerRenderCallback);
        this.visualizer.destroy();
      }
      this.visualizer = visualizerCandidate;
      this.visualizer.isFooterCollapsed = isFooterCollapsed;
      this.refresh();
      this.visualizer.onAfterRender.add(this.onAfterVisualizerRenderCallback);
      this.visualizer.onStateChanged.add(this.onVisualizerStateChangedCallback);
      if(!quiet) {
        this.onVisualizerChanged.fire(this, { visualizer: this.visualizer });
        this.stateChanged("visualizer", visualizerType);
      }
      this.updateVisualizerSelector();
    }
    if(chartType && !!this.visualizer && !!this.visualizer["setChartType"]) {
      this.visualizer["setChartType"](chartType);
      this.updateVisualizerSelector();
    }
  }

  constructor(
    private visualizers: Array<VisualizerBase>,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options, "alternative");
    this.showToolbar = false;
    this.loadingData = false;
    if(!visualizers || visualizers.length < 2) {
      throw new Error(
        "VisualizerArrayWrapper works with visualizers collection only."
      );
    }
    this.visualizers.forEach((visualizer) => {
      visualizer.onUpdate = () => this.invokeOnUpdate();
      visualizer.onGetToolbarItemCreators = () => this.toolbarItemCreators;
      if(visualizer.supportSelection) {
        this._supportSelection = true;
        this.visualizersWithSelection.push(
          <IVisualizerWithSelection>(<any>visualizer)
        );
      }
    });

    if(this.options.allowChangeVisualizerType !== false) {
      this.registerToolbarItem("changeVisualizer", () =>
        this.visualizerSelector = DocumentHelper.createDropdown(
          this.getVisualizerSwitchItems(),
          (option: any) => {
            if(!!this.visualizer["chartTypes"] && this.visualizer["chartTypes"].length > 0) {
              return this.visualizer.type === option.visualizerType && this.visualizer["chartType"] === option.value;
            } else {
              return this.visualizer.type === option.visualizerType;
            }
          },
          (e: any, selectedOption: any) => this._setVisualizer(selectedOption, false)
        ), "dropdown", 0
      );
    }

    this.visualizer = visualizers[0];
    this.visualizer.onAfterRender.add(this.onAfterVisualizerRenderCallback);
    this.visualizer.onStateChanged.add(this.onVisualizerStateChangedCallback);
  }

  protected visualizerContainer: HTMLElement;

  protected onDataChanged(): void {
  }

  public get hasFooter(): boolean {
    return false;
  }

  public getVisualizers() {
    return this.visualizers;
  }

  public getChartAdapter(): IChartAdapter {
    return this.visualizer.getChartAdapter();
  }

  private visualizersWithSelection: Array<IVisualizerWithSelection> = [];
  private selectedItem: ItemValue;
  private visualizer: VisualizerBase;

  private onAfterVisualizerRenderCallback = () => {
    this.afterRender(this.contentContainer);
  };
  private onVisualizerStateChangedCallback = (s, options) => {
    this.stateChanged("visualizer", options);
  };

  /**
   * The event is fired right after AlternativeVisualizersWrapper content type has been changed.
   **/
  public onVisualizerChanged: Event<
    (sender: AlternativeVisualizersWrapper, options: any) => any,
    AlternativeVisualizersWrapper,
    any
  > = new Event<(sender: AlternativeVisualizersWrapper, options: any) => any, AlternativeVisualizersWrapper, any>();

  /**
   * This method selects visualizer to show by it name.
  *
  * parameters:
  * name - the name of visualizer to show,
  * quiet - set it to true if you don't want to rise a notification event
  *
  **/
  public setVisualizer(type: string, quiet = false): void {
    this._setVisualizer({ value: type }, quiet);
  }

  public getVisualizer(): VisualizerBase {
    return this.visualizer;
  }

  updateData(data: Array<{ [index: string]: any }>) {
    super.updateData(data);
    this.visualizers.forEach((visualizer) => {
      visualizer.updateData(data);
    });
  }

  public set onDataItemSelected(
    val: (selectedValue: any, selectedText: string) => void
  ) {
    this.visualizersWithSelection.forEach((visualizer) => {
      visualizer.onDataItemSelected = val;
    });
  }

  setSelection(item: ItemValue) {
    this.visualizersWithSelection.forEach((visualizer) => {
      visualizer.setSelection(item);
    });
  }

  get selection() {
    return (<any>this.visualizer).selection || this.selectedItem;
  }

  protected renderContent(container: HTMLElement): void {
    this.visualizerContainer = container;
    this.visualizer.render(this.visualizerContainer, false);
  }

  protected setBackgroundColorCore(color: string) {
    super.setBackgroundColorCore(color);
    this.visualizers.forEach(visualizer => visualizer.backgroundColor = color);
  }

  /**
   * Returns an object with properties that describe a current visualizer state. The properties are different for each individual visualizer.
   *
   * > This method is overriden in descendant classes.
   * @see setState
   * @see resetState
   */
  public getState(): any {
    const currentVisualizerState = this.visualizer.getState();
    const state: any = {
      visualizer: this.visualizer.type,
    };
    if(Object.keys(currentVisualizerState).length > 0) {
      state.state = currentVisualizerState;
    }
    return state;
  }
  /**
   * Sets the visualizer's state.
   *
   * @see getState
   * @see resetState
   */
  public setState(state: any): void {
    if(!!state.visualizer) {
      this.setVisualizer(state.visualizer, true);
    }
    if(!!state.state) {
      this.visualizer.setState(state.state);
    }
  }
  /**
   * Resets the visualizer's state.
   *
   * @see getState
   * @see setState
   */
  public resetState(): void {
    super.resetState();
    this.visualizers.forEach(visualizer => visualizer.resetState());
    this.setVisualizer(this.visualizers[0].type, true);
  }

  getValues(): Array<any> {
    return this.visualizer.getValues();
  }

  getLabels(): Array<string> {
    return this.visualizer.getLabels();
  }

  public getCalculatedValues(): Promise<ICalculationResult> {
    return this.visualizer.getCalculatedValues();
  }

  protected onThemeChanged(): void {
    super.onThemeChanged();
    this.visualizers.forEach(v => {
      v.theme = this.theme;
    });
  }

  destroy() {
    this.visualizers.forEach((visualizer) => {
      visualizer.onAfterRender.remove(this.onAfterVisualizerRenderCallback);
      visualizer.onStateChanged.remove(this.onVisualizerStateChangedCallback);
      visualizer.onUpdate = undefined;
    });
    this.visualizer.destroy();
    super.destroy();
  }
}

VisualizationManager.registerAltVisualizerSelector(
  AlternativeVisualizersWrapper
);
