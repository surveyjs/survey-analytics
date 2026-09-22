import { localization } from "../localizationManager";
import { IColumn } from "../tables/config";
import { Table } from "../tables/table";
import { IDropdownItemOption } from "./dropdownBase";

const TOGGLE_ALL_VALUE = "__toggle_all__";

export class ColumnVisibilityAction {
  constructor(private table: Table) {}

  private get allVisible(): boolean {
    return this.table.columns.every((column) => column.isVisible);
  }

  get toggleText() {
    return this.allVisible ? localization.getString("clearSelection") : localization.getString("selectAll");
  }

  public getOptions() {
    const toggleItem = {
      value: TOGGLE_ALL_VALUE,
      text: this.toggleText,
      title: this.toggleText,
      className: "sa-action-dropdown-item--toggle-all"
    };

    const columnItems = this.table.columns.map((column) => {
      const title = column.displayName || column.name;
      return {
        value: column.name,
        text: this.getOptionText(column),
        title,
        icon: "check-24x24"
      };
    });

    return [toggleItem, ...columnItems];
  }

  public updateOption(option: IDropdownItemOption): void {
    if(option.value === TOGGLE_ALL_VALUE) {
      option.title = this.toggleText;
      option.text = this.toggleText;
    }
  }

  public isSelected(option: IDropdownItemOption): boolean {
    if(option.value === TOGGLE_ALL_VALUE) {
      return false;
    }
    const column = this.table.getColumnByName(option.value);
    return !!column && column.isVisible;
  }

  public handleSelect(value: string): boolean {
    if(value === TOGGLE_ALL_VALUE) {
      if(this.allVisible) {
        this.table.hideAllColumns();
      } else {
        this.table.showAllColumns();
      }
      return false;
    }

    if(!!value) {
      const column = this.table.getColumnByName(value);
      if(!!column) {
        this.table.setColumnVisibility(value, !column.isVisible);
      }
    }
    return false;
  }

  private getOptionText(column: IColumn): string {
    var text = column.displayName || column.name;
    if(!!text && text.length > 20) {
      text = text.substring(0, 20) + "...";
    }
    return text;
  }
}
