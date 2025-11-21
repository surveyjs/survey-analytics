import { localization } from "../../localizationManager";
import { Table } from "../table";
import { DocumentHelper } from "../../utils";
import { TableExtensions } from "./tableextensions";

TableExtensions.registerExtension({
  location: "header",
  name: "filter",
  visibleIndex: 1,
  render: function (table: Table): HTMLElement {
    // const input = DocumentHelper.createInput(
    //   "sa-table__global-filter sa-table__header-extension",
    //   localization.getString("filterPlaceholder")
    // );
    // input.onchange = (event: any) => {
    //   table.applyFilter(event.target.value);
    // };
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
    // const dropdown = DocumentHelper.createElement(
    //   "select",
    //   "sa-table__show-column sa-table__header-extension"
    // );

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
    const dropdown = DocumentHelper.createActionDropdown(
      allColumns,
      (option: any) => {
        const hiddenColumns = table.columns.filter((column: any) => !column.isVisible);
        return hiddenColumns.length === 0 || hiddenColumns.filter(el => el.name === option.value).length === 0;
      },
      (e: any) => {
        if(!!e) {
          if(!e) return;
          const column = table.columns.filter((column: any) => column.name === e)[0];
          table.setColumnVisibility(e, !column.isVisible);
          return false;
        }
      },
      localization.getString("columns")
    );
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
    // var btn = DocumentHelper.createElement(
    //   "button",
    //   "sa-table__btn sa-table__header-extension ",
    //   { innerText: localization.getString("removeRows") }
    // );
    // btn.onclick = function () {
    //   table.getCreatedRows().forEach(function (row) {
    //     if (row.getIsSelected()) {
    //       row.remove();
    //     }
    //   });
    // };
    // return btn;
  },
});

TableExtensions.registerExtension({
  location: "header",
  name: "changelocale",
  visibleIndex: 40,
  render: function (table) {
    var locales = table.getLocales();
    if(table.options.disableLocaleSwitch || locales.length < 2) return null;
    /*
    const el = <HTMLSelectElement>(
      DocumentHelper.createElement("select", "sa-table__header-extension", {})
    );
    var optionsValues = [localization.getString("changeLocale")].concat(locales);
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
    */

    const optionsValues = locales.map(val => { return { value: val, text: localization.localeNames[val] || localization.getString(val) || val }; });
    const el = DocumentHelper.createActionDropdown(
      optionsValues,
      (option: any) => false,
      (e: any) => {
        if(!!e) {
          table.locale = e;
        }
        return true;
      },
      () => localization.getString("changeLocale"),
    );
    el.className += " sa-table__header-extension";
    return el;
  },
});

export var HeaderExtensions;