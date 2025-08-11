import { dsbLightTheme } from "sjs-design-tokens";
import { DocumentHelper } from "./utils";

export const LegacyDashboardTheme = {
  // Font settings
  fontFamily: "'Open Sans', 'Segoe UI', SegoeUI, Arial, sans-serif",

  // Tooltip settings
  tooltipFontColor: "rgba(0, 0, 0, 0.9)",
  tooltipFontSize: 14,
  tooltipFontWeight: 600,
  tooltipBgcolor: "#FFF",
  tooltipBordercolor: "rgba(0, 0, 0, 0.10)",

  // Pie title font settings
  pieTitleFontColor: "rgba(0, 0, 0, 0.90)",
  pieTitleFontSize: 14,
  pieTitleFontWeight: 400,

  // Gauge settings
  gaugeBgcolor: "#F5F5F5",
  gaugeBordercolor: "#F5F5F5",
  gaugeBarColor: "#19B394",
  gaugeBarThickness: 0.5,

  // Gauge value font settings
  gaugeValueFontColor: "rgba(0, 0, 0, 0.90)",
  gaugeValueFontSize: 32,
  gaugeValueFontWeight: 700,

  // Gauge tick font settings
  gaugeTickFontColor: "rgba(0, 0, 0, 0.90)",
  gaugeTickFontSize: 14,
  gaugeTickFontWeight: 400
};

export interface IDashboardTheme {
  cssVariables?: { [index: string]: string | any };
}

export interface FontSettings {
  family: string;
  color: string;
  size: string;
  weight: number;
}

export class DashboardTheme implements IDashboardTheme {
  static barGap = 0.05;
  private _cssStyleDeclaration;

  private getCssVariableValue(propertyName: string) {
    if(!!this._cssStyleDeclaration) {
      return this._cssStyleDeclaration.getPropertyValue(propertyName);
    }
  }

  constructor(private theme: IDashboardTheme = dsbLightTheme) {
    this.setTheme(theme);
  }

  public applyThemeToElement(element: HTMLElement): void {
    if(!element || !this.theme) return;

    DocumentHelper.setStyles(element, this.cssVariables);
    if (!!getComputedStyle) {
      this._cssStyleDeclaration = getComputedStyle(element);
    }
  }

  public setTheme(theme: IDashboardTheme): void {
    this.theme = theme;
    // const calculater = DocumentHelper.createElement("div");
    // document.body.appendChild(calculater);
    // this.applyThemeToElement(calculater);
    // calculater.remove();
  }

  public get cssVariables(): { [index: string]: string | any } {
    return this.theme.cssVariables;
  }

  public get backgroundColor(): string {
    return this.getCssVariableValue("--sjs2-color-bg-basic-primary");
  }

  public get axisGridColor(): string {
    return this.getCssVariableValue("--sjs2-color-data-grid-border-line");
  }

  public get modebarActiveColor(): string {
    return this.getCssVariableValue("--sjs2-color-fg-brand-primary");
  }

  public get modebarColor(): string {
    return this.getCssVariableValue("--sjs2-color-fg-brand");
  }

  public get axisLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-data-grid-fg-label"),
      family: this.getCssVariableValue("--sjs2-font-family-semantic-default"),
      size: this.getCssVariableValue("--sjs2-font-size-semantic-small"),
      weight: 400
    };
  }

  public get insideLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-data-chart-fg-on-color-1"),
      family: this.getCssVariableValue("--sjs2-font-family-semantic-default"),
      size: this.getCssVariableValue("--sjs2-font-size-semantic-small"),
      weight: 600
    };
  }

  public get legendLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-fg-basic-primary"),
      family: this.getCssVariableValue("--sjs2-font-family-semantic-default"),
      size: this.getCssVariableValue("--sjs2-font-size-semantic-small"),
      weight: 400
    };
  }

  public get legendSetting() {
    return {
      borderWidth: this.getCssVariableValue("--sjs2-border-width-default"),
      borderColor: this.getCssVariableValue("--sjs2-color-border-basic-secondary"),
      borderRadius: this.getCssVariableValue("--sjs2-radius-x250"),
      background: this.getCssVariableValue("--sjs2-color-bg-basic-primary"),
    };
  }

}