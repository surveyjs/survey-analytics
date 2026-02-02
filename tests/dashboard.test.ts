import { QuestionTextModel, SurveyModel } from "survey-core";
import { SelectBase } from "../src/selectBase";
import { AlternativeVisualizersWrapper } from "../src/alternativeVizualizersWrapper";
import { Dashboard } from "../src/dashboard";
import { IState } from "../src/config";
import { IVisualizerOptions, PostponeHelper, VisualizerBase } from "../src/visualizerBase";
import { IPivotChartVisualizerOptions, PivotModel } from "../src/pivot";
import { NumberModel } from "../src/number";
import { Matrix } from "../src/matrix";
import { ApexChartsAdapter } from "../src/apexcharts/chart-adapter";
import { DatePeriodEnum } from "../src/utils/dateRangeModel";
export * from "../src/card";
export * from "../src/text";
export * from "../src/number";
export * from "../src/nps";
export * from "../src/pivot";
export * from "../src/matrix";

VisualizerBase.chartAdapterType = ApexChartsAdapter;

test("Dashboard should accept visualizer definitions", () => {
  const visualizerDefinition: IVisualizerOptions = {
    type: "nps",
    dataField: "test"
  };
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition] });
  expect(dashboard.panel.visualizers.length).toBe(1);
  expect(dashboard.panel.visualizers[0].type).toBe("nps");

  dashboard = new Dashboard({ visualizers: [visualizerDefinition, visualizerDefinition] });
  expect(dashboard.panel.visualizers.length).toBe(2);
  expect(dashboard.panel.visualizers[0].type).toBe("nps");
  expect(dashboard.panel.visualizers[1].type).toBe("nps");
});

test("Dashboard should accept questions", () => {
  const json = {
    elements: [
      { type: "text", name: "question1" },
      { type: "text", name: "question2" },
      { type: "text", name: "question3" },
    ],
  };
  const survey = new SurveyModel(json);
  let dashboard = new Dashboard({ questions: survey.getAllQuestions() });
  expect(dashboard.panel.visualizers.length).toBe(3);
  expect(dashboard.panel.visualizers[0].type).toBe("text");
  expect(dashboard.panel.visualizers[0].dataNames).toStrictEqual(["question1"]);
  expect(dashboard.panel.visualizers[1].type).toBe("text");
  expect(dashboard.panel.visualizers[1].dataNames).toStrictEqual(["question2"]);
  expect(dashboard.panel.visualizers[2].type).toBe("text");
  expect(dashboard.panel.visualizers[2].dataNames).toStrictEqual(["question3"]);
});

test("Dashboard should show questions mentioned in visualazers parameter", () => {
  const json = {
    elements: [
      { type: "text", name: "question1" },
      { type: "text", name: "question2" },
      { type: "text", name: "question3" },
    ],
  };
  const survey = new SurveyModel(json);
  let dashboard = new Dashboard({ questions: survey.getAllQuestions(), visualizers: ["question2", "question3"] });
  expect(dashboard.panel.visualizers.length).toBe(2);
  expect(dashboard.panel.visualizers[0].type).toBe("text");
  expect(dashboard.panel.visualizers[0].dataNames).toStrictEqual(["question2"]);
  expect(dashboard.panel.visualizers[1].type).toBe("text");
  expect(dashboard.panel.visualizers[1].dataNames).toStrictEqual(["question3"]);
});

test("Create nps visualizer from definition with dataName", async () => {
  const visualizerDefinition: IVisualizerOptions = {
    type: "nps",
    dataField: "test"
  };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition], data });
  const nps = dashboard.panel.visualizers[0];

  let result: any = await nps.getCalculatedValues();

  expect(result).toStrictEqual({
    "data": [[1, 2, 3, 6]],
    "values": ["detractors", "passive", "promoters", "total"],
  });
});

