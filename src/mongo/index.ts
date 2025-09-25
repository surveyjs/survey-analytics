import { Db } from "mongodb";
import { transformers } from "./result-transformers";
import { createPipeline } from "./pipelines";

export interface IFilterItem { field: string, value: any }

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

  retrieve(collectionName: string, filter: Array<IFilterItem>) {
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

  retrievePaginated(collectionName: string, filter, order, offset: number, limit: number) {
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

  retrieveSummary(collectionName: string, surveyId: string, questionId: string, questionType: string, visualizerType: string, filter: Array<IFilterItem>) {
    const pipeline = createPipeline(surveyId, questionId, visualizerType, questionType);
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

