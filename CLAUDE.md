# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is **SurveyJS Dashboard** (`survey-analytics`) — the result-visualization / reporting layer for SurveyJS. It takes a survey definition plus an array of response objects and renders charts, tables, word clouds, and aggregated statistics. It is a sibling repo of [survey-library](../survey-library): clone it next to `survey-library` under the same parent folder, because the `survey-core` dependency is wired by relative path.

## Repository layout

Unlike survey-library/survey-creator, this is a **single package** (not a monorepo). Source is under `src/`, build output goes to `build/`.

- `src/` — all TypeScript and SCSS.
- `src/entries/` — the bundle entry points (public API surfaces): `summary.ts`, `summary.core.ts` (visualizers without the heavy chart deps), `tabulator.ts` / `tabulator-es.ts` / `tabulator-umd.ts` (the data-table add-on), `mongo.ts` (server-side aggregation).
- `tests/` — Vitest unit tests; `e2e/` — Playwright specs with screenshot snapshots; `examples/` — runnable demo pages.

### Dependency on survey-core

`package.json` declares `"survey-core": "../survey-library/packages/survey-core/build"`, so `npm install` copies survey-core from that **local build folder**. **survey-core must be built in the survey-library repo before installing/building here**, and after changing survey-core you must rebuild it there and re-install (or refresh) the copy. Key third-party runtime deps: **plotly.js-dist-min** (the default chart engine), **tabulator-tables** (data tables), **muuri** (drag/resize dashboard grid layout), **mongodb** (server-side aggregation).

## Build

```bash
npm run build          # full build: build:dev + build:prod (UMD) + rollup -c (esm) + build:types
npm run build:all      # alias for build
npm run build:dev      # UMD dev bundle, emits non-source files + styles
npm run build:prod     # UMD prod bundle
npm run watch:dev      # rollup -w for development
```

`build:types` runs several `tsc` passes (`tsconfig.summary*.json`, `tsconfig.tabulator.json`, `tsconfig.types.mongo.json`) and appends the matching entry re-export to each `.d.ts`. Styles are SCSS (`src/*.scss`, e.g. `visualizerBase.scss`, `nps.scss`, `statistics-table.scss`).

## Lint

```bash
npm run lint           # eslint, --ext .js,.cjs,.mjs,.ts,.cts,.mts --max-warnings=0
npm run lint:fix
```

Zero warnings enforced (`eslint-plugin-surveyjs`). `lint-staged` runs `eslint --fix` on commit, commit messages follow Conventional Commits, and the husky `pre-push` hook runs `npm run lint`.

## Tests

### Unit tests (Vitest + jsdom)

```bash
npm run test                      # all unit tests (vitest run)
npm run test:dev                  # watch mode
npm run test:debug                # --inspect-brk, no parallelism
npx vitest run tests/<file>.test.ts
npx vitest run -t "test name"
```

Config in `vitest.config.ts`: jsdom environment, `globals: true`, `vitest-canvas-mock` for chart canvases, and `svgbundle`/`icons`/`*.html`/`*.svg` aliased to an empty module so asset imports don't break tests. **The `tests/mongo/**` suite runs in a Node environment** (`environmentMatchGlobs`) and uses `mongodb-memory-server`.

### E2E / VRT (Playwright)

```bash
npm run e2e:ci                    # playwright test --project chromium
npm run e2e                       # interactive UI mode
npm run e2e:ci -- --grep "TestName"
```

`playwright.config.ts` starts its own web server (`npm run start` → http-server on `http://localhost:8080`) — don't pre-start one. Specs in `e2e/` carry `*-snapshots/` directories for visual regression.

## Architecture

The pipeline is: **a question type → a visualizer that knows how to aggregate and render its answers**, with a panel composing many visualizers into a dashboard.

### Visualizer registry (`VisualizationManager`)
`src/visualizationManager.ts` is the central registry. Visualizers register themselves for one or more question types via `VisualizationManager.registerVisualizer(questionType, constructor)` (and a few `registerPipeVisualizer`/alternatives). `src/visualizerFactory.ts` looks up and instantiates the right visualizer for a given question. To support a new question type or chart, you write a visualizer class and register it here.

### `VisualizerBase` and concrete visualizers
`src/visualizerBase.ts` (`VisualizerBase`, implements `IDataInfo`) is the base class: it holds the question, the answer data, the toolbar/footer actions, the current chart "type" selection, and the render lifecycle. Concrete visualizers extend it:

- `selectBase.ts` — radiogroup/checkbox/dropdown → bar / pie / scatter / line (rendered through `plotly/`).
- `histogram.ts`, `number.ts`, `boolean.ts`, `ranking.ts`, `nps.ts` — numeric/boolean/ranking/NPS aggregations.
- `matrix.ts`, `visualizationMatrixDynamic.ts`, `visualizationMatrixDropdown.ts`, `matrixDropdownGrouped.ts` — matrix question families.
- `wordcloud/`, `text.ts` — free-text answers (word cloud or a table of responses).
- `pivot.ts`, `visualizationComposite.ts` — cross-tabulation and composite layouts.

### Dashboard panel (`VisualizationPanel`)
`src/visualizationPanel.ts` (`VisualizationPanel`) is the top-level dashboard: it builds a visualizer per visible question, manages per-element state (chart type, visibility, filtering), and arranges them via `layoutEngine.ts` (a **muuri**-backed grid that supports drag-to-reorder and resize). `visualizationPanelDynamic.ts` handles `paneldynamic` questions.

### Data & filtering
`src/dataProvider.ts` (`DataProvider`) wraps the raw response array, applies cross-visualizer filtering (a click on one chart filters the others), and notifies visualizers to re-render. `src/filterInfo.ts` carries the active filter criteria; `src/statisticCalculators.ts` computes the aggregate numbers.

### Rendering back-ends
- `src/plotly/` — wrappers over plotly.js; this is the default chart renderer. `alternativeVizualizersWrapper.ts` lets a single question expose multiple chart choices.
- `src/tables/` — the data-table view: `table.ts` is the base, `tabulator.ts` integrates **tabulator-tables**, `columnbuilder.ts`/`columns.ts` build the columns, `extensions/` adds features. Shipped as a separate `tabulator` bundle.

### Server-side aggregation (`src/mongo/`)
`mongo/` builds MongoDB aggregation **pipelines** (`pipelines.ts`) so large datasets can be summarized in the database instead of the browser; `result-transformers.ts` maps the DB output back into the shape visualizers expect. This bundle (`entries/mongo.ts`) runs in Node, not the browser.

### Localization
`src/localizationManager.ts` plus `src/analytics-localization/` hold this package's own string table (independent of survey-core's localization).
