import { DocumentHelper } from "../../utils";
import { localization } from "../../localizationManager";
import { ColumnVisibility, QuestionLocation } from "../config";
import { Table } from "../table";

export class ColumnTools {
  constructor(
    private targetNode: HTMLElement,
    private table: Table,
    private columnName: string,
    private isTrustedAccess: boolean
  ) {}

  public render() {
    this.targetNode.appendChild(this.createDragBtn());
    this.targetNode.appendChild(this.createSortBtn());
    this.targetNode.appendChild(this.createHideBtn());
    if (this.isTrustedAccess)
      this.targetNode.appendChild(this.createColumnPrivateButton());
    this.targetNode.appendChild(this.createMoveToDetailsBtn());
    this.targetNode.appendChild(this.createFilterInput());
  }

  protected createDragBtn(): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.className = "sa-table__svg-button sa-table__drag-button";
    btn.appendChild(DocumentHelper.createSvgElement("drag"));
    btn.onclick = (e) => {
      e.stopPropagation();
    };
    return btn;
  }

  protected createSortBtn(): HTMLButtonElement {
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
      this.table.sortByColumn(this.columnName, direction);
    };
    btn.ondrag = (e) => {
      e.stopPropagation();
    };
    return btn;
  }

  protected createHideBtn(): HTMLButtonElement {
    var btn = DocumentHelper.createSvgButton("hide");
    btn.title = localization.getString("hideColumn");
    btn.onclick = () => {
      this.table.setColumnVisibility(
        this.columnName,
        ColumnVisibility.Invisible
      );
    };
    return btn;
  }

  protected createMoveToDetailsBtn(): HTMLButtonElement {
    const button = DocumentHelper.createSvgButton("movetodetails");
    button.title = localization.getString("moveToDetail");
    button.onclick = (e) => {
      e.stopPropagation();
      this.table.setColumnLocation(this.columnName, QuestionLocation.Row);
    };
    return button;
  }

  protected createFilterInput(): HTMLInputElement {
    var el = DocumentHelper.createInput("sa-table__filter", "Search...");
    el.onclick = (e) => e.stopPropagation();
    el.onchange = (e) => {
      this.table.applyColumnFilter(this.columnName, el.value);
    };
    return el;
  }

  protected createColumnPrivateButton(): HTMLElement {
    const button = document.createElement("button");
    const makePrivateSvg = DocumentHelper.createSvgElement("makeprivate");
    const makePublicSvg = DocumentHelper.createSvgElement("makepublic");
    var currentVisibility = this.table.getColumnVisibility(this.columnName);
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
      this.table.setColumnVisibility(this.columnName, currentVisibility);
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
  }
}
