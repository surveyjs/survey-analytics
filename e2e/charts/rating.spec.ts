import { test, expect } from "@playwright/test";
import { compareScreenshot, getListItemByText } from "../helper";

test.describe("Rating common", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("rating.html");
    await page.setViewportSize({ width: 800, height: 1000 });
  });

  test("number value", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "How likely are you to recommend SurveyJS to a friend or colleague?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    await expect(visualizerTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();

    await expect(visualizerTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Chart - Bar");
    await compareScreenshot(page, chartContentSelector, "rating-number-chart.png");

    await visualizerTypeSelector.click();
    await getListItemByText(page, "Average - Gauge").click();
    await compareScreenshot(page, chartContentSelector, "rating-number-average.png");

    await visualizerTypeSelector.click();
    await getListItemByText(page, "Histogram - Vertical Bar").click();
    await compareScreenshot(page, chartContentSelector, "rating-number-histogram.png");
  });

  test("string value", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "What item do you prefer?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    await expect(visualizerTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();

    await expect(visualizerTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Chart - Bar");
    await compareScreenshot(page, chartContentSelector, "rating-string-chart.png");

    await visualizerTypeSelector.click();
    await getListItemByText(page, "Average - Gauge").click();
    await compareScreenshot(page, chartContentSelector, "rating-string-average.png");

    await visualizerTypeSelector.click();
    await getListItemByText(page, "Histogram - Vertical Bar").click();
    await compareScreenshot(page, chartContentSelector, "rating-string-histogram.png");
  });
});
