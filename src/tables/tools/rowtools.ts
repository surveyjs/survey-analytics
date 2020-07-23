import { Table } from "../table";
import { Event } from "survey-core";
import { localization } from "../../localizationManager";
import { QuestionLocation } from "../config";
import { DocumentHelper } from "../../utils";

export abstract class TableRow {
  constructor(
    protected table: Table,
    protected toolsContainer: HTMLElement,
    protected detailsContainer: HTMLElement,
    public renderDetailActions: (
      container: HTMLElement,
      data: any,
      tableRow: TableRow
    ) => HTMLElement
  ) {
    this.details = new Details(
      table,
      this,
      detailsContainer,
      renderDetailActions
    );
    this.tools = new RowTools(toolsContainer, table, this);
    table.onColumnsLocationChanged.add(() => {
      this.closeDetails();
    });
  }
  public details: Details;
  public tools: RowTools;
  private detailedRowClass = "sa-table__detail-row";
  private isDetailsExpanded = false;
  public onToggleDetails: Event<
    (sender: TableRow, options: any) => any,
    any
  > = new Event<(sender: TableRow, options: any) => any, any>();

  public abstract getElement(): HTMLElement;
  public abstract getData(): any;

  public getIsDetailsExpanded() {
    return false;
  }

  public render() {
    this.tools.render();
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
}

export class TabulatorRow extends TableRow {
  constructor(
    protected table: Table,
    protected toolsContainer: HTMLElement,
    protected detailsContainer: HTMLElement,
    protected innerRow: any,
    public renderDetailActions: (
      container: HTMLElement,
      tableRow: any
    ) => HTMLElement
  ) {
    super(table, toolsContainer, detailsContainer, renderDetailActions);
  }
  public getElement(): HTMLElement {
    return this.innerRow.getElement();
  }

  public getData(): HTMLElement {
    return this.innerRow.getData();
  }
}

export class DatatablesRow extends TableRow {
  constructor(
    protected table: Table,
    protected toolsContainer: HTMLElement,
    protected detailsContainer: HTMLElement,
    private _innerRow: any,
    public renderDetailActions: (
      container: HTMLElement,
      tableRow: any
    ) => HTMLElement
  ) {
    super(table, toolsContainer, detailsContainer, renderDetailActions);
    this.rowElement = _innerRow.node();
    this.rowData = _innerRow.data();
    this._innerRow = this._innerRow.row(this.rowElement);
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
}

export class RowTools {
  constructor(
    private targetNode: HTMLElement,
    private table: Table,
    private row: TableRow
  ) {
    this.actions = [this.createDetailsBtn];
  }

  public actions: ((row: TableRow, table: Table) => HTMLElement)[];

  public render() {
    this.actions.forEach((action) => {
      this.targetNode.appendChild(action(this.row, this.table));
    });
  }
  protected createDetailsBtn = (row: TableRow) => {
    const btn = DocumentHelper.createSvgButton("detail");
    btn.title = localization.getString("showMinorColumns");

    btn.onclick = () => {
      row.toggleDetails();
    };
    return btn;
  };
}

export class Details {
  constructor(
    private table: Table,
    private row: TableRow,
    private targetNode: HTMLElement,
    private renderActions: any
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

  public setContainer(targetNode: HTMLElement) {
    this.targetNode = targetNode;
  }

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
    if (!!this.renderActions) {
      var row = DocumentHelper.createElement("tr", "sa-table__detail");
      var td = DocumentHelper.createElement("td", "", { colSpan: 1 });
      row.appendChild(td);
      rows.push(row);
      this.renderActions(td, this.row);
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
