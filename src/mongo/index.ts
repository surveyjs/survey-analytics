import { Db } from "mongodb";

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
  if (result.length == 0) return { value: 0, minValue: 0, maxValue: 0 };
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

export class MongoDbAdapter {
  constructor(private db: Db, private getId: () => string) {
  }

  create(collectionName: string, object) {
    object.id = object.id || this.getId();
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).insertOne(object)
        .then((results) => {
          resolve(object.id);
        })
        .catch((e) => {
          reject(JSON.stringify(e));
        });
    });
  }

  retrieve(collectionName: string, filter) {
    filter = filter || [];
    const query = {};
    filter.forEach(fi => query[fi.field] = fi.value);
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).find(query).toArray()
        .then((results) => {
          resolve(results);
        })
        .catch((e) => {
          reject(JSON.stringify(e));
        });
    });
  }

  update(collectionName: string, object) {
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).updateOne({ id: object.id }, { $set: object })
        .then((results) => {
          resolve(results);
        })
        .catch((e) => {
          reject(JSON.stringify(e));
        });
    });
  }

  delete(collectionName: string, id) {
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).deleteMany({ id: id })
        .then((results) => {
          resolve(results);
        })
        .catch((e) => {
          reject(JSON.stringify(e));
        });
    });
  }

  getObjectsPaginated(collectionName: string, filter, order, offset: number, limit: number) {
    filter = filter || [];
    let query = {};
    filter.forEach(fi => {
      if (!!fi.value) {
        let val = fi.value;
        query[fi.field] = val;
      }
    });
    let sort = {};
    order.forEach(fi => {
      sort[fi.field] = fi.value == "desc" ? -1 : 1;
    });
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).count(query).then(count => {
        this.db.collection(collectionName).find(query).sort(sort).skip(offset).limit(limit).toArray()
          .then((results) => {
            const result = { data: results, totalCount: count };
            resolve(result);
          })
          .catch((e) => {
            reject(JSON.stringify(e));
          });
      });
    });
  }

  retrieveSummary(collectionName: string, surveyId: string, questionId: string, questionType: string, visualizerType: string, filter) {
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
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).aggregate(pipeline).toArray()
        .then((results) => {
          const transformer = transformers[visualizerType] || transformers[questionType] || (r => r);
          const result = transformer(results);
          resolve(result);
        })
        .catch((e) => {
          reject(JSON.stringify(e));
        });
    });
  }
}
