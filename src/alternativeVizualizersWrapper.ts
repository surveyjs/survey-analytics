import { Question, ItemValue } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils/index";
import { VisualizationManager } from "./visualizationManager";
import { IVisualizerWithSelection } from "./selectBase";

export class AlternativeVisualizersWrapper
  extends VisualizerBase
  implements IVisualizerWithSelection {
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
      DocumentHelper.createSelector(
        this.visualizers.map((visualizer) => {
          return {
            value: visualizer.name,
            text: localization.getString("visualizer_" + visualizer.name),
          };
        }),
        (option: any) => this.visualizer.name === option.value,
        (e: any) => this.setVisualizer(e.target.value)
      )
    );

    this.visualizer = visualizers[0];
    this.visualizer.onAfterRender.add(this.onAfterVisualizerRenderCallback);
  }

  protected visualizerContainer: HTMLElement;
  private visualizersWithSelection: Array<IVisualizerWithSelection> = [];
  private selectedItem: ItemValue;
  private visualizer: VisualizerBase;

  private onAfterVisualizerRenderCallback = () => {
    this.afterRender(this.contentContainer);
  };

  private setVisualizer(name: string) {
    if (!!this.visualizer) {
      this.visualizer.onAfterRender.remove(
        this.onAfterVisualizerRenderCallback
      );
      this.visualizer.destroy();
    }
    this.visualizer = this.visualizers.filter((v) => v.name === name)[0];
    this.refresh();
    this.visualizer.onAfterRender.add(this.onAfterVisualizerRenderCallback);
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

  destroy() {
    this.visualizers.forEach((visualizer) => {
      visualizer.onAfterRender.remove(this.onAfterVisualizerRenderCallback);
      visualizer.onUpdate = undefined;
    });
    this.visualizer.destroy();
    super.destroy();
  }
}

VisualizationManager.registerAlternativesVisualizer(
  AlternativeVisualizersWrapper
);
