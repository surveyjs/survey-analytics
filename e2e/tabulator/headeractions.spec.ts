/* eslint-disable surveyjs/eslint-plugin-i18n/only-english-or-code */
import { test, expect } from "@playwright/test";
import { url_tabulator, initTabulator, getListItemByText } from "../helper";

test.describe("headeractions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url_tabulator);
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test("Check pagination", async ({ page }) => {
    const json = {
      elements: [
        { type: "boolean", name: "bool", title: "Question 1" },
        { type: "boolean", name: "bool2", title: "Question 2" },
        { type: "boolean", name: "bool3", title: "Question 3" },
      ],
    };
    const data = [
      { bool: true, bool2: false, bool3: true },
      { bool: true, bool2: false, bool3: false },
      { bool: false, bool2: true, bool3: false },
      { bool: true, bool2: false, bool3: true },
      { bool: true, bool2: false, bool3: false },
      { bool: false, bool2: true, bool3: false },
      { bool: true, bool2: false, bool3: true },
      { bool: true, bool2: false, bool3: false },
      { bool: false, bool2: true, bool3: false },
    ];

    await initTabulator(page, json, data, { actionsColumnWidth: 100 });

    await expect(page.locator("#tabulatorContainer .tabulator-table")).toHaveCount(1);
    await expect(page.locator("#tabulatorContainer .tabulator-table").locator(".tabulator-row")).toHaveCount(5);

    await page.locator(".sa-table__entries .sa-action-dropdown-header").click();
    await getListItemByText(page, "1").click();
    await expect(page.locator("#tabulatorContainer .tabulator-table").locator(".tabulator-row")).toHaveCount(1);

    const pageSize1 = await page.evaluate(() => (window as any).surveyAnalyticsTabulator.state.pageSize);
    expect(pageSize1).toBe(1);

    await page.locator(".sa-table__entries .sa-action-dropdown-header").click();
    await getListItemByText(page, "10").click();
    await expect(page.locator("#tabulatorContainer .tabulator-table").locator(".tabulator-row")).toHaveCount(9);

    const pageSize10 = await page.evaluate(() => (window as any).surveyAnalyticsTabulator.state.pageSize);
    expect(pageSize10).toBe(10);
  });

  test("Check change locale", async ({ page }) => {
    const json = {
      locale: "ru",
      questions: [
        {
          type: "dropdown",
          name: "satisfaction",
          title: {
            default: "How satisfied are you with the Product?",
            ru: "Насколько Вас устраивает наш продукт?",
          },
          choices: [
            { value: 0, text: { default: "Not Satisfied", ru: "Coвсем не устраивает" } },
            { value: 1, text: { default: "Satisfied", ru: "Устраивает" } },
            { value: 2, text: { default: "Completely satisfied", ru: "Полностью устраивает" } },
          ],
        },
      ],
    };
    const data = [{ satisfaction: 0 }, { satisfaction: 1 }, { satisfaction: 2 }];
    await initTabulator(page, json, data, { actionsColumnWidth: 100 });

    await expect(page.locator("#tabulatorContainer span", { hasText: "Насколько Вас устраивает наш продукт?" })).toHaveText("Насколько Вас устраивает наш продукт?");
    await expect(page.locator("#tabulatorContainer .tabulator-row").nth(0)).toHaveText("Coвсем не устраивает");
    await expect(page.locator("#tabulatorContainer .tabulator-row").nth(1)).toHaveText("Устраивает");
    await expect(page.locator("#tabulatorContainer .tabulator-row").nth(2)).toHaveText("Полностью устраивает");

    await page.click('#tabulatorContainer .sa-table__header-extension:has-text("Сменить язык")');
    await getListItemByText(page, "English").click();

    await expect(page.locator("#tabulatorContainer span", { hasText: "How satisfied are you with the Product?" })).toHaveText("How satisfied are you with the Product?");
    await expect(page.locator("#tabulatorContainer .tabulator-row").nth(0)).toHaveText("Not Satisfied");
    await expect(page.locator("#tabulatorContainer .tabulator-row").nth(1)).toHaveText("Satisfied");
    await expect(page.locator("#tabulatorContainer .tabulator-row").nth(2)).toHaveText("Completely satisfied");
    await expect(page.locator("#tabulatorContainer .sa-table__header-extension", { hasText: "Change Locale" })).toBeVisible();

    const locale = await page.evaluate(() => (window as any).surveyAnalyticsTabulator.state.locale);
    expect(locale).toBe("");
  });

  test("Check pagination from state", async ({ page }) => {
    const json = {
      elements: [
        { type: "boolean", name: "bool", title: "Question 1" },
        { type: "boolean", name: "bool2", title: "Question 2" },
        { type: "boolean", name: "bool3", title: "Question 3" },
      ],
    };
    const data = [
      { bool: true, bool2: false, bool3: true },
      { bool: true, bool2: false, bool3: false },
      { bool: false, bool2: true, bool3: false },
      { bool: true, bool2: false, bool3: true },
      { bool: true, bool2: false, bool3: false },
      { bool: false, bool2: true, bool3: false },
      { bool: true, bool2: false, bool3: true },
      { bool: true, bool2: false, bool3: false },
      { bool: false, bool2: true, bool3: false },
    ];

    await initTabulator(page, json, data, { actionsColumnWidth: 100 }, { pageSize: 10 });
    await expect(page.locator("#tabulatorContainer .tabulator-table").locator(".tabulator-row")).toHaveCount(9);
    await expect(page.locator(".sa-table__entries .sa-action-dropdown-header")).toHaveText("10");
  });

  test("Check locale from state", async ({ page }) => {
    const json = {
      locale: "ru",
      questions: [
        {
          type: "dropdown",
          name: "satisfaction",
          title: {
            default: "How satisfied are you with the Product?",
            ru: "Насколько Вас устраивает наш продукт?",
          },
          choices: [
            { value: 0, text: { default: "Not Satisfied", ru: "Coвсем не устраивает" } },
            { value: 1, text: { default: "Satisfied", ru: "Устраивает" } },
            { value: 2, text: { default: "Completely satisfied", ru: "Полностью устраивает" } },
          ],
        },
      ],
    };
    const data = [{ satisfaction: 0 }, { satisfaction: 1 }, { satisfaction: 2 }];
    await initTabulator(page, json, data, { actionsColumnWidth: 100 }, { locale: "en" });

    await expect(page.locator("#tabulatorContainer span", { hasText: "How satisfied are you with the Product?" })).toHaveText("How satisfied are you with the Product?");
    await expect(page.locator("#tabulatorContainer .tabulator-row").nth(0)).toHaveText("Not Satisfied");
    await expect(page.locator("#tabulatorContainer .tabulator-row").nth(1)).toHaveText("Satisfied");
    await expect(page.locator("#tabulatorContainer .tabulator-row").nth(2)).toHaveText("Completely satisfied");
  });

  test("Check commercial license caption", async ({ page }) => {
    const json = {
      questions: [
        { type: "dropdown", name: "simplequestion", choices: [0] },
      ],
    };
    const data: any[] = [];

    await initTabulator(page, json, data, { });
    await expect(page.locator("#tabulatorContainer span", { hasText: "To use the Dashboard library in your application" }).nth(1)).toBeVisible();

    await initTabulator(page, json, data, { haveCommercialLicense: true });
    await expect(page.locator("#tabulatorContainer span", { hasText: "To use the Dashboard library in your application" }).nth(1)).not.toBeVisible();

    await initTabulator(page, json, data, { haveCommercialLicense: true });
    await expect(page.locator("#tabulatorContainer span", { hasText: "To use the Dashboard library in your application" }).nth(1)).not.toBeVisible();
  });
});
