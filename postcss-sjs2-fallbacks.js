/* eslint-env node */
const { readFileSync } = require("fs");

/**
 * PostCSS plugin: bakes survey-core base-theme defaults into the compiled CSS
 * as nested var() fallback chains, so the runtime does not need to declare
 * ~1500 custom properties on the dashboard root (declared custom properties
 * are inherited by every element and make browser DevTools' Elements > Styles
 * panel very slow).
 *
 *   var(--sjs2-color-fg)
 *     -> var(--sjs2-color-fg, var(--sjs2-palette-gray-900, #161616))
 *
 * - Only bare references without a fallback are touched; all other syntax
 *   (existing fallbacks, calc(), color-mix(), rgba(from ...)) stays untouched.
 * - Fallbacks are nested chains, not flattened literals, so overriding a
 *   variable at ANY level of the token chain (semantic, component, primitive)
 *   still takes effect - a defined variable always beats a fallback.
 * - A bare var(--sjs2-*) reference whose variable has no default in
 *   defaultsPath FAILS THE BUILD: nothing can be baked in, so the reference
 *   would resolve to nothing at runtime. The error lists every such variable
 *   and where it is used. Variables declared as custom properties within the
 *   processed stylesheet itself are exempt - they are guaranteed to exist at
 *   runtime without a baked-in fallback.
 *
 * Options (one of the two is required):
 *   defaults     - a css variable name -> default value map used as the
 *                  single source of defaults.
 *   defaultsPath - path to survey-core's generated base-theme.ts (or a JSON
 *                  file with a cssVariables map) used as the single source of
 *                  defaults.
 *   defaultsSource - human-readable description of where the defaults came
 *                  from, used in error messages (defaults to defaultsPath).
 */
// TEMPORARY exclusion list: --sjs2-* variables that are known to be used
// without a fallback and have no default in base-theme. They do NOT fail the
// build. Remove each entry once the SCSS is fixed (the variable gets a default
// in the base theme or an explicit fallback at the usage site). The goal is an
// empty list.
const KNOWN_VARIABLES_WITHOUT_FALLBACK = [];

function sjs2Fallbacks(opts = {}) {
  const defaults = loadDefaults(opts);
  const defaultsSource = opts.defaultsSource || opts.defaultsPath;
  const BARE_VAR = /var\(\s*(--[\w-]+)\s*\)/g;
  const SJS2_PREFIX = "--sjs2-";
  const cache = Object.create(null);
  // --sjs2-* references that stay without a fallback because the variable has
  // no default in defaultsPath: variable name -> Set of usage locations.
  const variablesWithoutFallback = new Map();
  // --sjs2-* custom properties declared in the stylesheet being processed.
  let localDeclarations = new Set();
  let currentDecl = null;

  // "<name>-reset" variables are declared at runtime (createResetVariablesStyle
  // in survey-core derives them from the computed value of "<name>"), so they
  // intentionally have no build-time default to bake in.
  function isRuntimeDeclared(name) {
    const RESET_SUFFIX = "-reset";
    return name.endsWith(RESET_SUFFIX) && defaults[name.slice(0, -RESET_SUFFIX.length)] !== undefined;
  }

  function reportVariableWithoutFallback(name) {
    if(!name.startsWith(SJS2_PREFIX) || isRuntimeDeclared(name)) return;
    if(localDeclarations.has(name)) return;
    if(KNOWN_VARIABLES_WITHOUT_FALLBACK.indexOf(name) !== -1) return;
    let locations = variablesWithoutFallback.get(name);
    if(!locations) {
      locations = new Set();
      variablesWithoutFallback.set(name, locations);
    }
    if(currentDecl && currentDecl.source && currentDecl.source.start) {
      locations.add(`${currentDecl.source.input.from}:${currentDecl.source.start.line} (${currentDecl.prop})`);
    }
  }

  function expandValue(value, stack) {
    return value.replace(BARE_VAR, (full, name) => {
      if(defaults[name] === undefined) {
        reportVariableWithoutFallback(name);
        return full; // unknown var - no fallback to bake in
      }
      if(stack.has(name)) return full; // cycle
      return `var(${name}, ${expandName(name, stack)})`;
    });
  }

  function expandName(name, stack) {
    if(cache[name] !== undefined) return cache[name];
    const next = new Set(stack);
    next.add(name);
    const result = expandValue(defaults[name], next);
    if(stack.size === 0) cache[name] = result; // cache only full (top-level) expansions
    return result;
  }

  return {
    postcssPlugin: "sjs2-fallbacks",
    // Once (not a Declaration visitor): local custom-property declarations
    // must all be collected before any value is expanded, since a usage can
    // precede the declaration that makes it valid.
    Once(root) {
      localDeclarations = new Set();
      root.walkDecls((decl) => {
        if(decl.prop.startsWith(SJS2_PREFIX)) localDeclarations.add(decl.prop);
      });
      root.walkDecls((decl) => {
        if(decl.value && decl.value.indexOf("var(--sjs2-") !== -1) {
          currentDecl = decl;
          decl.value = expandValue(decl.value, new Set());
          currentDecl = null;
        }
      });
    },
    // Fail the build if any --sjs2-* variable is referenced without a fallback
    // and has no default to bake in: such a reference resolves to nothing at
    // runtime. Fix it by adding the variable to the base theme defaults
    // (defaultsPath) or by writing an explicit fallback in the source SCSS.
    OnceExit() {
      if(variablesWithoutFallback.size === 0) return;
      const details = Array.from(variablesWithoutFallback.keys()).sort().map((name) => {
        const locations = Array.from(variablesWithoutFallback.get(name))
          .map((location) => `\n      used at ${location}`)
          .join("");
        return `  ${name}${locations}`;
      });
      throw new Error(
        `sjs2-fallbacks: ${variablesWithoutFallback.size} --sjs2-* variable(s) are used without a fallback ` +
        `and have no default value in ${defaultsSource}.\n` +
        "Add each variable to the base theme defaults or give the reference an explicit fallback:\n" +
        details.join("\n")
      );
    },
  };
}
sjs2Fallbacks.postcss = true;

function loadDefaults(opts) {
  if(opts.defaults) {
    if(Object.keys(opts.defaults).length === 0) {
      throw new Error(`sjs2-fallbacks: the defaults option is empty (${opts.defaultsSource || "no defaultsSource given"})`);
    }
    return opts.defaults;
  }
  const path = opts.defaultsPath;
  if(!path) throw new Error("sjs2-fallbacks: either the defaults or the defaultsPath option is required");
  const text = readFileSync(path, "utf8");
  // base-theme.ts is auto-generated as "// comment\nexport default { <pure JSON> };"
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if(start === -1 || end === -1) throw new Error(`sjs2-fallbacks: cannot parse defaults from ${path}`);
  const theme = JSON.parse(text.slice(start, end + 1));
  const variables = theme.cssVariables || theme;
  if(!variables || Object.keys(variables).length === 0) {
    throw new Error(`sjs2-fallbacks: no cssVariables found in ${path}`);
  }
  return variables;
}

module.exports = sjs2Fallbacks;
