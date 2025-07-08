import { Question } from "survey-core";
import { defaultStatisticsCalculator, histogramStatisticsCalculator, mathStatisticsCalculator } from "./statisticCalculators";
import { VisualizationManager } from "./visualizationManager";
import { VisualizerBase } from "./visualizerBase";
import { DocumentHelper } from "./utils";
import { localization } from "./localizationManager";

export enum SurveyResultDataTypes { Number, Enum, Date, Text, Unknown }

export const AggregatorFunctions = {
  Categorial: defaultStatisticsCalculator,
  Continious: histogramStatisticsCalculator,
  Math: mathStatisticsCalculator,
};

export interface IVisualizationInfo {
  viewerType: string;
  aggregator: any;
}

const diagramTypes: { [key: string]: any } = {
  "defaultStatisticsCalculator": ["bar", "vbar", "stackedbar", "pie", "doughnut"],
  "histogramStatisticsCalculator": ["bar", "vbar"],
  "mathStatisticsCalculator": ["gauge", "bullet"],
};

export class VisualizerNew extends VisualizerBase {

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: any,
    name?: string
  ) {
    super(question, data, options, name || "simple");
    this.registerToolbarItem("changeViewerType", () => {
      if (this.viewerList.length > 1) {
        return DocumentHelper.createSelector(
          this.viewerList.map((viewer) => {
            return {
              value: viewer.viewerType,
              obj: viewer,
              text: localization.getString("viewerType_" + viewer.viewerType),
            };
          }),
          (option: any) => this.viewerType === option.value,
          (value: any) => {
            this.viewerType = value;
          }
        );
      }
      return null;
    });
  }

  private _viewerType: IVisualizationInfo;
  public get viewerType(): IVisualizationInfo {
    return this._viewerType;
  }
  public set viewerType(value: IVisualizationInfo) {
    this._viewerType = value;
    this._chartAdapter = new VisualizerBase.chartAdapterType(this);
    this.onDataChanged();
  }

  public get dataType(): SurveyResultDataTypes {
    const questionType = this.question.getType();

    switch(questionType) {
      case "text":
        const type: string = this.question.inputType;
        let result = SurveyResultDataTypes.Text;

        switch(type) {
          case "time":
          case "date":
          case "datetime-local":
            result = SurveyResultDataTypes.Date;
            break;
          case "number":
          case "range":
            result = SurveyResultDataTypes.Number;
            break;
          case "month":
          case "week": result = SurveyResultDataTypes.Enum;
            break;
        }
        return result;
      case "dropdown":
      case "radiogroup":
      case "boolean":
      case "imagepicker":
      case "tagbox":
      case "checkbox":
        return SurveyResultDataTypes.Enum;
      case "rating": return SurveyResultDataTypes.Number;
      default: return SurveyResultDataTypes.Unknown;
    }
  }

  public get aggregators(): any {
    switch(this.dataType) {
      case SurveyResultDataTypes.Enum: return [AggregatorFunctions.Categorial];
      case SurveyResultDataTypes.Number: return [AggregatorFunctions.Categorial, AggregatorFunctions.Continious, AggregatorFunctions.Math];
      case SurveyResultDataTypes.Date: return [AggregatorFunctions.Continious, AggregatorFunctions.Math];
    }
    return [];
  }

  public get viewerList(): IVisualizationInfo[] {
    const result: IVisualizationInfo[] = [];
    this.aggregators.forEach(aggregator => {
      const aggregatorName = aggregator.name;
      result.push(...diagramTypes[aggregatorName].map(chartType => <IVisualizationInfo>{ viewerType: chartType, aggregator }));
    });
    return result;
  }

  protected getCalculatedValuesCore(): Array<any> {
    if (!this.viewerType) {
      return super.getCalculatedValuesCore();
    }

    return this.viewerType.aggregator(this.surveyData, this);
  }

  public get chartType(): string {
    return this._viewerType?.viewerType;
  }

  public getValues(): Array<any> {
    const qu = this.question as any;
    return (qu.activeChoices || qu.choices || (qu.valueFalse !== undefined && qu.valueTrue !== undefined && qu.valueTrue[qu.valueFalse, qu.valueTrue])).map(c => c.value);
  }
}

VisualizationManager.defaultVisualizer = VisualizerNew;
