import { test, expect } from "@playwright/test";
import { compareScreenshot, getListItemByText } from "../helper";

test.describe("Dashboard theme", () => {

  test("Guage chart", async ({ page }) => {
    await page.goto("histogram.html");
    await page.setViewportSize({ width: 1200, height: 1000 });
    page.evaluate(() => {
      if(window.visPanel) {
        window.visPanel.applyTheme(SurveyTheme.ContrastLight);
      }
    });

    const questionTitleSelector = page.locator("h3").filter({ hasText: "How likely are you to recommend our product to a friend or colleague?" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    await expect(chartTypeSelector).toBeVisible();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await expect(chartContentSelector).toBeVisible();
    await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Bar");
    await chartTypeSelector.click();
    await getListItemByText(page, "Gauge").click();
    await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Gauge");
    await compareScreenshot(page, chartContentSelector, "themed-number-gauge.png");

    await chartTypeSelector.click();
    await getListItemByText(page, "Bullet").click();
    await expect(chartTypeSelector.locator(".sa-dropdown-header-text")).toHaveText("Bullet");
    await compareScreenshot(page, chartContentSelector, "themed-number-bullet.png");
  });
});
