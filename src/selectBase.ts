import { Question, QuestionSelectBase, ItemValue, Event, QuestionRatingModel } from "survey-core";
import { IAnswersData, ICalculationResult, VisualizerBase } from "./visualizerBase";
import { localization } from "./localizationManager";
import { DataHelper, DocumentHelper } from "./utils/index";
import { VisualizationManager } from "./visualizationManager";
import { ToggleWidget } from "./utils/toggle";

export interface IVisualizerWithSelection {
  selection: ItemValue;
  onDataItemSelected: (selectedValue: any, selectedText: string) => void;
  setSelection(item: ItemValue): void;
}

export function hideEmptyAnswersInData(answersData: IAnswersData): IAnswersData {
  const result = {
    datasets: <Array<any>>[],
    values: <Array<string>>[],
    labels: <Array<string>>[],
    colors: <Array<string>>[],
    texts: <Array<any>>[],
    seriesLabels: <Array<any>>[],
  };
  if(answersData.seriesLabels.length === 0) {
    result.datasets.push([]);
    result.texts.push([]);
    for(var i = 0; i < answersData.datasets[0].length; i++) {
      if(answersData.datasets[0][i] != 0) {
        result.datasets[0].push(answersData.datasets[0][i]);
        result.labels.push(answersData.labels[i]);
        result.values.push(answersData.values[i]);
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
  for(var seriesIndex = 0; seriesIndex < answersData.seriesLabels.length; seriesIndex++) {
    for(var valueIndex = 0; valueIndex < answersData.labels.length; valueIndex++) {
      if(answersData.datasets[seriesIndex][valueIndex] != 0) {
        seriesDataExistence[seriesIndex] = true;
        valuesDataExistence[valueIndex] = true;
      }
    }
  }
  for(var valueIndex = 0; valueIndex < valuesDataExistence.length; valueIndex++) {
    if(valuesDataExistence[valueIndex]) {
      result.labels.push(answersData.labels[valueIndex]);
      result.values.push(answersData.values[valueIndex]);
      result.colors.push(answersData.colors[valueIndex]);
    }
  }
  for(var seriesIndex = 0; seriesIndex < answersData.seriesLabels.length; seriesIndex++) {
    if(seriesDataExistence[seriesIndex]) {
      result.seriesLabels.push(answersData.seriesLabels[seriesIndex]);
    }
  }
  for(var seriesIndex = 0; seriesIndex < answersData.datasets.length; seriesIndex++) {
    if(seriesDataExistence[seriesIndex]) {
      const dataset = [];
      const texts = [];
      for(var valueIndex = 0; valueIndex < answersData.labels.length; valueIndex++) {
        if(valuesDataExistence[valueIndex]) {
          dataset.push(answersData.datasets[seriesIndex][valueIndex]);
          texts.push(answersData.texts[seriesIndex][valueIndex]);
        }
      }
      result.datasets.push(dataset);
      result.texts.push(texts);
    }
  }
  return result;
}

export class SelectBase extends VisualizerBase implements IVisualizerWithSelection {
  protected selectedItem: ItemValue = undefined;
  private choicesOrderSelector: HTMLDivElement = undefined;
  private showPercentageBtn: HTMLElement = undefined;
  private emptyAnswersBtn: HTMLElement = undefined;
  private transposeDataBtn: HTMLElement = undefined;
  private topNSelector: HTMLDivElement = undefined;
  private _showPercentages: boolean;
  private _showOnlyPercentages: boolean = false;
  private _percentagePrecision: number = 2;
  protected _answersOrder: string = "default";
  private _hideEmptyAnswers = false;
  private _topN = -1;
  public static topNValuesDefaults = [-1, 5, 10, 20];
  public topNValues = [].concat(SelectBase.topNValuesDefaults);
  public _legendPosition: "left" | "right" | "top" | "bottom";
  protected _transposeData: boolean = false;
  private _showMissingAnswers: boolean = false;
  private missingAnswersBtn: HTMLElement = undefined;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: any,
    type?: string
  ) {
    super(question, data, options, type || "selectBase");
    if(!!question) { // TODO: move somewhere else
      (<any>question).visibleChoicesChangedCallback = () => {
        this.dataProvider.raiseDataChanged();
      };
    }
    this._supportSelection = true;

    this._showOnlyPercentages = this.options.showOnlyPercentages === true;
    this._percentagePrecision = this.options.percentagePrecision !== undefined ? this.options.percentagePrecision : 2;
    this._answersOrder = this.options.answersOrder || "default";
    this._hideEmptyAnswers = this.options.hideEmptyAnswers === true;
    this._legendPosition = this.options.legendPosition || "right";
    this._transposeData = this.options.transposeData === true;
    this._showMissingAnswers = this.isSupportMissingAnswers() && this.options.showMissingAnswers === true;

    if(this.options.allowExperimentalFeatures) {
    // this.chartTypes.splice(1, 0, "vbar");
    }
    if(VisualizerBase.chartAdapterType) {
      this._chartAdapter = new VisualizerBase.chartAdapterType(this);
      this.chartTypes = this._chartAdapter.getChartTypes();
      if(this.getSeriesValues().length > 0 && this.chartTypes.indexOf("stackedbar") === -1) {
        this.chartTypes.push("stackedbar");
      }

      this._chartType = this.chartTypes[0];
      if(this.chartTypes.indexOf(this.options.defaultChartType) !== -1) {
        this._chartType = this.options.defaultChartType;
      }
      if(this.chartTypes.indexOf(this.questionOptions?.chartType) !== -1) {
        this._chartType = this.questionOptions.chartType;
      }
    }

    if(this.options.allowChangeVisualizerType !== false && !(this.questionOptions?.allowChangeVisualizerType === false)) {
      this.registerToolbarItem("changeChartType", () => {
        if(this.chartTypes.length > 1) {
          return DocumentHelper.createDropdown(
            this.chartTypes.map((chartType) => {
              return {
                value: chartType,
                text: localization.getString("chartType_" + chartType),
              };
            }),
            (option: any) => this.chartType === option.value,
            (e: any) => {
              this.setChartType(e);
            }
          );
        }
        return null;
      }, "dropdown");
    }

    this.registerToolbarItem("changeAnswersOrder", () => {
      if(this.isSupportAnswersOrder()) {
        this.choicesOrderSelector = DocumentHelper.createDropdown(
          [
            { text: localization.getString("defaultOrder"), value: "default" },
            { text: localization.getString("ascOrder"), value: "asc" },
            { text: localization.getString("descOrder"), value: "desc" },
          ],
          (option) => this.answersOrder === option.value,
          (e) => {
            this.answersOrder = e;
          }
        );
        this.updateOrderSelector();
      }
      return this.choicesOrderSelector;
    }, "dropdown");
    this.registerToolbarItem("showPercentages", () => {
      if(
        this.options.allowShowPercentages &&
        (this.chartTypes.indexOf("bar") !== -1 ||
          this.chartTypes.indexOf("stackedbar") !== -1)
      ) {
        const toggleWidget = new ToggleWidget(() => {
          this.showPercentages = !this.showPercentages;
        }, localization.getString("showPercentages"), this.showPercentages);
        this.showPercentageBtn = toggleWidget.container;
        this.updateShowPercentageBtn();
        return this.showPercentageBtn;
      }
    }, "button");
    this.registerToolbarItem("hideEmptyAnswers", () => {
      if(this.options.allowHideEmptyAnswers) {
        this.emptyAnswersBtn = DocumentHelper.createButton(() => {
          this.hideEmptyAnswers = !this._hideEmptyAnswers;
        });
        this.updateEmptyAnswersBtn();
      }
      return this.emptyAnswersBtn;
    }, "button", 1000);
    this.registerToolbarItem("topNAnswers", () => {
      if(
        this.options.allowTopNAnswers &&
        this.getSeriesValues().length === 0
      ) {
        this.topNSelector = DocumentHelper.createDropdown(
          this.topNValues.map((value) => {
            return {
              text: localization.getString("topNValueText" + value),
              value: value,
            };
          }),
          (option) => this.topN === option.value as any,
          (e) => {
            this.topN = parseInt(e);
          }
        );
        this.updateTopNSelector();
      }
      return this.topNSelector;
    }, "dropdown");
    this.registerToolbarItem("transposeData", () => {
      if(this.options.allowTransposeData) {
        this.transposeDataBtn = DocumentHelper.createButton(() => {
          this.transposeData = !this.transposeData;
        });
        this.updateTransposeDataBtn();
      }
      return this.transposeDataBtn;
    }, "button");
    this.registerToolbarItem("showMissingAnswers", () => {
      if(this.isSupportMissingAnswers() && this.options.allowShowMissingAnswers) {
        this.missingAnswersBtn = DocumentHelper.createButton(() => {
          this.showMissingAnswers = !this._showMissingAnswers;
        });
        this.updateMissingAnswersBtn();
      }
      return this.missingAnswersBtn;
    }, "button");
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
    if(!!this.emptyAnswersBtn) {
      (this.emptyAnswersBtn as any).setText(localization.getString(this._hideEmptyAnswers ? "showEmptyAnswers" : "hideEmptyAnswers"));
      if(this.chartType == "bar" || this.chartType == "vbar" || this.chartType == "line" || this.chartType == "scatter") {
        this.emptyAnswersBtn.style.display = "inline";
      } else {
        this.emptyAnswersBtn.style.display = "none";
      }
    }
  }

  private updateTransposeDataBtn() {
    if(!!this.transposeDataBtn) {
      (this.transposeDataBtn as any).setText(localization.getString(this.transposeData ? "showPerColumns" : "showPerValues"));
      if(this.getSeriesValues().length > 0) {
        this.transposeDataBtn.style.display = "inline";
      } else {
        this.transposeDataBtn.style.display = "none";
      }
    }
  }

  private updateOrderSelector() {
    if(!!this.choicesOrderSelector) {
      if(
        this.chartType == "bar" ||
        this.chartType == "vbar" ||
        this.chartType == "line" ||
        this.chartType == "scatter" ||
        ((this.chartType == "pie" || this.chartType == "doughnut") &&
          this.topN > 0)
      ) {
        this.choicesOrderSelector.style.display = "inline-flex";
      } else {
        this.choicesOrderSelector.style.display = "none";
      }
      (this.choicesOrderSelector as any).setValue(this.answersOrder);
    }
  }

  private updateShowPercentageBtn() {
    if(!!this.showPercentageBtn) {
      // (this.showPercentageBtn as any).setText(localization.getString(this._showPercentages ? "hidePercentages" : "showPercentages"));
      if(this.chartType == "bar" || this.chartType == "vbar" || this.chartType == "stackedbar") {
        this.showPercentageBtn.style.display = undefined;
      } else {
        this.showPercentageBtn.style.display = "none";
      }
    }
  }

  private updateTopNSelector() {
    if(!!this.topNSelector) {
      (this.topNSelector as any).setValue(this._topN);
    }
  }

  private updateMissingAnswersBtn() {
    if(!!this.missingAnswersBtn) {
      (this.missingAnswersBtn as any).setText(localization.getString(this._showMissingAnswers ? "hideMissingAnswers" : "showMissingAnswers"));
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
    if(
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

  protected isSupportSoftUpdateContent(): boolean {
    return true;
  }

  protected softUpdateContent(): void {
    const chartNode: HTMLElement = <HTMLElement>this.contentContainer?.children[0];
    if(chartNode) {
      this._chartAdapter.update(chartNode);
    }
  }

  public getSelectedItemByText(itemText: string) {
    if(this.question instanceof QuestionRatingModel) {
      const rateValues = this.question.rateValues;
      return rateValues?.filter((choice: ItemValue) => choice.text === itemText)[0] ?? new ItemValue(parseFloat(itemText), itemText);
    }
    const selBase = <QuestionSelectBase>this.question;
    if(this.question.hasOther && itemText == selBase.otherText) {
      return selBase.otherItem;
    } else {
      return selBase.choices.filter(
        (choice: ItemValue) => choice.text === itemText
      )[0];
    }
  }

  protected onSelectionChanged(item: ItemValue): void {
    if(this.onDataItemSelected !== undefined) {
      this.onDataItemSelected(
        item !== undefined ? item.value : undefined,
        item !== undefined ? item.text : ""
      );
    }
    this.stateChanged("filter", this.selectedItem?.value);
  }

  setSelection(item: ItemValue): void {
    if(this.selectedItem !== item) {
      this.selectedItem = item;
      this.onSelectionChanged(item);
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

  protected getShowPercentagesDefault(): boolean {
    if(this.options.showPercentages === undefined) {
      return ["pie", "doughnut"].indexOf(this.chartType) !== -1;
    }
    return this.options.showPercentages === true;
  }

  public get percentagePrecision(): number {
    return this._percentagePrecision;
  }

  /**
   * Gets and sets whether chart should show values and percentages.
   */
  public get showPercentages(): boolean {
    if(this._showPercentages !== undefined) {
      return this._showPercentages;
    } else {
      return this.getShowPercentagesDefault();
    }
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
    return this.options.allowSortAnswers !== false &&
            this.options.allowChangeAnswersOrder !== false &&
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
    this.dataProvider.raiseDataChanged(this.name);
    this.refreshContent();
    this.stateChanged("showMissingAnsewrs", value);
  }

  public get legendPosition(): "left" | "right" | "top" | "bottom" {
    return this._legendPosition;
  }

  public set legendPosition(value: "left" | "right" | "top" | "bottom") {
    this._legendPosition = value;
    this.refreshContent();
    this.stateChanged("legendPosition", value);
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
    return question["activeChoices"] || question.visibleChoices || question.choices || [];
  }

  getValues(): Array<any> {
    const values: Array<any> = this.valuesSource().map(
      (choice) => choice.value
    );

    if((<QuestionSelectBase>this.question).hasNone) {
      values.push((<QuestionSelectBase>this.question).noneItem.value);
    }
    if(this.question.hasOther) {
      values.push("other");
    }
    if(this.showMissingAnswers) {
      values.unshift(undefined);
    }
    if(this.showValuesInOriginalOrder) {
      return values.reverse();
    }
    return values;
  }

  getLabels(): Array<string> {
    if(this.options.useValuesAsLabels) {
      return this.getValues();
    }
    const labels: Array<string> = this.valuesSource().map((choice) =>
      ItemValue.getTextOrHtmlByValue(this.valuesSource(), choice.value)
    );
    const selBase = <QuestionSelectBase>this.question;
    if(selBase.hasNone) {
      labels.push(selBase.noneText);
    }
    if(selBase.hasOther) {
      labels.push(selBase.otherText);
    }
    if(this.showMissingAnswers) {
      labels.unshift(localization.getString("missingAnswersLabel"));
    }
    if(this.showValuesInOriginalOrder) {
      return labels.reverse();
    }
    return labels;
  }

  getPercentages(data: Array<Array<number>>): Array<Array<number>> {
    if(!data || !Array.isArray(data)) return [];

    var percentages: Array<Array<number>> = [];
    var percentagePrecision = this._percentagePrecision;

    if(data.length < 2) {
      var sum = data[0].reduce((sum, val) => sum + val, 0);
      percentages[0] = data[0].map((val) => {
        var value = percentagePrecision ? + (val / sum * 100).toFixed(percentagePrecision) : Math.round(val / sum * 100);
        return sum && value;
      });
    } else {
      for(var i = 0; i < data[0].length; i++) {
        var sum = 0;
        for(var j = 0; j < data.length; j++) {
          sum += data[j][i];
        }
        for(var j = 0; j < data.length; j++) {
          if(!Array.isArray(percentages[j])) percentages[j] = [];
          var value = percentagePrecision ? + (data[j][i] / sum * 100).toFixed(percentagePrecision) : Math.round(data[j][i] / sum * 100);
          percentages[j][i] = sum && value;
        }
      }
    }
    return percentages;
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
  public async getAnswersData(): Promise<IAnswersData> {
    let seriesLabels = this.getSeriesLabels();
    let datasets = (await this.getCalculatedValues()).data;
    let values = this.getValues();
    let labels = this.getLabels();
    let colors = VisualizerBase.getColors();
    if(this.transposeData) {
      datasets = this.transpose(datasets);
      const temp = seriesLabels;
      seriesLabels = labels;
      labels = temp;
      values = this.getSeriesValues();
    }

    var texts = this.showPercentages ? this.getPercentages(datasets) : datasets;

    if(this.answersOrder == "asc" || this.answersOrder == "desc") {
      var zippedArray = this.showPercentages
        ? DataHelper.zipArrays(labels, colors, values, texts[0])
        : DataHelper.zipArrays(labels, colors, values);
      let dict = DataHelper.sortDictionary(
        zippedArray,
        datasets[0],
        this.answersOrder == "desc"
      );
      let unzippedArray = DataHelper.unzipArrays(dict.keys);
      labels = unzippedArray[0];
      colors = unzippedArray[1];
      values = unzippedArray[2];
      if(this.showPercentages) texts[0] = unzippedArray[3];
      datasets[0] = dict.values;
    }

    let answersData = {
      datasets,
      values,
      labels,
      colors,
      texts,
      seriesLabels,
    };

    if(this.hideEmptyAnswers) {
      answersData = hideEmptyAnswersInData(answersData);
    }
    if(this.topN > 0) {
      answersData.datasets[0] = answersData.datasets[0].slice(-this.topN);
      answersData.labels = answersData.labels.slice(-this.topN);
      answersData.colors = answersData.colors.slice(-this.topN);
      answersData.texts[0] = answersData.texts[0].slice(-this.topN);
    }
    this.onAnswersDataReady.fire(this, answersData);

    return answersData;
  }

  public convertFromExternalData(externalCalculatedData: any): ICalculationResult {
    const values = this.getValues();
    const series = this.getSeriesValues();
    const innerCalculatedData = [];
    if(series.length > 0) {
      for(let j = 0; j < series.length; j++) {
        const seriesData = [];
        for(let i = 0; i < values.length; i++) {
          if(!!externalCalculatedData[series[j]]) {
            seriesData.push(externalCalculatedData[series[j]][values[i]] || 0);
          } else {
            seriesData.push(0);
          }
        }
        innerCalculatedData.push(seriesData);
      }
    } else {
      const seriesData = [];
      for(let i = 0; i < values.length; i++) {
        seriesData.push(externalCalculatedData[values[i]] || 0);
      }
      innerCalculatedData.push(seriesData);
    }
    return {
      data: innerCalculatedData,
      values,
      series
    };
  }

  protected transpose(data: Array<Array<number>>): Array<Array<number>> {
    const dim2 = data[0].length;
    const result = new Array<Array<number>>(dim2);
    for(let i = 0; i < dim2; ++i)
      result[i] = new Array<number>(data.length);

    for(let i = 0; i < data.length; ++i)
      for(let j = 0; j < dim2; ++j) {
        result[j][i] = data[i][j];
      }
    return result;
  }

  private static _defaultState = {
    "chartType": undefined,
    "answersOrder": "default",
    "hideEmptyAnswers": false,
    "legendPosition": "right",
    "showOnlyPercentages": false,
    "transposeData": false,
    "showMissingAnswers": false,
    "topN": -1
  };

  public getDefaultState(): any {
    if(this._defaultStateValue !== undefined) {
      return this._defaultStateValue;
    }
    this._defaultStateValue = Object.assign({}, super.getDefaultState(), SelectBase._defaultState);
    this._defaultStateValue.showOnlyPercentages = this.options.showOnlyPercentages === true;
    this._defaultStateValue.answersOrder = this.options.answersOrder || "default";
    this._defaultStateValue.hideEmptyAnswers = this.options.hideEmptyAnswers === true;
    this._defaultStateValue.legendPosition = this.options.legendPosition || "right";
    this._defaultStateValue.transposeData = this.options.transposeData === true;
    this._defaultStateValue.showMissingAnswers = this.isSupportMissingAnswers() && this.options.showMissingAnswers === true;

    this._defaultStateValue.chartType = this.questionOptions?.chartType || this.chartTypes[0];
    this._defaultStateValue.filter = undefined;
    return this._defaultStateValue;
  }

  public getState(): any {
    const state = super.getState();
    if(!!this.selectedItem) {
      state.filter = this.selectedItem.value;
    }
    return state;
  }

  protected setStateCore(state: any): void {
    super.setStateCore(state);
    const selectedItem = ItemValue.getItemByValue((this.question as QuestionSelectBase).visibleChoices, state.filter);
    this.setSelection(selectedItem ?? undefined);
  }

  public resetState(): void {
    super.resetState();
    this.setSelection(undefined);
  }

  protected onThemeChanged(): void {
    super.onThemeChanged();
    this.refreshContent();
  }
}

VisualizationManager.registerVisualizer("checkbox", SelectBase);
VisualizationManager.registerVisualizer("radiogroup", SelectBase);
VisualizationManager.registerVisualizer("dropdown", SelectBase);
VisualizationManager.registerVisualizer("imagepicker", SelectBase);
VisualizationManager.registerVisualizer("tagbox", SelectBase);
VisualizationManager.registerVisualizer("rating", SelectBase, 100);