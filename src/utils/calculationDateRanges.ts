export interface IDateRange {
  start?: number;
  end?: number;
}

export function startOfDay(d: Date): Date {
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const date = d.getUTCDate();
  return new Date(Date.UTC(year, month, date));
}

export function endOfDay(d: Date): Date {
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const date = d.getUTCDate();
  return new Date(Date.UTC(year, month, date, 23, 59, 59, 999));
}

export function toRange(start: Date | number, end: Date | number): IDateRange {
  const startValue = start instanceof Date ? startOfDay(start).getTime() : start;
  const endValue = end instanceof Date ? endOfDay(end).getTime() : end;
  return { start: startValue, end: endValue };
}

/** Last 7 days (excl. today): refDate minus 7 days through yesterday */
export function getLast7Days(refDate = new Date()): IDateRange {
  const end = endOfDay(refDate);
  end.setUTCDate(refDate.getUTCDate() - 1);
  const start = startOfDay(end);
  start.setUTCDate(end.getUTCDate() - 6);
  return toRange(start, end);
}

/** Last 14 days (excl. today): refDate minus 14 days through yesterday */
export function getLast14Days(refDate = new Date()): IDateRange {
  const end = endOfDay(refDate);
  end.setUTCDate(refDate.getUTCDate() - 1);
  const start = startOfDay(end);
  start.setUTCDate(end.getUTCDate() - 13);
  return toRange(start, end);
}

/** Last 28 days (excl. today): refDate minus 28 days through yesterday */
export function getLast28Days(refDate = new Date()): IDateRange {
  const end = endOfDay(refDate);
  end.setUTCDate(refDate.getUTCDate() - 1);
  const start = startOfDay(end);
  start.setUTCDate(end.getUTCDate() - 27);
  return toRange(start, end);
}

/** Last 30 days (excl. today): refDate minus 30 days through yesterday */
export function getLast30Days(refDate = new Date()): IDateRange {
  const end = endOfDay(refDate);
  end.setUTCDate(refDate.getUTCDate() - 1);
  const start = startOfDay(end);
  start.setUTCDate(end.getUTCDate() - 29);
  return toRange(start, end);
}

/** Last week (Monday-Sunday): previous Monday through previous Sunday */
export function getLastWeekMon(refDate = new Date()): IDateRange {
  const d = startOfDay(refDate);
  const day = d.getUTCDay();
  const daysToMonday = day === 0 ? 6 : day - 1;
  const thisMonday = startOfDay(d);
  thisMonday.setUTCDate(d.getUTCDate() - daysToMonday);
  const lastMonday = startOfDay(thisMonday);
  lastMonday.setUTCDate(thisMonday.getUTCDate() - 7);
  const lastSunday = startOfDay(lastMonday);
  lastSunday.setUTCDate(lastMonday.getUTCDate() + 6);
  return toRange(lastMonday, lastSunday);
}

/** Last week (Sunday-Saturday): previous Sunday through previous Saturday */
export function getLastWeekSun(refDate = new Date()): IDateRange {
  const d = startOfDay(refDate);
  const daysToSunday = d.getUTCDay();
  const thisSunday = startOfDay(d);
  thisSunday.setUTCDate(d.getUTCDate() - daysToSunday);
  const lastSunday = startOfDay(thisSunday);
  lastSunday.setUTCDate(thisSunday.getUTCDate() - 7);
  const lastSaturday = startOfDay(lastSunday);
  lastSaturday.setUTCDate(lastSunday.getUTCDate() + 6);
  return toRange(lastSunday, lastSaturday);
}

/** Last month: first day through last day of previous month */
export function getLastMonth(refDate = new Date()): IDateRange {
  const date = startOfDay(refDate);
  const end = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 0));
  const start = new Date(Date.UTC(date.getFullYear(), date.getMonth() - 1, 1));
  return toRange(start, end);
}

/** Last quarter: first day through last day of previous quarter */
export function getLastQuarter(refDate = new Date()): IDateRange {
  const date = startOfDay(refDate);
  const q = Math.floor(date.getUTCMonth() / 3) + 1;
  const lastQ = q === 1 ? 4 : q - 1;
  const year = lastQ === 4 ? date.getUTCFullYear() - 1 : date.getUTCFullYear();
  const start = new Date(Date.UTC(year, (lastQ - 1) * 3, 1));
  const end = new Date(Date.UTC(year, lastQ * 3, 0));
  return toRange(start, end);
}

/** Last year: January 1 through December 31 of previous year */
export function getLastYear(refDate = new Date()): IDateRange {
  const date = startOfDay(refDate);
  const start = new Date(Date.UTC(date.getFullYear() - 1, 0, 1));
  const end = new Date(Date.UTC(date.getFullYear() - 1, 11, 31));
  return toRange(start, end);
}

/** This week to date (starts Sunday): Sunday through yesterday or today */
export function getThisWeekToDateSun(refDate = new Date(), includeToday = false): IDateRange {
  const ref = startOfDay(refDate);
  const end = endOfDay(ref);
  if(!includeToday) end.setUTCDate(ref.getUTCDate() - 1);
  const start = startOfDay(ref);
  start.setUTCDate(ref.getUTCDate() - ref.getUTCDay());
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/** This week to date (starts Monday): Monday through yesterday or today */
export function getThisWeekToDateMon(refDate = new Date(), includeToday = false): IDateRange {
  const ref = startOfDay(refDate);
  const end = endOfDay(ref);
  if(!includeToday) end.setUTCDate(ref.getUTCDate() - 1);
  const start = startOfDay(ref);
  const day = ref.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  start.setUTCDate(ref.getUTCDate() - diff);
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/** This month to date: first day of month through yesterday or today */
export function getThisMonthToDate(refDate = new Date(), includeToday = false): IDateRange {
  const date = startOfDay(refDate);
  const end = endOfDay(date);
  if(!includeToday) end.setUTCDate(date.getUTCDate() - 1);
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/** This quarter to date: first day of quarter through yesterday or today */
export function getThisQuarterToDate(refDate = new Date(), includeToday = false): IDateRange {
  const date = startOfDay(refDate);
  const end = endOfDay(date);
  if(!includeToday) end.setUTCDate(date.getUTCDate() - 1);
  const q = Math.floor(date.getUTCMonth() / 3) + 1;
  const start = new Date(Date.UTC(date.getUTCFullYear(), (q - 1) * 3, 1));
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/** This year to date: January 1 through yesterday or today */
export function getThisYearToDate(refDate = new Date(), includeToday = false): IDateRange {
  const date = startOfDay(refDate);
  const end = endOfDay(date);
  if(!includeToday) end.setUTCDate(date.getUTCDate() - 1);
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}
