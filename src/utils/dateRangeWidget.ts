import { DocumentHelper } from ".";
import { localization } from "../localizationManager";
import "./dateRangeWidget.scss";

export interface IDateRange {
  start?: number;
  end?: number;
}
export interface IDateRangeWidgetOptions {
  setDateRange: (dateRange: IDateRange) => void;
  onBeforeRender: (options: IDateRangeOptions) => void;
}
export interface IDateRangeOptions {
  showTotalCount?: boolean;
  initialRange?: IDateRange;
  chipsConfig: {[key: string]: any};
}

export class DateRangeWidget {
  static invalidRangeClassName = "sa-date-range--invalid";
  static invalidRangeEditorClassName = "sa-date-range_editor--invalid";

  private currentDateRange: IDateRange

  private dateRangeContainer: HTMLElement;
  private startDateEditor: HTMLElement;
  private endDateEditor: HTMLElement;
  private startDateInput: HTMLInputElement;
  private endDateInput: HTMLInputElement;
  private countLabel: HTMLElement;
  private rangeErrorMessage: HTMLElement;
  private chipsContainer: HTMLElement;

  private elementRemoveClassName(element: Element, className: string) {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    }
  }
  private setDateRange(): void {
    this.updateMinMaxAttributes();
    this.config.setDateRange({ ...this.currentDateRange });
  }
  private dateEditorChangeValue(): void {
    this.setDateRange();
    this.resetChipsState(this.chipsContainer);
  }
  private updateMinMaxAttributes(): void {
    if (this.currentDateRange.end !== undefined) {
      this.startDateInput.max = new Date(this.currentDateRange.end).toISOString().split("T")[0];
    } else {
      this.startDateInput.removeAttribute("max");
    }

    if (this.currentDateRange.start !== undefined) {
      this.endDateInput.min = new Date(this.currentDateRange.start).toISOString().split("T")[0];
    } else {
      this.endDateInput.removeAttribute("min");
    }
  }
  private setDateIntoInput(dateValue: number, input: HTMLInputElement): void {
    if (!!dateValue) {
      const date = new Date(dateValue);
      input.value = date.toISOString().split("T")[0];
    } else {
      input.value = "";
    }
  }
  private createErrorMessage(textContent?: string) {
    const messageDiv = DocumentHelper.createElement("div", "sa-range-error");
    const panelDiv = DocumentHelper.createElement("div", "sa-range-error_panel");
    const errorMessageDiv = DocumentHelper.createElement("div", "sa-range-error_text");
    errorMessageDiv.textContent = textContent;
    this.rangeErrorMessage = errorMessageDiv;

    const iconDiv = DocumentHelper.createElement("div", "sa-range-error_icon");
    iconDiv.appendChild(DocumentHelper.createSvgElement("warning-24x24"));

    messageDiv.appendChild(panelDiv);
    panelDiv.appendChild(iconDiv);
    panelDiv.appendChild(errorMessageDiv);

    return messageDiv;
  }
  private createDateEditor(dateValue: number, changeHandler: (input: HTMLInputElement) => void): HTMLElement {
    const dateEditor = DocumentHelper.createElement("div", "sa-date-range_editor");
    const formBox = DocumentHelper.createElement("div", "sa-date-range_editor-formbox");
    const content = DocumentHelper.createElement("div", "sa-date-range_editor-content");
    const input = <HTMLInputElement>DocumentHelper.createElement("input", "sa-date-range_editor-input",
      {
        type: "date"
      }
    );
    this.setDateIntoInput(dateValue, input);

    input.onchange = (e) => {
      if (!!changeHandler) {
        changeHandler(input);
      }
    };

    content.appendChild(input);
    formBox.appendChild(content);
    dateEditor.appendChild(formBox);

    return dateEditor;
  }
  private createDivider(): HTMLElement {
    const divider = DocumentHelper.createElement("div", "sa-vertical-divider");
    const line = DocumentHelper.createElement("div", "sa-line");
    divider.appendChild(line);
    return divider;
  }
  private createChip(text: string, isActive: boolean, container: HTMLElement, clickHandler: () => {}): HTMLElement {
    const activaStateClass = "sa-date-range_chip--active";
    const chip = DocumentHelper.createElement("div", "sa-date-range_chip");
    if (isActive) {
      chip.classList.add(activaStateClass);
    }

    const self = this;
    chip.addEventListener("click", function() {
      self.resetChipsState(container);
      chip.classList.add(activaStateClass);
      clickHandler();
    });

    const box = DocumentHelper.createElement("div", "sa-date-range_chip-box");
    const labelContainer = DocumentHelper.createElement("div", "sa-date-range_chip-label");
    const labelText = DocumentHelper.createElement("div", "sa-date-range_chip-text");
    labelText.textContent = text;

    labelContainer.appendChild(labelText);
    box.appendChild(labelContainer);
    chip.appendChild(box);
    container.appendChild(chip);

    return chip;
  }
  private resetChipsState(container: HTMLElement): void {
    const chips = container.querySelectorAll(".sa-date-range_chip");
    chips.forEach(chip => {
      this.elementRemoveClassName(chip, "sa-date-range_chip--active");
    });
  }
  private setFilter(start, end): void {
    this.currentDateRange.start = !!start ? (new Date(start)).getTime() : undefined;
    this.currentDateRange.end = !!end ? (new Date(end)).getTime() : undefined;
    this.setDateRange();
    this.setDateIntoInput(start, this.startDateInput);
    this.setDateIntoInput(end, this.endDateInput);
    this.elementRemoveClassName(this.startDateEditor, DateRangeWidget.invalidRangeEditorClassName);
    this.elementRemoveClassName(this.endDateEditor, DateRangeWidget.invalidRangeEditorClassName);
  }
  private getDefaultChipsConfig(): {[key: string]: any} {
    return {
      allTime: () => {
        this.setFilter(undefined, undefined);
      },
      lastYear: () => {
        const end = new Date();
        const start = new Date();
        start.setFullYear(end.getFullYear() - 1);
        this.setFilter(start, end);
      },
      lastQuarter: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - 3);
        this.setFilter(start, end);
      },
      lastMonth: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - 1);
        this.setFilter(start, end);
      },
      lastWeek: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        this.setFilter(start, end);
      },
    };
  }

  constructor(private config: IDateRangeWidgetOptions) {
  }

  public render(): HTMLElement {
    const options = <IDateRangeOptions>{ chipsConfig: this.getDefaultChipsConfig() };
    this.config.onBeforeRender(options);

    this.currentDateRange = !!options.initialRange ? options.initialRange : {};
    const rangeElement = DocumentHelper.createElement("div", "sa-date-range");
    const rangeContainer = DocumentHelper.createElement("div", "sa-date-range-container");
    const dateRangeEditors = DocumentHelper.createElement("div", "sa-date-range_editors");
    this.dateRangeContainer = rangeContainer;
    rangeContainer.appendChild(dateRangeEditors);
    rangeElement.appendChild(rangeContainer);

    this.startDateEditor = this.createDateEditor(this.currentDateRange.start, (input: HTMLInputElement) => {
      if (input.checkValidity()) {
        this.currentDateRange.start = (new Date(input.value)).getTime();
        this.dateEditorChangeValue();
        this.elementRemoveClassName(this.startDateEditor, DateRangeWidget.invalidRangeEditorClassName);
        this.elementRemoveClassName(this.dateRangeContainer, DateRangeWidget.invalidRangeClassName);
      } else {
        this.startDateEditor.classList.add(DateRangeWidget.invalidRangeEditorClassName);
        this.dateRangeContainer.classList.add(DateRangeWidget.invalidRangeClassName);
        this.rangeErrorMessage.textContent = input.validationMessage;
      }
    });
    dateRangeEditors.appendChild(this.startDateEditor);
    this.startDateInput = this.startDateEditor.querySelector("input");

    const separator = DocumentHelper.createElement("div", "");
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/only-english-or-code
    separator.textContent = "—";
    dateRangeEditors.appendChild(separator);

    this.endDateEditor = this.createDateEditor(this.currentDateRange.end, (input: HTMLInputElement) => {
      if (input.checkValidity()) {
        this.currentDateRange.end = (new Date(input.value)).getTime();
        this.dateEditorChangeValue();
        this.elementRemoveClassName(this.endDateEditor, DateRangeWidget.invalidRangeEditorClassName);
        this.elementRemoveClassName(this.dateRangeContainer, DateRangeWidget.invalidRangeClassName);
      } else {
        this.endDateEditor.classList.add(DateRangeWidget.invalidRangeEditorClassName);
        this.dateRangeContainer.classList.add(DateRangeWidget.invalidRangeClassName);
        this.rangeErrorMessage.textContent = input.validationMessage;
      }
    });
    dateRangeEditors.appendChild(this.endDateEditor);
    rangeContainer.appendChild(this.createErrorMessage());

    this.endDateInput = this.endDateEditor.querySelector("input");

    if (!!options.chipsConfig && Object.keys(options.chipsConfig).length > 0) {
      this.chipsContainer = DocumentHelper.createElement("div", "sa-date-range_chips");
      Object.keys(options.chipsConfig).forEach((chipLabel, index) => {
        this.createChip(chipLabel, index === 0, this.chipsContainer, options.chipsConfig[chipLabel]);
      });

      rangeElement.appendChild(this.createDivider());
      rangeElement.appendChild(this.chipsContainer);
    }

    if (options.showTotalCount !== false) {
      const divider2 = this.createDivider();
      divider2.classList.add("sa-vertical-divider2");
      rangeElement.appendChild(divider2);
      const countContainer = DocumentHelper.createElement("div", "sa-count");
      this.countLabel = DocumentHelper.createElement("div", "sa-count_text");
      countContainer.appendChild(this.countLabel);
      rangeElement.appendChild(countContainer);
    }

    this.setFilter(this.currentDateRange.start, this.currentDateRange.end);

    return rangeElement;
  }

  public updateAnswersCount(answersCount: number): void {
    if (!!this.countLabel && answersCount !== undefined) {
      this.countLabel.textContent = answersCount + " " + localization.getString("answersText");
    }
  }
}
