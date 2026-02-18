import { SurveyModel } from "survey-core";
import { VisualizationMatrixDropdown } from "../src/visualizationMatrixDropdown";
import { DataProvider } from "../src/dataProvider";
import { VisualizationPanel } from "../src/visualizationPanel";
import { SelectBase } from "../src/selectBase";
import { VisualizationManager } from "../src/visualizationManager";

VisualizationManager.registerVisualizer("dropdown", SelectBase);

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
        { name: "Column 3", title: "Default choices" },
      ],
      choices: ["one", "two", "three"],
      rows: ["Lizol", "Harpic"],
    },
  ],
};

const data = [
  {
    question1: { Lizol: "Excellent", Harpic: "Excellent" },
    question2: {
      Lizol: { "Column 1": "Trustworthy", "Column 2": 3 },
      Harpic: { "Column 1": "High Quality", "Column 2": 4 },
    },
  },
  {
    question1: { Lizol: "Very Good", Harpic: "Very Good" },
    question2: {
      Lizol: { "Column 1": "Natural", "Column 2": 3 },
      Harpic: { "Column 1": "Natural", "Column 2": 4 },
    },
  },
  {
    question1: { Lizol: "Very Good", Harpic: "Good" },
    question2: {
      Lizol: { "Column 1": "Natural", "Column 2": 1 },
      Harpic: { "Column 1": "Trustworthy", "Column 2": 5 },
    },
  },
];

let visualizer: VisualizationMatrixDropdown;

beforeEach(() => {
  const survey = new SurveyModel(json);
  const question = survey.getQuestionByName("question2");

  visualizer = new VisualizationMatrixDropdown(<any>question, data);
});

test("getQuestions", () => {
  let questions = visualizer.getQuestions();
  expect(questions.length).toBe(3);
  expect(questions[0].name).toBe("Column 1");
  expect(questions[1].name).toBe("Column 2");
  expect(questions[2].name).toBe("Column 3");
});

test("default data fix (add series marker)", () => {
  let qdata: Array<any> = visualizer.contentVisualizer["data"];
  expect(qdata.length).toBe(3);
  expect(qdata).toStrictEqual([
    { "question1": { "Harpic": "Excellent", "Lizol": "Excellent" }, "question2": [{ "Column 1": "Trustworthy", "Column 2": 3, "__sa_series_name": "Lizol" }, { "Column 1": "High Quality", "Column 2": 4, "__sa_series_name": "Harpic" }] },
    { "question1": { "Harpic": "Very Good", "Lizol": "Very Good" }, "question2": [{ "Column 1": "Natural", "Column 2": 3, "__sa_series_name": "Lizol" }, { "Column 1": "Natural", "Column 2": 4, "__sa_series_name": "Harpic" }] },
    { "question1": { "Harpic": "Good", "Lizol": "Very Good" }, "question2": [{ "Column 1": "Natural", "Column 2": 1, "__sa_series_name": "Lizol" }, { "Column 1": "Trustworthy", "Column 2": 5, "__sa_series_name": "Harpic" }] }]);
});

test("series marker is added to data", () => {
  let qdata: Array<any> = visualizer.contentVisualizer["data"];
  expect(qdata.length).toBe(3);
  expect(qdata[0]["question2"][0][DataProvider.seriesMarkerKey]).toBe("Lizol");
  expect(qdata[0]["question2"][1][DataProvider.seriesMarkerKey]).toBe("Harpic");
});

test("series options for inner panel visualizer", () => {
  const innerPanelVisualizer = visualizer.contentVisualizer;
  expect(innerPanelVisualizer.getSeriesValues()).toEqual(
    json.questions[0].rows
  );
  expect(innerPanelVisualizer.getSeriesLabels()).toEqual(
    json.questions[0].rows
  );
});

test("check onAfterRender", () => {
  let count = 0;
  visualizer.onAfterRender.add(() => {
    count++;
  });
  const innerPanelVisualizer: any = visualizer.contentVisualizer;
  innerPanelVisualizer.afterRender();
  expect(count).toEqual(1);
});

