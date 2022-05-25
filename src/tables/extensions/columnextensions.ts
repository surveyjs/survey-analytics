import { Table } from "../table";
import { DocumentHelper } from "../../utils";
import { localization } from "../../localizationManager";
import { TableExtensions } from "./tableextensions";
import { QuestionLocation, IColumn } from "../config";

TableExtensions.registerExtension({
  location: "column",
  name: "drag",
  visibleIndex: 0,
  render: function (table: Table, options: any) {
    const btn = DocumentHelper.createElement(
      "button",
      "sa-table__svg-button sa-table__drag-button"
    );
    btn.appendChild(DocumentHelper.createSvgElement("drag"));
    btn.onmousedown = (e) => {
      table.enableColumnReorder();
    };
    return btn;
  },
});

TableExtensions.registerExtension({
  location: "column",
  name: "sort",
  visibleIndex: 1,
  render: function (table: Table, options: any) {
    const descTitle = localization.getString("descOrder");
    const ascTitle = localization.getString("ascOrder");
    var btn = DocumentHelper.createSvgButton("sorting");
    btn.title = "";
    var direction = "asc";
    btn.onclick = () => {
      if (direction == "asc") {
        btn.title = descTitle;
        direction = "desc";
      } else {
        btn.title = ascTitle;
        direction = "asc";
      }
      table.sortByColumn(options.columnName, direction);
    };
    btn.ondrag = (e) => {
      e.stopPropagation();
    };
    return btn;
  },
});

TableExtensions.registerExtension({
  location: "column",
  name: "hide",
  visibleIndex: 2,
  render: function (table: Table, options: any) {
    var btn = DocumentHelper.createSvgButton("hide");
    btn.title = localization.getString("hideColumn");
    btn.onclick = () => {
      table.setColumnVisibility(options.columnName, false);
    };
    return btn;
  },
});

TableExtensions.registerExtension({
  location: "column",
  name: "movetodetails",
  visibleIndex: 3,
  render: function (table: Table, options: any) {
    const button = DocumentHelper.createSvgButton("movetodetails");
    button.title = localization.getString("moveToDetail");
    button.onclick = (e) => {
      e.stopPropagation();
      table.setColumnLocation(options.columnName, QuestionLocation.Row);
    };
    return button;
  },
});

TableExtensions.registerExtension({
  location: "column",
  name: "filter",
  visibleIndex: 4,
  render: function (table: Table, options: any) {
    var el = DocumentHelper.createInput(
      "sa-table__filter",
      localization.getString("filterPlaceholder")
    );
    el.onclick = (e) => e.stopPropagation();
    el.onchange = (e) => {
      table.applyColumnFilter(options.columnName, el.value);
    };
    return el;
  },
});

TableExtensions.registerExtension({
  location: "column",
  name: "makepublic",
  visibleIndex: -1,
  render: function (table: Table, options: any) {
    const button = DocumentHelper.createElement("button");
    const makePrivateSvg = DocumentHelper.createSvgElement("makeprivate");
    const makePublicSvg = DocumentHelper.createSvgElement("makepublic");
    const column = table.getColumnByName(options.columnName);

    updateState(column);
    button.appendChild(makePrivateSvg);
    button.appendChild(makePublicSvg);
    button.onclick = (e) => {
      e.stopPropagation();
      column.isPublic = !column.isPublic;
      updateState(column);
      table.onPermissionsChangedCallback &&
        table.onPermissionsChangedCallback(table);
    };

    function updateState(column: IColumn) {
      if (column.isPublic) {
        button.className = "sa-table__svg-button";
        button.title = localization.getString("makePrivateColumn");
        makePrivateSvg.style.display = "none";
        makePublicSvg.style.display = "block";
      } else {
        button.className = "sa-table__svg-button sa-table__svg-button--active";
        button.title = localization.getString("makePublicColumn");
        makePrivateSvg.style.display = "block";
        makePublicSvg.style.display = "none";
      }
    }
    return button;
  },
});
