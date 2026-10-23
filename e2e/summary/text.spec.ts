import { test, expect } from "@playwright/test";
import { getListItemByText, initSummary, url_summary } from "../helper";

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
    await page.locator(".sa-dropdown").click();
    await getListItemByText(page, "Texts in table").click();
    await page.waitForTimeout(500);

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

  const shortCardJson = {
    elements: [
      { type: "boolean", name: "recommended", title: "Have you recommended our product?" },
      { type: "comment", name: "feedback", title: "Any comments?" }
    ]
  };
  const shortCardData = [{ recommended: true, feedback: "Great product" }];

  for(const allowDynamicLayout of [true, false]) {
    test(`chart type dropdown is not cut off in a short card (#874), allowDynamicLayout: ${allowDynamicLayout}`, async ({ page }) => {
      await initSummary(page, shortCardJson, shortCardData, { allowDynamicLayout });

      await page.locator(".sa-question").nth(1).locator(".sa-dropdown-header").first().click();
      const list = page.locator(".sa-dropdown-list.sa-dropdown--opened");
      await expect(list).toBeVisible();

      // The list should show all items without internal scrolling, and its last item shouldn't be covered or clipped
      const isFullyVisible = await list.evaluate((listElement: HTMLElement) => {
        const items = listElement.querySelectorAll(".sa-dropdown-item");
        const lastItem = items[items.length - 1] as HTMLElement;
        const rect = lastItem.getBoundingClientRect();
        const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        return listElement.scrollHeight <= listElement.clientHeight && !!hit && lastItem.contains(hit);
      });
      expect(isFullyVisible).toBe(true);
    });
  }
});