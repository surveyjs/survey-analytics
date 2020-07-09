import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";

declare type VisualizerConstructor = new (
  targetElement: HTMLElement,
  question: Question,
  data: Array<{ [index: string]: any }>,
  options?: Object
) => any;

export class VisualizationManager {
  static vizualizers: { [index: string]: Array<VisualizerConstructor> } = {};
  static registerVisualizer(
    typeName: string,
    constructor: VisualizerConstructor
  ) {
    let vizualizers = VisualizationManager.vizualizers[typeName];
    if (!vizualizers) {
      vizualizers = [];
      VisualizationManager.vizualizers[typeName] = vizualizers;
    }
    vizualizers.push(constructor);
  }
  static getVisualizersByType(typeName: string) {
    let vizualizers = VisualizationManager.vizualizers[typeName];
    if (!vizualizers) {
      return [VisualizerBase];
    }
    return vizualizers;
  }
}
