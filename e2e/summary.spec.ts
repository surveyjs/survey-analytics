import { test, expect } from "@playwright/test";
import { compareScreenshot, getListItemByText, testConfigs } from "./helper";

for (const config of testConfigs) {
  process.env.SNAPSHOT_SUFFIX = config.suffix;

  test.describe(`Summary common ${config.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`http://localhost:8080/examples/summary${config.suffix}.html`);
      await page.setViewportSize({ width: 800, height: 1000 });
    });

    test("matrix simple cases", async ({ page }) => {
      const questionTitleSelector = page.locator("h3").filter({ hasText: "Please indicate if you agree or disagree with the following statements" });
      await expect(questionTitleSelector).toBeVisible();
      const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
      questionVisualizerSelector.scrollIntoViewIfNeeded();

      const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
      await expect(chartTypeSelector).toBeVisible();
      const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
      await expect(chartContentSelector).toBeVisible();

      await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Bar");
      await compareScreenshot(page, chartContentSelector, "matrix-simple-bar.png");

      await chartTypeSelector.click();
      await getListItemByText(page, "Stacked Bar").click();
      await compareScreenshot(page, chartContentSelector, "matrix-simple-stackedbar.png");

      await chartTypeSelector.click();
      await getListItemByText(page, "Pie").click();
      await compareScreenshot(page, chartContentSelector, "matrix-simple-pie.png");

      await chartTypeSelector.click();
      await getListItemByText(page, "Doughnut").click();
      await compareScreenshot(page, chartContentSelector, "matrix-simple-doughnut.png");
    });

    test("boolean simple cases", async ({ page }) => {
      const questionTitleSelector = page.locator("h3").filter({ hasText: "Please answer the question" });
      await expect(questionTitleSelector).toBeVisible();
      const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
      questionVisualizerSelector.scrollIntoViewIfNeeded();

      // const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
      // await expect(chartTypeSelector).toBeVisible();
      // const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
      // await expect(chartContentSelector).toBeVisible();
      const visualizerSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
      await expect(visualizerSelector).toBeVisible();
      await expect(visualizerSelector.locator(".sa-dropdown-header-text")).toHaveText("Chart");

      const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").nth(1);
      await expect(chartTypeSelector).toBeVisible();
      const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").first();
      await expect(chartContentSelector).toBeVisible();

      await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Pie");
      await compareScreenshot(page, chartContentSelector, "boolean-simple-bar.png");

      await chartTypeSelector.click();
      await getListItemByText(page, "Bar").click();
      await compareScreenshot(page, chartContentSelector, "boolean-simple-pie.png");

      await chartTypeSelector.click();
      await getListItemByText(page, "Doughnut").click();
      await compareScreenshot(page, chartContentSelector, "boolean-simple-doughnut.png");

      await visualizerSelector.click();
      await getListItemByText(page, "Table").click();
      await expect(chartTypeSelector).toBeHidden();
      await compareScreenshot(page, chartContentSelector, "boolean-simple-table.png");
    });

    test("select simple cases", async ({ page }) => {
      const questionTitleSelector = page.locator("h3").filter({ hasText: "Which of the following best describes you or your organization?" });
      await expect(questionTitleSelector).toBeVisible();
      const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
      questionVisualizerSelector.scrollIntoViewIfNeeded();

      const visualizerSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
      await expect(visualizerSelector).toBeVisible();
      await expect(visualizerSelector.locator(".sa-dropdown-header-text")).toHaveText("Chart");

      const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").nth(1);
      await expect(chartTypeSelector).toBeVisible();
      const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").first();
      await expect(chartContentSelector).toBeVisible();

      await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Bar");
      await compareScreenshot(page, chartContentSelector, "select-simple-bar.png");

      await chartTypeSelector.click();
      await getListItemByText(page, "Vertical Bar").click();
      await compareScreenshot(page, chartContentSelector, "select-simple-vbar.png");

      await chartTypeSelector.click();
      await getListItemByText(page, "Pie").click();
      await compareScreenshot(page, chartContentSelector, "select-simple-pie.png");

      await chartTypeSelector.click();
      await getListItemByText(page, "Doughnut").click();
      await compareScreenshot(page, chartContentSelector, "select-simple-doughnut.png");

      await visualizerSelector.click();
      await getListItemByText(page, "Table").click();
      await compareScreenshot(page, chartContentSelector, "select-simple-table.png");

      const otherItemsSelector = questionVisualizerSelector.locator("h4").filter({ hasText: "Other items and comments" });
      await expect(otherItemsSelector).toBeVisible();
    });

    test("simple cases", async ({ page }) => {
      const questionTitleSelector = page.locator("h3").filter({ hasText: "How likely are you to recommend SurveyJS to a friend or colleague?" });
      await expect(questionTitleSelector).toBeVisible();
      const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
      questionVisualizerSelector.scrollIntoViewIfNeeded();
      await expect(questionVisualizerSelector.locator(".sa-dropdown")).toHaveCount(3);

      const visualizerSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
      await expect(visualizerSelector).toBeVisible();
      await expect(visualizerSelector.locator(".sa-dropdown-header-text")).toHaveText("Chart");

      await visualizerSelector.click();
      await getListItemByText(page, "Histogram").click();

      const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").nth(1);
      await expect(chartTypeSelector).toBeVisible();
      const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
      await expect(chartContentSelector).toBeVisible();

      await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Vertical Bar");
      await compareScreenshot(page, chartContentSelector, "histogram-simple-vbar.png");

      await chartTypeSelector.click();
      await getListItemByText(page, "Bar").click();
      await compareScreenshot(page, chartContentSelector, "histogram-simple-bar.png");

      await visualizerSelector.click();
      await getListItemByText(page, "Average").click();
      await expect(questionVisualizerSelector.locator(".sa-dropdown")).toHaveCount(2);

      const gaugeTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").nth(1);
      await expect(gaugeTypeSelector).toBeVisible();
      await expect(gaugeTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Gauge");
      await compareScreenshot(page, chartContentSelector, "number-simple-gauge.png");

      await gaugeTypeSelector.click();
      await getListItemByText(page, "Bullet").click();
      await compareScreenshot(page, chartContentSelector, "number-simple-bullet.png");
    });

    test("text simple cases", async ({ page }) => {
      const questionTitleSelector = page.locator("h3").filter({ hasText: "What's your favorite functionality / add-on?" });
      await expect(questionTitleSelector).toBeVisible();
      const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
      questionVisualizerSelector.scrollIntoViewIfNeeded();

      const visualizerTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
      await expect(visualizerTypeSelector).toBeVisible();
      const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
      await expect(chartContentSelector).toBeVisible();

      await expect(visualizerTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Wordcloud");
      await compareScreenshot(page, chartContentSelector, "text-simple-wordcloud.png");

      await visualizerTypeSelector.click();
      await getListItemByText(page, "Texts in table").click();
      await compareScreenshot(page, chartContentSelector, "text-simple-table.png");
    });
  });
}