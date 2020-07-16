import { Table, Event } from "../table";
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
    protected row: any,
    public renderDetailActions: (
      container: HTMLElement,
      data: any,
      datatablesRow: any
    ) => HTMLElement
  ) {
    super(table, toolsContainer, detailsContainer, renderDetailActions);
  }

  public getElement(): HTMLElement {
    return this.row.getElement();
  }

  public getData(): HTMLElement {
    return this.row.getData();
  }
}

export class DatatablesRow extends TableRow {
  constructor(
    protected table: Table,
    protected toolsContainer: HTMLElement,
    protected detailsContainer: HTMLElement,
    protected row: any,
    public renderDetailActions: (
      container: HTMLElement,
      data: any,
      datatablesRow: any
    ) => HTMLElement
  ) {
    super(table, toolsContainer, detailsContainer, renderDetailActions);
  }

  public getElement(): HTMLElement {
    return this.row.node();
  }

  public getData(): HTMLElement {
    return this.row.data();
  }
}

interface IAction {
  actionName: string;
  actionCreator: (row: TableRow, table: Table) => HTMLElement;
}

export class RowTools {
  constructor(
    private targetNode: HTMLElement,
    private table: Table,
    private row: TableRow
  ) {
    this.actions = { detail: this.createDetailsBtn };
  }
  private actions: {
    [actionName: string]: (row: TableRow, table: Table) => HTMLElement;
  };
  public render() {
    for (var actionName in this.actions) {
      if (this.actions.hasOwnProperty(actionName)) {
        this.targetNode.appendChild(
          this.actions[actionName](this.row, this.table)
        );
      }
    }
  }

  protected createDetailsBtn = (row: TableRow) => {
    const btn = DocumentHelper.createSvgButton("detail");
    btn.title = localization.getString("showMinorColumns");

    btn.onclick = () => {
      row.toggleDetails();
    };
    return btn;
  };

  public addAction(action: IAction) {
    this.actions[action.actionName] = action.actionCreator;
  }

  public removeActions(actionName: string) {
    delete this.actions.actionName;
  }
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
