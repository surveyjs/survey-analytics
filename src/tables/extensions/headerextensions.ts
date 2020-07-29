import { localization } from "../../localizationManager";
import { Table } from "../table";
import { ColumnVisibility } from "../config";
import { DocumentHelper } from "../../utils";
import { TableExtensions } from "./tableextensions";

export class HeaderExtensions extends TableExtensions {
  constructor(protected targetNode: HTMLElement, protected table: Table) {
    super(targetNode, table);
  }
  protected location = "header";
}

TableExtensions.registerExtension({
  location: "header",
  name: "filter",
  visibleIndex: 0,
  render: function (table: Table): HTMLElement {
    const input = DocumentHelper.createInput(
      "sa-table__global-filter sa-table__header-extension",
      "Search..."
    );
    input.onchange = (event: any) => {
      table.applyFilter(event.target.value);
    };
    return input;
  },
});

TableExtensions.registerExtension({
  location: "header",
  name: "showcolumn",
  visibleIndex: 2,
  render: function (table: Table): HTMLElement {
    const dropdown = DocumentHelper.createElement(
      "select",
      "sa-table__show-column sa-table__header-extension"
    );

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
      var option = DocumentHelper.createElement("option", "", {
        text: localization.getString("showColumn"),
        disabled: true,
        selected: true,
      });
      dropdown.appendChild(option);

      hiddenColumns.forEach((column: any) => {
        var text = column.displayName;
        if (text.length > 20) {
          text = text.substring(0, 20) + "...";
        }
        var option = DocumentHelper.createElement("option", "", {
          text: text,
          title: column.displayName,
          value: column.name,
        });
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
  },
});

TableExtensions.registerExtension({
  location: "header",
  name: "showentries",
  visibleIndex: 3,
  render: function (table: Table): HTMLElement {
    function getEntriesDropdown(table: Table): HTMLElement {
      const el = <HTMLSelectElement>DocumentHelper.createElement("select");
      var optionsValues = ["1", "5", "10", "25", "50", "75", "100"];
      optionsValues.forEach(function (val) {
        var option = DocumentHelper.createElement("option", "", {
          value: val,
          text: val,
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
  },
});

TableExtensions.registerExtension({
  location: "header",
  name: "removerows",
  visibleIndex: -1,
  render: function (table) {
    var btn = DocumentHelper.createElement(
      "button",
      "sa-table__btn sa-table__btn--green sa-table__header-extension ",
      { innerHTML: "Remove rows" }
    );
    btn.onclick = function () {
      table.getCreatedRows().forEach(function (row) {
        if (row.getIsSelected()) {
          row.remove();
        }
      });
    };
    return btn;
  },
});

TableExtensions.registerExtension({
  location: "header",
  name: "changelocale",
  visibleIndex: 1,
  render: function (table) {
    const el = <HTMLSelectElement>(
      DocumentHelper.createElement("select", "sa-table__header-extension", {})
    );

    var optionsValues = [localization.getString("changeLocale")].concat(
      table.getLocales()
    );
    optionsValues.forEach(function (val) {
      var option = DocumentHelper.createElement("option", "", {
        value: val,
        text: val,
      });
      el.appendChild(option);
    });
    el.onchange = () => {
      table.setLocale(el.value);
    };
    return el;
  },
});
