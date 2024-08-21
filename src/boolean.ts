import { Question, QuestionBooleanModel } from "survey-core";
import { ItemValue } from "survey-core";
import { SelectBase } from "./selectBase";
import { DataProvider } from "./dataProvider";
import { localization } from "./localizationManager";

export class BooleanModel extends SelectBase {
  protected chartTypes: string[];

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "boolean");
  }

  protected getCorrectAnswerText(): string {
    const correctAnswerValue = this.booleanQuestion.correctAnswer;
    if (this.booleanQuestion.valueTrue !== undefined && this.booleanQuestion.valueTrue === correctAnswerValue || !!correctAnswerValue) {
      return this.booleanQuestion.locLabelTrue.textOrHtml;
    }
    if (this.booleanQuestion.valueFalse !== undefined && this.booleanQuestion.valueFalse === correctAnswerValue || !correctAnswerValue) {
      return this.booleanQuestion.locLabelFalse.textOrHtml;
    }
    return correctAnswerValue;
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
    const values = [
      this.booleanQuestion.valueTrue !== undefined
        ? this.booleanQuestion.valueTrue
        : true,
      this.booleanQuestion.valueFalse !== undefined
        ? this.booleanQuestion.valueFalse
        : false,
    ];
    if (this.showMissingAnswers) {
      values.push(undefined);
    }
    return values;
  }

  getLabels(): Array<string> {
    var labels = [].concat(this.getValues());
    if (this.booleanQuestion.labelTrue !== undefined) {
      labels[0] = this.booleanQuestion.locLabelTrue.textOrHtml;
    }
    if (this.booleanQuestion.labelFalse !== undefined) {
      labels[1] = this.booleanQuestion.locLabelFalse.textOrHtml;
    }
    if (this.showMissingAnswers) {
      labels[2] = localization.getString("missingAnswersLabel");
    }
    return labels;
  }
}
