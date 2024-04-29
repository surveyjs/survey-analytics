"use strict";

var webpack = require("webpack");
var path = require("path");
var fs = require("fs");
var rimraf = require("rimraf");
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

var svgStoreUtils = require(path.resolve(
  __dirname,
  "./node_modules/webpack-svgstore-plugin/src/helpers/utils.js"
));

const today = new Date();
const year = today.getFullYear();

var banner = [
  "surveyjs - SurveyJS Dashboard library v" + packageJson.version,
  "Copyright (c) 2015-" + year + " Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

function copyFileWithBanner(source, destination, banner) {
  var writeStream = fs.createWriteStream(destination)
  writeStream.write("/*\n" + banner + "*/\n\n");
  fs.createReadStream(source).pipe(writeStream);
}

module.exports = function (options) {
  var packagePath = __dirname + "/packages/";
  var isProductionBuild = options.buildType === "prod";

  function createSVGBundle() {
    var options = {
      fileName: path.resolve(__dirname, "./src/svgbundle.html"),
      template: path.resolve(__dirname, "./svgbundle.pug"),
      svgoOptions: {
        plugins: [{ removeTitle: true }],
      },
      prefix: "sa-svg-",
    };

    svgStoreUtils.filesMap(path.join("./src/images/**/*.svg"), (files) => {
      const fileContent = svgStoreUtils.createSprite(
        svgStoreUtils.parseFiles(files, options),
        options.template
      );
      fs.writeFileSync(options.fileName, fileContent);
    });
  }

  var percentage_handler = function handler(percentage, msg) {
    if (0 === percentage) {
      console.log("Build started... good luck!");
      createSVGBundle();
    } else if (1 === percentage) {
      if (options.buildType === "prod") {
        fs.createReadStream("./LICENSE").pipe(
          fs.createWriteStream(packagePath + "LICENSE")
        );
        fs.createReadStream("./README.md").pipe(
          fs.createWriteStream(packagePath + "README.md")
        );
        delete packageJson.dependencies["survey-core"];
        if(!packageJson.peerDependencies) packageJson.peerDependencies = {};
        packageJson.peerDependencies["survey-core"] = packageJson.version
        fs.writeFileSync(
          packagePath + "package.json",
          JSON.stringify(packageJson, null, 2),
          "utf8"
        );
      }
    }
  };

  var config = {
    mode: isProductionBuild ? "production" : "development",
    entry: {
      "survey.analytics.datatables": path.resolve(
        __dirname,
        "./src/entries/datatables"
      ),
      "survey.analytics.tabulator": path.resolve(
        __dirname,
        "./src/entries/tabulator"
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
          use: {
            loader: "ts-loader",
          },
        },
        {
          test: /\.scss$/,
          loader: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                sourceMap: !isProductionBuild,
              },
            },
            {
              loader: "sass-loader",
              options: {
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
          test: /\.(svg|png)$/,
          use: {
            loader: "url-loader",
            options: {},
          },
        },
      ],
    },
    output: {
      path: packagePath,
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
      wordcloud: {
        root: "WordCloud",
        commonjs2: "wordcloud",
        commonjs: "wordcloud",
        amd: "wordcloud",
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
      new webpack.WatchIgnorePlugin([/svgbundle\.html/]),
      new webpack.ProgressPlugin(percentage_handler),
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
    devtool: "inline-source-map",
  };

  if (isProductionBuild) {
    config.devtool = false;
    config.plugins = config.plugins.concat([]);
  } else {
    config.devtool = "inline-source-map";
    config.plugins = config.plugins.concat([
      new webpack.LoaderOptionsPlugin({ debug: true }),
    ]);
  }

  return config;
};
