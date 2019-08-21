import { Question, QuestionSelectBase, ItemValue } from "survey-core";
import { VisualizerBase } from "./visualizerBase";

export class SelectBase extends VisualizerBase {
  constructor(
    protected targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
  }

  protected chartTypes: string[];
  protected chartType: string;
  protected chartNode: HTMLElement = <HTMLElement>document.createElement("div");

  toolbarChangeHandler(e: any) {}

  createChart() {}

  onDataItemSelected: (selectedValue: any, clearSelection: boolean) => void;

  render() {
    const chartNodeContainer = document.createElement("div");
    const toolbarNodeContainer = document.createElement("div");

    chartNodeContainer.appendChild(toolbarNodeContainer);
    chartNodeContainer.appendChild(this.chartNode);
    this.targetElement.appendChild(chartNodeContainer);

    this.createToolbar(toolbarNodeContainer, this.toolbarChangeHandler);

    this.createChart();
  }

  private createToolbar(
    container: HTMLDivElement,
    changeHandler: (e: any) => void
  ) {
    if (this.chartTypes.length > 0) {
      const toolbar = document.createElement("div");
      toolbar.className = "sva-question__toolbar";

      const select = document.createElement("select");
      select.className = "sva-question__select";
      this.chartTypes.forEach(chartType => {
        let option = document.createElement("option");
        option.value = chartType;
        option.text = chartType;
        option.selected = this.chartType === chartType;
        select.appendChild(option);
      });
      select.onchange = changeHandler;

      toolbar.appendChild(select);
      container.appendChild(toolbar);
    }
  }

  valuesSource(): any[] {
    const question = <QuestionSelectBase>this.question;
    return question["activeChoices"];
  }

  getValues(): Array<any> {
    const values: Array<any> = this.valuesSource().map(choice => choice.value);

    if (this.question.hasOther) values.unshift("other");

    return values;
  }

  getLabels(): Array<string> {
    const labels: Array<string> = this.valuesSource().map(choice =>
      ItemValue.getTextOrHtmlByValue(this.valuesSource(), choice.value)
    );

    if (this.question.hasOther) labels.unshift("Other");

    return labels;
  }

  getData(): any[] {
    const values = this.getValues();
    const statistics = values.map(v => 0);
    this.data.forEach(row => {
      const rowValue: any = row[this.question.name];
      if (!!rowValue) {
        if (Array.isArray(rowValue)) {
          values.forEach((val: any, index: number) => {
            if (rowValue.indexOf(val) !== -1) {
              statistics[index]++;
            }
          });
        } else {
          values.forEach((val: any, index: number) => {
            if (rowValue == val) {
              statistics[index]++;
            }
          });
        }
      }
    });
    return [statistics];
  }
}
