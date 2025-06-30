import { test, expect } from "@playwright/test";
import { compareScreenshot } from "./helper";

test.describe("Matrixes visualizer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/examples/matrixes.html");
    await page.setViewportSize({ width: 800, height: 1000 });
  });

  test("matrix single", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "What is your perception of these brands?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^BarStacked BarPieDoughnut$/ });
    await expect(chartTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();

    await expect(chartTypeSelector).toHaveValue("bar");
    await compareScreenshot(page, chartContentSelector, "matrix-single-bar.png");

    await chartTypeSelector.selectOption("stackedbar");
    await compareScreenshot(page, chartContentSelector, "matrix-single-stackedbar.png");

    await chartTypeSelector.selectOption("pie");
    await compareScreenshot(page, chartContentSelector, "matrix-single-pie.png");

    await chartTypeSelector.selectOption("doughnut");
    await compareScreenshot(page, chartContentSelector, "matrix-single-doughnut.png");

    const transposeButtonSelector = questionVisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Values$/ });
    await expect(transposeButtonSelector).toBeVisible();
    await transposeButtonSelector.click();
    await expect(questionVisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Columns$/ })).toBeVisible();

    await chartTypeSelector.selectOption("bar");
    await compareScreenshot(page, chartContentSelector, "matrix-single-bar-per-values.png");

    await chartTypeSelector.selectOption("stackedbar");
    await compareScreenshot(page, chartContentSelector, "matrix-single-stackedbar-per-values.png");

    await chartTypeSelector.selectOption("pie");
    await compareScreenshot(page, chartContentSelector, "matrix-single-pie-per-values.png");

    await chartTypeSelector.selectOption("doughnut");
    await compareScreenshot(page, chartContentSelector, "matrix-single-doughnut-per-values.png");
  });

  test("matrixdropdown simple", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "What do you feel about these brands?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const column1TitleSelector = page.locator("h3").filter({ hasText: "My Opinion" });
    await expect(column1TitleSelector).toBeVisible();
    const column1VisualizerSelector = column1TitleSelector.locator("..").locator("..");
    column1VisualizerSelector.scrollIntoViewIfNeeded();

    const chartCol1TypeSelector = column1VisualizerSelector.locator("select").filter({ hasText: /^BarVertical BarPieDoughnutStacked Bar$/ });
    await expect(chartCol1TypeSelector).toBeVisible();
    const chartCol1ContentSelector = column1VisualizerSelector.locator(".sa-visualizer__content").nth(1);
    await expect(chartCol1ContentSelector).toBeVisible();

    await expect(chartCol1TypeSelector).toHaveValue("bar");
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-bar.png");

    await chartCol1TypeSelector.selectOption("vbar");
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-vbar.png");

    await chartCol1TypeSelector.selectOption("pie");
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-pie.png");

    await chartCol1TypeSelector.selectOption("doughnut");
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-doughnut.png");

    await chartCol1TypeSelector.selectOption("stackedbar");
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-stackedbar.png");

    const transposeButtonSelector = column1VisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Values$/ });
    await expect(transposeButtonSelector).toBeVisible();
    await transposeButtonSelector.click();
    await expect(column1VisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Columns$/ })).toBeVisible();

    await chartCol1TypeSelector.selectOption("bar");
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-bar-per-values.png");

    await chartCol1TypeSelector.selectOption("vbar");
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-vbar-per-values.png");

    await chartCol1TypeSelector.selectOption("pie");
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-pie-per-values.png");

    await chartCol1TypeSelector.selectOption("doughnut");
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-doughnut-per-values.png");

    await chartCol1TypeSelector.selectOption("stackedbar");
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-stackedbar-per-values.png");
  });

});