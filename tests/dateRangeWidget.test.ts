import { DateRangeWidget } from "../src/utils/dateRangeWidget";

const millisecondsInDay = 1000 * 60 * 60 * 24;

const mockConfig = {
  setDateRange: jest.fn(),
  onBeforeRender: jest.fn(),
};

class DateRangeWidgetMock extends DateRangeWidget {
  start: Date;
  end: Date;

  setFilter(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }
}

describe("DateRangeWidget.defaultChipsConfig", () => {
  test("defaultChipsConfig contains all expected methods", () => {
    const expectedMethods = ["resetRange", "lastYear", "lastQuarter", "lastMonth", "lastWeek"];
    const actualMethods = Object.keys(DateRangeWidget.defaultChipsConfig);

    expectedMethods.forEach(method => {
      expect(actualMethods).toContain(method);
    });
  });

  test("resetRange calls setFilter with undefined for both dates", () => {
    const dateRangeMock = new DateRangeWidgetMock(mockConfig);
    const resetRangeFn = DateRangeWidget.defaultChipsConfig.resetRange(dateRangeMock);
    expect(typeof resetRangeFn).toBe("function");
    resetRangeFn();

    expect(dateRangeMock.start).toBe(undefined);
    expect(dateRangeMock.end).toBe(undefined);
  });

  test("lastYear sets range to last year", () => {
    const dateRangeMock = new DateRangeWidgetMock(mockConfig);
    const lastYearFn = DateRangeWidget.defaultChipsConfig.lastYear(dateRangeMock);
    expect(typeof lastYearFn).toBe("function");

    lastYearFn();
    expect(dateRangeMock.start).toBeInstanceOf(Date);
    expect(dateRangeMock.end).toBeInstanceOf(Date);

    const daysDiff = Math.round((dateRangeMock.end.getTime() - dateRangeMock.start.getTime()) / millisecondsInDay);
    expect(daysDiff).toBe(365);
  });

  test("lastQuarter sets range to last 3 months", () => {
    const dateRangeMock = new DateRangeWidgetMock(mockConfig);
    const lastQuarterFn = DateRangeWidget.defaultChipsConfig.lastQuarter(dateRangeMock);
    expect(typeof lastQuarterFn).toBe("function");

    lastQuarterFn();
    expect(dateRangeMock.start).toBeInstanceOf(Date);
    expect(dateRangeMock.end).toBeInstanceOf(Date);

    const daysDiff = Math.round((dateRangeMock.end.getTime() - dateRangeMock.start.getTime()) / millisecondsInDay);
    expect(daysDiff).toBeLessThanOrEqual(92);
  });

  test("lastMonth sets range to last month", () => {
    const dateRangeMock = new DateRangeWidgetMock(mockConfig);
    const lastMonthFn = DateRangeWidget.defaultChipsConfig.lastMonth(dateRangeMock);
    expect(typeof lastMonthFn).toBe("function");

    lastMonthFn();
    expect(dateRangeMock.start).toBeInstanceOf(Date);
    expect(dateRangeMock.end).toBeInstanceOf(Date);

    const daysDiff = Math.round((dateRangeMock.end.getTime() - dateRangeMock.start.getTime()) / millisecondsInDay);
    expect(daysDiff).toBeLessThanOrEqual(31);
  });

  test("lastWeek sets range to last week", () => {
    const dateRangeMock = new DateRangeWidgetMock(mockConfig);
    const lastWeekFn = DateRangeWidget.defaultChipsConfig.lastWeek(dateRangeMock);
    expect(typeof lastWeekFn).toBe("function");

    lastWeekFn();
    expect(dateRangeMock.start).toBeInstanceOf(Date);
    expect(dateRangeMock.end).toBeInstanceOf(Date);

    const daysDiff = Math.round((dateRangeMock.end.getTime() - dateRangeMock.start.getTime()) / millisecondsInDay);
    expect(daysDiff).toBe(6);
  });
});