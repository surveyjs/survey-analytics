import { ensureBaseThemeStyles, ITheme, getRGBaColor } from "survey-core";
import { DefaultLight } from "survey-core/themes";
import { DocumentHelper } from "./utils/documentHelper";
import { mergeObjects } from "./utils/utils";

export interface FontSettings {
  family: string;
  color: string;
  size: string;
  weight: number;
}

const cssVariableMap = {
  defaultFontFamily: "--sjs2-typography-font-family-text",
  backgroundColor: "--sjs2-color-bg-basic-primary",
  axisGridColor: "--sjs2-color-data-grid-border-line",
  axisBorderColor: "--sjs2-color-data-grid-border-axis",
  modebarActiveColor: "--sjs2-color-fg-brand-primary",
  modebarColor: "--sjs2-color-bg-brand-secondary-dim",
  axisLabelColor: "--sjs2-color-data-grid-fg-label",
  smallFontSize: "--sjs2-typography-font-size-small",
  insideLabelColor: "--sjs2-color-data-chart-fg-on-color-1",
  primaryFontColor: "--sjs2-color-fg-basic-primary",
  legendBorderWidth: "--sjs2-border-width-default",
  legendBorderColor: "--sjs2-color-border-basic-secondary",
  legendBorderRadius: "--sjs2-radius-x250",
  tooltipBackground: "--sjs2-color-bg-neutral-primary",
  tooltipFontColor: "--sjs2-color-fg-neutral-on-primary",
  secondaryFontColor: "--sjs2-color-fg-basic-secondary",
  defaultFontSize: "--sjs2-typography-font-size-default",
  gaugeBackground: "--sjs2-color-bg-basic-secondary",
  largeFontSize: "--sjs2-typography-font-size-large"
} as const;

const chartColorCssVariableKeys = Array.from(
  { length: 10 },
  (_, index) => `--sjs2-color-data-chart-bg-color-${index + 1}`
);

const cssVariableKeys = Object.keys(cssVariableMap) as Array<keyof typeof cssVariableMap>;
const usedCssVariableKeys: string[] = [
  ...cssVariableKeys.map(key => cssVariableMap[key]),
  ...chartColorCssVariableKeys
];

export class DashboardTheme implements ITheme {
  static barGap = 0.05;
  static fontFamily = "'Open Sans', 'Segoe UI', SegoeUI, Arial, sans-serif";
  private _cssStyleDeclaration;
  private _computedValuesCache: { [key: string]: string } = {};
  private _appliedCssVariableKeys: string[] = [];

  private getCssVariableValue(propertyName: string, checkIsNumber = false) {
    let value = undefined;
    if(this._computedValuesCache[propertyName]) {
      value = this._computedValuesCache[propertyName];
    } else if(!!this._cssStyleDeclaration) {
      value = this._cssStyleDeclaration.getPropertyValue(propertyName);
    } else {
      value = this.cssVariables[propertyName];
    }

    if(checkIsNumber) {
      const numValue = parseFloat(value);
      if(isNaN(numValue)) {
        return undefined;
      }
    }
    return value;
  }

  private initComputedValuesCache(rootElement: HTMLElement) {
    const tempElement = document.createElement("div");
    tempElement.style.position = "absolute";
    tempElement.style.visibility = "hidden";
    tempElement.style.top = "0";
    tempElement.style.left = "0";
    rootElement.appendChild(tempElement);

    usedCssVariableKeys.forEach(key => {
      let value;
      if(key.indexOf("palette") !== -1 || key.indexOf("color") !== -1) {
        tempElement.style.setProperty("color", `var(${key})`);
        const computedStyle = getComputedStyle(tempElement);
        value = computedStyle.getPropertyValue("color");
        value = getRGBaColor(value);
      } else if(key.indexOf("font-family") === -1 && key.indexOf("opacity") === -1 && key.indexOf("scale") === -1) {
        tempElement.style.setProperty("width", `var(${key})`);
        const computedStyle = getComputedStyle(tempElement);
        value = computedStyle.getPropertyValue("width");
      } else {
        value = this._cssStyleDeclaration.getPropertyValue(key);
      }
      this._computedValuesCache[key] = value;
    });
    rootElement.removeChild(tempElement);
  }

  constructor(private theme?: ITheme) {
    this.setTheme(theme);
  }

