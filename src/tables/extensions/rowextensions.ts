import { Table } from "../table";
import { localization } from "../../localizationManager";
import { DocumentHelper } from "../../utils";
import { TableExtensions } from "./tableextensions";

TableExtensions.registerExtension({
  location: "row",
  name: "details",
  visibleIndex: 0,
  render: (_table: Table, options: any) => {
    const btn = DocumentHelper.createSvgButton("more-24x24", localization.getString("showMinorColumns"));
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
    const itemClassSelected = "sa-checkbox--checked";
    const row = opt.row;
    const iconContainer = DocumentHelper.createSvgButton("check-24x24");
    iconContainer.onclick = () => {
      row.toggleSelect();
      if (row.getIsSelected()) {
        iconContainer.classList.add(itemClassSelected);
      } else {
        iconContainer.classList.remove(itemClassSelected);
      }
    };
    iconContainer.classList = "sa-checkbox sa-table__row-extension";

    if (row.getIsSelected()) {
      iconContainer.classList.add(itemClassSelected);
    }

    // var checkbox = <HTMLInputElement>DocumentHelper.createElement(
    //   "input",
    //   "sa-table__row-extension",
    //   {
    //     type: "checkbox",
    //   }
    // );
    // checkbox.checked = row.getIsSelected();
    // checkbox.onchange = function () {
    //   row.toggleSelect();
    // };
    return iconContainer;
  },
});
