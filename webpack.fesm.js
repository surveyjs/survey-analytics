"use strict";
const webpackCommonConfigCreator = require("./webpack.config");
const { merge } = require("webpack-merge");

function getConfig(options) {
  const buildPath = __dirname + "/build/fesm/";
  const config = {
    mode: "production",
    devtool: "source-map",
    output: {
      filename: "[name]" + ".js",
      path: buildPath,
      library: {
        type: "module"
      }
    },
    experiments: {
      outputModule: true,
    },
    optimization: {
      minimize: false
    },
    externalsType: "module",
    externals: {
      "survey-core": "survey-core",
      "plotly.js-dist-min": "plotly.js-dist-min",
      "tabulator-tables": "tabulator-tables"
    }
  };

  return config;
}

module.exports = function (options) {
  options.tsConfigFile = "tsconfig.fesm.json";
  const config = webpackCommonConfigCreator(options);
  config.output = {};
  config.externals = {};
  delete config.mode;
  return merge(config, getConfig(options));
};