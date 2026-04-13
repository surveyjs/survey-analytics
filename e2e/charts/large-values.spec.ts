import { test, expect } from "@playwright/test";
import { compareScreenshot, getListItemByText } from "../helper";

test.describe("Large values formatting", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("large-values.html");
    await page.setViewportSize({ width: 800, height: 600 });
  });

  test("bar chart with large values", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Which product do you prefer?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    await expect(chartTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();

    await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Bar");
    await compareScreenshot(page, chartContentSelector, "large-values-bar.png");
  });

  test("vertical bar chart with large values", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Which product do you prefer?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    await expect(chartTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();

    await chartTypeSelector.click();
    await getListItemByText(page, "Vertical Bar").click();
    await compareScreenshot(page, chartContentSelector, "large-values-vbar.png");
  });
});
