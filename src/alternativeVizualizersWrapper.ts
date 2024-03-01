import { Question, ItemValue } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils/index";
import { VisualizationManager } from "./visualizationManager";
import { IVisualizerWithSelection } from "./selectBase";
import { Event } from "survey-core";

export class AlternativeVisualizersWrapper
  extends VisualizerBase
  implements IVisualizerWithSelection {

  private visualizerSelector: HTMLDivElement;

  private updateVisualizerSelector() {
    if (!!this.visualizerSelector) {
      this.visualizerSelector.getElementsByTagName(
        "select"
      )[0].value = this.visualizer.type;
    }
  }

  constructor(
    private visualizers: Array<VisualizerBase>,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    if (!visualizers || visualizers.length < 2) {
      throw new Error(
        "VisualizerArrayWrapper works with visualizers collection only."
      );
    }
    this.visualizers.forEach((visualizer) => {
      visualizer.onUpdate = () => this.invokeOnUpdate();
      if (visualizer.supportSelection) {
        this._supportSelection = true;
        this.visualizersWithSelection.push(
          <IVisualizerWithSelection>(<any>visualizer)
        );
      }
    });

    this.registerToolbarItem("changeVisualizer", () =>
      this.visualizerSelector = DocumentHelper.createSelector(
        this.visualizers.map((visualizer) => {
          return {
            value: visualizer.type,
            text: localization.getString("visualizer_" + visualizer.type),
          };
        }),
        (option: any) => this.visualizer.type === option.value,
        (e: any) => this.setVisualizer(e.target.value)
      )
    );

    this.visualizer = visualizers[0];
    this.visualizer.onAfterRender.add(this.onAfterVisualizerRenderCallback);
    this.visualizer.onStateChanged.add(this.onVisualizerStateChangedCallback);
  }

  protected visualizerContainer: HTMLElement;
  public get hasFooter(): boolean {
    return false;
  }

  public getVisualizers() {
    return this.visualizers;
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
    if (!!visualizerCandidate && visualizerCandidate !== this.visualizer) {
      if (!!this.visualizer) {
        this.visualizer.onStateChanged.remove(this.onVisualizerStateChangedCallback);
        this.visualizer.onAfterRender.remove(this.onAfterVisualizerRenderCallback);
        this.visualizer.destroy();
      }
      this.visualizer = visualizerCandidate;
      this.refresh();
      this.visualizer.onAfterRender.add(this.onAfterVisualizerRenderCallback);
      this.visualizer.onStateChanged.add(this.onVisualizerStateChangedCallback);
      if (!quiet) {
        this.onVisualizerChanged.fire(this, { visualizer: this.visualizer });
        this.stateChanged("visualizer", type);
      }
      this.updateVisualizerSelector();
    }
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

  protected renderContent(container: HTMLElement) {
    this.visualizerContainer = container;
    this.visualizer.render(this.visualizerContainer);
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
   * > This method is overriden in descendant classes.
   * @see getState
   */
  public setState(state: any): void {
    if(!!state.visualizer) {
      this.setVisualizer(state.visualizer, true);
    }
    if(!!state.state) {
      this.visualizer.setState(state.state);
    }
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
