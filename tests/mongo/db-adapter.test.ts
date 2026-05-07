import { MongoMemoryServer } from "mongodb-memory-server";
import { Db, MongoClient } from "mongodb";
import { QuestionBooleanModel, QuestionCommentModel, QuestionDropdownModel, QuestionMatrixModel, SurveyModel } from "survey-core";
import { MongoDbAdapter } from "../../src/mongo/index";
import { createPipeline } from "../../src/mongo/pipelines";
import { transformers } from "../../src/mongo/result-transformers";

function mapToExpectedOrder(
  transformed: { data: Array<Array<number>>, values: Array<any>, series?: Array<any> },
  expected: { data: Array<Array<number>>, values: Array<any>, series?: Array<any> }
) {
  const transformedSeries = Array.isArray(transformed.series) && transformed.series.length > 0 ? transformed.series : [""];
  const expectedSeries = Array.isArray(expected.series) && expected.series.length > 0 ? expected.series : [""];

  const summary: any = {
    data: expectedSeries.map(seriesValue => {
      const transformedSeriesIndex = transformedSeries.findIndex(v => String(v) === String(seriesValue));
      return expected.values.map(value => {
        const transformedValueIndex = transformed.values.findIndex(v => String(v) === String(value));
        if(transformedSeriesIndex < 0 || transformedValueIndex < 0) return 0;
        return transformed.data[transformedSeriesIndex]?.[transformedValueIndex] || 0;
      });
    }),
    values: expected.values
  };

  if(expected.series !== undefined) {
    summary.series = expected.series;
  }

  return summary;
}

function ensureWindowForVisualizerImports(): void {
  if(!(global as any).window) {
    (global as any).window = { URL: { createObjectURL: () => "" } };
  } else if(!(global as any).window.URL) {
    (global as any).window.URL = { createObjectURL: () => "" };
  } else if(typeof (global as any).window.URL.createObjectURL !== "function") {
    (global as any).window.URL.createObjectURL = () => "";
  }

  if(!(global as any).document) {
    (global as any).document = {
      createElement: () => ({
        className: "",
        style: {},
        children: [],
        appendChild: () => {},
        removeChild: () => {},
        setAttribute: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        innerHTML: "",
        innerText: "",
        title: "",
        id: ""
      })
    };
  }
}

