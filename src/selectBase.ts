import { Question, QuestionSelectBase, ItemValue } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils/index";
import { VisualizerFactory } from "./visualizerFactory";
import { DataProvider } from "./dataProvider";

export class SelectBase extends VisualizerBase {
  private selectedItem: ItemValue = undefined;
  private choicesOrder: HTMLDivElement = undefined;
  public orderByAnsweres: string = "default";

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(question, data, options);
    this.registerToolbarItem("changeChartType", () => {
      if (this.chartTypes.length > 1) {
        return DocumentHelper.createSelector(
          this.chartTypes.map((chartType) => {
            return {
              value: chartType,
              text: localization.getString("chartType_" + chartType),
            };
          }),
          (option: any) => this.chartType === option.value,
          (e: any) => {
            this.setChartType(e.target.value);
            this.onChartTypeChanged();
          }
        );
      }
      return null;
    });
    this.registerToolbarItem("changeLabelsOrder", () => {
      if (
        this.getSeriesValues().length === 0 &&
        this.chartTypes.indexOf("bar") !== -1
      ) {
        this.choicesOrder = DocumentHelper.createSelector(
          [
            { text: localization.getString("defaultOrder"), value: "default" },
            { text: localization.getString("ascOrder"), value: "asc" },
            { text: localization.getString("descOrder"), value: "desc" },
          ],
          (option) => false,
          (e) => {
            this.setLabelsOrder(e.target.value);
            this.updateData(this.data);
          }
        );
        this.updateOrderSelector();
      }
      return this.choicesOrder;
    });
  }

  protected chartTypes: string[] = [];
  public chartType: string;

  public get name() {
    return "selectBase";
  }

  private updateOrderSelector() {
    if (!!this.choicesOrder) {
      if (this.chartType == "bar") {
        this.choicesOrder.style.display = "inline-block";
      } else {
        this.choicesOrder.style.display = "none";
        this.choicesOrder.getElementsByTagName("select")[0].value = "default";
      }
    }
  }

  protected onChartTypeChanged() {
    this.setLabelsOrder("default");
    this.updateOrderSelector();
  }

  protected setChartType(chartType: string) {
    if (
      this.chartTypes.indexOf(chartType) !== -1 &&
      this.chartType !== chartType
    ) {
      this.chartType = chartType;
      this.destroyContent(this.contentContainer);
      this.renderContent(this.contentContainer);
      this.invokeOnUpdate();
    }
  }

  public getSelectedItemByText(itemText: string) {
    return this.question.choices.filter(
      (choice: ItemValue) => choice.text === itemText
    )[0];
  }

  setSelection(item: ItemValue) {
    this.selectedItem = item;
    this.onDataItemSelected(
      (item && item.value) || undefined,
      (item && item.text) || ""
    );
  }
  get selection() {
    return this.selectedItem;
  }

  setLabelsOrder(value: string) {
    this.orderByAnsweres = value;
  }

  onDataItemSelected: (selectedValue: any, selectedText: string) => void;

  updateData(data: Array<{ [index: string]: any }>) {
    super.updateData(data);
    this.refresh();
  }

  valuesSource(): Array<ItemValue> {
    const question = <QuestionSelectBase>this.question;
    return question["activeChoices"];
  }

  getValues(): Array<any> {
    const values: Array<any> = this.valuesSource().map(
      (choice) => choice.value
    );

    if (this.question.hasOther) values.unshift("other");

    return values;
  }

  getLabels(): Array<string> {
    if (this.options.useValuesAsLabels) {
      return this.getValues();
    }
    const labels: Array<string> = this.valuesSource().map((choice) =>
      ItemValue.getTextOrHtmlByValue(this.valuesSource(), choice.value)
    );

    if (this.question.hasOther) labels.unshift("Other");

    return labels;
  }

  getData(): any[] {
    const dataProvider = new DataProvider(this.data);
    return dataProvider.getData(this);
  }
}
