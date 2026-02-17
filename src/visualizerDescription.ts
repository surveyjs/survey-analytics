import { Question } from "survey-core";
import { IVisualizerOptions, VisualizerBase } from "./visualizerBase";
import { chartConfig, getChartTypes, getVisualizerTypes } from "./chartConfig";
import { VisualizationManager } from "./visualizationManager";

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

export function getDataName(description: Question | IVisualizerDescription) {
  return description["name"] || description.question?.name || description.dataName || description.questionName;
}

export function createVisualizerDescription(vOptions: IVisualizerOptions, question: Question): IVisualizerDescription {
  const inputType = vOptions.type || (vOptions.availableTypes || [])[0];
  let visualizerType;
  let chartType;
  let visualizerTypes;
  let availableTypes;

  if(question) {
    const qType = question.getType();
    const vType = qType === "text" ? (<any>question).inputType : qType;
    visualizerTypes = VisualizationManager.getVisualizerNamesByType(vType);
    if(qType === "text" && (<any>question).inputType) {
      visualizerTypes = VisualizationManager.getVisualizerNamesByType((<any>question).inputType, qType);
    }

    availableTypes = {};
    visualizerTypes.forEach(vt => {
      let vct = availableTypes[vt];
      if(vct === undefined) {
        vct = [];
        availableTypes[vt] = vct;
      }
      if(VisualizerBase.chartAdapterType) {
        let chartTypes = VisualizerBase.chartAdapterType.getChartTypesByVisualizerType(vt);
        if(!!vOptions.availableTypes && vOptions.availableTypes.length > 0) {
          chartTypes = chartTypes.filter(chType => (vOptions.availableTypes || []).indexOf(chType) !== -1 || chType === vOptions.type);
        }
        chartTypes.forEach(chType => {
          vct.push(chType);
          if(chType === inputType && !visualizerType) {
            visualizerType = vt;
            chartType = chType;
          }
        });
        /*
        if(!vOptions.type && !vOptions.availableTypes) {
          chartTypes.forEach(chType => vct.push(chType));
          visualizerType = vt;
        } else {
          chartTypes.filter(chType => (vOptions.availableTypes || []).indexOf(chType) !== -1 || chType === vOptions.type)
            .forEach(chType => {
              vct.push(chType);
              if(chType === inputType && !visualizerType) {
                visualizerType = vt;
                chartType = chType;
              }
            });
        }*/
      }
    });
    Object.keys(availableTypes).forEach(key => {
      if(availableTypes[key].length === 0) {
        delete availableTypes[key];
        visualizerTypes.splice(visualizerTypes.indexOf(key), 1);
      }
    });
    if(!visualizerType && !!inputType) {
      visualizerType = inputType;
      if(visualizerTypes.indexOf(visualizerType) === -1) {
        visualizerTypes.push(visualizerType);
      }
    }
  } else {
    const config = chartConfig[inputType];
    visualizerType = config?.visualizerType || inputType;
    chartType = config?.chartType;
    visualizerTypes = getVisualizerTypes(vOptions.availableTypes);
    availableTypes = getChartTypes(vOptions.availableTypes);
  }
  const vd = {
    visualizerType,
    chartType,
    visualizerTypes,
    availableTypes,
    question,
    dataName: vOptions.dataField,
    title: vOptions.title,
    options: {}
  } as IVisualizerDescription;

  const rootOptions = Object.keys(vd);
  Object.keys(vOptions).forEach((key) => {
    if(!(key in rootOptions)) {
      vd.options[key] = vOptions[key];
    }
  });
  return vd;
}