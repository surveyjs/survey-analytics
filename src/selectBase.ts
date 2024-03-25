import { Question, QuestionSelectBase, ItemValue, Event } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DataHelper, DocumentHelper } from "./utils/index";

export interface IVisualizerWithSelection {
  selection: ItemValue;
  onDataItemSelected: (selectedValue: any, selectedText: string) => void;
  setSelection(item: ItemValue): void;
}

export interface IAnswersData {
  datasets: Array<Array<any>>;
  labels: Array<string>;
  colors: Array<string>;
  texts: Array<Array<any>>;
  seriesLabels: Array<string>;
}

export function hideEmptyAnswersInData(answersData: IAnswersData): IAnswersData {
  const result = {
    datasets: <Array<any>>[],
    labels: <Array<string>>[],
    colors: <Array<string>>[],
    texts: <Array<any>>[],
    seriesLabels: <Array<any>>[],
  };
  if(answersData.seriesLabels.length === 0) {
    result.datasets.push([]);
    result.texts.push([]);
    for (var i = 0; i < answersData.datasets[0].length; i++) {
      if (answersData.datasets[0][i] != 0) {
        result.datasets[0].push(answersData.datasets[0][i]);
        result.labels.push(answersData.labels[i]);
        result.colors.push(answersData.colors[i]);
        result.texts[0].push(answersData.texts[0][i]);
      }
    }
    return result;
  }
  const seriesDataExistence = <Array<boolean>>[];
  seriesDataExistence.length = answersData.seriesLabels.length;
  const valuesDataExistence = <Array<boolean>>[];
  valuesDataExistence.length = answersData.labels.length;
  for (var valueIndex = 0; valueIndex < answersData.labels.length; valueIndex++) {
    for (var seriesIndex = 0; seriesIndex < answersData.seriesLabels.length; seriesIndex++) {
      if (answersData.datasets[valueIndex][seriesIndex] != 0) {
        seriesDataExistence[seriesIndex] = true;
        valuesDataExistence[valueIndex] = true;
      }
    }
  }
  for (var valueIndex = 0; valueIndex < valuesDataExistence.length; valueIndex++) {
    if (valuesDataExistence[valueIndex]) {
      result.labels.push(answersData.labels[valueIndex]);
      result.colors.push(answersData.colors[valueIndex]);
    }
  }
  for (var seriesIndex = 0; seriesIndex < answersData.seriesLabels.length; seriesIndex++) {
    if (seriesDataExistence[seriesIndex]) {
      result.seriesLabels.push(answersData.seriesLabels[seriesIndex]);
    }
  }
  for (var valueIndex = 0; valueIndex < answersData.labels.length; valueIndex++) {
    if (valuesDataExistence[valueIndex]) {
      const dataset = [];
      const texts = [];
      for (var seriesIndex = 0; seriesIndex < answersData.datasets.length; seriesIndex++) {
        if (seriesDataExistence[seriesIndex]) {
          dataset.push(answersData.datasets[valueIndex][seriesIndex]);
          texts.push(answersData.texts[valueIndex][seriesIndex]);
        }
      }
      result.datasets.push(dataset);
      result.texts.push(texts);
    }
  }
  return result;
}

