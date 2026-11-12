import { createObjectByPath, getValueByPath } from "../src/utils/dataPath";
import { DataProvider } from "../src/dataProvider";

describe("data path helpers do not reach Object.prototype (nested data, survey-library #12233)", () => {
  afterEach(() => {
    delete (Object.prototype as any).polluted;
  });

  test("getValueByPath reads own keys only", () => {
    expect(getValueByPath({}, ["constructor"])).toBeUndefined();
    expect(getValueByPath({}, ["__proto__"])).toBeUndefined();
    expect(getValueByPath({}, ["constructor", "prototype"])).toBeUndefined();
    expect(getValueByPath({ constructor: 1 }, ["constructor"])).toBe(1);
    expect(getValueByPath({ a: { b: 2 } }, ["a", "b"])).toBe(2);
    expect(getValueByPath(JSON.parse("{ \"__proto__\": { \"a\": 3 } }"), ["__proto__", "a"])).toBe(3);
  });

  test("createObjectByPath does not write through __proto__ or inherited keys", () => {
    const res = createObjectByPath(["__proto__", "polluted"], "yes");
    expect(({} as any).polluted).toBeUndefined();
    expect(Object.keys(res)).toEqual([]);
    createObjectByPath(["constructor", "prototype", "polluted"], "yes");
    expect(({} as any).polluted).toBeUndefined();
    expect(createObjectByPath(["constructor", "a"], 1)).toEqual({ constructor: { a: 1 } });
    expect(createObjectByPath(["a", "b"], 1)).toEqual({ a: { b: 1 } });
  });

  test("fixDropdownData does not replace a value through __proto__ or inherited keys", () => {
    const row: any = { m: { r1: { c1: 1 } } };
    const dataProvider = new DataProvider([row]);
    dataProvider.fixDropdownData(["m"], ["__proto__", "m"]);
    dataProvider.fixDropdownData(["m"], ["__proto__"]);
    dataProvider.fixDropdownData(["m"], ["constructor", "prototype"]);
    expect(Object.getPrototypeOf(row)).toBe(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(Object.prototype, "m")).toBe(false);
    dataProvider.fixDropdownData(["m"], ["m"]);
    expect(row.m).toEqual([{ c1: 1, [DataProvider.seriesMarkerKey]: "r1" }]);
  });
});
