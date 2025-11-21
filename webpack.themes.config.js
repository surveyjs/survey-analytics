"use strict";

const webpackCommonConfig = require("./webpack.config");
const { merge } = require("webpack-merge");
var path = require("path");

const config = {
  output: {
    path: __dirname + "/build/themes"
  },
  entry: {
    "default-light": path.resolve(__dirname, "./src/themes/default-light.ts"),
    "default-dark": path.resolve(__dirname, "./src/themes/default-dark.ts"),
    "index": path.resolve(__dirname, "./src/themes/index.ts"),
  },
};

function patchEntries(config) {
  Object.keys(config.entry).forEach(key => {
    if (key == "index") return;
    const importEntry = config.entry[key];
    const umdName = key.replace(/([_-]\w|^\w)/g, k => (k[1] ?? k[0]).toUpperCase());
    config.entry[key] = {
      import: importEntry,
      library: {
        type: "umd",
        export: "default",
        umdNamedDefine: true,
        name: {
          root: ["SurveyAnalyticsTheme", umdName],
        },
      }
    };
  });
}

module.exports = function (options) {
  options.platform = "";
  options.libraryName = "SurveyAnalyticsTheme";
  options.tsConfigFile = path.resolve(__dirname, "./tsconfig.themes.json");
  const mainConfig = webpackCommonConfig(options);
  mainConfig.entry = {};
  patchEntries(config);
  return merge(mainConfig, config);
};
