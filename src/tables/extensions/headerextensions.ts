import { localization } from "../../localizationManager";
import { Table } from "../table";
import { DocumentHelper } from "../../utils";
import { TableExtensions } from "./tableextensions";

TableExtensions.registerExtension({
  location: "header",
  name: "filter",
  visibleIndex: 0,
  render: function (table: Table): HTMLElement {
    const input = DocumentHelper.createInput(
      "sa-table__global-filter sa-table__header-extension",
      localization.getString("filterPlaceholder")
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
  destroy: function () {
    this.onDestroy();
  },
  render: function (table: Table): HTMLElement {
    const dropdown = DocumentHelper.createElement(
      "select",
      "sa-table__show-column sa-table__header-extension"
    );

    function update() {
      var hiddenColumns = table.columns.filter(
        (column: any) => !column.isVisible
      );
      if (hiddenColumns.length == 0) {
        dropdown.style.display = "none";
        return;
      }
      dropdown.style.display = "inline-block";
      dropdown.innerHTML = "";
      var option = DocumentHelper.createElement("option", "", {
        text: localization.getString("showColumn"),
        disabled: true,
        selected: true,
      });
      dropdown.appendChild(option);

      hiddenColumns.forEach((column: any) => {
        var text = column.displayName || column.name;
        if (!!text && text.length > 20) {
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
      table.setColumnVisibility(val, true);
    };

    update();

    var onVisibilityChangedCallback = () => {
      update();
    };

    table.onColumnsVisibilityChanged.add(onVisibilityChangedCallback);

    this.onDestroy = () => {
      table.onColumnsVisibilityChanged.remove(onVisibilityChangedCallback);
    };
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
      var optionsValues = table.paginationSizeSelector || ["1", "5", "10", "25", "50", "75", "100"];
      optionsValues.forEach(function (val) {
        var option = DocumentHelper.createElement("option", "", {
          value: val,
          text: val,
        });
        el.appendChild(option);
      });
      el.value = String(table.getPageSize());

      el.onchange = () => {
        table.setPageSize(Number(el.value));
      };

      return el;
    }
    const selectorContainer = DocumentHelper.createElement(
      "div",
      "sa-table__entries"
    );
    const spaceSpan = DocumentHelper.createElement("span", "sa-table__header-space");
    const showSpan = DocumentHelper.createElement(
      "span",
      "sa-table__entries-label sa-table__entries-label--right",
      {
        innerText: localization.getString("showLabel"),
      }
    );
    const entriesSpan = DocumentHelper.createElement(
      "span",
      "sa-table__entries-label sa-table__entries-label--left",
      {
        innerText: localization.getString("entriesLabel"),
      }
    );

    selectorContainer.appendChild(spaceSpan);
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
      { innerText: localization.getString("removeRows") }
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
    var locales = table.getLocales();
    if (table.options.disableLocaleSwitch || locales.length < 2) return null;
    const el = <HTMLSelectElement>(
      DocumentHelper.createElement("select", "sa-table__header-extension", {})
    );
    var optionsValues = [localization.getString("changeLocale")].concat(
      locales
    );
    optionsValues.forEach(function (val) {
      var option = DocumentHelper.createElement("option", "", {
        value: val,
        text: localization.localeNames[val] || localization.getString(val) || val,
      });
      el.appendChild(option);
    });
    el.onchange = () => {
      table.locale = el.value;
    };
    return el;
  },
});

export var HeaderExtensions;