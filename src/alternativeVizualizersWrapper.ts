import { Question, ItemValue } from "survey-core";
import { ICalculationResult, IChartAdapter, VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils/index";
import { VisualizationManager } from "./visualizationManager";
import { IVisualizerWithSelection } from "./selectBase";
import { Event } from "survey-core";
import { IDashboardTheme } from "./theme";

export class AlternativeVisualizersWrapper
  extends VisualizerBase
  implements IVisualizerWithSelection {

  private visualizerSelector: HTMLDivElement;

  private updateVisualizerSelector() {
    if(!!this.visualizerSelector) {
      (this.visualizerSelector as any).setValue(this.visualizer.type);
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
          this.visualizers.map((visualizer) => {
            return {
              value: visualizer.type,
              text: localization.getString("visualizer_" + visualizer.type),
            };
          }),
          (option: any) => this.visualizer.type === option.value,
          (e: any) => this.setVisualizer(e)
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
    const visualizerCandidate = this.visualizers.filter((v) => v.type === type)[0];
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
        this.stateChanged("visualizer", type);
      }
      this.updateVisualizerSelector();
    }
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
