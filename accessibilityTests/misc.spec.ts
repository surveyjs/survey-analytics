import { axeOptions, getListItemByText } from "./helper";
import { checkA11y, injectAxe } from "axe-playwright";
import { test } from "@playwright/test";

test.describe("Miscellaneous cases", () => {
  test.beforeEach(async ({ page }) => {
  });

  test("matrix one row", async ({ page }) => {
    await page.goto("http://localhost:8080/examples/matrix-one-row.html");
    await injectAxe(page);
    await page.setViewportSize({ width: 800, height: 1000 });
    const axeContext = "#summaryContainer";

    const questionTitleSelector = page.locator("h3").filter({ hasText: "Please indicate if you agree or disagree with the following statements" });
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");

    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await getListItemByText(page, "Pie").click();
    await checkA11y(page, axeContext, { axeOptions });

    const transposeButtonSelector = questionVisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Columns$/ });
    await transposeButtonSelector.click();

    await chartTypeSelector.click();
    await getListItemByText(page, "Bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await getListItemByText(page, "Pie").click();
    await checkA11y(page, axeContext, { axeOptions });
  });

  test("matrix dropdown grouped", async ({ page }) => {
    await page.goto("http://localhost:8080/examples/matrixdropdown-grouped.html");
    await injectAxe(page);
    await page.setViewportSize({ width: 800, height: 1000 });

    const axeContext = "#summaryContainer";
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Please select the top 3 processes that you perceived as most difficult or troublesome." });
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").nth(1);

    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await getListItemByText(page, "Bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    const transposeButtonSelector = questionVisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Columns$/ });
    await transposeButtonSelector.click();

    await chartTypeSelector.click();
    await getListItemByText(page, "Stacked Bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await getListItemByText(page, "Bar").click();
    await checkA11y(page, axeContext, { axeOptions });
  });
});