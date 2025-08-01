import { Question } from "survey-core";

declare type VisualizerConstructor = new (
  question: Question,
  data: Array<{ [index: string]: any }>,
  options?: Object
) => any;

/**
 * An object with methods used to register and unregister visualizers for individual question types.
 *
 * [View Demo](https://surveyjs.io/dashboard/examples/custom-survey-data-visualizer/ (linkStyle))
 */
export class VisualizationManager {
  static defaultVisualizer: any = undefined;
  static alternativesVisualizer: any = undefined;
  static pivotVisualizer: any = undefined;
  static vizualizers: { [index: string]: Array<{ ctor: VisualizerConstructor, index: number }> } = {};
  /**
   * Registers a visualizer for a specified question type.
   *
   * [View Demo](https://surveyjs.io/dashboard/examples/custom-survey-data-visualizer/ (linkStyle))
   * @param questionType A question [type](https://surveyjs.io/form-library/documentation/api-reference/question#getType).
   * @param constructor A function that returns a visualizer constructor to register.
   * @param index A zero-based index that specifies the visualizer's position in the visualizer list for the specified question type. Pass `0` to insert the visualizer at the beginning of the list and use it by default. If `index` is not specified, the visualizer is added to the end of the list.
   */
  public static registerVisualizer(
    questionType: string,
    constructor: VisualizerConstructor,
    index = Number.MAX_VALUE
  ) {
    let visualizers = VisualizationManager.vizualizers[questionType];
    if (!visualizers) {
      visualizers = [];
      VisualizationManager.vizualizers[questionType] = visualizers;
    }
    visualizers.push({ ctor: constructor, index });
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
      if(constructor) {
        let visualizers = VisualizationManager.vizualizers[qType];
        if (!!visualizers) {
          const vDescr = visualizers.filter(v => v.ctor === constructor || v.ctor.isPrototypeOf(constructor))[0];
          if(!!vDescr) {
            let index = visualizers.indexOf(vDescr);
            if (index !== -1) {
              visualizers.splice(index, 1);
            }
          }
        }
      } else {
        VisualizationManager.vizualizers[qType] = [];
      }
    });
  }
  /**
   * @deprecated Call the [`unregisterVisualizer()`](https://surveyjs.io/dashboard/documentation/api-reference/visualizationmanager#unregisterVisualizer) method instead.
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
    let vDescrs = VisualizationManager.vizualizers[questionType];
    if (!vDescrs) {
      if(VisualizationManager.defaultVisualizer.suppressVisualizerStubRendering) {
        return [];
      }
      return [VisualizationManager.defaultVisualizer];
    }
    vDescrs = [].concat(vDescrs);
    vDescrs.sort((v1, v2) => v1.index - v2.index);
    return vDescrs.map(v => v.ctor);
  }
  /**
   * Returns a constructor for an alternative visualizer selector.
   * @see registerAltVisualizerSelector
   */
  public static getAltVisualizerSelector() {
    return VisualizationManager.alternativesVisualizer || VisualizationManager.defaultVisualizer;
  }
  /**
   * Registers an alternative visualizer selector.
   * @param constructor A function that returns a constructor for an alternative visualizer selector.
   */
  public static registerAltVisualizerSelector(constructor: any) {
    VisualizationManager.alternativesVisualizer = constructor;
  }
  public static getPivotVisualizerConstructor() {
    return VisualizationManager.pivotVisualizer || VisualizationManager.defaultVisualizer;
  }
  public static registerPivotVisualizer(constructor: any) {
    VisualizationManager.pivotVisualizer = constructor;
  }
}