  public applyThemeToElement(element: HTMLElement): void {
    if(!element) return;
    this.removeThemeStylesFromElement(element);

    if(!this.theme) {
      this._cssStyleDeclaration = undefined;
      return;
    }

    element.classList.add("sd-theme-root");
    ensureBaseThemeStyles(element);
    DocumentHelper.setStyles(element, this.cssVariables);
    this._appliedCssVariableKeys = Object.keys(this.cssVariables);
    if(!!getComputedStyle) {
      this._cssStyleDeclaration = getComputedStyle(element);
    }
    this.initComputedValuesCache(element);
  }

  private removeThemeStylesFromElement(element: HTMLElement): void {
    if(this._appliedCssVariableKeys.length) {
      DocumentHelper.removeStyles(element, this._appliedCssVariableKeys);
      this._appliedCssVariableKeys = [];
    }
  }

  public setTheme(theme?: ITheme): void {
    this.theme = mergeObjects({}, DefaultLight, theme);
    this._computedValuesCache = {};
    // const calculater = DocumentHelper.createElement("div");
    // document.body.appendChild(calculater);
    // this.applyThemeToElement(calculater);
    // calculater.remove();
  }

  public get cssVariables(): { [index: string]: string | any } {
    return this.theme.cssVariables;
  }

  public get defaultFontFamily() {
    return this.getCssVariableValue(cssVariableMap.defaultFontFamily) || DashboardTheme.fontFamily;
  }

  public get backgroundColor(): string {
    return this.getCssVariableValue(cssVariableMap.backgroundColor);
  }

  public get axisGridColor(): string {
    return this.getCssVariableValue(cssVariableMap.axisGridColor);
  }

  public get axisBorderColor(): string {
    return this.getCssVariableValue(cssVariableMap.axisBorderColor);
  }

  public get modebarActiveColor(): string {
    return this.getCssVariableValue(cssVariableMap.modebarActiveColor);
  }

  public get modebarColor(): string {
    return this.getCssVariableValue(cssVariableMap.modebarColor);
  }

  public isFontLoaded(fontFaceName: string) {
    return !fontFaceName || !document || !document.fonts || document.fonts.check("1em " + fontFaceName);
  }

  public isAxisLabelFontLoaded() {
    return this.isFontLoaded(this.axisLabelFont?.family);
  }

  public get axisLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue(cssVariableMap.axisLabelColor),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue(cssVariableMap.smallFontSize, true),
      weight: 400
    };
  }

  public get axisTitleFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue(cssVariableMap.axisLabelColor),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue(cssVariableMap.smallFontSize, true),
      weight: 400
    };
  }

  public get insideLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue(cssVariableMap.insideLabelColor),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue(cssVariableMap.smallFontSize, true),
      weight: 600
    };
  }

  public get legendLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue(cssVariableMap.primaryFontColor),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue(cssVariableMap.smallFontSize, true),
      weight: 400
    };
  }

  public get legendSetting() {
    return {
      borderWidth: this.getCssVariableValue(cssVariableMap.legendBorderWidth),
      borderColor: this.getCssVariableValue(cssVariableMap.legendBorderColor),
      borderRadius: this.getCssVariableValue(cssVariableMap.legendBorderRadius),
    };
  }

  public get tooltipBackground() {
    return this.getCssVariableValue(cssVariableMap.tooltipBackground);
  }

  public get tooltipFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue(cssVariableMap.tooltipFontColor),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue(cssVariableMap.smallFontSize, true),
      weight: 400
    };
  }

  public get noDataFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue(cssVariableMap.secondaryFontColor),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue(cssVariableMap.defaultFontSize, true),
      weight: 400
    };
  }

  public get gaugeBackground() {
    return this.getCssVariableValue(cssVariableMap.gaugeBackground);
  }
  public get gaugeBarColor() {
    return this.getCssVariableValue(cssVariableMap.modebarActiveColor);
  }

  public get gaugeValueFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue(cssVariableMap.primaryFontColor),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue(cssVariableMap.largeFontSize, true),
      weight: 600
    };
  }

  public get gaugeTickFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue(cssVariableMap.axisLabelColor),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue(cssVariableMap.smallFontSize, true),
      weight: 400
    };
  }

  public get chartColors(): string[] {
    const colors: string[] = [];
    chartColorCssVariableKeys.forEach(key => {
      const color = this.getCssVariableValue(key);
      if(color) {
        colors.push(color);
      }
    });
    return colors;
  }

  public get radarLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue(cssVariableMap.primaryFontColor),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue(cssVariableMap.smallFontSize, true),
      weight: 400
    };
  }

}