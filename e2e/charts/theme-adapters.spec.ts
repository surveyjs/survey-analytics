import { readdirSync } from "fs";
import { resolve } from "path";
import { test, expect } from "@playwright/test";

// https://github.com/surveyjs/survey-analytics/issues/884
// Theme adapters ship with survey-core as plain CSS: they map a host design system's variables
// (Bootstrap, MUI, shadcn/ui, Tailwind CSS) onto the --sjs2-* tokens the Dashboard reads.
const adaptersDir = resolve(__dirname, "../../node_modules/survey-core/themes/adapters");
const adapters = readdirSync(adaptersDir)
  .filter(file => file.endsWith(".css") && !file.endsWith(".min.css"))
  .map(file => file.replace(/\.css$/, ""));

// Host variables an app built on each design system defines. shadcn/ui and Tailwind CSS v4 use
// oklch() colors, which the chart engines cannot parse, so they also cover the color conversion.
const hosts: Array<{ prefix: string, css: string, background: string, foreground: string }> = [
  {
    prefix: "bootstrap",
    background: "#fff8e1", foreground: "#3b1d0f",
    css: ":root { --bs-body-bg: #fff8e1; --bs-body-color: #3b1d0f; --bs-primary: #d63384; --bs-primary-rgb: 214, 51, 132; --bs-border-color: #c8a2c8; --bs-border-width: 1px; --bs-border-radius: 0.375rem; --bs-font-sans-serif: Georgia, serif; }"
  },
  {
    prefix: "mui",
    background: "#fff8e1", foreground: "#3b1d0f",
    css: ":root { --mui-palette-background-default: #fff8e1; --mui-palette-background-paper: #fff8e1; --mui-palette-text-primary: #3b1d0f; --mui-palette-primary-main: #9c27b0; }"
  },
  {
    prefix: "shadcn",
    background: "oklch(0.97 0.02 90)", foreground: "oklch(0.25 0.05 30)",
    css: ":root { --background: oklch(0.97 0.02 90); --foreground: oklch(0.25 0.05 30); --card: oklch(0.97 0.02 90); --card-foreground: oklch(0.25 0.05 30); --primary: oklch(0.55 0.2 300); --primary-foreground: oklch(0.98 0 0); --border: oklch(0.8 0.03 90); --input: oklch(0.8 0.03 90); --radius: 0.5rem; --spacing: 0.25rem; }"
  },
  {
    prefix: "tailwind",
    background: "oklch(0.97 0.02 90)", foreground: "oklch(0.25 0.05 30)",
    css: ":root { --color-card: oklch(0.97 0.02 90); --color-foreground: oklch(0.25 0.05 30); --color-primary: oklch(0.55 0.2 300); --color-border: oklch(0.8 0.03 90); }"
  },
];

test.describe("Theme adapters", () => {
  test("every adapter has host values for the test", () => {
    expect(adapters.length).toBeGreaterThan(0);
    adapters.forEach(adapter => expect(hosts.some(h => adapter.startsWith(h.prefix)), adapter).toBeTruthy());
  });

  for(const adapter of adapters) {
    test(`Dashboard follows the ${adapter} adapter`, async ({ page }) => {
      const host = hosts.filter(h => adapter.startsWith(h.prefix))[0];
      expect(host, `no host variables for ${adapter}`).toBeTruthy();

      const errors: Array<string> = [];
      page.on("pageerror", error => errors.push(error.message));

      // The Dashboard resolves theme values when it renders, so the adapter has to be in place before the page script runs.
      await page.route("**/summary.html", async route => {
        const response = await route.fetch();
        const html = (await response.text()).replace("</head>",
          `<link rel="stylesheet" href="/node_modules/survey-core/themes/adapters/${adapter}.css" /><style>${host.css}</style></head>`);
        await route.fulfill({ response, body: html });
      });
      await page.goto("summary.html");
      await expect(page.locator(".sa-visualizer__content").first()).toBeVisible();

      const result = await page.evaluate(([background, foreground]) => {
        // Resolves any CSS color to sRGB through a canvas pixel.
        const toRgba = (color: string) => {
          const ctx = document.createElement("canvas").getContext("2d")!;
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 1, 1);
          const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
          return `rgba(${r}, ${g}, ${b}, 1)`;
        };
        const panel = (window as any).visPanel;
        return {
          rootClasses: Array.from(panel.renderResult.classList),
          background: panel.theme.backgroundColor,
          foreground: panel.theme.legendLabelFont.color,
          expectedBackground: toRgba(background),
          expectedForeground: toRgba(foreground),
        };
      }, [host.background, host.foreground]);

      expect(result.rootClasses).toEqual(expect.arrayContaining(["sd-theme-root", "sjs-theme-overrides"]));
      expect(result.background).toBe(result.expectedBackground);
      expect(result.foreground).toBe(result.expectedForeground);
      expect(errors).toEqual([]);
    });
  }
});
