/* eslint-disable surveyjs/eslint-plugin-i18n/only-english-or-code */
import { test, expect } from "@playwright/test";
import { compareScreenshot, initTabulator, url_tabulator } from "../helper";

const explicitErrorHandler = async (page) => {
  await page.evaluate(() => {
    window.addEventListener("error", e => {
      if(e.message === "ResizeObserver loop completed with undelivered notifications." ||
      e.message === "ResizeObserver loop limit exceeded") {
        e.stopImmediatePropagation();
      }
    });
  });
};

const json = {
  locale: "ar",
  questions: [
    {
      type: "dropdown",
      name: "satisfaction",
      title: {
        default: "How satisfied are you with the Product?",
        ar: "ما مدى رضاك عن المنتج؟",
      },
      choices: [
        { value: 0, text: { default: "Not Satisfied", ar: "غير راضٍ" } },
        { value: 1, text: { default: "Satisfied", ar: "راضٍ" } },
        { value: 2, text: { default: "Completely satisfied", ar: "راضٍ تماماً" } },
      ],
    },
    {
      type: "boolean",
      name: "recommend",
      title: {
        default: "Would you recommend us?",
        ar: "هل توصي بنا؟",
      },
    },
  ],
};

const data = [
  { satisfaction: 0, recommend: true },
  { satisfaction: 1, recommend: false },
  { satisfaction: 2, recommend: true },
  { satisfaction: 1, recommend: true },
  { satisfaction: 0, recommend: false },
  { satisfaction: 2, recommend: true },
];

test.describe("tabulator rtl", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url_tabulator);
    await page.setViewportSize({ width: 1280, height: 800 });
    await explicitErrorHandler(page);
  });

  test("arabic locale renders the table in rtl", async ({ page }) => {
    await initTabulator(page, json, data, { actionsColumnWidth: 100, haveCommercialLicense: true });

    const table = page.locator("#tabulatorContainer .tabulator");
    await expect(table).toBeVisible();
    await expect(table).toHaveClass(/tabulator-rtl/);
    await expect(page.locator("#tabulatorContainer")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#tabulatorContainer").getByText("ما مدى رضاك عن المنتج؟")).toBeVisible();

    await compareScreenshot(page, "#tabulatorContainer", "tabulator-rtl-ar.png");
  });
});
