import { DataProvider } from "../src/dataProvider";
import { SurveyModel } from "survey-core";
import { VisualizationMatrixDropdown } from "../src/visualizationMatrixDropdown";
import { VisualizationManager } from "../src/visualizationManager";
import { SelectBase } from "../src/selectBase";

test("ctor", () => {
  const dataProvider = new DataProvider();
  expect(dataProvider.data).toEqual([]);
});

test("getData for boolean question values - mock", () => {
  var data = [
    {
      q1: true,
    },
    {
      q1: true,
    },
    {
      q2: true,
    },
    {
      q1: false,
    },
    {
      q1: true,
    },
  ];
  const dataProvider = new DataProvider(data);
  expect(
    dataProvider.getData({
      dataName: "q1",
      getValues: () => [true, false],
      getLabels: () => ["true", "false"],
      getSeriesValues: () => [],
      getSeriesLabels: () => [],
    })
  ).toEqual([[3, 1]]);
});

test("getData for select base question values", () => {
  const choices = ["father", "mother", "brother", "sister", "son", "dauhter"];
  const data = [
    {
      q1: "father",
    },
    {
      q1: "father",
    },
    {
      q1: "mother",
    },
    {
      q1: "sister",
    },
  ];
  const dataProvider = new DataProvider(data);
  expect(
    dataProvider.getData({
      dataName: "q1",
      getValues: () => choices,
      getLabels: () => choices,
      getSeriesValues: () => [],
      getSeriesLabels: () => [],
    })
  ).toEqual([[2, 1, 0, 1, 0, 0]]);
});

test("getData for matrix question values", () => {
  const data = [
    {
      question1: { Lizol: "Excellent", Harpic: "Excellent" },
    },
    {
      question1: { Lizol: "Very Good", Harpic: "Very Good" },
    },
    {
      question1: { Lizol: "Very Good", Harpic: "Good" },
    },
  ];
  const dataProvider = new DataProvider(data);
  expect(
    dataProvider.getData({
      dataName: "question1",
      getValues: () => [
        "Excellent",
        "Very Good",
        "Good",
        "Fair",
        "Neither Fair Nor Poor",
        "Poor",
      ],
      getLabels: () => [
        "Excellent",
        "Very Good",
        "Good",
        "Fair",
        "Neither Fair Nor Poor",
        "Poor",
      ],
      getSeriesValues: () => ["Lizol", "Harpic"],
      getSeriesLabels: () => ["Lizol", "Harpic"],
    })
  ).toEqual([
    [1, 2, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0],
  ]);
});

test("getData for matrix dropdown question values - pre-processed data", () => {
  const data = [
    { __sa_series_name: "Lizol", "Column 1": "Trustworthy", "Column 2": 3 },
    { __sa_series_name: "Harpic", "Column 1": "High Quality", "Column 2": 4 },
    { __sa_series_name: "Lizol", "Column 1": "Natural", "Column 2": 3 },
    { __sa_series_name: "Harpic", "Column 1": "Natural", "Column 2": 4 },
    { __sa_series_name: "Lizol", "Column 1": "Natural", "Column 2": 1 },
    { __sa_series_name: "Harpic", "Column 1": "Trustworthy", "Column 2": 5 },
  ];
  const dataProvider = new DataProvider(data);
  expect(
    dataProvider.getData({
      dataName: "Column 1",
      getValues: () => ["High Quality", "Natural", "Trustworthy"],
      getLabels: () => ["High Quality", "Natural", "Trustworthy"],
      getSeriesValues: () => ["Lizol", "Harpic"],
      getSeriesLabels: () => ["Lizol", "Harpic"],
    })
  ).toEqual([
    [0, 2, 1],
    [1, 1, 1],
  ]);
  expect(
    dataProvider.getData({
      dataName: "Column 2",
      getValues: () => [1, 2, 3, 4, 5],
      getLabels: () => ["1", "2", "3", "4", "5"],
      getSeriesValues: () => ["Lizol", "Harpic"],
      getSeriesLabels: () => ["Lizol", "Harpic"],
    })
  ).toEqual([
    [1, 0, 2, 0, 0],
    [0, 0, 0, 2, 1],
  ]);
});

VisualizationManager.registerVisualizer("dropdown", SelectBase);
test("getData for matrix dropdown inner visualizers", () => {
  const json = {
    questions: [
      {
        type: "matrixdropdown",
        name: "question2",
        title: "What do you feel about these brands?",
        isRequired: true,
        columns: [
          {
            name: "Column 1",
            title: "My Opinion",
            choices: ["High Quality", "Natural", "Trustworthy"],
          },
          { name: "Column 2", title: "Review Mark", choices: [1, 2, 3, 4, 5] },
        ],
        rows: ["Lizol", "Harpic"],
      },
    ],
  };

  const data = [
    {
      question2: {
        Lizol: { "Column 1": "Trustworthy", "Column 2": 3 },
        Harpic: { "Column 1": "High Quality", "Column 2": 4 },
      },
    },
    {
      question2: {
        Lizol: { "Column 1": "Natural", "Column 2": 3 },
        Harpic: { "Column 1": "Natural", "Column 2": 4 },
      },
    },
    {
      question2: {
        Lizol: { "Column 1": "Natural", "Column 2": 1 },
        Harpic: { "Column 1": "Trustworthy", "Column 2": 5 },
      },
    },
  ];

  const survey = new SurveyModel(json);
  const question = survey.getQuestionByName("question2");

  let visualizer = new VisualizationMatrixDropdown(<any>question, data);
  const innerPanelVisualizer: any = visualizer["_panelVisualizer"];
  innerPanelVisualizer.render(document.createElement("div"));

  const dataProvider = new DataProvider(<any>innerPanelVisualizer["data"]);
  expect(
    dataProvider.getData(<any>innerPanelVisualizer["visualizers"][0])
  ).toEqual([
    [0, 2, 1],
    [1, 1, 1],
  ]);
  expect(
    dataProvider.getData(<any>innerPanelVisualizer["visualizers"][1])
  ).toEqual([
    [1, 0, 2, 0, 0],
    [0, 0, 0, 2, 1],
  ]);

  expect(innerPanelVisualizer["visualizers"][0].getData()).toEqual([
    [0, 2, 1],
    [1, 1, 1],
  ]);
  expect(innerPanelVisualizer["visualizers"][1].getData()).toEqual([
    [1, 0, 2, 0, 0],
    [0, 0, 0, 2, 1],
  ]);
});
