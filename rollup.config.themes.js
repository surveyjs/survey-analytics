/* eslint-env node */
const path = require("path");
const VERSION = require("./package.json").version;

const fesmInput = { index: path.resolve(__dirname, "./src/themes/index.ts") };

const umdThemeEntries = [
  { name: "index", input: path.resolve(__dirname, "./src/themes/index.ts"), umdName: "SurveyAnalyticsTheme" },
  { name: "default-light", input: path.resolve(__dirname, "./src/themes/default-light.ts"), umdName: "SurveyAnalyticsThemeDefaultLight" },
  { name: "default-dark", input: path.resolve(__dirname, "./src/themes/default-dark.ts"), umdName: "SurveyAnalyticsThemeDefaultDark" },
];

function makeUmdConfig(entry, createUmdConfig) {
  const config = createUmdConfig({
    input: { [entry.name]: entry.input },
    globalName: entry.umdName,
    external: ["survey-core"],
    globals: { "survey-core": "Survey" },
    dir: path.resolve(__dirname, "./build/themes"),
    tsconfig: path.resolve(__dirname, "./tsconfig.themes.json"),
    emitMinified: false,
    version: VERSION
  });
  config.output = config.output.filter(Boolean);
  return config;
}

module.exports = async () => {
  const { createUmdConfig, createEsmConfig } = await import("./rollup.helpers.mjs");
  const fesmConfig = createEsmConfig({
    input: fesmInput,
    external: ["survey-core"],
    dir: path.resolve(__dirname, "./build/fesm/themes"),
    tsconfig: path.resolve(__dirname, "./tsconfig.themes.json"),
    sharedFileName: "shared.mjs",
    version: VERSION
  });

  return [fesmConfig, ...umdThemeEntries.map((entry) => makeUmdConfig(entry, createUmdConfig))];
};
