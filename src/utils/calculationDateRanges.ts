export interface IDateRange {
  start?: number;
  end?: number;
}

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function endOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(23, 59, 59, 999);
  return c;
}

function toRange(start: Date, end: Date): IDateRange {
  return { start: startOfDay(start).getTime(), end: endOfDay(end).getTime() };
}

/** Last 7 days (excl. today): refDate minus 7 days through yesterday */
export function getLast7Days(refDate = new Date()): IDateRange {
  const end = new Date(refDate);
  end.setDate(refDate.getDate() - 1);
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  return toRange(start, end);
}

/** Last 14 days (excl. today): refDate minus 14 days through yesterday */
export function getLast14Days(refDate = new Date()): IDateRange {
  const end = new Date(refDate);
  end.setDate(refDate.getDate() - 1);
  const start = new Date(end);
  start.setDate(end.getDate() - 13);
  return toRange(start, end);
}

/** Last 28 days (excl. today): refDate minus 28 days through yesterday */
export function getLast28Days(refDate = new Date()): IDateRange {
  const end = new Date(refDate);
  end.setDate(refDate.getDate() - 1);
  const start = new Date(end);
  start.setDate(end.getDate() - 27);
  return toRange(start, end);
}

/** Last 30 days (excl. today): refDate minus 30 days through yesterday */
export function getLast30Days(refDate = new Date()): IDateRange {
  const end = new Date(refDate);
  end.setDate(refDate.getDate() - 1);
  const start = new Date(end);
  start.setDate(end.getDate() - 29);
  return toRange(start, end);
}

/** Last week (Monday-Sunday): previous Monday through previous Sunday */
export function getLastWeekMon(refDate = new Date()): IDateRange {
  const d = new Date(refDate);
  const day = d.getDay();
  const daysToMonday = day === 0 ? 6 : day - 1;
  const thisMonday = new Date(d);
  thisMonday.setDate(d.getDate() - daysToMonday);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);
  const lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastMonday.getDate() + 6);
  return toRange(lastMonday, lastSunday);
}

/** Last week (Sunday-Saturday): previous Sunday through previous Saturday */
export function getLastWeekSun(refDate = new Date()): IDateRange {
  const d = new Date(refDate);
  const daysToSunday = d.getDay();
  const thisSunday = new Date(d);
  thisSunday.setDate(d.getDate() - daysToSunday);
  const lastSunday = new Date(thisSunday);
  lastSunday.setDate(thisSunday.getDate() - 7);
  const lastSaturday = new Date(lastSunday);
  lastSaturday.setDate(lastSunday.getDate() + 6);
  return toRange(lastSunday, lastSaturday);
}

/** Last month: first day through last day of previous month */
export function getLastMonth(refDate = new Date()): IDateRange {
  const date = new Date(refDate);
  const end = new Date(date.getFullYear(), date.getMonth(), 0);
  const start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return toRange(start, end);
}

/** Last quarter: first day through last day of previous quarter */
export function getLastQuarter(refDate = new Date()): IDateRange {
  const date = new Date(refDate);
  const q = Math.floor(date.getMonth() / 3) + 1;
  const lastQ = q === 1 ? 4 : q - 1;
  const year = lastQ === 4 ? date.getFullYear() - 1 : date.getFullYear();
  const start = new Date(year, (lastQ - 1) * 3, 1);
  const end = new Date(year, lastQ * 3, 0);
  return toRange(start, end);
}

/** Last year: January 1 through December 31 of previous year */
export function getLastYear(refDate = new Date()): IDateRange {
  const date = new Date(refDate);
  const start = new Date(date.getFullYear() - 1, 0, 1);
  const end = new Date(date.getFullYear() - 1, 11, 31);
  return toRange(start, end);
}

/** This week to date (starts Sunday): Sunday through yesterday or today */
export function getThisWeekToDateSun(includeToday = false): IDateRange {
  const ref = new Date();
  const end = new Date(ref);
  if(!includeToday) end.setDate(ref.getDate() - 1);
  const start = new Date(ref);
  start.setDate(ref.getDate() - ref.getDay());
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/** This week to date (starts Monday): Monday through yesterday or today */
export function getThisWeekToDateMon(refDate = new Date(), includeToday = false): IDateRange {
  const ref = new Date(refDate);
  const end = new Date(ref);
  if(!includeToday) end.setDate(ref.getDate() - 1);
  const start = new Date(ref);
  const day = ref.getDay();
  const diff = day === 0 ? 6 : day - 1;
  start.setDate(ref.getDate() - diff);
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/** This month to date: first day of month through yesterday or today */
export function getThisMonthToDate(refDate = new Date(), includeToday = false): IDateRange {
  const date = new Date(refDate);
  const end = new Date(date);
  if(!includeToday) end.setDate(date.getDate() - 1);
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/** This quarter to date: first day of quarter through yesterday or today */
export function getThisQuarterToDate(refDate = new Date(), includeToday = false): IDateRange {
  const date = new Date(refDate);
  const end = new Date(date);
  if(!includeToday) end.setDate(date.getDate() - 1);
  const q = Math.floor(date.getMonth() / 3) + 1;
  const start = new Date(date.getFullYear(), (q - 1) * 3, 1);
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}

/** This year to date: January 1 through yesterday or today */
export function getThisYearToDate(refDate = new Date(), includeToday = false): IDateRange {
  const date = new Date(refDate);
  const end = new Date(date);
  if(!includeToday) end.setDate(date.getDate() - 1);
  const start = new Date(date.getFullYear(), 0, 1);
  return toRange(start.getTime() <= end.getTime() ? start : end, end);
}