test("check default choices - passed from matrixdropdown to default column type", () => {
  let questions = visualizer.getQuestions();
  expect(questions.length).toBe(3);
  const defaultCHoices = questions[2].choices;
  expect(defaultCHoices.length).toBe(3);
  expect(defaultCHoices[0].value).toBe("one");
});

test("update contentVisualizer data if filter has been changed", () => {
  const json = {
    "logoPosition": "right",
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            type: "boolean",
            name: "bool",
            title: "Please answer the question",
            label: "Are you 21 or older?",
            //"valueTrue": "true",
            //"valueFalse": "false",
            labelTrue: "Label True",
            labelFalse: "Label False",
          },
          {
            "type": "matrixdropdown",
            "name": "att_intentions",
            "title": "Select which behavi",
            "columns": [
              {
                "name": "before",
                "title": "LAST 30 DAYS"
              },
              {
                "name": "intent",
                "title": "INT"
              }
            ],
            "choices": [
              {
                "value": "1",
                "text": "Yes"
              }
            ],
            "cellType": "checkbox",
            "rows": [
              {
                "value": "act1",
                "text": "Participa"
              },
              {
                "value": "act2",
                "text": "Donate"
              },
              {
                "value": "act3",
                "text": "Volunteer"
              },
              {
                "value": "act4",
                "text": "Collaborate"
              },
              {
                "value": "act5",
                "text": "Sign"
              },
              {
                "value": "act6",
                "text": "Buy"
              },
              {
                "value": "act7",
                "text": "Use"
              },
              {
                "value": "act8",
                "text": "Walk"
              },
              {
                "value": "act9",
                "text": "Recycle"
              },
              {
                "value": "act10",
                "text": "Conserve"
              },
              {
                "value": "act_add1",
                "text": "Gardening"
              },
              {
                "value": "act_add2",
                "text": "Play"
              },
              {
                "value": "act_add3",
                "text": "Use"
              },
              {
                "value": "act_add4",
                "text": "Spending"
              },
              {
                "value": "act_add5",
                "text": "Visit"
              }
            ]
          }
        ]
      }
    ]
  };
  const survey = new SurveyModel(json);

  const data = [
    {
      bool: true,
      att_intentions: {
        act1: {
          before: ["1"],
          intent: ["1"]
        },
        act2: {
          before: ["1"],
          intent: ["1"]
        },
        act_add1: {
          before: ["1"],
          intent: ["1"]
        }
      },
    }, {
      bool: true,
      att_intentions: {
        act1: {
          before: ["1"],
          intent: ["1"]
        },
        act3: {
          before: ["1"],
          intent: ["1"]
        },
        act_add3: {
          before: ["1"],
          intent: ["1"]
        }
      },
    }, {
      bool: false,
      att_intentions: {
        act1: {
          before: ["1"]
        },
        act2: {
          before: ["1"],
          intent: ["1"]
        },
        act_add1: {
          before: ["1"],
          intent: ["1"]
        }
      },
    }
  ];

  const rootVisualizer = new VisualizationPanel(
    survey.getAllQuestions(),
    data
  );
  const mdVisualizer = rootVisualizer.visualizers[1] as VisualizationMatrixDropdown;

  expect(mdVisualizer.contentVisualizer["data"]).toEqual(data);

  rootVisualizer.setFilter("bool", false);
  expect(mdVisualizer.contentVisualizer["data"]).toEqual([
    { "att_intentions": [{ "__sa_series_name": "act1", "before": ["1"] }, { "__sa_series_name": "act2", "before": ["1"], "intent": ["1"] }, { "__sa_series_name": "act_add1", "before": ["1"], "intent": ["1"] }], "bool": false }]);
});

