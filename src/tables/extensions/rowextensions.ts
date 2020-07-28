import { Table } from "../table";
import { Event } from "survey-core";
import { localization } from "../../localizationManager";
import { QuestionLocation } from "../config";
import { DocumentHelper } from "../../utils";
import { TableExtensions } from "./tableextensions";
import { DataTables } from "../datatables";

export abstract class TableRow {
  constructor(
    protected table: Table,
    protected extensionsContainer: HTMLElement,
    protected detailsContainer: HTMLElement
  ) {
    this.details = new Details(table, this, detailsContainer);
    this.extensions = new RowExtensions(extensionsContainer, table, this);
    table.onColumnsLocationChanged.add(() => {
      this.closeDetails();
    });
  }
  public details: Details;
  public extensions: RowExtensions;
  private detailedRowClass = "sa-table__detail-row";
  private isDetailsExpanded = false;
  public onToggleDetails: Event<
    (sender: TableRow, options: any) => any,
    any
  > = new Event<(sender: TableRow, options: any) => any, any>();

  public abstract getElement(): HTMLElement;
  public abstract getData(): any;
  protected isSelected: boolean;

  public getIsDetailsExpanded() {
    return false;
  }

  public render() {
    this.extensions.render();
  }

  public openDetails() {
    this.details.open();
    this.getElement().className += " " + this.detailedRowClass;
    this.onToggleDetails.fire(this, { isExpanded: true });
    this.isDetailsExpanded = true;
  }

  public closeDetails() {
    this.details.close();
    this.getElement().classList.remove(this.detailedRowClass);
    this.onToggleDetails.fire(this, { isExpanded: false });
    this.isDetailsExpanded = false;
  }

  public toggleDetails() {
    if (this.isDetailsExpanded) {
      this.closeDetails();
    } else this.openDetails();
  }

  public getIsSelected(): boolean {
    return this.isSelected;
  }

  public toggleSelect(): void {
    this.isSelected = !this.isSelected;
  }

  public remove(): void {
    this.table.removeRow(this);
  }
}

export class TabulatorRow extends TableRow {
  constructor(
    protected table: Table,
    protected extensionsContainer: HTMLElement,
    protected detailsContainer: HTMLElement,
    protected innerRow: any
  ) {
    super(table, extensionsContainer, detailsContainer);
  }

  public getElement(): HTMLElement {
    return this.innerRow.getElement();
  }

  public getData(): HTMLElement {
    return this.innerRow.getData();
  }

  public remove() {
    this.innerRow.delete();
    super.remove();
  }
}

export class DatatablesRow extends TableRow {
  constructor(
    protected table: Table,
    protected extensionsContainer: HTMLElement,
    protected detailsContainer: HTMLElement,
    private _innerRow: any
  ) {
    super(table, extensionsContainer, detailsContainer);
    this.rowElement = _innerRow.node();
    this.rowData = _innerRow.data();
    this._innerRow = this._innerRow.row(this.rowElement);
    (<DataTables>table).columnsChanged.add(() => {
      this.render();
    });
  }
  private rowElement: HTMLElement;
  private rowData: any;

  public get innerRow() {
    return this._innerRow.row(this.rowElement);
  }

  public getElement(): HTMLElement {
    return this.rowElement;
  }

  public getData(): HTMLElement {
    return this.rowData;
  }

  public remove(): void {
    this.innerRow.remove().draw();
    super.remove();
  }
}

export class RowExtensions extends TableExtensions {
  constructor(
    protected targetNode: HTMLElement,
    protected table: Table,
    protected row: TableRow
  ) {
    super(targetNode, table);
    this.options.row = row;
  }
  protected location = "row";
}

export class Details {
  constructor(
    protected table: Table,
    private row: TableRow,
    protected targetNode: HTMLElement
  ) {
    var detailsTable = DocumentHelper.createElement(
      "table",
      "sa-table__detail-table"
    );
    this.detailsTable = detailsTable;
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
        var td1 = DocumentHelper.createElement("td", "", {
          innerHTML: column.displayName,
        });
        var td2 = DocumentHelper.createElement("td", "");
        td2.textContent = this.row.getData()[column.name];
        var td3 = DocumentHelper.createElement("td", "");
        td3.appendChild(this.createShowAsColumnButton(column.name));
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        rows.push(row);
      });
    var row = DocumentHelper.createElement("tr", "sa-table__detail");
    var td = DocumentHelper.createElement("td", "", { colSpan: 1 });
    var extensions = new DetailsExtensions(td, this.table, this.row);
    extensions.render();
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
      "sa-table__btn sa-table__btn--gray",
      { innerHTML: localization.getString("showAsColumn") }
    );
    button.onclick = (e) => {
      e.stopPropagation();
      this.table.setColumnLocation(columnName, QuestionLocation.Column);
    };

    return button;
  };

  public close() {
    this.detailsTable.remove();
  }
}

export class DetailsExtensions extends TableExtensions {
  constructor(
    protected targetNode: HTMLElement,
    protected table: Table,
    protected row: TableRow
  ) {
    super(targetNode, table);
    this.options.row = row;
  }
  protected location = "details";
}

TableExtensions.registerExtension({
  location: "row",
  name: "details",
  visibleIndex: 0,
  render: (_table: Table, options: any) => {
    const btn = DocumentHelper.createSvgButton("detail");
    btn.title = localization.getString("showMinorColumns");

    btn.onclick = () => {
      options.row.toggleDetails();
    };
    return btn;
  },
});

TableExtensions.registerExtension({
  location: "row",
  name: "select",
  visibleIndex: -1,
  render: function (table, opt) {
    var row = opt.row;
    var checkbox = DocumentHelper.createElement("input", "", {
      type: "checkbox",
    });
    checkbox.style.height = "auto";
    checkbox.style.marginLeft = "10px";
    checkbox.onchange = function (ev) {
      row.toggleSelect();
    };
    return checkbox;
  },
});
