import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { ToolbarHelper } from "./utils/index";

export class AlternativeVisualizersWrapper extends VisualizerBase {
  constructor(
    private visualizers: Array<VisualizerBase>,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    if(!visualizers || visualizers.length < 2) {
      throw new Error("VisualizerArrayWrapper works with visualizers collection only.");
    }
    this.visualizer = visualizers[0];
  }

  protected visualizerContainer: HTMLElement
  private visualizer: VisualizerBase;

  private setVisualizer(name: string) {
    if(!!this.visualizer) {
      this.visualizer.destroy();
    }
    this.visualizer = this.visualizers.filter(v => v.name === name)[0];
    this.visualizer.render(this.visualizerContainer);
    this.invokeOnUpdate();
  }

  update(data: Array<{ [index: string]: any }>) {
    this.visualizer.update(data);
  }

  onUpdate: () => void;

  destroy() {
    this.visualizer.destroy();
    super.destroy();
  }

  protected renderContent(container: HTMLDivElement) {
    this.visualizerContainer = container;
    this.visualizer.render(this.visualizerContainer);
  }

  protected createToolbarItems(toolbar: HTMLDivElement) {
    const selectWrapper = ToolbarHelper.createSelector(
      this.visualizers.map(visualizer => {
        return {
          value: visualizer.name,
          text: localization.getString("visualizer_" + visualizer.name)
        };
      }),
      (option: any) => this.visualizer.name === option.value,
      (e: any) => this.setVisualizer(e.target.value)
    );
    toolbar.appendChild(selectWrapper);
    super.createToolbarItems(toolbar);
  }
}
