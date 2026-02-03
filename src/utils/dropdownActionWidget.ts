import { DocumentHelper } from ".";
import { IDropdownItemOption } from "./dropdownWidget";

export interface IActionDropdownOptions {
  options: Array<IDropdownItemOption> | (() => Array<IDropdownItemOption>);
  isSelected: (option: { value: string, text: string, icon?: string }) => boolean;
  handler: (value: string) => boolean;
  title: string | (() => string) | Function;
  className?: string;
  showArrow?: boolean;
}

export class ActionDropdownWidget {
  private options: IActionDropdownOptions;
  private className: string;
  private dropdownOpenedClass: string;
  private itemClassSelected: string;

  private dropdownElement!: HTMLDivElement;
  private headerText!: HTMLSpanElement;
  private dropdownHeader!: HTMLDivElement;
  private dropdownList!: HTMLUListElement;
  private dropdownContainer!: HTMLDivElement;

  private optionItems: IDropdownItemOption[] = [];
  private currentFocusIndex = -1;
  private handleClickOutsideRef!: (event: MouseEvent) => void;

  constructor(options: IActionDropdownOptions) {
    this.options = options;
    this.className = options.className ?? "sa-action-dropdown";
    this.dropdownOpenedClass = this.className + "--opened";
    this.itemClassSelected = this.className + "-item--selected";
  }

  public render(): HTMLDivElement {
    this.dropdownElement = this.createDropdownElement();
    this.dropdownHeader = this.createHeader();
    this.dropdownList = this.createList();
    this.dropdownContainer = this.createContainer();

    this.bindEvents();
    this.attachMethodsToElement();

    this.dropdownContainer.appendChild(this.dropdownHeader);
    this.dropdownContainer.appendChild(this.dropdownList);
    this.dropdownElement.appendChild(this.dropdownContainer);

    this.updateSelect();

    return this.dropdownElement;
  }

  private createDropdownElement(): HTMLDivElement {
    const element = document.createElement("div");
    element.className = this.className;
    return element;
  }

  private getTitleText(): string {
    const { title } = this.options;
    return !!title && (typeof title === "string" ? title : (title as () => string)());
  }

  private createHeader(): HTMLDivElement {
    const header = document.createElement("div");
    header.className = this.className + "-header";
    header.setAttribute("tabindex", "0");
    header.setAttribute("role", "button");
    header.setAttribute("aria-haspopup", "listbox");
    header.setAttribute("aria-expanded", "false");
    header.setAttribute("aria-label", this.getTitleText());

    const headerContent = document.createElement("div");
    headerContent.className = this.className + "-header-content";

    this.headerText = document.createElement("span");
    this.headerText.className = this.className + "-title";
    this.headerText.textContent = this.getTitleText();
    headerContent.appendChild(this.headerText);
    header.appendChild(headerContent);

    if(this.options.showArrow !== false) {
      header.appendChild(this.createArrow());
    }

    return header;
  }

  private createArrow(): HTMLDivElement {
    const arrowElement = document.createElement("div");
    arrowElement.className = this.className + "-arrow";
    arrowElement.appendChild(DocumentHelper.createSvgElement("chevrondown-24x24"));
    return arrowElement;
  }

  private createList(): HTMLUListElement {
    const list = document.createElement("ul");
    list.className = this.className + "-list";
    list.setAttribute("role", "listbox");
    return list;
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement("div");
    container.className = this.className + "-container";
    return container;
  }

  private hidePopup(): void {
    this.dropdownHeader.classList.remove(this.dropdownOpenedClass);
    this.dropdownList.classList.remove(this.dropdownOpenedClass);
    this.dropdownHeader.setAttribute("aria-expanded", "false");
    this.currentFocusIndex = -1;
  }

  private focusItem(index: number): void {
    const items = this.dropdownList.querySelectorAll("." + this.className + "-item");
    if(items.length === 0) return;

    items.forEach(item => {
      item.classList.remove(this.className + "-item--focused");
    });

    if(index < 0) index = items.length - 1;
    if(index >= items.length) index = 0;

    this.currentFocusIndex = index;
    const itemToFocus = items[this.currentFocusIndex] as HTMLElement;
    itemToFocus.classList.add(this.className + "-item--focused");
    itemToFocus.scrollIntoView({ block: "nearest" });
  }

  private updateHeaderLabel(): void {
    const titleText = this.getTitleText();
    this.dropdownHeader.setAttribute("aria-label", titleText);
    this.headerText.innerText = titleText;
  }