export class SelectBase
  extends VisualizerBase
  implements IVisualizerWithSelection {
  protected selectedItem: ItemValue = undefined;
  private choicesOrderSelector: HTMLDivElement = undefined;
  private showPercentageBtn: HTMLElement = undefined;
  private emptyAnswersBtn: HTMLElement = undefined;
  private transposeDataBtn: HTMLElement = undefined;
  private topNSelector: HTMLDivElement = undefined;
  private _showPercentages: boolean = false;
  private _showOnlyPercentages: boolean = false;
  private _percentagePrecision: number = 0;
  protected _answersOrder: string = "default";
  protected _supportSelection: boolean = true;
  private _hideEmptyAnswers = false;
  private _topN = -1;
  public static topNValuesDefaults = [-1, 5, 10, 20];
  public topNValues = [].concat(SelectBase.topNValuesDefaults);
  private _transposeData: boolean = false;
  private _showMissingAnswers: boolean = false;
  private missingAnswersBtn: HTMLElement = undefined;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: any,
    name?: string
  ) {
    super(question, data, options, name || "selectBase");
    (<any>question).visibleChoicesChangedCallback = () => {
      this.dataProvider.reset();
    };
    this._showPercentages = this.options.showPercentages === true;
    this._showOnlyPercentages = this.options.showOnlyPercentages === true;

    if (this.options.percentagePrecision) {
      this._percentagePrecision = this.options.percentagePrecision;
    }

    this._hideEmptyAnswers = this.options.hideEmptyAnswers === true;
    this._answersOrder = this.options.answersOrder || "default";
    this._showMissingAnswers = this.isSupportMissingAnswers() && this.options.showMissingAnswers === true;
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
      if (this.isSupportAnswersOrder()) {
        this.choicesOrderSelector = DocumentHelper.createSelector(
          [
            { text: localization.getString("defaultOrder"), value: "default" },
            { text: localization.getString("ascOrder"), value: "asc" },
            { text: localization.getString("descOrder"), value: "desc" },
          ],
          (option) => false,
          (e) => {
            this.answersOrder = e.target.value;
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
      if (this.options.allowHideEmptyAnswers) {
        this.emptyAnswersBtn = DocumentHelper.createButton(() => {
          this.hideEmptyAnswers = !this._hideEmptyAnswers;
        });
        this.updateEmptyAnswersBtn();
      }
      return this.emptyAnswersBtn;
    });
    this.registerToolbarItem("topNAnswers", () => {
      if (
        this.options.allowTopNAnswers &&
        this.getSeriesValues().length === 0
      ) {
        this.topNSelector = DocumentHelper.createSelector(
          this.topNValues.map((value) => {
            return {
              text: localization.getString("topNValueText" + value),
              value: value,
            };
          }),
          (option) => false,
          (e) => {
            this.topN = parseInt(e.target.value);
          }
        );
        this.updateTopNSelector();
      }
      return this.topNSelector;
    });
    this.registerToolbarItem("transposeData", () => {
      if (this.options.allowTransposeData) {
        this.transposeDataBtn = DocumentHelper.createButton(() => {
          this.transposeData = !this.transposeData;
        });
        this.updateTransposeDataBtn();
      }
      return this.transposeDataBtn;
    });
    this.registerToolbarItem("showMissingAnswers", () => {
      if (this.isSupportMissingAnswers() && this.options.allowShowMissingAnswers) {
        this.missingAnswersBtn = DocumentHelper.createButton(() => {
          this.showMissingAnswers = !this._showMissingAnswers;
        });
        this.updateMissingAnswersBtn();
      }
      return this.missingAnswersBtn;
    });
  }

  protected chartTypes: string[] = [];
  protected _chartType: string = "bar";
  /**
   * Chart type - current chart type.
   */
  public get chartType(): string {
    return this._chartType;
  }
  public set chartType(newChartType: string) {
    this.setChartType(newChartType);
  }

  private updateEmptyAnswersBtn() {
    if (!!this.emptyAnswersBtn) {
      this.emptyAnswersBtn.innerText = this._hideEmptyAnswers
        ? localization.getString("showEmptyAnswers")
        : localization.getString("hideEmptyAnswers");
      if (this.chartType == "bar" || this.chartType == "vbar" || this.chartType == "scatter") {
        this.emptyAnswersBtn.style.display = "inline";
      } else {
        this.emptyAnswersBtn.style.display = "none";
      }
    }
  }

  private updateTransposeDataBtn() {
    if (!!this.transposeDataBtn) {
      this.transposeDataBtn.innerText = this.transposeData
        ? localization.getString("showPerColumns")
        : localization.getString("showPerValues");
      if (this.getSeriesValues().length > 0) {
        this.transposeDataBtn.style.display = "inline";
      } else {
        this.transposeDataBtn.style.display = "none";
      }
    }
  }

  private updateOrderSelector() {
    if (!!this.choicesOrderSelector) {
      if (
        this.chartType == "bar" ||
        this.chartType == "vbar" ||
        this.chartType == "scatter" ||
        ((this.chartType == "pie" || this.chartType == "doughnut") &&
          this.topN > 0)
      ) {
        this.choicesOrderSelector.style.display = "inline-flex";
      } else {
        this.choicesOrderSelector.style.display = "none";
      }
      this.choicesOrderSelector.getElementsByTagName(
        "select"
      )[0].value = this.answersOrder;
    }
  }

  private updateShowPercentageBtn() {
    if (!!this.showPercentageBtn) {
      this.showPercentageBtn.innerText = this._showPercentages
        ? localization.getString("hidePercentages")
        : localization.getString("showPercentages");
      if (this.chartType == "bar" || this.chartType == "vbar" || this.chartType == "stackedbar") {
        this.showPercentageBtn.style.display = "inline";
      } else {
        this.showPercentageBtn.style.display = "none";
      }
    }
  }

  private updateTopNSelector() {
    if (!!this.topNSelector) {
      this.topNSelector.getElementsByTagName("select")[0].value = <any>(
        this._topN
      );
    }
  }

  private updateMissingAnswersBtn() {
    if (!!this.missingAnswersBtn) {
      this.missingAnswersBtn.innerText = this._showMissingAnswers
        ? localization.getString("hideMissingAnswers")
        : localization.getString("showMissingAnswers");
    }
  }

  protected onChartTypeChanged() {
    this.updateOrderSelector();
    this.updateShowPercentageBtn();
    this.updateEmptyAnswersBtn();
    this.updateTopNSelector();
    this.stateChanged("chartType", this._chartType);
  }

  protected setChartType(chartType: string) {
    if (
      this.chartTypes.indexOf(chartType) !== -1 &&
      this._chartType !== chartType
    ) {
      this._chartType = chartType;
      this.onChartTypeChanged();
      this.refreshContent();
    }
  }

  protected getCorrectAnswerText(): string {
    const correctAnswerValue = super.getCorrectAnswerText();
    const resultValues = Array.isArray(correctAnswerValue) ? correctAnswerValue : [correctAnswerValue];
    const selectBaseQuestion = this.question as QuestionSelectBase;
    return resultValues.map((value: any) => ItemValue.getTextOrHtmlByValue(selectBaseQuestion.choices, value)).join(", ");
  }

  public getSelectedItemByText(itemText: string) {
    const selBase = <QuestionSelectBase>this.question;
    if (this.question.hasOther && itemText == selBase.otherText) {
      return selBase.otherItem;
    } else {
      return selBase.choices.filter(
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

  /**
   * Gets and sets whether chart should show percentages only.
   */
  public get showOnlyPercentages(): boolean {
    return this._showOnlyPercentages;
  }

  public set showOnlyPercentages(val: boolean) {
    this._showOnlyPercentages = val;
    this.refreshContent();
    this.stateChanged("showOnlyPercentages", val);
  }

  /**
   * Gets and sets whether chart should show values and percentages.
   */
  public get showPercentages(): boolean {
    return this._showPercentages;
  }

  public set showPercentages(val: boolean) {
    this._showPercentages = val;
    this.updateShowPercentageBtn();
    this.refreshContent();
    this.stateChanged("showPercentages", val);
  }

  /**
   * Gets and sets chart elements order.
   */
  public get answersOrder() {
    return this._answersOrder;
  }

  public set answersOrder(value: string) {
    this._answersOrder = value;
    this.updateOrderSelector();
    this.refreshContent();
    this.stateChanged("answersOrder", value);
  }

  /**
   * Set to true if need to hide empty chart elements (e.g. bars vith zero value).
   */
  public get hideEmptyAnswers() {
    return this._hideEmptyAnswers;
  }

  public set hideEmptyAnswers(value: boolean) {
    this._hideEmptyAnswers = value;
    this.updateEmptyAnswersBtn();
    this.refreshContent();
    this.stateChanged("hideEmptyAnswers", value);
  }

  public get transposeData(): boolean {
    return this._transposeData;
  }

  public set transposeData(value: boolean) {
    this._transposeData = value;
    this.updateTransposeDataBtn();
    this.refreshContent();
    this.stateChanged("transposeData", value);
  }

  /**
   * Set to some value if need to show top N chart elements.
   */
  public get topN(): number {
    return this._topN;
  }

  public set topN(value: number) {
    this._topN = value;
    this.updateTopNSelector();
    this.updateOrderSelector();
    this.refreshContent();
    this.stateChanged("topN", value);
  }

  protected isSupportAnswersOrder(): boolean {
    return (this.options.allowChangeAnswersOrder === undefined ||
            this.options.allowChangeAnswersOrder) &&
            this.getSeriesValues().length === 0;
  }

  protected isSupportMissingAnswers(): boolean {
    return true;
  }

  /**
   * Set to true if you want to see chart elements for missing answers (e.g. radiogroup items never been selected by surveyee).
   */
  public get showMissingAnswers() {
    return this._showMissingAnswers;
  }

  public set showMissingAnswers(value: boolean) {
    this._showMissingAnswers = this.isSupportMissingAnswers() && value;
    this.updateMissingAnswersBtn();
    this.dataProvider.reset(this);
    this.refreshContent();
    this.stateChanged("showMissingAnsewrs", value);
  }

  refreshContent() {
    if (!!this.contentContainer) {
      this.destroyContent(this.contentContainer);
      this.renderContent(this.contentContainer);
    }
    this.invokeOnUpdate();
  }

  onDataItemSelected: (selectedValue: any, selectedText: string) => void;

  get showValuesInOriginalOrder() {
    return this.options.showValuesInOriginalOrder !== false;
  }

  valuesSource(): Array<ItemValue> {
    let question = <QuestionSelectBase>this.question;
    if(!!question.choicesFromQuestion && !!question.survey) {
      question = <QuestionSelectBase>question.survey.getQuestionByName(question.choicesFromQuestion);
    }
    return question["activeChoices"];
  }

  getValues(): Array<any> {
    const values: Array<any> = this.valuesSource().map(
      (choice) => choice.value
    );

    if ((<QuestionSelectBase>this.question).hasNone) {
      values.push((<QuestionSelectBase>this.question).noneItem.value);
    }
    if (this.question.hasOther) {
      values.push("other");
    }
    if (this.showMissingAnswers) {
      values.unshift(undefined);
    }
    if (this.showValuesInOriginalOrder) {
      return values.reverse();
    }
    return values;
  }

  getLabels(): Array<string> {
    if (this.options.useValuesAsLabels) {
      return this.getValues();
    }
    const labels: Array<string> = this.valuesSource().map((choice) =>
      ItemValue.getTextOrHtmlByValue(this.valuesSource(), choice.value)
    );
    const selBase = <QuestionSelectBase>this.question;
    if (selBase.hasNone) {
      labels.push(selBase.noneText);
    }
    if (selBase.hasOther) {
      labels.push(selBase.otherText);
    }
    if (this.showMissingAnswers) {
      labels.unshift(localization.getString("missingAnswersLabel"));
    }
    if (this.showValuesInOriginalOrder) {
      return labels.reverse();
    }
    return labels;
  }

  getPercentages(): Array<Array<number>> {
    var data: Array<Array<number>> = this.getCalculatedValues();
    var percentages: Array<Array<number>> = [];
    var percentagePrecision = this._percentagePrecision;

    if (data.length < 2) {
      data.forEach((res, index) => {
        var sum = res.reduce((sum, val) => sum + val, 0);
        percentages[index] = res.map((val) => {
          var value = percentagePrecision ? +(val / sum).toFixed(percentagePrecision) : Math.round((val / sum) * 10000);
          return sum && (value / 100);
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
          var value = percentagePrecision ? +((data[j][i] / sum) * 100).toFixed(percentagePrecision) : Math.round((data[j][i] / sum) * 100);
          percentages[j][i] = sum && value;
        }
      }
    }
    return percentages;
  }

  protected answersDataReady(answersData: IAnswersData) {
    let result: any = {};
    if (this.hideEmptyAnswers) {
      result = hideEmptyAnswersInData(answersData);
    } else {
      result = answersData;
    }
    if (this.topN > 0) {
      result.datasets[0] = result.datasets[0].slice(-this.topN);
      result.labels = result.labels.slice(-this.topN);
      result.colors = result.colors.slice(-this.topN);
      result.texts[0] = result.texts[0].slice(-this.topN);
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
    SelectBase,
    any
  >();

  /**
   * Returns object with all infotmation for data visualization: datasets, labels, colors, additional texts (percentage).
   */
  public getAnswersData(): IAnswersData {
    let seriesLabels = this.getSeriesLabels();
    let datasets = this.getCalculatedValues();
    let labels = this.getLabels();
    let colors = this.getColors();
    var texts = this.showPercentages ? this.getPercentages() : datasets;

    if (this.transposeData) {
      datasets = this.transpose(datasets);
      texts = this.transpose(texts);
      const temp = seriesLabels;
      seriesLabels = labels;
      labels = temp;
    }

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
      texts,
      seriesLabels,
    };
    answersData = this.answersDataReady(answersData);
    this.onAnswersDataReady.fire(this, answersData);

    return answersData;
  }
  protected transpose(data: Array<Array<number>>): Array<Array<number>> {
    const dim2 = data[0].length;
    const result = new Array<Array<number>>(dim2);
    for (let i = 0; i < dim2; ++i)
      result[i] = new Array<number>(data.length);

    for (let i = 0; i < data.length; ++i)
      for (let j = 0; j < dim2; ++j) {
        result[j][i] = data[i][j];
      }
    return result;
  }

  private static _stateProperties = ["chartType", "answersOrder", "hideEmptyAnswers", "topN"];
  public getState(): any {
    let state: any = {};
    SelectBase._stateProperties.forEach(propertyName => {
      state[propertyName] = (<any>this)[propertyName];
    });
    if(!!this.selectedItem) {
      state.filter = this.selectedItem.value;
    }
    return state;
  }
  public setState(state: any): void {
    SelectBase._stateProperties.forEach(propertyName => {
      if (state[propertyName] !== undefined) {
        (<any>this)[propertyName] = state[propertyName];
      }
    });
    const selectedItem = ItemValue.getItemByValue((this.question as QuestionSelectBase).visibleChoices, state.filter);
    this.setSelection(selectedItem ?? undefined);
  }
}
