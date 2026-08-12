import { localization } from "../localizationManager";
import { VisualizationPanel } from "../visualizationPanel";
import { IDropdownItemOption } from "./dropdownBase";

const TOGGLE_ALL_VALUE = "__toggle_all__";

export class ElementVisibilityAction {
  constructor(private panel: VisualizationPanel) {}

  private get allVisible(): boolean {
    return this.panel.hiddenElements.length === 0;
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

    const questionItems = this.panel.getElements().map((element) => ({
      value: element.name,
      text: element.displayName || element.name,
      title: element.displayName || element.name,
      icon: "check-24x24"
    }));

    return [toggleItem, ...questionItems];
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
    return this.panel.hiddenElements.length === 0 ||
      this.panel.hiddenElements.filter(el => el.name === option.value).length === 0;
  }

  public handleSelect(value: string): boolean {
    if(value === TOGGLE_ALL_VALUE) {
      if(this.allVisible) {
        this.panel.hideAllElements();
      } else {
        this.panel.showAllElements();
      }
      return false;
    }

    if(!!value) {
      const element = this.panel.getElement(value);
      if(!!element && element.isVisible) {
        this.panel.hideElement(value);
      } else {
        this.panel.showElement(value);
      }
    }
    return false;
  }
}