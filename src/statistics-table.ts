import { Question } from "survey-core";
import { SelectBase } from "./selectBase";
import { BooleanModel } from "./boolean";
import { VisualizationManager } from "./visualizationManager";
import { DocumentHelper } from "./utils";
import { localization } from "./localizationManager";

import "./statistics-table.scss";

export class StatisticsTableAdapter {
  constructor(private model: SelectBase) {}

  public async create(container: HTMLElement): Promise<void> {
    let {
      datasets,
      labels,
      colors,
      texts,
      seriesLabels,
    } = await this.model.getAnswersData();

    const hasSeries = seriesLabels.length > 1;

    if(datasets.length === 0 || datasets[0].length === 0) {
      const emptyTextNode = DocumentHelper.createElement("p", "", {
        innerText: localization.getString("noResults"),
      });
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
      var labelCell = DocumentHelper.createElement("th", "sa-statistics-table__cell-header");
      var cellHeaderContent = DocumentHelper.createElement("div", "sa-statistics-table__cell-header-text", {
        textContent: localization.getString("answer"),
      });
      labelCell.appendChild(cellHeaderContent);
      headerRow.appendChild(labelCell);
      var sparklineCell = DocumentHelper.createElement("th", "sa-statistics-table__cell-header");
      cellHeaderContent = DocumentHelper.createElement("div", "sa-statistics-table__cell-header-text", {
        textContent: localization.getString("statistics_chart"),
      });
      sparklineCell.appendChild(cellHeaderContent);
      headerRow.appendChild(sparklineCell);
      var percentCell = DocumentHelper.createElement("th", "sa-statistics-table__cell-header sa-statistics-table__cell-value");
      cellHeaderContent = DocumentHelper.createElement("div", "sa-statistics-table__cell-header-text", {
        textContent: localization.getString("percentage"),
      });
      percentCell.appendChild(cellHeaderContent);
      headerRow.appendChild(percentCell);
      var valueCell = DocumentHelper.createElement("th", "sa-statistics-table__cell-header sa-statistics-table__cell-value");
      cellHeaderContent = DocumentHelper.createElement("div", "sa-statistics-table__cell-header-text", {
        textContent: localization.getString("responses"),
      });
      valueCell.appendChild(cellHeaderContent);
      headerRow.appendChild(valueCell);
      tableNode.appendChild(headerRow);

      for(let index = data.length - 1; index >= 0; index--) {
        var row = DocumentHelper.createElement("tr");
        var labelCell = DocumentHelper.createElement("td", "sa-statistics-table__cell");
        var labelCellContent = DocumentHelper.createElement("div", "sa-statistics-table__cell-text", {
          textContent: labels[index],
        });
        labelCell.appendChild(labelCellContent);

        row.appendChild(labelCell);
        var sparklineCell = DocumentHelper.createElement("td", "sa-statistics-table__cell");
        var outerBar = DocumentHelper.createElement("div", "sa-choices-sparkline");
        var innerBar = DocumentHelper.createElement("div", "sa-choices-sparkline-value");
        innerBar.style.width = texts[idx][index] + "%";
        outerBar.appendChild(innerBar);
        sparklineCell.appendChild(outerBar);
        row.appendChild(sparklineCell);
        var percentCell = DocumentHelper.createElement("td", "sa-statistics-table__cell sa-statistics-table__cell-value");
        labelCellContent = DocumentHelper.createElement("div", "sa-statistics-table__cell-text", {
          textContent: "" + texts[idx][index] + "%",
        });
        percentCell.appendChild(labelCellContent);

        row.appendChild(percentCell);
        var valueCell = DocumentHelper.createElement("td", "sa-statistics-table__cell sa-statistics-table__cell-value");
        labelCellContent = DocumentHelper.createElement("div", "sa-statistics-table__cell-text", {
          textContent: data[index],
        });
        valueCell.appendChild(labelCellContent);

        row.appendChild(valueCell);
        tableNode.appendChild(row);
      }

      container.className = "sa-statistics-table__container";
      container.appendChild(tableNode);
    });
  }

  public destroy(node: HTMLElement) {
    if(!!node) {
      node.innerHTML = "";
    }
  }
}

export class StatisticsTable extends SelectBase {
  private _statisticsTableAdapter: StatisticsTableAdapter;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    type?: string
  ) {
    super(question, data, options, type || "choices");
    this._statisticsTableAdapter = new StatisticsTableAdapter(this);
    this.showPercentages = true;
    this.chartTypes = [];
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

export class StatisticsTableBoolean extends BooleanModel {
  private _statisticsTableAdapter: StatisticsTableAdapter;

  constructor(
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object,
    type?: string
  ) {
    super(question, data, options, type || "options");
    this._statisticsTableAdapter = new StatisticsTableAdapter(this);
    this.showPercentages = true;
    this.chartTypes = [];
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

VisualizationManager.registerVisualizer("radiogroup", StatisticsTable, undefined, "choices");
VisualizationManager.registerVisualizer("dropdown", StatisticsTable, undefined, "choices");
VisualizationManager.registerVisualizer("checkbox", StatisticsTable, undefined, "choices");
VisualizationManager.registerVisualizer("boolean", StatisticsTableBoolean, undefined, "options");
VisualizationManager.registerVisualizer("table", StatisticsTable, undefined, "choices");
