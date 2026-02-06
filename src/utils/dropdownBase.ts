import { DocumentHelper } from ".";

export interface IDropdownItemOption {
  value: string;
  text: string;
  title?: string;
  icon?: string;

  [key: string]: any;
}

export abstract class DropdownBase {
  protected className: string;
  protected dropdownOpenedClass: string;
  protected itemClassSelected: string;

  protected dropdownElement!: HTMLDivElement;
  protected dropdownHeader!: HTMLDivElement;
  protected dropdownList!: HTMLUListElement;
  protected dropdownContainer!: HTMLDivElement;

  protected optionItems: IDropdownItemOption[] = [];
  protected currentFocusIndex = -1;
  protected handleClickOutsideRef!: (event: MouseEvent) => void;

  constructor(defaultClassName: string) {
    this.className = defaultClassName;
    this.dropdownOpenedClass = this.className + "--opened";
    this.itemClassSelected = this.className + "-item--selected";
  }

  public render(): HTMLDivElement {
    this.dropdownElement = this.createDropdownElement();
    this.dropdownHeader = this.createHeader();
    this.dropdownList = this.createList();
    this.dropdownContainer = this.createContainer();

    this.dropdownContainer.appendChild(this.dropdownHeader);
    this.dropdownContainer.appendChild(this.dropdownList);
    this.dropdownElement.appendChild(this.dropdownContainer);

    this.bindEvents();
    this.attachMethodsToElement();

    this.updateSelect();

    return this.dropdownElement;
  }

  protected createDropdownElement(): HTMLDivElement {
    const element = document.createElement("div");
    element.className = this.className;
    return element;
  }

  protected createList(): HTMLUListElement {
    const list = document.createElement("ul");
    list.className = this.className + "-list";
    list.setAttribute("role", "listbox");
    return list;
  }

  protected createContainer(): HTMLDivElement {
    const container = document.createElement("div");
    container.className = this.className + "-container";
    return container;
  }

  protected createArrow(arrowClassName?: string): HTMLDivElement {
    const arrowElement = document.createElement("div");
    arrowElement.className = arrowClassName ?? this.className + "-arrow";
    arrowElement.appendChild(DocumentHelper.createSvgElement("chevrondown-24x24"));
    return arrowElement;
  }

  protected hidePopup(): void {
    this.dropdownHeader.classList.remove(this.dropdownOpenedClass);
    this.dropdownList.classList.remove(this.dropdownOpenedClass);
    this.dropdownHeader.setAttribute("aria-expanded", "false");
    this.currentFocusIndex = -1;
  }

  protected focusItem(index: number, updateAriaSelected = false): void {
    const items = this.dropdownList.querySelectorAll("." + this.className + "-item");
    if(items.length === 0) return;

    items.forEach(item => {
      item.classList.remove(this.className + "-item--focused");
      if(updateAriaSelected) {
        item.setAttribute("aria-selected", "false");
      }
    });

    if(index < 0) index = items.length - 1;
    if(index >= items.length) index = 0;

    this.currentFocusIndex = index;
    const itemToFocus = items[this.currentFocusIndex] as HTMLElement;
    itemToFocus.classList.add(this.className + "-item--focused");
    if(updateAriaSelected) {
      itemToFocus.setAttribute("aria-selected", "true");
    }
    itemToFocus.scrollIntoView({ block: "nearest" });
  }

  protected updateOptions(): void {
    this.dropdownList.innerHTML = "";
    this.optionItems = this.getOptions();

    this.optionItems.forEach((option) => {
      const dropdownItem = this.createOptionItem(option);
      this.dropdownList.appendChild(dropdownItem);
    });
  }

  protected createOptionItem(option: IDropdownItemOption): HTMLLIElement {
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

    if(this.isOptionSelected(option)) {
      dropdownItem.classList.add(this.itemClassSelected);
      dropdownItem.setAttribute("aria-selected", "true");
    } else {
      dropdownItem.setAttribute("aria-selected", "false");
    }

    dropdownItem.addEventListener("click", (e) => this.handleOptionClick(e, option, dropdownItem));

    return dropdownItem;
  }