test("Create nps visualizer from definition with questionName", async () => {
  const visualizerDefinition: IVisualizerOptions = {
    type: "nps",
    dataField: "test"
  };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition], data });
  const nps = dashboard.panel.visualizers[0];

  let result: any = (await nps.getCalculatedValues());

  expect(result).toStrictEqual({
    "data": [[1, 2, 3, 6]],
    "values": ["detractors", "passive", "promoters", "total"],
  });
});

test("Create nps visualizer from definition with question", async () => {
  const visualizerDefinition: IVisualizerOptions = {
    type: "nps",
    availableTypes: ["nps"],
    dataField: "test"
  };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition], questions: [new QuestionTextModel("test")], data });
  const nps = dashboard.panel.visualizers[0];

  let result: any = (await nps.getCalculatedValues());

  expect(result).toStrictEqual({
    "data": [[1, 2, 3, 6]],
    "values": ["detractors", "passive", "promoters", "total"],
  });
});

test("Create number visualizer from definition", async () => {
  const visualizerDefinition: IVisualizerOptions = {
    type: "card",
    dataField: "test",
    aggregationType: "count"
  };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }, {}];
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition], data });
  const numberVis = dashboard.panel.visualizers[0] as NumberModel;

  let result: any = (await numberVis.getCalculatedValues()).data[0];

  expect(result).toStrictEqual([7.34, 1, 10, 7]);
  expect(numberVis.dataNames[0]).toEqual(visualizerDefinition.dataField);
  expect(numberVis.name.indexOf("visualizer")).toEqual(0);
  expect(dashboard.panel.visibleElements[0].name.indexOf("visualizer")).toEqual(0);
});

test("Options passed to root panel and visualizer", async () => {
  const visualizerDefinition: IVisualizerOptions = {
    type: "gauge",
    dataField: "test",
    aggregationType: "count",
    someVisualizerOption: "vis"
  };
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition], somePanelOption: "panel" });
  expect(Object.keys(dashboard.panel.options)).toStrictEqual(["somePanelOption"]);
  expect((dashboard.panel.options as any).somePanelOption).toEqual("panel");
  expect(dashboard.panel.visualizers.length).toBe(1);

  const visualizer = dashboard.panel.visualizers[0] as NumberModel;
  expect(visualizer.options.someVisualizerOption).toEqual("vis");
  expect(visualizer.options.somePanelOption).toEqual("panel");
  expect(visualizer.type).toBe("average");
  expect(visualizer.chartType).toBe("gauge");
  expect(visualizer.dataNames[0]).toEqual(visualizerDefinition.dataField);
});

test("Create pivot visualizer with empty config", async () => {
  const visualizerDefinition: any = {
    type: "pivot",
  };
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition] });
  expect(dashboard.panel.visualizers.length).toBe(1);
  const visualizer = dashboard.panel.visualizers[0] as PivotModel;
  expect(visualizer.type).toBe("pivot");
});

test("Create pivot visualizer with questions", async () => {
  const json = {
    elements: [
      { type: "text", name: "question1" },
      { type: "text", name: "question2" },
      { type: "text", name: "question3" },
    ],
  };
  const survey = new SurveyModel(json);
  const visualizerDefinition: any = {
    type: "pivot",
    questions: survey.getAllQuestions()
  };
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition] });
  expect(dashboard.panel.visualizers.length).toBe(1);
  const visualizer = dashboard.panel.visualizers[0] as PivotModel;
  expect(visualizer.type).toBe("pivot");
  expect(visualizer.questions.length).toBe(3);
  expect(visualizer.axisXQuestionName).toBe("question1");
  expect(visualizer.axisYQuestionNames).toStrictEqual([]);
});

