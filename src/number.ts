import { Question } from "survey-core";
import { ICalculationResult, VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils/index";
import { VisualizationManager } from "./visualizationManager";
import { mathStatisticsCalculator } from "./statisticCalculators";

export class NumberModel extends VisualizerBase {
  private _statistics: ICalculationResult;

  public static stepsCount = 5;
  public static generateTextsCallback: (
    question: Question,
    maxValue: number,
    minValue: number,
    stepsCount: number,
    texts: string[]
  ) => string[];

  protected chartTypes: Array<string> = [];
  chartType: String;

  public static showAsPercentage = false;

  public displayValueName = "average";

  private initChartTypes(): void {
    if(VisualizerBase.chartAdapterType) {
      this._chartAdapter = new VisualizerBase.chartAdapterType(this);
      this.chartTypes = this._chartAdapter.getChartTypes();
    }
    if(this.options.availableTypes) {
      this.chartTypes = this.options.availableTypes;
    }

    if(this.chartTypes?.length > 0) {
      [this.questionOptions?.chartType, this.options.defaultChartType].some(type => {
        if(!!type && this.chartTypes.indexOf(type) !== -1) {
          this.chartType = type;
          return true;
        }
        return false;
      });
    }
    if(!this.chartType) {
      this.chartType = this.questionOptions?.chartType || this.options.defaultChartType || this.chartTypes[0];
    }
  }

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {},
    type?: string
  ) {
    super(question, data, options, type || "number");

    if(!!this.question.displayValueName) {
      this.displayValueName = this.question.displayValueName;
    }

    this.initChartTypes();

    if(this.allowChangeType) {
      this.registerToolbarItem("changeChartType", () => {
        if(this.chartTypes.length > 1) {
          return DocumentHelper.createDropdown(
            this.chartTypes.map((chartType) => {
              return {
                value: chartType,
                text: localization.getString("chartType_" + chartType),
              };
            }),
            (option: any) => this.chartType === option.value,
            (e: any) => {
              this.setChartType(e);
            }
          );
        }
        return null;
      }, "dropdown");
    }
  }

  protected onDataChanged() {
    this._statistics = undefined;
    super.onDataChanged();
  }

  protected onChartTypeChanged() {}

  protected setChartType(chartType: string) {
    if(
      this.chartTypes.indexOf(chartType) !== -1 &&
      this.chartType !== chartType
    ) {
      this.chartType = chartType;
      this.onChartTypeChanged();
      if(!!this.contentContainer) {
        this.destroyContent(this.contentContainer);
        this.renderContent(this.contentContainer);
      }
      this.invokeOnUpdate();
    }
  }

  destroy(): void {
    this._statistics = undefined;
    super.destroy();
  }

  generateText(maxValue: number, minValue: number, stepsCount: number): string[] {
    let texts: any = [];

    if(stepsCount === 5) {
      texts = [
        "very high (" + maxValue + ")",
        "high",
        "medium",
        "low",
        "very low (" + minValue + ")",
      ];
    } else {
      texts.push(maxValue);
      for(let i = 0; i < stepsCount - 2; i++) {
        texts.push("");
      }
      texts.push(minValue);
    }

    if(!!NumberModel.generateTextsCallback) {
      return NumberModel.generateTextsCallback(
        this.question,
        maxValue,
        minValue,
        stepsCount,
        texts
      );
    }

    return texts;
  }

  generateValues(maxValue: number, stepsCount: number): number[] {
    const values = [];
    for(let i = 0; i < stepsCount; i++) {
      values.push(maxValue / stepsCount);
    }
    values.push(maxValue);
    return values;
  }

  generateColors(maxValue: number, minValue: number, stepsCount: number): string[] {
    const palette = VisualizerBase.getColors();
    const colors = [];
    for(let i = 0; i < stepsCount; i++) {
      colors.push(palette[i]);
    }
    colors.push("rgba(255, 255, 255, 0)");
    return colors;
  }

  public convertFromExternalData(externalCalculatedData: any): ICalculationResult {
    return {
      data: [[externalCalculatedData.value || 0, externalCalculatedData.minValue || 0, externalCalculatedData.maxValue || 0, externalCalculatedData.count || 0]],
      values: ["average", "min", "max", "count"]
    };
  }

  protected getCalculatedValuesCore(): ICalculationResult {
    if(this._statistics === undefined) {
      this._statistics = mathStatisticsCalculator(this.surveyData, this);
    }
    return this._statistics;
  }

  public getValues(): Array<any> {
    return this._statistics ? this._statistics.values : [];
  }
}

VisualizationManager.registerVisualizer("number", NumberModel, 200, "number");
VisualizationManager.registerVisualizer("rating", NumberModel, 200, "number");
VisualizationManager.registerVisualizer("expression", NumberModel, undefined, "number");
VisualizationManager.registerVisualizer("gauge", NumberModel, undefined, "number");