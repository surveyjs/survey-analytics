import Default from "./sjs-design-tokens/default-light";
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

function getRGBaColor(colorValue: string): string {
  if (!colorValue) return null;
  if (colorValue.indexOf("rgba") === 0) {
    return colorValue;
  }

  const canvasElement = document.createElement("canvas") as HTMLCanvasElement;
  if (!canvasElement) return null;
  var ctx = canvasElement.getContext("2d");
  ctx.fillStyle = colorValue;

  if (ctx.fillStyle == "#000000") {
    ctx.fillStyle = colorValue;
  }
  const newStr = ctx.fillStyle;

  const regex = /color\s*\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/i;
  const match = newStr.match(regex);

  if (!match) {
    if (newStr.indexOf("rgba") === 0) {
      return newStr;
    }
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newStr);
    return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, 1)` : null;
  }

  const r = parseFloat(match[1]);
  const g = parseFloat(match[2]);
  const b = parseFloat(match[3]);
  const alpha = match[4] ? parseFloat(match[4]) : 1;

  const r255 = Math.round(r * 255);
  const g255 = Math.round(g * 255);
  const b255 = Math.round(b * 255);

  return `rgba(${r255}, ${g255}, ${b255}, ${alpha})`;
}

export class DashboardTheme implements IDashboardTheme {
  static barGap = 0.05;
  static fontFamily = "'Open Sans', 'Segoe UI', SegoeUI, Arial, sans-serif";
  private _cssStyleDeclaration;
  private _computedValuesCache: { [key: string]: string } = {};

  private getCssVariableValue(propertyName: string, checkIsNumber = false) {
    let value = undefined;
    if (this._computedValuesCache[propertyName]) {
      value = this._computedValuesCache[propertyName];
    } else if(!!this._cssStyleDeclaration) {
      value = this._cssStyleDeclaration.getPropertyValue(propertyName);
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

    Object.keys(this.cssVariables).forEach(key => {
      let value;
      if (key.indexOf("palette") !== -1 || key.indexOf("color") !== -1) {
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

  constructor(private theme: IDashboardTheme = Default) {
    this.setTheme(theme);
  }

  public applyThemeToElement(element: HTMLElement): void {
    if(!element) return;

    if(!this.theme) {
      element.removeAttribute("style");
      this._cssStyleDeclaration = undefined;
      return;
    }

    DocumentHelper.setStyles(element, this.cssVariables);
    if (!!getComputedStyle) {
      this._cssStyleDeclaration = getComputedStyle(element);
    }
    this.initComputedValuesCache(element);
  }

  public setTheme(theme: IDashboardTheme): void {
    this.theme = theme;
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
    return this.getCssVariableValue("--sjs2-typography-font-family-default") || DashboardTheme.fontFamily;
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
    return this.getCssVariableValue("--sjs2-color-bg-brand-secondary-dim");
  }

  public isFontLoaded(fontFaceName: string) {
    return !fontFaceName || !document || !document.fonts || document.fonts.check("1em " + fontFaceName);
  }

  public isAxisLabelFontLoaded() {
    return this.isFontLoaded(this.axisLabelFont?.family);
  }

  public get axisLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-data-grid-fg-label"),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue("--sjs2-typography-font-size-small", true),
      weight: 400
    };
  }

  public get insideLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-data-chart-fg-on-color-1"),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue("--sjs2-typography-font-size-small", true),
      weight: 600
    };
  }

  public get legendLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-fg-basic-primary"),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue("--sjs2-typography-font-size-small", true),
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
      size: this.getCssVariableValue("--sjs2-typography-font-size-small", true),
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
      size: this.getCssVariableValue("--sjs2-typography-font-size-large", true),
      weight: 600
    };
  }

  public get gaugeTickFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-data-grid-fg-label"),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue("--sjs2-typography-font-size-small", true),
      weight: 400
    };
  }

  public get radarLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.getCssVariableValue("--sjs2-color-fg-basic-primary"),
      family: this.defaultFontFamily,
      size: this.getCssVariableValue("--sjs2-typography-font-size-small", true),
      weight: 400
    };
  }

}