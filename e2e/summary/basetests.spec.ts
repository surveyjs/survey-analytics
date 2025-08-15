import { test, expect, Page } from "@playwright/test";
import { url_summary, initSummary, dragDropElement } from "../helper";

const json = {
  elements: [
    {
      type: "boolean",
      name: "bool",
      title: "Question 1",
    },
    {
      type: "boolean",
      name: "bool2",
      title: "Question 2",
    },
  ],
};

const data = [
  {
    bool: true,
    bool2: false,
  },
  {
    bool: true,
    bool2: false,
  },
  {
    bool: false,
    bool2: true,
  },
];

const options = {
  allowDynamicLayout: true,
  allowHideQuestions: true,
};

test.describe("basetests", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(url_summary);
    await initSummary(page, json, data, options);
  });

  test("check show/hide questions", async ({ page }) => {
    async function isVisibleInState(page: Page, title: string) {
      return await page.evaluate((title) => {
        return (window as any).visPanel.state.elements.filter(
          (question: any) => question.displayName == title
        )[0].isVisible;
      }, title);
    }

    const questionTitle = "Question 1";
    const questionSelector = page.locator("#summaryContainer .sa-question .sa-question__content", { hasText: questionTitle });
    const showQuestionDropdown = page.locator("#summaryContainer .sa-dropdown").first();

    await expect(questionSelector).toBeVisible();
    await questionSelector.locator("span", { hasText: "Hide" }).click();
    await expect(questionSelector).not.toBeVisible();
    expect(await isVisibleInState(page, questionTitle)).toBeFalsy();

    await showQuestionDropdown.click();
    await page.getByRole("list").getByText(questionTitle).click();
    await expect(questionSelector).toBeVisible();
    expect(await isVisibleInState(page, questionTitle)).toBeTruthy();
  });

  test("check show/hide questions set from constructor", async ({ page }) => {
    await initSummary(page, json, data, {}, [
      {
        name: "bool",
        displayName: "Question 1",
        isVisible: false,
        renderedElement: {},
      },
      {
        name: "bool2",
        displayName: "Question 2",
        isVisible: true,
        renderedElement: {},
      },
    ]);
    const q1 = page.locator("#summaryContainer .sa-question .sa-question__content", { hasText: "Question 1" });
    const q2 = page.locator("#summaryContainer .sa-question .sa-question__content", { hasText: "Question 2" });
    await expect(q1).not.toBeVisible();
    await expect(q2).toBeVisible();
  });

  test("check change questions layout", async ({ page }) => {
    async function getPositionInState(page: Page, title: string) {
      return await page.evaluate((title) => {
        const elements = (window as any).visPanel.state.elements.map((element: any) => element.displayName);
        return elements.indexOf(title);
      }, title);
    }
    const questionTitle = "Question 1";
    const questionSelector = page.locator("#summaryContainer .sa-question .sa-question__content", { hasText: questionTitle });
    expect(await getPositionInState(page, questionTitle)).toBe(0);

    // await questionSelector.locator(".sa-question__title").hover({ force: true });
    // await page.mouse.down();
    // const { width, height } = await <any>page.locator("#summaryContainer .sa-panel__content").boundingBox();
    // await page.mouse.move(width * 0.75, height / 2, { steps: 20 });
    // await page.waitForTimeout(500);
    // await page.mouse.up();
    // await page.waitForTimeout(500);
    await dragDropElement(page, questionSelector.locator(".sa-question__header--draggable"), page.locator("#summaryContainer .sa-panel__content"));

    expect(await getPositionInState(page, questionTitle)).toBe(1);
  });

  test("check filtering data", async ({ page }) => {
    const questionTitle = "Question 1";
    const secondQuestionTitle = "Question 2";
    const questionSelector = page.locator("#summaryContainer .sa-question .sa-question__content", { hasText: questionTitle });
    const secondQuestionSelector = page.locator("#summaryContainer .sa-question .sa-question__content", { hasText: secondQuestionTitle });

    // await questionSelector.locator("[data-unformatted='Yes<br>66.7%']").click();
    await page.getByRole("img").filter({ hasText: "Yes66.7%No33.3%" }).locator("path").first().click({ position: { x: 125, y: 125 } });
    await expect(questionSelector.locator("[data-unformatted='No<br>33.3%']")).not.toBeVisible();
    await expect(secondQuestionSelector.locator("[data-unformatted='Yes<br>33.3%']")).not.toBeVisible();

    await questionSelector.locator("span", { hasText: "Clear" }).click();
    await expect(questionSelector.locator("[data-unformatted='No<br>33.3%']")).toBeVisible();
    await expect(secondQuestionSelector.locator("[data-unformatted='Yes<br>33.3%']")).toBeVisible();
  });

  test("check show/hide commercial license caption", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).SurveyAnalytics.VisualizationPanel.haveCommercialLicense = true;
    });
    const commercialSelector = page.locator("div.sa-commercial");
    await expect(commercialSelector).toBeVisible();
    await initSummary(page, json, data, { haveCommercialLicense: true });
    await expect(commercialSelector).not.toBeVisible();
    await page.evaluate(() => {
      (window as any).SurveyAnalytics.VisualizationPanel.haveCommercialLicense = true;
    });
    await initSummary(page, json, data, {});
    await expect(commercialSelector).not.toBeVisible();
  });
});