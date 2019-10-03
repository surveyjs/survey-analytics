import { Question } from "survey-core";
import { VisualizerBase } from "./visualizerBase";
import { VisualizationManager } from "./visualizationManager";

import "./text.scss";

export class Text extends VisualizerBase {
  constructor(
    targetElement: HTMLElement,
    question: Question,
    data: Array<{ [index: string]: any }>,
    options?: Object
  ) {
    super(targetElement, question, data, options);
  }

  public get name() {
    return "text";
  }

  getData() {
    let result: Array<Array<string>> = [];
    let columnsCount = 0;

    this.data.forEach(row => {
      const rowValue: any = row[this.question.name];
      const dataStrings: Array<string> = [];
      if (!!rowValue) {
        if (Array.isArray(rowValue)) {
          dataStrings.concat(rowValue);
        } else {
          if (typeof rowValue === "object") {
            Object.keys(rowValue).forEach(key => dataStrings.push(rowValue[key]));
          } else {
            dataStrings.push(rowValue);
          }
        }
        result.push(dataStrings);
        if(dataStrings.length > columnsCount) {
            columnsCount = dataStrings.length;
        }
      }
    });

    return { columnsCount, data: result };
  }

  protected renderContent(container: HTMLDivElement) {
    const { columnsCount, data}  = this.getData();
    const emptyTextNode = <HTMLElement>document.createElement("p");
    emptyTextNode.innerHTML = "There are no results yet";

    if (data.length === 0) {
        container.appendChild(emptyTextNode);
      return;
    }

    const tableNode = <HTMLTableElement>document.createElement("table");
    tableNode.className = "sa-text-table";
    tableNode.style.backgroundColor = this.backgroundColor;
    container.appendChild(tableNode);

    data.forEach(rowData => {
        var row = document.createElement("tr");
        for(var i = 0; i < columnsCount; i++) {
            var td = document.createElement("td");
            td.className = "sa-text-table__cell";
            td.textContent = rowData[i];
            row.appendChild(td);
        }
        tableNode.appendChild(row);
    });

    container.className = "sa-text-table__container";
    container.appendChild(tableNode);
  }

  destroy() {
    super.destroy();
    this.targetElement.className = "";
  }
}

VisualizationManager.registerVisualizer("text", Text);
VisualizationManager.registerVisualizer("comment", Text);
VisualizationManager.registerVisualizer("multipletext", Text);
