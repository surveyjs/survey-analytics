import { localization } from "../../localizationManager";
import { Table } from "../table";
import { DocumentHelper } from "../../utils";
import { TableExtensions } from "./tableextensions";

TableExtensions.registerExtension({
  location: "footer",
  name: "showentries",
  visibleIndex: 30,
  render: function (table: Table): HTMLElement {
    if(table.options.paginationEnabled === false) {
      return DocumentHelper.createElement("div");
    }
    function getEntriesDropdown(table: Table): HTMLElement {
      /*
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
      */
      const optionsValues = table.paginationSizeSelector || ["1", "5", "10", "25", "50", "75", "100"];
      const el = DocumentHelper.createActionDropdown(
        optionsValues.map(val => { return { value: val, text: val }; }),
        (option: any) => {
          return option.value === table.getPageSize();
        },
        (e: any) => {
          if(e !== undefined && e !== null) {
            table.setPageSize(Number(e));
          }
          return true;
        },
        () => { return String(table.getPageSize()); },
      );
      el.className += " sa-table__entries-value";
      return el;
    }
    const selectorContainer = DocumentHelper.createElement("div", "sa-table__entries");
    const showSpan = DocumentHelper.createElement("span", "sa-table__entries-label sa-table__entries-label--right",
      {
        innerText: localization.getString("entriesOnPageLabel"),
      }
    );

    selectorContainer.appendChild(showSpan);
    selectorContainer.appendChild(getEntriesDropdown(table));
    return selectorContainer;
  },
});