// test("Create pivot visualizer with axis options", async () => {
//   const json = {
//     elements: [
//       { type: "text", name: "question1" },
//       { type: "text", name: "question2" },
//       { type: "text", name: "question3" },
//     ],
//   };
//   const survey = new SurveyModel(json);
//   const visualizerDefinition: any = {
//     type: "pivot",
//     questions: survey.getAllQuestions(),
//     categoryField: "question2",
//     seriesFields: ["question1", "question3"]
//   };
//   let dashboard = new Dashboard({ visualizers: [visualizerDefinition] });
//   expect(dashboard.panel.visualizers.length).toBe(1);
//   expect(dashboard.panel.getElements().length).toBe(1);
//   expect(dashboard.panel.getElement("visualizer1")).toStrictEqual({
//     "displayName": "",
//     "isPublic": true,
//     "isVisible": true,
//     "name": "visualizer1",
//   });
//   expect(dashboard.panel.getVisualizer("visualizer1")).toBeDefined();

//   const visualizer = dashboard.panel.visualizers[0] as PivotModel;
//   expect(visualizer.type).toBe("pivot");
//   expect(visualizer.name).toBe("visualizer1");
//   expect(visualizer.questions.length).toBe(3);
//   expect(visualizer.axisXQuestionName).toBe("question2");
//   expect(visualizer.axisYQuestionNames).toStrictEqual(["question1", "question3"]);
// });

test("Set chart types from definitions", async () => {
  const visualizerDefinition1 = {
    type: "scatter",
    availableTypes: ["line", "scatter", "bar"],
    dataField: "test"
  };
  const visualizerDefinition2 = {
    type: "line",
    dataField: "test"
  };
  const visualizerDefinition3 = {
    availableTypes: ["line", "scatter", "bar"],
    dataField: "test"
  };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  const dashboard = new Dashboard({ visualizers: [visualizerDefinition1, visualizerDefinition2, visualizerDefinition3], data });
  const chart1 = dashboard.panel.visualizers[0] as SelectBase;
  expect(chart1.chartType).toBe("scatter");
  expect(chart1["chartTypes"]).toStrictEqual(["line", "scatter", "bar"]);

  const chart2 = dashboard.panel.visualizers[1] as SelectBase;
  expect(chart2.chartType).toBe("line");
  expect(chart2["chartTypes"]).toStrictEqual(["bar", "vbar", "pie", "doughnut"]);

  const chart3 = dashboard.panel.visualizers[2] as SelectBase;
  expect(chart3.chartType).toBe("line");
  expect(chart3["chartTypes"]).toStrictEqual(["line", "scatter", "bar"]);
});

test("Set visualizer types from definitions", async () => {
  const visualizerDefinition1 = {
    type: "nps",
    availableTypes: ["line", "scatter", "bar", "nps"],
    dataField: "test"
  };
  const visualizerDefinition2 = {
    availableTypes: ["line", "scatter", "bar", "nps"],
    dataField: "test"
  };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition1, visualizerDefinition2], data });
  expect(dashboard.panel.visualizers.length).toBe(2);

  const chart1 = dashboard.panel.visualizers[0] as AlternativeVisualizersWrapper;
  expect(chart1.type).toStrictEqual("alternative");

  const chart1Visualizers = chart1.getVisualizers();
  expect(chart1Visualizers.length).toBe(2);
  expect(chart1.getVisualizer().type).toBe("nps");
  expect(chart1Visualizers[0].type).toBe("selectBase");
  expect((chart1Visualizers[0] as SelectBase).chartType).toBe("line");
  expect((chart1Visualizers[0] as SelectBase)["chartTypes"]).toStrictEqual(["line", "scatter", "bar"]);
  expect(chart1Visualizers[1].type).toBe("nps");

  const chart2 = dashboard.panel.visualizers[1] as AlternativeVisualizersWrapper;
  expect(chart2.type).toStrictEqual("alternative");

  const chart2Visualizers = chart2.getVisualizers();
  expect(chart2Visualizers.length).toBe(2);
  expect(chart2.getVisualizer().type).toBe("selectBase");
  expect(chart2Visualizers[0].type).toBe("selectBase");
  expect((chart2Visualizers[0] as SelectBase).chartType).toBe("line");
  expect((chart2Visualizers[0] as SelectBase)["chartTypes"]).toStrictEqual(["line", "scatter", "bar"]);
  expect(chart2Visualizers[1].type).toBe("nps");
});

