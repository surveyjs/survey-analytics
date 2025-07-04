import { test, expect } from "@playwright/test";
import { compareScreenshot } from "./helper";

test.describe("Miscellaneous cases", () => {
  test.beforeEach(async ({ page }) => {
  });

  test("matrix one row", async ({ page }) => {
    await page.goto("http://localhost:8080/examples/matrix-one-row.html");
    await page.setViewportSize({ width: 800, height: 1000 });
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Please indicate if you agree or disagree with the following statements" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^BarStacked BarPieDoughnut$/ });
    await expect(chartTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();

    await expect(chartTypeSelector).toHaveValue("bar");
    await compareScreenshot(page, chartContentSelector, "matrix-single-row-bar.png");

    await chartTypeSelector.selectOption("pie");
    await compareScreenshot(page, chartContentSelector, "matrix-single-row-pie.png");

    const transposeButtonSelector = questionVisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Columns$/ });
    await expect(transposeButtonSelector).toBeVisible();
    await transposeButtonSelector.click();
    await expect(questionVisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Values$/ })).toBeVisible();

    await chartTypeSelector.selectOption("bar");
    await compareScreenshot(page, chartContentSelector, "matrix-single-row-bar-per-values.png");

    await chartTypeSelector.selectOption("pie");
    await compareScreenshot(page, chartContentSelector, "matrix-single-row-pie-per-values.png");
  });

  test("matrix dropdown grouped", async ({ page }) => {
    await page.goto("http://localhost:8080/examples/matrixdropdown-grouped.html");
    await page.setViewportSize({ width: 800, height: 1000 });
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Please select the top 3 processes that you perceived as most difficult or troublesome." });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^Stacked BarBarPieDoughnut$/ });
    await expect(chartTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").nth(1);
    await expect(chartContentSelector).toBeVisible();

    await expect(chartTypeSelector).toHaveValue("stackedbar");
    await compareScreenshot(page, chartContentSelector, "matrixdropdown-grouped-stackedbar.png");

    await chartTypeSelector.selectOption("bar");
    await compareScreenshot(page, chartContentSelector, "matrixdropdown-grouped-bar.png");

    const transposeButtonSelector = questionVisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Columns$/ });
    await expect(transposeButtonSelector).toBeVisible();
    await transposeButtonSelector.click();
    await expect(questionVisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Values$/ })).toBeVisible();

    await chartTypeSelector.selectOption("stackedbar");
    await compareScreenshot(page, chartContentSelector, "matrixdropdown-grouped-stackedbar-per-values.png");

    await chartTypeSelector.selectOption("bar");
    await compareScreenshot(page, chartContentSelector, "matrixdropdown-grouped-bar-per-values.png");
  });
});