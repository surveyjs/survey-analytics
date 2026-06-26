import { test, expect } from "@playwright/test";
import { compareScreenshot, getListItemByText } from "../helper";

test.describe("Ranking", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("ranking.html");
    await page.setViewportSize({ width: 800, height: 1000 });
  });

  test("Radar chart", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Please rank the following smartphone features in order of importance:" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    await expect(visualizerTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();
    await expect(visualizerTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Bar");

    await visualizerTypeSelector.click();
    await getListItemByText(page, "Radar").click();
    await expect(visualizerTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Radar");
    await compareScreenshot(page, chartContentSelector, "ranking-radar.png");
  });

});