  protected handleOptionClick(e: MouseEvent, option: IDropdownItemOption, dropdownItem: HTMLLIElement): void {
    this.onOptionSelect(option, dropdownItem);
    e.preventDefault();
    e.stopPropagation();
  }

  protected handleKeyDown(e: KeyboardEvent): void {
    if(!this.dropdownHeader.classList.contains(this.dropdownOpenedClass)) {
      if(e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        this.dropdownHeader.classList.add(this.dropdownOpenedClass);
        this.dropdownList.classList.add(this.dropdownOpenedClass);
        this.dropdownHeader.setAttribute("aria-expanded", "true");
        this.onDropdownOpened();
      }
      return;
    }

    const items = this.dropdownList.querySelectorAll("." + this.className + "-item");
    if(items.length === 0) return;

    switch(e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.focusItem(this.currentFocusIndex + 1, this.shouldUpdateAriaSelectedOnFocus());
        break;
      case "ArrowUp":
        e.preventDefault();
        this.focusItem(this.currentFocusIndex - 1, this.shouldUpdateAriaSelectedOnFocus());
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if(this.currentFocusIndex >= 0 && this.currentFocusIndex < items.length) {
          const selectedItem = items[this.currentFocusIndex] as HTMLElement;
          const value = selectedItem.dataset.value;
          if(value) {
            const option = this.optionItems.find((opt) => opt.value === value);
            if(option) {
              this.onOptionSelect(option, selectedItem as HTMLLIElement);
            }
          }
        }
        break;
      case "Escape":
        e.preventDefault();
        this.hidePopup();
        break;
    }
  }

  protected handleClickOutside(event: MouseEvent): void {
    if(!this.dropdownElement.contains(event.target as Node)) {
      this.hidePopup();
    }
  }

  protected bindEvents(): void {
    this.handleClickOutsideRef = (e: MouseEvent) => this.handleClickOutside(e);

    this.dropdownHeader.addEventListener("click", (e) => this.handleHeaderClick(e));
    this.dropdownHeader.addEventListener("keydown", (e) => this.handleKeyDown(e));
    this.dropdownList.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.addEventListener("click", this.handleClickOutsideRef);
  }

  protected handleHeaderClick(e: MouseEvent): void {
    this.onBeforeHeaderToggle();

    const parentContainerWidth = this.dropdownContainer.getBoundingClientRect().width;
    this.dropdownList.style.minWidth = `${parentContainerWidth}px`;

    const isOpened = this.dropdownHeader.classList.toggle(this.dropdownOpenedClass);
    this.dropdownList.classList.toggle(this.dropdownOpenedClass);
    this.dropdownHeader.setAttribute("aria-expanded", isOpened ? "true" : "false");

    this.onAfterHeaderToggle(isOpened);

    if(!isOpened) {
      this.currentFocusIndex = -1;
    }

    e.preventDefault();
    e.stopPropagation();
  }

  protected onBeforeHeaderToggle(): void { }

  protected onAfterHeaderToggle(_isOpened: boolean): void { }

  protected onDropdownOpened(): void { }

  protected shouldUpdateAriaSelectedOnFocus(): boolean {
    return false;
  }

  protected updateItemSelection(dropdownItem: HTMLLIElement, selected: boolean): void {
    if(selected) {
      dropdownItem.classList.add(this.itemClassSelected);
      dropdownItem.setAttribute("aria-selected", "true");
    } else {
      dropdownItem.classList.remove(this.itemClassSelected);
      dropdownItem.setAttribute("aria-selected", "false");
    }
  }

  protected abstract createHeader(): HTMLDivElement;
  protected abstract getOptions(): IDropdownItemOption[];
  protected abstract isOptionSelected(option: IDropdownItemOption): boolean;
  protected abstract onOptionSelect(option: IDropdownItemOption, dropdownItem: HTMLLIElement): void;
  protected abstract updateSelect(): void;
  protected abstract attachMethodsToElement(): void;
}
