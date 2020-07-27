import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { AlternativeVisualizersWrapper } from "./alternativeVizualizersWrapper";

declare type VisualizerConstructor = new (
  question: Question,
  data: Array<{ [index: string]: any }>,
  options?: Object
) => any;

export class VisualizerFactory {
  /**
   * Create visualizer by question.
   */
  public static createVizualizer(
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
      let visualizer = new AlternativeVisualizersWrapper(
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
