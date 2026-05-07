import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import bannerPlugin from "rollup-plugin-license";
import { resolve } from "node:path";
import { minify } from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";

function getOwnBanner(version) {
  return [
    "surveyjs - SurveyJS Analytics library v" + version,
    "Copyright (c) 2015-" + new Date().getFullYear() + " Devsoft Baltic O\u00DC  - http://surveyjs.io/", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    "License: SEE LICENSE"
  ].join("\n");
}

function wrapBanner(e) {
  return `/*!\n${e.split("\n").map(str => " * " + str).join("\n")}\n */`;
}

export function createUmdConfig(options) {

  const { input, globalName, external, globals, dir, tsconfig, declarationDir, emitMinified, exports, version, plugins = [] } = options;

  const commonOutput = {
    dir: dir,
    format: "umd",
    exports: exports || "named",
    name: globalName,
    globals: globals
  };

  if(Object.keys(input).length > 1) throw Error("umd config accepts only one input");

  return {
    context: "this",
    input,
    external,
    plugins: [
      ...plugins,
      nodeResolve(),
      commonjs(),
      replace({
        preventAssignment: false,
        values: {
          "process.env.RELEASE_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
          "process.env.VERSION": JSON.stringify(version),
        }
      }),
      typescript({
        tsconfig: tsconfig,
        compilerOptions: declarationDir ? {
          inlineSources: true,
          sourceMap: true,
          declaration: true,
          declarationDir: declarationDir
        } : {}
      }),
    ],
    output: [
      {
        ...commonOutput,
        entryFileNames: "[name].js",
        sourcemap: true,
        plugins: [
          bannerPlugin({
            banner: {
              content: getOwnBanner(version),
              commentStyle: "ignored",
            }
          }),
        ]
      },
      emitMinified && {
        ...commonOutput,
        entryFileNames: "[name].min.js",
        sourcemap: false,
        plugins: [
          minify(),
          bannerPlugin({
            banner: {
              content: `For license information please see ${Object.keys(input)[0]}.min.js.LICENSE.txt`,
              commentStyle: "ignored",
            },
            thirdParty: {
              output: {
                file: resolve(dir, `${Object.keys(input)[0]}.min.js.LICENSE.txt`),
                template: (dependencies) => {
                  return wrapBanner(getOwnBanner(version)) + "\n\n" + dependencies.map(e => {
                    return wrapBanner([
                      `${ e.name } v${e.version } | ${ e.homepage }`,
                      `(c) ${ e.author.name } | Released under the ${ e.license } license`
                    ].join("\n"));
                  }).join("\n\n");
                }
              }
            }
          }),
        ],
      }
    ],
  };
}

export function createEsmConfig(options) {

  const { input, external, dir, tsconfig, sharedFileName, version, plugins = [] } = options;

  return {
    context: "this",
    input,
    plugins: [
      ...plugins,
      nodeResolve(),
      commonjs(),
      replace({
        preventAssignment: false,
        values: {
          "process.env.RELEASE_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
          "process.env.VERSION": JSON.stringify(version),
        }
      }),
      typescript({
        tsconfig: tsconfig,
        compilerOptions: {
          declaration: false,
          declarationDir: null,
          "target": "ES6"
        }
      }),
      bannerPlugin({
        banner: {
          content: getOwnBanner(version),
          commentStyle: "ignored",
        }
      })
    ],
    external,
    output: [
      {
        dir,
        entryFileNames: "[name].mjs",
        format: "esm",
        exports: "named",
        sourcemap: true,
        chunkFileNames: (chunkInfo) => {
          if(!chunkInfo.isEntry) {
            return sharedFileName;
          }
        },
      }
    ],
  };
}