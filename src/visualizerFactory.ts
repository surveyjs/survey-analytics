import { Question, QuestionCompositeModel, QuestionCustomModel } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";

/**
 * An object that allows you to create individual visualizers without creating a [visualization panel](https://surveyjs.io/dashboard/documentation/api-reference/visualizationpanel).
 */
export class VisualizerFactory {
  /**
   * Creates a visualizer for a single question.
   *
   * ```js
   * import { VisualizerFactory } from "survey-analytics";
   *
   * const visualizer = new VisualizerFactory.createVisualizer(
   *   question,
   *   data,
   *   options
   * );
   *
   * visualizer.render("containerId")
   * ```
   *
   * If a question has more than one [registered](https://surveyjs.io/dashboard/documentation/api-reference/visualizationmanager#registerVisualizer) visualizer, users can switch between them using a drop-down menu.
   * @param question A question for which to create a visualizer.
   * @param data A data array with survey results to be visualized.
   * @param options An object with any custom properties you need within the visualizer.
   */
  public static createVisualizer(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: { [index: string]: any }
  ): VisualizerBase {
    let type = question.getType();
    let creators = [];
    let questionForCreator: Question | Question[] = question;
    let optionsForCreator = Object.assign({}, options);

    if(type === "text" && (<any>question).inputType) {
      creators = VisualizationManager.getVisualizersByType((<any>question).inputType, type);
    } else {
      let fallbackType = undefined;
      if(question instanceof QuestionCustomModel) {
        fallbackType = question.getDynamicType();
        // questionForCreator = question.contentQuestion;
      } else if(question instanceof QuestionCompositeModel) {
        fallbackType = "composite";
      }
      creators = VisualizationManager.getVisualizersByType(type, fallbackType);
    }

    var visualizers = creators.map(
      (creator) => new creator(questionForCreator, data, optionsForCreator)
    );
    if(visualizers.length > 1) {
      const alternativesVisualizerConstructor = VisualizationManager.getAltVisualizerSelector();
      let visualizer = new alternativesVisualizerConstructor(
        visualizers,
        questionForCreator,
        data,
        optionsForCreator
      );
      return visualizer;
    }
    return visualizers[0];
  }
}
