import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils/index";

export class DateTimeModel extends VisualizerBase {
  protected chartTypes: Array<string>;
  public chartType: String;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options: { [index: string]: any } = {},
    name?: string
  ) {
    super(question, data, options, name || "datetime");
  }

  getData() {
    var x = [];
    var y = [];

    this.data.forEach((dataItem)=> {
      const value = dataItem[this.question.name];
      if (x.indexOf(value) === -1) {
        x.push(value);
        y.push(1);
      } else {
        const index = x.indexOf(value);
        y[index]++;
      }
    });

    return [x, y];
  }
}