test("update locale for inner visualizers", () => {
  var jsonLoc = {
    locale: "fr",
    questions: [
      {
        "type": "matrixdropdown",
        "name": "question1",
        title: {
          "default": "question1",
          "fr": "question1 FR"
        },
        "columns": [
          {
            "name": "Column 1", title: {
              "default": "Column 1 text",
              "fr": "Column 1 text FR"
            }
          },
          {
            name: "Column 2", title: {
              "default": "Column 2 text",
              "fr": "Column 2 text FR"
            }
          },
          {
            "name": "Column 3"
          }
        ],
        "choices": [
          {
            value: 1, text: {
              "default": "Choice 1 text",
              "fr": "Choice 1 text FR"
            }
          },
          2,
          3,
          4,
          5
        ],
        "rows": [
          {
            value: "Row 1",
            text: {
              "default": "Row 1 text",
              "fr": "Row 1 text FR"
            }
          },
          "Row 2"
        ]
      }
    ],
  };

  var surveyLoc = new SurveyModel(jsonLoc);

  var options = {
    survey: surveyLoc,
  };

  const rootVisualizer = new VisualizationPanel(
    surveyLoc.getAllQuestions(),
    [],
    options
  );
  const mdVisualizer = rootVisualizer.visualizers[0] as VisualizationMatrixDropdown;
  const innerPanelVisualizer = mdVisualizer.contentVisualizer as VisualizationPanel;
  const firstChart = innerPanelVisualizer.visualizers[0] as SelectBase;

  expect(rootVisualizer.getElements()[0].displayName).toBe("question1 FR");
  expect(innerPanelVisualizer.getElements()[0].displayName).toBe("Column 1 text FR");
  expect(firstChart.getSeriesLabels()).toEqual([
    "Row 1 text FR",
    "Row 2",
  ]);
  expect(firstChart.getLabels()).toEqual([
    "5",
    "4",
    "3",
    "2",
    "Choice 1 text FR",
  ]);

  rootVisualizer.locale = "en";

  expect(rootVisualizer.getElements()[0].displayName).toBe("question1");
  expect(innerPanelVisualizer.getElements()[0].displayName).toBe("Column 1 text");
  expect(firstChart.getSeriesLabels()).toEqual([
    "Row 1 text",
    "Row 2",
  ]);
  expect(firstChart.getLabels()).toEqual([
    "5",
    "4",
    "3",
    "2",
    "Choice 1 text",
  ]);
});

test("canGroupColumns", () => {
  var jsonLoc = {
    "elements": [
      {
        "type": "matrixdropdown",
        "name": "question4",
        "title": "Please select the top 3 processes that you perceived as most difficult or troublesome.",
        "showHeader": false,
        "columns": [
          {
            "name": "1st Most Difficult",
          },
          {
            "name": "2nd Most Difficult",
          },
          {
            "name": "3rd Most Difficult",
          }
        ],
        "choices": [
          "Process 1",
          "Process 2",
          "Process 3",
          "Process 4",
          "Process 5",
          "Process 6"
        ],
        "rows": [
          "Process"
        ]
      }
    ]
  };

  var surveyLoc = new SurveyModel(jsonLoc);

  var options = {
    survey: surveyLoc,
  };

  const rootVisualizer = new VisualizationPanel(
    surveyLoc.getAllQuestions(),
    [],
    options
  );
  const mdVisualizer = rootVisualizer.visualizers[0] as VisualizationMatrixDropdown;
  expect(mdVisualizer.canGroupColumns).toBeTruthy();
});

const matrixDropdownFilterTestJson = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "radiogroup",
          name: "question1",
          choices: ["item1", "item2", "item3"],
        },
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
            {
              name: "Column 2",
              title: "Review Mark",
              choices: [1, 2, 3, 4, 5],
            },
          ],
          rows: ["Lizol", "Harpic"],
        },
      ],
    },
  ],
};
const matrixDropdownFilterTestData = [
  { question1: "item1", question2: { Lizol: { "Column 1": "Trustworthy", "Column 2": 3 }, Harpic: { "Column 1": "High Quality", "Column 2": 4 } } },
  { question1: "item2", question2: { Lizol: { "Column 1": "Natural", "Column 2": 2 }, Harpic: { "Column 1": "Natural", "Column 2": 1 } } },
];

