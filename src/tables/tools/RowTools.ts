import { Table, Event } from "../table";
import { localization } from "../../localizationManager";
import { QuestionLocation } from "../config";
import { DocumentHelper } from "../../utils";

export class TableRow {
  constructor(
    table: Table,
    private rowElement: HTMLElement,
    private rowData: any,
    toolsContainer: HTMLElement,
    detailsContainer: HTMLElement,
    public renderDetailActions: (
      container: HTMLElement,
      data: any,
      datatablesRow: any
    ) => HTMLElement
  ) {
    this.details = new Details(table, this, detailsContainer, null);
    this.tools = new RowTools(toolsContainer, table, this);
    table.onColumnsLocationChanged.add(() => {
      this.closeDetails();
    });
  }
  private details: Details;
  private tools: RowTools;
  private detailedRowClass = "sa-table__detail-row";
  private isDetailsExpanded = false;
  public onToggleDetails: Event<
    (sender: TableRow, options: any) => any,
    any
  > = new Event<(sender: TableRow, options: any) => any, any>();

  public getData(): any {
    return this.rowData;
  }

  public getElement(): HTMLElement {
    return this.rowElement;
  }

  public getIsDetailsExpanded() {
    return false;
  }

  public render() {
    this.tools.render();
  }

  public openDetails() {
    this.details.open();
    this.rowElement.className += " " + this.detailedRowClass;
    this.onToggleDetails.fire(this, { isExpanded: true });
    this.isDetailsExpanded = true;
  }

  public closeDetails() {
    this.details.close();
    this.rowElement.classList.remove(this.detailedRowClass);
    this.onToggleDetails.fire(this, { isExpanded: false });
    this.isDetailsExpanded = false;
  }

  public toggleDetails() {
    if (this.isDetailsExpanded) {
      this.closeDetails();
    } else this.openDetails();
  }
}

export class RowTools {
  constructor(
    private targetNode: HTMLElement,
    private table: Table,
    private row: TableRow
  ) {}

  public render() {
    this.targetNode.appendChild(this.createDetailsBtn());
  }

  protected createDetailsBtn = () => {
    const btn = DocumentHelper.createSvgButton("detail");
    btn.title = localization.getString("showMinorColumns");

    btn.onclick = () => {
      this.row.toggleDetails();
    };
    return btn;
  };
}

export class Details {
  constructor(
    private table: Table,
    private row: TableRow,
    private detailsContainer: HTMLElement,
    private renderActions: any
  ) {
    var detailsTable = document.createElement("table");
    detailsTable.className = "sa-table__detail-table";
    this.detailsTable = detailsTable;
    this.table.onColumnsLocationChanged.add(() => {
      this.close();
    });
  }

  private detailsTable: HTMLElement;

  public open(): void {
    this.detailsTable.innerHTML = "";
    var rows: HTMLElement[] = [];
    this.table.columns
      .filter((column) => column.location === QuestionLocation.Row && column)
      .forEach((column) => {
        var row = document.createElement("tr");
        row.className = "sa-table__detail";
        var td1 = document.createElement("td");
        td1.textContent = column.displayName;
        var td2 = document.createElement("td");
        td2.textContent = this.row.getData()[column.name];
        var td3 = document.createElement("td");
        td3.appendChild(this.createShowAsColumnButton(column.name));
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        rows.push(row);
      });
    if (!!this.renderActions) {
      var row = document.createElement("tr");
      row.className = "sa-table__detail";
      var td = document.createElement("td");
      row.appendChild(td);
      rows.push(row);
      this.renderActions(td, this.table.getData(), row);
    }
    rows.forEach((row) => {
      this.detailsTable.appendChild(row);
    });
    this.detailsContainer.appendChild(this.detailsTable);
  }

  protected createShowAsColumnButton = (columnName: string): HTMLElement => {
    const button = document.createElement("button");
    button.innerHTML = localization.getString("showAsColumn");
    button.className = "sa-table__btn sa-table__btn--gray";
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
