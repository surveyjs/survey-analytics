import { test, expect } from "@playwright/test";
import { compareScreenshot, getListItemByText } from "./helper";

test.describe("Summary common", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/examples/apexcharts/summary.html");
    await page.setViewportSize({ width: 800, height: 1000 });
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

    await visualizerSelector.click();
    await getListItemByText(page, "Table").click();
    await compareScreenshot(page, chartContentSelector, "select-simple-table.png");

    const otherItemsSelector = questionVisualizerSelector.locator("h4").filter({ hasText: "Other items and comments" });
    await expect(otherItemsSelector).toBeVisible();
  });

});
