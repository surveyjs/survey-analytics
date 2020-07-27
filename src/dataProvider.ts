export interface IDataInfo {
    dataName: string;
    getValues(): Array<any>;
    getLabels(): Array<string>;
    getSeriesNames(): Array<string>;
    getSeriesTitles(): Array<string>;
}

export class DataProvider {
    constructor(private _data: Array<any> = []) {

    }

    get data() {
        return [].concat(this._data);
    }
    set data(data: Array<any>) {
        this._data = [].concat(data);
    }

    getData(dataInfo: IDataInfo) {
        const dataName = dataInfo.dataName;
        const values = dataInfo.getValues();
        const statistics = values.map(v => 0);
        const valueHashes: {[index: string]: number} = {}
        values.forEach((val: any, index: number) => {
            valueHashes[val] = index;
        });

        this.data.forEach(row => {
          const rowValue: any = row[dataName];
          if (rowValue !== undefined) {
            const rowValues = Array.isArray(rowValue) ? rowValue : [rowValue];
            rowValues.forEach(val => statistics[valueHashes[val]]++);
          }
        });
        return [statistics];
    }
}