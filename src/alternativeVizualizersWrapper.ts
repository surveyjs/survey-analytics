import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";

export class AlternativeVizualizersWrapper extends VisualizerBase {
  constructor(
    private visualizers: Array<VisualizerBase>,
    targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
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
    const selectWrapper = document.createElement("div");
    selectWrapper.className = "sva-question__select-wrapper";
    const select = document.createElement("select");
    select.className = "sva-question__select";
    this.visualizers.forEach(visualizer => {
      let option = document.createElement("option");
      option.value = visualizer.name;
      option.text = localization.getString("visualizer_" + visualizer.name);
      option.selected = this.visualizer === visualizer;
      select.appendChild(option);
    });
    select.onchange = (e: any) => {
      this.setVisualizer(e.target.value);
    };
    selectWrapper.appendChild(select);
    toolbar.appendChild(selectWrapper);
  }

}
