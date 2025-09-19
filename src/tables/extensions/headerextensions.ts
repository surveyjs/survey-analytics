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
  destroy: function () {
    this.onDestroy();
  },
  render: function (table: Table): HTMLElement {
    // const dropdown = DocumentHelper.createElement(
    //   "select",
    //   "sa-table__show-column sa-table__header-extension"
    // );

    const dropdown = DocumentHelper.createActionDropdown(
      () => {
        const hiddenColumns = table.columns.filter((column: any) => !column.isVisible);
        const optionsValues = hiddenColumns.map(column => {
          var text = column.displayName || column.name;
          if (!!text && text.length > 20) {
            text = text.substring(0, 20) + "...";
          }
          var option = {
            text: text,
            title: column.displayName,
            value: column.name,
          };
          return option;
        });
        return optionsValues;
      },
      (option: any) => false,
      (e: any) => {
        if(!!e) {
          const val = e;
          // e.stopPropagation();
          if (!val) return;
          table.setColumnVisibility(val, true);
          return true;
        }
      },
      localization.getString("showColumn"),
    );
    dropdown.className += " sa-table__show-column sa-table__header-extension";

    function update() {
      var hiddenColumns = table.columns.filter(
        (column: any) => !column.isVisible
      );
      if (hiddenColumns.length == 0) {
        dropdown.style.display = "none";
        return;
      }
      dropdown.style.display = "inline-block";
      (dropdown as any).__updateSelect();
      // dropdown.innerHTML = "";
      // var option = DocumentHelper.createElement("option", "", {
      //   text: localization.getString("showColumn"),
      //   disabled: true,
      //   selected: true,
      // });
      // dropdown.appendChild(option);

      // hiddenColumns.forEach((column: any) => {
      //   var text = column.displayName || column.name;
      //   if (!!text && text.length > 20) {
      //     text = text.substring(0, 20) + "...";
      //   }
      //   var option = DocumentHelper.createElement("option", "", {
      //     text: text,
      //     title: column.displayName,
      //     value: column.name,
      //   });
      //   dropdown.appendChild(option);
      // });
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
  name: "removerows",
  visibleIndex: 10,
  render: function (table) {
    const btn = DocumentHelper.createButton(
      (e) => {
        table.getCreatedRows().forEach(function (row) {
          if (row.getIsSelected()) {
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
    if (table.options.disableLocaleSwitch || locales.length < 2) return null;
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