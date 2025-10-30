import { test, expect } from "@playwright/test";
import { compareScreenshot } from "./helper";

process.env.SNAPSHOT_SUFFIX = "";

test.describe("Declarative common", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/examples/declarative.html");
    await page.setViewportSize({ width: 800, height: 1000 });
  });

  test("Total answers count visualizer", async ({ page }) => {
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Total answers count - Card" });
    await expect(questionTitleSelector).toBeVisible();
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..").first();

    await compareScreenshot(page, questionVisualizerSelector, "total-answer-count.png");
  });
});
