import { DocumentHelper } from ".";

export interface IDropdownItemOption {
  value: string;
  text: string;
  title?: string;
  icon?: string;

  [key: string]: any;
}

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

export class DropdownWidget {
  private options: IDropdownOptions;
  private optionsSource: Array<IDropdownItemOption> | (() => Array<IDropdownItemOption>);
  private placeholder: string;
  private className: string;
  private dropdownOpenedClass: string;
  private itemClassSelected: string;

  private dropdownElement!: HTMLDivElement;
  private titleElement!: HTMLSpanElement;
  private dropdownHeader!: HTMLDivElement;
  private headerContent!: HTMLDivElement;
  private dropdownList!: HTMLUListElement;
  private dropdownContainer!: HTMLDivElement;

  private selectedOption: IDropdownItemOption | null = null;
  private optionItems: IDropdownItemOption[] = [];
  private currentFocusIndex = -1;

  constructor(options: IDropdownOptions) {
    this.options = options;
    this.optionsSource = options.options || [];
    this.placeholder = options.placeholder ?? "Select...";
    this.className = options.className ?? "sa-dropdown";
    this.dropdownOpenedClass = this.className + "--opened";
    this.itemClassSelected = this.className + "-item--selected";
  }

  render(): HTMLDivElement {
    this.createElements();
    this.setupEventListeners();
    this.bindMethodsToElement();
    this.updateSelect();
    return this.dropdownElement;
  }

  private createElements(): void {
    this.dropdownElement = document.createElement("div");
    this.dropdownElement.className = this.className;

    this.titleElement = DocumentHelper.createElement("span", this.className + "__title") as HTMLSpanElement;
    this.dropdownHeader = document.createElement("div");
    this.dropdownHeader.className = this.className + "-header";
    this.dropdownHeader.setAttribute("tabindex", "0");
    this.dropdownHeader.setAttribute("role", "button");
    this.dropdownHeader.setAttribute("aria-haspopup", "listbox");
    this.dropdownHeader.setAttribute("aria-expanded", "false");

    this.headerContent = document.createElement("div");
    this.headerContent.className = this.className + "-header-content";

    this.updateHeader();
    this.dropdownHeader.appendChild(this.headerContent);

    this.createResetButton();
    this.createArrowElement();

    this.dropdownList = document.createElement("ul");
    this.dropdownList.className = this.className + "-list";
    this.dropdownList.setAttribute("role", "listbox");

    this.dropdownContainer = document.createElement("div");
    this.dropdownContainer.className = this.className + "-container";

    this.dropdownContainer.appendChild(this.dropdownHeader);
    this.dropdownContainer.appendChild(this.dropdownList);
    this.dropdownElement.appendChild(this.dropdownContainer);
  }

  private createResetButton(): void {
    if(!this.options.resetHandler) return;

    const resetElement = document.createElement("div");
    resetElement.className = this.className + "-action " + this.className + "-reset";
    resetElement.appendChild(DocumentHelper.createSvgElement("cancel_24x24"));
    this.dropdownHeader.appendChild(resetElement);
    resetElement.addEventListener("click", (e) => {
      this.options.resetHandler!();
      e.preventDefault();
      e.stopPropagation();
    });
  }

  private createArrowElement(): void {
    const arrowElement = document.createElement("div");
    arrowElement.className = this.className + "-action " + this.className + "-arrow";
    arrowElement.appendChild(DocumentHelper.createSvgElement("chevrondown-24x24"));
    this.dropdownHeader.appendChild(arrowElement);
  }

  private updateTitle(): void {
    const title = this.options.title;
    const titleText = !!title && (typeof title === "string" ? title : title());
    this.titleElement.innerText = titleText ?? "";
    if(!!titleText) {
      this.dropdownElement.insertBefore(this.titleElement, this.dropdownContainer);
    } else if(this.titleElement.parentElement === this.dropdownElement) {
      this.dropdownElement.removeChild(this.titleElement);
    }
  }

