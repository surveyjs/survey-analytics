jest.mock("plotly.js", () => { }, { virtual: true });
jest.mock("plotly.js-dist-min", () => ({ default: { Icons: {}, react: () => { } } }), { virtual: true });
(<any>global).URL.createObjectURL = jest.fn();

import { PlotlySetup } from "../src/plotly/setup";
import { SelectBasePlotly, MatrixPlotly } from "../src/plotly/legacy";
import { QuestionDropdownModel, QuestionMatrixDropdownModel, QuestionMatrixModel, QuestionSelectBase, QuestionRatingModel, SurveyModel } from "survey-core";
import { Matrix } from "../src/matrix";
import { localization } from "../src/localizationManager";
import { VisualizationMatrixDropdown } from "../src/visualizationMatrixDropdown";
import { VisualizationPanel } from "../src/visualizationPanel";
import { SelectBase } from "../src/selectBase";
import { NumberModel } from "../src/number";
import { PlotlyChartAdapter } from "../src/plotly/chart-adapter";
import { VisualizerBase } from "../src/visualizerBase";

VisualizerBase.chartAdapterType = PlotlyChartAdapter;

let choices = [
  { value: "father", text: "father_text" },
  { value: "mother", text: "mother_text" },
  { value: "brother", text: "brother_text" },
  { value: "sister", text: "sister_text" },
  { value: "son", text: "son_text" },
  { value: "daughter", text: "daughter_text" },
];
var question = new QuestionDropdownModel("q1");
question.choices = choices;
var data = [
  {
    q1: "mother",
  },
  {
    q1: "father",
  },
  {
    q1: "father",
  },
  {
    q1: "sister",
  },
];
var selectBase = new SelectBasePlotly(question, data, {});

test("check bar height with different numbers of choices", async () => {
  var config = PlotlySetup.setupBar(selectBase, await selectBase.getAnswersData());
  expect(config.layout.height).toEqual(270);
  (<QuestionSelectBase>selectBase.question).choices = [
    { value: "add1" },
    { value: "add2" },
    { value: "add3" },
    { value: "add4" },
    { value: "add5" },
  ].concat(choices);
  var config = PlotlySetup.setupBar(selectBase, await selectBase.getAnswersData());
  expect(config.layout.height).toEqual(420);
  (<QuestionSelectBase>selectBase.question).choices = choices;
});

test("check bar config with showPercentages", async () => {
  (<any>selectBase)._showPercentages = true;
  var config = PlotlySetup.setupBar(selectBase, await selectBase.getAnswersData());
  expect([config.traces[0].text]).toEqual(selectBase.getPercentages((await selectBase.getAnswersData()).datasets));
  expect(config.traces[0].width).toBe(0.9);
  expect(config.traces[0].textposition).toBe("inside");
  expect(config.traces[0].texttemplate).toBe("%{value} (%{text}%)");
  (<any>selectBase)._showPercentages = false;
});

test("check bar config tick labels", async () => {
  selectBase.showPercentages = true;
  // selectBase.showOnlyPercentages = true;
  const labelTruncateLength = selectBase.labelTruncateLength;
  selectBase.labelTruncateLength = 5;
  const config = PlotlySetup.setupBar(selectBase, await selectBase.getAnswersData());

  const fullTexts = [
    "father_text",
    "mother_text",
    "brother_text",
    "sister_text",
    "son_text",
    "daughter_text"
  ].reverse();
  const truncatedTexts = [
    "fathe...  ",
    "mothe...  ",
    "broth...  ",
    "siste...  ",
    "son_text  ",
    "daugh...  "
  ].reverse();
  const hoverTexts = [
    "50%, father_text",
    "25%, mother_text",
    "0%, brother_text",
    "25%, sister_text",
    "0%, son_text",
    "0%, daughter_text"
  ].reverse();

  expect(config.traces[0].y).toEqual(fullTexts);
  expect(config.layout.yaxis.tickvals).toEqual(fullTexts);
  expect(config.layout.yaxis.ticktext).toEqual(truncatedTexts);
  expect(config.traces[0].hovertext).toEqual(hoverTexts);

  selectBase.labelTruncateLength = labelTruncateLength;
  selectBase.showPercentages = false;
});

