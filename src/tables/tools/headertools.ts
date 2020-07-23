import { localization } from "../../localizationManager";
import { Table } from "../table";
import { ColumnVisibility } from "../config";
import { DocumentHelper } from "../../utils";
import { TableTools } from "./tabletools";

export class HeaderTools extends TableTools {
  constructor(
    protected targetNode: HTMLElement,
    protected table: Table,
    protected actions: string[] = []
  ) {
    super(targetNode, table, actions);
  }
  protected location = "header";
}

TableTools.registerTool("header", "filter", function (
  table: Table
): HTMLElement {
  const input = DocumentHelper.createInput(
    "sa-table__global-filter",
    "Search..."
  );
  input.onchange = (event: any) => {
    table.applyFilter(event.target.value);
  };
  return input;
});

TableTools.registerTool("header", "showcolumn", function (
  table: Table
): HTMLElement {
  const dropdown = document.createElement("select");
  dropdown.classList.add("sa-table__show-column");

  function update() {
    var hiddenColumns = table.columns.filter(
      (column: any) => column.visibility === ColumnVisibility.Invisible
    );
    if (hiddenColumns.length == 0) {
      dropdown.style.display = "none";
      return;
    }
    dropdown.style.display = "initial";
    dropdown.innerHTML = "";
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
  }

  dropdown.onchange = (e: any) => {
    const val = e.target.value;
    e.stopPropagation();
    if (!val) return;
    table.setColumnVisibility(val, ColumnVisibility.Visible);
  };

  update();

  table.onColumnsVisibilityChanged.add(function () {
    update();
  });

  return dropdown;
});

TableTools.registerTool("header", "showentries", function (
  table: Table
): HTMLElement {
  function getEntriesDropdown(table: Table): HTMLElement {
    const el = <HTMLSelectElement>DocumentHelper.createElement("select", "");
    var optionsValues = ["1", "5", "10", "25", "50", "75", "100"];
    optionsValues.forEach(function (val) {
      var option = DocumentHelper.createElement("option", "", {
        innerHTML: val,
      });
      el.appendChild(option);
    });
    el.value = "5";

    el.onchange = () => {
      table.setPageSize(Number(el.value));
    };

    return el;
  }
  const selectorContainer = DocumentHelper.createElement(
    "div",
    "sa-table__entries"
  );
  const showSpan = DocumentHelper.createElement(
    "span",
    "sa-table__entries-label sa-table__entries-label--right",
    {
      innerHTML: "Show",
    }
  );
  const entriesSpan = DocumentHelper.createElement(
    "span",
    "sa-table__entries-label sa-table__entries-label--left",
    {
      innerHTML: "entries",
    }
  );

  selectorContainer.appendChild(showSpan);
  selectorContainer.appendChild(getEntriesDropdown(table));
  selectorContainer.appendChild(entriesSpan);
  return selectorContainer;
});
