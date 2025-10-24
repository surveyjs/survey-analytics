import { test } from "@playwright/test";
import { compareScreenshot, resetFocusToBody } from "./helper";

test.describe("Toolbar visualizers", () => {
  test("Toolbar visualizer", async ({ page }) => {
    await page.goto("http://localhost:8080/examples/histogram_apexcharts.html");

    const visLocator = page.locator(".sa-question__content").first();
    const dropdownPopupLocator = page.locator(".sa-dropdown-list.sa-dropdown--opened").filter({ visible: true }).first();
    const mask = [
      page.locator(".apexcharts-canvas")
    ];

    await page.setViewportSize({ width: 900, height: 1000 });
    await compareScreenshot(page, visLocator, "visualizer-toolbar.png", mask);

    await page.locator(".sa-dropdown").first().click();
    await compareScreenshot(page, dropdownPopupLocator, "visualizer-toolbar-popup.png");
    await page.locator(".sa-dropdown").first().click();

    await page.setViewportSize({ width: 500, height: 1000 });
    await resetFocusToBody(page);
    await compareScreenshot(page, visLocator, "visualizer-toolbar-mobile-view.png", mask);

    await page.locator(".sa-dropdown").first().click();
    await compareScreenshot(page, dropdownPopupLocator, "visualizer-toolbar-mobile-view-popup.png");
  });

  test("Toolbar visualizer if disable the layout engine", async ({ page }) => {
    await page.goto("http://localhost:8080/examples/disable_layout_engine_apexcharts.html");

    const visLocator = page.locator(".sa-question__content").first();
    const mask = [
      page.locator(".apexcharts-canvas")
    ];

    await page.setViewportSize({ width: 900, height: 1000 });
    await compareScreenshot(page, visLocator, "visualizer-toolbar-disable-layout-engine.png", mask);

    await page.setViewportSize({ width: 500, height: 1000 });
    await compareScreenshot(page, visLocator, "visualizer-toolbar-disable-layout-engine-mobile-view.png", mask);
  });
});
