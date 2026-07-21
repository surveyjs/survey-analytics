/* eslint-env node */
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const sass = require("sass");
const fg = require("fast-glob");
const svgLoader = require("svg-inline-loader");
const { minify } = require("terser");
const postcss = require("postcss");
const sjs2Fallbacks = require("./postcss-sjs2-fallbacks");

function toBool(val, fallback = false) {
  if(val === undefined || val === null) {
    return fallback;
  }
  if(typeof val === "boolean") {
    return val;
  }
  return String(val).toLowerCase() === "true";
}

function createIconsPlugin(rootDir) {
  return {
    name: "icons",
    resolveId(id) {
      if(id === "icons") {
        return id;
      }
      return null;
    },
    async load(id) {
      if(id !== "icons") {
        return null;
      }

      const icons = {};
      const iconPattern = fg.convertPathToPattern(path.join(rootDir, "src", "images")) + "/*.svg";
      const iconPaths = await fg.glob(iconPattern);
      iconPaths.forEach((iconPath) => {
        const key = path.basename(iconPath).replace(/\.svg$/, "").toLowerCase();
        icons[key] = svgLoader.getExtractedSVG(fs.readFileSync(iconPath, "utf8"));
      });

      return "export default " + JSON.stringify(icons, null, "\t");
    }
  };
}

function createRemoveScssImportsPlugin() {
  return {
    name: "remove-scss-imports",
    load(id) {
      if(/\.scss$/.test(id)) {
        return "";
      }
      return null;
    }
  };
}

function createTabulatorUmdCastCompatPlugin(rootDir) {
  const tabulatorUmdPath = path.join(rootDir, "src", "entries", "tabulator-umd.ts").replace(/\\/g, "/");
  return {
    name: "tabulator-umd-cast-compat",
    transform(code, id) {
      if(id.replace(/\\/g, "/") !== tabulatorUmdPath) {
        return null;
      }
      return {
        code: code.replace("TabulatorTables as any", "TabulatorTables"),
        map: null
      };
    }
  };
}

function createMinifyChunkPlugin(options) {
  const isProduction = toBool(options && options.isProduction, false);
  if(!isProduction) {
    return null;
  }

  return {
    name: "minify-umd-chunks",
    async renderChunk(code) {
      const minified = await minify(code, {
        format: {
          comments: /^!/,
          ascii_only: true
        }
      });

      if(!minified.code) {
        throw new Error("Terser failed to generate output");
      }

      return {
        code: minified.code,
        map: null
      };
    }
  };
}

// survey-core lands in node_modules either as a linked relative directory
// dependency (local dev: ../survey-library/packages/survey-core/build) or as
// a plain copy of the build artifact (CI), so no sibling source folder with
// base-theme.ts is guaranteed to exist. The build output itself does not ship
// base-theme.ts, but its data is bundled and exported as BaseTheme, so load
// the defaults from the installed package.
function resolveCssVariableDefaults(rootDir) {
  const packagePath = require.resolve("survey-core", { paths: [rootDir] });
  const baseTheme = require(packagePath).BaseTheme;
  const variables = baseTheme && baseTheme.cssVariables;
  if(!variables || Object.keys(variables).length === 0) {
    throw new Error("sjs2-fallbacks: no cssVariables in the BaseTheme export of " + packagePath);
  }
  return variables;
}

function emitCssFile(options) {
  const { rootDir, buildDir, entry, isProduction } = options;
  if(!entry.cssFiles || entry.cssFiles.length === 0) {
    return;
  }

  const scssContent = entry.cssFiles
    .map((cssFile) => {
      const relFromRoot = path.relative(rootDir, cssFile).replace(/\\/g, "/");
      return "@use \"" + relFromRoot + "\";";
    })
    .join("\n");

  const cssOutPath = path.join(buildDir, entry.key + (isProduction ? ".min" : "") + ".css");
  const compileResult = sass.compileString(scssContent, {
    style: isProduction ? "compressed" : "expanded",
    sourceMap: !isProduction,
    loadPaths: [rootDir],
    url: new URL("file://" + rootDir.replace(/\\/g, "/") + "/")
  });

  // Bakes survey-core base-theme defaults into var() fallback chains so the
  // runtime does not need to declare them (keeps DevTools' Styles panel fast).
  const processResult = postcss([
    sjs2Fallbacks({
      defaults: resolveCssVariableDefaults(rootDir),
      defaultsSource: "the BaseTheme export of survey-core"
    })
  ]).process(compileResult.css, {
    from: cssOutPath,
    to: cssOutPath,
    map: compileResult.sourceMap ? { prev: compileResult.sourceMap, inline: false, annotation: false } : false
  });

  fs.writeFileSync(cssOutPath, processResult.css, "utf8");

  if(!isProduction && processResult.map) {
    const mapPath = cssOutPath + ".map";
    fs.writeFileSync(mapPath, processResult.map.toString(), "utf8");
    fs.appendFileSync(cssOutPath, "\n/*# sourceMappingURL=" + path.basename(mapPath) + " */\n", "utf8");
  }
}

