import { test, expect } from "@playwright/test";
import { compareScreenshot } from "./helper";

test.describe("Rating common", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/examples/rating.html");
    await page.setViewportSize({ width: 800, height: 1000 });
  });

  test("number value", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "How likely are you to recommend SurveyJS to a friend or colleague?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerTypeSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^ChartAverageHistogram$/ });
    await expect(visualizerTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").nth(1);
    await expect(chartContentSelector).toBeVisible();

    await expect(visualizerTypeSelector).toHaveValue("selectBase");
    await compareScreenshot(page, chartContentSelector, "rating-number-chart.png");

    await visualizerTypeSelector.selectOption("number");
    await compareScreenshot(page, chartContentSelector, "rating-number-average.png");

    await visualizerTypeSelector.selectOption("histogram");
    await compareScreenshot(page, chartContentSelector, "rating-number-histogram.png");
  });

  test("string value", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "What item do you prefer?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerTypeSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^ChartAverageHistogram$/ });
    await expect(visualizerTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").nth(1);
    await expect(chartContentSelector).toBeVisible();

    await expect(visualizerTypeSelector).toHaveValue("selectBase");
    await compareScreenshot(page, chartContentSelector, "rating-string-chart.png");

    await visualizerTypeSelector.selectOption("number");
    await compareScreenshot(page, chartContentSelector, "rating-string-average.png");

    await visualizerTypeSelector.selectOption("histogram");
    await compareScreenshot(page, chartContentSelector, "rating-string-histogram.png");  });
});