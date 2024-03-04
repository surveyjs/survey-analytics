const { initSummary, url, RGBToHex, getYAxisValues } = require("../settings");
const { Selector, ClientFunction } = require("testcafe");
const assert = require("assert");
var json = {
  elements: [
    {
      type: "radiogroup",
      name: "radio",
      title: "Radiogroup question",
      hasOther: true,
      otherText: "Other",
      choices: [
        { value: 1, text: "One" },
        { value: 2, text: "Two" },
      ],
    },
  ],
};

var data = [
  {
    radio: 1,
  },
  {
    radio: 1,
  },

  { radio: 2 },
  { radio: "other", "radio-Comment": "Comment text" },
  { radio: "other", "radio-Comment": "Another comment text" },
];

var options = {
  allowShowPercentages: true,
};

fixture`selectbase`.page`${url}`.beforeEach(async (t) => {
  await t.resizeWindow(1920, 1080);
  await initSummary(json, data, options);
});

test("check data filtering", async (t) => {
  var isBarVisible = ClientFunction((no) => {
    return !!document
      .querySelector(`.trace.bars .point:nth-child(${no})`)
      .getBoundingClientRect().width;
  });
  //check data filtering for regular choice
  await t.click(Selector(".trace.bars .point:nth-child(2)")); //selector for choice with value 1
  assert.ok(!(await isBarVisible(3)));
  assert.ok(!(await isBarVisible(1)));
  assert.ok(await isBarVisible(2));

  await t.click(Selector("span").withText("Clear"));
  assert.ok(await isBarVisible(3));
  assert.ok(await isBarVisible(2));
  assert.ok(await isBarVisible(1));

  //check data filtering for other choice
  await t.click(Selector(".trace.bars .point:nth-child(1)")); //selector for 'other' choice
  assert.ok(!(await isBarVisible(3)));
  assert.ok(!(await isBarVisible(2)));
  assert.ok(await isBarVisible(1));
  await t.click(Selector("span").withText("Clear"));
  assert.ok(await isBarVisible(3));
  assert.ok(await isBarVisible(2));
  assert.ok(await isBarVisible(1));
});

test.skip("check use values as labels", async (t) => {
  var options = { useValuesAsLabels: true };
  await initSummary(json, data, options);
  var yAxisValues = await getYAxisValues();
  await t.expect(yAxisValues).eql(["other", "1", "2"]);
});

test("check show/hide percentages", async (t) => {
  var getValuesInsideBars = ClientFunction(() => {
    var values = [];
    document.querySelectorAll(".trace.bars .point text").forEach((el) => {
      values.push(el.getAttribute("data-unformatted"));
    });
    return values;
  });

  //check that percentages aren't shown
  await t.expect(Selector(".trace.bars .point text").exists).notOk();

  //check that percentages are shown when button is clicked
  await t.click(Selector("span").withText("Show percentages"));
  var valuesInsideBars = await getValuesInsideBars();
  await t.expect(valuesInsideBars).eql(["2 (40%)", "1 (20%)", "2 (40%)"]);

  //check that percentage are hided when button is double-clicked
  await t.click(Selector("span").withText("Hide percentages"));
  await t.expect(Selector(".trace.bars .point text").exists).notOk();
});

test("check comment actions", async (t) => {
  var getTableCells = ClientFunction(() => {
    var cells = [];
    document.querySelectorAll(".sa-text-table tr td").forEach((td) => {
      cells.push(td.innerHTML);
    });
    return cells;
  });

  //check that comment's footer doesn't exists
  await t.expect(Selector("sa-visualizer__footer-content").exists).notOk();

  //check comment's actions
  await t
    .click(Selector(".sa-visualizer__footer span").withText("Show"))
    .expect(Selector(".sa-visualizer__footer-content").exists)
    .ok();

  //check that wordcloud exists
  await t.expect(Selector(".sa-visualizer__footer-content .sa-visualizer-wordcloud").exists).ok();

  //check comment's table
  await t
    .click(
      Selector(".sa-visualizer__footer-content .sa-question__select").withText(
        "Texts in table"
      )
    )
    .click(
      Selector(
        ".sa-visualizer__footer-content .sa-question__select option"
      ).withText("Texts in table")
    );

  var cells = await getTableCells();
  await t.expect(cells).eql(["Comment text", "Another comment text"]);

  //check that comment's footer is hided
  await t
    .click(Selector(".sa-visualizer__footer span").withText("Hide"))
    .expect(Selector(".sa-visualizer__footer-content").visible)
    .notOk();
});

test("check sign when there is no comment data", async (t) => {
  var data = [{ radio: 1 }];
  await initSummary(json, data, options);
  await t
    .expect(
      Selector(".sa-visualizer__footer p").withText("There are no results yet")
        .exists
    )
    .ok();
});

test("check that footer has no childs with false hasOther and hasComment", async (t) => {
  var json = {
    elements: [
      {
        type: "radiogroup",
        name: "radio",
        choices: [{ value: 1 }],
      },
    ],
  };
  var data = [{ radio: 1 }];
  await initSummary(json, data, options);
  await t.expect(Selector(".sa-visualizer__footer").child().count).eql(0);
});

test("check ordering", async (t) => {
  const getColorsOrder = ClientFunction(() => {
    var colors = [];
    document.querySelectorAll(".trace.bars .point path").forEach((el) => {
      colors.push(el.style.fill);
    });
    return colors;
  });

  const clickSelectOption = async (text) => {
    await t
      .click(Selector(".sa-question__select").withText(text))
      .click(Selector(Selector(".sa-question__select option").withText(text)));
  };

  await initSummary(json, data.concat({ radio: 1 }), options);

  //check default order
  assert.deepEqual(await getYAxisValues(), ["Other  ", "Two  ", "One  "]);
  assert.deepEqual(
    (await getColorsOrder()).map((color) => {
      return RGBToHex(color);
    }),
    ["#86e1fb", "#3999fb", "#ff6771"]
  );

  //check ascending order
  await clickSelectOption("Ascending");
  assert.deepEqual(await getYAxisValues(), ["One  ", "Other  ", "Two  "]);
  assert.deepEqual(
    (await getColorsOrder()).map((color) => {
      return RGBToHex(color);
    }),
    ["#ff6771", "#86e1fb", "#3999fb"]
  );

  //check descending order
  await clickSelectOption("Descending");
  assert.deepEqual(await getYAxisValues(), ["Two  ", "Other  ", "One  "]);
  assert.deepEqual(
    (await getColorsOrder()).map((color) => {
      return RGBToHex(color);
    }),
    ["#3999fb", "#86e1fb", "#ff6771"]);
});
