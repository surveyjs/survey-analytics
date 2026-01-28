import { test } from "@playwright/test";
import { compareScreenshot, resetFocusToBody } from "./helper";

process.env.SNAPSHOT_SUFFIX = undefined;
process.env.SNAPSHOT_SUFFIX = "";

test.describe("Toolbar visualizers", () => {
  test("Toolbar visualizer", async ({ page }) => {
    await page.goto("http://localhost:8080/examples/apexcharts/histogram.html");

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
    await compareScreenshot(page, visLocator, "visualizer-toolbar-mobile-view.png", mask);

    await page.locator(".sa-dropdown").first().click();
    await compareScreenshot(page, dropdownPopupLocator, "visualizer-toolbar-mobile-view-popup.png");
  });

  test("Toolbar visualizer if disable the layout engine", async ({ page }) => {
    await page.goto("http://localhost:8080/examples/apexcharts/disable_layout_engine.html");

    const visLocator = page.locator(".sa-question__content").first();
    const mask = [
      page.locator(".apexcharts-canvas")
    ];

    await page.setViewportSize({ width: 900, height: 1000 });
    await compareScreenshot(page, visLocator, "visualizer-toolbar-disable-layout-engine.png", mask);

    await page.setViewportSize({ width: 500, height: 1000 });
    await compareScreenshot(page, visLocator, "visualizer-toolbar-disable-layout-engine-mobile-view.png", mask);
  });

  test("Custom date range toolbar", async ({ page }) => {
    await page.goto("http://localhost:8080/examples/apexcharts/date_period_field_name.html");

    const toolbarLocator = page.locator(".sa-panel__header").first();

    await page.setViewportSize({ width: 1200, height: 1000 });
    await compareScreenshot(page, toolbarLocator, "custom-date-range-toolbar-desktop.png");

    await page.setViewportSize({ width: 700, height: 1000 });
    await compareScreenshot(page, toolbarLocator, "custom-date-range-toolbar-tablet.png");

    await page.setViewportSize({ width: 500, height: 1000 });
    await compareScreenshot(page, toolbarLocator, "custom-date-range-toolbar-mobile.png");
  });

  test("Custom date range toolbar with validation error", async ({ page }) => {
    await page.goto("http://localhost:8080/examples/apexcharts/date_period_field_name.html");

    const toolbarLocator = page.locator(".sa-panel__header").first();
    const dateInput = page.locator(".sa-date-range_editor input").first();
    const dateValue = (new Date(2025, 9, 17)).toISOString().split("T")[0];

    await dateInput.dispatchEvent("focus");
    await dateInput.fill(dateValue);
    await dateInput.dispatchEvent("change");
    await dateInput.dispatchEvent("blur");

    await page.setViewportSize({ width: 1200, height: 1000 });
    await compareScreenshot(page, toolbarLocator, "custom-date-range-toolbar-with-error-desktop.png");

    await page.setViewportSize({ width: 700, height: 1000 });
    await compareScreenshot(page, toolbarLocator, "custom-date-range-toolbar-with-error-tablet.png");

    await page.setViewportSize({ width: 500, height: 1000 });
    await compareScreenshot(page, toolbarLocator, "custom-date-range-toolbar-with-error-mobile.png");
  });

});
