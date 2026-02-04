import { DocumentHelper } from ".";
import { DropdownBase, IDropdownItemOption } from "./dropdownBase";

export interface IDropdownOptions {
  /** Array of options or function that returns options */
  options: Array<IDropdownItemOption> | (() => Array<IDropdownItemOption>);
  /** Function to check if option is selected */
  isSelected: (option: IDropdownItemOption) => boolean;
  /** Selection handler */
  handler: (value: string, option: IDropdownItemOption) => void;
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Title text above the dropdown */
  title?: string | (() => string);
  /** CSS class name for the dropdown */
  className?: string;
  resetHandler?: () => void;
}

export class DropdownWidget extends DropdownBase {
  private options: IDropdownOptions;
  private optionsSource: Array<IDropdownItemOption> | (() => Array<IDropdownItemOption>);
  private placeholder: string;
  private titleElement!: HTMLSpanElement;
  private headerContent!: HTMLDivElement;
  private selectedOption: IDropdownItemOption | null = null;

  constructor(options: IDropdownOptions) {
    super(options.className ?? "sa-dropdown");
    this.options = options;
    this.optionsSource = options.options || [];
    this.placeholder = options.placeholder ?? "Select...";
  }

  protected createHeader(): HTMLDivElement {
    const header = document.createElement("div");
    header.className = this.className + "-header";
    header.setAttribute("tabindex", "0");
    header.setAttribute("role", "button");
    header.setAttribute("aria-haspopup", "listbox");
    header.setAttribute("aria-expanded", "false");

    this.headerContent = document.createElement("div");
    this.headerContent.className = this.className + "-header-content";

    header.appendChild(this.headerContent);

    this.createResetButton(header);
    const arrowElement = this.createArrow(this.className + "-action " + this.className + "-arrow");
    header.appendChild(arrowElement);

    return header;
  }

  private createResetButton(header: HTMLDivElement): void {
    if(!this.options.resetHandler) return;

    const resetElement = document.createElement("div");
    resetElement.className = this.className + "-action " + this.className + "-reset";
    resetElement.appendChild(DocumentHelper.createSvgElement("cancel_24x24"));
    header.appendChild(resetElement);
    resetElement.addEventListener("click", (e) => {
      this.options.resetHandler!();
      e.preventDefault();
      e.stopPropagation();
    });
  }

  private updateTitle(): void {
    if(!this.titleElement) {
      this.titleElement = DocumentHelper.createElement("span", this.className + "__title") as HTMLSpanElement;
    }

    const title = this.options.title;
    const titleText = !!title && (typeof title === "string" ? title : title());
    this.titleElement.innerText = titleText ?? "";
    if(!!titleText) {
      this.dropdownElement.insertBefore(this.titleElement, this.dropdownContainer);
    } else if(this.titleElement.parentElement === this.dropdownElement) {
      this.dropdownElement.removeChild(this.titleElement);
    }
  }

  protected getOptions(): IDropdownItemOption[] {
    const opts = this.optionsSource || [];
    return Array.isArray(opts) ? opts : opts();
  }

  protected isOptionSelected(option: IDropdownItemOption): boolean {
    return this.options.isSelected(option);
  }

  protected onOptionSelect(option: IDropdownItemOption, dropdownItem: HTMLLIElement): void {
    this.selectedOption = option;
    this.options.handler(option.value, option);
    this.updateHeaderContent();

    this.hidePopup();

    this.dropdownList.querySelectorAll("." + this.className + "-item").forEach(item => {
      this.updateItemSelection(item as HTMLLIElement, false);
    });
    this.updateItemSelection(dropdownItem, true);
  }

  protected onBeforeHeaderToggle(): void {
    this.dropdownList.style.width = "auto";
  }

  protected onAfterHeaderToggle(isOpened: boolean): void {
    if(!isOpened) return;

    const documentWidth = document.body.clientWidth;
    const menuRect = this.dropdownList.getBoundingClientRect();
    if(menuRect.left + menuRect.width > documentWidth - 20) {
      this.dropdownList.style.width = `${documentWidth - menuRect.left - 40}px`;
    }

    const panelContainer = this.dropdownElement.closest(".sa-visualizer");
    if(panelContainer) {
      const panelContainerRect = panelContainer.getBoundingClientRect();
      if((menuRect.y + menuRect.height) > (panelContainerRect.y + panelContainerRect.height)) {
        this.dropdownList.style.height = `${panelContainerRect.height - menuRect.y + panelContainerRect.y}px`;
      }
    }
  }

  protected onDropdownOpened(): void {
    setTimeout(() => this.focusItem(0, true), 0);
  }

  protected shouldUpdateAriaSelectedOnFocus(): boolean {
    return true;
  }

  protected updateHeaderContent(): void {
    this.headerContent.innerHTML = "";
    this.optionItems = this.getOptions();
    this.selectedOption = this.optionItems.find(option => this.options.isSelected(option)) ?? null;

    if(this.selectedOption) {
      this.dropdownHeader.setAttribute("aria-label", `Selected: ${this.selectedOption.text}`);
    } else {
      this.dropdownHeader.setAttribute("aria-label", this.placeholder);
    }

    if(this.selectedOption?.icon) {
      const headerIcon = document.createElement("div");
      headerIcon.className = this.className + "-header-icon";
      headerIcon.innerHTML = this.selectedOption.icon;
      this.headerContent.appendChild(headerIcon);
    }

    const headerText = document.createElement("span");
    headerText.className = this.selectedOption ? this.className + "-header-text" : this.className + "-placeholder";
    headerText.textContent = this.selectedOption ? this.selectedOption.text : this.placeholder;
    this.headerContent.appendChild(headerText);
  }

  protected updateSelect(): void {
    this.updateTitle();
    this.updateHeaderContent();
    this.updateOptions();
  }

  protected attachMethodsToElement(): void {
    (this.dropdownElement as any)._handleClickOutside = this.handleClickOutsideRef;
    (this.dropdownElement as any).setValue = (value: string | null | undefined) => this.setValue(value);
    (this.dropdownElement as any).getValue = () => this.getValue();
    (this.dropdownElement as any).__updateSelect = () => this.updateSelect();
  }

  setValue(value: string | null | undefined): void {
    const items = this.getOptions();
    const optionToSelect = items.find(opt => opt.value === value);

    if(optionToSelect) {
      this.selectedOption = optionToSelect;
      this.updateHeaderContent();

      this.dropdownList.querySelectorAll("." + this.className + "-item").forEach(item => {
        const itemValue = (item as HTMLElement)?.dataset?.value;
        this.updateItemSelection(item as HTMLLIElement, itemValue === value);
      });
    } else if(value === null || value === undefined) {
      this.selectedOption = null;
      this.updateHeaderContent();

      this.dropdownList.querySelectorAll("." + this.className + "-item").forEach(item => {
        this.updateItemSelection(item as HTMLLIElement, false);
      });
    }
  }

  getValue(): string | null {
    return this.selectedOption ? this.selectedOption.value : null;
  }
}
