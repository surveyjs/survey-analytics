import { defaultStatisticsCalculator, histogramStatisticsCalculator, mathStatisticsCalculator } from "./statisticCalculators";
import { VisualizerBase } from "./visualizerBase";

export enum SurveyResultDataTypes { Number, Enum, Date, Text, Unknown }

export const AggregatorFunctions = {
  Categorial: defaultStatisticsCalculator,
  Continious: histogramStatisticsCalculator,
  Math: mathStatisticsCalculator,
};

export interface IChartData {
  chartType: string;
  aggregator: any;
}

const diagramTypes: { [key: string]: any } = {
  "defaultStatisticsCalculator": ["bar", "vbar", "stackedbar", "pie", "doughnut"],
  "histogramStatisticsCalculator": ["bar", "vbar"],
  "mathStatisticsCalculator": ["gauge", "bullet"],
};

export class VisualizerNew extends VisualizerBase {

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
      case "dropdown": return SurveyResultDataTypes.Enum;
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

  public get chartData(): IChartData[] {
    const result: IChartData[] = [];
    this.aggregators.forEach(aggregator => {
      const aggregatorName = aggregator.name;
      result.push(...diagramTypes[aggregatorName].map(chartType => <IChartData>{ chartType, aggregator }));
    });
    return result;
  }
}
