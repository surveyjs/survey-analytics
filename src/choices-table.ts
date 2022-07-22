import { Question } from "survey-core";
import { SelectBase } from "./selectBase";
import { VisualizationManager } from "./visualizationManager";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils";

var styles = require("./choices-table.scss");

export class ChoicesTableAdapter {
  constructor(private model: ChoicesTable) {}

  public create(container: HTMLElement) {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = this.model.getAnswersData();

    const hasSeries = seriesLabels.length > 1;

    const emptyTextNode = <HTMLElement>DocumentHelper.createElement("p", "", {
      innerText: localization.getString("noResults"),
    });

    if (datasets.length === 0 || datasets[0].length === 0) {
      container.appendChild(emptyTextNode);
      return;
    }

    datasets.forEach((data, idx) => {
      const tableNode = <HTMLTableElement>(
        DocumentHelper.createElement("table", "sa-choices-table")
      );

      tableNode.style.backgroundColor = this.model.backgroundColor;
      container.appendChild(tableNode);

      var headerRow = DocumentHelper.createElement("tr");
      var labelCell = DocumentHelper.createElement("th", "sa-choices-table__cell-header", {
        textContent: localization.getString("answer"),
      });
      headerRow.appendChild(labelCell);
      var sparklineCell = DocumentHelper.createElement("th", "sa-choices-table__cell-header", {
        textContent: "",
      });
      headerRow.appendChild(sparklineCell);
      var percentCell = DocumentHelper.createElement("th", "sa-choices-table__cell-header", {
        textContent: localization.getString("percent"),
      });
      headerRow.appendChild(percentCell);
      var valueCell = DocumentHelper.createElement("th", "sa-choices-table__cell-header", {
        textContent: localization.getString("responses"),
      });
      headerRow.appendChild(valueCell);
      tableNode.appendChild(headerRow);

      data.forEach((rowData, index) => {
        var row = DocumentHelper.createElement("tr");
        var labelCell = DocumentHelper.createElement("td", "sa-choices-table__cell", {
          textContent: labels[index],
        });
        row.appendChild(labelCell);
        var sparklineCell = DocumentHelper.createElement("td", "sa-choices-table__cell");
        var outerBar = DocumentHelper.createElement("div", "sa-choices-sparkline");
        var innerBar = DocumentHelper.createElement("div", "sa-choices-sparkline-value");
        innerBar.style.width = texts[idx][index] + "%";
        outerBar.appendChild(innerBar);
        sparklineCell.appendChild(outerBar);
        row.appendChild(sparklineCell);
        var percentCell = DocumentHelper.createElement("td", "sa-choices-table__cell sa-choices-table__cell-value", {
          textContent: "" + texts[idx][index] + "%",
        });
        row.appendChild(percentCell);
        var valueCell = DocumentHelper.createElement("td", "sa-choices-table__cell sa-choices-table__cell-value", {
          textContent: rowData,
        });
        row.appendChild(valueCell);
        tableNode.appendChild(row);
      });

      container.className = "sa-choices-table__container";
      container.appendChild(tableNode);
    });
  }

  public destroy(node: HTMLElement) {
    node.innerHTML = "";
  }
}

export class ChoicesTable extends SelectBase {
  private _choicesTableAdapter: ChoicesTableAdapter;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "choices");
    this._choicesTableAdapter = new ChoicesTableAdapter(this);
    this.answersOrder = "asc";
    this.showPercentages = true;
  }

  protected destroyContent(container: HTMLElement) {
    this._choicesTableAdapter.destroy(container);
    super.destroyContent(container);
  }

  protected renderContent(container: HTMLElement) {
    this._choicesTableAdapter.create(container);
    this.afterRender(this.contentContainer);
  }

  destroy() {
    this._choicesTableAdapter.destroy(this.contentContainer);
    super.destroy();
  }
}

// VisualizationManager.registerVisualizer("radiogroup", ChoicesTable);
// VisualizationManager.registerVisualizer("dropdown", ChoicesTable);
// VisualizationManager.registerVisualizer("checkbox", ChoicesTable);
