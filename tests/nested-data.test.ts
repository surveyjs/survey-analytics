import { SurveyModel, Question, QuestionPanelDynamicModel, ComponentCollection } from "survey-core";
import { PivotModel } from "../src/pivot";
import { VisualizationComposite } from "../src/visualizationComposite";
import { SelectBase } from "../src/selectBase";
import { Text } from "../src/text";
import { WordCloud } from "../src/wordcloud/wordcloud";
import { NumberModel } from "../src/number";
import { HistogramModel } from "../src/histogram";
import { BooleanModel } from "../src/boolean";
import { RankingModel } from "../src/ranking";
import { NpsVisualizer } from "../src/nps";
import { VisualizationPanel } from "../src/visualizationPanel";
import { VisualizationPanelDynamic } from "../src/visualizationPanelDynamic";
import { VisualizationMatrixDropdown } from "../src/visualizationMatrixDropdown";
import { VisualizationMatrixDynamic } from "../src/visualizationMatrixDynamic";
import { VisualizerBase } from "../src/visualizerBase";
import { Dashboard } from "../src/dashboard";
import { ApexChartsAdapter } from "../src/apexcharts/chart-adapter";
export * from "../src/matrixDropdownGrouped";

VisualizerBase.chartAdapterType = ApexChartsAdapter;

const innerElements = [
  { type: "radiogroup", name: "kind", choices: ["a", "b"] },
  { type: "text", name: "street" },
  { type: "text", name: "num", inputType: "number" },
  { type: "boolean", name: "agree" },
  { type: "ranking", name: "rank", choices: ["r1", "r2", "r3"] },
  { type: "rating", name: "score", rateMin: 0, rateMax: 10 },
];

function createSurvey(nested: boolean): SurveyModel {
  return new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "panel1", valueName: nested ? "address" : undefined, elements: innerElements },
    ],
  });
}

const answers = [
  { kind: "a", street: "main street", num: 1, agree: true, rank: ["r1", "r2", "r3"], score: 10 },
  { kind: "b", street: "main road", num: 5, agree: false, rank: ["r3", "r2", "r1"], score: 3 },
  { kind: "a", street: "side street", num: 10, agree: true, rank: ["r2", "r1", "r3"], score: 8 },
];
const flatRows = () => answers.map((a, i) => Object.assign({ q1: "x" + i }, a));
const nestedRows = () => answers.map((a, i) => ({ q1: "x" + i, address: Object.assign({}, a) }));

function calc(visualizer: VisualizerBase) {
  return visualizer.getCalculatedValues();
}

function contentVisualizer(records: VisualizationPanelDynamic, name: string): VisualizerBase {
  return records.contentVisualizer.visualizers.filter(v => v.name === name)[0];
}

