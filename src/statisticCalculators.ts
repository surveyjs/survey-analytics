import { DataProvider } from "./dataProvider";
import { ICalculatedDataInfo, ICalculationResult, IDataInfo } from "./visualizerBase";

export function defaultStatisticsCalculator(data: Array<any>, dataInfo: IDataInfo): ICalculationResult {
  const dataNames = dataInfo.dataNames;
  const statistics: Array<Array<Array<number>>> = [];

  const values = dataInfo.getValues();
  const valuesIndex: { [index: string]: number } = {};
  values.forEach((val: any, index: number) => {
    valuesIndex[val] = index;
  });
  const processMissingAnswers = values.indexOf(undefined) !== -1;

  const series = dataInfo.getSeriesValues();
  const seriesIndex: { [index: string]: number } = {};
  series.forEach((val: any, index: number) => {
    seriesIndex[val] = index;
  });

  const seriesLength = series.length || 1;
  for (var i = 0; i < dataNames.length; ++i) {
    const dataNameStatistics = new Array<Array<number>>();
    for (var j = 0; j < seriesLength; ++j) {
      dataNameStatistics.push(new Array<number>(values.length).fill(0));
    }
    statistics.push(dataNameStatistics);
  }
  const getValueIndex = (val) => {
    if(val !== null && typeof val === "object") return valuesIndex[val.value];
    return valuesIndex[val];
  };

  data.forEach((row: any) => {
    dataNames.forEach((dataName, index) => {
      const rowValue: any = row[dataName];
      if (rowValue !== undefined || processMissingAnswers) {
        const rowValues = Array.isArray(rowValue) ? rowValue : [rowValue];
        if (series.length > 0) {
          const rowName = row[DataProvider.seriesMarkerKey];
          if (rowName !== undefined) {
            // Series are labelled by seriesMarkerKey in row data
            const seriesNo = seriesIndex[rowName] || 0;
            rowValues.forEach((val) => {
              const valIndex = getValueIndex(val);
              statistics[index][seriesNo][valIndex]++;
            });
          } else {
            // Series are the keys in question value (matrix question)
            // TODO: think about the de-normalization and combine with the previous case
            rowValues.forEach((val) => {
              series.forEach((seriesName) => {
                if (val[seriesName] !== undefined) {
                  const seriesNo = seriesIndex[seriesName] || 0;
                  const values = Array.isArray(val[seriesName]) ? val[seriesName] : [val[seriesName]];
                  values.forEach(value => {
                    const valIndex = getValueIndex(value);
                    statistics[index][seriesNo][valIndex]++;
                  });
                }
              });
            });
          }
        } else {
          rowValues.forEach((val) => {
            const valIndex = getValueIndex(val);
            statistics[0][0][valIndex]++;
          });
        }
      }
    });
  });

  return {
    data: dataInfo.dataNames.length > 1 ? statistics as any : statistics[0],
    values,
    series
  };
}

export function histogramStatisticsCalculator(data: any, intervals: Array<{start: number | Date, end: number | Date, label: string}>, seriesValues: Array<string>): ICalculationResult {
  const statistics: Array<Array<number>> = [];
  if (seriesValues.length === 0) {
    seriesValues.push("");
  }
  for (var i = 0; i < seriesValues.length; ++i) {
    statistics.push(intervals.map(i => 0));
    data[seriesValues[i]].forEach(dataValue => {
      for (let j = 0; j < intervals.length; ++j) {
        if (intervals[j].start <= dataValue && (dataValue < intervals[j].end || j == intervals.length - 1)) {
          statistics[i][j]++;
          break;
        }
      }
    });
  }

  const result: ICalculationResult = {
    data: statistics,
    values: intervals.map(i => i.label),
  };
  if(seriesValues.length > 1) {
    result.series = seriesValues;
  }
  return result;
}

export function mathStatisticsCalculator(data: Array<any>, dataInfo: ICalculatedDataInfo): ICalculationResult {
  let resultMin = Number.MAX_VALUE,
    resultMax = -Number.MAX_VALUE,
    resultAverage = 0;
  let actualAnswerCount = 0;

  data.forEach((rowData) => {
    if (rowData[dataInfo.valueNames[0]] !== undefined) {
      const questionValue: number = +rowData[dataInfo.valueNames[0]];
      actualAnswerCount++;
      resultAverage += questionValue;
      if (resultMin > questionValue) {
        resultMin = questionValue;
      }
      if (resultMax < questionValue) {
        resultMax = questionValue;
      }
    }
  });

  if (actualAnswerCount > 0) {
    resultAverage = resultAverage / actualAnswerCount;
  }
  resultAverage = Math.ceil(resultAverage * 100) / 100;

  return {
    data: [[resultAverage, resultMin, resultMax, data.length]],
    values: ["average", "min", "max", "count"]
  };
}
