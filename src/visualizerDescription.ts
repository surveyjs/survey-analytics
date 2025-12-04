import { Question } from "survey-core";

export interface IVisualizerDescription {
  visualizerType: string;
  chartType?: string;
  question?: Question;
  questionName?: string;
  dataName?: string;
  displayValueName?: string;
  title?: string;
  options?: { [index: string]: any };
}