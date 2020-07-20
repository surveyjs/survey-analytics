import { Question, QuestionBooleanModel } from "survey-core";
import { ItemValue } from "survey-core";
import { SelectBase } from "./selectBase";

export class BooleanModel extends SelectBase {
  protected chartTypes: string[];
  public chartType: string;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
  }

  public get booleanQuestion() {
    return <QuestionBooleanModel>this.question;
  }

  public static trueColor = "";
  public static falseColor = "";

  public getSelectedItemByText(itemText: string) {
    const labels = this.getLabels();
    const values = this.getValues();
    return new ItemValue(values[labels.indexOf(itemText)], itemText);
  }

  getValues(): Array<any> {
    return [
      this.booleanQuestion.valueTrue !== undefined
        ? this.booleanQuestion.valueTrue
        : true,
      this.booleanQuestion.valueFalse !== undefined
        ? this.booleanQuestion.valueFalse
        : false
    ];
  }

  getLabels(): Array<string> {
    var labels = this.getValues();
    if (this.booleanQuestion.labelTrue !== undefined) {
      labels[0] = this.booleanQuestion.locLabelTrue.textOrHtml;
    }
    if (this.booleanQuestion.labelFalse !== undefined) {
      labels[1] = this.booleanQuestion.locLabelFalse.textOrHtml;
    }
    return labels;
  }

  getData(): any[] {
    const values = this.getValues();
    var trueCount = 0;
    var falseCount = 0;
    this.data.forEach(row => {
      const rowValue: any = row[this.question.name];
      if (rowValue === values[0]) {
        trueCount++;
      }
      if (rowValue === values[1]) {
        falseCount++;
      }
    });
    return [[trueCount, falseCount]];
  }
}
