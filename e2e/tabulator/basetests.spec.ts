import { test, expect, Page } from "@playwright/test";
import { url_tabulator } from "../helper";

export const explicitErrorHandler = async (page) => {
  await page.evaluate(() => {
    window.addEventListener("error", e => {
      if(e.message === "ResizeObserver loop completed with undelivered notifications." ||
      e.message === "ResizeObserver loop limit exceeded") {
        e.stopImmediatePropagation();
      }
    });
  });
};

test.describe("basetests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url_tabulator);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await explicitErrorHandler(page);
  });

  test("check xss in header and cell", async ({ page }) => {
    const xssText = "Which of the following best describes you or your organization?<button id='xyz' onclick='alert();'>hello</button><img src='dymmy' onerror='alert(\"xss\");'>";

    // Selectors adapted for Playwright
    const headerSelector = ".tabulator-headers div:nth-of-type(7) span";
    const cellSelector = ".tabulator-row div:nth-of-type(7)";

    const headerText = await page.locator(headerSelector).first().innerText();
    const cellText = await page.locator(cellSelector).first().innerText();

    expect(headerText).toBe(xssText);
    expect(cellText).toBe(xssText);
  });
});