function emitNonSourceFiles(options) {
  const { rootDir, buildDir, packageJsonPath } = options;
  fs.copyFileSync(path.join(rootDir, "LICENSE"), path.join(buildDir, "LICENSE"));
  fs.copyFileSync(path.join(rootDir, "README.md"), path.join(buildDir, "README.md"));

  const packageData = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  if(packageData.dependencies && packageData.dependencies["survey-core"]) {
    delete packageData.dependencies["survey-core"];
  }

  if(!packageData.peerDependencies) {
    packageData.peerDependencies = {};
  }

  packageData.peerDependencies["survey-core"] = packageData.version;
  packageData.exports = {
    ".": {
      types: "./survey.analytics.d.ts",
      import: "./fesm/survey.analytics.mjs",
      require: "./survey.analytics.js"
    },
    "./survey.analytics.core": {
      types: "./survey.analytics.core.d.ts",
      import: "./fesm/survey.analytics.core.mjs",
      require: "./survey.analytics.core.js"
    },
    "./survey.analytics.mongo": {
      types: "./survey.analytics.mongo.d.ts",
      import: "./fesm/survey.analytics.mongo.mjs",
      require: "./survey.analytics.mongo.js"
    },
    "./survey.analytics.apexcharts": {
      types: "./survey.analytics.apexcharts.d.ts",
      import: "./fesm/survey.analytics.apexcharts.mjs",
      require: "./survey.analytics.apexcharts.js"
    },
    "./survey.analytics.chartjs": {
      types: "./survey.analytics.chartjs.d.ts",
      import: "./fesm/survey.analytics.chartjs.mjs",
      require: "./survey.analytics.chartjs.js"
    },
    "./survey.analytics.plotly": {
      types: "./survey.analytics.plotly.d.ts",
      import: "./fesm/survey.analytics.plotly.mjs",
      require: "./survey.analytics.plotly.js"
    },
    "./*.css": "./*.css",
    "./survey.analytics.tabulator": {
      types: "./survey.analytics.tabulator.d.ts",
      import: "./fesm/survey.analytics.tabulator.mjs",
      require: "./survey.analytics.tabulator.js"
    }
  };

  packageData.module = "fesm/survey.analytics.mjs";
  packageData.homepage = "https://surveyjs.io/";
  packageData.author = "DevSoft Baltic O\u00dc <info@devsoftbaltic.com>";
  packageData.license = "SEE LICENSE IN LICENSE";
  packageData.licenseUrl = "https://surveyjs.io/licensing";
  packageData.description = "SurveyJS Dashboard is a UI component for visualizing and analyzing survey data. It interprets the form JSON schema to identify question types and renders collected responses using interactive charts and tables.";
  packageData.keywords = [
    "survey",
    "form",
    "surveyjs",
    "dashboard",
    "analytics",
    "data-visualization",
    "charts",
    "tables",
    "survey-results",
    "survey-data",
    "survey-analysis",
    "json",
    "data-analysis",
    "survey-library",
    "reporting",
    "data-management",
    "visualize-survey"
  ];

  fs.writeFileSync(path.join(buildDir, "package.json"), JSON.stringify(packageData, null, 2), "utf8");
}

function createPostBuildAssetsPlugin(options) {
  const rootDir = options.rootDir;
  const buildDir = options.buildDir;
  const packageJsonPath = options.packageJsonPath;
  const entry = options.entry;
  const isProduction = toBool(options.isProduction, false);
  const emitStyles = toBool(options.emitStyles, false);
  const emitPackageFiles = toBool(options.emitNonSourceFiles, false);

  return {
    name: "post-build-assets",
    writeBundle(outputOptions, bundle) {
      if(emitStyles) {
        emitCssFile({ rootDir, buildDir, entry, isProduction });
      }

      if(isProduction) {
        const licenseText = fs.readFileSync(path.join(rootDir, "LICENSE"), "utf8");
        Object.keys(bundle).forEach((fileName) => {
          if(/\.min\.js$/.test(fileName)) {
            const licenseFilePath = path.join(buildDir, fileName + ".LICENSE.txt");
            fs.writeFileSync(licenseFilePath, licenseText, "utf8");
          }
        });
      }

      if(emitPackageFiles) {
        emitNonSourceFiles({ rootDir, buildDir, packageJsonPath });
      }
    }
  };
}

function createNonSourceFilesPlugin(options) {
  const { rootDir, buildDir, packageJsonPath } = options;
  return {
    name: "emit-non-source-files",
    writeBundle() {
      emitNonSourceFiles({ rootDir, buildDir, packageJsonPath });
    }
  };
}

function createCssPlugin(options) {
  const { rootDir, buildDir, entry, isProduction } = options;
  return {
    name: "emit-css",
    writeBundle() {
      emitCssFile({ rootDir, buildDir, entry, isProduction });
      if(entry.fontlessCssFiles && entry.fontlessCssFiles.length > 0) {
        emitCssFile({ rootDir, buildDir, entry: { key: entry.key + ".fontless", cssFiles: entry.fontlessCssFiles }, isProduction });
      }
    }
  };
}

module.exports = {
  toBool,
  resolveCssVariableDefaults,
  createIconsPlugin,
  createRemoveScssImportsPlugin,
  createMinifyChunkPlugin,
  createPostBuildAssetsPlugin,
  createCssPlugin,
  createNonSourceFilesPlugin
};
