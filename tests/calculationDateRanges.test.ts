import {
  getLast7Days,
  getLast14Days,
  getLast28Days,
  getLast30Days,
  getLastWeekMon,
  getLastWeekSun,
  getLastMonth,
  getLastQuarter,
  getLastYear,
  getThisWeekToDateSun,
  getThisWeekToDateMon,
  getThisMonthToDate,
  getThisQuarterToDate,
  getThisYearToDate,
  IDateRange,
  startOfDay,
  endOfDay
} from "../src/utils/calculationDateRanges";

function expectValidRange(range: IDateRange): void {
  expect(range.start).toBeDefined();
  expect(range.end).toBeDefined();
  expect(typeof range.start).toBe("number");
  expect(typeof range.end).toBe("number");
  expect(range.start).toBeLessThanOrEqual(range.end as number);
}

function expectStartOfDay(range: IDateRange, expectedDate: Date): void {
  expect(range.start).toBe(startOfDay(expectedDate).getTime());
}

function expectEndOfDay(range: IDateRange, expectedDate: Date): void {
  expect(range.end).toBe(endOfDay(expectedDate).getTime());
}

describe("calculationDateRanges for 15.12.2025", () => {
  const refDate = new Date("2025-12-15");

  test("getLast7Days", () => {
    const range = getLast7Days(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-08"));
    expectEndOfDay(range, new Date("2025-12-14"));
  });

  test("getLast14Days", () => {
    const range = getLast14Days(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-01"));
    expectEndOfDay(range, new Date("2025-12-14"));
  });

  test("getLast28Days", () => {
    const range = getLast28Days(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-11-17"));
    expectEndOfDay(range, new Date("2025-12-14"));
  });

  test("getLast30Days", () => {
    const range = getLast30Days(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-11-15"));
    expectEndOfDay(range, new Date("2025-12-14"));
  });

  test("getLastWeekMon", () => {
    const range = getLastWeekMon(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-08"));
    expectEndOfDay(range, new Date("2025-12-14"));
  });

  test("getLastWeekSun", () => {
    const range = getLastWeekSun(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-07"));
    expectEndOfDay(range, new Date("2025-12-13"));
  });

  test("getLastMonth", () => {
    const range = getLastMonth(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-11-01"));
    expectEndOfDay(range, new Date("2025-11-30"));
  });

  test("getLastQuarter", () => {
    const range = getLastQuarter(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-07-01"));
    expectEndOfDay(range, new Date("2025-09-30"));
  });

  test("getLastYear", () => {
    const range = getLastYear(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2024-01-01"));
    expectEndOfDay(range, new Date("2024-12-31"));
  });

  test("getThisWeekToDateSun includeToday=false", () => {
    const range = getThisWeekToDateSun(refDate, false);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-14"));
    expectEndOfDay(range, new Date("2025-12-14"));
  });

  test("getThisWeekToDateSun includeToday=true", () => {
    const range = getThisWeekToDateSun(refDate, true);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-14"));
    expectEndOfDay(range, new Date("2025-12-15"));
  });

  test("getThisWeekToDateMon includeToday=false", () => {
    const range = getThisWeekToDateMon(refDate, false);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-14"));
    expectEndOfDay(range, new Date("2025-12-14"));
  });

  test("getThisWeekToDateMon includeToday=true", () => {
    const range = getThisWeekToDateMon(refDate, true);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-15"));
    expectEndOfDay(range, new Date("2025-12-15"));
  });

  test("getThisMonthToDate includeToday=false", () => {
    const range = getThisMonthToDate(refDate, false);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-01"));
    expectEndOfDay(range, new Date("2025-12-14"));
  });

  test("getThisMonthToDate includeToday=true", () => {
    const range = getThisMonthToDate(refDate, true);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-01"));
    expectEndOfDay(range, new Date("2025-12-15"));
  });

  test("getThisQuarterToDate includeToday=false", () => {
    const range = getThisQuarterToDate(refDate, false);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-10-01"));
    expectEndOfDay(range, new Date("2025-12-14"));
  });

  test("getThisQuarterToDate includeToday=true", () => {
    const range = getThisQuarterToDate(refDate, true);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-10-01"));
    expectEndOfDay(range, new Date("2025-12-15"));
  });

  test("getThisYearToDate includeToday=false", () => {
    const range = getThisYearToDate(refDate, false);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-01-01"));
    expectEndOfDay(range, new Date("2025-12-14"));
  });

  test("getThisYearToDate includeToday=true", () => {
    const range = getThisYearToDate(refDate, true);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-01-01"));
    expectEndOfDay(range, new Date("2025-12-15"));
  });
});

describe("calculationDateRanges for 30.01.2026", () => {
  const refDate = new Date("2026-01-30");

  test("getLast7Days", () => {
    const range = getLast7Days(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-23"));
    expectEndOfDay(range, new Date("2026-01-29"));
  });

  test("getLast14Days", () => {
    const range = getLast14Days(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-16"));
    expectEndOfDay(range, new Date("2026-01-29"));
  });

  test("getLast28Days", () => {
    const range = getLast28Days(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-02"));
    expectEndOfDay(range, new Date("2026-01-29"));
  });

  test("getLast30Days", () => {
    const range = getLast30Days(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-31"));
    expectEndOfDay(range, new Date("2026-01-29"));
  });

  test("getLastWeekMon", () => {
    const range = getLastWeekMon(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-19"));
    expectEndOfDay(range, new Date("2026-01-25"));
  });

  test("getLastWeekSun", () => {
    const range = getLastWeekSun(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-18"));
    expectEndOfDay(range, new Date("2026-01-24"));
  });

  test("getLastMonth", () => {
    const range = getLastMonth(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-12-01"));
    expectEndOfDay(range, new Date("2025-12-31"));
  });

  test("getLastQuarter", () => {
    const range = getLastQuarter(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-10-01"));
    expectEndOfDay(range, new Date("2025-12-31"));
  });

  test("getLastYear", () => {
    const range = getLastYear(refDate);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2025-01-01"));
    expectEndOfDay(range, new Date("2025-12-31"));
  });

  test("getThisWeekToDateSun includeToday=false", () => {
    const range = getThisWeekToDateSun(refDate, false);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-25"));
    expectEndOfDay(range, new Date("2026-01-29"));
  });

  test("getThisWeekToDateSun includeToday=true", () => {
    const range = getThisWeekToDateSun(refDate, true);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-25"));
    expectEndOfDay(range, new Date("2026-01-30"));
  });

  test("getThisWeekToDateMon includeToday=false", () => {
    const range = getThisWeekToDateMon(refDate, false);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-26"));
    expectEndOfDay(range, new Date("2026-01-29"));
  });

  test("getThisWeekToDateMon includeToday=true", () => {
    const range = getThisWeekToDateMon(refDate, true);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-26"));
    expectEndOfDay(range, new Date("2026-01-30"));
  });

  test("getThisMonthToDate includeToday=false", () => {
    const range = getThisMonthToDate(refDate, false);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-01"));
    expectEndOfDay(range, new Date("2026-01-29"));
  });

  test("getThisMonthToDate includeToday=true", () => {
    const range = getThisMonthToDate(refDate, true);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-01"));
    expectEndOfDay(range, new Date("2026-01-30"));
  });

  test("getThisQuarterToDate includeToday=false", () => {
    const range = getThisQuarterToDate(refDate, false);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-01"));
    expectEndOfDay(range, new Date("2026-01-29"));
  });

  test("getThisQuarterToDate includeToday=true", () => {
    const range = getThisQuarterToDate(refDate, true);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-01"));
    expectEndOfDay(range, new Date("2026-01-30"));
  });

  test("getThisYearToDate includeToday=false", () => {
    const range = getThisYearToDate(refDate, false);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-01"));
    expectEndOfDay(range, new Date("2026-01-29"));
  });

  test("getThisYearToDate includeToday=true", () => {
    const range = getThisYearToDate(refDate, true);
    expectValidRange(range);
    expectStartOfDay(range, new Date("2026-01-01"));
    expectEndOfDay(range, new Date("2026-01-30"));
  });
});
