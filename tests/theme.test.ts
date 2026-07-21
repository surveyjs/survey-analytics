import { BaseTheme } from "survey-core";
import { DashboardTheme } from "../src/theme";

const BARE_SJS2_REFERENCE = /var\(\s*--sjs2-[\w-]+\s*\)/;

test("theme values referencing base variables are expanded into fallback chains", () => {
  const theme = new DashboardTheme({
    cssVariables: {
      "--sjs2-color-data-chart-bg-color-1": "var(--sjs2-color-bg-brand-primary)"
    }
  } as any);
  const value = theme.cssVariables["--sjs2-color-data-chart-bg-color-1"];
  expect(value.startsWith("var(--sjs2-color-bg-brand-primary,")).toBeTruthy();
  // the chain ends in literal defaults - no bare reference is left unresolved
  expect(BARE_SJS2_REFERENCE.test(value)).toBeFalsy();
});

test("literal theme values stay untouched", () => {
  const theme = new DashboardTheme({
    cssVariables: {
      "--sjs2-color-data-chart-bg-color-1": "#FF0000"
    }
  } as any);
  expect(theme.cssVariables["--sjs2-color-data-chart-bg-color-1"]).toBe("#FF0000");
});

test("applyThemeToElement applies expanded values as inline styles", () => {
  const element = document.createElement("div");
  document.body.appendChild(element);
  try {
    const theme = new DashboardTheme({
      cssVariables: {
        "--sjs2-color-data-chart-bg-color-1": "var(--sjs2-color-bg-brand-primary)"
      }
    } as any);
    theme.applyThemeToElement(element);
    const inlineValue = element.style.getPropertyValue("--sjs2-color-data-chart-bg-color-1");
    expect(inlineValue.startsWith("var(--sjs2-color-bg-brand-primary,")).toBeTruthy();
    expect(BARE_SJS2_REFERENCE.test(inlineValue)).toBeFalsy();
  } finally {
    element.remove();
  }
});

test("defaultFontFamily falls back to the base theme default when the variable is not declared", () => {
  const element = document.createElement("div");
  document.body.appendChild(element);
  try {
    const theme = new DashboardTheme({ cssVariables: {} } as any);
    theme.applyThemeToElement(element);
    expect(theme.defaultFontFamily).toBe(BaseTheme.cssVariables["--sjs2-typography-font-family-text"]);
  } finally {
    element.remove();
  }
});
