/* eslint-disable surveyjs/eslint-plugin-i18n/only-english-or-code */
import { test, expect } from "@playwright/test";
import { url_summary, initSummary, getYAxisValues, getListItemByText } from "../helper";

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
        {
          value: 0,
          text: {
            default: "Not Satisfied",
            ru: "Coвсем не устраивает",
          },
        },
        {
          value: 1,
          text: {
            default: "Satisfied",
            ru: "Устраивает",
          },
        },
        {
          value: 2,
          text: {
            default: "Completely satisfied",
            ru: "Полностью устраивает",
          },
        },
      ],
    },
  ],
};

const data = [{ satisfaction: 0 }, { satisfaction: 1 }, { satisfaction: 2 }];

test.describe("localization", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url_summary);
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test("check change locale", async ({ page }) => {
    await initSummary(page, json, data, {});

    const yAxisValues = await getYAxisValues(page);
    expect(yAxisValues).toEqual(json.questions[0].choices.map((choice) => choice.text.ru + "  ").reverse());

    // Check question title in Russian
    const title = await page.locator(".sa-question__title").innerText();
    expect(title).toBe(json.questions[0].title.ru);

    // Change locale to English
    const changeLocaleDropdown = page.locator(".sa-dropdown", { hasText: "Русский" });
    await changeLocaleDropdown.click();
    await getListItemByText(page, "English").click();

    // Check Y axis values in English
    await page.waitForTimeout(500);
    const yAxisValuesEn = await getYAxisValues(page);
    expect(yAxisValuesEn).toEqual(json.questions[0].choices.map((choice) => choice.text.default + "  ").reverse());

    // Check question title in English
    const titleEn = await page.locator(".sa-question__title").innerText();
    expect(titleEn).toBe(json.questions[0].title.default);

    // Check dropdown shows English
    await expect(page.locator(".sa-dropdown", { hasText: "English" })).toHaveCount(1);

    // Check locale in state
    const localeInState = await page.evaluate(() => (window as any).visPanel.state.locale);
    expect(localeInState).toBe("");
  });

  test("check set locale from state", async ({ page }) => {
    await initSummary(page, json, data, {}, undefined, { locale: "en" });

    const yAxisValues = await getYAxisValues(page);
    expect(yAxisValues).toEqual(json.questions[0].choices.map((choice) => choice.text.default + "  ").reverse());

    await expect(page.locator(".sa-dropdown", { hasText: "English" })).toHaveCount(1);
  });
});