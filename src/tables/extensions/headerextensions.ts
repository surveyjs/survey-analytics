import { localization } from "../../localizationManager";
import { Table } from "../table";
import { DocumentHelper } from "../../utils/documentHelper";
import { TableExtensions } from "./tableextensions";
import { createActionDropdown } from "../../utils/dropdownActionWidget";
import { ColumnVisibilityAction } from "../../utils/columnVisibilityAction";
import { IDropdownItemOption } from "../../utils/dropdownBase";

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
    const visibilityAction = new ColumnVisibilityAction(table);
    const dropdown = createActionDropdown({
      options: () => visibilityAction.getOptions(),
      isSelected: (option: IDropdownItemOption) => visibilityAction.isSelected(option),
      updateOption: (option: IDropdownItemOption) => visibilityAction.updateOption(option),
      handler: (value: string) => visibilityAction.handleSelect(value),
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