import { Table } from "../table";
import { localization } from "../../localizationManager";
import { DocumentHelper } from "../../utils";
import { TableExtensions } from "./tableextensions";

TableExtensions.registerExtension({
  location: "row",
  name: "details",
  visibleIndex: 0,
  render: (_table: Table, options: any) => {
    const btn = DocumentHelper.createSvgButton("detail");
    btn.title = localization.getString("showMinorColumns");
    btn.className += " sa-table__row-extension";
    btn.onclick = () => {
      options.row.toggleDetails();
    };
    return btn;
  },
});

TableExtensions.registerExtension({
  location: "row",
  name: "select",
  visibleIndex: -1,
  render: function (_table, opt) {
    var row = opt.row;
    var checkbox = <HTMLInputElement>DocumentHelper.createElement(
      "input",
      "sa-table__row-extension",
      {
        type: "checkbox",
      }
    );
    checkbox.checked = row.getIsSelected();
    checkbox.onchange = function () {
      row.toggleSelect();
    };
    return checkbox;
  },
});
