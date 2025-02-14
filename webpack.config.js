"use strict";

var webpack = require("webpack");
var path = require("path");
var fs = require("fs");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

var packageJson = require("./package.json");

function PascalCaseNamePlugin(options) { }

PascalCaseNamePlugin.prototype.apply = function (compiler) {
  const REGEXP_NAME = /\[pc-name\]/gi,
    REGEXP_ID = /\[id\]/gi;

  compiler.hooks.compilation.tap("PascalCaseNamePlugin", (compilation) => {
    const mainTemplate = compilation.mainTemplate;

    mainTemplate.hooks.assetPath.tap("PascalCaseNamePlugin", (path, data) => {
      const chunk = data.chunk;
      const chunkName = chunk && (chunk.name || chunk.id);

      if (typeof path === "function") {
        path = path(data);
      }

      return path.replace(REGEXP_NAME, (match, ...args) => {
        var components = chunkName.split(".");
        components = components.map(function (componentName) {
          if (componentName === "summary") {
            return "";
          }
          return componentName[0].toUpperCase() + componentName.slice(1);
        });
        return components.join("");
      });
    });
  });
};

const today = new Date();
const year = today.getFullYear();

var banner = [
  "surveyjs - SurveyJS Dashboard library v" + packageJson.version,
  "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

function getPercentageHandler(emitNonSourceFiles, buildPath) {
  return function (percentage, msg) {
    if (0 === percentage) {
      console.log("Build started... good luck!");
    } else if (1 === percentage) {
      if (emitNonSourceFiles) {
        fs.createReadStream("./LICENSE").pipe(
          fs.createWriteStream(buildPath + "LICENSE")
        );
        fs.createReadStream("./README.md").pipe(
          fs.createWriteStream(buildPath + "README.md")
        );
        delete packageJson.dependencies["survey-core"];
        if (!packageJson.peerDependencies) packageJson.peerDependencies = {};
        packageJson.peerDependencies["survey-core"] = packageJson.version
        packageJson.exports = {
          ".": {
            "types": "./survey.analytics.d.ts",
            "import": "./fesm/survey.analytics.js",
            "require": "./survey.analytics.js"
          },
          "./*.css": "./*.css",
          "./survey.analytics.tabulator": {
            "types": "./survey.analytics.tabulator.d.ts",
            "import": "./fesm/survey.analytics.tabulator.js",
            "require": "./survey.analytics.tabulator.js"
          },
        }
        packageJson.module = "fesm/survey.analytics.js";
        fs.writeFileSync(
          buildPath + "package.json",
          JSON.stringify(packageJson, null, 2),
          "utf8"
        );
      }
    }
  };
}


module.exports = function (options) {
  const buildPath = __dirname + "/build/";
  const isProductionBuild = options.buildType === "prod";
  const emitNonSourceFiles = !!options.emitNonSourceFiles;
  const emitStyles = !!options.emitStyles;
  const config = {
    mode: isProductionBuild ? "production" : "development",
    entry: {
      "survey.analytics.tabulator": path.resolve(
        __dirname,
        "./src/entries/tabulator-umd"
      ),
      "survey.analytics": path.resolve(__dirname, "./src/entries/summary"),
    },
    resolve: {
      extensions: [".ts", ".js"],
      alias: {
        tslib: path.join(__dirname, "./src/utils/helpers.ts"),
      },
    },
    optimization: {
      minimize: isProductionBuild,
    },
    module: {
      rules: [
        {
          test: /\.(ts)$/,
          loader: "ts-loader",
          options: {
            configFile: options.tsConfigFile || "tsconfig.json",
          }
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                emit: emitStyles,
              }
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: !isProductionBuild,
              },
            },
            {
              loader: "sass-loader",
              options: {
                api: "modern",
                sourceMap: !isProductionBuild,
              },
            },
          ],
        },
        {
          test: /\.html$/,
          loader: "html-loader",
        },
        {
          test: /\.svg$/,
          loader: "svg-inline-loader",
        },
      ],
    },
    output: {
      path: buildPath,
      filename: "[name]" + (options.buildType === "prod" ? ".min" : "") + ".js",
      library: "[pc-name]",
      libraryTarget: "umd",
      umdNamedDefine: true,
      globalObject: 'this'
    },
    externals: {
      jquery: {
        root: "jQuery",
        commonjs2: "jquery",
        commonjs: "jquery",
        amd: "jquery",
      },
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
    },
    plugins: [
      new PascalCaseNamePlugin(),
      new webpack.WatchIgnorePlugin({ paths: [/svgbundle\.html/] }),
      new webpack.ProgressPlugin(getPercentageHandler(emitNonSourceFiles, buildPath)),
      new webpack.DefinePlugin({
        "process.env.ENVIRONMENT": JSON.stringify(options.buildType),
        "process.env.VERSION": JSON.stringify(packageJson.version),
      }),
      new MiniCssExtractPlugin({
        filename: isProductionBuild ? "[name].min.css" : "[name].css",
      }),
      new webpack.BannerPlugin({
        banner: banner,
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, '.'),
      },
    },
  };

  if (isProductionBuild) {
    config.devtool = false;
    config.plugins = config.plugins.concat([]);
  } else {
    config.devtool = "source-map";
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true }),
    ]);
  }

  return config;
};
