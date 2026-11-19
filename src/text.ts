import { Question, QuestionMultipleTextModel, ScrollViewModel } from "survey-core";
import { ICalculationResult, VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils/documentHelper";
import { getNestedDataRows } from "./statisticCalculators";

import "./text.scss";

export class TextTableAdapter {
  private scrollModel: ScrollViewModel;

  constructor(private model: Text) {}

  public async create(container: HTMLElement): Promise<void> {
    this.releaseScroll();
    const answersData = await this.model.getAnswersData();

    if(answersData.datasets.length === 0 || answersData.datasets[0].length === 0) {
      var emptyTextNode = DocumentHelper.createElement("p", "sa-no-result", {
        innerText: localization.getString("noResults"),
      });
      container.appendChild(emptyTextNode);
      return;
    }

    const tableNode = <HTMLTableElement>(
      DocumentHelper.createElement("table", "sa-text-table")
    );

    if(this.model.columns && this.model.columns.length > 0) {
      var row = DocumentHelper.createElement("tr");
      this.model.columns.forEach(column => {
        var td = DocumentHelper.createElement("th", "sa-text-table__cell", {
          textContent: column.title,
        });
        row.appendChild(td);
      });
      tableNode.appendChild(row);
    }

    answersData.datasets.forEach((rowData) => {
      var row = DocumentHelper.createElement("tr");
      for(var i = 0; i < answersData.seriesLabels.length; i++) {
        const column = this.model.columns[i];
        var td = DocumentHelper.createElement("td", "sa-text-table__cell" + (column?.type == "number" ? " sa-text-table__cell--number" : ""), {
          textContent: rowData[i],
        });
        row.appendChild(td);
      }
      tableNode.appendChild(row);
    });

    container.className = "sa-text-table__container";
    const wrapper = DocumentHelper.createElement("div", "sv-scroll__wrapper");
    const scroller = DocumentHelper.createElement("div", "sv-scroll__scroller");
    const scrollContainer = DocumentHelper.createElement("div", "sv-scroll__container");
    const scrollbar = DocumentHelper.createElement("div", "sv-scroll__scrollbar");
    const sizer = DocumentHelper.createElement("div", "sv-scroll__scrollbar-sizer");
    scrollContainer.appendChild(tableNode);
    scroller.appendChild(scrollContainer);
    scrollbar.appendChild(sizer);
    wrapper.appendChild(scroller);
    wrapper.appendChild(scrollbar);
    container.appendChild(wrapper);

    this.scrollModel = new ScrollViewModel();
    scroller.addEventListener("scroll", () => this.scrollModel.onScrollContainer());
    scrollbar.addEventListener("scroll", () => this.scrollModel.onScrollScrollbar());
    // ScrollViewModel stores the sv-scroll elements, then attaches a ResizeObserver.
    // jsdom has no ResizeObserver. The element refs are already stored when that constructor throws.
    try {
      this.scrollModel.setRootElement(wrapper);
    } catch(error) {
      if(typeof ResizeObserver !== "undefined") {
        throw error;
      }
    }
  }

  private releaseScroll(): void {
    if(!this.scrollModel) return;
    this.scrollModel.unsubscribeRootElement();
    this.scrollModel.setRootElement(undefined);
    this.scrollModel = undefined;
  }

  public destroy(node: HTMLElement) {
    this.releaseScroll();
    if(node) {
      node.innerHTML = "";
    }
  }
}

export class Text extends VisualizerBase {
  private _textTableAdapter: TextTableAdapter;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    type?: string
  ) {
    super(question, data, options, type || "text");
    this._textTableAdapter = new TextTableAdapter(this);
  }

  public get columns(): Array<{ name: string, title: string, type: string }> {
    const columns = [];
    if(this.dataType == "multipletext") {
      (this.question as QuestionMultipleTextModel).items.forEach(item => {
        columns.push({ name: item.name, title: item.title, type: item.inputType });
      });
    }
    return columns;
  }

  public getValues(): Array<any> {
    return [];
  }

  protected getCalculatedValuesCore(): ICalculationResult {
    let result: Array<Array<string>> = [];
    let columnCount = 0;

    this.surveyData.forEach((dataRow) => {
      const nestedDataRows = getNestedDataRows(dataRow, this.dataPath);
      nestedDataRows.forEach(row => {
        const rowValue: any = row[this.question.name];
        let dataStrings: Array<string> = [];
        if(!!rowValue) {
          if(Array.isArray(rowValue)) {
            dataStrings = dataStrings.concat(rowValue);
          } else {
            if(typeof rowValue === "object") {
              Object.keys(rowValue).forEach((key) =>
                dataStrings.push(rowValue[key])
              );
            } else {
              dataStrings.push(rowValue);
            }
          }
          result.push(dataStrings);
          if(dataStrings.length > columnCount) {
            columnCount = dataStrings.length;
          }
        }
      });
    });

    const series = [];
    series.length = columnCount;
    return { data: result as any, values: [], series };
  }

  protected destroyContent(container: HTMLElement) {
    this._textTableAdapter.destroy(container);
    super.destroyContent(container);
  }

  protected async renderContentAsync(container: HTMLElement) {
    const tableNode: HTMLElement = DocumentHelper.createElement("div");
    await this._textTableAdapter.create(tableNode);
    container.innerHTML = "";
    container.appendChild(tableNode);
    return container;
  }

  destroy() {
    this._textTableAdapter.destroy(this.contentContainer);
    super.destroy();
  }
}

VisualizationManager.registerVisualizer("text", Text, undefined, "text");
VisualizationManager.registerVisualizer("comment", Text, undefined, "text");
VisualizationManager.registerVisualizer("multipletext", Text, undefined, "text");
