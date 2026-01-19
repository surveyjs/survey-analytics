interface IChartConfigOption {
  visualizerType: string;
  chartType?: string;
}

export function getVisualizerTypes(chartKeys: Array<string>): Array<string> {
  if(!chartKeys) return chartKeys;

  const result = [];
  chartKeys.forEach(type => {
    const visualizerType = chartConfig[type]?.visualizerType || type;
    if(result.indexOf(visualizerType) === -1) {
      result.push(visualizerType);
    }
  });
  return result;
}

export function getChartTypes(chartKeys: Array<string>): any {
  const result = {};
  if(!chartKeys) return result;

  chartKeys.forEach(key => {
    const chartType = chartConfig[key]?.chartType;
    if(chartType) {
      const visualizerType = chartConfig[key]?.visualizerType || key;
      let chartTypes = result[visualizerType];
      if(chartTypes === undefined) {
        chartTypes = [];
        result[visualizerType] = chartTypes;
      }
      chartTypes.push(chartType);
    }
  });
  return result;
}

export function getVisualizerNameByType(visualizerType: string, chartTypes: Array<string>) {
  const result = [];

  Object.keys(chartConfig).forEach(key => {
    const config = chartConfig[key];
    if(config.visualizerType === visualizerType && (!config.chartType || chartTypes.length === 0 || chartTypes.indexOf(config.chartType) !== -1)) {
      result.push(key);
    }
  });
  return result;
}

export const chartConfig: { [key: string]: IChartConfigOption } = {
  "bar": { visualizerType: "chartmodel", chartType: "bar" },
  "vbar": { visualizerType: "chartmodel", chartType: "vbar" },
  "stackedbar": { visualizerType: "matrixmodel", chartType: "stackedbar" },
  "pie": { visualizerType: "chartmodel", chartType: "pie" },
  "doughnut": { visualizerType: "chartmodel", chartType: "doughnut" },
  "radar": { visualizerType: "chartmodel", chartType: "radar" },
  "ranking": { visualizerType: "rankingmodel", chartType: "radar" },
  "line": { visualizerType: "chartmodel", chartType: "line" },
  "scatter": { visualizerType: "chartmodel", chartType: "scatter" },
  "gauge": { visualizerType: "numbermodel", chartType: "gauge" },
  "bullet": { visualizerType: "numbermodel", chartType: "bullet" },
  "wordcloud": { visualizerType: "wordcloudmodel" },
  "histogram": { visualizerType: "histogrammodel", chartType: "vbar" },
  "vistogram": { visualizerType: "histogrammodel", chartType: "bar" },
};