  private updateOptions(): void {
    this.dropdownList.innerHTML = "";
    const optionsSource = this.options.options || [];
    this.optionItems = Array.isArray(optionsSource) ? optionsSource : optionsSource();

    this.optionItems.forEach((option) => {
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

    dropdownItem.addEventListener("click", (e) => this.handleOptionClick(e, option, dropdownItem));

    return dropdownItem;
  }

  private handleOptionClick(e: MouseEvent, option: IDropdownItemOption, dropdownItem: HTMLLIElement): void {
    if(this.options.handler(option.value)) {
      this.hidePopup();
    }
    e.preventDefault();
    e.stopPropagation();

    if(this.options.isSelected(option)) {
      dropdownItem.classList.add(this.itemClassSelected);
      dropdownItem.setAttribute("aria-selected", "true");
    } else {
      dropdownItem.classList.remove(this.itemClassSelected);
      dropdownItem.setAttribute("aria-selected", "false");
    }

    this.updateHeaderLabel();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if(!this.dropdownHeader.classList.contains(this.dropdownOpenedClass)) {
      if(e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        this.dropdownHeader.classList.add(this.dropdownOpenedClass);
        this.dropdownList.classList.add(this.dropdownOpenedClass);
        this.dropdownHeader.setAttribute("aria-expanded", "true");
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
      case " ":
        e.preventDefault();
        if(this.currentFocusIndex >= 0 && this.currentFocusIndex < items.length) {
          const selectedItem = items[this.currentFocusIndex] as HTMLElement;
          const value = selectedItem.dataset.value;
          if(value) {
            const option = this.optionItems.find((opt) => opt.value === value);
            if(option) {
              if(this.options.handler(option.value)) {
                this.hidePopup();
              }

              if(this.options.isSelected(option)) {
                selectedItem.classList.add(this.itemClassSelected);
                selectedItem.setAttribute("aria-selected", "true");
              } else {
                selectedItem.classList.remove(this.itemClassSelected);
                selectedItem.setAttribute("aria-selected", "false");
              }

              this.updateHeaderLabel();
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

  private handleClickOutside(event: MouseEvent): void {
    if(!this.dropdownElement.contains(event.target as Node)) {
      this.hidePopup();
    }
  }

  private bindEvents(): void {
    this.handleClickOutsideRef = (e: MouseEvent) => this.handleClickOutside(e);

    this.dropdownHeader.addEventListener("click", (e) => this.handleHeaderClick(e));
    this.dropdownHeader.addEventListener("keydown", (e) => this.handleKeyDown(e));
    this.dropdownList.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.addEventListener("click", this.handleClickOutsideRef);
  }

  private handleHeaderClick(e: MouseEvent): void {
    const parentContainerWidth = this.dropdownContainer.getBoundingClientRect().width;
    this.dropdownList.style.minWidth = `${parentContainerWidth}px`;

    this.updateOptions();
    const isOpened = this.dropdownHeader.classList.toggle(this.dropdownOpenedClass);
    this.dropdownList.classList.toggle(this.dropdownOpenedClass);
    this.dropdownHeader.setAttribute("aria-expanded", isOpened ? "true" : "false");

    if(!isOpened) {
      this.currentFocusIndex = -1;
    }

    e.preventDefault();
    e.stopPropagation();
  }

  private attachMethodsToElement(): void {
    (this.dropdownElement as any)._handleClickOutside = this.handleClickOutsideRef;

    (this.dropdownElement as any).setValues = (values: string[]) => this.setValues(values);
    (this.dropdownElement as any).getValues = () => this.getValues();
    (this.dropdownElement as any).__updateSelect = () => this.updateSelect();
  }

  public setValues(values: string[]): void {
    this.dropdownList.querySelectorAll("." + this.className + "-item").forEach((item) => {
      const itemValue = (item as HTMLElement)?.dataset?.value;
      if(itemValue && values.indexOf(itemValue) !== -1) {
        item.classList.add(this.itemClassSelected);
        item.setAttribute("aria-selected", "true");
      } else {
        item.classList.remove(this.itemClassSelected);
        item.setAttribute("aria-selected", "false");
      }
    });

    this.updateHeaderLabel();
  }

  public getValues(): string[] {
    return this.optionItems.filter((option) => this.options.isSelected(option)).map((option) => option.value);
  }

  public updateSelect(): void {
    this.updateOptions();
    this.updateHeaderLabel();
  }
}