test("check matrix config hovertexts", async () => {
  let matrixQuestion = new QuestionMatrixModel("question1");
  matrixQuestion.fromJSON(matrixJson);

  let matrixVisualizer = new Matrix(matrixQuestion, matrixData, {});
  matrixVisualizer.transposeData = false;
  var config = PlotlySetup.setupBar(matrixVisualizer, await matrixVisualizer.getAnswersData());

  expect(config.traces.length).toEqual(2);
  expect(config.traces[0].hovertext.length).toEqual(6);
  expect(config.traces[0].hovertext[0]).toEqual("Lizol : Poor, 0");
  expect(config.traces[0].hovertext[1]).toEqual("Lizol : Neither Fair Nor Poor, 0");
  expect(config.traces[0].hovertext[2]).toEqual("Lizol : Fair, 0");
  expect(config.traces[0].hovertext[3]).toEqual("Lizol : Good, 0");
  expect(config.traces[0].hovertext[4]).toEqual("Lizol : Very Good, 2");
  expect(config.traces[0].hovertext[5]).toEqual("Lizol : Excellent, 1");
  expect(config.traces[1].hovertext[0]).toEqual("Harpic : Poor, 0");
  expect(config.traces[1].hovertext[1]).toEqual("Harpic : Neither Fair Nor Poor, 0");
  expect(config.traces[1].hovertext[2]).toEqual("Harpic : Fair, 0");
  expect(config.traces[1].hovertext[3]).toEqual("Harpic : Good, 1");
  expect(config.traces[1].hovertext[4]).toEqual("Harpic : Very Good, 1");
  expect(config.traces[1].hovertext[5]).toEqual("Harpic : Excellent, 1");
});

test("check bar config with non default label ordering", async () => {
  selectBase.answersOrder = "desc";
  var config = PlotlySetup.setupBar(selectBase, await selectBase.getAnswersData());
  var trueColors = [
    "#86e1fb",
    "#3999fb",
    "#1eb496",
    "#ff6771",
    "#ffc152",
    "#aba1ff",
  ];
  var trueY = [
    "daughter_text",
    "son_text",
    "brother_text",
    "sister_text",
    "mother_text",
    "father_text",
  ];
  var trueX = [0, 0, 0, 1, 1, 2];
  expect(config.traces[0].x).toEqual(trueX);
  expect(config.traces[0].y).toEqual(trueY);
  expect(config.traces[0].marker.color).toEqual(trueColors);
  selectBase.answersOrder = "default";
});

test("check bar config with non default label ordering and enabled showPercentages flag", async () => {
  selectBase.answersOrder = "desc";
  selectBase.showPercentages = true;
  var config = PlotlySetup.setupBar(selectBase, await selectBase.getAnswersData());
  var trueColors = [
    "#86e1fb",
    "#3999fb",
    "#1eb496",
    "#ff6771",
    "#ffc152",
    "#aba1ff",
  ];
  var trueY = [
    "daughter_text",
    "son_text",
    "brother_text",
    "sister_text",
    "mother_text",
    "father_text",
  ];
  var truePercentages = [0, 0, 0, 25, 25, 50];
  var trueX = [0, 0, 0, 1, 1, 2];

  expect(config.traces[0].x).toEqual(trueX);
  expect(config.traces[0].y).toEqual(trueY);
  expect(config.traces[0].marker.color).toEqual(trueColors);
  expect(config.traces[0].text).toEqual(truePercentages);

  selectBase.answersOrder = "asc";
  var config = PlotlySetup.setupBar(selectBase, await selectBase.getAnswersData());
  expect(config.traces[0].x).toEqual(trueX.reverse());
  expect(config.traces[0].y).toEqual([
    "father_text",
    "sister_text",
    "mother_text",
    "daughter_text",
    "son_text",
    "brother_text",
  ]);
  expect(config.traces[0].marker.color).toEqual([
    "#aba1ff",
    "#ff6771",
    "#ffc152",
    "#86e1fb",
    "#3999fb",
    "#1eb496",
  ]);
  expect(config.traces[0].text).toEqual(truePercentages.reverse());

  selectBase.answersOrder = "default";
  selectBase.showPercentages = false;
});

