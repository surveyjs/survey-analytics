import { Question, QuestionSelectBase, ItemValue } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils/index";

export interface IVisualizerWithSelection {
  selection: ItemValue;
  onDataItemSelected: (selectedValue: any, selectedText: string) => void;
  setSelection(item: ItemValue): void;
}

export class SelectBase
  extends VisualizerBase
  implements IVisualizerWithSelection {
  protected selectedItem: ItemValue = undefined;
  private choicesOrder: HTMLDivElement = undefined;
  private showPercentageBtn: HTMLElement = undefined;
  private _showPercentages: boolean;
  public orderByAnsweres: string = "default";
  protected _supportSelection: boolean = true;
  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "selectBase");
    question.visibleChoicesChangedCallback = () => {
      this.dataProvider.reset();
    };
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

    this.registerToolbarItem("showPercentages", () => {
      if (
        this.options.allowShowPercentages &&
        (this.chartTypes.indexOf("bar") !== -1 ||
          this.chartTypes.indexOf("stackedbar") !== -1)
      ) {
        var updateCaption = () => {
          this.showPercentageBtn.innerHTML = this._showPercentages
            ? localization.getString("hidePercentages")
            : localization.getString("showPercentages");
        };
        this.showPercentageBtn = DocumentHelper.createButton(() => {
          this.showPercentages = !this._showPercentages;
          updateCaption();
        });
        updateCaption();
        this.updateShowPercentageBtn();
        return this.showPercentageBtn;
      }
    });
  }

  protected chartTypes: string[] = [];
  public chartType: string;

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

  private updateShowPercentageBtn() {
    if (!!this.showPercentageBtn) {
      if (this.chartType == "bar" || this.chartType == "stackedbar") {
        this.showPercentageBtn.style.display = "inline";
      } else {
        this.showPercentageBtn.style.display = "none";
      }
    }
  }

  protected onChartTypeChanged() {
    this.setLabelsOrder("default");
    this.updateOrderSelector();
    this.updateShowPercentageBtn();
  }

  protected setChartType(chartType: string) {
    if (
      this.chartTypes.indexOf(chartType) !== -1 &&
      this.chartType !== chartType
    ) {
      this.chartType = chartType;
      this.onChartTypeChanged();
      this.invokeOnUpdate();
    }
  }

  public getSelectedItemByText(itemText: string) {
    if (this.question.hasOther && itemText == this.question.otherText) {
      return this.question.otherItem;
    } else {
      return this.question.choices.filter(
        (choice: ItemValue) => choice.text === itemText
      )[0];
    }
  }

  setSelection(item: ItemValue) {
    if (this.selectedItem !== item) {
      this.selectedItem = item;
      if (this.onDataItemSelected !== undefined) {
        this.onDataItemSelected(
          item !== undefined ? item.value : undefined,
          item !== undefined ? item.text : ""
        );
      }
    }
  }
  get selection() {
    return this.selectedItem;
  }

  public get showPercentages(): boolean {
    return this._showPercentages;
  }

  public set showPercentages(val: boolean) {
    this._showPercentages = val;
    this.refreshContent();
  }

  setLabelsOrder(value: string) {
    this.orderByAnsweres = value;
    this.refreshContent();
  }

  refreshContent() {
    this.destroyContent(this.contentContainer);
    this.renderContent(this.contentContainer);
    this.invokeOnUpdate();
  }

  onDataItemSelected: (selectedValue: any, selectedText: string) => void;

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

  getPercentages(): Array<Array<number>> {
    var data: Array<Array<number>> = this.getData();
    var percentages: Array<Array<number>> = [];
    if (data.length < 2) {
      data.forEach((res, index) => {
        var sum = res.reduce((sum, val) => sum + val);
        percentages[index] = res.map((val) => {
          return sum && Math.round((val / sum) * 100);
        });
      });
    } else {
      for (var i = 0; i < data[0].length; i++) {
        var sum = 0;
        for (var j = 0; j < data.length; j++) {
          sum += data[j][i];
        }
        for (var j = 0; j < data.length; j++) {
          if (!Array.isArray(percentages[j])) percentages[j] = [];
          percentages[j][i] = sum && Math.round((data[j][i] / sum) * 100);
        }
      }
    }
    return percentages;
  }
}
