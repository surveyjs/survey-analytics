import { Table } from "../table";
import { DocumentHelper } from "../../utils";
import { localization } from "../..";
import { ColumnVisibility, QuestionLocation } from "../config";

export class ColumnTools {
  constructor(
    private targetNode: HTMLElement,
    private table: Table,
    private columnName: string,
    private actions: string[] = [
      "drag",
      "sort",
      "hide",
      "movetodetails",
      "filter",
    ]
  ) {}
  public render() {
    if (!this.actions) return;
    this.actions.forEach((actionName) => {
      var actionCreator = ColumnTools.actions[actionName];
      if (!!actionCreator) {
        this.targetNode.appendChild(
          ColumnTools.actions[actionName](this.table, this.columnName)
        );
      }
    });
  }
  public static actions: {
    [actionName: string]: (table: Table, columnName: string) => HTMLElement;
  } = {};

  public static registerTool(
    actionName: string,
    actionCreator: (table: Table, columnName: string) => HTMLElement
  ) {
    this.actions[actionName] = actionCreator;
  }
}

ColumnTools.registerTool("drag", function (table: Table, columnName: string) {
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

ColumnTools.registerTool("sort", function (table: Table, columnName: string) {
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
    table.sortByColumn(columnName, direction);
  };
  btn.ondrag = (e) => {
    e.stopPropagation();
  };
  return btn;
});

ColumnTools.registerTool("hide", function (table, columnName) {
  var btn = DocumentHelper.createSvgButton("hide");
  btn.title = localization.getString("hideColumn");
  btn.onclick = () => {
    table.setColumnVisibility(columnName, ColumnVisibility.Invisible);
  };
  return btn;
});

ColumnTools.registerTool("movetodetails", function (table, columnName) {
  const button = DocumentHelper.createSvgButton("movetodetails");
  button.title = localization.getString("moveToDetail");
  button.onclick = (e) => {
    e.stopPropagation();
    table.setColumnLocation(columnName, QuestionLocation.Row);
  };
  return button;
});

ColumnTools.registerTool("filter", function (table, columnName) {
  var el = DocumentHelper.createInput("sa-table__filter", "Search...");
  el.onclick = (e) => e.stopPropagation();
  el.onchange = (e) => {
    table.applyColumnFilter(columnName, el.value);
  };
  return el;
});

ColumnTools.registerTool("makepublic", function (table, columnName) {
  const button = DocumentHelper.createElement("button", "");
  const makePrivateSvg = DocumentHelper.createSvgElement("makeprivate");
  const makePublicSvg = DocumentHelper.createSvgElement("makepublic");
  var currentVisibility = table.getColumnVisibility(columnName);
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
    table.setColumnVisibility(columnName, currentVisibility);
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
