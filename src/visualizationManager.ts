import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";

declare type VisualizerConstructor = new (
  question: Question,
  data: Array<{ [index: string]: any }>,
  options?: Object
) => any;

/**
 * An object with methods used to register and unregister visualizers for individual question types.
 *
 * [View Demo](https://surveyjs.io/dashboard/examples/visualize-answers-from-text-entry-fields-with-charts/ (linkStyle))
 */
export class VisualizationManager {
  static alternativesVisualizer: any = undefined;
  static vizualizers: { [index: string]: Array<VisualizerConstructor> } = {};
  /**
   * Registers a visualizer for a specified question type.
   *
   * [View Demo](https://surveyjs.io/dashboard/examples/visualize-answers-from-text-entry-fields-with-charts/ (linkStyle))
   * @param questionType A question [type](https://surveyjs.io/form-library/documentation/api-reference/question#getType).
   * @param constructor A function that returns a visualizer constructor to register.
   */
  public static registerVisualizer(
    questionType: string,
    constructor: VisualizerConstructor
  ) {
    let visualizers = VisualizationManager.vizualizers[questionType];
    if (!visualizers) {
      visualizers = [];
      VisualizationManager.vizualizers[questionType] = visualizers;
    }
    visualizers.push(constructor);
  }
  /**
   * Unregisters a visualizer for a specified question type.
   *
   * [View Demo](https://surveyjs.io/dashboard/examples/visualize-answers-from-text-entry-fields-with-charts/ (linkStyle))
   * @param questionType A question [type](https://surveyjs.io/form-library/documentation/api-reference/question#getType).
   * @param constructor A function that returns a visualizer constructor to unregister.
   */
  public static unregisterVisualizer(
    questionType: string,
    constructor: VisualizerConstructor
  ) {
    let visualizers = VisualizationManager.vizualizers[questionType];
    if (!!visualizers) {
      let index = visualizers.indexOf(constructor);
      if (index !== -1) {
        visualizers.splice(index, 1);
      }
    }
  }
  /**
   * Unregisters a visualizer for all question types.
   * @param constructor A function that returns a visualizer constructor to unregister.
   */
  public static unregisterVisualizerForAll(constructor: VisualizerConstructor) {
    Object.keys(VisualizationManager.vizualizers).forEach((key) =>
      VisualizationManager.unregisterVisualizer(key, constructor)
    );
  }
  /**
   * Returns all visualizer constructors for a specified question type.
   * @param questionType A question [type](https://surveyjs.io/form-library/documentation/api-reference/question#getType).
   */
  public static getVisualizersByType(
    questionType: string
  ): VisualizerConstructor[] {
    let visualizers = VisualizationManager.vizualizers[questionType];
    if (!visualizers) {
      return [VisualizerBase];
    }
    return visualizers;
  }
  /**
   * Returns a constructor for an alternative visualizer selector.
   * @see registerAlternativesVisualizer
   */
  public static getAlternativesVisualizer() {
    return VisualizationManager.alternativesVisualizer || VisualizerBase;
  }
  /**
   * Registers an alternative visualizer selector.
   * @param constructor A function that returns a constructor for an alternative visualizer selector.
   */
  public static registerAlternativesVisualizer(constructor: any) {
    VisualizationManager.alternativesVisualizer = constructor;
  }
}
