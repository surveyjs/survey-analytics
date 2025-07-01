import { test, expect, Page } from "@playwright/test";
import { url_summary, initSummary, RGBToHex, getYAxisValues } from "../helper";

let json = {
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

let data = [
  { radio: 1 },
  { radio: 1 },
  { radio: 2 },
  { radio: "other", "radio-Comment": "Comment text" },
  { radio: "other", "radio-Comment": "Another comment text" },
];

let options = {
  allowShowPercentages: true,
};

test.describe("selectbase", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(url_summary);
  });

  test("check data filtering", async ({ page }) => {
    const isBarVisible = async (no: number) => {
      return await page.evaluate((no) => {
        const el = document.querySelector(`.trace.bars .point:nth-child(${no})`);
        return !!el && !!el.getBoundingClientRect().width;
      }, no);
    };
    await initSummary(page, json, data, options);

    // check data filtering for regular choice
    // await page.locator(".trace.bars .point").nth(1).click();
    await page.locator(".nsewdrag").click({ position: { x: 100, y: 60 } }); //selector for choice with value 1
    await page.waitForTimeout(500);
    expect(await isBarVisible(3)).toBeFalsy();
    expect(await isBarVisible(1)).toBeFalsy();
    expect(await isBarVisible(2)).toBeTruthy();

    await page.click('span:text("Clear")');
    await page.waitForTimeout(500);
    expect(await isBarVisible(3)).toBeTruthy();
    expect(await isBarVisible(2)).toBeTruthy();
    expect(await isBarVisible(1)).toBeTruthy();

    // check data filtering for other choice
    // await page.locator(".trace.bars .point").nth(0).click();
    await page.locator(".nsewdrag").click({ position: { x: 100, y: 100 } }); //selector for 'other' choice
    await page.waitForTimeout(500);
    expect(await isBarVisible(3)).toBeFalsy();
    expect(await isBarVisible(2)).toBeFalsy();
    expect(await isBarVisible(1)).toBeTruthy();

    await page.click('span:text("Clear")');
    await page.waitForTimeout(500);
    expect(await isBarVisible(3)).toBeTruthy();
    expect(await isBarVisible(2)).toBeTruthy();
    expect(await isBarVisible(1)).toBeTruthy();
  });

  test.skip("check use values as labels", async ({ page }) => {
    const options = { useValuesAsLabels: true };
    await initSummary(page, json, data, options);
    const yAxisValues = await getYAxisValues(page);
    expect(yAxisValues).toEqual(["other", "1", "2"]);
  });

  test("check show/hide percentages", async ({ page }) => {
    const getValuesInsideBars = async () => {
      return await page.evaluate(() => {
        const values: string[] = [];
        document.querySelectorAll(".trace.bars .point text").forEach((el) => {
          values.push(el.getAttribute("data-unformatted") || "");
        });
        return values;
      });
    };
    await initSummary(page, json, data, options);

    // check that percentages aren't shown
    await expect(page.locator(".trace.bars .point text")).not.toBeVisible();

    // check that percentages are shown when button is clicked
    await page.click('span:text("Show percentages")');
    const valuesInsideBars = await getValuesInsideBars();
    expect(valuesInsideBars).toEqual(["2 (40%)", "1 (20%)", "2 (40%)"]);

    // check that percentage are hided when button is double-clicked
    await page.click('span:text("Hide percentages")');
    await expect(page.locator(".trace.bars .point text")).not.toBeVisible();
  });

  test("check comment actions", async ({ page }) => {
    const getTableCells = async () => {
      return await page.evaluate(() => {
        const cells: string[] = [];
        document.querySelectorAll(".sa-text-table tr td").forEach((td) => {
          cells.push(td.innerHTML);
        });
        return cells;
      });
    };
    await initSummary(page, json, data, options);

    // check that comment's footer doesn't exists
    await expect(page.locator(".sa-visualizer__footer-content")).not.toBeVisible();

    // check comment's actions
    await page.click('.sa-visualizer__footer span:text("Show")');
    await expect(page.locator(".sa-visualizer__footer-content")).toBeVisible();

    // check that wordcloud exists
    await expect(page.locator(".sa-visualizer__footer-content .sa-visualizer-wordcloud")).toHaveCount(1);

    // check comment's table
    await page.locator("div").filter({ hasText: /^WordcloudTexts in tablecommenttext$/ }).getByRole("combobox").selectOption("text");

    const cells = await getTableCells();
    expect(cells).toEqual(["Comment text", "Another comment text"]);

    // check that comment's footer is hided
    await page.click('.sa-visualizer__footer span:text("Hide")');
    await expect(page.locator(".sa-visualizer__footer-content")).not.toBeVisible();
  });

  test("check sign when there is no comment data", async ({ page }) => {
    const data = [{ radio: 1 }];
    await initSummary(page, json, data, options);
    await expect(page.locator('.sa-visualizer__footer p:text("There are no results yet")')).toHaveCount(1);

    await page.getByText("Show", { exact: true }).click();
    await expect(page.locator('.sa-visualizer__footer p:text("There are no results yet")')).toBeVisible();
  });

  test("check that footer has no childs with false hasOther and hasComment", async ({ page }) => {
    const json = { elements: [{ type: "radiogroup", name: "radio", choices: [{ value: 1 }] }] };
    const data = [{ radio: 1 }];
    await initSummary(page, json, data, options);
    const count = await page.locator(".sa-visualizer__footer").first().evaluate((el) => el.childElementCount);
    expect(count).toBe(0);
  });

  test("check ordering", async ({ page }) => {
    const getColorsOrder = async () => {
      return await page.evaluate(() => {
        const colors: string[] = [];
        document.querySelectorAll(".trace.bars .point path").forEach((el) => {
          colors.push((el as HTMLElement).style.fill);
        });
        return colors;
      });
    };
    var data = [
      { radio: 1, },
      { radio: 1, },
      { radio: 1, },
      { radio: 2 },
      { radio: "other", "radio-Comment": "Comment text" },
      { radio: "other", "radio-Comment": "Another comment text" },
    ];

    await initSummary(page, json, data, options);
    const orderingSelect = page.locator("select").nth(2);

    // check default order
    expect(await getYAxisValues(page)).toEqual(["Other  ", "Two  ", "One  "]);
    expect((await getColorsOrder()).map(RGBToHex)).toEqual(["#86e1fb", "#3999fb", "#ff6771"]);

    // check ascending order
    await orderingSelect.selectOption("asc");
    expect(await getYAxisValues(page)).toEqual(["One  ", "Other  ", "Two  "]);
    expect((await getColorsOrder()).map(RGBToHex)).toEqual(["#ff6771", "#86e1fb", "#3999fb"]);

    // check descending order
    await orderingSelect.selectOption("desc");
    expect(await getYAxisValues(page)).toEqual(["Two  ", "Other  ", "One  "]);
    expect((await getColorsOrder()).map(RGBToHex)).toEqual(["#3999fb", "#86e1fb", "#ff6771"]);
  });
});