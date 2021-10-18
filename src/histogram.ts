import { ItemValue, Question } from "survey-core";
import { SelectBase } from "./selectBase";

export class HistogramModel extends SelectBase {
  private _cachedValues: Array<any> = undefined;
  protected chartTypes: string[];
  public chartType: string;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "histogram");
  }

  public getSelectedItemByText(itemText: string) {
    return new ItemValue(null);
  }

  /**
   * Updates visualizer data.
   */
  updateData(data: Array<{ [index: string]: any }>) {
    this._cachedValues = undefined;
    super.updateData(data);
  }

  getValues(): Array<any> {
    if (this._cachedValues === undefined) {
      const hash = {};
      this.dataProvider.filteredData.forEach(item => {
        hash[item[this.dataName]] = 0;
      });
      this._cachedValues = Object.keys(hash);
      // TODO: implement intervals
    }
    return this._cachedValues;
  }

  getLabels(): Array<string> {
    var labels = this.getValues();
    // TODO: get labels
    return labels;
  }
}