test("Create matrix visualizer", async () => {
  const survey = new SurveyModel({
    "pages": [
      {
        "elements": [
          {
            "type": "matrix",
            "name": "teacher-evaluation",
            "title": "Please rate the following aspects of the teacher's performance",
            "columns": [
              { "value": "1", "text": "Need Improvement" },
              { "value": "2", "text": "Satisfactory" },
              { "value": "3", "text": "Good" },
              { "value": "4", "text": "Excellent" },
              { "value": "5", "text": "Outstanding" }
            ],
            "rows": [
              { "value": "well-prepared", "text": "The teacher is well-prepared for class and has good command over the subject." },
              { "value": "syllabus", "text": "The teacher covers the entire syllabus in time." },
              { "value": "delivery", "text": "The teacher delivers the contents efficiently and makes the subject interesting." },
              { "value": "guidance", "text": "The teacher provides guidance in or outside the class." },
              { "value": "encouragement", "text": "The teacher encourages students to participate in class discussions, ask questions, and share their opinions." },
              { "value": "modern-tools", "text": "The teacher uses modern teaching tools, content notes, handouts, and suggests useful references (offline/online)." },
              { "value": "weak", "text": "The teacher focuses on students who are academically weak or poor in performance." },
              { "value": "counsel", "text": "The teacher counsels students in their physical, emotional, or academic difficulties." },
              { "value": "non-traditional-methods", "text": "The teacher assesses students' knowledge using non-traditional methods such as quizzes, seminars, assignments, and presentations." },
              { "value": "class-time", "text": "The teacher schedules class time and tasks to encourage students to solve problems and think critically." },
              { "value": "study-material", "text": "The teacher provides study materials and references (textbooks, e-resources, journals, etc.) on time." },
              { "value": "experiment", "text": "The teacher helps students conduct experiments through clear instructions or demonstrations." },
              { "value": "disciplined", "text": "The classroom environment is well disciplined by the teacher." },
              { "value": "evaluation", "text": "The evaluation process conducted by the teacher is uniform and unbiased." }
            ],
            "eachRowRequired": true,
            "alternateRows": true
          }
        ]
      }
    ]
  });
  const dataFromServer = [
    { "teacher-evaluation": { "well-prepared": "2", "syllabus": "5", "delivery": "5", "guidance": "5", "encouragement": "2", "modern-tools": "4", "weak": "5", "counsel": "1", "non-traditional-methods": "5", "class-time": "3", "study-material": "2", "experiment": "3", "disciplined": "4", "evaluation": "5" } },
    { "teacher-evaluation": { "well-prepared": "3", "syllabus": "5", "delivery": "5", "guidance": "3", "encouragement": "4", "modern-tools": "5", "weak": "3", "counsel": "5", "non-traditional-methods": "5", "class-time": "4", "study-material": "1", "experiment": "4", "disciplined": "4", "evaluation": "4" } },
    { "teacher-evaluation": { "well-prepared": "3", "syllabus": "5", "delivery": "4", "guidance": "4", "encouragement": "4", "modern-tools": "2", "weak": "1", "counsel": "3", "non-traditional-methods": "5", "class-time": "4", "study-material": "5", "experiment": "5", "disciplined": "5", "evaluation": "5" } },
    { "teacher-evaluation": { "well-prepared": "5", "syllabus": "4", "delivery": "5", "guidance": "5", "encouragement": "3", "modern-tools": "4", "weak": "4", "counsel": "2", "non-traditional-methods": "4", "class-time": "2", "study-material": "4", "experiment": "3", "disciplined": "5", "evaluation": "2" } },
    { "teacher-evaluation": { "well-prepared": "5", "syllabus": "5", "delivery": "4", "guidance": "5", "encouragement": "5", "modern-tools": "5", "weak": "5", "counsel": "3", "non-traditional-methods": "2", "class-time": "5", "study-material": "4", "experiment": "3", "disciplined": "4", "evaluation": "4" } },
    { "teacher-evaluation": { "well-prepared": "2", "syllabus": "3", "delivery": "3", "guidance": "4", "encouragement": "1", "modern-tools": "3", "weak": "2", "counsel": "4", "non-traditional-methods": "3", "class-time": "5", "study-material": "5", "experiment": "4", "disciplined": "3", "evaluation": "4" } },
    { "teacher-evaluation": { "well-prepared": "4", "syllabus": "3", "delivery": "4", "guidance": "5", "encouragement": "4", "modern-tools": "4", "weak": "5", "counsel": "3", "non-traditional-methods": "3", "class-time": "5", "study-material": "4", "experiment": "4", "disciplined": "5", "evaluation": "4" } },
    { "teacher-evaluation": { "well-prepared": "4", "syllabus": "1", "delivery": "4", "guidance": "2", "encouragement": "5", "modern-tools": "4", "weak": "1", "counsel": "3", "non-traditional-methods": "4", "class-time": "5", "study-material": "5", "experiment": "4", "disciplined": "3", "evaluation": "4" } },
    { "teacher-evaluation": { "well-prepared": "5", "syllabus": "3", "delivery": "4", "guidance": "3", "encouragement": "4", "modern-tools": "4", "weak": "5", "counsel": "3", "non-traditional-methods": "5", "class-time": "4", "study-material": "3", "experiment": "4", "disciplined": "4", "evaluation": "5" } },
    { "teacher-evaluation": { "well-prepared": "3", "syllabus": "3", "delivery": "5", "guidance": "3", "encouragement": "2", "modern-tools": "4", "weak": "4", "counsel": "5", "non-traditional-methods": "3", "class-time": "3", "study-material": "3", "experiment": "4", "disciplined": "3", "evaluation": "3" } },
    { "teacher-evaluation": { "well-prepared": "5", "syllabus": "3", "delivery": "3", "guidance": "5", "encouragement": "4", "modern-tools": "3", "weak": "3", "counsel": "5", "non-traditional-methods": "2", "class-time": "3", "study-material": "3", "experiment": "2", "disciplined": "5", "evaluation": "5" } },
    { "teacher-evaluation": { "well-prepared": "4", "syllabus": "5", "delivery": "5", "guidance": "3", "encouragement": "5", "modern-tools": "3", "weak": "4", "counsel": "2", "non-traditional-methods": "4", "class-time": "4", "study-material": "2", "experiment": "1", "disciplined": "5", "evaluation": "5" } },
    { "teacher-evaluation": { "well-prepared": "5", "syllabus": "1", "delivery": "1", "guidance": "5", "encouragement": "3", "modern-tools": "5", "weak": "2", "counsel": "5", "non-traditional-methods": "4", "class-time": "3", "study-material": "4", "experiment": "3", "disciplined": "5", "evaluation": "4" } },
    { "teacher-evaluation": { "well-prepared": "4", "syllabus": "4", "delivery": "5", "guidance": "5", "encouragement": "3", "modern-tools": "2", "weak": "3", "counsel": "2", "non-traditional-methods": "5", "class-time": "2", "study-material": "1", "experiment": "5", "disciplined": "2", "evaluation": "5" } },
    { "teacher-evaluation": { "well-prepared": "5", "syllabus": "3", "delivery": "3", "guidance": "5", "encouragement": "4", "modern-tools": "5", "weak": "4", "counsel": "5", "non-traditional-methods": "3", "class-time": "3", "study-material": "3", "experiment": "3", "disciplined": "5", "evaluation": "3" } },
    { "teacher-evaluation": { "well-prepared": "4", "syllabus": "5", "delivery": "5", "guidance": "4", "encouragement": "5", "modern-tools": "2", "weak": "3", "counsel": "4", "non-traditional-methods": "1", "class-time": "3", "study-material": "5", "experiment": "3", "disciplined": "2", "evaluation": "5" } },
    { "teacher-evaluation": { "well-prepared": "2", "syllabus": "1", "delivery": "5", "guidance": "5", "encouragement": "5", "modern-tools": "5", "weak": "5", "counsel": "5", "non-traditional-methods": "5", "class-time": "4", "study-material": "5", "experiment": "2", "disciplined": "4", "evaluation": "2" } },
    { "teacher-evaluation": { "well-prepared": "3", "syllabus": "5", "delivery": "5", "guidance": "5", "encouragement": "5", "modern-tools": "2", "weak": "3", "counsel": "3", "non-traditional-methods": "5", "class-time": "4", "study-material": "4", "experiment": "4", "disciplined": "4", "evaluation": "4" } }
  ];
  const visualizerDefinition: any = {
    type: "stackedbar",
    dataField: "teacher-evaluation"
  };
  const dashboard = new Dashboard({
    questions: survey.getAllQuestions(),
    data: dataFromServer,
    visualizers: [visualizerDefinition]
  });
  expect(dashboard.panel.visualizers.length).toBe(1);

  const visualizer = dashboard.panel.visualizers[0] as Matrix;
  expect(visualizer.type).toBe("matrix");
  expect(visualizer.chartType).toBe("stackedbar");
  expect(visualizer["chartTypes"]).toStrictEqual(["bar", "stackedbar", "pie", "doughnut"]);

  const result: any = (await visualizer.getAnswersData())["datasets"];
  expect(result).toStrictEqual([
    [6, 7, 9, 10, 6, 5, 5, 6, 7, 4, 5, 2, 7, 7],
    [5, 2, 5, 3, 6, 6, 4, 2, 4, 6, 5, 7, 6, 7],
    [4, 6, 3, 4, 3, 3, 5, 6, 4, 6, 4, 6, 3, 2],
    [3, 0, 0, 1, 2, 4, 2, 3, 2, 2, 2, 2, 2, 2],
    [0, 3, 1, 0, 1, 0, 2, 1, 1, 0, 2, 1, 0, 0]
  ]);
});

