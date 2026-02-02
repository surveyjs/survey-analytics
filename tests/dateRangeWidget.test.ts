import { DateRangeWidget } from "../src/utils/dateRangeWidget";

const mockOnDateRangeChanged = jest.fn();

beforeEach(() => {
  mockOnDateRangeChanged.mockClear();
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-12-15"));
});

afterEach(() => {
  jest.useRealTimers();
});

test("DateRangeWidget render shows date inputs with correct values", () => {
  const start = new Date("2025-12-01");
  const end = new Date("2025-12-14");
  const widget = new DateRangeWidget({
    onDateRangeChanged: mockOnDateRangeChanged,
    dateRange: [start, end]
  });

  const element = widget.render();
  const inputs = element.querySelectorAll("input[type='date']");

  expect(inputs.length).toBe(2);
  expect(inputs[0].value).toBe("2025-12-01");
  expect(inputs[1].value).toBe("2025-12-14");
});

test("DateRangeWidget render is not show dropdown & answerCoun", () => {
  const widget = new DateRangeWidget({
    onDateRangeChanged: mockOnDateRangeChanged,
    availableDatePeriods: [],
    showAnswerCount: false
  });

  const element = widget.render();

  expect(element).toBeDefined();
  expect(widget["datePeriodContainer"]).toBeUndefined();
  expect(widget["countLabel"]).toBeUndefined();
});

