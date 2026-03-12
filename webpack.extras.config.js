"use strict";

const path = require("path");
const webpackCommonConfig = require("./webpack.config");

const extrasEntry = {
  "survey.analytics.plotly": path.resolve(__dirname, "./src/entries/plotly"),
  "survey.analytics.plotly.fontless": path.resolve(__dirname, "./src/entries/plotly.fontless"),
  "survey.analytics.tabulator": path.resolve(__dirname, "./src/entries/tabulator-umd"),
  "survey.analytics.tabulator.fontless": path.resolve(__dirname, "./src/entries/tabulator.fontless"),
  "survey.analytics.mongo": path.resolve(__dirname, "./src/entries/mongo"),
};

const externals = {
  "survey-core": {
    root: "Survey",
    commonjs2: "survey-core",
    commonjs: "survey-core",
    amd: "survey-core",
  },
  "plotly.js-dist-min": {
    root: "Plotly",
    commonjs2: "plotly.js-dist-min",
    commonjs: "plotly.js-dist-min",
    amd: "plotly.js-dist-min",
  },
  "tabulator-tables": {
    root: "Tabulator",
    commonjs2: "tabulator-tables",
    commonjs: "tabulator-tables",
    amd: "tabulator-tables",
  },
  "mongodb": {
    root: "MongoDB",
    commonjs2: "mongodb",
    commonjs: "mongodb",
    amd: "mongodb",
  },
}

module.exports = function (options) {
  const mainConfig = webpackCommonConfig(options);
  mainConfig.entry = extrasEntry;
  mainConfig.externals = externals;
  return mainConfig;
};