test("Create visualizer with predefined char type and available types", async () => {
  const survey = new SurveyModel({
    "pages": [
      {
        "elements": [
          {
            "type": "dropdown",
            "name": "college",
            "title": "Select your college",
            "placeholder": "Select college...",
            "choices": [
              "Science College",
              "Engineering College",
              "Management College",
              "Medical College",
              "Fine Arts College"
            ]
          }
        ]
      }
    ]
  });
  const dataFromServer = [
    { "college": "Engineering College" },
    { "college": "Management College" },
    { "college": "Medical College" },
    { "college": "Engineering College" },
    { "college": "Fine Arts College" },
    { "college": "Engineering College" },
    { "college": "Science College" },
    { "college": "Medical College" },
    { "college": "Management College" },
    { "college": "Medical College" },
    { "college": "Science College" },
    { "college": "Science College" },
    { "college": "Management College" },
    { "college": "Medical College" },
    { "college": "Medical College" },
    { "college": "Management College" },
    { "college": "Engineering College" },
    { "college": "Medical College" },
    { "college": "Engineering College" },
    { "college": "Medical College" },
    { "college": "Medical College" },
    { "college": "Engineering College" },
    { "college": "Management College" },
    { "college": "Medical College" },
    { "college": "Engineering College" },
    { "college": "Science College" },
    { "college": "Science College" },
    { "college": "Management College" },
    { "college": "Engineering College" },
    { "college": "Medical College" },
    { "college": "Fine Arts College" },
    { "college": "Engineering College" },
    { "college": "Fine Arts College" },
    { "college": "Science College" }
  ];
  const visualizerDefinition: any = {
    type: "vbar",
    availableTypes: ["bar", "vbar"],
    dataField: "college",
  };
  const dashboard = new Dashboard({
    questions: survey.getAllQuestions(),
    data: dataFromServer,
    visualizers: [visualizerDefinition]
  });
  expect(dashboard.panel.visualizers.length).toBe(1);

  const visualizer = dashboard.panel.visualizers[0] as SelectBase;
  expect(visualizer.type).toBe("selectBase");
  expect(visualizer.chartType).toBe("vbar");
  expect(visualizer["chartTypes"]).toStrictEqual(["bar", "vbar"]);
});

