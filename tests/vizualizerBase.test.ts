import { VisualizerBase, IDataInfo } from "../src/visualizerBase";
import { QuestionDropdownModel, SurveyModel } from "survey-core";

test("custom colors", () => {
  expect(VisualizerBase.getColors(1)).toEqual(VisualizerBase["colors"]);

  VisualizerBase.customColors = ["red", "green", "blue"];

  expect(VisualizerBase.getColors(2)).toEqual([
    "red",
    "green",
    "blue",
    "red",
    "green",
    "blue",
  ]);
});

test("series options", () => {
  const seriesValues = ["1", "2"];
  const seriesLabels = ["One", "Two"];
  let visualizer = new VisualizerBase(null, null, {
    seriesValues: seriesValues,
  });
  expect(visualizer.getSeriesValues()).toEqual(seriesValues);
  expect(visualizer.getSeriesLabels()).toEqual(seriesValues);
  visualizer = new VisualizerBase(null, null, {
    seriesValues: seriesValues,
    seriesLabels: seriesLabels,
  });
  expect(visualizer.getSeriesValues()).toEqual(seriesValues);
  expect(visualizer.getSeriesLabels()).toEqual(seriesLabels);
});

test("footer visualizer data, updateData", () => {
  var question = new QuestionDropdownModel("q1");
  question.hasOther = true;

  let visualizer = new VisualizerBase(question, []);
  expect(visualizer.hasFooter).toBeTruthy();
  expect(visualizer["surveyData"]).toEqual([]);
  expect(visualizer.footerVisualizer["surveyData"]).toEqual([]);

  const newData = [{ q1: 255 }];
  visualizer.updateData(newData);
  expect(visualizer["surveyData"]).toEqual(newData);
  expect(visualizer.footerVisualizer["surveyData"]).toEqual(newData);
});

test("check onAfterRender", (done) => {
  var question = new QuestionDropdownModel("q1");
  question.hasOther = true;

  let count = 0;
  let visualizer = new VisualizerBase(question, []);
  visualizer.onAfterRender.add(() => {
    count++;
    expect(count).toEqual(1);
    done();
  });
  (<any>visualizer).renderContent(document.createElement("div"));
});

test("Use valueName for data https://surveyjs.answerdesk.io/internal/ticket/details/T9071", () => {
  var question = new QuestionDropdownModel("q1");
  let visualizer = new VisualizerBase(question, []);

  expect(visualizer.name).toEqual("q1");

  question.valueName = "q1value";
  expect(visualizer.name).toEqual("q1value");
});

test("options.labelTruncateLength", () => {
  var question = new QuestionDropdownModel("q1");
  let visualizer = new VisualizerBase(question, [], { labelTruncateLength: 3 });

  expect(visualizer.labelTruncateLength).toEqual(3);
});

test("clear header", () => {
  var question = new QuestionDropdownModel("q1");
  question.correctAnswer = "1";
  let visualizer = new VisualizerBase(question, [], { showCorrectAnswers: true });
  expect(visualizer["headerContainer"]).toBeUndefined();
  visualizer.render(document.createElement("div"));
  expect(visualizer["headerContainer"]).toBeDefined();
  expect(visualizer["headerContainer"].innerHTML).toBe("<div class=\"sa-visualizer__correct-answer\"></div>");
  visualizer.clear();
  expect(visualizer["headerContainer"]).toBeDefined();
  expect(visualizer["headerContainer"].innerHTML).toBe("");
});

test("custom getDataCore function", async () => {
  const statistics = [[1, 2]];
  let visualizer = new VisualizerBase({ name: "q1" } as any, [], { q1: { getDataCore: (dataInfo: IDataInfo) => statistics } });
  expect(await visualizer.getCalculatedValues()).toEqual(statistics);
});

test("ensure question is ready", async () => {
  const json = { elements: [{ type: "dropdown", name: "q1", choicesLazyLoadEnabled: true, choicesLazyLoadPageSize: 40, }] };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((_, options) => {
    options.setItems([{ value: 1, text: "1" }], 1);
  });
  const q1 = survey.getAllQuestions()[0] as QuestionDropdownModel;

  let visualizer = new VisualizerBase(q1, []);
  expect(q1.choices.length).toBe(0);
  await new Promise<void>(resolve => {
    visualizer.onAfterRender.add(() => resolve());
    visualizer.render(document.createElement("div"));
  });
  expect(q1.choices.length).toBe(1);
});

test("VisualizerBase supportSelection and allowSelection option", () => {
  var q = new QuestionDropdownModel("q1");

  let vis = new VisualizerBase(q, []);
  expect(vis.supportSelection).toBe(false);

  vis = new VisualizerBase(q, [], { allowSelection: true });
  expect(vis.supportSelection).toBe(false);

    vis = new VisualizerBase(q, [], { allowSelection: false });
  expect(vis.supportSelection).toBe(false);
});

test("isFooterCollapsed should default to VisualizerBase.otherCommentCollapsed if not set", () => {
  VisualizerBase.otherCommentCollapsed = true;
  const q = { q1: { getDataCore: (dataInfo: IDataInfo) => [] } } as any;
  const vis = new VisualizerBase(q, []);
  expect(vis.isFooterCollapsed).toBe(true);

  VisualizerBase.otherCommentCollapsed = false;
  const vis2 = new VisualizerBase(q, []);
  expect(vis2.isFooterCollapsed).toBe(false);
});

test("isFooterCollapsed should changea after set", () => {
  VisualizerBase.otherCommentCollapsed = true;
  const q = { q1: { getDataCore: (dataInfo: IDataInfo) => [] } } as any;
  const vis = new VisualizerBase(q, []);
  expect(vis.isFooterCollapsed).toBe(true);
  vis.isFooterCollapsed = false;
  expect(vis.isFooterCollapsed).toBe(false);
});

test("footer should render or hide the footer content depending on isFooterCollapsed", () => {
  class TestVisualizer extends VisualizerBase {
    // Always has a footer for testing
    get hasFooter() {
      return true;
    }
    // Mock footerVisualizer to avoid recursion
    get footerVisualizer() {
      return { render: (el: HTMLElement) => { el.innerHTML = "footer-content"; }, invokeOnUpdate: () => {} } as any;
    }
  }
  const q = { q1: { getDataCore: (dataInfo: IDataInfo) => [] } } as any;
  const vis = new TestVisualizer(q, []);
  const container = document.createElement("div");

  // Collapsed
  vis.isFooterCollapsed = true;
  vis.renderFooter(container);
  const contentDivCollapsed = container.querySelector(".sa-visualizer__footer-content") as HTMLElement;
  expect(contentDivCollapsed).not.toBeNull();
  expect(contentDivCollapsed.style.display).toBe("none");

  // Expanded
  container.innerHTML = "";
  vis.isFooterCollapsed = false;
  vis.renderFooter(container);
  const contentDivExpanded = container.querySelector(".sa-visualizer__footer-content") as HTMLElement;
  expect(contentDivExpanded).not.toBeNull();
  expect(contentDivExpanded.style.display).toBe("block");
});