describe("Visualizers and filters read each answer at the question's data path (nested data, survey-library #12233)", () => {
  test("each visualizer gives the same result for nested rows as for flat rows (nested data, survey-library #12233)", async () => {
    const flat = createSurvey(false);
    const nested = createSurvey(true);
    const cases: Array<[string, any]> = [
      ["kind", SelectBase], ["street", Text], ["street", WordCloud], ["num", NumberModel], ["num", HistogramModel],
      ["agree", BooleanModel], ["rank", RankingModel], ["score", NpsVisualizer],
    ];
    for(const [name, ctor] of cases) {
      const flatResult = await calc(new ctor(flat.getQuestionByName(name), flatRows()));
      const nestedResult = await calc(new ctor(nested.getQuestionByName(name), nestedRows()));
      expect(JSON.stringify(flatResult.data), ctor.name + " " + name + " has data").not.toMatch(/^\[\[(0,?)*\]\]$|^\[\]$/);
      expect(nestedResult, ctor.name + " " + name).toEqual(flatResult);
    }
  });

  test("each dataNesting mode is read at its path (nested data, survey-library #12233)", async () => {
    const kindCounts = async (json: any, rows: Array<any>) => {
      const survey = new SurveyModel(json);
      return (await calc(new SelectBase(survey.getQuestionByName("kind"), rows))).data;
    };
    const kind = { type: "radiogroup", name: "kind", choices: ["a", "b"] };
    const values = ["a", "b", "a"];

    expect(await kindCounts({ dataNesting: "panel", elements: [{ type: "panel", name: "panel1", elements: [kind] }] },
      values.map(v => ({ panel1: { kind: v } })))).toEqual([[1, 2]]);
    expect(await kindCounts({ dataNesting: "page", pages: [{ name: "page1", elements: [kind] }] },
      values.map(v => ({ page1: { kind: v } })))).toEqual([[1, 2]]);
    expect(await kindCounts({ dataNesting: "panelAndPage", pages: [{ name: "page1", elements: [{ type: "panel", name: "panel1", elements: [kind] }] }] },
      values.map(v => ({ page1: { panel1: { kind: v } } })))).toEqual([[1, 2]]);

    const noneJson = { dataNesting: "none", elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [kind] }] };
    expect(await kindCounts(noneJson, values.map(v => ({ kind: v })))).toEqual([[1, 2]]);
    expect(await kindCounts(noneJson, values.map(v => ({ address: { kind: v } })))).toEqual([[0, 0]]);

    const geoSurvey = new SurveyModel({
      elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "panel", name: "panel2", valueName: "geo", elements: [{ type: "text", name: "lat", inputType: "number" }] },
      ] }],
    });
    const lat = geoSurvey.getQuestionByName("lat");
    expect(lat.getDataPath()).toEqual(["address", "geo", "lat"]);
    const flatLat = await calc(new NumberModel(new SurveyModel({ elements: [{ type: "text", name: "lat", inputType: "number" }] }).getQuestionByName("lat"), [{ lat: 2 }, { lat: 4 }]));
    expect(await calc(new NumberModel(lat, [{ address: { geo: { lat: 2 } } }, { address: { geo: { lat: 4 } } }]))).toEqual(flatLat);
  });

  test("a dotted valueName inside a nesting panel is one literal key (nested data, survey-library #12233)", async () => {
    const survey = new SurveyModel({
      elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "radiogroup", name: "dotted", valueName: "a.b", choices: ["a", "b"] },
      ] }],
    });
    const rows = [{ address: { "a.b": "a" } }, { address: { "a.b": "b" } }, { address: { a: { b: "a" } } }];
    expect((await calc(new SelectBase(survey.getQuestionByName("dotted"), rows))).data).toEqual([[1, 1]]);
  });

  test("an inner question reads only the nested rows of mixed old and new rows (nested data, survey-library #12233)", async () => {
    const survey = createSurvey(true);
    const rows = [...nestedRows().slice(0, 2), flatRows()[2]];
    expect((await calc(new SelectBase(survey.getQuestionByName("kind"), rows))).data).toEqual([[1, 1]]);
    expect((await calc(new Text(survey.getQuestionByName("q1"), rows))).data).toEqual([["x0"], ["x1"], ["x2"]]);
  });

  test("VisualizationPanel builds one visualizer per question named by question.name, and its state applies (nested data, survey-library #12233)", async () => {
    const survey = createSurvey(true);
    const panel = new VisualizationPanel(survey.getAllQuestions(), nestedRows());
    expect(panel.visualizers.map(v => v.name)).toEqual(["q1", "kind", "street", "num", "agree", "rank", "score"]);
    expect(panel.getElement("kind")).toBeTruthy();
    expect(panel.getElement("address")).toBeUndefined();

    // A state applied to the nested survey reads back as the same state applied to the flat survey
    const roundTrip = (questions: Array<Question>, rows: Array<any>, state: any) => {
      const target = new VisualizationPanel(questions, rows);
      target.state = state;
      return target;
    };
    panel.hideElement("street");
    const state = panel.state;
    expect(state.elements.map(e => e.name)).toEqual(["q1", "kind", "street", "num", "agree", "rank", "score"]);
    const restored = roundTrip(survey.getAllQuestions(), nestedRows(), state);
    expect(restored.getElement("street").isVisible).toBe(false);
    expect(restored.state).toEqual(roundTrip(createSurvey(false).getAllQuestions(), flatRows(), state).state);

    const flatPanel = new VisualizationPanel(createSurvey(false).getAllQuestions(), flatRows());
    flatPanel.hideElement("num");
    const fromFlat = roundTrip(survey.getAllQuestions(), nestedRows(), flatPanel.state);
    expect(fromFlat.getElement("num").isVisible).toBe(false);
    expect(fromFlat.state).toEqual(roundTrip(createSurvey(false).getAllQuestions(), flatRows(), flatPanel.state).state);
  });

  test("filters by an inner question keep the matching rows (nested data, survey-library #12233)", async () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "panel", name: "panel1", valueName: "address", elements: [
          { type: "radiogroup", name: "kind", choices: ["a", "b"] },
          { type: "radiogroup", name: "dotted", valueName: "a.b", choices: ["a", "b"] },
        ] },
      ],
    });
    const rows = [
      { q1: "x0", address: { kind: "a", "a.b": "a" } },
      { q1: "x1", address: { kind: "b", "a.b": "a", a: { b: "b" } } },
      { q1: "x2", address: { kind: "a", a: { b: "a" } } },
    ];
    const panel = new VisualizationPanel(survey.getAllQuestions(), rows);
    const q1Viz = panel.visualizers.filter(v => v.name === "q1")[0];

    panel.setFilter("kind", "a");
    expect(panel.dataProvider.filteredData.map(r => r.q1)).toEqual(["x0", "x2"]);
    expect((await calc(q1Viz)).data).toEqual([["x0"], ["x2"]]);
    expect(panel.dataProvider.getFilters()).toEqual([{ field: "address.kind", type: "=", value: "a" }]);

    panel.resetFilter();
    expect(panel.dataProvider.filteredData.length).toBe(3);

    panel.setFilter("dotted", "a");
    expect(panel.dataProvider.filteredData.map(r => r.q1)).toEqual(["x0", "x1"]);
    expect(panel.dataProvider.getFilters()).toEqual([{ field: "address.a.b", type: "=", value: "a" }]);
    panel.resetFilter();
    expect(panel.dataProvider.filteredData.length).toBe(3);

    const kindViz: any = panel.visualizers.filter(v => v.name === "kind")[0];
    kindViz.onDataItemSelected("b", "b");
    expect(panel.dataProvider.filteredData.map(r => r.q1)).toEqual(["x1"]);
    expect(panel.dataProvider.getFilters()).toEqual([{ field: "address.kind", type: "=", value: "b" }]);
    kindViz.onDataItemSelected(undefined, "");
    expect(panel.dataProvider.filteredData.length).toBe(3);
  });

  test("setFilter by the name of a top-level question with its own valueName filters by the valueName (nested data, survey-library #12233)", () => {
    const survey = new SurveyModel({ elements: [{ type: "radiogroup", name: "q", valueName: "v", choices: ["a", "b"] }] });
    const panel = new VisualizationPanel(survey.getAllQuestions(), [{ v: "a" }, { v: "b" }]);
    panel.setFilter("q", "a");
    expect(panel.dataProvider.filteredData).toEqual([{ v: "a" }]);
    expect(panel.dataProvider.getFilters()).toEqual([{ field: "v", type: "=", value: "a" }]);
    panel.resetFilter();
    panel.setFilter("v", "b");
    expect(panel.dataProvider.filteredData).toEqual([{ v: "b" }]);
    expect(panel.dataProvider.getFilters()).toEqual([{ field: "v", type: "=", value: "b" }]);
  });

  test("a GetDataFn sees the question's data path and the dotted filter field (nested data, survey-library #12233)", async () => {
    const survey = createSurvey(true);
    const calls: Array<any> = [];
    const dataFn = (params: any) => {
      calls.push({ path: params.visualizer.question.getDataPath(), filter: params.filter });
      return Promise.resolve({ data: [], values: [] });
    };
    const panel = new VisualizationPanel([survey.getQuestionByName("kind"), survey.getQuestionByName("street")], dataFn as any);
    panel.setFilter("kind", "a");
    calls.length = 0;
    const street = panel.visualizers.filter(v => v.name === "street")[0];
    await street.getCalculatedValues();
    expect(calls).toEqual([{ path: ["address", "street"], filter: [{ field: "address.kind", type: "=", value: "a" }] }]);
  });

  describe("records (nested data, survey-library #12233)", () => {
    const pdJson = {
      elements: [{ type: "paneldynamic", name: "items", templateElements: [
        { type: "text", name: "title" },
        { type: "panel", name: "p", valueName: "address", elements: [{ type: "radiogroup", name: "kind2", choices: ["a", "b"] }] },
      ] }],
    };
    const pdRows = () => [
      { items: [{ title: "A", address: { kind2: "a" } }] },
      { items: [{ title: "B", address: { kind2: "b" } }] },
    ];
    const contentViz = (pd: VisualizationPanelDynamic, name: string) => pd.contentVisualizer.visualizers.filter(v => v.name === name)[0];

    test("a nesting panel inside a dynamic panel's template is read inside each record (nested data, survey-library #12233)", async () => {
      const survey = new SurveyModel(pdJson);
      const pd = new VisualizationPanelDynamic(survey.getQuestionByName("items"), pdRows());
      expect((await calc(contentViz(pd, "kind2"))).data).toEqual([[1, 1]]);
      expect((await calc(contentViz(pd, "title"))).data).toEqual([["A"], ["B"]]);
    });

    test("cross-filtering by a nested field inside the records (nested data, survey-library #12233)", async () => {
      const survey = new SurveyModel(pdJson);
      const pd = new VisualizationPanelDynamic(survey.getQuestionByName("items"), pdRows());
      (contentViz(pd, "kind2") as any).onDataItemSelected("a", "a");
      expect(pd.dataProvider.filteredData).toEqual([pdRows()[0]]);
      expect(pd.dataProvider.getFilters()).toEqual([{ field: "items", type: "=", value: { address: { kind2: "a" } } }]);
      expect((await calc(contentViz(pd, "title"))).data).toEqual([["A"]]);
      pd.contentVisualizer.setFilter("title", "B");
      expect(pd.dataProvider.filteredData).toEqual([pdRows()[1]]);
      expect(pd.dataProvider.getFilters()).toEqual([{ field: "items", type: "=", value: { title: "B" } }]);
      pd.resetContentFilter();
      expect(pd.dataProvider.filteredData.length).toBe(2);
    });

    test("a dynamic panel inside a nesting panel reads its records at its path (nested data, survey-library #12233)", async () => {
      const survey = new SurveyModel({
        elements: [{ type: "panel", name: "top", valueName: "top", elements: [
          { type: "paneldynamic", name: "inner", templateElements: [{ type: "text", name: "x" }] },
        ] }],
      });
      const rows = [{ top: { inner: [{ x: "1" }, { x: "2" }] } }, { top: { inner: [{ x: "3" }] } }];
      const pd = new VisualizationPanelDynamic(survey.getQuestionByName("inner"), rows);
      expect((await calc(contentViz(pd, "x"))).data).toEqual([["1"], ["2"], ["3"]]);
      pd.contentVisualizer.setFilter("x", "3");
      expect(pd.dataProvider.filteredData).toEqual([rows[1]]);
      expect(pd.dataProvider.getFilters()).toEqual([{ field: "top.inner", type: "=", value: { x: "3" } }]);
    });

    test("the template panel's own valueName is ignored (nested data, survey-library #12233)", async () => {
      const survey = new SurveyModel(pdJson);
      const question = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
      question.template.valueName = "rec";
      const pd = new VisualizationPanelDynamic(question, [{ items: [{ title: "A" }] }]);
      expect((await calc(contentViz(pd, "title"))).data).toEqual([["A"]]);
    });

    test("matrix columns are read inside the records, also inside a nesting panel (nested data, survey-library #12233)", async () => {
      const columns = [{ name: "c1", cellType: "dropdown", choices: ["a", "b"] }, { name: "c2", cellType: "text" }];
      const flatSurvey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "md", columns }] });
      const flatMd = new VisualizationMatrixDynamic(flatSurvey.getQuestionByName("md"), [{ md: [{ c1: "a", c2: "t1" }, { c1: "b" }] }]);
      const flatC1 = await calc(contentViz(flatMd, "c1"));
      expect(flatC1.data).toEqual([[1, 1]]);

      const nestedSurvey = new SurveyModel({ elements: [{ type: "panel", name: "top", valueName: "top", elements: [{ type: "matrixdynamic", name: "md", columns }] }] });
      const nestedMd = new VisualizationMatrixDynamic(nestedSurvey.getQuestionByName("md"), [{ top: { md: [{ c1: "a", c2: "t1" }, { c1: "b" }] } }]);
      expect(await calc(contentViz(nestedMd, "c1"))).toEqual(flatC1);

      const ddColumns = [{ name: "c1", cellType: "dropdown", choices: ["a", "b"] }, { name: "c2", cellType: "dropdown", choices: ["a", "b"] }];
      const ddJson = (nested: boolean) => ({ elements: [{ type: "panel", name: "top", valueName: nested ? "top" : undefined, elements: [
        { type: "matrixdropdown", name: "mdd", rows: ["r1", "r2"], columns: ddColumns },
      ] }] });
      const ddValue = () => ({ r1: { c1: "a", c2: "b" }, r2: { c1: "b", c2: "b" } });
      const flatDd = new VisualizationMatrixDropdown(new SurveyModel(ddJson(false)).getQuestionByName("mdd") as any, [{ mdd: ddValue() }]);
      const nestedDd = new VisualizationMatrixDropdown(new SurveyModel(ddJson(true)).getQuestionByName("mdd") as any, [{ top: { mdd: ddValue() } }]);
      const ddColumn = (md: VisualizationMatrixDropdown) => (md.contentVisualizer as VisualizationPanel).visualizers.filter(v => v.name === "c1")[0];
      const flatDdData = await calc(ddColumn(flatDd));
      expect(JSON.stringify(flatDdData.data)).toMatch(/[1-9]/);
      expect(await calc(ddColumn(nestedDd))).toEqual(flatDdData);

      const groupedJson = (nested: boolean) => ({ elements: [{ type: "panel", name: "top", valueName: nested ? "top" : undefined, elements: [
        { type: "matrixdropdown", name: "mdd", rows: ["r1"], choices: ["a", "b"], columns: [{ name: "c1" }, { name: "c2" }] },
      ] }] });
      const flatGrouped = new VisualizationMatrixDropdown(new SurveyModel(groupedJson(false)).getQuestionByName("mdd") as any, [{ mdd: { r1: { c1: "a", c2: "b" } } }]);
      const nestedGrouped = new VisualizationMatrixDropdown(new SurveyModel(groupedJson(true)).getQuestionByName("mdd") as any, [{ top: { mdd: { r1: { c1: "a", c2: "b" } } } }]);
      expect(flatGrouped.canGroupColumns).toBe(true);
      const flatGroupedData = await calc(flatGrouped.contentVisualizer);
      expect(JSON.stringify(flatGroupedData.data)).toMatch(/[1-9]/);
      expect(await calc(nestedGrouped.contentVisualizer)).toEqual(flatGroupedData);
    });
  });

  test("Dashboard builds an item with data for each inner question (nested data, survey-library #12233)", async () => {
    const survey = createSurvey(true);
    const dashboard = new Dashboard({ questions: survey.getAllQuestions(), data: nestedRows() });
    expect(dashboard.items.map(i => i.name)).toEqual(["q1", "kind", "street", "num", "agree", "rank", "score"]);
    const flatDashboard = new Dashboard({ questions: createSurvey(false).getAllQuestions(), data: flatRows() });
    for(let i = 0; i < dashboard.visualizers.length; i++) {
      expect(await calc(dashboard.visualizers[i]), dashboard.items[i].name).toEqual(await calc(flatDashboard.visualizers[i]));
    }
    expect((await calc(dashboard.visualizers.filter(v => v.name === "kind")[0])).data).toEqual([[1, 2]]);
  });

  test("the comment footer of an inner question reads the comment inside the object (nested data, survey-library #12233)", async () => {
    const survey = new SurveyModel({
      elements: [{ type: "panel", name: "panel1", valueName: "address", elements: [
        { type: "radiogroup", name: "kind", choices: ["a", "b"], showOtherItem: true },
      ] }],
    });
    survey.getQuestionByName("kind").value = "other";
    survey.getQuestionByName("kind").comment = "my other";
    expect(survey.data).toEqual({ address: { kind: "other", "kind-Comment": "my other" } });
    const visualizer = new SelectBase(survey.getQuestionByName("kind"), [survey.data]);
    expect(visualizer.footerVisualizer.name).toBe("kind-Comment");
    expect((await calc(visualizer.footerVisualizer)).data).toEqual([["my other"]]);
  });

  test("Pivot and the histogram's aggregate read inner questions at their paths (nested data, survey-library #12233)", async () => {
    const flat = createSurvey(false);
    const nested = createSurvey(true);
    const flatPivot = new PivotModel(flat.getAllQuestions(), flatRows());
    const nestedPivot = new PivotModel(nested.getAllQuestions(), nestedRows());
    for(const axes of [["kind", "kind"], ["kind", "num"], ["num", "kind"]]) {
      flatPivot.setAxisQuestions(...axes);
      nestedPivot.setAxisQuestions(...axes);
      const flatData = (await calc(flatPivot)).data;
      expect(JSON.stringify(flatData), axes.join()).toMatch(/[1-9]/);
      expect((await calc(nestedPivot)).data, axes.join()).toEqual(flatData);
    }

    const flatHistogram = new HistogramModel(flat.getQuestionByName("num"), flatRows(), { num: { aggregateDataNames: ["score"] } });
    const nestedHistogram = new HistogramModel(nested.getQuestionByName("num"), nestedRows(), { num: { aggregateDataNames: ["score"] } });
    flatHistogram.aggregateDataName = "score";
    nestedHistogram.aggregateDataName = "score";
    const flatAggregate = await calc(flatHistogram);
    expect(JSON.stringify(flatAggregate.data)).toMatch(/1[0-9]/);
    expect(await calc(nestedHistogram)).toEqual(flatAggregate);
  });

  test("a composite inside a nesting panel reads its flat content and filters by its path (nested data, survey-library #12233)", async () => {
    ComponentCollection.Instance.add({
      name: "nestedcomp12233",
      elementsJSON: [{ type: "radiogroup", name: "ci", choices: ["a", "b"] }],
    });
    try {
      const survey = new SurveyModel({
        elements: [{ type: "panel", name: "top", valueName: "top", elements: [{ type: "nestedcomp12233", name: "comp" }] }],
      });
      const rows = [{ top: { comp: { ci: "a" } } }, { top: { comp: { ci: "b" } } }];
      const composite = new VisualizationComposite(survey.getQuestionByName("comp"), rows);
      const ci = contentVisualizer(composite, "ci");
      expect((await calc(ci)).data).toEqual([[1, 1]]);
      (ci as any).onDataItemSelected("b", "b");
      expect(composite.dataProvider.filteredData).toEqual([rows[1]]);
      expect(composite.dataProvider.getFilters()).toEqual([{ field: "top.comp", type: "=", value: { ci: "b" } }]);
    } finally {
      ComponentCollection.Instance.clear();
    }
  });

  describe("records shapes (nested data, survey-library #12233)", () => {
    const recordsJson = (dataNesting: string, panel: any) => ({
      dataNesting,
      elements: [{ type: "paneldynamic", name: "items", templateElements: [
        { type: "ranking", name: "rank", choices: ["r1", "r2"] },
        Object.assign({ type: "panel", name: "p", elements: [{ type: "radiogroup", name: "kind2", choices: ["a", "b"] }] }, panel),
      ] }],
    });
    const countKind2 = async (json: any, rows: Array<any>, templateValueName?: string) => {
      const survey = new SurveyModel(json);
      const question = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
      if(templateValueName) question.template.valueName = templateValueName;
      const pd = new VisualizationPanelDynamic(question, rows);
      return (await calc(contentVisualizer(pd, "kind2"))).data;
    };
    const nestedRecords = [{ items: [{ address: { kind2: "a" } }, { address: { kind2: "b" } }] }];
    const flatRecords = [{ items: [{ kind2: "a" }, { kind2: "b" }] }];

    test("RN3: \"none\" keeps records flat, the by-name modes don't nest a record's panel without valueName (nested data, survey-library #12233)", async () => {
      expect(await countKind2(recordsJson("none", { valueName: "address" }), flatRecords)).toEqual([[1, 1]]);
      expect(await countKind2(recordsJson("none", { valueName: "address" }), nestedRecords)).toEqual([[0, 0]]);
      expect(await countKind2(recordsJson("panel", {}), flatRecords)).toEqual([[1, 1]]);
      // The dynamic panel itself sits in the nesting page: { page1: { items: [...] } }
      expect(await countKind2(recordsJson("panelAndPage", { valueName: "address" }), [{ page1: nestedRecords[0] }])).toEqual([[1, 1]]);
    });

    test("RN6: a template with its own valueName still reads its nesting panel inside the record (nested data, survey-library #12233)", async () => {
      expect(await countKind2(recordsJson("auto", { valueName: "address" }), nestedRecords, "rec")).toEqual([[1, 1]]);
    });

    test("a ranking inside records is counted (nested data, survey-library #12233)", async () => {
      const survey = new SurveyModel(recordsJson("auto", { valueName: "address" }));
      const pd = new VisualizationPanelDynamic(survey.getQuestionByName("items"), [{ items: [{ rank: ["r1", "r2"] }, { rank: ["r2", "r1"] }] }]);
      expect((await calc(contentVisualizer(pd, "rank"))).data).toEqual([[3, 3]]);
    });
  });
});
