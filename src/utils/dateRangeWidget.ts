import { DocumentHelper } from ".";
import "./dateRangeWidget.scss";

export interface DateRangeResult {
  start: number;
  end: number;
}
export interface DateRangeOptions {
  answersCount?: number;
  initStartDate?: number | Date;
  initEndDate?: number | Date;
  setDateRange?: (dateRange: DateRangeResult) => void;
}

export function createDateRangeWidget(config: DateRangeOptions): HTMLElement {
  const container = DocumentHelper.createElement("div", "sa-date-range-container");

  const dateRangeEditors = DocumentHelper.createElement("div", "sa-date-range_editors");
  container.appendChild(dateRangeEditors);

  const currentDateRangeResult: DateRangeResult = {
    start: !!config.initStartDate ? (new Date(config.initStartDate)).getTime() : (new Date()).getTime(),
    end: !!config.initStartDate ? (new Date(config.initEndDate)).getTime(): (new Date()).getTime()
  };
  const startDateEditor = createDateEditor(currentDateRangeResult.start, (newValue: string) => {
    currentDateRangeResult.start = (new Date(newValue)).getTime();
    config.setDateRange(currentDateRangeResult);
    // TODO add validation
  });
  dateRangeEditors.appendChild(startDateEditor);

  const separator = DocumentHelper.createElement("div", "");
  // eslint-disable-next-line surveyjs/eslint-plugin-i18n/only-english-or-code
  separator.textContent = "—";
  dateRangeEditors.appendChild(separator);

  const endDateEditor = createDateEditor(currentDateRangeResult.end, (newValue: string) => {
    currentDateRangeResult.end = (new Date(newValue)).getTime();
    config.setDateRange(currentDateRangeResult);
    // TODO add validation
  });
  dateRangeEditors.appendChild(endDateEditor);

  container.appendChild(createDivider());

  const chipsContainer = DocumentHelper.createElement("div", "sa-date-range_chips");

  const setFilter = (start, end) => {
    currentDateRangeResult.start = (new Date(start)).getTime();
    currentDateRangeResult.end = (new Date(end)).getTime();
    config.setDateRange(currentDateRangeResult);
    setDateIntoInput(start, startDateEditor.querySelector("input"));
    setDateIntoInput(end, endDateEditor.querySelector("input"));
  };
  const chipsConfig = {
    allTime: () => {
      setFilter(!!config.initStartDate ? new Date(config.initStartDate) : new Date(),
        !!config.initEndDate ? new Date(config.initEndDate) : new Date());
    },
    lastYear: () => {
      const end = new Date();
      const start = new Date();
      start.setFullYear(end.getFullYear() - 1);
      setFilter(start, end);
    },
    lastQuarter: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 3);
      setFilter(start, end);
    },
    lastMonth: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 1);
      setFilter(start, end);
    },
    lastWeek: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      setFilter(start, end);
    },
  };
  Object.keys(chipsConfig).forEach((chipLabel, index) => {
    createChip(chipLabel, index === 0, chipsContainer, chipsConfig[chipLabel]);
  });

  container.appendChild(chipsContainer);

  if(config.answersCount !== undefined) {
    const divider2 = createDivider();
    divider2.classList.add("sa-vertical-divider2");
    container.appendChild(divider2);
    const countContainer = DocumentHelper.createElement("div", "sa-count");
    const countLabel = DocumentHelper.createElement("div", "sa-count_text");
    countLabel.textContent = `${config.answersCount} answer(s)`;
    countContainer.appendChild(countLabel);
    container.appendChild(countContainer);
  }

  return container;
}

function setDateIntoInput(dateValue: Date, input: HTMLInputElement) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");

  input.value = `${year}-${month}-${day}`;
}

function createDateEditor(dateValue: number | Date, changeHandler: (newValue: string) => void) {
  const dateEditor = DocumentHelper.createElement("div", "sa-date-range_editor");
  const formBox = DocumentHelper.createElement("div", "sa-date-range_editor-formbox");
  const content = DocumentHelper.createElement("div", "sa-date-range_editor-content");
  const input = <HTMLInputElement>DocumentHelper.createElement("input", "sa-date-range_editor-input",
    {
      type: "date"
    }
  );
  const date = (new Date(dateValue));
  setDateIntoInput(date, input);

  input.onchange = (e) => {
    if (!!changeHandler) {
      changeHandler(input.value);
    }
  };

  content.appendChild(input);
  formBox.appendChild(content);
  dateEditor.appendChild(formBox);

  return dateEditor;
}

function createDivider(): HTMLElement {
  const divider = DocumentHelper.createElement("div", "sa-vertical-divider");
  const line = DocumentHelper.createElement("div", "sa-line");
  divider.appendChild(line);
  return divider;
}

function createChip(text, isActive, container, clickHandler: () => {}): HTMLElement {
  const activaStateClass = "sa-date-range_chip--active";
  const chip = DocumentHelper.createElement("div", "sa-date-range_chip");
  if(isActive) {
    chip.classList.add(activaStateClass);
  }

  chip.addEventListener("click", function() {
    const elements = container.querySelectorAll(".sa-date-range_chip");
    resetChipsState(elements);
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

function resetChipsState(chips) {
  chips.forEach(chip => {
    if (chip.classList.contains("sa-date-range_chip--active")) {
      chip.classList.remove("sa-date-range_chip--active");
    }
  });
}
