import { localization } from "../../localizationManager";
import { Table } from "../table";
import { ColumnVisibility } from "../config";

export class TableTools {
  constructor(private targetNode: HTMLElement, private table: Table) {}
  private showColumnDropdown: HTMLElement;

  render() {
    this.showColumnDropdown = this.createShowColumnDropdown();
    const filterInput = this.createFilterInput();

    this.targetNode.innerHTML = "";

    this.targetNode.appendChild(filterInput);
    if (!!this.showColumnDropdown)
      this.targetNode.appendChild(this.showColumnDropdown);

    this.targetNode.appendChild(this.getEntriesContainer());

    this.table.onColumnsVisibilityChanged.add(() => {
      this.update();
    });
  }

  protected createFilterInput(): HTMLElement {
    const input = document.createElement("input");
    input.classList.add("sa-table__global-filter");
    input.placeholder = "Search...";
    input.onchange = (event: any) => {
      this.table.applyFilter(event.target.value);
    };
    return input;
  }

  protected createShowColumnDropdown = (): HTMLElement => {
    const dropdown = document.createElement("select");
    dropdown.classList.add("sa-table__show-column");

    var hiddenColumns = this.table.columns.filter(
      (column: any) => column.visibility === ColumnVisibility.Invisible
    );
    if (hiddenColumns.length == 0) return null;
    var option = document.createElement("option");
    option.text = localization.getString("showColumn");
    option.disabled = true;
    option.selected = true;
    dropdown.appendChild(option);

    hiddenColumns.forEach((column: any) => {
      var option = document.createElement("option");
      var text = column.displayName;
      if (text.length > 20) {
        text = text.substring(0, 20) + "...";
      }
      option.text = text;
      option.title = column.displayName;
      option.value = column.name;
      dropdown.appendChild(option);
    });

    dropdown.onchange = (e: any) => {
      const val = e.target.value;
      e.stopPropagation();
      if (!val) return;
      this.table.setColumnVisibility(val, ColumnVisibility.Visible);
    };

    return dropdown;
  };

  getEntriesContainer(): HTMLElement {
    const selectorContainer = document.createElement("div");
    selectorContainer.className = "sa-table__entries";
    const showSpan = document.createElement("span");
    showSpan.innerHTML = "Show";
    const entriesSpan = document.createElement("span");
    entriesSpan.innerHTML = "entries";
    entriesSpan.className =
      "sa-table__entries-label sa-table__entries-label--left";
    selectorContainer.appendChild(showSpan);
    showSpan.className =
      "sa-table__entries-label sa-table__entries-label--right";
    selectorContainer.appendChild(this.getEntriesDropdown());
    selectorContainer.appendChild(entriesSpan);
    return selectorContainer;
  }

  getEntriesDropdown(): HTMLElement {
    const el = document.createElement("select");
    var optionsValues = ["1", "5", "10", "25", "50", "75", "100"];
    optionsValues.forEach(function (val) {
      var option = document.createElement("option");
      option.innerHTML = val;
      el.appendChild(option);
    });
    el.value = "5";

    el.onchange = () => {
      this.table.setPageSize(Number(el.value));
    };

    return el;
  }

  public update() {
    if (!!this.showColumnDropdown) this.showColumnDropdown.remove();
    this.showColumnDropdown = this.createShowColumnDropdown();
    if (!!this.showColumnDropdown)
      this.targetNode.appendChild(this.showColumnDropdown);
  }
}
