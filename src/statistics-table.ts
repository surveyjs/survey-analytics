import { Question } from "survey-core";
import { SelectBase } from "./selectBase";
import { VisualizationManager } from "./visualizationManager";
import { localization } from "./localizationManager";
import { DocumentHelper } from "./utils";

import "./statistics-table.scss";

export class StatisticsTableAdapter {
  constructor(private model: StatisticsTable) {}

  public async create(container: HTMLElement): Promise<void> {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = await this.model.getAnswersData();

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
        DocumentHelper.createElement("table", "sa-statistics-table")
      );

      tableNode.style.backgroundColor = this.model.backgroundColor;
      container.appendChild(tableNode);

      var headerRow = DocumentHelper.createElement("tr");
      var labelCell = DocumentHelper.createElement("th", "sa-statistics-table__cell-header", {
        textContent: localization.getString("answer"),
      });
      headerRow.appendChild(labelCell);
      var sparklineCell = DocumentHelper.createElement("th", "sa-statistics-table__cell-header", {
        textContent: localization.getString("statistics_chart"),
      });
      headerRow.appendChild(sparklineCell);
      var percentCell = DocumentHelper.createElement("th", "sa-statistics-table__cell-header", {
        textContent: localization.getString("percentage"),
      });
      headerRow.appendChild(percentCell);
      var valueCell = DocumentHelper.createElement("th", "sa-statistics-table__cell-header", {
        textContent: localization.getString("responses"),
      });
      headerRow.appendChild(valueCell);
      tableNode.appendChild(headerRow);

      for(let index = data.length - 1; index >= 0; index--) {
        var row = DocumentHelper.createElement("tr");
        var labelCell = DocumentHelper.createElement("td", "sa-statistics-table__cell", {
          textContent: labels[index],
        });
        row.appendChild(labelCell);
        var sparklineCell = DocumentHelper.createElement("td", "sa-statistics-table__cell");
        var outerBar = DocumentHelper.createElement("div", "sa-choices-sparkline");
        var innerBar = DocumentHelper.createElement("div", "sa-choices-sparkline-value");
        innerBar.style.width = texts[idx][index] + "%";
        outerBar.appendChild(innerBar);
        sparklineCell.appendChild(outerBar);
        row.appendChild(sparklineCell);
        var percentCell = DocumentHelper.createElement("td", "sa-statistics-table__cell sa-statistics-table__cell-value", {
          textContent: "" + texts[idx][index] + "%",
        });
        row.appendChild(percentCell);
        var valueCell = DocumentHelper.createElement("td", "sa-statistics-table__cell sa-statistics-table__cell-value", {
          textContent: data[index],
        });
        row.appendChild(valueCell);
        tableNode.appendChild(row);
      }

      container.className = "sa-statistics-table__container";
      container.appendChild(tableNode);
    });
  }

  public destroy(node: HTMLElement) {
    node.innerHTML = "";
  }
}

export class StatisticsTable extends SelectBase {
  private _statisticsTableAdapter: StatisticsTableAdapter;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    name?: string
  ) {
    super(question, data, options, name || "choices");
    this._statisticsTableAdapter = new StatisticsTableAdapter(this);
    this.showPercentages = true;
  }

  protected destroyContent(container: HTMLElement) {
    this._statisticsTableAdapter.destroy(container);
    super.destroyContent(container);
  }

  protected async renderContentAsync(container: HTMLElement) {
    const tableNode: HTMLElement = DocumentHelper.createElement("div");
    await this._statisticsTableAdapter.create(tableNode);
    container.innerHTML = "";
    container.appendChild(tableNode);
    return container;
  }

  destroy() {
    this._statisticsTableAdapter.destroy(this.contentContainer);
    super.destroy();
  }
}

VisualizationManager.registerVisualizer("radiogroup", StatisticsTable);
VisualizationManager.registerVisualizer("dropdown", StatisticsTable);
VisualizationManager.registerVisualizer("checkbox", StatisticsTable);
