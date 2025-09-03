import { Question } from "survey-core";

export interface IVisualizerDescription {
  visualizerType: string;
  question?: Question;
  questionName?: string;
  dataName?: string;
  title?: string;
}