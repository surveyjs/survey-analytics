import { Table } from "../table";
import { DocumentHelper } from "../../utils";
import { localization } from "../..";
import { ColumnVisibility, QuestionLocation } from "../config";
import { TableTools } from "./tabletools";

export class ColumnTools extends TableTools {
  constructor(
    protected targetNode: HTMLElement,
    protected table: Table,
    columnName: string,
    protected actions: string[] = []
  ) {
    super(targetNode, table, actions);
    this.options.columnName = columnName;
  }
  protected location = "column";
}

ColumnTools.registerTool("column", "drag", function (
  table: Table,
  options: any
) {
  const btn = DocumentHelper.createElement(
    "button",
    "sa-table__svg-button sa-table__drag-button"
  );
  btn.appendChild(DocumentHelper.createSvgElement("drag"));
  btn.onclick = (e) => {
    e.stopPropagation();
  };
  return btn;
});

ColumnTools.registerTool("column", "sort", function (
  table: Table,
  options: any
) {
  const descTitle = localization.getString("descOrder");
  const ascTitle = localization.getString("ascOrder");
  var btn = DocumentHelper.createSvgButton("sorting");
  btn.title = "";
  var direction = "asc";
  btn.onclick = (e) => {
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
});

ColumnTools.registerTool("column", "hide", function (
  table: Table,
  options: any
) {
  var btn = DocumentHelper.createSvgButton("hide");
  btn.title = localization.getString("hideColumn");
  btn.onclick = () => {
    table.setColumnVisibility(options.columnName, ColumnVisibility.Invisible);
  };
  return btn;
});

ColumnTools.registerTool("column", "movetodetails", function (
  table: Table,
  options: any
) {
  const button = DocumentHelper.createSvgButton("movetodetails");
  button.title = localization.getString("moveToDetail");
  button.onclick = (e) => {
    e.stopPropagation();
    table.setColumnLocation(options.columnName, QuestionLocation.Row);
  };
  return button;
});

ColumnTools.registerTool("column", "filter", function (
  table: Table,
  options: any
) {
  var el = DocumentHelper.createInput("sa-table__filter", "Search...");
  el.onclick = (e) => e.stopPropagation();
  el.onchange = (e) => {
    table.applyColumnFilter(options.columnName, el.value);
  };
  return el;
});

ColumnTools.registerTool("column", "makepublic", function (
  table: Table,
  options: any
) {
  const button = DocumentHelper.createElement("button", "");
  const makePrivateSvg = DocumentHelper.createSvgElement("makeprivate");
  const makePublicSvg = DocumentHelper.createSvgElement("makepublic");
  var currentVisibility = table.getColumnVisibility(options.columnName);
  updateState(currentVisibility);
  button.appendChild(makePrivateSvg);
  button.appendChild(makePublicSvg);
  button.onclick = (e) => {
    e.stopPropagation();
    if (currentVisibility === ColumnVisibility.PublicInvisible) {
      currentVisibility = ColumnVisibility.Visible;
    } else {
      currentVisibility = ColumnVisibility.PublicInvisible;
    }
    table.setColumnVisibility(options.columnName, currentVisibility);
    updateState(currentVisibility);
  };

  function updateState(visibility: ColumnVisibility) {
    const isPrivate = visibility === ColumnVisibility.PublicInvisible;
    if (isPrivate) {
      button.className = "sa-table__svg-button sa-table__svg-button--active";
      button.title = localization.getString("makePublicColumn");
      makePrivateSvg.style.display = "block";
      makePublicSvg.style.display = "none";
    } else {
      button.className = "sa-table__svg-button";
      button.title = localization.getString("makePrivateColumn");
      makePrivateSvg.style.display = "none";
      makePublicSvg.style.display = "block";
    }
  }
  return button;
});
