export type SeriesAggregation = "count" | "sum" | "average";

export interface IAxisDescription {
  dataName: string;
  valueName?: string;
  aggregation?: SeriesAggregation; // "count"
}
