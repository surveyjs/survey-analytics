import { dsbLightTheme } from "sjs-design-tokens";
import { DocumentHelper } from "./utils";

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
  static fontFamily = "'Open Sans', 'Segoe UI', SegoeUI, Arial, sans-serif";
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

  public get defaultFontFamily() {
    return this.getCssVariableValue("--sjs2-font-family-semantic-default") || DashboardTheme.fontFamily;
  }

  public get backgroundColor(): string {
    return this.getCssVariableValue("--sjs2-color-bg-basic-primary");
  }

  public get axisGridColor(): string {
    return this.getCssVariableValue("--sjs2-color-data-grid-border-line");
  }

  public get axisBorderColor(): string {
    return this.getCssVariableValue("--sjs2-color-data-grid-border-axis");
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
      family: this.defaultFontFamily,
      size: this.getCssVariableValue("--sjs2-font-size-semantic-small"),
      weight: 400
    };
  }

  public get insideLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-data-chart-fg-on-color-1"),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue("--sjs2-font-size-semantic-small"),
      weight: 600
    };
  }

  public get legendLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-fg-basic-primary"),
      family: this.defaultFontFamily,
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

  public get tooltipBackground() {
    return this.getCssVariableValue("--sjs2-color-bg-neutral-primary");
  }

  public get tooltipFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-fg-neutral-primary"),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue("--sjs2-font-size-semantic-small") || "12px",
      weight: 600
    };
  }

  public get gaugeBackground() {
    return this.getCssVariableValue("--sjs2-color-bg-basic-secondary");
  }
  public get gaugeBarColor() {
    return this.getCssVariableValue("--sjs2-color-fg-brand-primary");
  }

  public get gaugeValueFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-fg-basic-primary"),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue("--sjs2-font-size-semantic-large") || "32px",
      weight: 600
    };
  }

  public get gaugeTickFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-data-grid-fg-label"),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue("--sjs2-font-size-semantic-small") || "16px",
      weight: 400
    };
  }

  public get radarLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-fg-basic-primary"),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue("--sjs2-font-size-semantic-small"),
      weight: 400
    };
  }

}