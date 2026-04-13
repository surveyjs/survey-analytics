import { test, expect } from "@playwright/test";
import { compareScreenshot } from "./helper";

test.describe("Response count visualizer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/examples/responsecount.html");
    await page.setViewportSize({ width: 800, height: 600 });
  });

  test("default title", async ({ page }) => {
    const questionTitleSelector = page.locator("#summaryContainer h3").filter({ hasText: "Total responses" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..").first();

    await compareScreenshot(page, questionVisualizerSelector, "responsecount-default-title.png");
  });

  test("custom title", async ({ page }) => {
    const questionTitleSelector = page.locator("#customTitleContainer h3").filter({ hasText: "Custom Response Title" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..").first();

    await compareScreenshot(page, questionVisualizerSelector, "responsecount-custom-title.png");
  });
});
