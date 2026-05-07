const path = require("path");
const typescript = require("@rollup/plugin-typescript");
const nodeResolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");

const {
  toBool,
  createIconsPlugin,
  createRemoveScssImportsPlugin,
  createTabulatorUmdCastCompatPlugin,
  createMinifyChunkPlugin,
  createPostBuildAssetsPlugin
} = require("./rollup.umd.plugins");

const packageJson = require("./package.json");

const rootDir = __dirname;
const buildDir = path.join(rootDir, "build");
const packageJsonPath = path.join(rootDir, "package.json");

const external = ["survey-core", "plotly.js-dist-min", "tabulator-tables", "mongodb"];
const globals = {
  "survey-core": "Survey",
  "plotly.js-dist-min": "Plotly",
  "tabulator-tables": "Tabulator",
  mongodb: "MongoDB"
};

const umdEntries = [
  {
    key: "survey.analytics",
    input: path.join(rootDir, "src", "entries", "summary.ts"),
    cssFiles: [
      path.join(rootDir, "src", "visualizerBase.scss"),
      path.join(rootDir, "src", "visualizationPanel.scss"),
      path.join(rootDir, "src", "text.scss"),
      path.join(rootDir, "src", "statistics-table.scss"),
      path.join(rootDir, "src", "nps.scss"),
      path.join(rootDir, "src", "utils", "utils.scss")
    ]
  },
  {
    key: "survey.analytics.core",
    input: path.join(rootDir, "src", "entries", "summary.core.ts"),
    cssFiles: [
      path.join(rootDir, "src", "visualizerBase.scss"),
      path.join(rootDir, "src", "visualizationPanel.scss"),
      path.join(rootDir, "src", "text.scss"),
      path.join(rootDir, "src", "statistics-table.scss"),
      path.join(rootDir, "src", "nps.scss"),
      path.join(rootDir, "src", "utils", "utils.scss")
    ]
  },
  {
    key: "survey.analytics.tabulator",
    input: path.join(rootDir, "src", "entries", "tabulator-umd.ts"),
    cssFiles: [
      path.join(rootDir, "src", "tables", "tabulator.scss"),
      path.join(rootDir, "src", "utils", "utils.scss")
    ]
  },
  {
    key: "survey.analytics.mongo",
    input: path.join(rootDir, "src", "entries", "mongo.ts"),
    cssFiles: []
  }
];

function toUmdName(key) {
  return key
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

module.exports = (commandLineArgs) => {
  const mode = (commandLineArgs.mode || process.env.mode || process.env.MODE || "dev").toLowerCase();
  const isProduction = mode === "prod";
  const emitStyles = toBool(commandLineArgs.emitStyles || process.env.emitStyles || process.env.EMITSTYLES, false);
  const emitNonSourceFiles = toBool(commandLineArgs.emitNonSourceFiles || process.env.emitNonSourceFiles || process.env.EMITNONSOURCEFILES, false);

  const year = new Date().getFullYear();
  const banner = [
    "surveyjs - SurveyJS Dashboard library v" + packageJson.version,
    "Copyright (c) 2015-" + year + " Devsoft Baltic O\u00dc  - http://surveyjs.io/",
    "License: SEE LICENSE IN LICENSE"
  ].join("\n");
  const bannerComment = "/*!\n" + banner + "\n*/";

  return umdEntries.map((entry) => {
    const plugins = [
      createTabulatorUmdCastCompatPlugin(rootDir),
      createIconsPlugin(rootDir),
      createRemoveScssImportsPlugin(),
      nodeResolve(),
      commonjs(),
      typescript({
        inlineSources: !isProduction,
        sourceMap: !isProduction,
        tsconfig: path.join(rootDir, "tsconfig.json"),
        compilerOptions: {
          declaration: false,
          declarationDir: null
        }
      }),
      replace({
        preventAssignment: false,
        values: {
          "process.env.ENVIRONMENT": JSON.stringify(mode),
          "process.env.VERSION": JSON.stringify(packageJson.version)
        }
      })
    ];

    const minifyPlugin = createMinifyChunkPlugin({ isProduction });
    if(minifyPlugin) {
      plugins.push(minifyPlugin);
    }

    plugins.push(
      createPostBuildAssetsPlugin({
        rootDir,
        buildDir,
        packageJsonPath,
        entry,
        isProduction,
        emitStyles,
        emitNonSourceFiles
      })
    );

    return {
      input: entry.input,
      context: "this",
      external,
      plugins,
      output: {
        file: path.join(buildDir, entry.key + (isProduction ? ".min" : "") + ".js"),
        format: "umd",
        name: toUmdName(entry.key),
        globals,
        exports: "named",
        sourcemap: !isProduction,
        banner: bannerComment
      }
    };
  });
};
