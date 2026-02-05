export interface IChartConfigOption {
  visualizerType: string;
  chartType?: string;
}

export const chartConfig: { [key: string]: IChartConfigOption } = {
  "bar": { visualizerType: "selectBase", chartType: "bar" },
  "vbar": { visualizerType: "selectBase", chartType: "vbar" },
  "pie": { visualizerType: "selectBase", chartType: "pie" },
  "doughnut": { visualizerType: "selectBase", chartType: "doughnut" },
  "line": { visualizerType: "selectBase", chartType: "line" },
  "scatter": { visualizerType: "selectBase", chartType: "scatter" },
  "radar": { visualizerType: "ranking", chartType: "radar" },
  "stackedbar": { visualizerType: "matrix", chartType: "stackedbar" },
  "gauge": { visualizerType: "average", chartType: "gauge" },
  "bullet": { visualizerType: "average", chartType: "bullet" },
  "wordcloud": { visualizerType: "wordcloud" },
  "histogram": { visualizerType: "histogram", chartType: "vbar" },
  "vistogram": { visualizerType: "histogram", chartType: "bar" },
};

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
