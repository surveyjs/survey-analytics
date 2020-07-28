export interface IDataInfo {
  dataName: string;
  getValues(): Array<any>;
  getLabels(): Array<string>;
  getSeriesValues(): Array<string>;
  getSeriesLabels(): Array<string>;
}

export class DataProvider {
  public static seriesMarkerKey = "__sa_series_name";

  constructor(private _data: Array<any> = []) {}

  get data() {
    return [].concat(this._data);
  }
  set data(data: Array<any>) {
    this._data = [].concat(data);
  }

  getData(dataInfo: IDataInfo) {
    const dataName = dataInfo.dataName;
    const statistics: Array<Array<number>> = [];

    const values = dataInfo.getValues();
    const valuesIndex: { [index: string]: number } = {};
    values.forEach((val: any, index: number) => {
      valuesIndex[val] = index;
    });

    const series = dataInfo.getSeriesValues();
    const seriesIndex: { [index: string]: number } = {};
    series.forEach((val: any, index: number) => {
      seriesIndex[val] = index;
      statistics.push(new Array<number>(values.length).fill(0));
    });

    if (statistics.length === 0) {
      statistics.push(new Array<number>(values.length).fill(0));
    }

    this.data.forEach((row) => {
      const rowValue: any = row[dataName];
      if (rowValue !== undefined) {
        const rowValues = Array.isArray(rowValue) ? rowValue : [rowValue];
        if (series.length > 0) {
          if (row[DataProvider.seriesMarkerKey] !== undefined) {
            // Series are labelled by seriesMarkerKey in row data
            const seriesNo =
              seriesIndex[row[DataProvider.seriesMarkerKey]] || 0;
            rowValues.forEach((val) => {
              statistics[seriesNo][valuesIndex[val]]++;
            });
          } else {
            // Series are the keys in question value (matrix question)
            // TODO: think about the de-normalization and combine with the previous case
            rowValues.forEach((val) => {
              series.forEach((seriesName) => {
                if (val[seriesName] !== undefined) {
                  const seriesNo = seriesIndex[seriesName] || 0;
                  statistics[seriesNo][valuesIndex[val[seriesName]]]++;
                }
              });
            });
          }
        } else {
          // No series
          rowValues.forEach((val) => statistics[0][valuesIndex[val]]++);
        }
      }
    });
    return statistics;
  }
}
