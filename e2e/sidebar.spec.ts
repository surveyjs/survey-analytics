import { test } from "@playwright/test";
import { compareScreenshot, getListItemByText, resetFocusToBody } from "./helper";

process.env.SNAPSHOT_SUFFIX = undefined;
process.env.SNAPSHOT_SUFFIX = "";

test("Series editor", async ({ page }) => {
  await page.goto("http://localhost:8080/examples/apexcharts/pivot.html");

  const openSidebarButton = page.getByRole("button", { name: "Open panel" }).first();
  const closeSidebarButton = page.getByRole("button", { name: "Close" }).first();
  const sidebar = page.locator(".sa-sidebar--opened").first();
  const seriesList = page.locator(".sa-series-list");
  const mask = [
    page.locator(".apexcharts-canvas")
  ];

  await page.setViewportSize({ width: 900, height: 1000 });
  await compareScreenshot(page, page.locator(".sa-question__content").first(), "toolbar-with-sidebar.png", mask);

  await openSidebarButton.click();
  await compareScreenshot(page, sidebar, "sidebar.png");
  await compareScreenshot(page, seriesList.first(), "primary-series-one-series.png");

  await page.getByText("Add Series").first().click();
  await compareScreenshot(page, seriesList.first(), "primary-series-two-series.png");

  await page.getByText("Second Y axis").click();
  await compareScreenshot(page, seriesList.first(), "primary-series-if-secondary-series-add.png");
  await compareScreenshot(page, seriesList.nth(1), "secondary-series-one-series.png");

  await page.getByText("Add Series").nth(1).click();
  await compareScreenshot(page, seriesList.nth(1), "secondary-series-two-series.png");
});

