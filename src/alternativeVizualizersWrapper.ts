import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils/index";
import { VisualizationManager } from "./visualizationManager";

export class AlternativeVisualizersWrapper extends VisualizerBase {
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
  }

  protected visualizerContainer: HTMLElement;
  private visualizer: VisualizerBase;

  private setVisualizer(name: string) {
    if (!!this.visualizer) {
      this.visualizer.destroy();
    }
    this.visualizer = this.visualizers.filter((v) => v.name === name)[0];
    this.refresh();
  }

  updateData(data: Array<{ [index: string]: any }>) {
    super.updateData(data);
    this.visualizers.forEach((visualizer) => {
      visualizer.updateData(data);
    });
    this.refresh();
  }

  protected renderContent(container: HTMLElement) {
    this.visualizerContainer = container;
    this.visualizer.render(this.visualizerContainer);
  }

  destroy() {
    this.visualizers.forEach((visualizer) => {
      visualizer.onUpdate = undefined;
    });
    this.visualizer.destroy();
    super.destroy();
  }
}

VisualizationManager.registerAlternativesVisualizer(
  AlternativeVisualizersWrapper
);
