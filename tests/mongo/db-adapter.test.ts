import { MongoMemoryServer } from "mongodb-memory-server";
import { Db, MongoClient } from "mongodb";
import { MongoDbAdapter } from "../../src/mongo/index";

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
    const result = await adapter.getObjectsPaginated(
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
    expect(summary.data.yes).toBe(2);
    expect(summary.data.no).toBe(1);
    expect(summary.totalCount).toBe(3);
  });
});
