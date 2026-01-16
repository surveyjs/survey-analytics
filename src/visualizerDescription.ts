import { Question } from "survey-core";

export interface IVisualizerDescription {
  visualizerType: string;
  visualizerTypes?: Array<string>;
  chartType?: string;
  availableTypes?: any;
  question?: Question;
  questionName?: string;
  dataName?: string;
  displayValueName?: string;
  title?: string;
  options?: { [index: string]: any };
}

export function getDataName(description: Question | IVisualizerDescription) {
  return description["name"] || description.question?.name || description.dataName || description.questionName;
}
