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

if(typeof window !== "undefined") {
  await import("vitest-canvas-mock");
}
