const { initSummary, url, getYAxisValues } = require("../settings");
const { Selector, ClientFunction } = require("testcafe");
const assert = require("assert");
var json = {
  elements: [
    {
      type: "matrix",
      name: "matrix",
      title: "Matrix question",
      hasOther: true,
      otherText: "Other",
      columns: [
        { value: "column1", text: "Column 1" },
        { value: "column2", text: "Column 2" },
      ],
      rows: [
        { value: "row1", text: "Row 1" },
        { value: "row2", text: "Row 2" },
      ],
    },
  ],
};

var data = [
  {
    matrix: { row1: "column1", row2: "column2" },
  },
  {
    matrix: { row1: "column1", row2: "column2" },
  },
  {
    matrix: { row1: "column2", row2: "column1" },
  },
];

var options = {
  allowShowPercentages: true,
};

fixture`matrix`.page`${url}`.beforeEach(async (t) => {
  await t.resizeWindow(1920, 1080);
  await initSummary(json, data, options);
});

const getLegendValues = ClientFunction(() => {
  var legendValues = [];
  document.querySelectorAll(".legend .traces text").forEach((el) => {
    legendValues.push(el.getAttribute("data-unformatted"));
  });
  return legendValues;
});
//data filtering is not working now - See #91
test.skip("check data filtering", async (t) => { });

//Rows uses text instead of values
test.skip("check use values as labels for rows", async (t) => {
  assert.deepEqual(await getYAxisValues(), ["Row 1", "Row 2"]);
  var options = { useValuesAsLabels: true };
  await initSummary(json, data, options);
  assert.deepEqual(await getYAxisValues(), ["row1", "row2"]);
});

test("check use values as labels for columns", async (t) => {
  assert.deepEqual(await getLegendValues(), ["Column 1", "Column 2"].reverse());
  var options = { useValuesAsLabels: true };
  await initSummary(json, data, options);
  assert.deepEqual(await getLegendValues(), ["column1", "column2"].reverse());
});

test("check show/hide percentages", async (t) => {
  var getValuesInsideBars = ClientFunction((traceNo) => {
    var values = [];
    document
      .querySelectorAll(`.trace.bars:nth-of-type(${traceNo}) .point text`)
      .forEach((el) => {
        values.push(el.getAttribute("data-unformatted"));
      });
    return values;
  });

  //check that percentages aren't shown
  await t.expect(Selector(".trace.bars .point text").exists).notOk();

  //check that percentages are shown when button is clicked
  await t.click(Selector("span").withText("Show percentages"));
  assert.deepEqual(await getValuesInsideBars(1), ["2 (67%)", "1 (33%)"].reverse());
  assert.deepEqual(await getValuesInsideBars(2), ["1 (33%)", "2 (67%)"].reverse());

  //check that percentage are hided when button is double-clicked
  await t.click(Selector("span").withText("Hide percentages"));
  await t.expect(Selector(".trace.bars .point text").exists).notOk();
});
