export interface IDateRange {
  start?: number;
  end?: number;
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function toRange(start: Date | number, end: Date | number): IDateRange {
  const startValue = start instanceof Date ? startOfDay(start).getTime() : start;
  const endValue = end instanceof Date ? endOfDay(end).getTime() : end;
  return { start: startValue, end: endValue };
}

/**
 * Last 7 days (excl. today): refDate minus 7 days through yesterday
 * @since 3.0.0
 */
export function getLast7Days(refDate = new Date()): IDateRange {
  const end = endOfDay(refDate);
  end.setDate(refDate.getDate() - 1);
  const start = startOfDay(end);
  start.setDate(end.getDate() - 6);
  return toRange(start, end);
}

/**
 * Last 14 days (excl. today): refDate minus 14 days through yesterday
 * @since 3.0.0
 */
export function getLast14Days(refDate = new Date()): IDateRange {
  const end = endOfDay(refDate);
  end.setDate(refDate.getDate() - 1);
  const start = startOfDay(end);
  start.setDate(end.getDate() - 13);
  return toRange(start, end);
}

/**
 * Last 28 days (excl. today): refDate minus 28 days through yesterday
 * @since 3.0.0
 */
export function getLast28Days(refDate = new Date()): IDateRange {
  const end = endOfDay(refDate);
  end.setDate(refDate.getDate() - 1);
  const start = startOfDay(end);
  start.setDate(end.getDate() - 27);
  return toRange(start, end);
}

/**
 * Last 30 days (excl. today): refDate minus 30 days through yesterday
 * @since 3.0.0
 */
export function getLast30Days(refDate = new Date()): IDateRange {
  const end = endOfDay(refDate);
  end.setDate(refDate.getDate() - 1);
  const start = startOfDay(end);
  start.setDate(end.getDate() - 29);
  return toRange(start, end);
}

/**
 * Last week (Monday-Sunday): previous Monday through previous Sunday
 * @since 3.0.0
 */
export function getLastWeekMon(refDate = new Date()): IDateRange {
  const d = startOfDay(refDate);
  const day = d.getDay();
  const daysToMonday = day === 0 ? 6 : day - 1;
  const thisMonday = startOfDay(d);
  thisMonday.setDate(d.getDate() - daysToMonday);
  const lastMonday = startOfDay(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);
  const lastSunday = startOfDay(lastMonday);
  lastSunday.setDate(lastMonday.getDate() + 6);
  return toRange(lastMonday, lastSunday);
}

/**
 * Last week (Sunday-Saturday): previous Sunday through previous Saturday
 * @since 3.0.0
 */
export function getLastWeekSun(refDate = new Date()): IDateRange {
  const d = startOfDay(refDate);
  const daysToSunday = d.getDay();
  const thisSunday = startOfDay(d);
  thisSunday.setDate(d.getDate() - daysToSunday);
  const lastSunday = startOfDay(thisSunday);
  lastSunday.setDate(thisSunday.getDate() - 7);
  const lastSaturday = startOfDay(lastSunday);
  lastSaturday.setDate(lastSunday.getDate() + 6);
  return toRange(lastSunday, lastSaturday);
}

/**
 * Last month: first day through last day of previous month
 * @since 3.0.0
 */
export function getLastMonth(refDate = new Date()): IDateRange {
  const date = startOfDay(refDate);
  const end = new Date(date.getFullYear(), date.getMonth(), 0);
  const start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return toRange(start, end);
}

/**
 * Last quarter: first day through last day of previous quarter
 * @since 3.0.0
 */
export function getLastQuarter(refDate = new Date()): IDateRange {
  const date = startOfDay(refDate);
  const q = Math.floor(date.getMonth() / 3) + 1;
  const lastQ = q === 1 ? 4 : q - 1;
  const year = lastQ === 4 ? date.getFullYear() - 1 : date.getFullYear();
  const start = new Date(year, (lastQ - 1) * 3, 1);
  const end = new Date(year, lastQ * 3, 0);
  return toRange(start, end);
}

/**
 * Last year: January 1 through December 31 of previous year
 * @since 3.0.0
 */
export function getLastYear(refDate = new Date()): IDateRange {
  const date = startOfDay(refDate);
  const start = new Date(date.getFullYear() - 1, 0, 1);
  const end = new Date(date.getFullYear() - 1, 11, 31);
  return toRange(start, end);
}

/**
 * This week to date (starts Sunday): Sunday through yesterday or today
 * @since 3.0.0
 */
export function getThisWeekToDateSun(refDate = new Date(), includeToday = false): IDateRange {
  const ref = startOfDay(refDate);
  const end = endOfDay(ref);
  if(!includeToday) end.setDate(ref.getDate() - 1);
  const start = startOfDay(ref);
  start.setDate(ref.getDate() - ref.getDay());
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/**
 * This week to date (starts Monday): Monday through yesterday or today
 * @since 3.0.0
 */
export function getThisWeekToDateMon(refDate = new Date(), includeToday = false): IDateRange {
  const ref = startOfDay(refDate);
  const end = endOfDay(ref);
  if(!includeToday) end.setDate(ref.getDate() - 1);
  const start = startOfDay(ref);
  const day = ref.getDay();
  const diff = day === 0 ? 6 : day - 1;
  start.setDate(ref.getDate() - diff);
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/**
 * This month to date: first day of month through yesterday or today
 * @since 3.0.0
 */
export function getThisMonthToDate(refDate = new Date(), includeToday = false): IDateRange {
  const date = startOfDay(refDate);
  const end = endOfDay(date);
  if(!includeToday) end.setDate(date.getDate() - 1);
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/**
 * This quarter to date: first day of quarter through yesterday or today
 * @since 3.0.0
 */
export function getThisQuarterToDate(refDate = new Date(), includeToday = false): IDateRange {
  const date = startOfDay(refDate);
  const end = endOfDay(date);
  if(!includeToday) end.setDate(date.getDate() - 1);
  const q = Math.floor(date.getMonth() / 3) + 1;
  const start = new Date(date.getFullYear(), (q - 1) * 3, 1);
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/**
 * This year to date: January 1 through yesterday or today
 * @since 3.0.0
 */
export function getThisYearToDate(refDate = new Date(), includeToday = false): IDateRange {
  const date = startOfDay(refDate);
  const end = endOfDay(date);
  if(!includeToday) end.setDate(date.getDate() - 1);
  const start = new Date(date.getFullYear(), 0, 1);
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}
