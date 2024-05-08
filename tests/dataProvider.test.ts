import { DataProvider, IDataInfo } from "../src/dataProvider";
import { SurveyModel } from "survey-core";
import { VisualizationMatrixDropdown } from "../src/visualizationMatrixDropdown";
import { VisualizationManager } from "../src/visualizationManager";
import { SelectBase } from "../src/selectBase";

const testData = [
  {
    q1: 0,
    q2: "item1",
    q3: ["item1", "item3"],
    q4: { innerq1: "item1", innerq2: "item1" },
  },
  {
    q1: 0,
    q2: "item2",
    q3: ["item1", "item3"],
    q4: { innerq1: "item1", innerq2: "item1" },
  },
  {
    q1: 1,
    q2: "item1",
    q3: ["item1", "item3"],
    q4: { innerq1: "item1", innerq2: "item1" },
  },
  {
    q1: 1,
    q2: "item2",
    q3: ["item1", "item2"],
    q4: { innerq1: "item1", innerq2: "item1" },
  },
];

const q1testDataInfo = {
  name: "q1",
  getValues: () => [0, 1, 2, 3],
  getLabels: () => ["a0", "a1", "a2", "a3"],
  getSeriesValues: () => [],
  getSeriesLabels: () => [],
};

test("ctor/setFilter/reset/onDataChanged", () => {
  const dataProvider = new DataProvider();
  let callCount = 0;
  dataProvider.onDataChanged.add(() => callCount++);
  expect(callCount).toEqual(0);
  expect(dataProvider.data).toEqual([]);

  dataProvider.data = testData;
  expect(callCount).toEqual(0);
  expect(dataProvider.data).toEqual(testData);

  expect(dataProvider.getData(q1testDataInfo)).toEqual([[2, 2, 0, 0]]);
  expect(callCount).toEqual(0);

  dataProvider.setFilter("q2", "item1");
  expect(callCount).toEqual(1);
  expect(dataProvider.getData(q1testDataInfo)).toEqual([[1, 1, 0, 0]]);
  expect(callCount).toEqual(1);

  dataProvider.reset();
  expect(callCount).toEqual(2);

  dataProvider.setFilter("q2", undefined);
  expect(callCount).toEqual(2);
  expect(dataProvider.getData(q1testDataInfo)).toEqual([[2, 2, 0, 0]]);
  expect(callCount).toEqual(2);

  dataProvider.setFilter("q3", "item2");
  expect(callCount).toEqual(3);
  expect(dataProvider.getData(q1testDataInfo)).toEqual([[0, 1, 0, 0]]);
  expect(callCount).toEqual(3);
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
      name: "q1",
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
      name: "q1",
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
      name: "question1",
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
      name: "Column 1",
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
      name: "Column 2",
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
            cellType: "dropdown",
            choices: ["High Quality", "Natural", "Trustworthy"],
          },
          { name: "Column 2", cellType: "dropdown", title: "Review Mark", choices: [1, 2, 3, 4, 5] },
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

  const innerPanelVisualizer: any = visualizer["_matrixDropdownVisualizer"];
  expect(innerPanelVisualizer["visualizers"][0].getCalculatedValues()).toEqual([
    [0, 2, 1].reverse(),
    [1, 1, 1].reverse(),
  ]);
  expect(innerPanelVisualizer["visualizers"][1].getCalculatedValues()).toEqual([
    [1, 0, 2, 0, 0].reverse(),
    [0, 0, 0, 2, 1].reverse(),
  ]);

  const dataProvider = new DataProvider(<any>innerPanelVisualizer["data"]);
  expect(
    dataProvider.getData(<any>innerPanelVisualizer["visualizers"][0])
  ).toEqual([
    [0, 2, 1].reverse(),
    [1, 1, 1].reverse(),
  ]);
  expect(
    dataProvider.getData(<any>innerPanelVisualizer["visualizers"][1])
  ).toEqual([
    [1, 0, 2, 0, 0].reverse(),
    [0, 0, 0, 2, 1].reverse(),
  ]);
});

test("custom getDataCore function", () => {
  const statistics = [[1, 2]];
  const dataProvider = new DataProvider(<any>[], (dataInfo: IDataInfo) => statistics);
  expect(dataProvider.getData(<any>{})).toEqual(statistics);
});

