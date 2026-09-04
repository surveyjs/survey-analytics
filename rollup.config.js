const path = require("path");
const packageJson = require("./package.json");
const { createIconsPlugin, createRemoveScssImportsPlugin, createCssPlugin, createNonSourceFilesPlugin } = require("./rollup.umd.plugins");

const src = (...p) => path.resolve(__dirname, "src", ...p);
const entry = (file) => path.resolve(__dirname, "src", "entries", file);

const external = ["survey-core", "plotly.js-dist-min", "tabulator-tables", "apexcharts", "chart.js", "mongodb"];
const globals = {
  "survey-core": "Survey",
  "plotly.js-dist-min": "Plotly",
  "tabulator-tables": "Tabulator",
  apexcharts: "ApexCharts",
  "chart.js": "Chart",
  mongodb: "MongoDB"
};

const sharedScss = [
  src("typography-mixins.scss"),
  src("visualizerBase.scss"),
  src("visualizationPanel.scss"),
  src("card.scss"),
  src("text.scss"),
  src("statistics-table.scss"),
  src("nps.scss"),
  src("utils", "dateRangeWidget.scss"),
  src("utils", "dropdown.scss"),
  src("utils", "editableSeriesListWidget.scss"),
  src("utils", "sidebar.scss"),
  src("utils", "toggle.scss"),
  src("utils", "utils.scss"),
];

const entries = [
  { key: "survey.analytics",            globalName: "SurveyAnalytics",           inputFile: entry("chartjs.ts"),       cssFiles: [...sharedScss, src("chartjs", "styles.scss")],    emitFontlessAlias: true,  external, globals },
  { key: "survey.analytics.core",       globalName: "SurveyAnalyticsCore",       inputFile: entry("summary.core.ts"),  cssFiles: sharedScss,                                                                  external, globals },
  { key: "survey.analytics.mongo",      globalName: "SurveyAnalyticsMongo",      inputFile: entry("mongo.ts"),         cssFiles: [],                                                                          external, globals },
  { key: "survey.analytics.tabulator",  globalName: "SurveyAnalyticsTabulator",  inputFile: { umd: entry("tabulator-umd.ts"), es: entry("tabulator-es.ts") },  cssFiles: [src("tables", "table.scss"), src("tables", "tabulator.scss")],  emitFontlessAlias: true,  external, globals },
  { key: "survey.analytics.apexcharts", globalName: "SurveyAnalyticsApexcharts", inputFile: entry("apexcharts.ts"),    cssFiles: [...sharedScss, src("apexcharts", "styles.scss")], emitFontlessAlias: true,  external, globals },
  { key: "survey.analytics.chartjs",    globalName: "SurveyAnalyticsChartjs",    inputFile: entry("chartjs.ts"),       cssFiles: [...sharedScss, src("chartjs", "styles.scss")],    emitFontlessAlias: true,  external, globals },
  { key: "survey.analytics.plotly",     globalName: "SurveyAnalyticsPlotly",     inputFile: entry("plotly.ts"),        cssFiles: sharedScss,                                        emitFontlessAlias: true,  external, globals },
];

module.exports = async (commandLineArgs) => {
  const args = commandLineArgs ?? {};
  const mode = (args.mode || process.env.mode || process.env.MODE || "").toLowerCase();
  const { createEsmConfig, createUmdConfig } = await import("./rollup.helpers.mjs");

  const sharedPlugins = [
    createIconsPlugin(__dirname),
    createRemoveScssImportsPlugin()
  ];

  if(mode === "dev" || mode === "prod") {
    const isProduction = mode === "prod";
    const buildDir = path.resolve(__dirname, "./build");
    return entries.map(({ key, inputFile, cssFiles, emitFontlessAlias, globalName, external, globals }, index) => {
      const umdEntryName = isProduction ? `${key}.min` : key;
      return createUmdConfig({
        input: { [umdEntryName]: inputFile.umd ?? inputFile },
        globalName,
        external,
        globals,
        dir: buildDir,
        tsconfig: path.resolve(__dirname, "./tsconfig.json"),
        emitMinified: false,
        minified: isProduction,
        version: packageJson.version,
        plugins: [
          ...sharedPlugins,
          ...(cssFiles.length > 0 ? [createCssPlugin({ rootDir: __dirname, buildDir, entry: { key, cssFiles, emitFontlessAlias }, isProduction })] : []),
          ...(isProduction && index === 0 ? [createNonSourceFilesPlugin({ rootDir: __dirname, buildDir, packageJsonPath: path.resolve(__dirname, "./package.json") })] : [])
        ]
      });
    });
  }

  const esmInput = Object.fromEntries(entries.map(({ key, inputFile }) => [key, inputFile.es ?? inputFile]));
  return createEsmConfig({
    input: esmInput,
    external: entries[0].external,
    dir: args.dir || path.resolve(__dirname, "./build/fesm"),
    tsconfig: args.tsconfig || path.resolve(__dirname, "./tsconfig.fesm.json"),
    sharedFileName: "shared.mjs",
    version: packageJson.version,
    plugins: sharedPlugins
  });
};