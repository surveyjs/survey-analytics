const defaultConfig = require("./rollup.config");
const path = require("path");
const typescript = require("@rollup/plugin-typescript");
const nodeResolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const VERSION = require("./package.json").version;

const fesmInput = { index: path.resolve(__dirname, "./src/themes/index.ts") };

const umdThemeEntries = [
  { name: "index", input: path.resolve(__dirname, "./src/themes/index.ts"), umdName: "SurveyAnalyticsTheme" },
  { name: "default-light", input: path.resolve(__dirname, "./src/themes/default-light.ts"), umdName: "SurveyAnalyticsThemeDefaultLight" },
  { name: "default-dark", input: path.resolve(__dirname, "./src/themes/default-dark.ts"), umdName: "SurveyAnalyticsThemeDefaultDark" },
];

function makeUmdConfig(entry) {
  return {
    input: entry.input,
    context: "this",
    external: ["survey-core"],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        inlineSources: true,
        sourceMap: true,
        tsconfig: path.resolve(__dirname, "./tsconfig.themes.json"),
        compilerOptions: { declaration: false, declarationDir: null }
      }),
      replace({
        preventAssignment: false,
        values: {
          "process.env.VERSION": JSON.stringify(VERSION),
        }
      }),
    ],
    output: {
      file: path.resolve(__dirname, "./build/themes/" + entry.name + ".js"),
      format: "umd",
      name: entry.umdName,
      exports: "named",
      sourcemap: true,
      globals: { "survey-core": "Survey" }
    }
  };
}

module.exports = () => {
  const fesmOptions = {
    dir: path.resolve(__dirname, "./build/fesm/themes"),
    tsconfig: path.resolve(__dirname, "./tsconfig.themes.json")
  };
  const fesmConfig = defaultConfig(fesmOptions);
  fesmConfig.input = fesmInput;

  return [fesmConfig, ...umdThemeEntries.map(makeUmdConfig)];
};
