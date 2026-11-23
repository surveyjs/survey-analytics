import { SurveyModel, setLicenseKey } from "survey-core";
import { VisualizationPanel } from "../src/visualizationPanel";
import { VisualizerBase } from "../src/visualizerBase";
import { PivotModel } from "../src/pivot";
import "../src/selectBase";

const json = { elements: [{ type: "dropdown", name: "q1", choices: ["a", "b"] }] };
const data = [{ q1: "a" }, { q1: "b" }];

function setEmbeddedMarker(on: boolean): void {
  // "embedded-none" is not a known integration, so it resets the marker
  setLicenseKey(on ? "embedded-wordpress" : "embedded-none");
}

function getHostChildClasses(container: HTMLElement): Array<string> {
  const res: Array<string> = [];
  for(let i = 0; i < container.children.length; i++) {
    res.push(container.children[i].className);
  }
  return res;
}

afterEach(() => {
  setEmbeddedMarker(false);
});

test("VisualizationPanel shows the regular banner without the embedded marker", () => {
  const survey = new SurveyModel(json);
  const panel = new VisualizationPanel(survey.getAllQuestions(), data);
  const container = document.createElement("div");
  panel.render(container);
  expect(panel["haveCommercialLicense"]).toBeFalsy();
  expect(container.querySelectorAll(".sa-commercial").length).toBe(1);
  expect(container.querySelectorAll(".sa-embedded-banner").length).toBe(0);
  panel.destroy();
});

test("VisualizationPanel shows the embedded card after the content for the embedded marker", () => {
  setEmbeddedMarker(true);
  const survey = new SurveyModel(json);
  const panel = new VisualizationPanel(survey.getAllQuestions(), data);
  const container = document.createElement("div");
  panel.render(container);

  expect(container.querySelectorAll(".sa-commercial").length).toBe(0);
  expect(getHostChildClasses(container)).toEqual(["sa-visualizer-wrapper", "sa-embedded-banner-host"]);
  const banner = container.querySelector(".sa-embedded-banner") as HTMLElement;
  expect(banner.querySelector(".sa-embedded-banner__powered-by").textContent).toBe("Powered by");
  const brand = banner.querySelector(".sa-embedded-banner__brand") as HTMLElement;
  expect(brand.getAttribute("role")).toBe("img");
  expect(brand.getAttribute("aria-label")).toBe("SurveyJS");
  expect(brand.querySelector("use").getAttribute("href")).toBe("#sa-svg-logo-surveyjs-72x16");
  const link = banner.querySelector(".sa-embedded-banner__link") as HTMLAnchorElement;
  expect(link.textContent).toBe("White-label options");
  expect(link.getAttribute("href")).toBe("https://surveyjs.io/wordpress#white-label");
  expect(link.target).toBe("_blank");
  expect(link.rel).toBe("noopener noreferrer");
  const close = banner.querySelector(".sa-embedded-banner__close") as HTMLButtonElement;
  expect(close.type).toBe("button");
  expect(close.getAttribute("aria-label")).toBe("Close");
  expect(close.querySelector("use").getAttribute("href")).toBe("#sa-svg-close-tiny-16x16");
  panel.destroy();
});

test("VisualizationPanel: closing the embedded card keeps it hidden across re-render of the same instance only", () => {
  setEmbeddedMarker(true);
  const survey = new SurveyModel(json);
  const panel = new VisualizationPanel(survey.getAllQuestions(), data);
  const container = document.createElement("div");
  panel.render(container);
  (container.querySelector(".sa-embedded-banner__close") as HTMLButtonElement).click();
  expect(container.querySelectorAll(".sa-embedded-banner-host").length).toBe(0);
  expect(container.querySelectorAll(".sa-visualizer-wrapper").length).toBe(1);

  panel.clear();
  panel.render(container);
  expect(container.querySelectorAll(".sa-embedded-banner-host").length).toBe(0);
  panel.destroy();

  const panel2 = new VisualizationPanel(survey.getAllQuestions(), data);
  const container2 = document.createElement("div");
  panel2.render(container2);
  expect(container2.querySelectorAll(".sa-embedded-banner-host").length).toBe(1);
  panel2.destroy();
});

test("VisualizationPanel: clear + render does not duplicate the embedded card", () => {
  setEmbeddedMarker(true);
  const survey = new SurveyModel(json);
  const panel = new VisualizationPanel(survey.getAllQuestions(), data);
  const container = document.createElement("div");
  panel.render(container);
  panel.clear();
  expect(container.querySelectorAll(".sa-embedded-banner-host").length).toBe(0);
  panel.render(container);
  expect(getHostChildClasses(container)).toEqual(["sa-visualizer-wrapper", "sa-embedded-banner-host"]);
  panel.destroy();
});

test("Licensed VisualizationPanel shows no banner with the embedded marker", () => {
  setEmbeddedMarker(true);
  VisualizerBase.haveCommercialLicense = true;
  try {
    const survey = new SurveyModel(json);
    const panel = new VisualizationPanel(survey.getAllQuestions(), data);
    const container = document.createElement("div");
    panel.render(container);
    expect(container.querySelectorAll(".sa-commercial").length).toBe(0);
    expect(container.querySelectorAll(".sa-embedded-banner-host").length).toBe(0);
    panel.destroy();
  } finally {
    VisualizerBase.haveCommercialLicense = false;
  }
});

test("Standalone PivotModel shows the embedded card after the content", () => {
  setEmbeddedMarker(true);
  const survey = new SurveyModel(json);
  const pivot = new PivotModel(survey.getAllQuestions(), data);
  const container = document.createElement("div");
  pivot.render(container);
  expect(container.querySelectorAll(".sa-commercial").length).toBe(0);
  expect(getHostChildClasses(container)).toEqual(["sa-visualizer-wrapper", "sa-embedded-banner-host"]);
  pivot.destroy();
});
