import { test, expect } from "@playwright/test";
import { initSummary, url_summary } from "../helper";

const json = {
  elements: [
    {
      type: "text",
      name: "text",
      title: "Question 1",
    },
  ],
};
const data = [{ text: "answer1" }, { text: "answer2" }, { text: "answer3" }];
const options = {};

test.describe("text", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url_summary);
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test("check text table", async ({ page }) => {
    await initSummary(page, json, data, options);

    // Select "Texts in table" from the dropdown
    await page.click(".sa-question__select");
    await page.selectOption(".sa-question__select", { label: "Texts in table" });

    // Get all table cell values
    const cells = await page.evaluate(() => {
      var cells = [];
      document.querySelectorAll(".sa-text-table tr td").forEach((td) => {
        cells.push(td.innerHTML);
      });
      return cells;
    });
    await expect(cells).toEqual(["answer1", "answer2", "answer3"]);
  });
});