import { SurveyModel, setLicenseKey } from "survey-core";
import { vi } from "vitest";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Tabulator } from "../../src/entries/tabulator-umd";

vi.mock("tabulator-tables", async () => {
  const tabulatorModule = await vi.importActual<any>("tabulator-tables");
  return { default: tabulatorModule.TabulatorFull || tabulatorModule.Tabulator };
});

const json = { elements: [{ type: "dropdown", name: "q1", choices: ["a", "b"] }] };
const data = [{ q1: "a" }, { q1: "b" }];

afterEach(() => {
  // "embedded-none" is not a known integration, so it resets the marker
  setLicenseKey("embedded-none");
});

test("Tabulator shows the regular banner without the embedded marker", () => {
  const survey = new SurveyModel(json);
  const tabulator = new Tabulator(survey, data, null);
  const container = document.createElement("div");
  tabulator.render(container);
  expect(container.querySelectorAll(".sa-commercial").length).toBe(1);
  expect(container.querySelectorAll(".sa-embedded-banner-host").length).toBe(0);
  tabulator.destroy();
});

test("Tabulator shows the embedded card after the table, and closing it survives re-render", () => {
  setLicenseKey("embedded-wordpress");
  const survey = new SurveyModel(json);
  const tabulator = new Tabulator(survey, data, null);
  const container = document.createElement("div");
  tabulator.render(container);
  expect(container.querySelectorAll(".sa-commercial").length).toBe(0);
  expect(container.lastElementChild.className).toBe("sa-embedded-banner-host");
  expect(container.querySelector(".sa-tabulator__wrapper").nextElementSibling.className).toBe("sa-embedded-banner-host");
  expect((container.querySelector(".sa-embedded-banner__link") as HTMLAnchorElement).getAttribute("href")).toBe("https://surveyjs.io/wordpress#white-label");

  (container.querySelector(".sa-embedded-banner__close") as HTMLButtonElement).click();
  expect(container.querySelectorAll(".sa-embedded-banner-host").length).toBe(0);
  tabulator.render(container);
  expect(container.querySelectorAll(".sa-embedded-banner-host").length).toBe(0);
  tabulator.destroy();
});