const matrixJson = {
  type: "matrix",
  name: "question1",
  title: "What is your perception of these brands?",
  columns: [
    "Excellent",
    "Very Good",
    "Good",
    "Fair",
    "Neither Fair Nor Poor",
    "Poor",
  ],
  rows: ["Lizol", "Harpic"],
};

let matrixQuestion = new QuestionMatrixModel("question1");
matrixQuestion.fromJSON(matrixJson);
var matrixData = [
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
let matrix = new Matrix(matrixQuestion, matrixData, {});

test("check bar height with hasSeries equals true", async () => {
  var config = PlotlySetup.setupBar(matrix, await matrix.getAnswersData());
  expect(config.layout.height).toEqual(450);

  //increase count of columns
  matrixJson.columns.push("add1");
  let moreColsMatrixQuestion = new QuestionMatrixModel("question1");
  moreColsMatrixQuestion.fromJSON(matrixJson);
  let moreColsMatrix = new Matrix(moreColsMatrixQuestion, matrixData, {});
  var config = PlotlySetup.setupBar(moreColsMatrix, await moreColsMatrix.getAnswersData());
  expect(config.layout.height).toEqual(510);
  matrixJson.columns.pop();

  //increase count of rows
  matrixJson.rows.push("add1");
  let moreRowsMatrixQuestion = new QuestionMatrixModel("question1");
  moreRowsMatrixQuestion.fromJSON(matrixJson);
  let moreRowsMatrix = new Matrix(moreRowsMatrixQuestion, matrixData, {});
  config = PlotlySetup.setupBar(moreRowsMatrix, await moreRowsMatrix.getAnswersData());
  expect(config.layout.height).toEqual(630);
  matrixJson.rows.pop();
});

test("check bar width with hasSeries equal true", async () => {
  var config = PlotlySetup.setupBar(matrix, await matrix.getAnswersData());
  expect(config.traces[0].width).toEqual(0.5 / 6);
  (<any>matrix)._showPercentages = true;
  config = PlotlySetup.setupBar(matrix, await matrix.getAnswersData());
  expect(config.traces[0].width).toEqual(0.7 / 6);
  (<any>matrix)._showPercentages = false;
});

test("check bar width with hasSeries and showPercentages equal true", async () => {
  matrixJson.columns.push("add1");
  let moreColsMatrixQuestion = new QuestionMatrixModel("question1");
  moreColsMatrixQuestion.fromJSON(matrixJson);
  let moreColsMatrix = new Matrix(moreColsMatrixQuestion, matrixData, {});
  var config = PlotlySetup.setupBar(moreColsMatrix, await moreColsMatrix.getAnswersData());
  expect(config.traces[0].width).toEqual(0.5 / 7);
  (<any>moreColsMatrix)._showPercentages = true;
  config = PlotlySetup.setupBar(moreColsMatrix, await moreColsMatrix.getAnswersData());
  expect(config.traces[0].width).toEqual(0.7 / 7);
  matrixJson.columns.pop();
});

test("getTruncatedLabel method", () => {
  const label = "Some very very very very long string for unit testing !";

  expect(PlotlySetup.getTruncatedLabel(label, -1).length).toBe(55);
  expect(PlotlySetup.getTruncatedLabel(label, null).length).toBe(55);
  expect(PlotlySetup.getTruncatedLabel(label, 125).length).toBe(55);

  expect(PlotlySetup.getTruncatedLabel(label, 5).indexOf("...")).not.toBe(-1);
  expect(PlotlySetup.getTruncatedLabel(label, 5).length).toBe(8);

  expect(PlotlySetup.getTruncatedLabel(label, 50).indexOf("...")).not.toBe(-1);
  expect(PlotlySetup.getTruncatedLabel(label, 50).length).toBe(53);
});

test("y axis type - https://github.com/surveyjs/survey-analytics/issues/241", async () => {
  var config = PlotlySetup.setupBar(selectBase, await selectBase.getAnswersData());
  expect(config.layout.yaxis.type).toEqual("category");
});

test("check hasSeries in stacked bar for matrix with single row", async () => {
  const matrixQuestion = new QuestionMatrixModel("question1");
  matrixQuestion.fromJSON({
    "name": "Quality",
    "title": "Please indicate if you agree or disagree with the following statements",
    "columns": [
      {
        "value": 1,
        "text": "Strongly Disagree"
      },
      {
        "value": 2,
        "text": "Disagree"
      },
      {
        "value": 3,
        "text": "Neutral"
      },
      {
        "value": 4,
        "text": "Agree"
      },
      {
        "value": 5,
        "text": "Strongly Agree"
      }
    ],
    "rows": [
      {
        "value": "affordable",
        "text": "Product is affordable"
      }
    ]
  });
  const matrixVisualizer = new MatrixPlotly(matrixQuestion, []);
  matrixVisualizer.chartType = "stackedbar";
  let config = PlotlySetup.setupBar(matrixVisualizer, await matrixVisualizer.getAnswersData());
  expect(config.layout.barmode).toEqual("stack");
  expect(config.layout.showlegend).toBeTruthy();
});

test("left non-empty pies only and reduce chart area to fit them", async () => {
  const matrixQuestion = new QuestionMatrixModel("question1");
  matrixQuestion.fromJSON({
    "name": "Quality",
    "title": "Please indicate if you agree or disagree with the following statements",
    "columns": [
      {
        "value": 1,
        "text": "Strongly Disagree"
      },
      {
        "value": 2,
        "text": "Disagree"
      },
      {
        "value": 3,
        "text": "Neutral"
      },
      {
        "value": 4,
        "text": "Agree"
      },
      {
        "value": 5,
        "text": "Strongly Agree"
      }
    ],
    "rows": [
      {
        "value": "affordable",
        "text": "Product is affordable"
      }
    ]
  });
  const matrixVisualizer = new MatrixPlotly(matrixQuestion, [
    {
      Quality: {
        affordable: "3",
      },
    },
    {
      Quality: {
        affordable: "3",
      },
    },
    {
      Quality: {
        affordable: "5",
      },
    },
  ]);
  matrixVisualizer.chartType = "pie";
  matrixVisualizer.transposeData = true;
  let config = PlotlySetup.setupPie(matrixVisualizer, await matrixVisualizer.getAnswersData());
  expect(config.traces.length).toEqual(2);
  expect(config.traces[0].domain).toStrictEqual({ "column": 0, "row": 0 });
  expect(config.traces[1].domain).toStrictEqual({ "column": 1, "row": 0 });
  expect(config.layout.grid).toStrictEqual({ "columns": 2, "rows": 1 });
  expect(config.layout.height).toBe(175);
  matrixVisualizer.transposeData = false;
  config = PlotlySetup.setupPie(matrixVisualizer, await matrixVisualizer.getAnswersData());
  expect(config.traces.length).toEqual(1);
  expect(config.traces[0].domain).toStrictEqual({ "column": 0, "row": 0 });
  expect(config.layout.grid).toStrictEqual({ "columns": 2, "rows": 1 });
  expect(config.layout.height).toBe(375);
});

test("check bar axes RTL setup", async () => {
  const prevLocale = localization.currentLocale;
  localization.currentLocale = "ar";
  var config = PlotlySetup.setupBar(matrix, await matrix.getAnswersData());

  expect(config.layout.xaxis.autorange).toBe("reversed");
  expect(config.layout.yaxis.side).toBe("right");
  expect(config.layout.legend).toStrictEqual({
    x: 0,
    y: 1,
    xanchor: "left",
    yanchor: "top"
  });
});

test("VisualizationMatrixDropdown stackedbar chart height", async () => {
  const question = new QuestionMatrixDropdownModel("q1");
  question.fromJSON({
    type: "matrixdropdown",
    name: "question1",
    columns: [
      {
        name: "Column 1",
        cellType: "checkbox",
        choices: [
          {
            value: "s1",
            text: "Status 1",
          },
          {
            value: "s2",
            text: "Status 2",
          },
          {
            value: "s3",
            text: "Status 3",
          },
          {
            value: "s4",
            text: "Status 4",
          },
        ],
      },
    ],
    choices: [1, 2, 3, 4, 5],
    rows: [
      "Row 1",
      "Row 2",
      "Row 3",
      "Row 4",
      "Row 5",
      "Row 6",
      "Row 7",
      "Row 8",
      "Row 9",
      "Row 10",
      "Row 11",
      "Row 12",
      "Row 13",
      "Row 14",
      "Row 15",
      "Row 16",
      "Row 17",
      "Row 18",
      "Row 19",
      "Row 20",
      "Row 21",
      "Row 22",
      "Row 23",
    ],
  });
  const visualizer = new VisualizationMatrixDropdown(question, []);
  const selectBase = (visualizer.contentVisualizer as VisualizationPanel).visualizers[0] as SelectBase;
  selectBase.chartType = "stackedbar";
  const config = PlotlySetup.setupBar(selectBase, await selectBase.getAnswersData());
  expect(config.layout.height).toEqual(780);
});

test("SelectBase null ref #394", async () => {
  var survey = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "matrixdropdown",
            "name": "q1",
            "columns": [
              {
                "name": "Colonne 1",
                "title": "Nombre de fois",
                "choices": [
                  {
                    "value": "0",
                    "text": "Jamais ou moins d'une fois par mois",
                  },
                  {
                    "value": "1",
                    "text": "1 fois"
                  },
                  {
                    "value": "2",
                    "text": "2 fois"
                  },
                ],
              },
              {
                "name": "Colonne 2",
                "title": "Par jour, semaine ou mois",
                "choices": [
                  {
                    "value": "Z",
                    "text": "Jamais ou moins d'une fois par mois",
                  },
                  {
                    "value": "J",
                    "text": "Par jour",
                  },
                ],
              }
            ],
            "rows": [
              {
                "value": "Row1",
                "text": "Row 1:"
              }
            ]
          }
        ],
      }
    ]
  });
  const matrixDropdown: QuestionMatrixDropdownModel = survey.getQuestionByName("q1") as any;
  const sbp = new SelectBasePlotly(matrixDropdown.columns[0].templateQuestion, []); // keep it to register visualizer
  const matrixVisualizer = new VisualizationMatrixDropdown(matrixDropdown, []);
  const innerVisPanel = matrixVisualizer.contentVisualizer as VisualizationPanel;
  const selectBase = innerVisPanel.getVisualizer("Colonne 1") as SelectBasePlotly;
  try {
    var plotlyOptions = PlotlySetup.setup("bar", selectBase, await selectBase.getAnswersData());
    expect(plotlyOptions).toBeDefined();
  } catch(e) {
    expect(e).toBeUndefined();
  }
});

test("data is present in onPlotCreating options", async () => {
  const ratingQuestion = new QuestionRatingModel("q1");
  const numberModel = new NumberModel(ratingQuestion, [{ q1: 2 }, { q1: 4 }, { q1: 9 }], {});
  let lastData: any = undefined;
  let callCount = 0;
  const creatingHandler = (sender, options) => {
    lastData = options.data;
    callCount++;
  };
  PlotlySetup.onPlotCreating.add(creatingHandler);
  await (numberModel as any)._chartAdapter.update({ appendChild: jest.fn(), on: jest.fn() });
  expect(callCount).toBe(1);
  expect(lastData).toEqual([5, 2, 9]);
});