test("Dashboard registerToolbarItem", () => {
  const json = {
    elements: [
      { type: "text", name: "question1" },
      { type: "text", name: "question2" },
      { type: "text", name: "question3" },
    ],
  };
  const survey = new SurveyModel(json);
  let dashboard = new Dashboard({ questions: survey.getAllQuestions() });

  dashboard.registerToolbarItem("default_item1", () => document.createElement("div"), "button", 1000);
  dashboard.registerToolbarItem("default_item2", () => document.createElement("div"), "filter");

  const result = dashboard.panel.getSortedToolbarItemCreators();
  expect(dashboard.getSortedToolbarItemCreators()).toHaveLength(0);
  expect(result).toHaveLength(4);
  expect(result[2].name).toBe("default_item1");
  expect(result[3].name).toBe("default_item2");
});

test("getState, setState, onStateChanged", () => {
  const json = { elements: [{ type: "checkbox", name: "question1", choices: [1, 2, 3] }] };
  const data = [{ question1: [1, 2] }];
  const survey = new SurveyModel(json);
  let dashboard = new Dashboard({ questions: survey.getAllQuestions(), data });
  let chartVisualizer = dashboard.panel.getVisualizer("question1") as SelectBase;

  expect(chartVisualizer["chartTypes"]).toStrictEqual(["bar", "vbar", "pie", "doughnut"]);
  chartVisualizer["chartTypes"] = ["bar", "scatter"];

  let initialState: IState = {
    locale: "",
    elements: [
      {
        displayName: "question1",
        name: "question1",
        isVisible: true,
        isPublic: true,
      },
    ],
  };
  let newState: IState = {
    locale: "fr",
    elements: [
      {
        displayName: "question1",
        name: "question1",
        isVisible: false,
        isPublic: true,
        chartType: "scatter",
        answersOrder: "asc",
        hideEmptyAnswers: true,
        topN: 10
      },
    ],
  };
  let count = 0;

  dashboard.onStateChanged.add(() => {
    count++;
  });

  expect(dashboard.state).toEqual(initialState);
  dashboard.state = null as any;
  expect(count).toBe(0);

  dashboard.state = newState;
  expect(dashboard.state).toEqual(newState);
  expect(count).toBe(0);

  const visualizer = dashboard.panel.visualizers[0] as SelectBase;
  expect(visualizer.chartType).toBe("scatter");
  expect(visualizer.answersOrder).toBe("asc");
  expect(visualizer.hideEmptyAnswers).toBe(true);
  expect(visualizer.topN).toBe(10);

  dashboard.locale = "ru";
  expect(count).toBe(1);
  expect(dashboard.state.locale).toEqual("ru");

  visualizer.chartType = "bar";
  expect(count).toBe(2);
  expect(dashboard.state.elements![0].chartType).toEqual(undefined);

  visualizer.answersOrder = "desc";
  expect(count).toBe(3);
  expect(dashboard.state.elements![0].answersOrder).toEqual("desc");

  visualizer.topN = 5;
  expect(count).toBe(4);
  expect(dashboard.state.elements![0].topN).toEqual(5);

  visualizer.hideEmptyAnswers = false;
  expect(count).toBe(5);
  expect(dashboard.state.elements![0].hideEmptyAnswers).toEqual(undefined);
});

