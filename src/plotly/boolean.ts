import { Question, QuestionBooleanModel } from "survey-core";
import { ItemValue } from "survey-core";
import { VisualizationManager } from "../visualizationManager";
import { SelectBasePlotly } from "./selectBase";

export class BooleanPlotly extends SelectBasePlotly {
  constructor(
    protected targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
    this.chartTypes = BooleanPlotly.types;
    this.chartType = this.chartTypes[0];
  }

  public get booleanQuestion() {
    return <QuestionBooleanModel>this.question;
  }

  public static types = ["pie", "bar"];

  protected getSelectedItemByText(itemText: string) {
    return new ItemValue(itemText);
  }

  getValues(): Array<any> {
    return [ this.booleanQuestion.valueTrue !== undefined ? this.booleanQuestion.valueTrue : true, this.booleanQuestion.valueFalse !== undefined ? this.booleanQuestion.valueFalse : false];
  }

  getLabels(): Array<string> {
    return this.getValues();
  }

  getData(): any[] {
    const values = this.getValues();
    const statistics = values.map(v => 0);
    this.data.forEach(row => {
      const rowValue: any = row[this.question.name];
      values.forEach((val: any, index: number) => {
        if (rowValue === val) {
          statistics[index]++;
        }
      });
    });
    return [statistics];
  }

}

VisualizationManager.registerVisualizer("boolean", BooleanPlotly);
