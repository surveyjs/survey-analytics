import { defaultDashboardTheme } from "./defaultDashboardTheme";

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

  constructor(private theme: IDashboardTheme = defaultDashboardTheme) {
  }

  public get cssVariables(): { [index: string]: string | any } {
    return this.theme.cssVariables;
  }

  public get backgroundColor(): string {
    return this.cssVariables["--sjs2-color-bg-basic-primary"];
  }

  public get axisGridColor(): string {
    return this.cssVariables["--sjs2-color-data-grid-border-line"];
  }

  public get modebarActiveColor(): string {
    return this.cssVariables["--sjs2-color-fg-brand-primary"];
  }

  public get modebarColor(): string {
    return this.cssVariables["--sjs2-color-fg-brand"];
  }

  public get axisLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.cssVariables["--sjs2-color-data-grid-fg-label"],
      family: this.cssVariables["--sjs2-font-family-semantic-default"],
      size: this.cssVariables["--sjs2-font-size-semantic-small"],
      weight: 400
    };
  }

  public get insideLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.cssVariables["--sjs2-color-data-chart-fg-on-color-1"],
      family: this.cssVariables["--sjs2-font-family-semantic-default"],
      size: this.cssVariables["--sjs2-font-size-semantic-small"],
      weight: 600
    };
  }

  public get legendLabelFont(): FontSettings {
    return <FontSettings>{
      color: this.cssVariables["--sjs2-color-fg-basic-primary"],
      family: this.cssVariables["--sjs2-font-family-semantic-default"],
      size: this.cssVariables["--sjs2-font-size-semantic-small"],
      weight: 400
    };
  }

  public get legendSetting() {
    return {
      borderWidth: this.cssVariables["--sjs2-border-width-default"],
      borderColor: this.cssVariables["--sjs2-color-border-basic-secondary"],
      borderRadius: this.cssVariables["--sjs2-radius-x250"],
      background: this.cssVariables["--sjs2-color-bg-basic-primary"],
    };
  }

}