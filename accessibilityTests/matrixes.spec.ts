import { axeOptions, getListItemByText } from "./helper";
import { checkA11y, injectAxe } from "axe-playwright";
import { test } from "@playwright/test";

test.describe("Matrixes visualizer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/examples/matrixes.html");
    await page.waitForLoadState("networkidle");
    await injectAxe(page);
  });

  test("matrix single", async ({ page }) => {
    const axeContext = "#summaryContainer";
    const questionTitleSelector = page.locator("h3").filter({ hasText: "What is your perception of these brands?" });
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await getListItemByText(page, "Stacked Bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await getListItemByText(page, "Pie").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await getListItemByText(page, "Doughnut").click();
    await checkA11y(page, axeContext, { axeOptions });

    const transposeButtonSelector = questionVisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Columns$/ });
    await transposeButtonSelector.click();

    await chartTypeSelector.click();
    await getListItemByText(page, "Bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await getListItemByText(page, "Stacked Bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await getListItemByText(page, "Pie").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await getListItemByText(page, "Doughnut").click();
    await checkA11y(page, axeContext, { axeOptions });
  });

  test("matrixdropdown simple", async ({ page }) => {
    const axeContext = "#summaryContainer";
    const questionTitleSelector = page.locator("h3").filter({ hasText: "What do you feel about these brands?" });
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const column1TitleSelector = page.locator("h3").filter({ hasText: "My Opinion" });
    const column1VisualizerSelector = column1TitleSelector.locator("..").locator("..");
    column1VisualizerSelector.scrollIntoViewIfNeeded();

    const chartCol1TypeSelector = column1VisualizerSelector.locator(".sa-dropdown").first();
    await checkA11y(page, axeContext, { axeOptions });

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Vertical Bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Pie").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Doughnut").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Stacked Bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    const transposeButtonSelector = column1VisualizerSelector.locator(".sa-toolbar__button").filter({ hasText: /^Per Columns$/ });
    await transposeButtonSelector.click();

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Vertical Bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Pie").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Doughnut").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartCol1TypeSelector.click();
    await getListItemByText(page, "Stacked Bar").click();
    await checkA11y(page, axeContext, { axeOptions });
  });

});