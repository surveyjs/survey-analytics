import { test, expect, initSummary, initTabulator, url_summary, url_tabulator } from "./helper";

process.env.SNAPSHOT_SUFFIX = undefined;
process.env.SNAPSHOT_SUFFIX = "";

const json = {
  elements: [
    { type: "radiogroup", name: "q1", title: "Question 1", choices: ["a", "b"] },
    { type: "radiogroup", name: "q2", title: "Question 2", choices: ["a", "b"] },
  ],
};
const data = [{ q1: "a", q2: "b" }, { q1: "b", q2: "a" }];

test("Summary: icon action shows the survey-core tooltip on hover", async ({ page }) => {
  await page.goto(url_summary);
  await initSummary(page, json, data, { allowHideQuestions: true });

  const hideAction = page.locator(".sa-question__hide-action").first();
  const tooltip = page.locator(".sv-tooltip");
  await expect(hideAction).toHaveAttribute("data-sv-tooltip", "Hide");

  await hideAction.hover();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText("Hide");
  // The native tooltip is suppressed only while the custom one is shown.
  await expect(hideAction).not.toHaveAttribute("title");

  await page.mouse.move(0, 0);
  await expect(tooltip).toBeHidden();
  await expect(hideAction).toHaveAttribute("title", "Hide");
});

test("Table: column action tooltip follows the button state", async ({ page }) => {
  await page.goto(url_tabulator);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await initTabulator(page, json, data);

  const tooltip = page.locator(".sv-tooltip");
  const sortButton = page.locator(".tabulator-col .sa-table__svg-button[data-sv-tooltip='Default Order']").first();
  // Pin the element: the attribute used to find it changes on click.
  await sortButton.evaluate(el => el.id = "sort-button-under-test");
  const pinnedSortButton = page.locator("#sort-button-under-test");
  await sortButton.hover();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveText("Default Order");

  await pinnedSortButton.click();
  await expect(tooltip).toBeHidden();
  await expect(pinnedSortButton).toHaveAttribute("data-sv-tooltip", "Descending");
});
