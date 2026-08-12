import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "svgbundle",
        replacement: path.resolve(__dirname, "tests/empty-module.js"),
      },
      {
        find: "icons",
        replacement: path.resolve(__dirname, "tests/empty-module.js"),
      },
    ],
  },
  test: {
    globals: true,
    fileParallelism: false,
    css: false,
    env: {
      TZ: "UTC",
    },
    environment: "jsdom",
    environmentMatchGlobs: [["tests/mongo/**", "node"]],
    alias: [
      {
        find: /^.*\.(css|scss|html|svg)$/,
        replacement: path.resolve(__dirname, "tests/empty-module.js"),
      },
    ],
    include: [
      "tests/*.{test,spec}.{ts,tsx}",
      "tests/tables/*.{test,spec}.{ts,tsx}",
      "tests/mongo/*.{test,spec}.{ts,tsx}",
    ],
    setupFiles: ["./tests/vitest.setup.ts"],
    reporters: ["default", "junit"],
    outputFile: {
      junit: "./junit.xml",
    },
    coverage: {
      enabled: false,
      provider: "istanbul",
      reporter: ["json", "lcov", "text", "html", "text-summary", "cobertura"],
      reportsDirectory: "./coverage",
    },
  },
});
