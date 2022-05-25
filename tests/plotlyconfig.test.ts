jest.mock("plotly.js", () => { }, { virtual: true });
(<any>global).URL.createObjectURL = jest.fn();

import { PlotlySetup } from "../src/plotly/setup";
import { SelectBasePlotly } from "../src/plotly/selectBase";
import { QuestionDropdownModel, QuestionMatrixModel, QuestionSelectBase } from "survey-core";
import { Matrix } from "../src/matrix";

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

test("check bar height with different numbers of choices", () => {
  var config = PlotlySetup.setupBar(selectBase);
  expect(config.layout.height).toEqual(270);
  (<QuestionSelectBase>selectBase.question).choices = [
    { value: "add1" },
    { value: "add2" },
    { value: "add3" },
    { value: "add4" },
    { value: "add5" },
  ].concat(choices);
  var config = PlotlySetup.setupBar(selectBase);
  expect(config.layout.height).toEqual(420);
  (<QuestionSelectBase>selectBase.question).choices = choices;
});

test("check bar config with showPercentages", () => {
  (<any>selectBase)._showPercentages = true;
  var config = PlotlySetup.setupBar(selectBase);
  expect([config.traces[0].text]).toEqual(selectBase.getPercentages());
  expect(config.traces[0].width).toBe(0.9);
  expect(config.traces[0].textposition).toBe("inside");
  expect(config.traces[0].texttemplate).toBe("%{value} (%{text}%)");
  (<any>selectBase)._showPercentages = false;
});

test("check bar config tick labels", () => {
  (<any>selectBase)._showPercentages = true;
  const labelTruncateLength = selectBase.options.labelTruncateLength;
  selectBase.options.labelTruncateLength = 5;
  const config = PlotlySetup.setupBar(selectBase);

  const fullTexts = [
    "father_text",
    "mother_text",
    "brother_text",
    "sister_text",
    "son_text",
    "daughter_text"
  ].reverse();
  const truncatedTexts = [
    "fathe...",
    "mothe...",
    "broth...",
    "siste...",
    "son_text",
    "daugh..."
  ].reverse();
  const hoverTexts = [
    "50, father_text",
    "25, mother_text",
    "0, brother_text",
    "25, sister_text",
    "0, son_text",
    "0, daughter_text"
  ].reverse();

  expect(config.traces[0].y).toEqual(fullTexts);
  expect(config.layout.yaxis.tickvals).toEqual(fullTexts);
  expect(config.layout.yaxis.ticktext).toEqual(truncatedTexts);
  expect(config.traces[0].hovertext).toEqual(hoverTexts);

  selectBase.options.labelTruncateLength = labelTruncateLength;
});

test("check matrix config hovertexts", () => {
  let matrixQuestion = new QuestionMatrixModel("question1");
  matrixQuestion.fromJSON(matrixJson);

  let matrixVisualizer = new Matrix(matrixQuestion, matrixData, {});
  var config = PlotlySetup.setupBar(matrixVisualizer);

  expect(config.traces[2].hovertext.length).toEqual(2);
  expect(config.traces[2].hovertext[0]).toEqual("Lizol : Fair, 0");
  expect(config.traces[2].hovertext[1]).toEqual("Harpic : Fair, 0");
});

test("check bar config with non default label ordering", () => {
  selectBase.answersOrder = "desc";
  var config = PlotlySetup.setupBar(selectBase);
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

test("check bar config with non default label ordering and enabled showPercentages flag", () => {
  selectBase.answersOrder = "desc";
  selectBase.showPercentages = true;
  var config = PlotlySetup.setupBar(selectBase);
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

  var config = PlotlySetup.setupBar(selectBase);
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

test("check bar height with hasSeries equals true", () => {
  var config = PlotlySetup.setupBar(matrix);
  expect(config.layout.height).toEqual(480);

  //increase count of columns
  matrixJson.columns.push("add1");
  let moreColsMatrixQuestion = new QuestionMatrixModel("question1");
  moreColsMatrixQuestion.fromJSON(matrixJson);
  let moreColsMatrix = new Matrix(moreColsMatrixQuestion, matrixData, {});
  var config = PlotlySetup.setupBar(moreColsMatrix);
  expect(config.layout.height).toEqual(540);
  matrixJson.columns.pop();

  //increase count of rows
  matrixJson.rows.push("add1");
  let moreRowsMatrixQuestion = new QuestionMatrixModel("question1");
  moreRowsMatrixQuestion.fromJSON(matrixJson);
  let moreRowsMatrix = new Matrix(moreRowsMatrixQuestion, matrixData, {});
  config = PlotlySetup.setupBar(moreRowsMatrix);
  expect(config.layout.height).toEqual(690);
  matrixJson.rows.pop();
});

test("check bar width with hasSeries equal true", () => {
  var config = PlotlySetup.setupBar(matrix);
  expect(config.traces[0].width).toEqual(0.5 / 6);
  (<any>matrix)._showPercentages = true;
  config = PlotlySetup.setupBar(matrix);
  expect(config.traces[0].width).toEqual(0.7 / 6);
  (<any>matrix)._showPercentages = false;
});

test("check bar width with hasSeries and showPercentages equal true", () => {
  matrixJson.columns.push("add1");
  let moreColsMatrixQuestion = new QuestionMatrixModel("question1");
  moreColsMatrixQuestion.fromJSON(matrixJson);
  let moreColsMatrix = new Matrix(moreColsMatrixQuestion, matrixData, {});
  var config = PlotlySetup.setupBar(moreColsMatrix);
  expect(config.traces[0].width).toEqual(0.5 / 7);
  (<any>moreColsMatrix)._showPercentages = true;
  config = PlotlySetup.setupBar(moreColsMatrix);
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
