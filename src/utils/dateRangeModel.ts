import { IDateRange, getLast7Days, getLast14Days, getLast28Days, getLast30Days, getLastMonth, getLastQuarter, getLastWeekMon, getLastWeekSun, getLastYear, getThisMonthToDate, getThisQuarterToDate, getThisWeekToDateMon, getThisWeekToDateSun, getThisYearToDate, toRange } from "./calculationDateRanges";

export type DatePeriodEnum = "last7days" | "last14days" | "last28days" | "last30days" | "lastWeekMon" | "lastWeekSun" | "lastMonth" | "lastQuarter" | "lastYear" | "ytd" | "mtd" | "wtdSun" | "wtdMon" | "qtd";
export type DateRangeTuple = [startDate: Date | number, endDate: Date | number];

export const datePeriodsFunctions: Partial<Record<DatePeriodEnum, (refDate?: Date, includeToday?: boolean) => IDateRange>> = {
  last7days: getLast7Days,
  last14days: getLast14Days,
  last28days: getLast28Days,
  last30days: getLast30Days,
  lastWeekMon: getLastWeekMon,
  lastWeekSun: getLastWeekSun,
  lastMonth: getLastMonth,
  lastQuarter: getLastQuarter,
  lastYear: getLastYear,
  ytd: (refDate, includeToday?: boolean) => getThisYearToDate(refDate, includeToday),
  mtd: (refDate, includeToday?: boolean) => getThisMonthToDate(refDate, includeToday),
  wtdSun: (refDate, includeToday?: boolean) => getThisWeekToDateSun(refDate, includeToday),
  wtdMon: (refDate, includeToday?: boolean) => getThisWeekToDateMon(refDate, includeToday),
  qtd: (refDate, includeToday?: boolean) => getThisQuarterToDate(refDate, includeToday)
};

export interface IDateRangeChangedOptions {
  datePeriod?: DatePeriodEnum;
  dateRange?: DateRangeTuple;
}
export interface IDateRangeModelOptions {
  onDateRangeChanged: (dateRange: IDateRange, datePeriod: DatePeriodEnum) => void;
  datePeriod?: DatePeriodEnum;
  availableDatePeriods?: Array<DatePeriodEnum>;
  dateRange?: DateRangeTuple;
  includeToday?: boolean;
}

export class DateRangeModel {
  private _currentDatePeriod: DatePeriodEnum;
  private _currentDateRange: IDateRange = { start: undefined, end: undefined };
  private _availableDatePeriods: Array<DatePeriodEnum>;
  private _onDateRangeChanged: (dateRange: IDateRange, datePeriod: DatePeriodEnum) => void;
  private _includeToday: boolean;

  constructor(options: IDateRangeModelOptions) {
    if(options.datePeriod) {
      this._currentDatePeriod = options.datePeriod;
      this._currentDateRange = datePeriodsFunctions[this._currentDatePeriod]?.(undefined, this._includeToday);
    } else if(options.dateRange) {
      this._currentDateRange = toRange(options.dateRange[0], options.dateRange[1]);
    }
    this._availableDatePeriods = options.availableDatePeriods ?? Object.keys(datePeriodsFunctions) as Array<DatePeriodEnum>;
    this._onDateRangeChanged = options.onDateRangeChanged;
    this._includeToday = options.includeToday;
  }

  get currentDatePeriod(): DatePeriodEnum {
    return this._currentDatePeriod;
  }

  get currentDateRange(): IDateRange {
    return { ...this._currentDateRange };
  }

  get availableDatePeriods(): Array<DatePeriodEnum> {
    return [...this._availableDatePeriods];
  }

  setDatePeriod(datePeriod: DatePeriodEnum | undefined): void {
    this._currentDatePeriod = datePeriod;
    if(datePeriod == undefined) {
      this.setFilter(undefined, undefined);
      return;
    }
    const range = datePeriodsFunctions[datePeriod]?.(undefined, this._includeToday);
    if(range) {
      this.setFilter(range.start, range.end);
    }
  }

  setFilter(start: number, end: number, isCustom?: boolean): void {
    this._currentDateRange = {
      start: !!start ? (new Date(start)).getTime() : undefined,
      end: !!end ? (new Date(end)).getTime() : undefined
    };
    if(isCustom) {
      this._currentDatePeriod = undefined;
    }
    if(!!this._onDateRangeChanged) {
      this._onDateRangeChanged({ ...this._currentDateRange }, this._currentDatePeriod);
    }
  }
}
