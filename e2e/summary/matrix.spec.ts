import { test, expect } from "@playwright/test";
import { initSummary, url_summary } from "../helper";

const json = {
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

const data = [
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

const options = {
  allowShowPercentages: true,
};

test.describe("matrix", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url_summary);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await initSummary(page, json, data, options);
  });

  // data filtering is not working now - See #91
  test.skip("check data filtering", async ({ page }) => { });

  // Rows uses text instead of values
  test.skip("check use values as labels for rows", async ({ page }) => {
    // This test is skipped as in the original
    // You would implement getYAxisValues as a page.evaluate function if needed
  });

  test("check use values as labels for columns", async ({ page }) => {
    // Helper to get legend values
    const getLegendValues = async () => {
      return await page.evaluate(() => {
        const legendValues: string[] = [];
        document.querySelectorAll(".legend .traces text").forEach((el) => {
          legendValues.push((el as HTMLElement).getAttribute("data-unformatted") || "");
        });
        return legendValues;
      });
    };

    await expect(await getLegendValues()).toEqual(["Column 2", "Column 1"]);
    const options = { useValuesAsLabels: true };
    await initSummary(page, json, data, options);
    await expect(await getLegendValues()).toEqual(["column2", "column1"]);
  });

  test("check show/hide percentages", async ({ page }) => {
    // Helper to get values inside bars
    const getValuesInsideBars = async (traceNo: number) => {
      return await page.evaluate((traceNo) => {
        const values: string[] = [];
        document
          .querySelectorAll(`.trace.bars:nth-of-type(${traceNo}) .point text`)
          .forEach((el) => {
            values.push((el as HTMLElement).getAttribute("data-unformatted") || "");
          });
        return values;
      }, traceNo);
    };

    // check that percentages aren't shown
    await expect(page.locator(".trace.bars .point text")).toHaveCount(0);

    // check that percentages are shown when button is clicked
    await page.click("span:has-text('Show percentages')");
    await expect(await getValuesInsideBars(1)).toEqual(["2 (67%)", "1 (33%)"].reverse());
    await expect(await getValuesInsideBars(2)).toEqual(["1 (33%)", "2 (67%)"].reverse());

    // check that percentage are hidden when button is double-clicked
    await page.click("span:has-text('Hide percentages')");
    await expect(page.locator(".trace.bars .point text")).toHaveCount(0);
  });
});