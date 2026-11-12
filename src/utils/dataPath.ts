// Nested data (survey-library #12233): a survey with valueName / dataNesting on its panels and pages stores an inner
// question's answer in nested objects ({ address: { street } }). Survey-core gives each question its data path
// (question.getDataPath()), and the dashboard reads every answer through it.

// A row's value at a path of keys, undefined when a step is missing or is not an object. A key is never split
// at ".": a dotted valueName ("a.b") is one literal key.
export function getValueByPath(row: any, path: Array<string>): any {
  let res = row;
  for(let i = 0; i < path.length; i++) {
    if(res === null || typeof res !== "object" || Array.isArray(res)) return undefined;
    res = res[path[i]];
  }
  return res;
}

// The object { [path[0]]: { ... { [last]: value } } } (a records filter takes the shape of a record).
export function createObjectByPath(path: Array<string>, value: any, target: { [index: string]: any } = {}): { [index: string]: any } {
  let obj = target;
  for(let i = 0; i < path.length - 1; i++) {
    if(obj[path[i]] === null || typeof obj[path[i]] !== "object") {
      obj[path[i]] = {};
    }
    obj = obj[path[i]];
  }
  obj[path[path.length - 1]] = value;
  return target;
}

// The keys from a row down to a question's value. Outside records it is question.getDataPath(): ["q1"],
// ["address", "street"]. Inside records (a dynamic panel's or a matrix's records) it is relative to the record
// (decisions RN4): the record keys of the template's nesting panels around the question, outermost first, then
// the value name. A template question's own getDataPath() knows nothing of the records, and the template panel
// itself never nests (RN6), so the walk stops at the template (getRecordsOwner(), or the outermost panel when the
// question has no template, as a matrix cell or column question). A composite's content stays flat (N5).
// A question-like descriptor without getDataPath() (a custom visualizer, a dashboard item) reads its data name.
export function getQuestionValuePath(question: any, dataName: string, inRecords?: boolean, flatRecords?: boolean): Array<string> {
  if(!question || typeof question.getDataPath !== "function") return [dataName];
  if(inRecords) {
    if(flatRecords) return [dataName];
    const res = [dataName];
    let panel = question.parent;
    while(!!panel && !!panel.parent && !panel.isPage) {
      if(typeof panel.getRecordsOwner === "function" && !!panel.getRecordsOwner()) break;
      const key = typeof panel.getRecordDataNestingKey === "function" ? panel.getRecordDataNestingKey() : "";
      if(!!key) res.unshift(key);
      panel = panel.parent;
    }
    return res;
  }
  const path = question.getDataPath();
  return Array.isArray(path) && path.length > 0 ? path : [dataName];
}
