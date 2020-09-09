import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";

/**
 * Visualizers factory. Creates visualizer for the given question.
 */
export class VisualizerFactory {
  /**
   * Create visualizer by question. You can pass data and options to the created visualizer as well.
   * If more then one visualizer are registered for the question, then they are combined using wrapper for showing alternative viaualizers.
   */
  public static createVisualizer(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: { [index: string]: any }
  ): VisualizerBase {
    let type;

    if (question.getType() === "text" && question.inputType) {
      type = question.inputType;
    } else {
      type = question.getType();
    }

    var creators = VisualizationManager.getVisualizersByType(type);
    var visualizers = creators.map(
      (creator) => new creator(question, data, options)
    );
    if (visualizers.length > 1) {
      const alternativesVisualizerConstructor = VisualizationManager.getAlternativesVisualizer();
      let visualizer = new alternativesVisualizerConstructor(
        visualizers,
        question,
        data,
        options
      );
      return visualizer;
    }
    return visualizers[0];
  }
}
