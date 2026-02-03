import { DocumentHelper } from ".";
import { localization } from "../localizationManager";
import { DateRangeModel, DatePeriodEnum, datePeriodsFunctions, IDateRangeModelOptions } from "./dateRangeModel";
import { IDropdownItemOption } from "./dropdownWidget";
import "./dateRangeWidget.scss";

export type { DatePeriodEnum };
export { datePeriodsFunctions };

export interface IDateRangeWidgetOptions extends IDateRangeModelOptions {
  showAnswerCount?: boolean;
}

export class DateRangeWidget {
  static invalidRangeClassName = "sa-date-range--invalid";
  static invalidRangeEditorClassName = "sa-date-range_editor--invalid";

  private dateRangeContainer: HTMLElement;
  private startDateEditor: HTMLElement;
  private endDateEditor: HTMLElement;
  private startDateInput: HTMLInputElement;
  private endDateInput: HTMLInputElement;
  private countLabel: HTMLElement;
  private rangeErrorMessage: HTMLElement;
  private datePeriodContainer: HTMLElement;

  private model: DateRangeModel;

  private elementRemoveClassName(element: Element, className: string) {
    if(element.classList.contains(className)) {
      element.classList.remove(className);
    }
  }

  private updateMinMaxAttributes(): void {
    const dateRange = this.model.currentDateRange;
    if(dateRange.end !== undefined) {
      this.startDateInput.max = new Date(dateRange.end).toISOString().split("T")[0];
    } else {
      this.startDateInput.removeAttribute("max");
    }

    if(dateRange.start !== undefined) {
      this.endDateInput.min = new Date(dateRange.start).toISOString().split("T")[0];
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

  constructor(private options: IDateRangeWidgetOptions) {
    this.model = new DateRangeModel(options);
  }

  public render(): HTMLElement {
    const rangeElement = DocumentHelper.createElement("div", "sa-date-range");
    const rangeContainer = DocumentHelper.createElement("div", "sa-date-range-container");
    const dateRangeEditors = DocumentHelper.createElement("div", "sa-date-range_editors");
    this.dateRangeContainer = rangeContainer;
    rangeContainer.appendChild(dateRangeEditors);
    rangeElement.appendChild(rangeContainer);

    const currentDateRange = this.model.currentDateRange;

    this.startDateEditor = this.createDateEditor(currentDateRange.start, (input: HTMLInputElement) => {
      if(input.checkValidity()) {
        this.model.setFilter((new Date(input.value)).getTime(), this.model.currentDateRange.end, true);
        this.updateElements();
      } else {
        this.startDateEditor.classList.add(DateRangeWidget.invalidRangeEditorClassName);
        this.dateRangeContainer.classList.add(DateRangeWidget.invalidRangeClassName);
        this.rangeErrorMessage.textContent = input.validationMessage;
      }
    });
    dateRangeEditors.appendChild(this.startDateEditor);
    this.startDateInput = this.startDateEditor.querySelector("input");
    this.setDateIntoInput(currentDateRange.start, this.startDateInput);

    const separator = DocumentHelper.createElement("div", "");
    separator.textContent = "-";
    dateRangeEditors.appendChild(separator);

    this.endDateEditor = this.createDateEditor(currentDateRange.end, (input: HTMLInputElement) => {
      if(input.checkValidity()) {
        this.model.setFilter(this.model.currentDateRange.start, (new Date(input.value)).getTime(), true);
        this.updateElements();
      } else {
        this.endDateEditor.classList.add(DateRangeWidget.invalidRangeEditorClassName);
        this.dateRangeContainer.classList.add(DateRangeWidget.invalidRangeClassName);
        this.rangeErrorMessage.textContent = input.validationMessage;
      }
    });
    dateRangeEditors.appendChild(this.endDateEditor);
    rangeContainer.appendChild(this.createErrorMessage());

    this.endDateInput = this.endDateEditor.querySelector("input");
    this.setDateIntoInput(currentDateRange.end, this.endDateInput);

    if(this.model.availableDatePeriods.length > 0) {
      const options = [];
      this.model.availableDatePeriods.forEach(key => {
        options.push(<IDropdownItemOption>{
          value: key,
          text: localization.getString("reportingPeriod" + key.charAt(0).toUpperCase() + key.slice(1))
        });
      });

      this.datePeriodContainer = DocumentHelper.createDropdown({
        options,
        isSelected: (option: any) => this.model.currentDatePeriod === option.value,
        handler: (value: any) => {
          this.setDatePeriod(value);
        },
        resetHandler: () => {
          this.setDatePeriod(undefined);
        },
        placeholder: localization.getString("selectDateRange")
      });
      this.datePeriodContainer.classList.add("sa-date-range_dropdown");

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

    return rangeElement;
  }

  public setDatePeriod(datePeriod: DatePeriodEnum | undefined): void {
    this.model.setDatePeriod(datePeriod);
    this.updateElements();
  }

  public updateElements(): void {
    if(this.datePeriodContainer) {
      this.datePeriodContainer["__updateSelect"] && this.datePeriodContainer["__updateSelect"]();
    }
    this.updateMinMaxAttributes();
    const range = this.model.currentDateRange;
    this.setDateIntoInput(range.start, this.startDateInput);
    this.setDateIntoInput(range.end, this.endDateInput);
    this.elementRemoveClassName(this.startDateEditor, DateRangeWidget.invalidRangeEditorClassName);
    this.elementRemoveClassName(this.endDateEditor, DateRangeWidget.invalidRangeEditorClassName);
  }

  public updateAnswersCount(answersCount: number): void {
    if(!!this.countLabel && answersCount !== undefined) {
      this.countLabel.textContent = answersCount + " " + localization.getString("answersText");
    }
  }
}
