import { test, expect } from "@playwright/test";
import { compareScreenshot } from "./helper";

test.describe("Pivot chart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/examples/pivot.html");
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
    await page.getByRole("list").getByText("Item kind").click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q1-q2.png");
    await yAxisSelector.click();
    await page.getByRole("list").getByText("Bill amount").click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q1-q3.png");
    await xAxisSelector.click();
    await page.getByRole("list").getByText("Item kind").click();
    await yAxisSelector.click();
    await page.getByRole("list").getByText("Gender").click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q2-q1.png");
    await yAxisSelector.click();
    await page.getByRole("list").getByText("Bill amount").click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q2-q3.png");
    await xAxisSelector.click();
    await page.getByRole("list").getByText("Bill amount").click();
    await yAxisSelector.click();
    await page.getByRole("list").getByText("Gender").click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q3-q1.png");
    await yAxisSelector.click();
    await page.getByRole("list").getByText("Item kind").click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q3-q2.png");
  });

});