import { DocumentHelper } from ".";
import "./dateRangeWidget.scss";

export interface IDateRange {
  start?: number;
  end?: number;
}
export interface IDateRangeWidgetOptions {
  setDateRange: (dateRange: IDateRange) => Promise<number>;
  onBeforeRender: (options: IDateRangeOptions) => void;
}
export interface IDateRangeOptions {
  showTotalCount?: boolean;
  initialRange?: IDateRange;
  chipsConfig: {[key: string]: any};
}

export class DateRangeWidget {
  private currentDateRange: IDateRange

  private startDateEditor: HTMLElement;
  private endDateEditor: HTMLElement;
  private startDateInput: HTMLInputElement;
  private endDateInput: HTMLInputElement;
  private countLabel: HTMLElement;
  private chipsContainer: HTMLElement;

  private updateAnswersCount(answersCount: number): void {
    if (!!this.countLabel && answersCount !== undefined) {
      this.countLabel.textContent = `${answersCount} answer(s)`;
    }
  }
  private setDateRange(): void {
    this.updateMinMaxAttributes();
    this.config.setDateRange({ ...this.currentDateRange }).then(answersCount => this.updateAnswersCount(answersCount));
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
  private setDateIntoInput(dateValue: Date, input: HTMLInputElement): void {
    if (!dateValue) {
      input.value = "";
      return;
    }

    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const day = String(dateValue.getDate()).padStart(2, "0");

    input.value = `${year}-${month}-${day}`;
  }
  private createDateEditor(dateValue: number | Date, changeHandler: (input: HTMLInputElement) => void): HTMLElement {
    const dateEditor = DocumentHelper.createElement("div", "sa-date-range_editor");
    const formBox = DocumentHelper.createElement("div", "sa-date-range_editor-formbox");
    const content = DocumentHelper.createElement("div", "sa-date-range_editor-content");
    const input = <HTMLInputElement>DocumentHelper.createElement("input", "sa-date-range_editor-input",
      {
        type: "date"
      }
    );
    const date = (new Date(dateValue));
    this.setDateIntoInput(date, input);

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
      if (chip.classList.contains("sa-date-range_chip--active")) {
        chip.classList.remove("sa-date-range_chip--active");
      }
    });
  }
  private setFilter(start, end): void {
    this.currentDateRange.start = !!start ? (new Date(start)).getTime() : undefined;
    this.currentDateRange.end = !!end ? (new Date(end)).getTime() : undefined;
    this.setDateRange();
    this.setDateIntoInput(start, this.startDateInput);
    this.setDateIntoInput(end, this.endDateInput);
  }

  constructor(private config: IDateRangeWidgetOptions) {
  }

  public render(): HTMLElement {
    const chipsConfig = {
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

    const options = <IDateRangeOptions>{ chipsConfig: chipsConfig };
    this.config.onBeforeRender(options);

    this.currentDateRange = !!options.initialRange ? options.initialRange : {};
    const container = DocumentHelper.createElement("div", "sa-date-range-container");
    const dateRangeEditors = DocumentHelper.createElement("div", "sa-date-range_editors");
    container.appendChild(dateRangeEditors);

    this.startDateEditor = this.createDateEditor(this.currentDateRange.start, (input: HTMLInputElement) => {
      if (input.reportValidity()) {
        this.currentDateRange.start = (new Date(input.value)).getTime();
        this.dateEditorChangeValue();
      }
    });
    dateRangeEditors.appendChild(this.startDateEditor);
    this.startDateInput = this.startDateEditor.querySelector("input");

    const separator = DocumentHelper.createElement("div", "");
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/only-english-or-code
    separator.textContent = "—";
    dateRangeEditors.appendChild(separator);

    this.endDateEditor = this.createDateEditor(this.currentDateRange.end, (input: HTMLInputElement) => {
      if (input.reportValidity()) {
        this.currentDateRange.end = (new Date(input.value)).getTime();
        this.dateEditorChangeValue();
      }
    });
    dateRangeEditors.appendChild(this.endDateEditor);
    this.endDateInput = this.endDateEditor.querySelector("input");

    if (!!options.chipsConfig && Object.keys(options.chipsConfig).length > 0) {
      this.chipsContainer = DocumentHelper.createElement("div", "sa-date-range_chips");
      Object.keys(options.chipsConfig).forEach((chipLabel, index) => {
        this.createChip(chipLabel, index === 0, this.chipsContainer, options.chipsConfig[chipLabel]);
      });

      container.appendChild(this.createDivider());
      container.appendChild(this.chipsContainer);
    }

    if (options.showTotalCount !== false) {
      const divider2 = this.createDivider();
      divider2.classList.add("sa-vertical-divider2");
      container.appendChild(divider2);
      const countContainer = DocumentHelper.createElement("div", "sa-count");
      this.countLabel = DocumentHelper.createElement("div", "sa-count_text");
      countContainer.appendChild(this.countLabel);
      container.appendChild(countContainer);
    }

    this.setFilter(this.currentDateRange.start, this.currentDateRange.end);

    return container;
  }
}
