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
  public static unregisterVisualizer(questionType: string | undefined, constructor: VisualizerConstructor): void {
    let questionTypes = [questionType];
    if(!questionType) {
      questionTypes = Object.keys(VisualizationManager.vizualizers);
    }
    questionTypes.forEach(qType => {
      let visualizers = VisualizationManager.vizualizers[qType];
      if (!!visualizers) {
        let index = visualizers.indexOf(constructor);
        if (index !== -1) {
          visualizers.splice(index, 1);
        }
      }
    });
  }
  /**
   * Unregisters a visualizer for all question types.
   * @deprecated in favor of unregisterVisualizer method with undefiend first parameter
   * @param constructor A function that returns a visualizer constructor to unregister.
   */
  public static unregisterVisualizerForAll(constructor: VisualizerConstructor): void {
    VisualizationManager.unregisterVisualizer(undefined, constructor);
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
   * @see registerAltVisualizerSelector
   */
  public static getAltVisualizerSelector() {
    return VisualizationManager.alternativesVisualizer || VisualizerBase;
  }
  /**
   * Registers an alternative visualizer selector.
   * @param constructor A function that returns a constructor for an alternative visualizer selector.
   */
  public static registerAltVisualizerSelector(constructor: any) {
    VisualizationManager.alternativesVisualizer = constructor;
  }
}
