export function createPipeline(surveyId: string, questionId: string, visualizerType: string, questionType: string): any[] {
  const singleChoicePipeline = [
    { $match: { postid: surveyId } },
    { $project: { value: "$json." + questionId } },
    { $match: { value: { $exists: true } } },
    {
      $group: {
        _id: "$value",
        count: { $sum: 1 },
      }
    }
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
    }
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
    }
  ];
  const mongoPipelines = {
    "boolean": singleChoicePipeline,
    "radiogroup": singleChoicePipeline,
    "dropdown": singleChoicePipeline,
    "checkbox": multipleChoicePipeline,
    "tagbox": multipleChoicePipeline,
    "number": numberPipeline,
    "rating": numberPipeline,
    "histogram": histogramPipeline
  };
  const pipeline = mongoPipelines[visualizerType] || mongoPipelines[questionType] || [];
  return pipeline;
}
