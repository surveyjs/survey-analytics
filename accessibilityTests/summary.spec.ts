import { axeOptions } from "./helper";
import { checkA11y, injectAxe } from "axe-playwright";
import { test } from "@playwright/test";

test.describe("Summary common", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8080/examples/summary.html");
    await injectAxe(page);
    await page.setViewportSize({ width: 800, height: 1000 });
  });

  test("matrix simple cases", async ({ page }) => {
    const axeContext = "#summaryContainer";
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Please indicate if you agree or disagree with the following statements" });
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await page.getByRole("list").getByText("Stacked bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await page.getByRole("list").getByText("Pie").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await page.getByRole("list").getByText("Doughnut").click();
    await checkA11y(page, axeContext, { axeOptions });
  });

  test("boolean simple cases", async ({ page }) => {
    const axeContext = "#summaryContainer";
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Please answer the question" });
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content");
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await page.getByRole("list").getByText("Bar", { exact: true }).click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await page.getByRole("list").getByText("Doughnut").click();
    await checkA11y(page, axeContext, { axeOptions });
  });

  test("select simple cases", async ({ page }) => {
    const axeContext = "#summaryContainer";
    const questionTitleSelector = page.locator("h3").filter({ hasText: "Which of the following best describes you or your organization?" });
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").nth(1);
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").nth(1);
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await page.getByRole("list").getByText("Vertical Bar").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await page.getByRole("list").getByText("Pie").click();
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await page.getByRole("list").getByText("Doughnut").click();
    await checkA11y(page, axeContext, { axeOptions });

    await visualizerSelector.click();
    await page.getByRole("list").getByText("Table").click();
    await checkA11y(page, axeContext, { axeOptions });
  });

  test("simple cases", async ({ page }) => {
    const axeContext = "#summaryContainer";
    const questionTitleSelector = page.locator("h3").filter({ hasText: "How likely are you to recommend SurveyJS to a friend or colleague?" });
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    const chartTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").nth(1);
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").nth(1);
    await checkA11y(page, axeContext, { axeOptions });

    await chartTypeSelector.click();
    await page.getByRole("list").getByText("Bar", { exact: true }).click();
    await checkA11y(page, axeContext, { axeOptions });

    await visualizerSelector.click();
    await page.getByRole("list").getByText("Average").click();

    const gaugeTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").nth(1);
    await checkA11y(page, axeContext, { axeOptions });

    await gaugeTypeSelector.click();
    await page.getByRole("list").getByText("Bullet").click();
    await checkA11y(page, axeContext, { axeOptions });
  });

  test("text simple cases", async ({ page }) => {
    const axeContext = "#summaryContainer";
    const questionTitleSelector = page.locator("h3").filter({ hasText: "What's your favorite functionality / add-on?" });
    const questionVisualizerSelector = questionTitleSelector.locator("..").locator("..");
    questionVisualizerSelector.scrollIntoViewIfNeeded();

    const visualizerTypeSelector = questionVisualizerSelector.locator(".sa-dropdown").first();
    const chartContentSelector = questionVisualizerSelector.locator(".sa-visualizer__content").nth(1);
    await checkA11y(page, axeContext, { axeOptions });

    await visualizerTypeSelector.click();
    await page.getByRole("list").getByText("Text").click();
    await checkA11y(page, axeContext, { axeOptions });
  });
});