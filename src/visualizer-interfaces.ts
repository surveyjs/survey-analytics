import { Question } from "survey-core";

export interface IVisualizerOptions {
  dataField: string;
  type?: string;
  availableTypes?: string[];
  title?: string;
  allowChangeType?: boolean;
  answersOrder?: "default" | "asc" | "desc";
  [key: string]: any;
}

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
  answersOrder?: "default" | "asc" | "desc";
  options?: { [index: string]: any };
}