function choiceTransformationPipeline(result: Array<{ _id: any, count: number }>) {
  const values: string[] = [];
  const counts: number[] = [];
  result.forEach(item => {
    values.push(item._id?.toString());
    counts.push(item.count);
  });
  return {
    data: [counts],
    values: values
  };
}
function numberTransformationPipeline(result: Array<{ average: number, min: number, max: number, count: number }>) {
  if(result.length == 0) {
    return {
      data: [[0, 0, 0, 0]],
      values: ["average", "min", "max", "count"]
    };
  }
  return {
    data: [[result[0].average, result[0].min, result[0].max, result[0].count]],
    values: ["average", "min", "max", "count"]
  };
}
function histogramTransformationPipeline(result: Array<{ count: number, label: string }>) {
  const res: number[] = [];
  const values: string[] = [];
  result.forEach(item => {
    res.push(item.count);
    values.push(item.label);
  });
  return {
    data: [res],
    values: values
  };
}

function groupedTransformationPipeline(result: Array<{ _id: { series: any, value: any }, count: number }>) {
  const series: string[] = [];
  const values: string[] = [];
  const countsMap = {};

  result.forEach(item => {
    const seriesValue = item && item._id ? item._id.series : undefined;
    const value = item && item._id ? item._id.value : undefined;
    const seriesKey = String(seriesValue);
    const valueKey = String(value);
    if(series.indexOf(seriesKey) === -1) {
      series.push(seriesKey);
    }
    if(values.indexOf(valueKey) === -1) {
      values.push(valueKey);
    }
    countsMap[seriesKey + "::" + valueKey] = item.count;
  });

  return {
    data: series.map(seriesKey => values.map(valueKey => countsMap[seriesKey + "::" + valueKey] || 0)),
    values,
    series
  };
}

export const transformers = {
  "boolean": choiceTransformationPipeline,
  "radiogroup": choiceTransformationPipeline,
  "dropdown": choiceTransformationPipeline,
  "checkbox": choiceTransformationPipeline,
  "tagbox": choiceTransformationPipeline,
  "number": numberTransformationPipeline,
  "rating": numberTransformationPipeline,
  "histogram": histogramTransformationPipeline,
  "matrix": groupedTransformationPipeline,
  "pivot": groupedTransformationPipeline,
  "wordcloud": choiceTransformationPipeline
};
