import { createRequire } from "node:module";
import { vi } from "vitest";

process.env.TZ = "UTC";

const originalToLocaleDateString = Date.prototype.toLocaleDateString;
Date.prototype.toLocaleDateString = function(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string {
  const normalizedLocales = locales === undefined || locales === "default" ? "en-US" : locales;
  return originalToLocaleDateString.call(this, normalizedLocales, options);
};

const originalToLocaleString = Date.prototype.toLocaleString;
Date.prototype.toLocaleString = function(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string {
  const normalizedLocales = locales === undefined || locales === "default" ? "en-US" : locales;
  return originalToLocaleString.call(this, normalizedLocales, options);
};

const require = createRequire(import.meta.url);

(globalThis as any).jest = {
  ...vi,
  requireActual: (moduleName: string) => require(moduleName),
};

if(typeof window !== "undefined") {
  await import("vitest-canvas-mock");
}
