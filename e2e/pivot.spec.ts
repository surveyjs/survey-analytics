import { test, expect } from "@playwright/test";
import { compareScreenshot } from "./helper";

test.describe("Pivot chart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/examples/pivot.html");
    await page.setViewportSize({ width: 1000, height: 800 });
  });

  test("simple cases", async ({ page }) => {
    await page.evaluate(() => {
      const style = document.createElement("style");
      style.textContent = ".sa-commercial { display: none; }";
      document.head.appendChild(style);
    });
    const xAxisSelector = page.locator("div").filter({ hasText: /^Category \(X Axis\):GenderItem kindBill amount$/ }).getByRole("combobox");
    let yAxisSelector = page.locator("div").filter({ hasText: /^Legend \(Series\):Not selectedItem kindBill amount$/ }).getByRole("combobox");
    await expect(page.locator("#pivotContainer").getByText("Category (X Axis):")).toBeVisible();
    await expect(xAxisSelector).toBeVisible();
    await expect(page.locator("#pivotContainer").getByText("Legend (Series):")).toBeVisible();
    await expect(yAxisSelector).toBeVisible();
    await compareScreenshot(page, "#pivotContainer", "pivot-q1-none.png");
    await yAxisSelector.selectOption("question2");
    await compareScreenshot(page, "#pivotContainer", "pivot-q1-q2.png");
    await yAxisSelector.selectOption("question3");
    await compareScreenshot(page, "#pivotContainer", "pivot-q1-q3.png");
    await xAxisSelector.selectOption("question2");
    yAxisSelector = page.locator("div").filter({ hasText: /^Legend \(Series\):Not selectedGenderBill amount$/ }).getByRole("combobox");
    await yAxisSelector.selectOption("question1");
    await compareScreenshot(page, "#pivotContainer", "pivot-q2-q1.png");
    await yAxisSelector.selectOption("question3");
    await compareScreenshot(page, "#pivotContainer", "pivot-q2-q3.png");
    await xAxisSelector.selectOption("question3");
    yAxisSelector = page.locator("div").filter({ hasText: /^Legend \(Series\):Not selectedGenderItem kind$/ }).getByRole("combobox");
    await yAxisSelector.selectOption("question1");
    await compareScreenshot(page, "#pivotContainer", "pivot-q3-q1.png");
    await yAxisSelector.selectOption("question2");
    await compareScreenshot(page, "#pivotContainer", "pivot-q3-q2.png");
  });

});