import { DocumentHelper, IDropdownItemOption } from ".";
import { localization } from "../localizationManager";
import { IDateRange, getLast7Days, getLast14Days, getLast28Days, getLast30Days, getLastMonth, getLastQuarter, getLastWeekMon, getLastWeekSun, getLastYear, getThisMonthToDate, getThisQuarterToDate, getThisWeekToDateMon, getThisWeekToDateSun, getThisYearToDate } from "./calculationDateRanges";
import "./dateRangeWidget.scss";

export type DatePeriodEnum = "custom" | "last7days" | "last14days" | "last28days" | "last30days" | "lastWeekMon" | "lastWeekSun" | "lastMonth" | "lastQuarter" | "lastYear" | "ytd" | "mtd" | "wtdSun" | "wtdMon" | "qtd";

export const datePeriodsFunctions: Partial<Record<DatePeriodEnum, (refDate?: Date) => IDateRange>> = {
  last7days: getLast7Days,
  last14days: getLast14Days,
  last28days: getLast28Days,
  last30days: getLast30Days,
  lastWeekMon: getLastWeekMon,
  lastWeekSun: getLastWeekSun,
  lastMonth: getLastMonth,
  lastQuarter: getLastQuarter,
  lastYear: getLastYear,
  ytd: (refDate) => getThisYearToDate(refDate, false),
  mtd: (refDate) => getThisMonthToDate(refDate, false),
  wtdSun: () => getThisWeekToDateSun(false),
  wtdMon: (refDate) => getThisWeekToDateMon(refDate, false),
  qtd: (refDate) => getThisQuarterToDate(refDate, false)
};
export interface IDateRangeWidgetOptions {
  datePeriod?: DatePeriodEnum;
  availableDatePeriods: Array<DatePeriodEnum>;
  dateRange?: IDateRange;
  showAnswerCount?: boolean;

  setDateRange: (dateRange: IDateRange, datePeriod: DatePeriodEnum) => void;
}

export class DateRangeWidget {
  static invalidRangeClassName = "sa-date-range--invalid";
  static invalidRangeEditorClassName = "sa-date-range_editor--invalid";

  private currentDatePeriod: DatePeriodEnum;
  private currentDateRange: IDateRange;
  private availableDatePeriodFunctions: Array<DatePeriodEnum>;

  private dateRangeContainer: HTMLElement;
  private startDateEditor: HTMLElement;
  private endDateEditor: HTMLElement;
  private startDateInput: HTMLInputElement;
  private endDateInput: HTMLInputElement;
  private countLabel: HTMLElement;
  private rangeErrorMessage: HTMLElement;
  private datePeriodContainer: HTMLElement;

