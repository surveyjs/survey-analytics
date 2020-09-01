import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";

declare type VisualizerConstructor = new (
  question: Question,
  data: Array<{ [index: string]: any }>,
  options?: Object
) => any;

export class VisualizationManager {
  static alternativesVisualizer: any = undefined;
  static vizualizers: { [index: string]: Array<VisualizerConstructor> } = {};
  /**
   * Register visualizer (constructor) for question type.
   */
  public static registerVisualizer(
    typeName: string,
    constructor: VisualizerConstructor
  ) {
    let visualizers = VisualizationManager.vizualizers[typeName];
    if (!visualizers) {
      visualizers = [];
      VisualizationManager.vizualizers[typeName] = visualizers;
    }
    visualizers.push(constructor);
  }
  /**
   * Unregister visualizer (constructor) for question type.
   */
  public static unregisterVisualizer(
    typeName: string,
    constructor: VisualizerConstructor
  ) {
    let visualizers = VisualizationManager.vizualizers[typeName];
    if (!!visualizers) {
      let index = visualizers.indexOf(constructor);
      if (index !== -1) {
        visualizers.splice(index, 1);
      }
    }
  }
  /**
   * Unregister visualizer (constructor) for all question types.
   */
  public static unregisterVisualizerForAll(constructor: VisualizerConstructor) {
    Object.keys(VisualizationManager.vizualizers).forEach((key) =>
      VisualizationManager.unregisterVisualizer(key, constructor)
    );
  }
  /**
   * Get visualizers (constructors) for question type.
   */
  public static getVisualizersByType(
    typeName: string
  ): VisualizerConstructor[] {
    let visualizers = VisualizationManager.vizualizers[typeName];
    if (!visualizers) {
      return [VisualizerBase];
    }
    return visualizers;
  }
  /**
   * Get visualizers (constructors) for question type.
   */
  public static getAlternativesVisualizer() {
    return VisualizationManager.alternativesVisualizer || VisualizerBase;
  }
  /**
   * Register visualizer (constructor) for question type.
   */
  public static registerAlternativesVisualizer(constructor: any) {
    VisualizationManager.alternativesVisualizer = constructor;
  }
}
