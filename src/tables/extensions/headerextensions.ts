import { localization } from "../../localizationManager";
import { Table } from "../table";
import { DocumentHelper } from "../../utils/documentHelper";
import { TableExtensions } from "./tableextensions";
import { createActionDropdown } from "../../utils/dropdownActionWidget";

TableExtensions.registerExtension({
  location: "header",
  name: "filter",
  visibleIndex: 1,
  render: function (table: Table): HTMLElement {
    const el = DocumentHelper.createTextEditor({
      onchange: (val) => { table.applyFilter(val); }
    });
    return el;
  },
});

TableExtensions.registerExtension({
  location: "header",
  name: "showcolumn",
  visibleIndex: 20,
  render: function (table: Table): HTMLElement {
    const allColumns = table.columns.map((column) => {
      var text = column.displayName || column.name;
      if(!!text && text.length > 20) {
        text = text.substring(0, 20) + "...";
      }
      return {
        value: column.name,
        text: text,
        title: column.displayName || column.name,
        icon: "check-24x24"
      };
    });
    const dropdown = createActionDropdown({
      options: allColumns,
      isSelected: (option: any) => {
        const hiddenColumns = table.columns.filter((column: any) => !column.isVisible);
        return hiddenColumns.length === 0 || hiddenColumns.filter(el => el.name === option.value).length === 0;
      },
      handler: (e: any) => {
        if(!!e) {
          if(!e) return;
          const column = table.columns.filter((column: any) => column.name === e)[0];
          table.setColumnVisibility(e, !column.isVisible);
          return false;
        }
      },
      title: localization.getString("columns")
    });
    dropdown.className += " sa-table__show-column sa-table__header-extension";
    return dropdown;
  },
});

TableExtensions.registerExtension({
  location: "header",
  name: "removerows",
  visibleIndex: -1,
  render: function (table) {
    const btn = DocumentHelper.createButton(
      (e) => {
        table.getCreatedRows().forEach(function (row) {
          if(row.getIsSelected()) {
            row.remove();
          }
        });
      }, localization.getString("removeRows"), "sa-button");
    btn.className += " sa-table__header-extension sa-button-brand-tertiary";
    return btn;
  },
});

TableExtensions.registerExtension({
  location: "header",
  name: "changelocale",
  visibleIndex: 40,
  render: function (table) {
    var locales = table.getLocales();
    if(table.options.disableLocaleSwitch || locales.length < 2) return null;

    const optionsValues = locales.map(val => { return { value: val, text: localization.getLocaleName(val) || val }; });
    const el = createActionDropdown({
      options: optionsValues,
      isSelected: (option: any) => false,
      handler: (e: any) => {
        if(!!e) {
          table.locale = e;
        }
        return true;
      },
      title: () => localization.getString("changeLocale"),
    });
    el.className += " sa-table__header-extension";
    return el;
  },
});

export var HeaderExtensions;