test("filter VisualizationMatrixDropdown data: react on parent data filtering", () => {
  const survey = new SurveyModel(matrixDropdownFilterTestJson);
  const panel = new VisualizationPanel(survey.getAllQuestions(), matrixDropdownFilterTestData);
  const question1Visualizer = panel.visualizers[0] as SelectBase;
  const visualizer = panel.visualizers[1] as VisualizationMatrixDropdown;
  const innerPanelVisualizer = visualizer.contentVisualizer as VisualizationPanel;
  const innerQuestion1Visualizer = innerPanelVisualizer.visualizers[0] as SelectBase;

  expect(question1Visualizer["data"]).toEqual(matrixDropdownFilterTestData);
  expect(visualizer["data"]).toEqual(matrixDropdownFilterTestData);
  expect(innerQuestion1Visualizer["data"]).toEqual(matrixDropdownFilterTestData);

  panel.setFilter("question1", "item1");
  expect(question1Visualizer["data"]).toEqual([
    { "question1": "item1", "question2": [{ "Column 1": "Trustworthy", "Column 2": 3, "__sa_series_name": "Lizol" }, { "Column 1": "High Quality", "Column 2": 4, "__sa_series_name": "Harpic" }] }
  ]);

  panel.resetFilter();
  expect(question1Visualizer["data"]).toEqual(matrixDropdownFilterTestData);
  expect(visualizer["data"]).toEqual(matrixDropdownFilterTestData);
  expect(innerQuestion1Visualizer["data"]).toEqual(matrixDropdownFilterTestData);
});

test("filter VisualizationMatrixDropdown data: pass filter to outside", () => {
  const survey = new SurveyModel(matrixDropdownFilterTestJson);
  const panel = new VisualizationPanel(survey.getAllQuestions(), matrixDropdownFilterTestData);
  const question1Visualizer = panel.visualizers[0] as SelectBase;
  const visualizer = panel.visualizers[1] as VisualizationMatrixDropdown;
  const innerPanelVisualizer = visualizer.contentVisualizer as VisualizationPanel;
  const innerQuestion1Visualizer = innerPanelVisualizer.visualizers[0] as SelectBase;

  expect(question1Visualizer["data"]).toEqual(matrixDropdownFilterTestData);
  expect(visualizer["data"]).toEqual(matrixDropdownFilterTestData);
  expect(innerQuestion1Visualizer["data"]).toEqual(matrixDropdownFilterTestData);

  const expectedFilteredData = [
    { "question1": "item1", "question2": [{ "Column 1": "Trustworthy", "Column 2": 3, "__sa_series_name": "Lizol" }, { "Column 1": "High Quality", "Column 2": 4, "__sa_series_name": "Harpic" }] }
  ];
  innerPanelVisualizer.setFilter("Column 1", "Trustworthy");
  expect(innerQuestion1Visualizer["data"]).toEqual(expectedFilteredData);
  expect(visualizer["data"]).toEqual(expectedFilteredData);
  expect(question1Visualizer["data"]).toEqual(expectedFilteredData);

  panel.resetFilter();
  expect(question1Visualizer["data"]).toEqual(matrixDropdownFilterTestData);
  expect(visualizer["data"]).toEqual(matrixDropdownFilterTestData);
  expect(innerQuestion1Visualizer["data"]).toEqual(matrixDropdownFilterTestData);

  panel.setFilter("question2", { "Column 1": "Trustworthy" });
  expect(innerQuestion1Visualizer["data"]).toEqual(expectedFilteredData);
  expect(visualizer["data"]).toEqual(expectedFilteredData);
  expect(question1Visualizer["data"]).toEqual(expectedFilteredData);

  innerPanelVisualizer.setFilter("Column 1", undefined);
  expect(question1Visualizer["data"]).toEqual(matrixDropdownFilterTestData);
  expect(visualizer["data"]).toEqual(matrixDropdownFilterTestData);
  expect(innerQuestion1Visualizer["data"]).toEqual(matrixDropdownFilterTestData);
});

test("TypeError: Cannot read properties of undefined (reading 'length') is thrown when a survey contains a Multi-Select Matrix - https://github.com/surveyjs/survey-analytics/issues/685 ", () => {
  const survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "matrixdropdown",
            name: "question1",
            columns: [
              {
                name: "Column 1",
                cellType: "text",
              },
              {
                name: "Column 2",
              },
              {
                name: "Column 3",
              },
            ],
            choices: [1, 2, 3, 4, 5],
            rows: ["Row 1"],
          },
        ],
      },
    ],
  });
  const panel = new VisualizationPanel(survey.getAllQuestions(), []);
  const question1Visualizer = panel.visualizers[0] as VisualizationMatrixDropdown;
  expect(question1Visualizer).toBeDefined();
});