test("getData for matrix dropdown grouped", () => {
  const data = [
    {
      "__sa_series_name": "Process",
      "1st Most Difficult": "Process 2",
      "2nd Most Difficult": "Process 3",
      "3rd Most Difficult": "Process 5"
    },
    {
      "__sa_series_name": "Process",
      "1st Most Difficult": "Process 3",
      "2nd Most Difficult": "Process 1",
      "3rd Most Difficult": "Process 4"
    },
    {
      "__sa_series_name": "Process",
      "1st Most Difficult": "Process 1",
      "2nd Most Difficult": "Process 2",
      "3rd Most Difficult": "Process 3"
    },
  ];
  const dataProvider = new DataProvider(data);
  const rows = ["Process"];
  const choices = ["Process 1", "Process 2", "Process 3", "Process 4", "Process 5", "Process 6"];
  const columns = ["1st Most Difficult", "2nd Most Difficult", "3rd Most Difficult"];
  expect(
    dataProvider.getData({
      name: columns,
      getValues: () => choices,
      getLabels: () => choices,
      getSeriesValues: () => rows,
      getSeriesLabels: () => rows,
    })
  ).toEqual([
    [[1, 1, 1, 0, 0, 0]],
    [[1, 1, 1, 0, 0, 0]],
    [[0, 0, 1, 1, 1, 0]],
  ]);
});

test("filter data by matrix value", () => {
  const data = [
    {
      Quality: {
        affordable: "1",
        "does what it claims": "1",
        "better then others": "1",
        "easy to use": "1",
      },
      organization_type: "Custom",
      developer_count: "3-5",
    },
    {
      Quality: {
        affordable: "3",
        "does what it claims": "4",
        "better then others": "2",
        "easy to use": "3",
      },
      organization_type: "Consulting",
      developer_count: "> 10",
    },
  ];
  const dataProvider = new DataProvider(data);
  const values = ["Custom", "Consulting", "ISV"];
  const dataInfo = {
    name: "organization_type",
    getValues: () => values,
    getLabels: () => values,
    getSeriesValues: () => [],
    getSeriesLabels: () => [],
  };

  expect(dataProvider.filteredData).toEqual([
    { "Quality": { "affordable": "1", "better then others": "1", "does what it claims": "1", "easy to use": "1" }, "developer_count": "3-5", "organization_type": "Custom" },
    { "Quality": { "affordable": "3", "better then others": "2", "does what it claims": "4", "easy to use": "3" }, "developer_count": "> 10", "organization_type": "Consulting" }
  ]);
  expect(
    dataProvider.getData(dataInfo)
  ).toEqual([
    [1, 1, 0],
  ]);

  dataProvider.setFilter("developer_count", "3-5");
  expect(dataProvider.filteredData).toEqual([
    { "Quality": { "affordable": "1", "better then others": "1", "does what it claims": "1", "easy to use": "1" }, "developer_count": "3-5", "organization_type": "Custom" },
  ]);
  expect(
    dataProvider.getData(dataInfo)
  ).toEqual([
    [1, 0, 0],
  ]);

  dataProvider.setFilter("developer_count", undefined);
  expect(dataProvider.filteredData).toEqual([
    { "Quality": { "affordable": "1", "better then others": "1", "does what it claims": "1", "easy to use": "1" }, "developer_count": "3-5", "organization_type": "Custom" },
    { "Quality": { "affordable": "3", "better then others": "2", "does what it claims": "4", "easy to use": "3" }, "developer_count": "> 10", "organization_type": "Consulting" }
  ]);
  expect(
    dataProvider.getData(dataInfo)
  ).toEqual([
    [1, 1, 0],
  ]);

  dataProvider.setFilter("Quality", { "affordable": "3" });
  expect(dataProvider.filteredData).toEqual([
    { "Quality": { "affordable": "3", "better then others": "2", "does what it claims": "4", "easy to use": "3" }, "developer_count": "> 10", "organization_type": "Consulting" }
  ]);
  expect(
    dataProvider.getData(dataInfo)
  ).toEqual([
    [0, 1, 0],
  ]);
});