  private updateHeader(): void {
    this.headerContent.innerHTML = "";
    this.optionItems = Array.isArray(this.optionsSource) ? this.optionsSource : this.optionsSource();
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

  private updateOptions(): void {
    this.dropdownList.innerHTML = "";
    const opts = this.optionsSource || [];
    const items = Array.isArray(opts) ? opts : opts();

    items.forEach(option => {
      const dropdownItem = this.createOptionItem(option);
      this.dropdownList.appendChild(dropdownItem);
    });
  }

  private createOptionItem(option: IDropdownItemOption): HTMLLIElement {
    const dropdownItem = document.createElement("li");
    dropdownItem.className = this.className + "-item";
    if(option.title) {
      dropdownItem.title = option.title;
    }
    dropdownItem.dataset.value = option.value;
    dropdownItem.setAttribute("role", "option");
    dropdownItem.setAttribute("tabindex", "-1");
    dropdownItem.id = `${this.className}-item-${option.value}`;

    if(option.icon) {
      const iconContainer = document.createElement("div");
      iconContainer.className = this.className + "-icon";
      iconContainer.appendChild(DocumentHelper.createSvgElement(option.icon));
      dropdownItem.appendChild(iconContainer);
    }

    const textSpan = document.createElement("span");
    textSpan.textContent = option.text;
    dropdownItem.appendChild(textSpan);

    if(this.options.isSelected(option)) {
      dropdownItem.classList.add(this.itemClassSelected);
      dropdownItem.setAttribute("aria-selected", "true");
    } else {
      dropdownItem.setAttribute("aria-selected", "false");
    }

    dropdownItem.addEventListener("click", () => this.handleOptionSelect(option, dropdownItem));

    return dropdownItem;
  }

  private handleOptionSelect(option: IDropdownItemOption, dropdownItem: HTMLLIElement): void {
    this.selectedOption = option;
    this.options.handler(option.value, option);
    this.updateHeader();

    this.dropdownHeader.classList.remove(this.dropdownOpenedClass);
    this.dropdownList.classList.remove(this.dropdownOpenedClass);
    this.dropdownHeader.setAttribute("aria-expanded", "false");

    this.dropdownList.querySelectorAll("." + this.className + "-item").forEach(item => {
      item.classList.remove(this.itemClassSelected);
      item.setAttribute("aria-selected", "false");
    });
    dropdownItem.classList.add(this.itemClassSelected);
    dropdownItem.setAttribute("aria-selected", "true");
  }

  private handleClickOutside = (event: MouseEvent): void => {
    if(!this.dropdownElement.contains(event.target as Node)) {
      this.closeDropdown();
    }
  };

  private closeDropdown(): void {
    this.dropdownHeader.classList.remove(this.dropdownOpenedClass);
    this.dropdownList.classList.remove(this.dropdownOpenedClass);
    this.dropdownHeader.setAttribute("aria-expanded", "false");
    this.currentFocusIndex = -1;
  }

  private handleHeaderClick = (): void => {
    this.dropdownList.style.width = "auto";
    const parentContainerWidth = this.dropdownContainer.getBoundingClientRect().width;
    this.dropdownList.style.minWidth = `${parentContainerWidth}px`;

    const isOpened = this.dropdownHeader.classList.toggle(this.dropdownOpenedClass);
    this.dropdownList.classList.toggle(this.dropdownOpenedClass);
    this.dropdownHeader.setAttribute("aria-expanded", isOpened ? "true" : "false");

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

    if(!isOpened) {
      this.currentFocusIndex = -1;
    }
  };

  private focusItem(index: number): void {
    const items = this.dropdownList.querySelectorAll("." + this.className + "-item");
    if(items.length === 0) return;

    items.forEach(item => {
      item.classList.remove(this.className + "-item--focused");
      item.setAttribute("aria-selected", "false");
    });

    if(index < 0) index = items.length - 1;
    if(index >= items.length) index = 0;

    this.currentFocusIndex = index;
    const itemToFocus = items[this.currentFocusIndex] as HTMLElement;
    itemToFocus.classList.add(this.className + "-item--focused");
    itemToFocus.setAttribute("aria-selected", "true");
    itemToFocus.scrollIntoView({ block: "nearest" });
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if(!this.dropdownHeader.classList.contains(this.dropdownOpenedClass)) {
      if(e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        this.dropdownHeader.classList.add(this.dropdownOpenedClass);
        this.dropdownList.classList.add(this.dropdownOpenedClass);
        this.dropdownHeader.setAttribute("aria-expanded", "true");
        setTimeout(() => this.focusItem(0), 0);
      }
      return;
    }

    const items = this.dropdownList.querySelectorAll("." + this.className + "-item");
    if(items.length === 0) return;

    switch(e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.focusItem(this.currentFocusIndex + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.focusItem(this.currentFocusIndex - 1);
        break;
      case "Enter":
        e.preventDefault();
        if(this.currentFocusIndex >= 0 && this.currentFocusIndex < items.length) {
          const selectedItem = items[this.currentFocusIndex] as HTMLElement;
          const value = selectedItem.dataset.value;
          if(value) {
            const option = this.optionItems.find(opt => opt.value === value);
            if(option) {
              this.handleOptionSelect(option, selectedItem as HTMLLIElement);
            }
          }
        }
        break;
      case "Escape":
        e.preventDefault();
        this.closeDropdown();
        break;
    }
  };

  private setupEventListeners(): void {
    this.dropdownHeader.addEventListener("click", this.handleHeaderClick);
    this.dropdownHeader.addEventListener("keydown", this.handleKeyDown);
    this.dropdownList.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("click", this.handleClickOutside);
  }

  private bindMethodsToElement(): void {
    (this.dropdownElement as any)._handleClickOutside = this.handleClickOutside;
    (this.dropdownElement as any).setValue = (value: string | null | undefined) => this.setValue(value);
    (this.dropdownElement as any).getValue = () => this.getValue();
    (this.dropdownElement as any).__updateSelect = () => this.updateSelect();
  }

  setValue(value: string | null | undefined): void {
    const opts = this.optionsSource || [];
    const items = Array.isArray(opts) ? opts : opts();
    const optionToSelect = items.find(opt => opt.value === value);

    if(optionToSelect) {
      this.selectedOption = optionToSelect;
      this.updateHeader();

      this.dropdownList.querySelectorAll("." + this.className + "-item").forEach(item => {
        item.classList.remove(this.itemClassSelected);
        item.setAttribute("aria-selected", "false");
        if((item as HTMLElement)?.dataset?.value === value) {
          item.classList.add(this.itemClassSelected);
          item.setAttribute("aria-selected", "true");
        }
      });
    } else if(value === null || value === undefined) {
      this.selectedOption = null;
      this.updateHeader();

      this.dropdownList.querySelectorAll("." + this.className + "-item").forEach(item => {
        item.classList.remove(this.itemClassSelected);
        item.setAttribute("aria-selected", "false");
      });
    }
  }

  getValue(): string | null {
    return this.selectedOption ? this.selectedOption.value : null;
  }

  private updateSelect(): void {
    this.updateTitle();
    this.updateHeader();
    this.updateOptions();
  }
}
