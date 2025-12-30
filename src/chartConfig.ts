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

export var chartConfig: { [key: string]: IChartConfigOption } = {
  "bar": { visualizerType: "chart", chartType: "bar" },
  "vbar": { visualizerType: "chart", chartType: "vbar" },
  "stackedbar": { visualizerType: "matrix", chartType: "stackedbar" },
  "pie": { visualizerType: "chart", chartType: "pie" },
  "doughnut": { visualizerType: "chart", chartType: "doughnut" },
  "radar": { visualizerType: "chart", chartType: "radar" },
  "line": { visualizerType: "chart", chartType: "line" },
  "scatter": { visualizerType: "chart", chartType: "scatter" },
  "gauge": { visualizerType: "gauge", chartType: "gauge" },
  "bullet": { visualizerType: "gauge", chartType: "bullet" },
  "wordcloud": { visualizerType: "wordcloud" },
  "histogram": { visualizerType: "histogram" },
};