const typescript = require("@rollup/plugin-typescript");
const nodeResolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const bannerPlugin = require("rollup-plugin-license");

const path = require("path");
const svgLoader = require("svg-inline-loader");
const fg = require("fast-glob");
const readFile = require("fs").readFileSync;
const VERSION = require("./package.json").version;

const banner = [
  "surveyjs - SurveyJS Dashboard library v" + VERSION,
  "Copyright (c) 2015-" + new Date().getFullYear() + " Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

const input = { 
  "survey.analytics": path.resolve(__dirname, "./src/entries/summary.ts"),
  "survey.analytics.tabulator": path.resolve(__dirname, "./src/entries/tabulator-es.ts"),
};
module.exports = (options) => {
  options = options ?? {};
  if(!options.tsconfig) {
    options.tsconfig = path.resolve(__dirname, "./tsconfig.fesm.json");
  }
  if(!options.dir) {
    options.dir = path.resolve(__dirname, "./build/fesm");
  }
  return {
    input,
    context: "this",
    plugins: [
      {
        name: "icons",
        resolveId: (id) => {
          if (id === "icons") {
            return id;
          }
        },
        load: async (id) => {
          if (id === "icons") {
            const icons = {};
            for (const iconPath of await fg.glob(fg.convertPathToPattern(path.resolve(__dirname, "./src/images")) + "/*.svg")) {
              icons[path.basename(iconPath).replace(/\.svg$/, "").toLocaleLowerCase()] = svgLoader.getExtractedSVG(readFile(iconPath).toString());
            }
            return `export default ${JSON.stringify(icons, undefined, "\t")}`;
          }
        }
      },
      {
        name: "remove-scss-imports",
        load: (id) => {
          if(id.match(/\.scss$/)) return "";
        }
      },
      nodeResolve(),
      commonjs(),
      typescript({ inlineSources: true, sourceMap: true, tsconfig: options.tsconfig, compilerOptions: {
        declaration: false,
        declarationDir: null
      } }),
      replace({
        preventAssignment: false,
        values: {
          "process.env.RELEASE_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
          "process.env.VERSION": JSON.stringify(VERSION),
        }
      }),
      bannerPlugin({
        banner: {
          content: banner,
          commentStyle: "ignored",
        }
      })
    ],
    external: [
      "survey-core",
      "plotly.js-dist-min",
      "tabulator-tables"
    ],
    output: [
      {
        preserveModules: false,
        dir: options.dir,
        entryFileNames: "[name].mjs",
        chunkFileNames: (chunkInfo) => {
          if(!chunkInfo.isEntry) {
            return "shared.mjs"
          }
        },
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
    ],
  };
};