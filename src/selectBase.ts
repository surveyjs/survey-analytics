import { Question, QuestionSelectBase, ItemValue } from "survey-core";
import { VisualizerBase } from "./visualizationManager";

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
  chartType: string;
  chartNode: HTMLElement;

  toolbarChangeHandler(e: any) {}

  createChart() {}

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
      const select = document.createElement("select");
      this.chartTypes.forEach(chartType => {
        let option = document.createElement("option");
        option.value = chartType;
        option.text = chartType;
        option.selected = this.chartType === chartType;
        select.appendChild(option);
      });
      select.onchange = changeHandler;
      container.appendChild(select);
    }
  }

  valuesSource(): any[] {
    const question = <QuestionSelectBase>this.question;
    return question["activeChoices"];
  }

  getValues(): Array<any> {
    const values: Array<any> = this.valuesSource().map(choice => choice.value);
    return values;
  }

  getLabels(): Array<string> {
    const labels: Array<string> = this.valuesSource().map(choice =>
      ItemValue.getTextOrHtmlByValue(this.valuesSource(), choice.value)
    );
    return labels;
  }
}