describe("MongoDbAdapter", () => {
  let mongod: MongoMemoryServer;
  let client: MongoClient;
  let db: Db;
  let adapter: MongoDbAdapter;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    client = await MongoClient.connect(uri, {});
    db = client.db("testdb");
    adapter = new MongoDbAdapter(db, () => Math.random().toString(36).substr(2, 9));
  });

  afterAll(async () => {
    await client.close();
    await mongod.stop();
  });

  afterEach(async () => {
    await db.collection("test").deleteMany({});
  });

  test("create: should insert and return id", async () => {
    const obj = { name: "test" };
    const id = await adapter.create("test", obj);
    expect(id).toBe(obj.id);
    const found = await db.collection("test").findOne({ id });
    expect(found).toBeDefined();
    expect(found.name).toBe("test");
  });

  test("retrieve: should return all matching documents", async () => {
    await db.collection("test").insertMany([
      { id: "1", name: "a", type: "x" },
      { id: "2", name: "b", type: "y" }
    ]);
    const results = await adapter.retrieve("test", [{ field: "type", value: "x" }]);
    expect(results.length).toBe(1);
    expect(results[0].name).toBe("a");
  });

  test("update: should update document by id", async () => {
    await db.collection("test").insertOne({ id: "1", name: "old" });
    const result = await adapter.update("test", { id: "1", name: "new" });
    expect(result.modifiedCount).toBe(1);
    const found = await db.collection("test").findOne({ id: "1" });
    expect(found.name).toBe("new");
  });

  test("delete: should remove documents by id", async () => {
    await db.collection("test").insertMany([{ id: "1" }, { id: "1" }, { id: "2" }]);
    const result = await adapter.delete("test", "1");
    expect(result.deletedCount).toBe(2);
    const left = await db.collection("test").find({}).toArray();
    expect(left.length).toBe(1);
    expect(left[0].id).toBe("2");
  });

  test("getObjectsPaginated: should paginate and sort results", async () => {
    await db.collection("test").insertMany([
      { id: "1", value: 1, type: "a" },
      { id: "2", value: 2, type: "a" },
      { id: "3", value: 3, type: "b" }
    ]);
    const result = await adapter.retrievePaginated(
      "test",
      [{ field: "type", value: "a" }],
      [{ field: "value", value: "desc" }],
      0,
      1
    );
    expect(result.totalCount).toBe(2);
    expect(result.data.length).toBe(1);
    expect(result.data[0].value).toBe(2);
  });

  test("retrieveSummary: should aggregate and transform results", async () => {
    // Insert documents for a single choice question
    await db.collection("test").insertMany([
      { postid: "survey1", json: { q1: "yes" } },
      { postid: "survey1", json: { q1: "no" } },
      { postid: "survey1", json: { q1: "yes" } }
    ]);
    const summary = await adapter.retrieveSummary(
      "test",
      "survey1",
      "q1",
      "radiogroup",
      "radiogroup",
      []
    );
    expect(Array.isArray(summary.data)).toBe(true);
    expect(Array.isArray(summary.values)).toBe(true);
    const yesIndex = summary.values.indexOf("yes");
    const noIndex = summary.values.indexOf("no");
    expect(yesIndex).toBeGreaterThanOrEqual(0);
    expect(noIndex).toBeGreaterThanOrEqual(0);
    expect(summary.data[0][yesIndex]).toBe(2);
    expect(summary.data[0][noIndex]).toBe(1);
  });

  test("boolean summary via mongo pipelines should match BooleanModel calculations", async () => {
    ensureWindowForVisualizerImports();
    const { BooleanModel } = await import("../../src/boolean");
    const question = new QuestionBooleanModel("q1");
    const data = [
      { q1: true },
      { q1: true },
      { q1: false },
      { q1: true }
    ];
    await db.collection("test").insertMany(data.map(row => ({ postid: "survey_bool", json: row })));

    const aggregated = await db.collection("test").aggregate(createPipeline("survey_bool", "q1", "boolean", "boolean")).toArray();
    const transformed = transformers["boolean"](aggregated);
    const expected = await new BooleanModel(question, data, {}).getCalculatedValues();
    const summary = mapToExpectedOrder(transformed, expected);
    expect(summary).toStrictEqual(expected);
    expect(transformed).toStrictEqual({
      "data": [[1, 3]],
      "values": ["false", "true"],
    });
  });

  test("selectBase summary via mongo pipelines should match non-empty SelectBase calculations", async () => {
    ensureWindowForVisualizerImports();
    const { SelectBase } = await import("../../src/selectBase");
    const question = new QuestionDropdownModel("q1");
    question.valueName = "q1value";
    question.choices = ["father", "mother", "brother", "sister", "son", "daughter"];
    const data = [
      { q1value: "father" },
      { q1value: "father" },
      { q1value: "mother" },
      { q1value: "sister" },
      {}
    ];
    await db.collection("test").insertMany(data.map(row => ({ postid: "survey_select", json: row })));

    const aggregated = await db.collection("test").aggregate(createPipeline("survey_select", "q1value", "dropdown", "dropdown")).toArray();
    const transformed = transformers["dropdown"](aggregated);
    const expected = await new SelectBase(question, data, {}).getCalculatedValues();
    const summary = mapToExpectedOrder(transformed, expected);
    expect(summary).toStrictEqual(expected);
    expect(transformed).toStrictEqual({ "data": [[2, 1, 1]], "values": ["father", "mother", "sister"] });
  });

  test("histogram summary via mongo pipeline should match HistogramModel calculations", async () => {
    ensureWindowForVisualizerImports();
    const { HistogramModel } = await import("../../src/histogram");
    const question: any = {
      getType: () => "text",
      type: "text",
      inputType: "number",
      name: "age"
    };
    const data = [
      { age: 15 }, { age: 17 }, { age: 17 },
      { age: 17 }, { age: 17 }, { age: 30 },
      { age: 30 }, { age: 40 }, { age: 40 },
      { age: 25 }, { age: 25 }, { age: 26 },
      { age: 27 }, { age: 28 }, { age: 29 },
      { age: 30 }, { age: 30 }, { age: 41 },
      { age: 42 }, { age: 43 }, { age: 44 },
      { age: 45 }, { age: 45 }, { age: 45 },
    ];
    await db.collection("test").insertMany(data.map(row => ({ postid: "survey_hist", json: row })));

    const model = new HistogramModel(question, data);
    const aggregated = await db.collection("test").aggregate(createPipeline("survey_hist", "age", "histogram", "text")).toArray();
    const transformed = transformers["histogram"](aggregated);
    const expected = await model.getCalculatedValues();
    expect(transformed.data[0].reduce((a, b) => a + b, 0)).toEqual(expected.data[0].reduce((a, b) => a + b, 0));
    expect(transformed).toStrictEqual({
      "data": [[5, 2, 2, 2, 4, 2, 2, 2, 3,]],
      "values": ["15 - 17", "25 - 25", "26 - 27", "28 - 29", "30 - 30", "40 - 40", "41 - 42", "43 - 44", "45 - 45"],
    });
  });

  test("matrix summary via mongo pipeline should match Matrix calculations", async () => {
    ensureWindowForVisualizerImports();
    const { Matrix } = await import("../../src/matrix");
    const question = new QuestionMatrixModel("question1");
    question.fromJSON({
      type: "matrix",
      name: "question1",
      columns: ["Excellent", "Very Good", "Good", "Fair", "Neither Fair Nor Poor", "Poor"],
      rows: ["Lizol", "Harpic"]
    });
    const data = [
      { question1: { Lizol: "Excellent", Harpic: "Excellent" } },
      { question1: { Lizol: "Very Good", Harpic: "Very Good" } },
      { question1: { Lizol: "Very Good", Harpic: "Good" } }
    ];
    await db.collection("test").insertMany(data.map(row => ({ postid: "survey_matrix", json: row })));

    const model = new Matrix(question, data, {});
    const aggregated = await db.collection("test").aggregate(createPipeline("survey_matrix", "question1", "matrix", "matrix")).toArray();
    const transformed = transformers["matrix"](aggregated);
    const expected = await model.getCalculatedValues();
    const summary = mapToExpectedOrder(transformed, expected);
    expect(summary).toStrictEqual(expected);
    expect(transformed).toStrictEqual({ "data": [[1, 1, 1], [1, 0, 2]], "series": ["Harpic", "Lizol"], "values": ["Excellent", "Good", "Very Good"] });
  });

  test("pivot summary via mongo pipeline should match PivotModel calculations", async () => {
    ensureWindowForVisualizerImports();
    const { PivotModel } = await import("../../src/pivot");
    const survey = new SurveyModel({
      elements: [
        { type: "radiogroup", name: "question1", choices: ["female", "male"] },
        { type: "dropdown", name: "question2", choices: ["Item 1", "Item 2", "Item 3"] },
        { type: "text", inputType: "number", name: "question3" }
      ]
    });
    const data = [
      { question1: "male", question2: "Item 1", question3: 100 },
      { question1: "male", question2: "Item 1", question3: 200 },
      { question1: "male", question2: "Item 2", question3: 300 },
      { question1: "male", question2: "Item 3", question3: 400 },
      { question1: "female", question2: "Item 2", question3: 500 },
      { question1: "female", question2: "Item 2", question3: 600 },
      { question1: "female", question2: "Item 2", question3: 100 },
      { question1: "female", question2: "Item 3", question3: 200 },
      { question1: "female", question2: "Item 3", question3: 300 },
      { question1: "female", question2: "Item 3", question3: 400 },
      { question1: "female", question2: "Item 3", question3: 150 },
      { question1: "female", question2: "Item 1", question3: 250 }
    ];
    await db.collection("test").insertMany(data.map(row => ({ postid: "survey_pivot", json: row })));

    const model = new PivotModel(survey.getAllQuestions(), data);
    model.setAxisQuestions("question1", "question2");
    const aggregated = await db.collection("test").aggregate(createPipeline("survey_pivot", "question1|question2", "pivot", "pivot")).toArray();
    const transformed = transformers["pivot"](aggregated);
    const expected = await model.getCalculatedValues();
    const summary = mapToExpectedOrder(transformed, expected);
    expect(summary).toStrictEqual(expected);
    expect(transformed).toStrictEqual({
      "data": [[1, 2], [3, 1], [4, 1]],
      "series": ["Item 1", "Item 2", "Item 3"],
      "values": ["female", "male"],
    });
  });

  test("wordcloud summary via mongo pipeline should match WordCloud calculations", async () => {
    ensureWindowForVisualizerImports();
    const { WordCloud } = await import("../../src/wordcloud/wordcloud");
    const question = new QuestionCommentModel("q1");
    const data = [
      // eslint-disable-next-line surveyjs/eslint-plugin-i18n/only-english-or-code
      { q1: "Großmutter string one1" },
      // eslint-disable-next-line surveyjs/eslint-plugin-i18n/only-english-or-code
      { q1: "Großmutter string two2" }
    ];
    await db.collection("test").insertMany(data.map(row => ({ postid: "survey_wordcloud", json: row })));

    const model = new WordCloud(question, data);
    const aggregated = await db.collection("test").aggregate(createPipeline("survey_wordcloud", "q1", "wordcloud", "wordcloud")).toArray();
    const transformed = transformers["wordcloud"](aggregated);
    const expected = await model.getCalculatedValues();
    const summary = mapToExpectedOrder(transformed, expected);
    expect(summary).toStrictEqual(expected);
    expect(transformed).toStrictEqual({
      "data": [[2, 1, 2, 1]],
      // eslint-disable-next-line surveyjs/eslint-plugin-i18n/only-english-or-code
      "values": ["großmutter", "one1", "string", "two2"],
    });
  });
});
