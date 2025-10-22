import { DocumentHelper, options } from ".";
import "./dateRangeWidget.scss";

export interface IDateRange {
  start?: number;
  end?: number;
}
export interface IDateRangeOptions {
  showTotalCount?: boolean;
  initialRange?: IDateRange;
  setDateRange: (dateRange: IDateRange) => Promise<number>;
}

export function createDateRangeWidget(config: IDateRangeOptions): HTMLElement {
  const container = DocumentHelper.createElement("div", "sa-date-range-container");

  const dateRangeEditors = DocumentHelper.createElement("div", "sa-date-range_editors");
  container.appendChild(dateRangeEditors);

  let countLabel;
  function updateAnswersCount(answersCount: number) {
    if(!!countLabel && answersCount !== undefined) {
      countLabel.textContent = `${answersCount} answer(s)`;
    }
  }
  function setDateRange() {
    updateMinMaxAttributes();
    config.setDateRange({ ...currentDateRange }).then(answersCount => updateAnswersCount(answersCount));
  }
  function dateEditorChangeValue() {
    setDateRange();
    resetChipsState(chipsContainer);
  }
  function updateMinMaxAttributes() {
    if (currentDateRange.end !== undefined) {
      startDateInput.max = new Date(currentDateRange.end).toISOString().split("T")[0];
    } else {
      startDateInput.removeAttribute("max");
    }

    if (currentDateRange.start !== undefined) {
      endDateInput.min = new Date(currentDateRange.start).toISOString().split("T")[0];
    } else {
      endDateInput.removeAttribute("min");
    }
  }

  const currentDateRange: IDateRange = !!config.initialRange ? config.initialRange : {};
  const startDateEditor = createDateEditor(currentDateRange.start, (input: HTMLInputElement) => {
    if (input.reportValidity()) {
      currentDateRange.start = (new Date(input.value)).getTime();
      dateEditorChangeValue();
    }
  });
  dateRangeEditors.appendChild(startDateEditor);
  const startDateInput = startDateEditor.querySelector("input");

  const separator = DocumentHelper.createElement("div", "");
  // eslint-disable-next-line surveyjs/eslint-plugin-i18n/only-english-or-code
  separator.textContent = "—";
  dateRangeEditors.appendChild(separator);

  const endDateEditor = createDateEditor(currentDateRange.end, (input: HTMLInputElement) => {
    if (input.reportValidity()) {
      currentDateRange.end = (new Date(input.value)).getTime();
      dateEditorChangeValue();
    }
  });
  dateRangeEditors.appendChild(endDateEditor);
  const endDateInput = endDateEditor.querySelector("input");

  container.appendChild(createDivider());

  const chipsContainer = DocumentHelper.createElement("div", "sa-date-range_chips");

  const setFilter = (start, end) => {
    currentDateRange.start = !!start ? (new Date(start)).getTime() : undefined;
    currentDateRange.end = !!end ? (new Date(end)).getTime() : undefined;
    setDateRange();
    setDateIntoInput(start, startDateEditor.querySelector("input"));
    setDateIntoInput(end, endDateEditor.querySelector("input"));
  };
  const chipsConfig = {
    allTime: () => {
      setFilter(undefined, undefined);
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

  if(config.showTotalCount !== false) {
    const divider2 = createDivider();
    divider2.classList.add("sa-vertical-divider2");
    container.appendChild(divider2);
    const countContainer = DocumentHelper.createElement("div", "sa-count");
    countLabel = DocumentHelper.createElement("div", "sa-count_text");
    countContainer.appendChild(countLabel);
    container.appendChild(countContainer);
  }

  setFilter(currentDateRange.start, currentDateRange.end);

  return container;
}

function setDateIntoInput(dateValue: Date, input: HTMLInputElement) {
  if(!dateValue) {
    input.value = "";
    return;
  }

  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");

  input.value = `${year}-${month}-${day}`;
}

function createDateEditor(dateValue: number | Date, changeHandler: (input: HTMLInputElement) => void) {
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
      changeHandler(input);
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
    resetChipsState(container);
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

function resetChipsState(container) {
  const chips = container.querySelectorAll(".sa-date-range_chip");
  chips.forEach(chip => {
    if (chip.classList.contains("sa-date-range_chip--active")) {
      chip.classList.remove("sa-date-range_chip--active");
    }
  });
}
