import { test, expect, Page } from "@playwright/test";
import { dragDropElement, initTabulator, url_tabulator } from "../helper";

test.describe("columnactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url_tabulator);
    await page.setViewportSize({ width: 1920, height: 1080 });

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
    ];

    await page.evaluate(() => {
      (window as any).SurveyAnalyticsTabulator.TableExtensions.findExtension(
        "column",
        "makepublic"
      ).visibleIndex = 0;
    });

    await initTabulator(page, json, data, { actionsColumnWidth: 100 });
  });

  test("Check show/hide actions", async ({ page }) => {
    const getColumnsVisibilityArray = async () =>
      await page.evaluate(() =>
        (window as any).surveyAnalyticsTabulator.state.elements.map((column: any) => column.isVisible)
      );

    await expect(page.locator("#tabulatorContainer .tabulator-col-title", { hasText: "Question 1" })).toBeVisible();
    await expect(await getColumnsVisibilityArray()).toEqual([true, true, true]);

    await page.click('#tabulatorContainer .tabulator-col[tabulator-field="bool"] button[title="Hide column"]');
    await expect(page.locator("#tabulatorContainer .tabulator-col-title", { hasText: "Question 1" })).not.toBeVisible();
    await expect(await getColumnsVisibilityArray()).toEqual([false, true, true]);

    await page.click("#tabulatorContainer .sa-table__show-column.sa-table__header-extension");
    // await page.selectOption(
    //   "#tabulatorContainer .sa-table__show-column.sa-table__header-extension",
    //   { label: "Question 1" }
    // );
    await page.getByRole("combobox").first().selectOption("Question 1");
    await expect(page.locator("#tabulatorContainer .tabulator-col-title", { hasText: "Question 1" })).toBeVisible();
    await expect(await getColumnsVisibilityArray()).toEqual([true, true, true]);
  });

  test("Check move to details", async ({ page }) => {
    const getColumnsLocationsArray = async () =>
      await page.evaluate(() =>
        (window as any).surveyAnalyticsTabulator.state.elements.map((column: any) => column.location)
      );

    await expect(page.locator('#tabulatorContainer .tabulator-col[tabulator-field="bool"]')).toBeVisible();
    await expect(await getColumnsLocationsArray()).toEqual([0, 0, 0]);

    await page.click('#tabulatorContainer .tabulator-row:nth-child(1) button[title="Show minor columns"]');
    await expect(page.locator("#tabulatorContainer td", { hasText: "Question 1" })).toHaveCount(0);

    await page.click('#tabulatorContainer .tabulator-col[tabulator-field="bool"] button[title="Move to Detail"]');
    await expect(page.locator('#tabulatorContainer .tabulator-col[tabulator-field="bool"]')).not.toBeVisible();

    await page.click('#tabulatorContainer .tabulator-row:nth-child(1) button[title="Show minor columns"]');
    await expect(page.locator("#tabulatorContainer td", { hasText: "Question 1" })).toBeVisible();
    await expect(page.locator("#tabulatorContainer td", { hasText: "Yes" })).toBeVisible();
    await expect(await getColumnsLocationsArray()).toEqual([1, 0, 0]);

    await page.click('#tabulatorContainer button:has-text("Show as Column")');
    await expect(page.locator('#tabulatorContainer .tabulator-col[tabulator-field="bool"]')).toBeVisible();
    await expect(await getColumnsLocationsArray()).toEqual([0, 0, 0]);

    await page.click('#tabulatorContainer .tabulator-row:nth-child(1) button[title="Show minor columns"]');
    await expect(page.locator("#tabulatorContainer td", { hasText: "Question 1" })).toHaveCount(0);
  });

  test("Check columns drag and drop", async ({ page }) => {
    const getColumnNamesOrder = async () =>
      await page.evaluate(() => {
        const names: string[] = [];
        document.querySelectorAll(".tabulator .tabulator-col").forEach((col) => names.push((col as HTMLElement).innerText));
        names.splice(0, 1);
        return names;
      });

    const getColumnNamesOrderInState = async () =>
      await page.evaluate(() =>
        (window as any).surveyAnalyticsTabulator.state.elements.map((col: any) => col.displayName)
      );

    // Simulate drag and drop
    const dragButton = page.locator('#tabulatorContainer div.tabulator-col[tabulator-field="bool"] button.sa-table__drag-button');
    const target = page.locator('#tabulatorContainer div.tabulator-col[tabulator-field="bool3"]');
    // await dragButton.dragTo(target, { force: true });
    await dragDropElement(page, dragButton, target);

    await expect(await getColumnNamesOrder()).toEqual(["Question 2", "Question 1", "Question 3"]);
    await expect(await getColumnNamesOrderInState()).toEqual(["Question 2", "Question 1", "Question 3"]);
  });

  test("Check public/private actions", async ({ page }) => {
    const getPublicitArrayInState = async () =>
      await page.evaluate(() =>
        (window as any).surveyAnalyticsTabulator.state.elements.map((col: any) => col.isPublic)
      );

    await page.click('#tabulatorContainer .tabulator-col[tabulator-field="bool2"] button.sa-table__svg-button[title="Make column private"]');
    await expect(await getPublicitArrayInState()).toEqual([true, false, true]);

    await page.click('#tabulatorContainer .tabulator-col[tabulator-field="bool2"] button.sa-table__svg-button[title="Make column public"]');
    await expect(await getPublicitArrayInState()).toEqual([true, true, true]);
  });

  test("Check tabulator taking into account state", async ({ page }) => {
    const json = {
      elements: [
        { type: "boolean", name: "bool", title: "Question 1" },
        { type: "boolean", name: "bool2", title: "Question 2" },
        { type: "boolean", name: "bool3", title: "Question 3" },
        { type: "boolean", name: "bool4", title: "Question 4" },
      ],
    };
    const data = [
      { bool: true, bool2: false, bool3: true, bool4: true },
      { bool: true, bool2: false, bool3: false, bool4: true },
      { bool: false, bool2: true, bool3: false, bool4: true },
    ];
    const columnsData = [
      { "name": "bool4", "displayName": "Question 4", "dataType": 0, "isVisible": true, "location": 0 },
      { "name": "bool", "displayName": "Question 1", "dataType": 0, "isVisible": false, "location": 0 },
      { "name": "bool2", "displayName": "Question 2", "dataType": 0, "isVisible": true, "location": 1 },
      { "name": "bool3", "displayName": "Question 3", "dataType": 0, "isVisible": true, "location": 0 }
    ];
    await initTabulator(page, json, data, { actionsColumnWidth: 100 }, {}, columnsData);

    const getColumnNamesOrder = async () =>
      await page.evaluate(() => {
        const names: string[] = [];
        document.querySelectorAll(".tabulator .tabulator-col").forEach((col) => names.push((col as HTMLElement).innerText));
        names.splice(0, 1);
        return names;
      });

    await expect(await getColumnNamesOrder()).toEqual(["Question 4", "Question 1", "Question 2", "Question 3"]);
    await expect(page.locator("#tabulatorContainer .tabulator-col", { hasText: "Question 1" })).not.toBeVisible();
    await expect(page.locator("#tabulatorContainer .tabulator-col", { hasText: "Question 2" })).not.toBeVisible();

    const columnSelector = page.locator("#tabulatorContainer .sa-table__show-column.sa-table__header-extension");
    await expect(columnSelector.locator("option")).not.toHaveCount(0);

    await page.click('#tabulatorContainer .tabulator-row:nth-child(1) button[title="Show minor columns"]');
    await expect(page.locator("#tabulatorContainer td", { hasText: "Question 2" })).toBeVisible();
  });
});