test("Create visualizer with answersOrder", async () => {
  const visualizerDefinition: IVisualizerOptions = {
    type: "bar",
    dataField: "test",
    answersOrder: "desc"
  };
  const data = [{ test: 1 }, { test: 10 }, { test: 8 }, { test: 7 }, { test: 9 }, { test: 9 }];
  let dashboard = new Dashboard({ visualizers: [visualizerDefinition], data });
  const visualizer = dashboard.panel.visualizers[0] as SelectBase;

  expect(visualizer.chartType).toBe("bar");
  expect(visualizer.answersOrder).toBe("desc");
});

test("allowChangeType", () => {
  const json = {
    elements: [
      { type: "checkbox", name: "question1", choices: [1, 2, 3] },
      { type: "text", inputType: "number", name: "question2" },
      { type: "rating", name: "question3" },
    ],
  };
  const survey = new SurveyModel(json);
  const data = [{ question1: [1, 2] }];

  let dashboard = new Dashboard({
    allowChangeVisualizerType: true,
    questions: survey.getAllQuestions(),
    data,
    visualizers: [
      {
        dataField: "question1",
        allowChangeType: false
      },
      {
        dataField: "question2",
        allowChangeType: false
      },
      "question3"
    ],
  });
  let visualizers = dashboard.panel["visualizers"];

  expect(visualizers).toHaveLength(3);
  expect(visualizers[0].type).toBe("selectBase");
  expect(visualizers[0]["toolbarItemCreators"]["changeChartType"]).toBeUndefined();
  expect(visualizers[1].type).toBe("alternative");
  expect(visualizers[1]["toolbarItemCreators"]["changeVisualizer"]).toBeUndefined();
  expect(visualizers[2].type).toBe("alternative");
  expect(visualizers[2]["toolbarItemCreators"]["changeVisualizer"]).toBeDefined();
});

