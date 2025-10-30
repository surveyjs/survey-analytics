import { test, expect } from "@playwright/test";
import { compareScreenshot, getListItemByText, testConfigs } from "./helper";

for (const config of testConfigs) {
  process.env.SNAPSHOT_SUFFIX = undefined;
  process.env.SNAPSHOT_SUFFIX = config.suffix;

  test.describe(`Rating common ${config.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`http://localhost:8080/examples/rating${config.suffix}.html`);
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

      await expect(visualizerTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Chart");
      await compareScreenshot(page, chartContentSelector, "rating-number-chart.png");

      await visualizerTypeSelector.click();
      await getListItemByText(page, "Average").click();
      await compareScreenshot(page, chartContentSelector, "rating-number-average.png");

      await visualizerTypeSelector.click();
      await getListItemByText(page, "Histogram").click();
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

      await expect(visualizerTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Chart");
      await compareScreenshot(page, chartContentSelector, "rating-string-chart.png");

      await visualizerTypeSelector.click();
      await getListItemByText(page, "Average").click();
      await compareScreenshot(page, chartContentSelector, "rating-string-average.png");

      await visualizerTypeSelector.click();
      await getListItemByText(page, "Histogram").click();
      await compareScreenshot(page, chartContentSelector, "rating-string-histogram.png");
    });
  });
}
