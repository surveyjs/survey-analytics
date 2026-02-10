import type { Locator, Page } from "@playwright/test";
import { expect, test as baseTest } from "@playwright/test";

export const url_summary = "http://127.0.0.1:8080/examples/summarytest.html";
export const url_tabulator = "http://127.0.0.1:8080/examples/tabulator.html";

export const initSummary = async (page: Page, json: any, data, options, elements?, state?) => {
  await page.evaluate(([json, data, options, elements, state]) => {
    var model = new (window as any).Survey.SurveyModel(json);
    (window as any).survey = model;
    if(!!(window as any).visPanel) {
      (window as any).visPanel.destroy();
    }
    var options = options || {};
    options.survey = model;
    var visPanel = ((window as any).visPanel = new (window as any).SurveyAnalytics.VisualizationPanel(
      model.getAllQuestions(),
      data,
      options,
      elements
    ));
    visPanel.state = state;
    visPanel.showToolbar = true;
    visPanel.render(document.getElementById("summaryContainer"));
  }, [json, data, options, elements, state]);
};

export const initTabulator = async (page, json, data, options?, state?, columnsData?) => {
  await page.evaluate(({ json, data, options, state, columnsData }) => {
    var survey = new (window as any).Survey.SurveyModel(json);
    const tabulator = new (window as any).SurveyAnalyticsTabulator.Tabulator(survey, data, options, columnsData);
    (window as any).surveyAnalyticsTabulator = tabulator;
    tabulator.state = state;
    tabulator.render(document.getElementById("tabulatorContainer"));
  }, { json, data, options, state, columnsData });
};

export async function dragDropElement(page: Page, dragElemnt, dropElement) {
  await dragElemnt.hover({ force: true });
  await page.mouse.down();
  const { x, y, width, height } = await <any>dropElement.boundingBox();
  await page.mouse.move(x + width * 0.75, y + height / 2, { steps: 20 });
  await page.waitForTimeout(500);
  await page.mouse.up();
  await page.waitForTimeout(500);
}

export function RGBToHex(rgb): string {
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  if(r.length == 1) r = "0" + r;
  if(g.length == 1) g = "0" + g;
  if(b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

export async function getYAxisValues(page) {
  return await page.evaluate(() => {
    var yValues = [];
    document.querySelectorAll(".yaxislayer-above g.ytick text").forEach((el) => {
      yValues.push(el.getAttribute("data-unformatted"));
    });
    return yValues;
  });
}

export function getListItemByText(page, text) {
  return page.getByRole("option", { name: text, exact: true });
}

export async function resetFocusToBody(page: Page): Promise<void> {
  await page.evaluate(() => {
    if(!!document.activeElement) {
      document.activeElement.blur();
    }
    document.body.focus();
  });
}

// export const getYAxisValues = ClientFunction(() => {
//   var yValues = [];
//   document.querySelectorAll(".yaxislayer-above g.ytick text").forEach((el) => {
//     yValues.push(el.getAttribute("data-unformatted"));
//   });
//   return yValues;
// });

export async function compareScreenshot(page: Page, elementSelector: string | Locator | undefined, screenshotName: string, mask?: Array<Locator>): Promise<void> {
  await page.addStyleTag({
    content: "textarea::-webkit-resizer { visibility: hidden !important; }"
  });
  await resetFocusToBody(page);
  await page.mouse.move(0, 0);

  const options = {
    timeout: 10000
  };
  if(mask) {
    (options as any).mask = mask;
    (options as any).maskColor = "#000000";
  }

  if(!!elementSelector) {
    let elementLocator: Locator;
    if(typeof elementSelector == "string") {
      elementLocator = page.locator(elementSelector);
    } else {
      elementLocator = elementSelector;
    }
    const element = elementLocator.filter({ visible: true });
    element.scrollIntoViewIfNeeded();
    await expect.soft(element.nth(0)).toBeVisible();
    await expect.soft(element.nth(0)).toHaveScreenshot(screenshotName, options);
  } else {
    await expect.soft(page).toHaveScreenshot(screenshotName, options);
  }
}

export const test = baseTest.extend<{page: void, skipJSErrors: boolean}>({
  skipJSErrors: [false, { option: false }],
  page: async ({ page, skipJSErrors }, use) => {
    const errors: Array<Error> = [];
    page.addListener("pageerror", (error) => {
      errors.push(error);
    });
    await use(page);
    if(!skipJSErrors) {
      expect(errors).toHaveLength(0);
    }
  }
});

export { expect };