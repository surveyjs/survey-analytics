export function createPipeline(surveyId: string, questionId: string, visualizerType: string, questionType: string): any[] {
  const [pivotValueName, pivotSeriesName] = (questionId || "").split("|");
  const singleChoicePipeline = [
    { $match: { postid: surveyId } },
    { $project: { value: "$json." + questionId } },
    { $match: { value: { $exists: true } } },
    {
      $group: {
        _id: "$value",
        count: { $sum: 1 },
      }
    },
    { $sort: { _id: 1 } }
  ];
  const multipleChoicePipeline = [
    { $match: { postid: surveyId } },
    { $project: { value: "$json." + questionId } },
    { $match: { value: { $exists: true } } },
    { $unwind: "$value" },
    {
      $group: {
        _id: "$value",
        count: { $sum: 1 },
      }
    },
    { $sort: { _id: 1 } }
  ];
  const numberPipeline = [
    { $match: { postid: surveyId } },
    { $project: { value: "$json." + questionId } },
    { $match: { value: { $exists: true } } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        average: { $avg: "$value" },
        min: { $min: "$value" },
        max: { $max: "$value" },
        values: { $push: "$value" }
      }
    }
  ];
  const histogramPipeline = [
    { $match: { postid: surveyId } },
    { $project: { value: "$json." + questionId } },
    { $match: { value: { $exists: true } } },
    {
      $bucketAuto: {
        groupBy: "$value",
        buckets: 10,
        output: {
          count: { $sum: 1 },
          minValue: { $min: "$value" },
          maxValue: { $max: "$value" }
        }
      }
    },
    {
      $project: {
        _id: 0,
        start: "$minValue",
        end: "$maxValue",
        label: {
          $concat: [
            { $toString: { $round: ["$minValue", 2] } },
            " - ",
            { $toString: { $round: ["$maxValue", 2] } }
          ]
        },
        count: 1
      }
    },
    { $sort: { start: 1, end: 1 } }
  ];
  const matrixPipeline = [
    { $match: { postid: surveyId } },
    { $project: { value: "$json." + questionId } },
    { $match: { value: { $exists: true } } },
    { $project: { pairs: { $objectToArray: "$value" } } },
    { $unwind: "$pairs" },
    {
      $group: {
        _id: { series: "$pairs.k", value: "$pairs.v" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.series": 1, "_id.value": 1 } }
  ];
  const pivotPipeline = [
    { $match: { postid: surveyId } },
    { $project: { value: "$json." + pivotValueName, series: "$json." + pivotSeriesName } },
    { $match: { value: { $exists: true }, series: { $exists: true } } },
    {
      $group: {
        _id: { series: "$series", value: "$value" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.series": 1, "_id.value": 1 } }
  ];
  const wordcloudPipeline = [
    { $match: { postid: surveyId } },
    { $project: { value: "$json." + questionId } },
    { $match: { value: { $exists: true } } },
    { $project: { words: { $split: [{ $toLower: "$value" }, " "] } } },
    { $unwind: "$words" },
    { $match: { words: { $ne: "" } } },
    {
      $group: {
        _id: "$words",
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ];
  const mongoPipelines = {
    "boolean": singleChoicePipeline,
    "radiogroup": singleChoicePipeline,
    "dropdown": singleChoicePipeline,
    "checkbox": multipleChoicePipeline,
    "tagbox": multipleChoicePipeline,
    "number": numberPipeline,
    "rating": numberPipeline,
    "histogram": histogramPipeline,
    "matrix": matrixPipeline,
    "pivot": pivotPipeline,
    "wordcloud": wordcloudPipeline
  };
  const pipeline = mongoPipelines[visualizerType] || mongoPipelines[questionType] || [];
  return pipeline;
}
