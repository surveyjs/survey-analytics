import { Question, QuestionSelectBase, ItemValue, Event } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DataHelper, DocumentHelper } from "./utils/index";

export interface IVisualizerWithSelection {
  selection: ItemValue;
  onDataItemSelected: (selectedValue: any, selectedText: string) => void;
  setSelection(item: ItemValue): void;
}

export class SelectBase
  extends VisualizerBase
  implements IVisualizerWithSelection {
  protected selectedItem: ItemValue = undefined;
  private choicesOrderSelector: HTMLDivElement = undefined;
  private showPercentageBtn: HTMLElement = undefined;
  private emptyAnswersBtn: HTMLElement = undefined;
  private _showPercentages: boolean = false;
  protected _answersOrder: string = "default";
  protected _supportSelection: boolean = true;
  private _hideEmptyAnswers = false;
  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: any,
    name?: string
  ) {
    super(question, data, options, name || "selectBase");
    question.visibleChoicesChangedCallback = () => {
      this.dataProvider.reset();
    };
    this._showPercentages = this.options.showPercentages === true;
    this._hideEmptyAnswers = this.options.hideEmptyAnswers === true;
    this._answersOrder = this.options.answersOrder || "default";
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
    this.registerToolbarItem("changeAnswersOrder", () => {
      if (
        (this.options.allowChangeAnswersOrder === undefined || this.options.allowChangeAnswersOrder) &&
        this.getSeriesValues().length === 0 &&
        this.chartTypes.indexOf("bar") !== -1
      ) {
        this.choicesOrderSelector = DocumentHelper.createSelector(
          [
            { text: localization.getString("defaultOrder"), value: "default" },
            { text: localization.getString("ascOrder"), value: "asc" },
            { text: localization.getString("descOrder"), value: "desc" },
          ],
          (option) => false,
          (e) => {
            this.setAnswersOrder(e.target.value);
            this.updateData(this.data);
          }
        );
        this.updateOrderSelector();
      }
      return this.choicesOrderSelector;
    });
    this.registerToolbarItem("showPercentages", () => {
      if (
        this.options.allowShowPercentages &&
        (this.chartTypes.indexOf("bar") !== -1 ||
          this.chartTypes.indexOf("stackedbar") !== -1)
      ) {
        this.showPercentageBtn = DocumentHelper.createButton(() => {
          this.showPercentages = !this.showPercentages;
        });
        this.updateShowPercentageBtn();
        return this.showPercentageBtn;
      }
    });
    this.registerToolbarItem("hideEmptyAnswers", () => {
      if (
        this.options.allowHideEmptyAnswers &&
        this.getSeriesValues().length === 0 &&
        this.chartTypes.indexOf("bar") !== -1
      ) {
        this.emptyAnswersBtn = DocumentHelper.createButton(() => {
          this.setHideEmptyAnswers(!this._hideEmptyAnswers);
          this.updateData(this.data);
        });
        this.updateEmptyAnswersBtn();
      }
      return this.emptyAnswersBtn;
    });
  }

  protected chartTypes: string[] = [];
  public chartType: string;
  
  private updateEmptyAnswersBtn() {
    if (!!this.emptyAnswersBtn) {
      this.emptyAnswersBtn.innerHTML = this._hideEmptyAnswers
        ? localization.getString("showEmptyAnswers")
        : localization.getString("hideEmptyAnswers");
      if (this.chartType == "bar") {
        this.emptyAnswersBtn.style.display = "inline";
      } else {
        this.emptyAnswersBtn.style.display = "none";
      }
    }
  }

  private updateOrderSelector() {
    if (!!this.choicesOrderSelector) {
      if (this.chartType == "bar") {
        this.choicesOrderSelector.style.display = "inline-block";
      } else {
        this.choicesOrderSelector.style.display = "none";
      }
      this.choicesOrderSelector.getElementsByTagName("select")[0].value = this.answersOrder;
    }
  }

  private updateShowPercentageBtn() {
    if (!!this.showPercentageBtn) {
      this.showPercentageBtn.innerHTML = this._showPercentages
        ? localization.getString("hidePercentages")
        : localization.getString("showPercentages");
      if (this.chartType == "bar" || this.chartType == "stackedbar") {
        this.showPercentageBtn.style.display = "inline";
      } else {
        this.showPercentageBtn.style.display = "none";
      }
    }
  }

  protected onChartTypeChanged() {
    this.setAnswersOrder("default");
    this.updateOrderSelector();
    this.updateShowPercentageBtn();
    this.updateEmptyAnswersBtn();
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
    this.updateShowPercentageBtn();
    this.refreshContent();
  }

  public get answersOrder() {
    return this._answersOrder;
  }

  setAnswersOrder(value: string) {
    this._answersOrder = value;
    this.updateOrderSelector();
    this.refreshContent();
  }

  public get hideEmptyAnswers() {
    return this._hideEmptyAnswers;
  }

  setHideEmptyAnswers(value: boolean) {
    this._hideEmptyAnswers = value;
    this.updateEmptyAnswersBtn();
    this.refreshContent();
  }

  refreshContent() {
    if (!!this.contentContainer) {
      this.destroyContent(this.contentContainer);
      this.renderContent(this.contentContainer);
    }
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

  protected answersDataReady(answersData: { datasets: Array<any>, labels: Array<string>, colors: Array<string>, texts: Array<any> }) {
    if(!this._hideEmptyAnswers) return answersData;
    let result = {
      datasets: <Array<any>>[[]],
      labels: <Array<string>>[],
      colors: <Array<string>>[],
      texts: <Array<any>>[[]]
    }
    for(var i=0; i<answersData.datasets[0].length; i++) {
      if(answersData.datasets[0][i] != 0) {
        result.datasets[0].push(answersData.datasets[0][i]);
        result.labels.push(answersData.labels[i]);
        result.colors.push(answersData.colors[i]);
        result.texts[0].push(answersData.texts[0][i]);
      }
    }
    return result;
  }

  /**
   * Fires when answer data has been combined before they passed to draw graph.
   * options - the answers data object containing: datasets, labels, colors, additional texts (percentage).
   * options fields can be modified
   */
  public onAnswersDataReady = new Event<
    (sender: SelectBase, options: any) => any,
    any
  >();

  /**
   * Returns object with all infotmation for data visualization: datasets, labels, colors, additional texts (percentage).
   */
  public getAnswersData() {
    let datasets = this.getData();
    let labels = this.getLabels();
    let colors = this.getColors();
    var texts = this.showPercentages ? this.getPercentages() : datasets;

    if (this.answersOrder == "asc" || this.answersOrder == "desc") {
      var zippedArray = this.showPercentages
        ? DataHelper.zipArrays(labels, colors, texts[0])
        : DataHelper.zipArrays(labels, colors);
      let dict = DataHelper.sortDictionary(
        zippedArray,
        datasets[0],
        this.answersOrder == "desc"
      );
      let unzippedArray = DataHelper.unzipArrays(dict.keys);
      labels = unzippedArray[0];
      colors = unzippedArray[1];
      if (this.showPercentages) texts[0] = unzippedArray[2];
      datasets[0] = dict.values;
    }

    let answersData = {
      datasets,
      labels,
      colors,
      texts
    }
    answersData = this.answersDataReady(answersData);
    this.onAnswersDataReady.fire(this, answersData);

    return answersData;
  }
}
