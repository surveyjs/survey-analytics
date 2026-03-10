import { DropdownBase, IDropdownItemOption } from "./dropdownBase";

export interface IActionDropdownOptions {
  options: Array<IDropdownItemOption> | (() => Array<IDropdownItemOption>);
  isSelected: (option: { value: string, text: string, icon?: string }) => boolean;
  handler: (value: string) => boolean;
  title: string | (() => string) | Function;
  className?: string;
  showArrow?: boolean;
  direction?: "up" | "down";
}

export class ActionDropdownWidget extends DropdownBase {
  private options: IActionDropdownOptions;
  private headerText!: HTMLSpanElement;

  constructor(options: IActionDropdownOptions) {
    super(options.className ?? "sa-action-dropdown");
    this.options = options;
  }

  get direction(): "up" | "down" {
    return this.options.direction ?? "down";
  }

  protected createHeader(): HTMLDivElement {
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

  private getTitleText(): string {
    const { title } = this.options;
    return !!title && (typeof title === "string" ? title : (title as () => string)());
  }

  protected getOptions(): IDropdownItemOption[] {
    const optionsSource = this.options.options || [];
    return Array.isArray(optionsSource) ? optionsSource : optionsSource();
  }

  protected isOptionSelected(option: IDropdownItemOption): boolean {
    return this.options.isSelected(option);
  }

  protected onOptionSelect(option: IDropdownItemOption, dropdownItem: HTMLLIElement): void {
    if(this.options.handler(option.value)) {
      this.hidePopup();
    }

    this.updateItemSelection();
    this.updateHeaderLabel();
  }

  protected onBeforePopupShow(): void {
    if(this.direction === "up") {
      this.dropdownList.classList.add(this.className + "--up");
    }
    this.updateOptions();
  }

  private updateHeaderLabel(): void {
    const titleText = this.getTitleText();
    this.dropdownHeader.setAttribute("aria-label", titleText);
    this.headerText.innerText = titleText;
  }

  protected updateSelect(): void {
    this.updateOptions();
    this.updateHeaderLabel();
  }

  protected attachMethodsToElement(): void {
    (this.dropdownElement as any)._handleClickOutside = this.handleClickOutsideRef;

    (this.dropdownElement as any).setValues = (values: string[]) => this.setValues(values);
    (this.dropdownElement as any).getValues = () => this.getValues();
    (this.dropdownElement as any).__updateSelect = () => this.updateSelect();
  }

  public setValues(values: string[]): void {
    this.updateHeaderLabel();
  }

  public getValues(): string[] {
    return this.optionItems.filter((option) => this.options.isSelected(option)).map((option) => option.value);
  }
}
