import { test, expect } from "@playwright/test";
import { compareScreenshot } from "./helper";

test.describe("Summary common", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/examples/summary.html");
    await page.setViewportSize({ width: 800, height: 1000 });
  });

  test("matrix simple cases", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Please indicate if you agree or disagree with the following statements" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^BarStacked BarPieDoughnut$/ });
    await expect(chartTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();

    await expect(chartTypeSelector).toHaveValue("bar");
    await compareScreenshot(page, chartContentSelector, "matrix-simple-bar.png");

    await chartTypeSelector.selectOption("stackedbar");
    await compareScreenshot(page, chartContentSelector, "matrix-simple-stackedbar.png");

    await chartTypeSelector.selectOption("pie");
    await compareScreenshot(page, chartContentSelector, "matrix-simple-pie.png");

    await chartTypeSelector.selectOption("doughnut");
    await compareScreenshot(page, chartContentSelector, "matrix-simple-doughnut.png");
  });

  test("boolean simple cases", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Please answer the question" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^PieBarDoughnut$/ });
    await expect(chartTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();

    await expect(chartTypeSelector).toHaveValue("pie");
    await compareScreenshot(page, chartContentSelector, "boolean-simple-bar.png");

    await chartTypeSelector.selectOption("bar");
    await compareScreenshot(page, chartContentSelector, "boolean-simple-pie.png");

    await chartTypeSelector.selectOption("doughnut");
    await compareScreenshot(page, chartContentSelector, "boolean-simple-doughnut.png");
  });

  test("select simple cases", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Which of the following best describes you or your organization?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^ChartTable$/ });
    await expect(visualizerSelector).toBeVisible();
    await expect(visualizerSelector).toHaveValue("selectBase");

    const chartTypeSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^BarVertical BarPieDoughnut$/ });
    await expect(chartTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").nth(1);
    await expect(chartContentSelector).toBeVisible();

    await expect(chartTypeSelector).toHaveValue("bar");
    await compareScreenshot(page, chartContentSelector, "select-simple-bar.png");

    await chartTypeSelector.selectOption("vbar");
    await compareScreenshot(page, chartContentSelector, "select-simple-vbar.png");

    await chartTypeSelector.selectOption("pie");
    await compareScreenshot(page, chartContentSelector, "select-simple-pie.png");

    await chartTypeSelector.selectOption("doughnut");
    await compareScreenshot(page, chartContentSelector, "select-simple-doughnut.png");

    await visualizerSelector.selectOption("choices");
    await expect(chartTypeSelector).toBeHidden();
    await compareScreenshot(page, chartContentSelector, "select-simple-table.png");

    const otherItemsSelector = questionVisualizerSelector.locator("h4").filter({ hasText: "Other items and comments" });
    await expect(otherItemsSelector).toBeVisible();
  });

  test("histogram simple cases", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "How likely are you to recommend SurveyJS to a friend or colleague?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^ChartAverageHistogram$/ });
    await expect(visualizerSelector).toBeVisible();
    await expect(visualizerSelector).toHaveValue("selectBase");
    await visualizerSelector.selectOption("histogram");

    const chartTypeSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^Vertical BarBar$/ });
    await expect(chartTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").nth(1);
    await expect(chartContentSelector).toBeVisible();

    await expect(chartTypeSelector).toHaveValue("vbar");
    await compareScreenshot(page, chartContentSelector, "histogram-simple-vbar.png");

    await chartTypeSelector.selectOption("bar");
    await compareScreenshot(page, chartContentSelector, "histogram-simple-bar.png");

    await visualizerSelector.selectOption("number");
    await expect(chartTypeSelector).toBeHidden();

    const gaugeTypeSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^GaugeBullet$/ });
    await expect(gaugeTypeSelector).toBeVisible();
    await expect(gaugeTypeSelector).toHaveValue("gauge");
    await compareScreenshot(page, chartContentSelector, "number-simple-gauge.png");

    await gaugeTypeSelector.selectOption("bullet");
    await compareScreenshot(page, chartContentSelector, "number-simple-bullet.png");
  });

  test("text simple cases", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "What's your favorite functionality / add-on?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerTypeSelector = questionVisualizerSelector.locator("select").filter({ hasText: /^WordcloudTexts in table$/ });
    await expect(visualizerTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").nth(1);
    await expect(chartContentSelector).toBeVisible();

    await expect(visualizerTypeSelector).toHaveValue("wordcloud");
    await compareScreenshot(page, chartContentSelector, "text-simple-wordcloud.png");

    await visualizerTypeSelector.selectOption("text");
    await compareScreenshot(page, chartContentSelector, "text-simple-table.png");
  });
});