import { test, expect } from "@playwright/test";
import { compareScreenshot, getListItemByText } from "../helper";

test.describe("Matrixes visualizer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("matrixes.html");
    await page.setViewportSize({ width: 800, height: 1000 });
  });

  test("matrix single", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "What is your perception of these brands?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    await expect(chartTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();

    await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Bar");
    await compareScreenshot(page, chartContentSelector, "matrix-single-bar.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "Stacked Bar").click();
    await compareScreenshot(page, chartContentSelector, "matrix-single-stackedbar.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "Pie").click();
    await compareScreenshot(page, chartContentSelector, "matrix-single-pie.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "Doughnut").click();
    await compareScreenshot(page, chartContentSelector, "matrix-single-doughnut.png");

    const transposeButtonSelector = questionVisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Columns$/ });
    await expect(transposeButtonSelector).toBeVisible();
    await transposeButtonSelector.click();
    await expect(questionVisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Values$/ })).toBeVisible();

    await chartTypeSelector.click();
    await getListItemByText(page, "Bar").click();
    await compareScreenshot(page, chartContentSelector, "matrix-single-bar-per-values.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "Stacked Bar").click();
    await compareScreenshot(page, chartContentSelector, "matrix-single-stackedbar-per-values.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "Pie").click();
    await compareScreenshot(page, chartContentSelector, "matrix-single-pie-per-values.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "Doughnut").click();
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

    const chartCol1TypeSelector = column1VisualizerSelector.locator(".sa-dropdown").nth(1);
    await expect(chartCol1TypeSelector).toBeVisible();
    const chartCol1ContentSelector = column1VisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartCol1ContentSelector).toBeVisible();

    await expect(chartCol1TypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Bar");
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-bar.png");

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Vertical Bar").click();
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-vbar.png");

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Pie").click();
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-pie.png");

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Doughnut").click();
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-doughnut.png");

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Stacked Bar").click();
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-stackedbar.png");

    const transposeButtonSelector = column1VisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Columns$/ });
    await expect(transposeButtonSelector).toBeVisible();
    await transposeButtonSelector.click();
    await expect(column1VisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Values$/ })).toBeVisible();

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Bar").click();
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-bar-per-values.png");

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Vertical Bar").click();
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-vbar-per-values.png");

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Pie").click();
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-pie-per-values.png");

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Doughnut").click();
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-doughnut-per-values.png");

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Stacked Bar").click();
    await compareScreenshot(page, chartCol1ContentSelector, "matrixdropdown-simple-stackedbar-per-values.png");
  });

});
