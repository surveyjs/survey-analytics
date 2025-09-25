module.exports = {
  testEnvironment: "jsdom",
  // testEnvironment: "node",
  reporters: [
    "default",
    ["jest-junit", {
      "suiteNameTemplate": "{filepath}",
      "outputDirectory": ".",
      "outputName": "junit.xml"
    }]
  ],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "html", "text-summary", "cobertura"],
  roots: ["tests"],
  transform: {
    "^.+\\.(ts|tsx)?$": ["ts-jest", {
      diagnostics: false,
      tsconfig: "tsconfig.test.json"
    }],
  },
  moduleNameMapper: {
    "svgbundle": "<rootDir>/tests/empty-module.js",
    "\\.(css|scss|html)$": "<rootDir>/tests/empty-module.js"
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ['<rootDir>/jest.config.js', 'jest-canvas-mock'], //see https://github.com/hustcc/jest-canvas-mock/issues/2
};