test("filter data by matrix value - number and string", () => {
  const data = [
    {
      Quality: {
        affordable: "1",
        "does what it claims": "1",
        "better then others": "1",
        "easy to use": "1",
      },
      organization_type: "Custom",
      developer_count: "3-5",
    },
    {
      Quality: {
        affordable: "3",
        "does what it claims": "4",
        "better then others": "2",
        "easy to use": "3",
      },
      organization_type: "Consulting",
      developer_count: "> 10",
    },
  ];
  const dataProvider = new DataProvider(data);
  const values = ["Custom", "Consulting", "ISV"];
  const dataInfo = {
    name: "organization_type",
    getValues: () => values,
    getLabels: () => values,
    getSeriesValues: () => [],
    getSeriesLabels: () => [],
  };

  expect(dataProvider.filteredData).toEqual([
    { "Quality": { "affordable": "1", "better then others": "1", "does what it claims": "1", "easy to use": "1" }, "developer_count": "3-5", "organization_type": "Custom" },
    { "Quality": { "affordable": "3", "better then others": "2", "does what it claims": "4", "easy to use": "3" }, "developer_count": "> 10", "organization_type": "Consulting" }
  ]);
  expect(
    dataProvider.getData(dataInfo)
  ).toEqual([
    [1, 1, 0],
  ]);

  dataProvider.setFilter("Quality", { "affordable": 3 });
  expect(dataProvider.filteredData).toEqual([
    { "Quality": { "affordable": "3", "better then others": "2", "does what it claims": "4", "easy to use": "3" }, "developer_count": "> 10", "organization_type": "Consulting" }
  ]);
  expect(
    dataProvider.getData(dataInfo)
  ).toEqual([
    [0, 1, 0],
  ]);
});

test("filter data for matrix dropdown question column values - pre-processed data", () => {
  const data = [
    { __sa_series_name: "Lizol", "Column 1": "Trustworthy", "Column 2": 3 },
    { __sa_series_name: "Harpic", "Column 1": "High Quality", "Column 2": 4 },
    { __sa_series_name: "Lizol", "Column 1": "Natural", "Column 2": 3 },
    { __sa_series_name: "Harpic", "Column 1": "Natural", "Column 2": 4 },
    { __sa_series_name: "Lizol", "Column 1": "Natural", "Column 2": 1 },
    { __sa_series_name: "Harpic", "Column 1": "Trustworthy", "Column 2": 5 },
  ];
  const dataProvider = new DataProvider(data);

  dataProvider.setFilter("Column 1", { "Lizol": "Natural" });
  expect(
    dataProvider.getData({
      name: "Column 1",
      getValues: () => ["High Quality", "Natural", "Trustworthy"],
      getLabels: () => ["High Quality", "Natural", "Trustworthy"],
      getSeriesValues: () => ["Lizol", "Harpic"],
      getSeriesLabels: () => ["Lizol", "Harpic"],
    })
  ).toEqual([
    [0, 2, 0],
    [0, 0, 0],
  ]);
  expect(
    dataProvider.getData({
      name: "Column 2",
      getValues: () => [1, 2, 3, 4, 5],
      getLabels: () => ["1", "2", "3", "4", "5"],
      getSeriesValues: () => ["Lizol", "Harpic"],
      getSeriesLabels: () => ["Lizol", "Harpic"],
    })
  ).toEqual([
    [1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test("filter by interval", () => {
  const data = [
    { date: "2021-10-13", age: 17 },
    { date: "2021-10-13", age: 17 },
    { date: "2021-10-13", age: 17 },
    { date: "2011-10-13", age: 30 },
    { date: "2011-10-13", age: 30 },
    { date: "2004-10-13", age: 40 },
    { date: "2004-10-13", age: 40 },
    { date: "2016-10-13", age: 25 },
  ];
  const dataProvider = new DataProvider(data);

  dataProvider.setFilter("age", { start: 14, end: 19, label: "youth" });
  expect(
    dataProvider.filteredData
  ).toEqual([
    { date: "2021-10-13", age: 17 },
    { date: "2021-10-13", age: 17 },
    { date: "2021-10-13", age: 17 }
  ]);

  dataProvider.setFilter("age", undefined);
  expect(
    dataProvider.filteredData
  ).toEqual(data);

  dataProvider.setFilter("date", { start: Date.parse("2003-10-13"), end: Date.parse("2005-10-13"), label: "2004" });
  expect(
    dataProvider.filteredData
  ).toEqual([
    { date: "2004-10-13", age: 40 },
    { date: "2004-10-13", age: 40 },
  ]);
});

test("getData for boolean question values + missing answers", () => {
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
    {

    }
  ];
  const dataProvider = new DataProvider(data);
  expect(
    dataProvider.getData({
      name: "q1",
      getValues: () => [true, false, undefined],
      getLabels: () => ["true", "false", "missing"],
      getSeriesValues: () => [],
      getSeriesLabels: () => [],
    })
  ).toEqual([[3, 1, 2]]);
});

test("getData for select base question values + missing answers", () => {
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
    {

    }
  ];
  const dataProvider = new DataProvider(data);
  expect(
    dataProvider.getData({
      name: "q1",
      getValues: () => choices.concat([undefined]),
      getLabels: () => choices.concat(["missing"]),
      getSeriesValues: () => [],
      getSeriesLabels: () => [],
    })
  ).toEqual([[2, 1, 0, 1, 0, 0, 1]]);
});