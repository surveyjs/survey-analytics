function choiceTransformationPipeline(result) {
  let res = {};
  let totalCount = 0;
  result.forEach(item => {
    res[item._id] = item.count;
    totalCount += item.count;
  });
  return { data: res, totalCount: totalCount };
}
function numberTransformationPipeline(result) {
  if(result.length == 0) return { value: 0, minValue: 0, maxValue: 0 };
  return { data: { value: result[0].average, minValue: result[0].min, maxValue: result[0].max } };
}
function histogramTransformationPipeline(result) {
  let res = [];
  let totalCount = 0;
  result.forEach(item => {
    res.push(item.count);
    totalCount += item.count;
  });
  return { data: res, intervals: result, totalCount: totalCount };
}

export const transformers = {
  "boolean": choiceTransformationPipeline,
  "radiogroup": choiceTransformationPipeline,
  "dropdown": choiceTransformationPipeline,
  "checkbox": choiceTransformationPipeline,
  "tagbox": choiceTransformationPipeline,
  "number": numberTransformationPipeline,
  "rating": numberTransformationPipeline,
  "histogram": histogramTransformationPipeline
};
