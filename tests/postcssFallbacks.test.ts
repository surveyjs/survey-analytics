import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import postcss from "postcss";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sjs2Fallbacks = require("../postcss-sjs2-fallbacks");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolveCssVariableDefaultsPath } = require("../rollup.umd.plugins");

let tempDir: string;

function writeDefaults(defaults: { [index: string]: string }): string {
  const filePath = path.join(tempDir, "defaults.json");
  fs.writeFileSync(filePath, JSON.stringify({ cssVariables: defaults }), "utf8");
  return filePath;
}

function run(css: string, defaults: { [index: string]: string }): string {
  return postcss([sjs2Fallbacks({ defaultsPath: writeDefaults(defaults) })])
    .process(css, { from: undefined }).css;
}

beforeAll(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sjs2-fallbacks-"));
});

afterAll(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("bakes defaults into bare references as nested fallback chains", () => {
  const css = ".a { color: var(--sjs2-color-fg); }";
  const result = run(css, {
    "--sjs2-color-fg": "var(--sjs2-palette-gray-900)",
    "--sjs2-palette-gray-900": "#161616",
  });
  expect(result).toBe(".a { color: var(--sjs2-color-fg, var(--sjs2-palette-gray-900, #161616)); }");
});

test("keeps existing fallbacks and non --sjs2 variables untouched", () => {
  const css = ".a { color: var(--sjs2-color-fg, red); background: var(--other-var); }";
  const result = run(css, { "--sjs2-color-fg": "#161616" });
  expect(result).toBe(css);
});

test("expands references inside complex values (calc, shorthand)", () => {
  const css = ".a { padding: calc(var(--sjs2-spacing-x100) * 2) var(--sjs2-spacing-x050); }";
  const result = run(css, {
    "--sjs2-spacing-x100": "8px",
    "--sjs2-spacing-x050": "4px",
  });
  expect(result).toBe(".a { padding: calc(var(--sjs2-spacing-x100, 8px) * 2) var(--sjs2-spacing-x050, 4px); }");
});

test("expands custom property declarations too", () => {
  const css = ".a { --sjs2-local-var: var(--sjs2-color-fg); }";
  const result = run(css, {
    "--sjs2-color-fg": "#161616",
  });
  expect(result).toBe(".a { --sjs2-local-var: var(--sjs2-color-fg, #161616); }");
});

test("locally declared --sjs2 custom properties do not fail the build", () => {
  const css = ".a { color: var(--sjs2-local-var); } .b { --sjs2-local-var: red; }";
  const result = run(css, { "--sjs2-color-fg": "#161616" });
  expect(result).toBe(css);
});

test("a bare --sjs2 reference without a default fails the build", () => {
  const css = ".a { color: var(--sjs2-color-unknown); }";
  expect(() => run(css, { "--sjs2-color-fg": "#161616" }))
    .toThrow(/--sjs2-color-unknown/);
});

test("'-reset' variables declared at runtime do not fail the build", () => {
  const css = ".a { box-shadow: var(--sjs2-border-effect-surface-default-reset); }";
  const result = run(css, { "--sjs2-border-effect-surface-default": "0 0 0 1px #000" });
  expect(result).toBe(css);
});

test("cyclic variable definitions do not hang the build", () => {
  const css = ".a { color: var(--sjs2-color-a); }";
  const result = run(css, {
    "--sjs2-color-a": "var(--sjs2-color-b)",
    "--sjs2-color-b": "var(--sjs2-color-a)",
  });
  expect(result).toBe(".a { color: var(--sjs2-color-a, var(--sjs2-color-b, var(--sjs2-color-a))); }");
});

test("every bare --sjs2 reference in src scss has a base theme default", () => {
  const realDefaultsPath = resolveCssVariableDefaultsPath(path.resolve(__dirname, ".."));
  const text = fs.readFileSync(realDefaultsPath, "utf8");
  const defaults = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)).cssVariables;
  expect(Object.keys(defaults).length).toBeGreaterThan(1000);

  const missing = new Set<string>();
  const walk = (dir: string) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((item) => {
      const itemPath = path.join(dir, item.name);
      if(item.isDirectory()) {
        walk(itemPath);
      } else if(item.name.endsWith(".scss")) {
        const scss = fs.readFileSync(itemPath, "utf8");
        for(const match of scss.matchAll(/var\(\s*(--sjs2-[\w-]+)\s*\)/g)) {
          if(defaults[match[1]] === undefined) {
            missing.add(match[1]);
          }
        }
      }
    });
  };
  walk(path.resolve(__dirname, "..", "src"));
  expect(Array.from(missing).sort()).toEqual([]);
});
