import { test, expect } from "@playwright/test";
import { compareScreenshot, getListItemByText, testConfigs } from "./helper";

for (const config of testConfigs) {
  process.env.SNAPSHOT_SUFFIX = undefined;
  process.env.SNAPSHOT_SUFFIX = config.suffix;

  test.describe(`Pivot chart ${config.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`http://localhost:8080/examples/pivot${config.suffix}.html`);
      await page.setViewportSize({ width: 1000, height: 800 });
    });

    test("simple cases", async ({ page }) => {
      const xAxisSelector = page.locator(".sa-dropdown-header").nth(1);
      const yAxisSelector = page.locator(".sa-dropdown-header").nth(2);
      await page.evaluate(() => {
        const style = document.createElement("style");
        style.textContent = ".sa-commercial { display: none; }";
        document.head.appendChild(style);
      });
      await expect(page.locator("#pivotContainer").getByText("Category (X Axis):")).toBeVisible();
      await expect(xAxisSelector).toBeVisible();
      await expect(page.locator("#pivotContainer").getByText("Legend (Series):")).toBeVisible();
      await expect(yAxisSelector).toBeVisible();
      await compareScreenshot(page, "#pivotContainer", "pivot-q1-none.png");

      await yAxisSelector.click();
      await getListItemByText(page, "Item kind").click();
      await compareScreenshot(page, "#pivotContainer", "pivot-q1-q2.png");
      await yAxisSelector.click();
      await getListItemByText(page, "Bill amount").click();
      await compareScreenshot(page, "#pivotContainer", "pivot-q1-q3.png");
      await xAxisSelector.click();
      await getListItemByText(page, "Item kind").click();
      await yAxisSelector.click();
      await getListItemByText(page, "Gender").click();
      await compareScreenshot(page, "#pivotContainer", "pivot-q2-q1.png");
      await yAxisSelector.click();
      await getListItemByText(page, "Bill amount").click();
      await compareScreenshot(page, "#pivotContainer", "pivot-q2-q3.png");
      await xAxisSelector.click();
      await getListItemByText(page, "Bill amount").click();
      await yAxisSelector.click();
      await getListItemByText(page, "Gender").click();
      await compareScreenshot(page, "#pivotContainer", "pivot-q3-q1.png");
      await yAxisSelector.click();
      await getListItemByText(page, "Item kind").click();
      await compareScreenshot(page, "#pivotContainer", "pivot-q3-q2.png");
    });

  });
}