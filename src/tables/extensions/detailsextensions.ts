import { TableRow } from "../table";
import { Table } from "../table";
import { DocumentHelper } from "../../utils";
import { ColumnDataType, QuestionLocation } from "../config";
import { TableExtensions } from "./tableextensions";
import { localization } from "../../localizationManager";

export class Details {
  constructor(
    protected table: Table,
    private row: TableRow,
    protected targetNode: HTMLElement
  ) {
    this.detailsTable = DocumentHelper.createElement(
      "table",
      "sa-table__detail-table"
    );
    this.table.onColumnsLocationChanged.add(() => {
      this.close();
    });
  }
  private detailsTable: HTMLElement;
  protected location = "details";

  public open(): void {
    this.detailsTable.innerHTML = "";
    var rows: HTMLElement[] = [];
    this.table.columns
      .filter((column) => column.location === QuestionLocation.Row && column)
      .forEach((column) => {
        var row = DocumentHelper.createElement("tr", "sa-table__detail");
        var td1 = DocumentHelper.createElement("td");
        td1.appendChild(document.createTextNode(column.displayName));
        var td2 = DocumentHelper.createElement("td");
        td2.textContent = this.row.getRowData()[column.name];
        if(column.dataType === ColumnDataType.Image) {
          td2.innerHTML = "<image src='" + td2.textContent + "'/>";
        }
        var td3 = DocumentHelper.createElement("td");
        td3.appendChild(this.createShowAsColumnButton(column.name));
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        rows.push(row);
      });
    var row = DocumentHelper.createElement("tr", "sa-table__detail");
    var td = DocumentHelper.createElement("td", "", { colSpan: 3 });
    var extensions = new TableExtensions(this.table);
    extensions.render(td, "details", { row: this.row });
    if (td.children.length != 0) {
      row.appendChild(td);
      rows.push(row);
    }

    rows.forEach((row) => {
      this.detailsTable.appendChild(row);
    });
    this.targetNode.appendChild(this.detailsTable);
  }

  protected createShowAsColumnButton = (columnName: string): HTMLElement => {
    const button = DocumentHelper.createElement(
      "button",
      "sa-table__btn sa-table__btn--gray"
    );
    button.appendChild(document.createTextNode(localization.getString("showAsColumn")));
    button.onclick = (e) => {
      e.stopPropagation();
      this.table.setColumnLocation(columnName, QuestionLocation.Column);
    };

    return button;
  };

  public close() {
    if (!!this.detailsTable.parentNode) {
      this.detailsTable.parentNode.removeChild(this.detailsTable);
    }
  }
}
