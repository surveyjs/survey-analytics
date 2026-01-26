import { test, expect } from "@playwright/test";
import { compareScreenshot, getListItemByText } from "../helper";

test.describe("Summary common", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("summary.html");
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

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    await expect(chartTypeSelector).toBeVisible();
    await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Pie");
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").first();
    await expect(chartContentSelector).toBeVisible();
    await compareScreenshot(page, chartContentSelector, "boolean-simple-pie.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "Bar").click();
    await compareScreenshot(page, chartContentSelector, "boolean-simple-bar.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "Doughnut").click();
    await compareScreenshot(page, chartContentSelector, "boolean-simple-doughnut.png");
  });

  test("select simple cases", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Which of the following best describes you or your organization?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    await expect(visualizerSelector).toBeVisible();
    await expect(visualizerSelector.locator(".sa-dropdown-header-text")).toHaveText("Bar");

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
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
  });

  test("simple cases", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "How likely are you to recommend SurveyJS to a friend or colleague?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();
    await expect(questionVisualizerSelector.locator(".sa-dropdown")).toHaveCount(2);

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    await expect(chartTypeSelector).toBeVisible();
    await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Bar");

    await chartTypeSelector.click();
    await getListItemByText(page, "Histogram").click();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();
    // await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Vertical Bar");
    await compareScreenshot(page, chartContentSelector, "histogram-simple-vbar.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "chartType_vistogram").click();
    await compareScreenshot(page, chartContentSelector, "histogram-simple-bar.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "Gauge").click();
    await expect(questionVisualizerSelector.locator(".sa-dropdown")).toHaveCount(1);
    await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Gauge");
    await compareScreenshot(page, chartContentSelector, "number-simple-gauge.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "Bullet").click();
    await compareScreenshot(page, chartContentSelector, "number-simple-bullet.png");
  });
});
