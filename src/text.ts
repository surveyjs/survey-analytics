import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils";

var styles = require("./text.scss");

export class TextTableAdapter {
  constructor(private model: Text) {}

  public async create(container: HTMLElement): Promise<void> {
    const { columnCount, data } = (await this.model.getCalculatedValues()) as any;
    const emptyTextNode = <HTMLElement>DocumentHelper.createElement("p", "", {
      innerText: localization.getString("noResults"),
    });

    if (data.length === 0) {
      container.appendChild(emptyTextNode);
      return;
    }

    const tableNode = <HTMLTableElement>(
      DocumentHelper.createElement("table", "sa-text-table")
    );

    tableNode.style.backgroundColor = this.model.backgroundColor;
    container.appendChild(tableNode);

    data.forEach((rowData) => {
      var row = DocumentHelper.createElement("tr");
      for (var i = 0; i < columnCount; i++) {
        var td = DocumentHelper.createElement("td", "sa-text-table__cell", {
          textContent: rowData[i],
        });
        row.appendChild(td);
      }
      tableNode.appendChild(row);
    });

    container.className = "sa-text-table__container";
    container.appendChild(tableNode);
  }

  public destroy(node: HTMLElement) {
    node.innerHTML = "";
  }
}

export class Text extends VisualizerBase {
  private _textTableAdapter: TextTableAdapter;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "text");
    this._textTableAdapter = new TextTableAdapter(this);
  }

  protected getCalculatedValuesCore(): any {
    let result: Array<Array<string>> = [];
    let columnCount = 0;

    this.surveyData.forEach((row) => {
      const rowValue: any = row[this.question.name];
      let dataStrings: Array<string> = [];
      if (!!rowValue) {
        if (Array.isArray(rowValue)) {
          dataStrings = dataStrings.concat(rowValue);
        } else {
          if (typeof rowValue === "object") {
            Object.keys(rowValue).forEach((key) =>
              dataStrings.push(rowValue[key])
            );
          } else {
            dataStrings.push(rowValue);
          }
        }
        result.push(dataStrings);
        if (dataStrings.length > columnCount) {
          columnCount = dataStrings.length;
        }
      }
    });

    return { columnCount: columnCount, data: result };
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

VisualizationManager.registerVisualizer("text", Text);
VisualizationManager.registerVisualizer("comment", Text);
VisualizationManager.registerVisualizer("multipletext", Text);