  private elementRemoveClassName(element: Element, className: string) {
    if(element.classList.contains(className)) {
      element.classList.remove(className);
    }
  }
  private setDateRange(): void {
    this.updateMinMaxAttributes();
    // onDateRangeChanged: (_, { datePeriod, dateRange }) => void
    this.options.setDateRange({ ...this.currentDateRange }, this.currentDatePeriod);
  }
  private dateEditorChangeValue(): void {
    this.setDateRange();
    // this.resetChipsState(this.datePeriodContainer);
  }
  private updateMinMaxAttributes(): void {
    if(this.currentDateRange.end !== undefined) {
      this.startDateInput.max = new Date(this.currentDateRange.end).toISOString().split("T")[0];
    } else {
      this.startDateInput.removeAttribute("max");
    }

    if(this.currentDateRange.start !== undefined) {
      this.endDateInput.min = new Date(this.currentDateRange.start).toISOString().split("T")[0];
    } else {
      this.endDateInput.removeAttribute("min");
    }
  }
  private setDateIntoInput(dateValue: number, input: HTMLInputElement): void {
    if(!!dateValue) {
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

    messageDiv.appendChild(panelDiv);
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
      if(!!changeHandler) {
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
  // private createChip(text: string, isActive: boolean, container: HTMLElement, clickHandler: () => {}): HTMLElement {
  //   const activaStateClass = "sa-date-range_chip--active";
  //   const chip = DocumentHelper.createElement("div", "sa-date-range_chip");
  //   if(isActive) {
  //     chip.classList.add(activaStateClass);
  //   }

  //   const self = this;
  //   chip.addEventListener("click", function() {
  //     self.resetChipsState(container);
  //     chip.classList.add(activaStateClass);
  //     clickHandler();
  //   });

  //   const box = DocumentHelper.createElement("div", "sa-date-range_chip-box");
  //   const labelContainer = DocumentHelper.createElement("div", "sa-date-range_chip-label");
  //   const labelText = DocumentHelper.createElement("div", "sa-date-range_chip-text");
  //   labelText.textContent = localization.getString("reportingPeriod" + text.charAt(0).toUpperCase() + text.slice(1));

  //   labelContainer.appendChild(labelText);
  //   box.appendChild(labelContainer);
  //   chip.appendChild(box);
  //   container.appendChild(chip);

  //   return chip;
  // }
  // private resetChipsState(container: HTMLElement): void {
  //   const chips = container.querySelectorAll(".sa-date-range_chip");
  //   chips.forEach(chip => {
  //     this.elementRemoveClassName(chip, "sa-date-range_chip--active");
  //   });
  // }
  private setDatePeriod(datePeriod: DatePeriodEnum | "resetRange") {
    if(datePeriod == "resetRange") {
      this.currentDatePeriod = undefined;
      this.setFilter(undefined, undefined);
      return;
    }
    this.currentDatePeriod = datePeriod;
    const range = datePeriodsFunctions[datePeriod]?.();
    range && this.setFilter(range.start, range.end);
  }
  public setFilter(start, end): void {
    this.currentDateRange.start = !!start ? (new Date(start)).getTime() : undefined;
    this.currentDateRange.end = !!end ? (new Date(end)).getTime() : undefined;
    this.setDateRange();
    this.setDateIntoInput(start, this.startDateInput);
    this.setDateIntoInput(end, this.endDateInput);
    this.elementRemoveClassName(this.startDateEditor, DateRangeWidget.invalidRangeEditorClassName);
    this.elementRemoveClassName(this.endDateEditor, DateRangeWidget.invalidRangeEditorClassName);
  }

  constructor(private options: IDateRangeWidgetOptions) {
    this.availableDatePeriodFunctions = options.availableDatePeriods ?? Object.keys(datePeriodsFunctions) as Array<DatePeriodEnum>;
  }

  public render(): HTMLElement {
    this.currentDateRange = this.options.dateRange ?? {};
    const rangeElement = DocumentHelper.createElement("div", "sa-date-range");
    const rangeContainer = DocumentHelper.createElement("div", "sa-date-range-container");
    const dateRangeEditors = DocumentHelper.createElement("div", "sa-date-range_editors");
    this.dateRangeContainer = rangeContainer;
    rangeContainer.appendChild(dateRangeEditors);
    rangeElement.appendChild(rangeContainer);

    this.startDateEditor = this.createDateEditor(this.currentDateRange.start, (input: HTMLInputElement) => {
      if(input.checkValidity()) {
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
    separator.textContent = "-";
    dateRangeEditors.appendChild(separator);

    this.endDateEditor = this.createDateEditor(this.currentDateRange.end, (input: HTMLInputElement) => {
      if(input.checkValidity()) {
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

    if(this.availableDatePeriodFunctions.length > 0) {
      // const isActive = (index) => {
      //   return !options.initialRange && index === 0;
      // };
      // this.chipsContainer = DocumentHelper.createElement("div", "sa-date-range_chips");
      // Object.keys(options.chipsConfig).forEach((chipLabel, index) => {
      //   this.createChip(chipLabel, isActive(index), this.chipsContainer, options.chipsConfig[chipLabel]);
      // });
      const options = [{ value: "resetRange", text: localization.getString("reportingPeriodResetRange") }];
      this.availableDatePeriodFunctions.forEach(key => {
        options.push(<IDropdownItemOption>{
          value: key,
          text: localization.getString("reportingPeriod" + key.charAt(0).toUpperCase() + key.slice(1))
        });
      });
      this.datePeriodContainer = DocumentHelper.createDropdown(
        options,
        (option: any) => this.currentDatePeriod === option.value,
        (value: any) => { this.setDatePeriod(value); }
      );

      rangeElement.appendChild(this.createDivider());
      rangeElement.appendChild(this.datePeriodContainer);
    }

    if(this.options.showAnswerCount !== false) {
      rangeElement.appendChild(this.createDivider());
      const countContainer = DocumentHelper.createElement("div", "sa-count");
      this.countLabel = DocumentHelper.createElement("div", "sa-count_text");
      countContainer.appendChild(this.countLabel);
      rangeElement.appendChild(countContainer);
    }

    this.setFilter(this.currentDateRange.start, this.currentDateRange.end);

    return rangeElement;
  }

  public updateAnswersCount(answersCount: number): void {
    if(!!this.countLabel && answersCount !== undefined) {
      this.countLabel.textContent = answersCount + " " + localization.getString("answersText");
    }
  }
}