test("Dashboard should accept date-related options (dateFieldName, datePeriod, availableDatePeriods, dateRange, showAnswerCount, showDatePanel)", () => {
  const dateRange: [Date, Date] = [new Date("2025-12-01"), new Date("2025-12-31")];
  const availableDatePeriods: DatePeriodEnum[] = ["last7days", "last30days", "custom"];
  const dashboard = new Dashboard({
    visualizers: [{ type: "text", dataField: "q1" }],
    dateFieldName: "submissionDate",
    datePeriod: "last30days",
    availableDatePeriods,
    dateRange,
    showAnswerCount: false,
    showDatePanel: true
  });

  const panelOptions = dashboard.panel.options as any;
  expect(panelOptions.dateFieldName).toBe("submissionDate");
  expect(panelOptions.datePeriod).toBe("last30days");
  expect(panelOptions.availableDatePeriods).toStrictEqual(availableDatePeriods);
  expect(panelOptions.dateRange).toStrictEqual(dateRange);
  expect(panelOptions.showAnswerCount).toBe(false);
  expect(panelOptions.showDatePanel).toBe(true);
});

test("Dashboard should accept showDatePanel: false to hide date panel", () => {
  const dashboard = new Dashboard({
    visualizers: [{ type: "text", dataField: "q1" }],
    dateFieldName: "submissionDate",
    dateRange: [new Date("2025-12-01"), new Date("2025-12-31")],
    showDatePanel: false
  });

  const panelOptions = dashboard.panel.options as any;
  expect(panelOptions.dateFieldName).toBe("submissionDate");
  expect(panelOptions.dateRange).toBeDefined();
  expect(panelOptions.showDatePanel).toBe(false);
});

test("Dashboard onDateRangeChanged event fires when date range changes", () => {
  const dashboard = new Dashboard({
    visualizers: [{ type: "text", dataField: "q1" }],
    dateFieldName: "submissionDate",
    dateRange: [new Date("2025-12-01"), new Date("2025-12-31")],
    showDatePanel: true
  });

  const handler = jest.fn();
  dashboard.onDateRangeChanged.add(handler);

  const options = {
    datePeriod: "last7days" as DatePeriodEnum,
    dateRange: { start: new Date("2025-12-08").getTime(), end: new Date("2025-12-14").getTime() }
  };
  dashboard.panel.onDateRangeChanged.fire(dashboard.panel, options);

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith(dashboard, options);
});