import { endOfDay, startOfDay } from "../src/utils/calculationDateRanges";
import { DateRangeModel } from "../src/utils/dateRangeModel";

const mockOnDateRangeChanged = jest.fn();

beforeEach(() => {
  mockOnDateRangeChanged.mockClear();
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-12-15"));
});

afterEach(() => {
  jest.useRealTimers();
});

test("DateRangeModel initializes with dateRange option", () => {
  const start = new Date("2025-12-01");
  const end = new Date("2025-12-14");
  const model = new DateRangeModel({
    onDateRangeChanged: mockOnDateRangeChanged,
    dateRange: [start, end]
  });

  expect(model.currentDatePeriod).toBeUndefined();
  expect(model.currentDateRange.start).toBe(startOfDay(start).getTime());
  expect(model.currentDateRange.end).toBe(endOfDay(end).getTime());
  expect(mockOnDateRangeChanged).not.toHaveBeenCalled();
});

test("DateRangeModel initializes with datePeriod option", () => {
  const start = new Date("2025-12-08");
  const end = new Date("2025-12-14");
  const model = new DateRangeModel({
    onDateRangeChanged: mockOnDateRangeChanged,
    datePeriod: "last7days"
  });

  expect(model.currentDatePeriod).toBe("last7days");
  expect(model.currentDateRange.start).toBe(startOfDay(start).getTime());
  expect(model.currentDateRange.end).toBe(endOfDay(end).getTime());
});

test("DateRangeModel uses default availableDatePeriods when not provided", () => {
  const model = new DateRangeModel({
    onDateRangeChanged: mockOnDateRangeChanged
  });

  const periods = model.availableDatePeriods;
  expect(periods).toEqual(["last7days", "last14days", "last28days", "last30days", "lastWeekMon", "lastWeekSun", "lastMonth", "lastQuarter", "lastYear", "ytd", "mtd", "wtdSun", "wtdMon", "qtd"]);
});

test("DateRangeModel uses custom availableDatePeriods when provided", () => {
  const customPeriods = ["last7days", "last30days"] as const;
  const model = new DateRangeModel({
    onDateRangeChanged: mockOnDateRangeChanged,
    availableDatePeriods: [...customPeriods]
  });

  expect(model.availableDatePeriods).toEqual(customPeriods);
});

test("DateRangeModel initializes with both dateRange and datePeriod", () => {
  const start = new Date("2025-11-01");
  const end = new Date("2025-11-30");
  const model = new DateRangeModel({
    onDateRangeChanged: mockOnDateRangeChanged,
    dateRange: [start, end],
    datePeriod: "lastMonth"
  });

  expect(model.currentDatePeriod).toBe("lastMonth");
  expect(model.currentDateRange.start).toBe(startOfDay(start).getTime());
  expect(model.currentDateRange.end).toBe(endOfDay(end).getTime());
});

test("DateRangeModel setDatePeriod updates range and calls onDateRangeChanged for last7days", () => {
  const newStart = startOfDay(new Date("2025-12-08")).getTime();
  const newEnd = endOfDay(new Date("2025-12-14")).getTime();
  const model = new DateRangeModel({
    onDateRangeChanged: mockOnDateRangeChanged,
    dateRange: [new Date("2025-12-01"), new Date("2025-12-14")]
  });

  model.setDatePeriod("last7days");

  expect(model.currentDatePeriod).toBe("last7days");
  expect(model.currentDateRange.start).toBe(newStart);
  expect(model.currentDateRange.end).toBe(newEnd);
  expect(mockOnDateRangeChanged).toHaveBeenCalledTimes(1);
  expect(mockOnDateRangeChanged).toHaveBeenCalledWith(
    expect.objectContaining({
      start: newStart,
      end: newEnd
    }),
    "last7days"
  );
});

test("DateRangeModel setDatePeriod updates range for last30days", () => {
  const model = new DateRangeModel({
    onDateRangeChanged: mockOnDateRangeChanged,
    dateRange: [new Date("2025-12-01"), new Date("2025-12-14")]
  });

  model.setDatePeriod("last30days");

  expect(model.currentDateRange.start).toBe(startOfDay(new Date("2025-11-15")).getTime());
  expect(model.currentDateRange.end).toBe(endOfDay(new Date("2025-12-14")).getTime());
});

test("DateRangeModel setFilter updates range and calls onDateRangeChanged", () => {
  const model = new DateRangeModel({
    onDateRangeChanged: mockOnDateRangeChanged,
    dateRange: [new Date("2025-12-01"), new Date("2025-12-14")]
  });

  const newStart = new Date("2025-11-15").getTime();
  const newEnd = new Date("2025-12-10").getTime();

  model.setFilter(newStart, newEnd);

  expect(model.currentDateRange.start).toBe(newStart);
  expect(model.currentDateRange.end).toBe(newEnd);
  expect(mockOnDateRangeChanged).toHaveBeenCalledTimes(1);
  expect(mockOnDateRangeChanged).toHaveBeenCalledWith(
    { start: newStart, end: newEnd },
    undefined
  );
});

test("DateRangeModel setFilter treats 0 as falsy for start and end", () => {
  const model = new DateRangeModel({
    onDateRangeChanged: mockOnDateRangeChanged,
    dateRange: [new Date("2025-12-01"), new Date("2025-12-14")]
  });

  model.setFilter(0, 0);

  expect(model.currentDateRange.start).toBeUndefined();
  expect(model.currentDateRange.end).toBeUndefined();
});

test("DateRangeModel setFilter converts timestamps correctly", () => {
  const model = new DateRangeModel({
    onDateRangeChanged: mockOnDateRangeChanged
  });

  const startDate = new Date("2025-11-15");
  const endDate = new Date("2025-12-10");

  model.setFilter(startDate.getTime(), endDate.getTime());

  expect(model.currentDateRange.start).toBe(startDate.getTime());
  expect(model.currentDateRange.end).toBe(endDate.getTime());
});

test("DateRangeModel datePeriod takes precedence over dateRange", () => {
  const model = new DateRangeModel({
    onDateRangeChanged: mockOnDateRangeChanged,
    dateRange: [new Date("2025-12-01"), new Date("2025-12-14")],
    datePeriod: "last30days"
  });

  expect(model.currentDateRange.start).toBe(startOfDay(new Date("2025-11-15")).getTime());
  expect(model.currentDateRange.end).toBe(endOfDay(new Date("2025-12-14")).getTime());
});