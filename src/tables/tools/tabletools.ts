import { ActionsHelper } from "../../utils";
import { localization } from "../../localizationManager";
import { Table } from "../table";
import { ColumnVisibility, QuestionLocation } from "../config";

export class TableTools {
  constructor(
    private targetNode: HTMLElement,
    private tabulator: any,
    private options: any
  ) {}
  private showColumnDropdown: HTMLElement;

  render() {
    this.showColumnDropdown = this.createShowColumnDropdown();
    const filterInput = this.createFilterInput();

    this.targetNode.innerHTML = "";

    if (this.options.downloadOptions.xlsx.isVisible) {
      this.targetNode.appendChild(this.createDownloadButton("xlsx", "Excel"));
    }
    if (this.options.downloadOptions.pdf.isVisible) {
      this.targetNode.appendChild(this.createDownloadButton("pdf", "PDF"));
    }
    this.targetNode.appendChild(this.createDownloadButton("csv", "CSV"));

    this.targetNode.appendChild(filterInput);
    if (!!this.showColumnDropdown)
      this.targetNode.appendChild(this.showColumnDropdown);

    this.tabulator.onColumnsVisibilityChanged.add(() => {
      this.update();
    });
  }

  protected createFilterInput(): HTMLElement {
    const input = document.createElement("input");
    input.classList.add("sa-tabulator__global-filter");
    input.placeholder = "Search...";
    input.onchange = (event: any) => {
      this.tabulator.applyFilter(event.target.value);
    };
    return input;
  }

  protected createShowColumnDropdown = (): HTMLElement => {
    const dropdown = document.createElement("select");
    dropdown.classList.add("sa-tabulator__show-column");

    var hiddenColumns = this.tabulator.columns.filter(
      (column: any) => column.visibility === ColumnVisibility.Invisible
    );
    if (hiddenColumns.length == 0) return null;
    var option = document.createElement("option");
    option.text = localization.getString("showColumn");
    option.disabled = true;
    option.selected = true;
    dropdown.appendChild(option);

    hiddenColumns.forEach((column: any) => {
      var option = document.createElement("option");
      var text = column.displayName;
      if (text.length > 20) {
        text = text.substring(0, 20) + "...";
      }
      option.text = text;
      option.title = column.displayName;
      option.value = column.name;
      dropdown.appendChild(option);
    });

    dropdown.onchange = (e: any) => {
      const val = e.target.value;
      e.stopPropagation();
      if (!val) return;
      this.tabulator.setColumnVisibility(val, ColumnVisibility.Visible);
    };

    return dropdown;
  };

  public update() {
    if (!!this.showColumnDropdown) this.showColumnDropdown.remove();
    this.showColumnDropdown = this.createShowColumnDropdown();
    if (!!this.showColumnDropdown)
      this.targetNode.appendChild(this.showColumnDropdown);
  }

  protected createDownloadButton(
    type: string,
    caption: string
  ): HTMLButtonElement {
    const btn = ActionsHelper.createBtn(caption);
    btn.onclick = (ev) => {
      this.tabulator.download(type);
    };
    return btn;
  }
}
