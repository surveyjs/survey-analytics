import { axeOptions } from "./helper";
import { checkA11y, injectAxe } from "axe-playwright";
import { test } from "@playwright/test";

test.describe("Pivot chart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/examples/pivot.html");
    await injectAxe(page);
    await page.setViewportSize({ width: 1000, height: 800 });
  });

  test("simple cases", async ({ page }) => {
    const axeContext = "#pivotContainer";
    const xAxisSelector = page.locator(".sa-dropdown-header").nth(1);
    const yAxisSelector = page.locator(".sa-dropdown-header").nth(2);
    await checkA11y(page, axeContext, { axeOptions });

    await yAxisSelector.click();
    await page.getByRole("list").getByText("Item kind").click();
    await checkA11y(page, axeContext, { axeOptions });
    await yAxisSelector.click();
    await page.getByRole("list").getByText("Bill amount").click();
    await checkA11y(page, axeContext, { axeOptions });
    await xAxisSelector.click();
    await page.getByRole("list").getByText("Item kind").click();
    await yAxisSelector.click();
    await page.getByRole("list").getByText("Gender").click();
    await checkA11y(page, axeContext, { axeOptions });
    await yAxisSelector.click();
    await page.getByRole("list").getByText("Bill amount").click();
    await checkA11y(page, axeContext, { axeOptions });
    await xAxisSelector.click();
    await page.getByRole("list").getByText("Bill amount").click();
    await yAxisSelector.click();
    await page.getByRole("list").getByText("Gender").click();
    await checkA11y(page, axeContext, { axeOptions });
    await yAxisSelector.click();
    await page.getByRole("list").getByText("Item kind").click();
    await checkA11y(page, axeContext, { axeOptions });
  });

});