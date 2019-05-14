"use strict";

var webpack = require("webpack");
var path = require("path");
var dts = require("dts-bundle");
var rimraf = require("rimraf");
var GenerateJsonPlugin = require("generate-json-webpack-plugin");
var fs = require("fs");

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var packageJson = require("./package.json");

var banner = [
  "surveyjs - SurveyJS Analytics library v" + packageJson.version,
  "Copyright (c) 2015-2019 Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)"
].join("\n");

// TODO add to dts_bundler
var dts_banner = [
  "Type definitions for SurveyJS Analytics library v" + packageJson.version,
  "Copyright (c) 2015-2019 Devsoft Baltic OÜ  - http://surveyjs.io/",
  "Definitions by: Devsoft Baltic OÜ <https://github.com/surveyjs/>",
  ""
].join("\n");

module.exports = function(options) {
  var packagePath = "./packages/";

  var extractCSS = new ExtractTextPlugin({
    filename:
      packagePath +
      (options.buildType === "prod"
        ? "survey.analytics.min.css"
        : "survey.analytics.css")
  });

  var percentage_handler = function handler(percentage, msg) {
    if (0 === percentage) {
      console.log("Build started... good luck!");
    } else if (1 === percentage) {
      if (options.buildType === "prod") {
        dts.bundle({
          name: "../../survey.analytics",
          main: packagePath + "typings/" + packageJson.typings,
          outputAsModuleFolder: true,
          headerText: dts_banner
        });
        rimraf.sync(packagePath + "typings");
        fs.createReadStream("./README.md").pipe(
          fs.createWriteStream(packagePath + "README.md")
        );
      }
    }
  };

  var config = {
    entry: {},
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        tslib: path.join(__dirname, "./src/utils/helpers.ts")
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts)$/,
          use: {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                declaration: options.buildType === "prod",
                outDir: packagePath + "typings/"
              }
            }
          }
        },
        {
          test: /\.scss$/,
          use: extractCSS.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: true,
                  minimize: options.buildType === "prod",
                  importLoaders: true
                }
              },
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true
                }
              }
            ]
          })
        }
      ]
    },
    output: {
      filename:
        packagePath +
        "[name]" +
        (options.buildType === "prod" ? ".min" : "") +
        ".js",
      library: "SurveyAnalytics",
      libraryTarget: "umd",
      umdNamedDefine: true
    },
    externals: {
      jquery: {
        root: "jQuery",
        commonjs2: "jquery",
        commonjs: "jquery",
        amd: "jquery"
      },
      "survey-core": {
        root: "Survey",
        commonjs2: "Survey",
        commonjs: "Survey",
        amd: "Survey"
      }
    },
    plugins: [
      new webpack.ProgressPlugin(percentage_handler),
      new webpack.DefinePlugin({
        "process.env.ENVIRONMENT": JSON.stringify(options.buildType),
        "process.env.VERSION": JSON.stringify(packageJson.version)
      }),
      new webpack.BannerPlugin({
        banner: banner
      }),
      extractCSS
    ],
    devtool: "inline-source-map"
  };

  if (options.buildType === "prod") {
    config.devtool = false;
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin(),
      new GenerateJsonPlugin(
        packagePath + "package.json",
        packageJson,
        undefined,
        2
      )
    ]);
  }

  if (options.buildType === "dev") {
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true })
    ]);
  }

  config.entry["survey.analytics"] = path.resolve(__dirname, "./src/index");

  return config;
};
