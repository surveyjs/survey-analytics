import { test, expect } from "@playwright/test";
import { initTabulator, url_tabulator } from "../helper";

test.describe("resize", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__windowErrors = [];
      window.addEventListener("error", (e) => {
        (window as any).__windowErrors.push(e.message);
      });
    });
    await page.goto(url_tabulator);
    await page.setViewportSize({ width: 1920, height: 1080 });

    const json = {
      elements: [
        { type: "text", name: "city", title: "City" },
        { type: "text", name: "department", title: "Department" },
        { type: "text", name: "role", title: "Role" },
        { type: "comment", name: "feedback", title: "Feedback" },
      ],
    };
    const data: Array<any> = [];
    for(let i = 0; i < 40; i++) {
      data.push({ city: "City " + i, department: "Department " + (i % 4), role: "Role " + i, feedback: "Feedback comment " + i });
    }
    await initTabulator(page, json, data);
    await expect(page.locator("#tabulatorContainer .tabulator-row").first()).toBeVisible();
  });

  test("no ResizeObserver loop errors on page size change and window resize (#420)", async ({ page }) => {
    const entries = page.locator("#tabulatorContainer .sa-table__entries");
    const selectPageSize = async (size: string) => {
      await entries.locator(".sa-action-dropdown-header").click();
      await entries.getByText(size, { exact: true }).last().click();
    };

    await page.setViewportSize({ width: 800, height: 600 });
    await selectPageSize("10");
    await expect(page.locator("#tabulatorContainer .tabulator-row")).toHaveCount(10);

    for(const [width, height] of [[1600, 900], [1366, 768], [1024, 700], [900, 600], [640, 480]]) {
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(100);
    }

    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.waitForTimeout(100);
    await page.setViewportSize({ width: 1024, height: 700 });
    await page.waitForTimeout(500);

    const errors = await page.evaluate(() => (window as any).__windowErrors);
    expect(errors.filter((message: string) => /ResizeObserver/.test(message))).toEqual([]);
  });

  test("columns are refitted after the container width changes", async ({ page }) => {
    const tableWidth = () => page.locator("#tabulatorContainer .tabulator-tableholder").evaluate((el) => el.clientWidth);
    const headerWidth = () => page.locator("#tabulatorContainer .tabulator-headers").evaluate((el) => (el as HTMLElement).offsetWidth);

    await page.setViewportSize({ width: 2400, height: 900 });
    await expect.poll(async () => Math.abs(await headerWidth() - await tableWidth())).toBeLessThan(20);
    const wideHeaderWidth = await headerWidth();

    await page.setViewportSize({ width: 2000, height: 900 });
    await expect.poll(async () => Math.abs(await headerWidth() - await tableWidth())).toBeLessThan(20);
    expect(await headerWidth()).toBeLessThan(wideHeaderWidth);
  });
});
