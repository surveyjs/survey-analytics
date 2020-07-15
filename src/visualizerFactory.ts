import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from './visualizationManager';
import { AlternativeVisualizersWrapper } from './alternativeVizualizersWrapper';

declare type VisualizerConstructor = new (
  targetElement: HTMLElement,
  question: Question,
  data: Array<{ [index: string]: any }>,
  options?: Object
) => any;

export class VisualizerFactory {
  static vizualizers: { [index: string]: Array<VisualizerConstructor> } = {};
  /**
   * Create visualizer by question.
   */
  public static createVizualizer(
    vizualizerElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>
  ): VisualizerBase {
    let type;

    if (question.getType() === "text" && question.inputType) {
      type = question.inputType;
    } else {
      type = question.getType();
    }

    var creators = VisualizationManager.getVisualizersByType(type);
    var visualizers = creators.map(
      (creator) => new creator(vizualizerElement, question, data)
    );
    if (visualizers.length > 1) {
      let visualizer = new AlternativeVisualizersWrapper(
        visualizers,
        vizualizerElement,
        question,
        data
      );
      return visualizer;
    }
    return visualizers[0];
  }
}
