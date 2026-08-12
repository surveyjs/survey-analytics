import { test, expect } from "@playwright/test";
import { compareScreenshot, getListItemByText } from "../helper";

test.describe("Pivot chart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("pivot.html");
    await page.setViewportSize({ width: 1000, height: 800 });
  });

  test("simple cases", async ({ page }) => {
    const openSidebarButton = page.getByRole("button", { name: "Open panel" }).first();
    const closeSidebarButton = page.getByRole("button", { name: "Close" }).first();
    const xAxisSelector = page.locator(".sa-dropdown-header").nth(1);
    const yAxisSelector = page.locator(".sa-dropdown-header").nth(2);
    await page.evaluate(() => {
      const style = document.createElement("style");
      style.textContent = ".sa-commercial { display: none; }";
      document.head.appendChild(style);
    });

    await openSidebarButton.click();
    await expect(page.locator("#pivotContainer").getByText("Category (X Axis)")).toBeVisible();
    await expect(xAxisSelector).toBeVisible();
    await expect(page.locator("#pivotContainer").getByText("Legend (Series)").first()).toBeVisible();
    await expect(yAxisSelector).toBeVisible();
    await closeSidebarButton.click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q1-none.png");

    await openSidebarButton.click();
    await yAxisSelector.click();
    await getListItemByText(page, "Item kind").click();
    await closeSidebarButton.click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q1-q2.png");

    await openSidebarButton.click();
    await yAxisSelector.click();
    await getListItemByText(page, "Bill amount").click();
    await page.getByRole("button", { name: "Selected: Item kind" }).click();
    await getListItemByText(page, "Bill amount").click();
    await page.getByRole("button", { name: "Selected: Count" }).click();
    await getListItemByText(page, "Sum").click();
    await closeSidebarButton.click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q1-q3.png");

    await openSidebarButton.click();
    await xAxisSelector.click();
    await getListItemByText(page, "Item kind").click();
    await yAxisSelector.click();
    await getListItemByText(page, "Gender").click();
    await page.getByRole("button", { name: "Selected: Bill amount" }).click();
    await getListItemByText(page, "Gender").click();
    await page.getByRole("button", { name: "Selected: Sum" }).click();
    await getListItemByText(page, "Count").click();
    await closeSidebarButton.click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q2-q1.png");

    await openSidebarButton.click();
    await yAxisSelector.click();
    await getListItemByText(page, "Bill amount").click();
    await page.getByRole("button", { name: "Selected: Gender" }).click();
    await getListItemByText(page, "Bill amount").click();
    await page.getByRole("button", { name: "Selected: Count" }).click();
    await getListItemByText(page, "Sum").click();
    await closeSidebarButton.click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q2-q3.png");

    await openSidebarButton.click();
    await xAxisSelector.click();
    await getListItemByText(page, "Bill amount").click();
    await yAxisSelector.click();
    await getListItemByText(page, "Gender").click();
    await page.getByRole("button", { name: "Selected: Bill amount" }).nth(1).click();
    await getListItemByText(page, "Gender").click();
    await page.getByRole("button", { name: "Selected: Sum" }).click();
    await getListItemByText(page, "Count").click();
    await closeSidebarButton.click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q3-q1.png");
    await openSidebarButton.click();

    await yAxisSelector.click();
    await getListItemByText(page, "Item kind").click();
    await closeSidebarButton.click();
    await compareScreenshot(page, "#pivotContainer", "pivot-q3-q2.png");
  });

});
